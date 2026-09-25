import React, { useState } from 'react';
import { Download, Smartphone, Check, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playCrystalTap } from '../utils/audioEffects';

interface PWAInstallButtonProps {
  soundEnabled?: boolean;
  onOpenApkModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  soundEnabled = true,
  onOpenApkModal,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, show verified status or open APK center
  if (isInstalled) {
    return (
      <button
        onClick={() => {
          playCrystalTap(soundEnabled);
          onOpenApkModal?.();
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition active:scale-95 cursor-pointer"
        title="HMS Installed as Native Android App"
      >
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">انسٹال شدہ (Installed)</span>
        <span className="inline sm:hidden">APK ✓</span>
      </button>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          playCrystalTap(soundEnabled);
          const success = await install();
          if (!success) {
            onOpenApkModal?.();
          }
        }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-950/40 active:scale-95 transition cursor-pointer"
        title="Install HMS Native Android App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>APK انسٹال کریں</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            playCrystalTap(soundEnabled);
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>iOS ایپ انسٹال</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-[#0F172A] border border-white/20 p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>iPhone / iPad پر انسٹال کریں</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-2 py-2">
                <p>1. سفاری براؤزر کے نیچے موجود <strong className="text-cyan-400">Share</strong> بٹن پر کلک کریں۔</p>
                <p>2. فہرست کو نیچے سکرول کر کے <strong className="text-cyan-400">Add to Home Screen (ہوم سکرین پر شامل کریں)</strong> پر ٹیپ کریں۔</p>
                <p>3. اوپر دائیں کونے میں <strong className="text-emerald-400">Add</strong> منتخب کریں۔ ایپ آپ کے موبائل پر بغیر براؤزر کے کھلے گی۔</p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                ٹھیک ہے (Got it)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback button to open APK center
  return (
    <button
      onClick={() => {
        playCrystalTap(soundEnabled);
        onOpenApkModal?.();
      }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
      title="Android Release APK & Build Center"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400" />
      <span>APK ریلیز</span>
    </button>
  );
};
