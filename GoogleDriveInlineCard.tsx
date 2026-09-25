import React, { useState, useEffect } from 'react';
import { 
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
  Download,
  FolderArchive,
  Sparkles,
  RefreshCw,
  Zap,
  Terminal,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp
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
  getBase64DataUri
} from '../services/googleDriveService';
import { playCrystalTap, playSuccessChime } from '../utils/audioEffects';

interface GoogleDriveInlineCardProps {
  soundEnabled?: boolean;
}

export const GoogleDriveInlineCard: React.FC<GoogleDriveInlineCardProps> = ({
  soundEnabled = true,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [showGithubGuide, setShowGithubGuide] = useState<boolean>(true);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
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

  const handleSignIn = async (forceReauth = false) => {
    playCrystalTap(soundEnabled);
    setErrorMsg(null);
    setIsSigningIn(true);
    try {
      const res = await googleSignInForDrive(forceReauth);
      setUser(res.user);
      setHasToken(true);
      playSuccessChime(soundEnabled);

      // Automatically start upload right after sign-in
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
        setErrorMsg(uploadErr?.message || 'گوگل ڈرائیو پر اپلوڈ کے دوران خرابی پیش آئی۔ نیچے دی گئی GitHub Repository ZIP ڈاؤنلوڈ کریں۔');
      } finally {
        setIsUploading(false);
        setUploadProgress('');
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setErrorMsg(err?.message || 'گوگل سائن ان میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں یا GitHub Repository ZIP ڈاؤنلوڈ کریں۔');
    } finally {
      setIsSigningIn(false);
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    playCrystalTap(soundEnabled);
    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress('فائل ریڈ کی جا رہی ہے...');

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
        setErrorMsg('آپ کا سیشن ختم ہو گیا ہے۔ براہ کرم "Sign in with Google" پر کلک کریں۔');
        setHasToken(false);
      } else {
        setErrorMsg(err?.message || 'گوگل ڈرائیو پر اپلوڈ کے دوران خرابی پیش آئی۔ نیچے دی گئی GitHub Repository ZIP استعمال کریں۔');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleDirectBase64Download = () => {
    playCrystalTap(soundEnabled);
    try {
      downloadDirectBase64Apk();
      playSuccessChime(soundEnabled);
    } catch (err) {
      console.error('Base64 download error:', err);
    }
  };

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText('flutter pub get && flutter build apk --release');
    setCopiedCmd(true);
    playCrystalTap(soundEnabled);
    setTimeout(() => setCopiedCmd(false), 2000);
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
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#0F1E38] via-[#0A162B] to-[#07101E] border-2 border-cyan-400/50 p-5 sm:p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden space-y-4">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#081324] rounded-[14px] flex items-center justify-center">
              <Cloud className="w-6 h-6 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Google Drive اپلوڈ و GitHub Repository ریلیز سینٹر
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                Flutter 3.19 Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              حقیقی 35MB بائنری کے لیے مکمل GitHub ریپوزٹری ZIP حاصل کریں یا ڈرائیو پر اپلوڈ کریں
            </p>
          </div>
        </div>

        {/* Auth status indicator */}
        <div className="flex items-center gap-2">
          {hasToken && user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px] truncate max-w-[160px]">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="ml-1 text-slate-400 hover:text-rose-300 transition"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-mono">
              Google Drive Ready
            </span>
          )}
        </div>
      </div>

      {/* TOP NOTIFICATION: Problem Parsing the Package Explanation & Solution */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#172338] via-[#111F36] to-[#0D182A] border-2 border-indigo-400/40 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>'There was a problem parsing the package' کی وجہ اور حل:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                  19KB vs 35MB Real APK
                </span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                اینڈرائیڈ آپریٹنگ سسٹم پر 19KB کی فائل اس لیے Parse نہیں ہوتی کیونکہ اصلی اینڈرائیڈ بائنری میں کمپائل شدہ Dalvik بائٹ کوڈ (<code className="text-cyan-300 font-mono">classes.dex</code>) اور بائنری ریسورسز ہوتے ہیں جن کا سائز <strong>25MB سے 40MB</strong> ہوتا ہے۔ چونکہ یہ ویب کلاؤڈ کنٹینر ہے اور یہاں Java/Android SDK نہیں، اس لیے ہم نے <strong>مکمل GitHub Repository ZIP</strong> تیار کر دی ہے جس میں خودکار GitHub Actions بلڈ موجود ہے!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGithubGuide(!showGithubGuide)}
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-medium bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 shrink-0"
          >
            <span>{showGithubGuide ? 'رہنمائی چھپائیں' : 'رہنمائی دیکھیں'}</span>
            {showGithubGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable GitHub Actions & Codespaces Step-by-Step Guide */}
        {showGithubGuide && (
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-3 text-xs animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Method 1: GitHub Actions (Free & 100% Automated) */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-200 flex items-center justify-center text-[11px] font-mono">1</span>
                  <span>طریقہ نمبر 1: گٹ ہب ایکشنز (خودکار 35MB بلڈ)</span>
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>نیچے دیا گیا <strong>`hms-flutter-github-repo.zip`</strong> ڈاؤنلوڈ کریں۔</li>
                  <li>GitHub.com پر نیو ریپوزٹری بنا کر یہ فائلز اپلوڈ کریں۔</li>
                  <li>ریپوزٹری میں شامل <strong>`.github/workflows/build-apk.yml`</strong> خودکار چلے گا۔</li>
                  <li><strong>Actions ٹیب</strong> سے 2 منٹ بعد اصلی <strong>35MB APK</strong> حاصل کریں!</li>
                </ol>
              </div>

              {/* Method 2: GitHub Codespaces or Local Terminal */}
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-200 flex items-center justify-center text-[11px] font-mono">2</span>
                  <span>طریقہ نمبر 2: Codespaces یا لوکل ٹرمینل</span>
                </span>
                <p className="text-[11px] text-slate-300">
                  گٹ ہب Codespaces (مفت کلاؤڈ براؤزر IDE) میں صرف یہ ایک کمانڈ چلائیں:
                </p>
                <div className="p-2 rounded bg-black/80 font-mono text-[11px] text-emerald-300 flex items-center justify-between border border-white/10">
                  <code>flutter build apk --release</code>
                  <button 
                    onClick={handleCopyCmd}
                    className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white flex items-center gap-1"
                  >
                    {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'کاپی ہوا' : 'Copy'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Direct Link to Download the Full GitHub Repository ZIP */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] text-slate-300 font-medium">
                مکمل فلٹر سورس کوڈ، اینڈرائڈ کنفگریشن اور خودکار GitHub Actions بلڈر:
              </span>
              <a
                href="/hms-flutter-github-repo.zip"
                download="hms-flutter-github-repo.zip"
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
              >
                <FolderArchive className="w-4 h-4 text-white" />
                <span>ڈاؤنلوڈ کریں GitHub Repository ZIP (21 KB)</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Direct Download Options */}
        <div className="p-4 rounded-2xl bg-[#0B1527] border border-cyan-500/30 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">ڈاؤنلوڈ پیکیجز برائے اینڈرائڈ</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-300">
                تمام 13 سروسز کا سورس کوڈ، گوگل پلے سٹور بنڈل (.aab) اور مکمل GitHub ریپوزٹری:
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            {/* Primary GitHub Repository ZIP Button */}
            <a
              href="/hms-flutter-github-repo.zip"
              download="hms-flutter-github-repo.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-white" />
              <span>GitHub Repository ZIP (Auto-build 35MB APK)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="/hms-android-release-bundle.zip"
                download="hms-android-release-bundle.zip"
                className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition text-center"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>All-in-One ZIP</span>
              </a>

              <button
                type="button"
                onClick={handleDirectBase64Download}
                className="py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer text-center"
                title="Direct Base64 Data Download"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Base64 Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Google Drive Action Buttons */}
        <div className="p-4 rounded-2xl bg-[#0D182C] border border-cyan-500/30 flex flex-col justify-between gap-3">
          
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>گوگل ڈرائیو کلاؤڈ اپلوڈ (Drive API v3)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                OAuth Consent Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              اپنے گوگل اکاؤنٹ سے کنیکٹ کر کے پبلک شیئرنگ لنک بنائیں۔
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-white">خرابی کا حل:</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {isUploading ? (
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <strong className="block text-white text-sm">گوگل ڈرائیو پر اپلوڈ ہو رہا ہے...</strong>
              <p className="text-xs text-emerald-300 font-mono animate-pulse">
                {uploadProgress || 'فائل منتقل کی جا رہی ہے...'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsUploading(false);
                  setUploadProgress('');
                }}
                className="mt-2 text-[11px] text-rose-300 underline cursor-pointer"
              >
                اگر پھنس گیا ہے تو منسوخ کریں (Cancel & Reset)
              </button>
            </div>
          ) : !hasToken || !user ? (
            <div className="space-y-2">
              {/* Official Google Button */}
              <button
                type="button"
                onClick={() => handleSignIn(false)}
                disabled={isSigningIn}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-3 transition cursor-pointer active:scale-95 disabled:opacity-75 border-2 border-white"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>اکاؤنٹ تصدیق ہو رہا ہے...</span>
                  </>
                ) : (
                  <>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    <span className="text-slate-900 text-sm">Sign in with Google & Upload</span>
                  </>
                )}
              </button>

              {/* Force Re-authentication & Scope Refresh Link */}
              <button
                type="button"
                onClick={() => handleSignIn(true)}
                disabled={isSigningIn}
                className="w-full text-center text-[11px] text-cyan-300 hover:text-cyan-200 underline font-medium flex items-center justify-center gap-1 cursor-pointer py-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>دوبارہ نیا سیشن شروع کریں (Force Re-Authentication)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
              >
                <UploadCloud className="w-5 h-5 text-slate-950" />
                <span>گوگل ڈرائیو پر اپلوڈ کریں</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignIn(true)}
                className="w-full text-center text-[11px] text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>نئے سیشن سے دوبارہ اجازت دیں (Re-prompt Consent)</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Generated Google Drive Public Download Link (if ready) */}
      {uploadResult && driveViewUrl && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0E262B] to-[#0A1E20] border-2 border-emerald-400/50 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Google Drive پبلک ڈاؤنلوڈ لنک تیار ہے!</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Shareable Reader Link
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/60 border border-white/15 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-cyan-300 truncate select-all">
              {driveViewUrl}
            </span>

            <button
              type="button"
              onClick={() => handleCopy(driveViewUrl)}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg flex items-center gap-1 shrink-0 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'کاپی ہو گیا' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={driveViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>گوگل ڈرائیو میں کھولیں</span>
            </a>

            <button
              type="button"
              onClick={() => {
                const shareText = `HMS Android App Release ڈاؤنلوڈ کریں:\n${driveViewUrl}`;
                const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واٹس ایپ پر شیئر کریں</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
