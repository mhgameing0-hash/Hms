import React, { useState } from 'react';
import { X, Calculator, ArrowRight, Building, Paintbrush, Grid3X3, Zap, Layers } from 'lucide-react';
import { playCrystalTap } from '../utils/audioEffects';

interface CostEstimatorModalProps {
  onClose: () => void;
  onBookEstimatedWork: (serviceId: string, estimatedDetails: string) => void;
  soundEnabled: boolean;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  onClose,
  onBookEstimatedWork,
  soundEnabled,
}) => {
  const [calculationType, setCalculationType] = useState<
    'grey_structure' | 'paint' | 'tiles' | 'false_ceiling' | 'electrical'
  >('grey_structure');

  const [areaSqft, setAreaSqft] = useState<number>(1125); // Default 5 Marla
  const [qualityGrade, setQualityGrade] = useState<'economy' | 'standard' | 'premium'>('standard');
  const [includeMaterial, setIncludeMaterial] = useState<boolean>(true);

  // Rate matrices (PKR per unit)
  const RATES = {
    grey_structure: {
      unit: 'مربع فٹ (Covered Sq.ft)',
      serviceId: 'contractor',
      laborOnly: 450,
      economy: 2300,
      standard: 2650,
      premium: 3200,
      nameUrdu: 'گرے سٹرکچر تعمیر (اینٹ، سریا، سیمنٹ، ریت، لینٹر)',
    },
    paint: {
      unit: 'مربع فٹ دیوار و چھت',
      serviceId: 'painter',
      laborOnly: 14,
      economy: 22,
      standard: 32,
      premium: 45,
      nameUrdu: 'پینٹ، وال پٹی اور فنشنگ (پلاسٹک ایمولشن و ویدر شیٹ)',
    },
    tiles: {
      unit: 'مربع فٹ ٹائل فرش',
      serviceId: 'tile_fixer',
      laborOnly: 45,
      economy: 160,
      standard: 240,
      premium: 380,
      nameUrdu: 'ٹائل، ماربل اور پورسلین فکسنگ بمعہ کیمیکل مصالحہ',
    },
    false_ceiling: {
      unit: 'مربع فٹ جپسم سیلنگ',
      serviceId: 'false_ceiling',
      laborOnly: 40,
      economy: 120,
      standard: 160,
      premium: 220,
      nameUrdu: 'جپسم فال سیلنگ اور کوو لائٹس ڈیزائن',
    },
    electrical: {
      unit: 'الیکٹرک پوائنٹس (سوئچ، لائٹ، فین)',
      serviceId: 'electrician',
      laborOnly: 150,
      economy: 550,
      standard: 850,
      premium: 1300,
      nameUrdu: 'بجلی وائرنگ (پاکستان کیبلز / فاسٹ کیبلز اور بریکرز)',
    },
  };

  const currentRateConfig = RATES[calculationType];
  const unitRate = includeMaterial
    ? currentRateConfig[qualityGrade]
    : currentRateConfig.laborOnly;

  const totalCost = areaSqft * unitRate;
  const laborPortion = areaSqft * currentRateConfig.laborOnly;
  const materialPortion = includeMaterial ? Math.max(0, totalCost - laborPortion) : 0;

  const handlePresetArea = (sqft: number) => {
    playCrystalTap(soundEnabled);
    setAreaSqft(sqft);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0A0F1A] border border-cyan-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-950/60 to-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[#00E5FF] flex items-center justify-center border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                تعمیراتی اور ہوم مرمت لاگت کیلکولیٹر
              </h3>
              <p className="text-xs text-slate-400">
                مارکیٹ کے تازہ ترین تصدیق شدہ پاکستانی نرخ (PKR)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Work Category Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              کام کی نوعیت منتخب کریں:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'grey_structure', label: 'گرے سٹرکچر', icon: Building },
                { id: 'paint', label: 'پینٹ و وال پٹی', icon: Paintbrush },
                { id: 'tiles', label: 'ٹائل و ماربل', icon: Grid3X3 },
                { id: 'false_ceiling', label: 'فالس سیلنگ', icon: Layers },
                { id: 'electrical', label: 'بجلی وائرنگ', icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = calculationType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playCrystalTap(soundEnabled);
                      setCalculationType(tab.id as typeof calculationType);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-[#00E5FF] font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Plot / Area Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                پیمائش / رقبہ ({currentRateConfig.unit}):
              </label>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {areaSqft.toLocaleString()} {currentRateConfig.unit}
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                { label: '5 مرلہ (1,125 sqft)', val: 1125 },
                { label: '7 مرلہ (1,575 sqft)', val: 1575 },
                { label: '10 مرلہ (2,250 sqft)', val: 2250 },
                { label: '1 کنال (4,500 sqft)', val: 4500 },
                { label: '1 کمرہ (250 sqft)', val: 250 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetArea(p.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                    areaSqft === p.val
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="50"
              max="6000"
              step="50"
              value={areaSqft}
              onChange={(e) => setAreaSqft(parseInt(e.target.value, 10))}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          {/* Quality Grade & Material Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                میٹریل کوالٹی (Grade):
              </label>
              <div className="flex bg-[#121926] p-1 rounded-xl border border-white/10">
                {(['economy', 'standard', 'premium'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      playCrystalTap(soundEnabled);
                      setQualityGrade(grade);
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium capitalize transition ${
                      qualityGrade === grade
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {grade === 'economy' ? 'اکانومی (A)' : grade === 'standard' ? 'سٹینڈرڈ (A+)' : 'پریمیم (VIP)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ٹھیکہ کی نوعیت:
              </label>
              <div className="flex bg-[#121926] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setIncludeMaterial(true)}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
                    includeMaterial
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  میٹریل + لیبر بمعہ سامان
                </button>
                <button
                  onClick={() => setIncludeMaterial(false)}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition ${
                    !includeMaterial
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  صرف مزدوری (Labor Only)
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 bg-gradient-to-br from-cyan-950/40 via-[#101826] to-[#0A0F1A] border border-cyan-500/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">کل تخمینی لاگت (Estimated Cost):</span>
              <span className="text-xl sm:text-2xl font-black text-[#00E5FF] font-latin">
                Rs. {totalCost.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-white/10 pt-2 grid grid-cols-2 gap-2 text-xs text-slate-400 font-latin">
              <div>
                لیبر خرچ: <span className="text-white font-semibold">Rs. {laborPortion.toLocaleString()}</span>
              </div>
              <div>
                سامان / میٹریل: <span className="text-white font-semibold">Rs. {materialPortion.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 border-t border-white/5 pt-2">
              * یہ تخمینہ پنجاب، سندھ اور وفاقی دارالحکومت کے موجودہ معیاری ریٹس کے مطابق ہے۔ سائٹ وزٹ کے بعد تفصیلی BOQ فراہم کیا جائے گا۔
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onBookEstimatedWork(
                currentRateConfig.serviceId,
                `${currentRateConfig.nameUrdu} - رقبہ: ${areaSqft} sqft - تخمینہ: Rs. ${totalCost.toLocaleString()}`
              );
              onClose();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#00E5FF] to-cyan-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>اس تخمینہ کے ساتھ ماہر کاریگر طلب کریں</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
