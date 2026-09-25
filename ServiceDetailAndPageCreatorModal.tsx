import React, { useState, useRef } from 'react';
import { 
  X, 
  UserCheck, 
  PlusCircle, 
  Phone, 
  MessageSquare, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Image as ImageIcon, 
  Video, 
  Upload, 
  Shield, 
  Eye, 
  Sparkles,
  Calendar,
  AlertCircle,
  LocateFixed
} from 'lucide-react';
import { HMSService, WorkerProfile, Language, BookingRequest } from '../types/hms';
import { UI_TRANSLATIONS, CITIES_LIST, ASSET_IMAGES } from '../data/servicesData';
import { playCrystalTap, playSuccessChime } from '../utils/audioEffects';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { WorkerWalletCard } from './WorkerWalletCard';

interface ServiceDetailAndPageCreatorModalProps {
  service: HMSService;
  currentLanguage: Language;
  onClose: () => void;
  workers: WorkerProfile[];
  onAddWorker: (newWorker: WorkerProfile) => void;
  onBookWorker: (booking: BookingRequest) => void;
  onViewWorkerPortfolio: (worker: WorkerProfile) => void;
  soundEnabled: boolean;
  walletBalance?: number;
  commissionRate?: number;
  onRechargeClick?: () => void;
}

