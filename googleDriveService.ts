import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { APK_RELEASE_BASE64, APK_FILE_NAME, APK_MIME_TYPE } from '../data/apkBase64';

// Updated & Expanded Google Drive OAuth Scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const createFreshProvider = (forceConsent = false) => {
  const p = new GoogleAuthProvider();
  SCOPES.forEach((scope) => p.addScope(scope));
  p.setCustomParameters({
    prompt: forceConsent ? 'consent select_account' : 'select_account',
    access_type: 'offline',
  });
  return p;
};

// In-memory token storage (Do NOT store in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

/**
 * Sign in with Google with full error resilience
 */
export const googleSignInForDrive = async (forceConsent = false): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    if (forceConsent) {
      await signOut(auth).catch(() => {});
      cachedAccessToken = null;
    }

    const provider = createFreshProvider(forceConsent);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google OAuth access token could not be obtained. Please re-try.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Drive Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const driveSignOut = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
}

/**
 * Helper to fetch with timeout so upload never gets stuck
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 25000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Google Drive سرور سے رابطہ ٹائم آؤٹ ہو گیا۔ براہ کرم ڈائریکٹ Base64 ڈاؤنلوڈ بٹن استعمال کریں۔');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};

/**
 * Uploads app-release.apk to the authenticated user's Google Drive
 */
export const uploadApkToGoogleDrive = async (
  onProgressMessage?: (msg: string) => void
): Promise<DriveUploadResult> => {
  if (!cachedAccessToken) {
    throw new Error('NOT_AUTHENTICATED');
  }

  onProgressMessage?.('فائل لوڈ کی جا رہی ہے (Loading APK Binary)...');
  
  let apkBlob: Blob;
  try {
    const apkResponse = await fetchWithTimeout('/app-release.apk', {}, 10000);
    if (apkResponse.ok) {
      apkBlob = await apkResponse.blob();
    } else {
      throw new Error('Fetch failed');
    }
  } catch {
    // Instant fallback to embedded base64 APK binary!
    onProgressMessage?.('ایمبیڈڈ بیس 64 سے بائنری حاصل کی جا رہی ہے...');
    const byteCharacters = atob(APK_RELEASE_BASE64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    apkBlob = new Blob([new Uint8Array(byteNumbers)], { type: APK_MIME_TYPE });
  }

  onProgressMessage?.('گوگل ڈرائیو ملٹی پارٹ ریکویسٹ تیار ہو رہی ہے...');

  // Multipart upload to Google Drive v3
  const metadata = {
    name: APK_FILE_NAME,
    description: 'HMS Home Maintenance System Production Android App (Release Build)',
    mimeType: APK_MIME_TYPE,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `${delimiter}Content-Type: ${APK_MIME_TYPE}\r\n\r\n`;

  const multipartRequestBody = new Blob([
    metadataPart,
    mediaHeader,
    apkBlob,
    closeDelimiter,
  ], { type: `multipart/related; boundary=${boundary}` });

  onProgressMessage?.('گوگل ڈرائیو سرور کو فائل منتقل ہو رہی ہے...');

  const uploadRes = await fetchWithTimeout(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
      },
      body: multipartRequestBody,
    },
    30000
  );

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    const message = errorData?.error?.message || `Google Drive upload failed with status ${uploadRes.status}`;
    throw new Error(message);
  }

  const fileData = await uploadRes.json();
  const fileId = fileData.id;

  onProgressMessage?.('عوامی ڈاؤنلوڈ کی اجازت سیٹ کی جا رہی ہے...');

  try {
    await fetchWithTimeout(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
        allowFileDiscovery: false,
      }),
    }, 10000);
  } catch (permErr) {
    console.warn('Could not set public permission, private link still available:', permErr);
  }

  // Refetch full metadata with public webViewLink & webContentLink
  try {
    const finalRes = await fetchWithTimeout(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink,webContentLink,size`,
      {
        headers: {
          Authorization: `Bearer ${cachedAccessToken}`,
        },
      },
      10000
    );

    if (finalRes.ok) {
      return await finalRes.json();
    }
  } catch {
    // ignore
  }

  return fileData;
};

/**
 * 100% Reliable Offline/Direct Base64 APK Download
 * Never gets stuck, requires zero Google Drive API calls or network access
 */
export const downloadDirectBase64Apk = () => {
  const byteCharacters = atob(APK_RELEASE_BASE64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: APK_MIME_TYPE });
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = APK_FILE_NAME;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  }, 1000);
};

export const getBase64DataUri = (): string => {
  return `data:${APK_MIME_TYPE};base64,${APK_RELEASE_BASE64}`;
};
