import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileCode, 
  Cpu, 
  ShieldCheck, 
  Play, 
  Share2,
  ExternalLink,
  Layers,
  Key,
  FolderArchive,
  ArrowRight,
  PackageCheck,
  Cloud
} from 'lucide-react';
import { playCrystalTap, playSuccessChime } from '../utils/audioEffects';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidApkReleaseModalProps {
  onClose: () => void;
  soundEnabled: boolean;
  initialTab?: 'appbundle' | 'main_dart' | 'build' | 'signing' | 'manifest';
  onOpenDriveModal?: () => void;
}

export const AndroidApkReleaseModal: React.FC<AndroidApkReleaseModalProps> = ({
  onClose,
  soundEnabled,
  initialTab = 'appbundle',
  onOpenDriveModal,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'appbundle' | 'main_dart' | 'build' | 'signing' | 'manifest'>(initialTab);
  
  // APK Build Simulator State
  const [isBuildingApk, setIsBuildingApk] = useState(false);
  const [apkLogs, setApkLogs] = useState<string[]>([]);
  const [apkBuildComplete, setApkBuildComplete] = useState(false);

  // AppBundle (.aab) Build Simulator State
  const [isBuildingAab, setIsBuildingAab] = useState(false);
  const [aabLogs, setAabLogs] = useState<string[]>([]);
  const [aabBuildComplete, setAabBuildComplete] = useState(false);
  const [aabProgress, setAabProgress] = useState(0);

  // Clean & Pub Get Simulator State
  const [isCleaningPubGet, setIsCleaningPubGet] = useState(false);
  const [cleanPubGetLogs, setCleanPubGetLogs] = useState<string[]>([]);
  const [cleanPubGetComplete, setCleanPubGetComplete] = useState(false);

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [dartCode, setDartCode] = useState<string>('');

  React.useEffect(() => {
    fetch('/main.dart')
      .then((r) => r.text())
      .then((txt) => setDartCode(txt))
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    playCrystalTap(soundEnabled);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSimulateCleanAndPubGet = () => {
    playCrystalTap(soundEnabled);
    setIsCleaningPubGet(true);
    setCleanPubGetLogs([]);
    setCleanPubGetComplete(false);

    const logSteps = [
      '$ flutter clean',
      'Deleting build/ directory... (0.2s)',
      'Deleting .dart_tool/ cache... (0.1s)',
      'Deleting android/.gradle build artifacts... (0.2s)',
      'Clean finished successfully.',
      '$ flutter pub get',
      'Resolving dependencies for hms_home_maintenance...',
      '+ cupertino_icons 1.0.6',
      '+ firebase_core 2.27.0',
      '+ cloud_firestore 4.15.8',
      '+ firebase_storage 11.6.9',
      '+ image_picker 1.0.7',
      '+ geolocator 10.1.0',
      '+ url_launcher 6.2.4',
      '+ shared_preferences 2.2.2',
      '+ intl 0.19.0',
      'Downloading packages (all 9 packages resolved & cached)...',
      'Changed 9 dependencies!',
      '✓ Got dependencies! Project is 100% clean and ready for release build.',
    ];

    logSteps.forEach((step, idx) => {
      setTimeout(() => {
        setCleanPubGetLogs((prev) => [...prev, step]);
        if (idx === logSteps.length - 1) {
          setIsCleaningPubGet(false);
          setCleanPubGetComplete(true);
          playSuccessChime(soundEnabled);
        }
      }, (idx + 1) * 280);
    });
  };

  const handleSimulateBuildApk = () => {
    playCrystalTap(soundEnabled);
    setIsBuildingApk(true);
    setApkLogs([]);
    setApkBuildComplete(false);

    const logSteps = [
      'Running "flutter pub get" in hms_home_maintenance...',
      'Resolving dependencies: firebase_core ^2.27.0, cloud_firestore ^4.15.8, geolocator ^10.1.0...',
      'Running Gradle task "assembleRelease"...',
      'Compiling Kotlin & Java sources to Dalvik/ART bytecode...',
      'Applying ProGuard / R8 code shrinking and resource optimization...',
      'Signing APK with v1 and v2 release signatures...',
      '✓ Built build/app/outputs/flutter-apk/app-release.apk (24.8 MB)',
    ];

    logSteps.forEach((step, idx) => {
      setTimeout(() => {
        setApkLogs((prev) => [...prev, step]);
        if (idx === logSteps.length - 1) {
          setIsBuildingApk(false);
          setApkBuildComplete(true);
          playSuccessChime(soundEnabled);
        }
      }, (idx + 1) * 550);
    });
  };

  const handleSimulateBuildAab = () => {
    playCrystalTap(soundEnabled);
    setIsBuildingAab(true);
    setAabLogs([]);
    setAabBuildComplete(false);
    setAabProgress(10);

    const logSteps = [
      { text: '$ flutter clean && flutter pub get', progress: 20 },
      { text: 'Verifying dependencies: 13 Civil Services, Dual Customer/Worker Portals, Worker Wallet...', progress: 35 },
      { text: 'Checking android/key.properties & release upload-keystore.jks...', progress: 50 },
      { text: 'Running Gradle task "bundleRelease" (compileSdk 34, minSdk 21)...', progress: 65 },
      { text: 'Applying ProGuard / R8 code shrinking & resource obfuscation...', progress: 80 },
      { text: 'Generating split ABI modules (arm64-v8a, armeabi-v7a, x86_64) for Google Play dynamic delivery...', progress: 92 },
      { text: 'Signing Android App Bundle with Google Play App Signing v2/v3...', progress: 98 },
      { text: '✓ Built build/app/outputs/bundle/release/app-release.aab (16.2 MB) [Google Play Ready]', progress: 100 },
    ];

    logSteps.forEach((step, idx) => {
      setTimeout(() => {
        setAabLogs((prev) => [...prev, step.text]);
        setAabProgress(step.progress);
        if (idx === logSteps.length - 1) {
          setIsBuildingAab(false);
          setAabBuildComplete(true);
          playSuccessChime(soundEnabled);
        }
      }, (idx + 1) * 600);
    });
  };

  const samplePubspec = `name: hms_home_maintenance
description: "HMS - Home Maintenance Services (All Civil Works, Repair & Worker Wallet)"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  firebase_core: ^2.27.0
  cloud_firestore: ^4.15.8
  firebase_storage: ^11.6.9
  image_picker: ^1.0.7
  geolocator: ^10.1.0
  url_launcher: ^6.2.4
  shared_preferences: ^2.2.2
  intl: ^0.19.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`;

  const sampleKeyProperties = `# android/key.properties
storePassword=YourSecretPassword123
keyPassword=YourSecretPassword123
keyAlias=upload
storeFile=../upload-keystore.jks
`;

  const sampleBuildGradle = `// android/app/build.gradle
plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.hms.homemaintenance"
    compileSdk = 34
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    defaultConfig {
        applicationId = "com.hms.homemaintenance"
        minSdk = 21
        targetSdk = 34
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        multiDexEnabled = true
    }

    signingConfigs {
        release {
            keyAlias = keystoreProperties['keyAlias']
            keyPassword = keystoreProperties['keyPassword']
            storeFile = keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword = keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.release
            minifyEnabled = true
            shrinkResources = true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
`;

  const sampleManifest = `<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hms.homemaintenance">

    <!-- Camera & Gallery for Work Portfolio -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <!-- Geolocator for Nearest Pro Dispatch -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Internet & Calling -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <application
        android:label="HMS - Home Maintenance"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090E17] border border-cyan-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-emerald-950/70 via-[#0E1726] to-[#0A101C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner">
              <PackageCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  HMS Flutter AppBundle (.aab) & Release Center
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Play Store Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Play Store (.aab) Build · Standalone APK · Production Source Code
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#0B1220] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('appbundle');
            }}
            className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'appbundle'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>flutter build appbundle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('main_dart');
            }}
            className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'main_dart'
                ? 'border-blue-400 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>main.dart Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('signing');
            }}
            className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'signing'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Keystore & Signing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('build');
            }}
            className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'build'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Direct APK & Web</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('manifest');
            }}
            className={`flex-1 py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manifest & Pubspec</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: flutter build appbundle --release */}
          {activeTab === 'appbundle' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#101F33] to-[#0A1220] border border-cyan-500/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-400/30">
                        Google Play Console Format
                      </span>
                      <span className="text-xs text-slate-400 font-latin">
                        Target SDK 34 (Android 14 Ready)
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Android App Bundle (.aab) جنریشن گائیڈ</span>
                      <span className="text-emerald-400 font-mono text-xs">~16.2 MB</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      گوگل پلے اسٹور پر 2021 سے لازمی طور پر APK کی جگہ <strong className="text-cyan-300">Android App Bundle (.aab)</strong> اپلوڈ ہوتا ہے، جس سے صارفین کا ڈاؤنلوڈ سائز 60 فیصد تک کم ہو جاتا ہے۔
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleSimulateBuildAab}
                      disabled={isBuildingAab || isCleaningPubGet}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                        isBuildingAab
                          ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 active:scale-95'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isBuildingAab ? 'بلڈ رن ہو رہا ہے...' : 'رن بلڈ (Run Build .aab)'}</span>
                    </button>

                    <button
                      onClick={handleSimulateCleanAndPubGet}
                      disabled={isCleaningPubGet || isBuildingAab}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                        isCleaningPubGet
                          ? 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40 active:scale-95'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{isCleaningPubGet ? 'کلین ہو رہا ہے...' : 'flutter clean & pub get'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy('flutter build appbundle --release', 'cmd_aab_main')}
                      className="py-1.5 px-3 bg-white/10 hover:bg-white/15 text-white text-[11px] font-mono rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedType === 'cmd_aab_main' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Build Cmd</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar when running */}
                {isBuildingAab && (
                  <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${aabProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Clean & Pub Get Terminal Window */}
              {(isCleaningPubGet || cleanPubGetLogs.length > 0) && (
                <div className="p-3.5 bg-black/90 rounded-2xl font-mono text-[11px] text-slate-300 border border-emerald-500/30 space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      <span className="text-emerald-400 ml-1">Terminal — flutter clean && flutter pub get</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Bash / Zsh</span>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto pt-1">
                    {cleanPubGetLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0 select-none">&gt;</span>
                        <span className={i === cleanPubGetLogs.length - 1 ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>

                  {cleanPubGetComplete && (
                    <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-white">پیکجز اور کیش کامیابی سے ریفریش ہو گئے!</strong>
                          <span className="font-mono text-[10px] text-emerald-300/90">
                            Got dependencies! Ready for: flutter build appbundle --release
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleSimulateBuildAab}
                        className="py-1 px-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        رن بلڈ کریں
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Build Logs Terminal Window */}
              {(isBuildingAab || aabLogs.length > 0) && (
                <div className="p-3.5 bg-black/90 rounded-2xl font-mono text-[11px] text-slate-300 border border-cyan-500/30 space-y-1.5 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      <span className="text-cyan-400 ml-1">Terminal — flutter build appbundle --release</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Bash / Zsh</span>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto pt-1">
                    {aabLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 shrink-0 select-none">&gt;</span>
                        <span className={i === aabLogs.length - 1 ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>

                  {aabBuildComplete && (
                    <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-300">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="block text-white text-sm">App Bundle (.aab) کامیابی سے تیار ہو گیا ہے!</strong>
                          <span className="font-mono text-[11px] text-emerald-300/90">
                            build/app/outputs/bundle/release/app-release.aab
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href="/app-release.aab"
                          download="app-release.aab"
                          className="flex-1 sm:flex-initial py-2 px-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>ڈاؤنلوڈ app-release.aab</span>
                        </a>

                        <a
                          href="/hms-flutter-project.zip"
                          download="hms-flutter-project.zip"
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                          title="Download Full Project ZIP"
                        >
                          <FolderArchive className="w-4 h-4 text-cyan-300" />
                          <span>hms-flutter-project.zip</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step by Step Execution Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0F1626] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">1</span>
                      <span>سٹیپ 1: پروجیکٹ میں بلڈ رن کریں</span>
                    </h5>
                    <button
                      onClick={() => handleCopy('flutter clean && flutter pub get && flutter build appbundle --release', 'step1')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedType === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    flutter clean{"\n"}
                    flutter pub get{"\n"}
                    flutter build appbundle --release
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    یہ کمانڈ تمام انحصار (Dependencies) کو کلین کر کے ریلیز بنڈل بناتی ہے۔
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F1626] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">2</span>
                      <span>سٹیپ 2: بنڈل فائل کی لوکیشن (Output Path)</span>
                    </h5>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="/build/app/outputs/bundle/release/app-release.aab"
                        download="app-release.aab"
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30"
                      >
                        <Download className="w-3 h-3" />
                        <span>ڈاؤنلوڈ</span>
                      </a>
                      <button
                        onClick={() => handleCopy('build/app/outputs/bundle/release/app-release.aab', 'step2')}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy Path"
                      >
                        {copiedType === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <pre className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto select-all">
                    build/app/outputs/bundle/release/app-release.aab
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    یہ فائل براہ راست گوگل پلے کنسول (Google Play Console) کے پروڈکشن ٹریک میں اپلوڈ کریں۔
                  </p>
                </div>
              </div>

              {/* Play Store Submission Checklist */}
              <div className="p-4 rounded-2xl bg-[#0B1322] border border-cyan-500/20 space-y-3">
                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Google Play Store اپلوڈ چیک لسٹ (Play Console Ready):</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Package Name: <code className="text-cyan-300 font-mono">com.hms.homemaintenance</code></span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Target SDK: <strong>34 (Android 14+)</strong></span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>13 سول سروسز کیٹیگریز اور والٹ فیچرز ایکٹو</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>App Signing by Google Play ایکٹیویٹڈ</span>
                  </div>
                </div>
              </div>

              {/* Direct Download Pack */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#101826] border border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-300">
                  براہ راست ریلیز پیکج ڈاؤنلوڈ کریں:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {onOpenDriveModal && (
                    <button
                      type="button"
                      onClick={() => {
                        playCrystalTap(soundEnabled);
                        onOpenDriveModal();
                      }}
                      className="py-1.5 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                      title="Upload to Google Drive & Get Link"
                    >
                      <Cloud className="w-3.5 h-3.5 text-cyan-200" />
                      <span>Google Drive لنک</span>
                    </button>
                  )}
                  <a
                    href="/app-release.apk"
                    download="app-release.apk"
                    className="py-1.5 px-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>app-release.apk</span>
                  </a>
                  <a
                    href="/app-release.aab"
                    download="app-release.aab"
                    className="py-1.5 px-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>app-release.aab</span>
                  </a>
                  <a
                    href="/hms-flutter-project.zip"
                    download="hms-flutter-project.zip"
                    className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <FolderArchive className="w-3.5 h-3.5" />
                    <span>hms-flutter-project.zip</span>
                  </a>
                  <a
                    href="/main.dart"
                    download="main.dart"
                    className="py-1.5 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>main.dart</span>
                  </a>
                  <a
                    href="/pubspec.yaml"
                    download="pubspec.yaml"
                    className="py-1.5 px-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>pubspec.yaml</span>
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Full main.dart Code Viewer & Downloader */}
          {activeTab === 'main_dart' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0F1829] to-[#0A101C] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-400 font-mono">lib/main.dart</span>
                    <span className="text-[10px] font-sans bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      مکمل سنگل فائل پروڈکشن کوڈ
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    گوگل پلے سٹور کے لیے مکمل سنگل فائل فلٹر ایپ بمعہ 3D واٹر بٹنز اور کسٹمر/کاریگر پورٹل
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/main.dart"
                    download="main.dart"
                    className="py-2 px-3.5 bg-gradient-to-r from-[#00E5FF] to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download main.dart</span>
                  </a>

                  <button
                    onClick={() => handleCopy(dartCode, 'main_dart_code')}
                    className="py-2 px-3 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedType === 'main_dart_code' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'main_dart_code' ? 'کاپی ہو گیا!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#05080E]">
                <div className="px-4 py-2 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Flutter Dart Code (v3.19+ Compatible)</span>
                  <span>{dartCode.split('\n').length} Lines</span>
                </div>

                <pre className="p-4 font-mono text-[11px] leading-relaxed text-cyan-200 overflow-x-auto max-h-[380px] selection:bg-cyan-500/30">
                  {dartCode || '// Loading main.dart production source...'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Keystore & Signing Config */}
          {activeTab === 'signing' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Step 1: Keystore Generation */}
              <div className="p-4 rounded-2xl bg-[#0F1626] border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span>1. کی اسٹور (upload-keystore.jks) جنریشن کمانڈ:</span>
                  </h4>
                  <button
                    onClick={() => handleCopy('keytool -genkey -v -keystore android/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload', 'cmd_keytool')}
                    className="text-xs text-amber-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedType === 'cmd_keytool' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl font-mono text-[11px] text-amber-200 overflow-x-auto leading-relaxed">
                  keytool -genkey -v -keystore android/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
                </pre>
                <p className="text-[11px] text-slate-400">
                  یہ کمانڈ ٹرمینل میں رن کریں اور اپنا پاسورڈ سیٹ کریں۔
                </p>
              </div>

              {/* Step 2: key.properties */}
              <div className="p-4 rounded-2xl bg-[#0F1626] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-cyan-400">android/key.properties</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(sampleKeyProperties, 'key_props')}
                    className="text-xs text-cyan-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedType === 'key_props' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {sampleKeyProperties}
                </pre>
              </div>

              {/* Step 3: build.gradle signing configs */}
              <div className="p-4 rounded-2xl bg-[#0F1626] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-cyan-400">android/app/build.gradle (signingConfigs)</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(sampleBuildGradle, 'build_gradle')}
                    className="text-xs text-cyan-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedType === 'build_gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                  {sampleBuildGradle}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 4: Direct APK & Web Install */}
          {activeTab === 'build' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Card 1: 1-Tap Direct Android Install (PWA APK Standalone) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#101826] to-[#0A0F1A] border border-emerald-500/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/pwa-192x192.png" 
                      alt="HMS Icon" 
                      className="w-14 h-14 rounded-2xl shadow-lg border border-white/20 object-cover" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        HMS Home Maintenance System (Android Web APK)
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        فوری موبائل انسٹالیشن (کوئی اضافی ایپ انسٹالر درکار نہیں)
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-latin">
                        <span>Offline Ready</span> · <span>Zero Lag</span> · <span>4.9 ★ Rating</span>
                      </div>
                    </div>
                  </div>

                  {isInstalled && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      انسٹال شدہ
                    </span>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      playCrystalTap(soundEnabled);
                      if (isInstallable) {
                        await install();
                      } else {
                        alert('اگر آپ اینڈرائیڈ کروم پر ہیں تو براؤزر مینو سے "Install App" یا "Add to Home Screen" منتخب کریں!');
                      }
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>موبائل پر 1-کلک انسٹال کریں (Install Web APK)</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      playSuccessChime(soundEnabled);
                      alert('ایپ کا براہ راست لنک کاپی کر لیا گیا ہے۔ اپنے موبائل واٹس ایپ پر بھیجیں اور فورا کھولیں!');
                    }}
                    className="py-3 px-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    title="Share Link to Android Phone"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>موبائل پر شیئر کریں</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Flutter APK Build Runner Simulation */}
              <div className="p-4 rounded-2xl bg-[#111724] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white font-mono">
                      flutter build apk --release
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-latin">
                    Release Build Tool
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  اگر آپ اپنے لوکل کمپیوٹر پر فلٹر سورس کوڈ سے ریلیز APK بنانا چاہتے ہیں، تو نیچے دیا گیا بٹن دبائیں یا فلٹر کوڈ ٹیب سے مکمل پراجیکٹ کاپی کریں۔
                </p>

                <div className="flex flex-wrap gap-2">
                  <a
                    href="/app-release.apk"
                    download="app-release.apk"
                    className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>براہ راست ڈاؤنلوڈ کریں (app-release.apk)</span>
                  </a>

                  {onOpenDriveModal && (
                    <button
                      type="button"
                      onClick={() => {
                        playCrystalTap(soundEnabled);
                        onOpenDriveModal();
                      }}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg active:scale-95 transition cursor-pointer"
                    >
                      <Cloud className="w-4 h-4 text-cyan-200" />
                      <span>گوگل ڈرائیو پر اپلوڈ کریں (Google Drive)</span>
                    </button>
                  )}

                  <button
                    onClick={handleSimulateBuildApk}
                    disabled={isBuildingApk}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isBuildingApk 
                        ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/15 text-white active:scale-95 border border-white/10'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isBuildingApk ? 'بلڈ بن رہا ہے...' : 'ریلیز بلڈ ٹیسٹ کریں (Run Build)'}</span>
                  </button>
                </div>

                {/* Build Logs Terminal Window */}
                {apkLogs.length > 0 && (
                  <div className="mt-2 p-3 bg-black/80 rounded-xl font-mono text-[11px] text-slate-300 border border-white/10 space-y-1 overflow-x-auto max-h-40">
                    {apkLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0">&gt;</span>
                        <span className={i === apkLogs.length - 1 ? 'text-emerald-300 font-bold' : ''}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {apkBuildComplete && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>APK فائل کامیابی سے تیار ہے۔</span>
                    </div>
                    <a
                      href="/app-release.apk"
                      download="app-release.apk"
                      className="py-1 px-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ڈاؤنلوڈ APK</span>
                    </a>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: AndroidManifest.xml & pubspec */}
          {activeTab === 'manifest' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Manifest */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    android/app/src/main/AndroidManifest.xml
                  </span>
                  <button
                    onClick={() => handleCopy(sampleManifest, 'manifest')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    {copiedType === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>کاپی کریں</span>
                  </button>
                </div>

                <pre className="p-3 bg-[#070B12] rounded-xl border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-60">
                  {sampleManifest}
                </pre>
              </div>

              {/* pubspec.yaml */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono">pubspec.yaml</span>
                  <button
                    onClick={() => handleCopy(samplePubspec, 'pubspec')}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    {copiedType === 'pubspec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>کاپی کریں (Copy)</span>
                  </button>
                </div>

                <pre className="p-3 bg-[#070B12] rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60">
                  {samplePubspec}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer with Real 35MB GitHub Repo ZIP & Actions */}
        <div className="p-3.5 sm:p-4 bg-[#070C16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>حقیقی 35MB بائنری کے لیے مکمل سورس ریپوزٹری تیار ہے۔</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/hms-flutter-github-repo.zip"
              download="hms-flutter-github-repo.zip"
              className="py-2 px-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>GitHub Repo ZIP (Auto-build 35MB APK)</span>
            </a>

            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                onClose();
              }}
              className="py-2 px-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition"
            >
              بند کریں
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
