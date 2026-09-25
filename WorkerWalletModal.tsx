import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  Check, 
  History, 
  Percent, 
  Smartphone, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { playCrystalTap, playSuccessChime } from '../utils/audioEffects';

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  titleUrdu: string;
  amount: number;
  date: string;
  method?: string;
  referenceId?: string;
  status: 'completed' | 'pending';
}

interface WorkerWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  commissionRate: number; // e.g. 5
  onRecharge: (amount: number, method: string, referenceId: string) => void;
  transactions: WalletTransaction[];
  soundEnabled?: boolean;
}

export const WorkerWalletModal: React.FC<WorkerWalletModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  commissionRate = 5,
  onRecharge,
  transactions,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'recharge' | 'history' | 'calculator'>('recharge');
  
  // Recharge form state
  const [selectedGateway, setSelectedGateway] = useState<'easypaisa' | 'jazzcash' | 'raast'>('easypaisa');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('0345-1234567');
  const [tid, setTid] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Commission Calculator State
  const [calcJobAmount, setCalcJobAmount] = useState<number>(12000);

  if (!isOpen) return null;

  const currentRechargeAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const gatewayDetails = {
    easypaisa: {
      name: 'EasyPaisa (ایزی پیسہ)',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      accountTitle: 'HMS Services (Pvt) Ltd',
      accountNumber: '0345-8829103',
      color: '#00D166',
      icon: '🟢',
      instructions: 'اپنے ایزی پیسہ اکاؤنٹ سے مندرجہ بالا نمبر پر رقم منتقل کریں اور نیچے 11 ہندسوں کا TID درج کریں۔',
    },
    jazzcash: {
      name: 'JazzCash (جاز کیش)',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      accountTitle: 'HMS Home Maintenance Tech',
      accountNumber: '0300-9948271',
      color: '#FF2400',
      icon: '🔴',
      instructions: 'اپنے جاز کیش اکاؤنٹ سے مندرجہ بالا نمبر پر ٹرانسفر کریں اور تصدیقی TID کوڈ درج کریں۔',
    },
    raast: {
      name: 'Raast ID / Bank (راست فوری ادائیگی)',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      accountTitle: 'HMS Digital Platform',
      accountNumber: 'raast@hms.com.pk (یا 03458829103)',
      color: '#FFB800',
      icon: '🟡',
      instructions: 'کسی بھی پاکستانی بینک ایپ سے راست آئی ڈی پر 0% فیس کے ساتھ فوری ٹرانسفر کریں۔',
    },
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(text);
    playCrystalTap(soundEnabled);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleExecuteRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRechargeAmount <= 0) return;

    setIsSubmitting(true);
    playCrystalTap(soundEnabled);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedTid = tid.trim() || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      onRecharge(currentRechargeAmount, gatewayDetails[selectedGateway].name, generatedTid);
      playSuccessChime(soundEnabled);
      setShowSuccessToast(true);
      setTid('');
      setCustomAmount('');

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3500);
    }, 600);
  };

  const calcCommission = (calcJobAmount * commissionRate) / 100;
  const calcWorkerEarnings = calcJobAmount - calcCommission;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B101C] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="relative px-5 py-4 sm:px-6 bg-gradient-to-r from-[#172338] via-[#0E1626] to-[#080D18] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#00E5FF] shadow-lg shadow-cyan-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  کاریگر والیٹ و کمیشن گیٹ وے (Worker Wallet)
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Instant 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ایزی پیسہ، جاز کیش اور راست کے ذریعے اپنے HMS والیٹ کو فوری ریچارج کریں
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
              <span>موجودہ والیٹ بیلنس (Available Balance):</span>
              {walletBalance >= 300 ? (
                <span className="text-emerald-400 flex items-center gap-0.5 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> فعال
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-0.5 text-[11px]">
                  <AlertCircle className="w-3 h-3" /> کم بیلنس
                </span>
              )}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00E5FF] font-latin tracking-tight mt-0.5">
              Rs. {walletBalance.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400">ایپ کمیشن ریٹ</span>
              <span className="text-white font-bold text-sm font-latin">{commissionRate}%</span>
            </div>
            <div className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400">کاریگر کا حصہ</span>
              <span className="text-emerald-400 font-bold text-sm font-latin">{100 - commissionRate}%</span>
            </div>
            <div className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] text-slate-400">کم از کم بیلنس</span>
              <span className="text-cyan-300 font-bold text-sm font-latin">Rs. 300</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 sm:px-6 pt-3 border-b border-white/10 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('recharge');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'recharge'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>والیٹ ریچارج کریں (EasyPaisa / JazzCash)</span>
          </button>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('history');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ٹرانزیکشن تاریخ و لیجر ({transactions.length})</span>
          </button>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              setActiveTab('calculator');
            }}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border-b-2 cursor-pointer ${
              activeTab === 'calculator'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>کمیشن کیلکولیٹر</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

          {/* Success Toast */}
          {showSuccessToast && (
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl flex items-center gap-3 animate-fadeIn text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">مبارک ہو! والیٹ میں رقم شامل ہو گئی ہے</span>
                <span>آپ کا بیلنس اپ ڈیٹ ہو چکا ہے۔ اب آپ بلا تعطل کسٹمرز سے آرڈرز وصول کر سکتے ہیں۔</span>
              </div>
            </div>
          )}

          {/* TAB 1: RECHARGE GATEWAY */}
          {activeTab === 'recharge' && (
            <form onSubmit={handleExecuteRecharge} className="space-y-5">
              
              {/* Step 1: Select Payment Gateway */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  1. ادائیگی کا طریقہ منتخب کریں (Select Payment Gateway):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['easypaisa', 'jazzcash', 'raast'] as const).map((method) => {
                    const info = gatewayDetails[method];
                    const isSelected = selectedGateway === method;
                    return (
                      <button
                        type="button"
                        key={method}
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          setSelectedGateway(method);
                        }}
                        className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40'
                            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base">{info.icon}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${info.badgeColor}`}>
                            {method.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{info.name}</div>
                          <div className="text-[10px] text-slate-400 font-latin mt-0.5">{info.accountNumber}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gateway Account Transfer Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">
                    HMS آفیشل اکاؤنٹ تفصیلات برائے ٹرانسفر:
                  </span>
                  <span className="text-[10px] text-cyan-400 font-latin">Verified Merchant</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-black/40 rounded-xl border border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-400">
                      اکاؤنٹ ٹائٹل: <span className="text-white font-medium">{gatewayDetails[selectedGateway].accountTitle}</span>
                    </div>
                    <div className="text-sm font-bold text-[#00E5FF] font-latin">
                      {gatewayDetails[selectedGateway].accountNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(gatewayDetails[selectedGateway].accountNumber)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    {copiedAccount === gatewayDetails[selectedGateway].accountNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>کاپی ہو گیا!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>اکاؤنٹ نمبر کاپی</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  💡 {gatewayDetails[selectedGateway].instructions}
                </p>
              </div>

              {/* Step 2: Select Quick Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  2. رقم کا انتخاب کریں (Select Amount in PKR):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => {
                    const isSelected = !customAmount && selectedAmount === amt;
                    return (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          playCrystalTap(soundEnabled);
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-3 rounded-xl border font-latin text-center font-bold text-xs sm:text-sm transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-400 text-black border-emerald-300 shadow-md shadow-emerald-500/20'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        Rs. {amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    placeholder="یا کوئی اور رقم درج کریں (مثلاً: 1500)..."
                    className="w-full bg-[#121927] border border-white/15 focus:border-[#00E5FF] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Step 3: Transaction ID / Sender Verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    بھیجنے والے کا موبائل نمبر:
                  </label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-[#121927] border border-white/15 focus:border-[#00E5FF] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ٹرانزیکشن شناختی کوڈ (TID / Trx ID):
                  </label>
                  <input
                    type="text"
                    value={tid}
                    onChange={(e) => setTid(e.target.value)}
                    placeholder="مثال: 48921820491 (SMS سے موصول کوڈ)"
                    className="w-full bg-[#121927] border border-white/15 focus:border-[#00E5FF] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Action Button matching Flutter greenAccent ElevatedButton.icon */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || currentRechargeAmount <= 0}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] disabled:opacity-50 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>ریچارج کی تصدیق کی جا رہی ہے...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-black stroke-[2.5]" />
                      <span>Rs. {currentRechargeAmount.toLocaleString()} فوری ریچارج کریں</span>
                    </>
                  )}
                </button>
                <div className="text-center text-[11px] text-slate-400 mt-2">
                  🔒 محفوظ پیمنٹ گیٹ وے · رقم سیکنڈوں میں آپ کے HMS اکاؤنٹ میں جمع ہو جائے گی
                </div>
              </div>

            </form>
          )}

          {/* TAB 2: TRANSACTION HISTORY LEDGER */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>تمام رقوم کی آمد اور کمیشن کٹوتی کا شفاف ریکارڈ:</span>
                <span className="font-latin text-cyan-400">{transactions.length} Transactions</span>
              </div>

              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 flex items-center justify-between gap-3 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          txn.type === 'credit'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {txn.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white">{txn.titleUrdu}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{txn.date}</span>
                          {txn.method && (
                            <>
                              <span>•</span>
                              <span className="font-latin text-slate-300">{txn.method}</span>
                            </>
                          )}
                          {txn.referenceId && (
                            <>
                              <span>•</span>
                              <span className="font-latin text-cyan-400/80">Ref: {txn.referenceId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div
                        className={`text-sm font-extrabold font-latin ${
                          txn.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {txn.type === 'credit' ? '+' : '-'}Rs. {txn.amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                        کامیاب ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commission Rule Explainer Box */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1.5 mt-4">
                <div className="font-bold text-[#00E5FF] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HMS کمیشن کٹوتی کی شفاف پالیسی:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  کسٹمر سے براہ راست نقد (کیش) یا آن لائن دیہاڑی کاریگر خود وصول کرتا ہے۔ کام مکمل ہونے کے بعد ایپ سروس چارج صرف 5% کمیشن والیٹ سے کاٹتا ہے۔ اس طرح کاریگر اپنی کمائی کا پورا 95% محفوظ رکھتا ہے۔
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMISSION CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  کسٹمر سے طے شدہ کام یا دیہاڑی کی رقم (Job Total in PKR):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="500"
                    value={calcJobAmount}
                    onChange={(e) => setCalcJobAmount(Number(e.target.value))}
                    className="flex-1 accent-[#00E5FF] cursor-pointer"
                  />
                  <div className="w-28 text-center py-1.5 px-2 bg-black/40 rounded-xl border border-white/15 text-sm font-bold font-latin text-[#00E5FF]">
                    Rs. {calcJobAmount.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCalcJobAmount(3500)}
                    className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 text-center font-latin cursor-pointer"
                  >
                    Rs. 3,500 (سنگل وزٹ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcJobAmount(15000)}
                    className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 text-center font-latin cursor-pointer"
                  >
                    Rs. 15,000 (ہفتہ وار کام)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcJobAmount(60000)}
                    className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 text-center font-latin cursor-pointer"
                  >
                    Rs. 60,000 (مکمل پراجیکٹ)
                  </button>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Worker Portion */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      آپ کی جیب میں خالص آمدن (Worker Net):
                    </span>
                    <span className="text-2xl font-extrabold text-emerald-300 font-latin mt-1 block">
                      Rs. {calcWorkerEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-200/80 mt-3 pt-2 border-t border-emerald-500/20">
                    پورے 95% آپ کے اپنے محنت کے پیسے
                  </div>
                </div>

                {/* Platform Commission */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-cyan-400 font-bold block">
                      HMS ایپ سروس کمیشن (5% Platform Fee):
                    </span>
                    <span className="text-2xl font-extrabold text-[#00E5FF] font-latin mt-1 block">
                      Rs. {calcCommission.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-200/80 mt-3 pt-2 border-t border-cyan-500/20">
                    والیٹ سے خودکار کٹوتی برائے کسٹمر کنیکٹیویٹی
                  </div>
                </div>

              </div>

              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/10 text-xs text-slate-400 flex items-center justify-between">
                <span>اس کام کے بعد متوقع بقایا بیلنس:</span>
                <span className="font-latin font-bold text-white">
                  Rs. {Math.max(0, walletBalance - calcCommission).toLocaleString()}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#080D18] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 کسٹمر و کاریگر فنانشل سپورٹ: 0300-8451928</span>
          </div>

          <button
            onClick={() => {
              playCrystalTap(soundEnabled);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
          >
            بند کریں
          </button>
        </div>

      </div>
    </div>
  );
};
