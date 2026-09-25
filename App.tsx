import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  SlidersHorizontal,
  Flame,
  Phone,
  MessageSquare,
  Calculator,
  AlertTriangle,
  Wallet,
  Cloud,
  Download,
  FolderArchive
} from 'lucide-react';
import { HMSService, WorkerProfile, BookingRequest, Language } from './types/hms';
import { HMS_SERVICES, INITIAL_WORKERS, UI_TRANSLATIONS } from './data/servicesData';
import { HeaderSection } from './components/HeaderSection';
import { CrystalWater3DButton } from './components/CrystalWater3DButton';
import { ServiceDetailAndPageCreatorModal } from './components/ServiceDetailAndPageCreatorModal';
import { WorkerPortfolioViewModal } from './components/WorkerPortfolioViewModal';
import { CostEstimatorModal } from './components/CostEstimatorModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AndroidApkReleaseModal } from './components/AndroidApkReleaseModal';
import { WorkerWalletCard } from './components/WorkerWalletCard';
import { WorkerWalletModal, WalletTransaction } from './components/WorkerWalletModal';
import { GoogleDriveUploadModal } from './components/GoogleDriveUploadModal';
import { GoogleDriveInlineCard } from './components/GoogleDriveInlineCard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { playCrystalTap } from './utils/audioEffects';

