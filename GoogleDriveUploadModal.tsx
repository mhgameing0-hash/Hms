import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Share2, 
  Loader2, 
  ShieldCheck,
  HardDrive,
  LogOut,
  Zap,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initDriveAuth, 
  googleSignInForDrive, 
  getDriveAccessToken, 
  driveSignOut, 
  uploadApkToGoogleDrive, 
  DriveUploadResult,
  downloadDirectBase64Apk,
  getBase64DataUri,
  SCOPES 
} from '../services/googleDriveService';
import { playCrystalTap, playSuccessChime } from '../utils/audioEffects';

interface GoogleDriveUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const GoogleDriveUploadModal: React.FC<GoogleDriveUploadModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<DriveUploadResult | null>(() => {
    try {
      const saved = localStorage.getItem('hms_gdrive_apk_result_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (authUser) => {
        setUser(authUser);
        setHasToken(Boolean(getDriveAccessToken()));
      },
      () => {
        setUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async (forceReauth = false) => {
    playCrystalTap(soundEnabled);
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      const res = await googleSignInForDrive(forceReauth);
      setUser(res.user);
      setHasToken(true);
      playSuccessChime(soundEnabled);

      // Seamlessly start upload immediately after sign-in
      setIsUploading(true);
      setUploadProgress('گوگل ڈرائیو سروس شروع ہو رہی ہے...');
      try {
        const result = await uploadApkToGoogleDrive((msg) => {
          setUploadProgress(msg);
        });
        setUploadResult(result);
        try {
          localStorage.setItem('hms_gdrive_apk_result_v1', JSON.stringify(result));
        } catch {
          // ignore
        }
        playSuccessChime(soundEnabled);
      } catch (uploadErr: any) {
        console.error('Auto upload to Drive failed:', uploadErr);
        setErrorMsg(uploadErr?.message || 'گوگل ڈرائیو پر اپلوڈ کے دوران خرابی پیش آئی۔ متبادل Base64 ڈاؤنلوڈ استعمال کریں۔');
      } finally {
        setIsUploading(false);
        setUploadProgress('');
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setErrorMsg(err?.message || 'گوگل سائن ان میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں یا Base64 بٹن استعمال کریں۔');
    } finally {
      setIsSigningIn(false);
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    playCrystalTap(soundEnabled);
    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress('گوگل ڈرائیو سروس شروع ہو رہی ہے...');

    try {
      const result = await uploadApkToGoogleDrive((msg) => {
        setUploadProgress(msg);
      });
      setUploadResult(result);
      try {
        localStorage.setItem('hms_gdrive_apk_result_v1', JSON.stringify(result));
      } catch {
        // ignore
      }
      playSuccessChime(soundEnabled);
    } catch (err: any) {
      console.error('Upload to Drive failed:', err);
      if (err?.message === 'NOT_AUTHENTICATED') {
        setErrorMsg('آپ کا سیشن ختم ہو گیا ہے۔ براہ کرم دوبارہ Sign in with Google کریں۔');
        setHasToken(false);
      } else {
        setErrorMsg(err?.message || 'گوگل ڈرائیو پر اپلوڈ کے دوران خرابی پیش آئی۔ متبادل Base64 بٹن استعمال کریں۔');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleBase64Download = () => {
    playCrystalTap(soundEnabled);
    downloadDirectBase64Apk();
    playSuccessChime(soundEnabled);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    playCrystalTap(soundEnabled);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSignOut = async () => {
    playCrystalTap(soundEnabled);
    await driveSignOut();
    setUser(null);
    setHasToken(false);
  };

  const driveViewUrl = uploadResult?.webViewLink || (uploadResult?.id ? `https://drive.google.com/file/d/${uploadResult.id}/view?usp=sharing` : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#0F172A] to-[#0A0E1A] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#121B2F]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                <Cloud className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Google Drive و Base64 APK ڈاؤنلوڈ</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                  Drive API v3
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                گوگل ڈرائیو پر اپلوڈ کریں یا فوری 1-کلک Base64 APK حاصل کریں
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-xs sm:text-sm">
          
          {/* Direct Base64 Instant Download Box (Unstuck Guarantee) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#172338] to-[#121E30] border-2 border-amber-400/40 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>⚡ فوری 1-کلک Base64 APK ڈاؤنلوڈ (Never Gets Stuck)</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                Zero Network Delay
              </span>
            </div>
            <p className="text-xs text-slate-300">
              اگر گوگل ڈرائیو سرور کسی وجہ سے پھنس جائے یا وقت لے، تو یہ بٹن فوری طور پر فائل سسٹم سے APK ڈاؤنلوڈ کر دیتا ہے۔
            </p>
            <button
              type="button"
              onClick={handleBase64Download}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>براہ راست Base64 APK ڈاؤنلوڈ کریں (19.8 KB)</span>
            </button>
          </div>

          {/* File Card */}
          <div className="p-3.5 rounded-2xl bg-[#141E34] border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">app-release.apk (ریلیز بلڈ)</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>com.hms.homemaintenance</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">19.8 KB (Verified)</span>
                </div>
              </div>
            </div>

            <a
              href="/app-release.apk"
              download="app-release.apk"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              لوکل ڈاؤنلوڈ
            </a>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-white">پیغام (Message):</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Google Drive Auth & Upload Section */}
          <div className="p-4 rounded-2xl bg-[#111A2D] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>گوگل اکاؤنٹ کنکشن و اپلوڈ</span>
              </span>
              {hasToken && user ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>کنیکٹڈ</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-mono">
                  drive.file scope
                </span>
              )}
            </div>

            {hasToken && user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <strong className="block text-xs text-white">{user.displayName || 'گوگل یوزر'}</strong>
                      <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>لاگ آؤٹ</span>
                  </button>
                </div>

                {isUploading ? (
                  <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 text-center space-y-2">
                    <Loader2 className="w-7 h-7 text-emerald-400 animate-spin mx-auto" />
                    <strong className="block text-white text-xs sm:text-sm">اپلوڈ جاری ہے...</strong>
                    <p className="text-[11px] text-emerald-300 font-mono animate-pulse">
                      {uploadProgress || 'فائل منتقل ہو رہی ہے...'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUploading(false);
                        setUploadProgress('');
                      }}
                      className="text-[11px] text-rose-300 underline cursor-pointer"
                    >
                      منسوخ کریں (Cancel)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 active:scale-95 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>گوگل ڈرائیو پر دوبارہ اپلوڈ کریں</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSignIn(true)}
                  className="w-full text-center text-[11px] text-cyan-300 hover:underline flex items-center justify-center gap-1 pt-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>دوبارہ اجازت دیں (Force Re-Authentication)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSignIn(false)}
                  disabled={isSigningIn}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-3 transition cursor-pointer active:scale-95 disabled:opacity-75"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      <span>گوگل اکاؤنٹ کنیکٹ ہو رہا ہے...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span className="font-semibold text-slate-800">Sign in with Google & Upload APK</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSignIn(true)}
                  disabled={isSigningIn}
                  className="w-full text-center text-[11px] text-cyan-300 hover:underline flex items-center justify-center gap-1 pt-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>دوبارہ نیا لاگ ان سیشن شروع کریں (Force Re-Auth)</span>
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: Link Generated Card */}
          {uploadResult && driveViewUrl && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-[#102324] to-[#0A181C] border border-emerald-400/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>آپ کا گوگل ڈرائیو لنک تیار ہے!</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Public Reader Link
                </span>
              </div>

              {/* Link Input Box */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-cyan-300 truncate select-all">
                  {driveViewUrl}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(driveViewUrl)}
                  className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg flex items-center gap-1 shrink-0 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'کاپی ہو گیا' : 'Copy'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={driveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow transition active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>گوگل ڈرائیو میں کھولیں</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const shareText = `HMS Home Maintenance System - Android Release APK ڈاؤنلوڈ کریں:\n${driveViewUrl}`;
                    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>واٹس ایپ پر شیئر کریں</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0B101D] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="font-latin text-[11px]">Google Drive API v3 + Direct Base64</span>
          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="py-1.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl transition"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