export const ServiceDetailAndPageCreatorModal: React.FC<ServiceDetailAndPageCreatorModalProps> = ({
  service,
  currentLanguage,
  onClose,
  workers,
  onAddWorker,
  onBookWorker,
  onViewWorkerPortfolio,
  soundEnabled,
  walletBalance = 2450,
  commissionRate = 5,
  onRechargeClick,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'create'>('book');
  const t = UI_TRANSLATIONS[currentLanguage];

  // Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerExp, setWorkerExp] = useState('5');
  const [workerRate, setWorkerRate] = useState('');
  const [workerCity, setWorkerCity] = useState(CITIES_LIST[0]);
  const [workerArea, setWorkerArea] = useState('');
  const [workerBio, setWorkerBio] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    ASSET_IMAGES.heroBanner,
    ASSET_IMAGES.tileWork,
  ]);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasVoiceIntro, setHasVoiceIntro] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [event.target!.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoDetectGps = () => {
    if (!navigator.geolocation) {
      alert('آپ کے براؤزر میں لوکیشن کی سہولت دستیاب نہیں ہے۔');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = pos.coords;
        setCustomerAddress((prev) => 
          prev ? `${prev} (GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})` : `GPS لوکیشن: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        );
        playCrystalTap(soundEnabled);
      },
      (err) => {
        setIsDetectingGps(false);
        alert('لوکیشن کی اجازت نہیں ملی۔ براہ کرم پتہ دستی طور پر لکھیں۔');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Booking Modal State (When customer clicks "طلب کریں")
  const [selectedProForBooking, setSelectedProForBooking] = useState<WorkerProfile | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState(CITIES_LIST[0]);
  const [bookingUrgency, setBookingUrgency] = useState<'urgent' | 'scheduled'>('urgent');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Filter workers for this service
  const serviceWorkers = workers.filter(
    (w) => w.serviceId === service.id || w.serviceId === 'all'
  );

  // Handle Worker Registration
  const handlePublishWorkerPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !workerPhone.trim()) {
      alert('براہ کرم اپنا نام اور فون نمبر درج کریں۔');
      return;
    }

    const newWorker: WorkerProfile = {
      id: `pro-custom-${Date.now()}`,
      name: workerName.trim(),
      serviceId: service.id,
      phone: workerPhone.trim(),
      whatsapp: workerPhone.replace(/[^0-9]/g, ''),
      experienceYears: parseInt(workerExp, 10) || 5,
      rateText: workerRate.trim() || `Rs. 2,000 / یومیہ (${service.typicalRate})`,
      city: workerCity,
      area: workerArea.trim() || 'تمام سیکٹرز',
      rating: 5.0,
      jobsCompleted: 1,
      cnicVerified: true,
      isAvailableToday: true,
      bio: workerBio.trim() || `${service.titleUrdu} کا تجربہ کار کاریگر۔ جدید ٹولز اور گارنٹی کے ساتھ سروس۔`,
      portfolioImages: uploadedImages.length > 0 ? uploadedImages : [ASSET_IMAGES.heroBanner],
      videoThumbnail: hasVideo ? ASSET_IMAGES.heroBanner : undefined,
      hasAudioIntro: hasVoiceIntro,
      badgeLevel: 'Verified Pro',
      createdAt: new Date().toISOString(),
    };

    onAddWorker(newWorker);
    playSuccessChime(soundEnabled);
    setPublishedSuccess(true);
  };

  // Handle Customer Booking Submission
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('براہ کرم اپنا نام، فون اور پتہ درج کریں۔');
      return;
    }

    const booking: BookingRequest = {
      id: `order-${Date.now()}`,
      serviceId: service.id,
      proId: selectedProForBooking?.id,
      proName: selectedProForBooking?.name,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      city: customerCity,
      area: customerAddress.trim(),
      address: customerAddress.trim(),
      serviceType: service.titleUrdu,
      urgency: bookingUrgency,
      scheduledDate: bookingUrgency === 'scheduled' ? bookingDate : undefined,
      notes: bookingNotes.trim(),
      hasVoiceNote,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookWorker(booking);
    playSuccessChime(soundEnabled);
    setSelectedProForBooking(null);
    setBookingSuccessModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#090E17] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar (AppBar matching Flutter) */}
        <div 
          className="relative px-5 py-4 border-b border-white/10 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${service.accentColor}33 0%, rgba(13, 20, 34, 0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/30"
              style={{ backgroundColor: `${service.accentColor}33` }}
            >
              <span className="text-xl">🛠️</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{service.titleUrdu}</span>
                <span className="text-xs font-normal text-slate-300 font-latin">({service.titleEng})</span>
              </h2>
              <p className="text-[11px] text-cyan-300 font-medium">
                {service.categoryUrdu} · {service.rateUnit}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar: 2 Tabs matching Flutter screen */}
        <div className="flex border-b border-white/10 bg-[#0B1220]">
          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('book');
            }}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'book'
                ? 'border-[#00E5FF] text-[#00E5FF] bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.bookWorker}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('create');
            }}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'create'
                ? 'border-[#00E5FF] text-[#00E5FF] bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.createPage}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: Customer View (Hire Pro Worker) */}
          {activeTab === 'book' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Service Hero Banner */}
              <div 
                className="relative rounded-2xl p-4 sm:p-5 border border-white/15 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${service.accentColor}26 0%, rgba(255,255,255,0.03) 100%)`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/20"
                    style={{ backgroundColor: service.accentColor }}
                  >
                    <span className="text-2xl text-slate-950 font-bold">★</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      فوری {service.titleUrdu} طلب کریں
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {service.descriptionUrdu}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {service.commonTasks.slice(0, 3).map((task, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] text-white/90 border border-white/10"
                        >
                          ✓ {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Book Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
                <div>
                  <span className="text-xs text-cyan-300 font-semibold block">
                    ⚡ ایمرجنسی یا شیڈول وزٹ چاہیے؟
                  </span>
                  <span className="text-[11px] text-slate-400">
                    قریبی دستیاب کاریگر 30 سے 45 منٹ میں آپ کی دہلیز پر پہنچے گا۔
                  </span>
                </div>
                <button
                  onClick={() => {
                    playCrystalTap(soundEnabled);
                    setSelectedProForBooking(serviceWorkers[0] || null);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-slate-950 text-xs font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer whitespace-nowrap"
                >
                  فوری بکنگ فارم کھولیں
                </button>
              </div>

              {/* Available Workers List Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{t.availablePros}</span>
                  <span className="text-xs text-cyan-400">({serviceWorkers.length})</span>
                </h4>
                <span className="text-xs text-slate-400 font-latin">100% Verified</span>
              </div>

              {/* Workers Cards List */}
              <div className="space-y-3">
                {serviceWorkers.map((worker, index) => (
                  <div
                    key={worker.id}
                    className="p-4 bg-[#121926] border border-white/10 hover:border-cyan-500/40 rounded-xl transition-all duration-200 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Avatar & Details */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base shadow-inner border border-white/20"
                          style={{ backgroundColor: `${service.accentColor}33` }}
                        >
                          {worker.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm sm:text-base font-bold text-white">
                              {worker.name}
                            </h5>
                            {worker.cnicVerified && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                                تصدیق شدہ
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="text-amber-300 font-semibold flex items-center gap-0.5">
                              ★ {worker.rating}
                            </span>
                            <span>·</span>
                            <span>{worker.experienceYears} سال تجربہ</span>
                            <span>·</span>
                            <span className="text-cyan-400 font-medium">{worker.rateText}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{worker.city} ({worker.area})</span>
                          </div>
                        </div>
                      </div>

                      {/* Hire Pro Action Button */}
                      <button
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          setSelectedProForBooking(worker);
                        }}
                        className="py-1.5 px-3.5 bg-[#00E5FF] hover:bg-[#33EAFF] text-slate-950 font-bold rounded-lg text-xs shadow-md active:scale-95 transition cursor-pointer shrink-0"
                      >
                        {t.bookNowBtn}
                      </button>
                    </div>

                    {/* Pro Bio */}
                    <p className="text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 line-clamp-2">
                      {worker.bio}
                    </p>

                    {/* Actions: Direct WhatsApp, Call, View Portfolio */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                      
                      <div className="flex items-center gap-2">
                        {/* Direct WhatsApp */}
                        <a
                          href={`https://wa.me/${worker.whatsapp}?text=السلام علیکم! مجھے HMS ایپ سے آپ کی ${service.titleUrdu} سروس درکار ہے۔`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>واٹس ایپ</span>
                        </a>

                        {/* Direct Call */}
                        <a
                          href={`tel:${worker.phone}`}
                          className="flex items-center gap-1.5 py-1 px-2.5 rounded-md bg-white/5 text-slate-300 border border-white/10 text-xs font-medium hover:bg-white/10 transition cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{worker.phone}</span>
                        </a>
                      </div>

                      {/* View Portfolio Button */}
                      <button
                        type="button"
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          onViewWorkerPortfolio(worker);
                        }}
                        className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>کام کی تصاویر دیکھیں</span>
                      </button>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: Worker View (Page Creator & Media Upload) */}
          {activeTab === 'create' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* HMS Worker Wallet & Commission Status Card */}
              {onRechargeClick && (
                <WorkerWalletCard
                  walletBalance={walletBalance}
                  commissionRate={commissionRate}
                  onRechargeClick={onRechargeClick}
                  soundEnabled={soundEnabled}
                />
              )}

              {publishedSuccess ? (
                <div className="p-6 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-center space-y-4 animate-scaleUp">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {t.publishedSuccess}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    آپ کا پروفیشنل پیج اب HMS نیٹ ورک پر لائیو ہے۔ آپ کے علاقے کے کسٹمرز اب براہ راست کال یا واٹس ایپ کے ذریعے رابطہ کر سکتے ہیں۔
                  </p>
                  
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        playCrystalTap(soundEnabled);
                        setActiveTab('book');
                        setPublishedSuccess(false);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-lg"
                    >
                      دستیاب ماہرین کی فہرست میں دیکھیں
                    </button>
                    <button
                      onClick={() => setPublishedSuccess(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-xs transition cursor-pointer"
                    >
                      مزید تبدیلیاں کریں
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePublishWorkerPage} className="space-y-4">
                  
                  <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                    <p className="text-xs text-cyan-200">
                      اپنا ورکنگ پیج بنائیں تاکہ کسٹمرز آپ کے پچھلے کام کی تصاویر دیکھ کر بغیر کمیشن براہ راست رابطہ کریں۔
                    </p>
                  </div>

                  {/* Name and Phone Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.nameLabel} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={workerName}
                        onChange={(e) => setWorkerName(e.target.value)}
                        placeholder="مثال: استاد فیاض الیکٹریشن"
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.phoneLabel} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={workerPhone}
                        onChange={(e) => setWorkerPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-latin"
                      />
                    </div>
                  </div>

                  {/* Experience & Rate Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.experienceLabel}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={workerExp}
                        onChange={(e) => setWorkerExp(e.target.value)}
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-latin"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.rateLabel}
                      </label>
                      <input
                        type="text"
                        value={workerRate}
                        onChange={(e) => setWorkerRate(e.target.value)}
                        placeholder="مثال: Rs. 2,500 یومیہ / فی وزٹ"
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* City & Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.cityLabel}
                      </label>
                      <select
                        value={workerCity}
                        onChange={(e) => setWorkerCity(e.target.value)}
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                      >
                        {CITIES_LIST.map((city) => (
                          <option key={city} value={city} className="bg-[#101726]">
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.areaLabel}
                      </label>
                      <input
                        type="text"
                        value={workerArea}
                        onChange={(e) => setWorkerArea(e.target.value)}
                        placeholder="مثال: گلبرگ، ڈی ایچ اے، بحریہ ٹاؤن"
                        className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.bioLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={workerBio}
                      onChange={(e) => setWorkerBio(e.target.value)}
                      placeholder={t.bioPlaceholder}
                      className="w-full bg-[#131b2a] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Media Upload Section (Photos & Videos) matching Flutter */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-white">
                      {t.mediaSectionTitle}
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelected}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          fileInputRef.current?.click();
                        }}
                        className="py-3 px-3 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/15 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
                      >
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span>{t.uploadPhotos} (گیلری / کیمرہ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          setHasVideo(!hasVideo);
                          alert(hasVideo ? 'ویڈیو ہٹا دی گئی' : 'ویڈیو پورٹ فولیو کا لنک منسلک ہو گیا!');
                        }}
                        className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition ${
                          hasVideo
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                            : 'border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        <Video className="w-4 h-4 text-amber-400" />
                        <span>{hasVideo ? 'ویڈیو منسلک ✓' : t.uploadVideo}</span>
                      </button>
                    </div>

                    {/* Previews of uploaded images */}
                    {uploadedImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 shrink-0">
                            <img src={img} alt="Work preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))}
                              className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/80 rounded-full text-[9px] text-white flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Audio Voice Introduction */}
                  <VoiceNoteRecorder
                    accentColor={service.accentColor}
                    label="اپنا آڈیو تعارف ریکارڈ کریں (Voice Intro for Customers)"
                    onAudioRecorded={(has) => setHasVoiceIntro(has)}
                  />

                  {/* Publish Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl text-slate-950 font-bold text-sm shadow-xl active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, #00E5FF 0%, ${service.accentColor} 100%)`,
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-slate-950" />
                    <span>{t.publishBtn}</span>
                  </button>

                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Customer Booking Dialog Modal */}
      {selectedProForBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0E1524] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>کاریگر آرڈر فارم:</span>
                  <span className="text-[#00E5FF]">{selectedProForBooking.name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  سروس: {service.titleUrdu} ({service.titleEng})
                </p>
              </div>

              <button
                onClick={() => setSelectedProForBooking(null)}
                className="p-1 rounded-lg bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  آپ کا نام (Customer Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اپنا نام درج کریں"
                  className="w-full bg-[#151f33] border border-white/20 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  موبائل نمبر (WhatsApp / Phone) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full bg-[#151f33] border border-white/20 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-latin"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    شہر
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-[#151f33] border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    {CITIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    مطلوبہ وقت
                  </label>
                  <div className="flex bg-[#151f33] rounded-xl p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setBookingUrgency('urgent')}
                      className={`flex-1 py-1 text-[11px] rounded-lg font-medium ${
                        bookingUrgency === 'urgent' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      فوری (30 منٹ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingUrgency('scheduled')}
                      className={`flex-1 py-1 text-[11px] rounded-lg font-medium ${
                        bookingUrgency === 'scheduled' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      بعد میں
                    </button>
                  </div>
                </div>
              </div>

              {bookingUrgency === 'scheduled' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    تاریخ اور وقت
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#151f33] border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    گھر کا مکمل پتہ (Address) <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoDetectGps}
                    disabled={isDetectingGps}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <LocateFixed className="w-3.5 h-3.5" />
                    <span>{isDetectingGps ? 'لوکیشن آ رہی ہے...' : '📍 GPS لوکیشن حاصل کریں'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="مکان نمبر، گلی، فیز / سیکٹر"
                  className="w-full bg-[#151f33] border border-white/20 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  کام کی مختصر تفصیل (Describe Issue)
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="مسئلہ کیا ہے؟ مثلاً پائپ ٹوٹ گیا ہے یا بریکر ٹرپ ہو رہا ہے..."
                  className="w-full bg-[#151f33] border border-white/20 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Voice Note attachment */}
              <VoiceNoteRecorder
                accentColor="#00E5FF"
                label="آواز ریکارڈ کریں (مسئلہ سمجھانے کے لیے):"
                onAudioRecorded={(has) => setHasVoiceNote(has)}
              />

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg active:scale-95 transition cursor-pointer"
                >
                  آرڈر کنفرم کریں (Confirm Booking)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProForBooking(null)}
                  className="py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-xs transition cursor-pointer"
                >
                  منسوخ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-bold text-white">
              طلب کامیابی سے بھیج دی گئی ہے!
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              شکریہ! آپ کی درخواست موصول ہو گئی ہے۔ کاریگر آپ کے فون نمبر پر 10 منٹ کے اندر تصدیقی کال کرے گا اور بتائے گئے پتے پر پہنچے گا۔
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-300 text-right space-y-1">
              <div><strong>سروس:</strong> {service.titleUrdu} ({service.titleEng})</div>
              <div><strong>نوعیت:</strong> {bookingUrgency === 'urgent' ? 'فوری ایمرجنسی وزٹ' : 'شیڈول وزٹ'}</div>
              <div><strong>سپورٹ ہیلپ لائن:</strong> 0300-000-HMS1</div>
            </div>

            <button
              onClick={() => {
                setBookingSuccessModal(false);
                onClose();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition cursor-pointer"
            >
              ٹھیک ہے (Done)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