export default function App() {
  // App State
  const [currentLanguage, setCurrentLanguage] = useState<Language>('urdu');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & Navigation State
  const [selectedService, setSelectedService] = useState<HMSService | null>(null);
  const [selectedWorkerPortfolio, setSelectedWorkerPortfolio] = useState<WorkerProfile | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // HMS Worker Wallet & Commission State (5% commission rate default)
  const [commissionRate] = useState<number>(5);
  const [workerWalletBalance, setWorkerWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hms_worker_wallet_balance_v1');
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 2450;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('hms_worker_wallet_txns_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'txn-1',
        type: 'credit',
        titleUrdu: 'ایزی پیسہ اکاؤنٹ سے ٹاپ اپ ریچارج',
        amount: 2000,
        date: 'آج، 02:40 PM',
        method: 'EasyPaisa',
        referenceId: 'EP-98310248',
        status: 'completed',
      },
      {
        id: 'txn-2',
        type: 'debit',
        titleUrdu: 'آرڈر #HMS-4821 ایپ کمیشن کٹوتی (5%)',
        amount: 50,
        date: 'کل، 05:15 PM',
        method: 'HMS Commission',
        referenceId: 'JOB-4821',
        status: 'completed',
      },
      {
        id: 'txn-3',
        type: 'credit',
        titleUrdu: 'نئے کاریگر رجسٹریشن ویلکم بونس',
        amount: 500,
        date: '3 دن پہلے',
        method: 'HMS Bonus',
        referenceId: 'BONUS-001',
        status: 'completed',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('hms_worker_wallet_balance_v1', String(workerWalletBalance));
    } catch {
      // ignore
    }
  }, [workerWalletBalance]);

  useEffect(() => {
    try {
      localStorage.setItem('hms_worker_wallet_txns_v1', JSON.stringify(walletTransactions));
    } catch {
      // ignore
    }
  }, [walletTransactions]);

  const handleWalletRecharge = (amount: number, method: string, referenceId: string) => {
    setWorkerWalletBalance((prev) => prev + amount);
    const newTxn: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: 'credit',
      titleUrdu: `${method} کے ذریعے کامیاب ریچارج`,
      amount,
      date: 'ابھی (Just Now)',
      method,
      referenceId,
      status: 'completed',
    };
    setWalletTransactions((prev) => [newTxn, ...prev]);
  };

  // Persistence for Workers & Bookings
  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('hms_workers_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_WORKERS;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('hms_bookings_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('hms_workers_v1', JSON.stringify(workers));
    } catch {
      // ignore
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem('hms_bookings_v1', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Adjust HTML dir attribute on language change
  useEffect(() => {
    const isRtl = currentLanguage === 'urdu' || currentLanguage === 'arabic';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage === 'urdu' ? 'ur' : currentLanguage === 'arabic' ? 'ar' : 'en';
  }, [currentLanguage]);

  const t = UI_TRANSLATIONS[currentLanguage];

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return HMS_SERVICES.filter((svc) => {
      const matchesSearch = 
        svc.titleUrdu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.titleEng.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.titleArabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.commonTasks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'all' || 
        svc.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Add Worker handler
  const handleAddWorker = (newWorker: WorkerProfile) => {
    setWorkers((prev) => [newWorker, ...prev]);
  };

  // Add Booking handler
  const handleAddBooking = (newBooking: BookingRequest) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Main Dashboard Content
  const dashboardContent = (
    <div className="relative min-h-screen w-full flex flex-col bg-radial from-[#131C2E] via-[#090D16] to-[#030509] text-white selection:bg-cyan-500/30">
      
      {/* Top Header with 3D Logo & Play Store Badge */}
      <HeaderSection
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        walletBalance={workerWalletBalance}
        onOpenWallet={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4">
        
        {/* Title and Language / Quick Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {t.selectWork}
              </h2>
              <span className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-latin">
                13 Services
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              کسی بھی شعبے پر کلک کریں اور تصدیق شدہ کاریگر آن لائن طلب کریں
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#121927]/90 border border-white/15 focus:border-cyan-400/80 rounded-xl py-2 px-9 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Dedicated Google Drive Upload and APK Release Card */}
        <GoogleDriveInlineCard soundEnabled={soundEnabled} />

        {/* Quick Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'تمام سروسز (All)' },
            { id: 'civil work', label: 'سول اور چنائی' },
            { id: 'electrical', label: 'الیکٹریکل' },
            { id: 'plumbing', label: 'پلمبنگ' },
            { id: 'finishing', label: 'پینٹ و فنشنگ' },
            { id: 'management', label: 'ٹھیکیدار و مینجمنٹ' },
            { id: 'engineering', label: 'انجینئرنگ' },
            { id: 'design', label: 'آرکیٹیکٹ ڈیزائن' },
            { id: 'hvac', label: 'اے سی و مشینری' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playCrystalTap(soundEnabled);
                setSelectedCategory(cat.id);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Crystal Water Grid (crossAxisCount 2 on mobile, 3-4 on larger viewports) */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5 pb-8">
            {filteredServices.map((service) => (
              <CrystalWater3DButton
                key={service.id}
                service={service}
                currentLanguage={currentLanguage}
                soundEnabled={soundEnabled}
                onTap={(svc) => {
                  setSelectedService(svc);
                }}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <p className="text-sm">کوئی سروس نہیں ملی۔ براہ کرم مختلف لفظ سے تلاش کریں۔</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#00E5FF] underline cursor-pointer"
              >
                تمام سروسز دوبارہ دکھائیں
              </button>
            </div>
          )}
        </div>

        {/* HMS Worker Wallet & Commission Status Card */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                کاریگر والیٹ و کمیشن اسٹیٹس (HMS Worker Wallet & Commission)
              </h3>
            </div>
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                setIsWalletModalOpen(true);
              }}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-latin flex items-center gap-1 cursor-pointer"
            >
              <span>EasyPaisa / JazzCash Gateway</span>
              <span>→</span>
            </button>
          </div>

          <WorkerWalletCard
            walletBalance={workerWalletBalance}
            commissionRate={commissionRate}
            onRechargeClick={() => setIsWalletModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Live Active Verified Pros Ribbon */}
        <div className="border-t border-white/10 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                آن لائن دستیاب مصدقہ کاریگر (Live Pro Directory)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-latin">
              {workers.length} Verified Craftsmen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {workers.slice(0, 6).map((worker) => {
              const workerService = HMS_SERVICES.find((s) => s.id === worker.serviceId);
              return (
                <div
                  key={worker.id}
                  onClick={() => {
                    playCrystalTap(soundEnabled);
                    setSelectedWorkerPortfolio(worker);
                  }}
                  className="p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/40 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow"
                      style={{ backgroundColor: `${workerService?.accentColor || '#00E5FF'}33` }}
                    >
                      {worker.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{worker.name}</span>
                        {worker.cnicVerified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {workerService?.titleUrdu} · {worker.city.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0 font-latin">
                    <div className="text-amber-400 text-xs font-bold flex items-center gap-0.5 justify-end">
                      ★ {worker.rating}
                    </div>
                    <span className="text-[10px] text-cyan-400 block group-hover:underline">
                      پورٹ فولیو دیکھیں
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Floating Bottom Quick Actions on Mobile Frame / Touch */}
      <footer className="w-full border-t border-white/10 bg-[#080D17]/90 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[#00E5FF] font-bold">HMS</span>
            <span>·</span>
            <span>پاکستان کا پہلا مصدقہ سول و ہوم سروسز نیٹ ورک</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                setIsWalletModalOpen(true);
              }}
              className="text-[#00E5FF] hover:text-white transition flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>والیٹ (Rs. {workerWalletBalance.toLocaleString()})</span>
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playCrystalTap(soundEnabled);
                setIsApkModalOpen(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Android APK ریلیز</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsEstimatorOpen(true)}
              className="text-cyan-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>لاگت کیلکولیٹر</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1 cursor-pointer font-bold"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ایمرجنسی SOS</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* Android APK Release & Flutter Command Center */}
      {isApkModalOpen && (
        <AndroidApkReleaseModal
          onClose={() => setIsApkModalOpen(false)}
          soundEnabled={soundEnabled}
          onOpenDriveModal={() => {
            setIsApkModalOpen(false);
            setIsDriveModalOpen(true);
          }}
        />
      )}

      {/* Google Drive APK Uploader & Link Generator Modal */}
      <GoogleDriveUploadModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      {/* MODAL 1: Service Detail & Page Creator (Direct from Flutter) */}
      {selectedService && (
        <ServiceDetailAndPageCreatorModal
          service={selectedService}
          currentLanguage={currentLanguage}
          onClose={() => setSelectedService(null)}
          workers={workers}
          onAddWorker={handleAddWorker}
          onBookWorker={handleAddBooking}
          onViewWorkerPortfolio={(worker) => setSelectedWorkerPortfolio(worker)}
          soundEnabled={soundEnabled}
          walletBalance={workerWalletBalance}
          commissionRate={commissionRate}
          onRechargeClick={() => setIsWalletModalOpen(true)}
        />
      )}

      {/* MODAL 2: Full Worker Portfolio Page */}
      {selectedWorkerPortfolio && (
        <WorkerPortfolioViewModal
          worker={selectedWorkerPortfolio}
          service={HMS_SERVICES.find((s) => s.id === selectedWorkerPortfolio.serviceId)}
          onClose={() => setSelectedWorkerPortfolio(null)}
          onBookWorker={(w) => {
            const svc = HMS_SERVICES.find((s) => s.id === w.serviceId) || HMS_SERVICES[0];
            setSelectedWorkerPortfolio(null);
            setSelectedService(svc);
          }}
          soundEnabled={soundEnabled}
        />
      )}

      {/* MODAL 3: Civil Work & Construction Cost Estimator */}
      {isEstimatorOpen && (
        <CostEstimatorModal
          onClose={() => setIsEstimatorOpen(false)}
          soundEnabled={soundEnabled}
          onBookEstimatedWork={(serviceId) => {
            const svc = HMS_SERVICES.find((s) => s.id === serviceId) || HMS_SERVICES[0];
            setSelectedService(svc);
          }}
        />
      )}

      {/* MODAL 4: Emergency SOS Rapid Dispatch */}
      {isEmergencyOpen && (
        <EmergencySOSModal
          onClose={() => setIsEmergencyOpen(false)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* MODAL 5: Worker Wallet & Commission Status Gateway */}
      <WorkerWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletBalance={workerWalletBalance}
        commissionRate={commissionRate}
        onRecharge={handleWalletRecharge}
        transactions={walletTransactions}
        soundEnabled={soundEnabled}
      />

    </div>
  );

  // If mobile frame simulation mode is toggled ON:
  if (isMobileFrame) {
    return (
      <div className="min-h-screen w-full bg-[#03060C] flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
        
        {/* Switch back banner */}
        <div className="mb-3 text-center">
          <button
            onClick={() => setIsMobileFrame(false)}
            className="text-xs text-cyan-400 hover:text-cyan-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full cursor-pointer transition flex items-center gap-1.5 mx-auto"
          >
            <span>🖥️ بڑی سکرین ویو پر تبدیل کریں (Expand to Full Desktop View)</span>
          </button>
        </div>

        {/* Smartphone Shell Mockup */}
        <div className="relative w-full max-w-[420px] h-[860px] max-h-[96vh] rounded-[48px] bg-black p-3.5 shadow-2xl shadow-cyan-950/40 border-[4px] border-slate-700/80 flex flex-col overflow-hidden">
          
          {/* Phone Dynamic Island / Camera Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/20" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#070A11]">
            {dashboardContent}
          </div>

          {/* Home Indicator bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none" />
        </div>
      </div>
    );
  }

  // Normal Full Web App View
  return dashboardContent;
}
