import React, { useState } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Calculator, 
  Star, 
  ShieldCheck, 
  Download,
  Share2,
  X,
  PhoneCall,
  Wallet,
  Cloud
} from 'lucide-react';
import { Language } from '../types/hms';
import { UI_TRANSLATIONS } from '../data/servicesData';
import { playCrystalTap } from '../utils/audioEffects';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderSectionProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenEstimator: () => void;
  onOpenEmergency: () => void;
  onOpenApkModal?: () => void;
  onOpenDriveModal?: () => void;
  walletBalance?: number;
  onOpenWallet?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  currentLanguage,
  onLanguageChange,
  isMobileFrame,
  onToggleMobileFrame,
  soundEnabled,
  onToggleSound,
  onOpenEstimator,
  onOpenEmergency,
  onOpenApkModal,
  onOpenDriveModal,
  walletBalance = 2450,
  onOpenWallet,
}) => {
  const [showPlayStoreModal, setShowPlayStoreModal] = useState(false);
  const t = UI_TRANSLATIONS[currentLanguage];

  return (
    <>
      <header className="relative w-full border-b border-white/10 bg-[#0c121e]/80 backdrop-blur-xl px-4 py-3 sm:px-6 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left Zone: 3D HMS Glowing Logo + App Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => playCrystalTap(soundEnabled)}>
              {/* Outer 3D Crystal Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-[#0055FF] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              
              {/* Core 3D Emblem */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#00E5FF] via-[#0077FE] to-[#0038A8] flex items-center justify-center shadow-xl border border-white/40 transform group-hover:scale-105 active:scale-95 transition-transform duration-200">
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-white/40 pointer-events-none"></div>
                <span className="font-extrabold tracking-widest text-white text-base sm:text-lg font-latin drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  HMS
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>HMS</span>
                  <span className="text-slate-400 font-normal hidden sm:inline">-</span>
                  <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold hidden sm:inline">
                    Home Maintenance System
                  </span>
                </h1>
                
                {/* Verified Shield */}
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="hidden xs:inline">Govt & PEC Reg.</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Actions: Quick Tools, Language Selector & Play Store */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* PWA / Android APK 1-Tap Install Button */}
            <PWAInstallButton soundEnabled={soundEnabled} onOpenApkModal={onOpenApkModal} />
            
            {/* Worker Wallet & Commission Status Button */}
            {onOpenWallet && (
              <button
                onClick={() => {
                  playCrystalTap(soundEnabled);
                  onOpenWallet();
                }}
                title="HMS Worker Wallet & Commission Status"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-[#1E293B] to-[#0F172A] hover:from-[#283852] hover:to-[#162035] border border-cyan-400/40 hover:border-cyan-300 text-white rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer shadow-md shadow-cyan-950/40 group"
              >
                <div className="w-4 h-4 rounded-md bg-cyan-500/20 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
                  <Wallet className="w-3 h-3" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="hidden xl:inline text-slate-300 text-[11px]">والیٹ:</span>
                  <span className="text-[#00E5FF] font-extrabold font-latin text-xs">
                    Rs. {walletBalance.toLocaleString()}
                  </span>
                </div>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Google Drive APK Link Button */}
            {onOpenDriveModal && (
              <button
                onClick={() => {
                  playCrystalTap(soundEnabled);
                  onOpenDriveModal();
                }}
                title="Upload & Get Google Drive Link"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-950/70 to-cyan-950/70 hover:from-blue-900/80 hover:to-cyan-900/80 border border-blue-400/40 text-blue-200 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm group"
              >
                <div className="w-4 h-4 rounded-md bg-blue-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                  <Cloud className="w-3 h-3" />
                </div>
                <span className="hidden lg:inline text-cyan-200">Google Drive</span>
                <span className="inline lg:hidden text-cyan-200">Drive</span>
              </button>
            )}

            {/* Quick Emergency Button */}
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                onOpenEmergency();
              }}
              title="Emergency SOS Repair"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm shadow-rose-950/40"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span className="hidden md:inline">ایمرجنسی سروس</span>
              <span className="inline md:hidden">SOS</span>
            </button>

            {/* Cost Estimator Button */}
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                onOpenEstimator();
              }}
              title="Civil Work & Maintenance Estimator"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 rounded-lg text-xs font-medium transition active:scale-95 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">تعمیراتی لاگت کیلکولیٹر</span>
              <span className="inline lg:hidden">کیلکولیٹر</span>
            </button>

            {/* Play Store 4.9★ Badge */}
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                setShowPlayStoreModal(true);
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-emerald-400/50 rounded-xl text-xs transition duration-200 cursor-pointer shadow-lg active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-[11px] leading-none">▶</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                <span className="text-amber-300">★</span>
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-slate-400 hidden xl:inline">Google Play</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
                playCrystalTap(!soundEnabled);
              }}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Crystal Sound Effects'}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
              aria-label="Sound Toggle"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Frame View Toggle (Mobile Screen Simulator vs Wide Portal) */}
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                onToggleMobileFrame();
              }}
              title={isMobileFrame ? 'Expand to Desktop Portal View' : 'Switch to Smartphone App Shell'}
              className="hidden sm:flex items-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
            >
              {isMobileFrame ? (
                <Monitor className="w-4 h-4 text-cyan-400" />
              ) : (
                <Smartphone className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => {
                  playCrystalTap(soundEnabled);
                  onLanguageChange(e.target.value as Language);
                }}
                className="bg-[#151e2e] text-[#00E5FF] text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-[#00E5FF] cursor-pointer appearance-none pr-6"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300E5FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.35rem center', backgroundSize: '0.85em' }}
              >
                <option value="urdu" className="bg-[#101726] text-white">Urdu / اردو</option>
                <option value="english" className="bg-[#101726] text-white">English</option>
                <option value="arabic" className="bg-[#101726] text-white">Arabic / عربي</option>
              </select>
            </div>

          </div>

        </div>
      </header>

      {/* Google Play Store Modal */}
      {showPlayStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-white/20 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setShowPlayStoreModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#0055FF] flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-xl font-black text-white font-latin">HMS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">HMS - Home Maintenance System</h3>
                <p className="text-xs text-cyan-400 font-medium">Civil Works, Repair & Construction</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-xs font-semibold text-white">4.9</span>
                  <span className="text-xs text-slate-400">(42.8k reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs text-slate-300 border-t border-b border-white/10 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verified Technicians:</span>
                <span className="text-white font-semibold">12,500+ across Pakistan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Average Arrival Time:</span>
                <span className="text-emerald-400 font-semibold">35 - 45 Minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Release Build:</span>
                <span className="text-emerald-400 font-mono">flutter build apk --release</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Version:</span>
                <span className="text-cyan-400 font-mono">v1.0.0 (Official Release)</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowPlayStoreModal(false);
                  onOpenApkModal?.();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>APK ڈاؤن لوڈ و انسٹال سنٹر</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('HMS App link copied to clipboard!');
                }}
                className="py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>شیئر کریں</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
