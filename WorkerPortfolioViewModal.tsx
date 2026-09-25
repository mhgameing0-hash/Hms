import React from 'react';
import { X, Star, MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, Calendar, Award } from 'lucide-react';
import { WorkerProfile, HMSService } from '../types/hms';
import { playCrystalTap } from '../utils/audioEffects';

interface WorkerPortfolioViewModalProps {
  worker: WorkerProfile;
  service?: HMSService;
  onClose: () => void;
  onBookWorker: (worker: WorkerProfile) => void;
  soundEnabled: boolean;
}

export const WorkerPortfolioViewModal: React.FC<WorkerPortfolioViewModalProps> = ({
  worker,
  service,
  onClose,
  onBookWorker,
  soundEnabled,
}) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0B101B] border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Background Pattern */}
        <div className="relative px-5 py-5 bg-gradient-to-r from-cyan-950/70 via-[#10192A] to-slate-900 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl border border-white/30">
              {worker.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{worker.name}</h3>
                {worker.cnicVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>تصدیق شدہ</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-latin">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  ★ {worker.rating}
                </span>
                <span>·</span>
                <span>{worker.jobsCompleted} آرڈرز مکمل</span>
                <span>·</span>
                <span className="text-cyan-400 font-semibold">{worker.rateText}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{worker.city} · {worker.area}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Pro Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              پروفیشنل تعارف و صلاحیتیں (About):
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/10">
              {worker.bio}
            </p>
          </div>

          {/* Key Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block text-base font-bold text-[#00E5FF] font-latin">
                {worker.experienceYears}+ سال
              </span>
              <span className="text-[10px] text-slate-400">فیلڈ کا تجربہ</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block text-base font-bold text-emerald-400 font-latin">
                100%
              </span>
              <span className="text-[10px] text-slate-400">کام کی گارنٹی</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block text-base font-bold text-amber-300 font-latin">
                {worker.badgeLevel}
              </span>
              <span className="text-[10px] text-slate-400">HMS رینک</span>
            </div>
          </div>

          {/* Work Showcase Images */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>مکمل شدہ کام کا تصویری ریکارڈ (Work Portfolio):</span>
              <span className="text-[11px] text-cyan-400">{worker.portfolioImages.length} تصاویر</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {worker.portfolioImages.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/20 group">
                  <img
                    src={img}
                    alt={`Portfolio ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[11px] text-white font-medium">سائٹ پراجیکٹ #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Direct Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${worker.whatsapp}?text=السلام علیکم! میں نے HMS ایپ پر آپ کا پورٹ فولیو دیکھا ہے اور مجھے کام کے لیے بات کرنی ہے۔`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واٹس ایپ پر رابطہ کریں</span>
            </a>

            <a
              href={`tel:${worker.phone}`}
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>براہ راست فون کال</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
