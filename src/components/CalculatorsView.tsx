import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator as CalcIcon, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Equal, 
  History, 
  Globe, 
  Delete,
  CheckCircle2,
  Coins,
  Percent,
  Landmark,
  Receipt,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { triggerCalculationConfetti } from '../utils/confetti';

interface CalculatorsViewProps {
  lang: Language;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ lang }) => {
  const [calcMode, setCalcMode] = useState<'standard' | 'scientific' | 'loanEmi' | 'goldSilver' | 'vatDiscount'>('standard');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [useNepaliDigits, setUseNepaliDigits] = useState<boolean>(lang === 'ne');
  const [historyList, setHistoryList] = useState<{ expr: string; result: string }[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Nepali Loan EMI State
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(10.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // Gold & Silver Calculator State
  const [metalType, setMetalType] = useState<'fineGold' | 'tejabiGold' | 'silver'>('fineGold');
  const [ratePerTola, setRatePerTola] = useState<number>(165000);
  const [weightTola, setWeightTola] = useState<number>(1);
  const [weightLal, setWeightLal] = useState<number>(0);
  const [makingCharge, setMakingCharge] = useState<number>(3500);
  const [jartiPercent, setJartiPercent] = useState<number>(1.5);

  // VAT & Discount Calculator State
  const [billAmount, setBillAmount] = useState<number>(10000);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [vatPercent, setVatPercent] = useState<number>(13);
  const [isReverseVat, setIsReverseVat] = useState<boolean>(false);

  // Loan EMI Calculation
  const loanResult = useMemo(() => {
    const p = Math.max(0, loanAmount);
    const monthlyRate = Math.max(0, loanInterestRate) / 12 / 100;
    const months = Math.max(1, loanTenureYears * 12);
    if (monthlyRate === 0) {
      const emi = p / months;
      return { emi: Math.round(emi), totalPayment: p, totalInterest: 0, principalPercent: 100, interestPercent: 0, months };
    }
    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (p * monthlyRate * factor) / (factor - 1);
    const totalPayment = emi * months;
    const totalInterest = Math.max(0, totalPayment - p);
    const principalPercent = Math.max(1, Math.min(99, Math.round((p / totalPayment) * 100)));
    const interestPercent = 100 - principalPercent;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent,
      interestPercent,
      months,
    };
  }, [loanAmount, loanInterestRate, loanTenureYears]);

  // Gold & Silver Calculation
  const goldResult = useMemo(() => {
    // 1 Tola = 100 Lal = 11.664 Grams
    const totalTolas = Math.max(0, weightTola) + (Math.max(0, weightLal) / 100);
    const totalGrams = totalTolas * 11.664;
    const baseCost = totalTolas * Math.max(0, ratePerTola);
    const jartiCost = baseCost * (Math.max(0, jartiPercent) / 100);
    const totalCost = baseCost + jartiCost + Math.max(0, makingCharge);
    return {
      totalTolas: Math.round(totalTolas * 1000) / 1000,
      totalGrams: Math.round(totalGrams * 100) / 100,
      baseCost: Math.round(baseCost),
      jartiCost: Math.round(jartiCost),
      makingCharge: Math.max(0, makingCharge),
      totalCost: Math.round(totalCost),
    };
  }, [weightTola, weightLal, ratePerTola, jartiPercent, makingCharge]);

  // VAT & Discount Calculation
  const vatResult = useMemo(() => {
    if (isReverseVat) {
      const rate = Math.max(0, vatPercent) / 100;
      const baseBeforeVat = billAmount / (1 + rate);
      const vatAmount = billAmount - baseBeforeVat;
      return {
        grossBill: billAmount,
        discountAmount: 0,
        taxableAmount: Math.round(baseBeforeVat),
        vatAmount: Math.round(vatAmount),
        finalPayable: billAmount,
      };
    } else {
      const discount = billAmount * (Math.max(0, discountPercent) / 100);
      const taxable = Math.max(0, billAmount - discount);
      const vat = taxable * (Math.max(0, vatPercent) / 100);
      const finalPayable = taxable + vat;
      return {
        grossBill: billAmount,
        discountAmount: Math.round(discount),
        taxableAmount: Math.round(taxable),
        vatAmount: Math.round(vat),
        finalPayable: Math.round(finalPayable),
      };
    }
  }, [billAmount, discountPercent, vatPercent, isReverseVat]);

  // Sync language toggle
  useEffect(() => {
    if (lang === 'ne') setUseNepaliDigits(true);
  }, [lang]);

  // Factorial helper
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleDigit = (digit: string) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(digit);
    } else {
      setDisplayValue((prev) => prev + digit);
    }
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue((prev) => prev + '.');
    }
  };

  const handleOperator = (op: string) => {
    setExpression((prev) => `${prev} ${displayValue} ${op}`);
    setDisplayValue('0');
  };

  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (displayValue.length > 1) {
      setDisplayValue((prev) => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const handleToggleSign = () => {
    if (displayValue !== '0' && displayValue !== 'Error') {
      setDisplayValue((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    }
  };

  const handlePercentage = () => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      setDisplayValue((val / 100).toString());
    }
  };

  const handleScientificFunc = (fn: string) => {
    const val = parseFloat(displayValue);
    if (isNaN(val)) return;

    let res = 0;
    const toRad = angleMode === 'deg' ? (Math.PI / 180) * val : val;

    switch (fn) {
      case 'sin':
        res = Math.sin(toRad);
        break;
      case 'cos':
        res = Math.cos(toRad);
        break;
      case 'tan':
        res = Math.tan(toRad);
        break;
      case 'asin':
        res = angleMode === 'deg' ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
        break;
      case 'acos':
        res = angleMode === 'deg' ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
        break;
      case 'atan':
        res = angleMode === 'deg' ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'cbrt':
        res = Math.cbrt(val);
        break;
      case 'sqr':
        res = Math.pow(val, 2);
        break;
      case 'cube':
        res = Math.pow(val, 3);
        break;
      case 'recip':
        res = 1 / val;
        break;
      case 'abs':
        res = Math.abs(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'log10':
        res = Math.log10(val);
        break;
      case 'exp':
        res = Math.exp(val);
        break;
      case 'fact':
        res = factorial(val);
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      default:
        return;
    }

    if (isNaN(res) || !isFinite(res)) {
      setDisplayValue('Error');
    } else {
      const rounded = Math.round(res * 1e10) / 1e10;
      setDisplayValue(rounded.toString());
      setHistoryList((prev) => [{ expr: `${fn}(${val})`, result: rounded.toString() }, ...prev.slice(0, 19)]);
      triggerCalculationConfetti();
    }
  };

  const handleEvaluate = () => {
    try {
      const fullExpr = `${expression} ${displayValue}`.trim();
      if (!fullExpr) return;

      // Clean expression safely for arithmetic
      // Replace arithmetic visual symbols
      const sanitized = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100')
        .replace(/\^/g, '**');

      // Only allow safe math characters
      if (/[^0-9+\-*/().\s*]/.test(sanitized)) {
        setDisplayValue('Error');
        return;
      }

      // Safe evaluation using Function
      const evalResult = new Function(`return (${sanitized})`)();
      if (typeof evalResult === 'number' && !isNaN(evalResult) && isFinite(evalResult)) {
        const rounded = Math.round(evalResult * 1e10) / 1e10;
        setDisplayValue(rounded.toString());
        setHistoryList((prev) => [{ expr: fullExpr, result: rounded.toString() }, ...prev.slice(0, 19)]);
        setExpression('');
        triggerCalculationConfetti();
      } else {
        setDisplayValue('Error');
      }
    } catch {
      setDisplayValue('Error');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDisplayNumber = (numStr: string) => {
    if (numStr === 'Error') return lang === 'ne' ? 'त्रुटि (Error)' : 'Error';
    if (useNepaliDigits) {
      return toNepaliDigits(numStr);
    }
    return numStr;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8 border border-stone-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/50 rounded-full border border-red-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              <CalcIcon className="w-3.5 h-3.5" />
              {lang === 'ne' ? 'नेपाली डिजिटल क्याल्कुलेटर' : 'Smart Digital Calculators'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'ne' ? 'साधारण तथा वैज्ञानिक क्याल्कुलेटर' : 'Standard & Scientific Calculator'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              {lang === 'ne'
                ? 'दैनिक गणितीय हिसाब, वैज्ञानिक त्रिकोणमिति, घातांक, मेमोरी, र नेपाली/अंग्रेजी अंक समर्थन।'
                : 'Full-featured arithmetic, algebraic, trigonometric, logarithmic, and memory functions with Nepali digit support.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Nepali / English Digits */}
            <button
              onClick={() => setUseNepaliDigits(!useNepaliDigits)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                useNepaliDigits
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs'
                  : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{useNepaliDigits ? 'नेपाली अंक (१२३)' : 'English Digits (123)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/80 dark:bg-stone-800 p-1.5 rounded-2xl">
          <button
            id="calc-mode-standard-btn"
            onClick={() => setCalcMode('standard')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              calcMode === 'standard'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ne' ? 'साधारण (Math)' : 'Standard'}
          </button>
          <button
            id="calc-mode-scientific-btn"
            onClick={() => setCalcMode('scientific')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              calcMode === 'scientific'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {lang === 'ne' ? 'वैज्ञानिक (Scientific)' : 'Scientific'}
          </button>
          <button
            id="calc-mode-loan-btn"
            onClick={() => setCalcMode('loanEmi')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              calcMode === 'loanEmi'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'ऋण किस्ता (EMI)' : 'Loan EMI'}</span>
          </button>
          <button
            id="calc-mode-gold-btn"
            onClick={() => setCalcMode('goldSilver')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              calcMode === 'goldSilver'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'सुनचाँदी (Gold)' : 'Gold & Silver'}</span>
          </button>
          <button
            id="calc-mode-vat-btn"
            onClick={() => setCalcMode('vatDiscount')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
              calcMode === 'vatDiscount'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{lang === 'ne' ? 'भ्याट र छुट (VAT)' : 'VAT & Discount'}</span>
          </button>
        </div>

        {calcMode === 'scientific' && (
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1 rounded-lg transition-all ${
                angleMode === 'deg' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              DEG (डिग्री)
            </button>
            <button
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1 rounded-lg transition-all ${
                angleMode === 'rad' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              RAD (रेडियन)
            </button>
          </div>
        )}
      </div>

      {/* Calculator & History Grid (Standard & Scientific) */}
      {(calcMode === 'standard' || calcMode === 'scientific') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Calculator Body */}
          <div className={`${calcMode === 'scientific' ? 'lg:col-span-8' : 'lg:col-span-7'} bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800`}>
          
          {/* Calculator Screen Display */}
          <div className="bg-stone-950/90 rounded-2xl p-5 mb-6 border border-stone-800/80 text-right space-y-1">
            <div className="text-stone-400 text-xs font-mono min-h-[20px] overflow-x-auto whitespace-nowrap scrollbar-none">
              {useNepaliDigits ? toNepaliDigits(expression) : expression}
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight text-amber-300 break-all select-all">
              {renderDisplayNumber(displayValue)}
            </div>

            {/* Quick action helper buttons inside display */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-800/50">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                {calcMode.toUpperCase()} • {calcMode === 'scientific' ? angleMode.toUpperCase() : ''}
              </span>
              <button
                onClick={copyResult}
                className="hover:text-amber-300 text-stone-400 flex items-center gap-1 font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === 'ne' ? 'कपी गरियो' : 'Copied') : (lang === 'ne' ? 'कपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Scientific Buttons Row (if Scientific mode active) */}
          {calcMode === 'scientific' && (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-4">
              {[
                { label: 'sin', action: () => handleScientificFunc('sin') },
                { label: 'cos', action: () => handleScientificFunc('cos') },
                { label: 'tan', action: () => handleScientificFunc('tan') },
                { label: 'sin⁻¹', action: () => handleScientificFunc('asin') },
                { label: 'cos⁻¹', action: () => handleScientificFunc('acos') },
                { label: 'tan⁻¹', action: () => handleScientificFunc('atan') },
                { label: 'ln', action: () => handleScientificFunc('ln') },
                { label: 'log₁₀', action: () => handleScientificFunc('log10') },
                { label: 'eˣ', action: () => handleScientificFunc('exp') },
                { label: 'x²', action: () => handleScientificFunc('sqr') },
                { label: 'x³', action: () => handleScientificFunc('cube') },
                { label: '√x', action: () => handleScientificFunc('sqrt') },
                { label: '∛x', action: () => handleScientificFunc('cbrt') },
                { label: '1/x', action: () => handleScientificFunc('recip') },
                { label: '|x|', action: () => handleScientificFunc('abs') },
                { label: 'n!', action: () => handleScientificFunc('fact') },
                { label: 'π', action: () => handleScientificFunc('pi') },
                { label: 'e', action: () => handleScientificFunc('e') },
                { label: '(', action: () => handleDigit('(') },
                { label: ')', action: () => handleDigit(')') },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Memory Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={() => {
                setMemory(0);
              }}
              className="py-2 bg-stone-800/80 hover:bg-stone-700 text-stone-400 rounded-xl text-xs font-bold cursor-pointer"
            >
              MC
            </button>
            <button
              onClick={() => setDisplayValue(memory.toString())}
              className="py-2 bg-stone-800/80 hover:bg-stone-700 text-stone-400 rounded-xl text-xs font-bold cursor-pointer"
            >
              MR ({memory})
            </button>
            <button
              onClick={() => setMemory((m) => m + (parseFloat(displayValue) || 0))}
              className="py-2 bg-stone-800/80 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              M+
            </button>
            <button
              onClick={() => setMemory((m) => m - (parseFloat(displayValue) || 0))}
              className="py-2 bg-stone-800/80 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              M-
            </button>
          </div>

          {/* Main Keypad Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <button
              onClick={handleClear}
              className="py-4 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-2xl text-base font-extrabold transition-all active:scale-95 cursor-pointer"
            >
              AC
            </button>
            <button
              onClick={handleBackspace}
              className="py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-2xl text-base font-bold transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              onClick={handlePercentage}
              className="py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-2xl text-base font-bold transition-all active:scale-95 cursor-pointer"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('÷')}
              className="py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleDigit('7')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '७' : '7'}
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '८' : '8'}
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '९' : '9'}
            </button>
            <button
              onClick={() => handleOperator('×')}
              className="py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleDigit('4')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '४' : '4'}
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '५' : '5'}
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '६' : '6'}
            </button>
            <button
              onClick={() => handleOperator('-')}
              className="py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              −
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleDigit('1')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '१' : '1'}
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '२' : '2'}
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '३' : '3'}
            </button>
            <button
              onClick={() => handleOperator('+')}
              className="py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={handleToggleSign}
              className="py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-2xl text-lg font-bold transition-all active:scale-95 cursor-pointer"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="py-4 bg-stone-800/90 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              {useNepaliDigits ? '०' : '0'}
            </button>
            <button
              onClick={handleDecimal}
              className="py-4 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl text-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              .
            </button>
            <button
              onClick={handleEvaluate}
              className="py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-2xl font-black transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-red-900/40 cursor-pointer"
            >
              <Equal className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* History Tape & Quick Reference Panel */}
        <div className={`${calcMode === 'scientific' ? 'lg:col-span-4' : 'lg:col-span-5'} space-y-6`}>
          
          {/* Calculation History */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <History className="w-4 h-4 text-red-700" />
                <span>{lang === 'ne' ? 'हिसाब इतिहास (History Tape)' : 'Calculation History'}</span>
              </h3>
              {historyList.length > 0 && (
                <button
                  onClick={() => setHistoryList([])}
                  className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1 font-semibold"
                  title="इतिहास खाली गर्नुहोस्"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ne' ? 'मेटाउनुहोस्' : 'Clear'}</span>
                </button>
              )}
            </div>

            {historyList.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p>{lang === 'ne' ? 'अहिलेसम्म कुनै हिसाब गरिएको छैन।' : 'No recent calculations.'}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {historyList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setDisplayValue(item.result)}
                    className="p-3 bg-stone-50 hover:bg-red-50/50 rounded-2xl border border-stone-200 transition-colors cursor-pointer text-right group"
                  >
                    <div className="text-[11px] text-stone-500 font-mono">
                      {useNepaliDigits ? toNepaliDigits(item.expr) : item.expr} =
                    </div>
                    <div className="text-base font-extrabold text-stone-900 font-mono group-hover:text-red-700">
                      {renderDisplayNumber(item.result)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Nepali Math Terms Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-sm">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ne' ? 'नेपाली अंक र गणित शब्दावली' : 'Nepali Numerical Terms'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-950 block">जोड (+)</span>
                <span className="text-[11px] text-stone-500">Addition</span>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-950 block">घटाउ (−)</span>
                <span className="text-[11px] text-stone-500">Subtraction</span>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-950 block">गुणन (×)</span>
                <span className="text-[11px] text-stone-500">Multiplication</span>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
                <span className="font-bold text-amber-950 block">भाग (÷)</span>
                <span className="text-[11px] text-stone-500">Division</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      )}

      {/* Nepali Loan & EMI Calculator */}
      {calcMode === 'loanEmi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 rounded-full border border-amber-300/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Landmark className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'ne' ? 'ऋण किस्ता क्याल्कुलेटर' : 'Nepali Loan EMI'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                {lang === 'ne' ? 'घर, गाडी तथा व्यक्तिगत ऋणको मासिक किस्ता' : 'Home, Auto & Personal Loan EMI'}
              </h3>
            </div>

            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ne' ? 'ऋण रकम (Loan Amount)' : 'Principal Loan Amount (NPR)'}
                </label>
                <span className="text-sm font-mono font-extrabold text-amber-700 dark:text-amber-400">
                  रु. {useNepaliDigits ? toNepaliDigits(loanAmount.toLocaleString('en-IN')) : loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '५ लाख', val: 500000 },
                  { label: '१० लाख', val: 1000000 },
                  { label: '२५ लाख', val: 2500000 },
                  { label: '५० लाख', val: 5000000 },
                  { label: '१ करोड', val: 10000000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setLoanAmount(preset.val)}
                    className="text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ne' ? 'वार्षिक ब्याजदर (Annual Interest Rate %)' : 'Annual Interest Rate (%)'}
                </label>
                <span className="text-sm font-mono font-extrabold text-amber-700 dark:text-amber-400">
                  {useNepaliDigits ? toNepaliDigits(loanInterestRate) : loanInterestRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.25"
                value={loanInterestRate}
                onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {lang === 'ne' ? 'ऋण अवधि (Loan Tenure)' : 'Tenure (Years)'}
                </label>
                <span className="text-sm font-mono font-extrabold text-amber-700 dark:text-amber-400">
                  {useNepaliDigits ? toNepaliDigits(loanTenureYears) : loanTenureYears} {lang === 'ne' ? 'वर्ष' : 'Years'} ({useNepaliDigits ? toNepaliDigits(loanResult.months) : loanResult.months} {lang === 'ne' ? 'महिना' : 'Months'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-stone-50 to-orange-500/10 dark:from-stone-900 dark:via-stone-900 dark:to-stone-850 rounded-3xl p-6 sm:p-8 border border-amber-300 dark:border-stone-800 shadow-sm space-y-6">
            <div className="text-center p-6 bg-amber-500/15 dark:bg-amber-950/40 rounded-2xl border border-amber-300/60 dark:border-amber-800/60">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
                {lang === 'ne' ? 'मासिक किस्ता (Monthly EMI):' : 'Estimated Monthly EMI:'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-800 dark:text-amber-200">
                रु. {useNepaliDigits ? toNepaliDigits(loanResult.emi.toLocaleString('en-IN')) : loanResult.emi.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'मूल सावाँ रकम (Principal):' : 'Principal Amount:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {useNepaliDigits ? toNepaliDigits(loanAmount.toLocaleString('en-IN')) : loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'कुल तिर्नुपर्ने ब्याज (Total Interest):' : 'Total Interest:'}</span>
                <span className="font-bold text-red-600 dark:text-red-400 font-mono">
                  रु. {useNepaliDigits ? toNepaliDigits(loanResult.totalInterest.toLocaleString('en-IN')) : loanResult.totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm">
                <span className="text-stone-800 dark:text-stone-200">{lang === 'ne' ? 'कुल भुक्तानी (Total Payment):' : 'Total Payable:'}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono">
                  रु. {useNepaliDigits ? toNepaliDigits(loanResult.totalPayment.toLocaleString('en-IN')) : loanResult.totalPayment.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-700 dark:text-amber-400">{lang === 'ne' ? 'सावाँ' : 'Principal'}: {loanResult.principalPercent}%</span>
                <span className="text-red-600 dark:text-red-400">{lang === 'ne' ? 'ब्याज' : 'Interest'}: {loanResult.interestPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200 dark:bg-stone-800">
                <div style={{ width: `${loanResult.principalPercent}%` }} className="bg-amber-600" />
                <div style={{ width: `${loanResult.interestPercent}%` }} className="bg-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gold & Silver Rate & Weight Calculator */}
      {calcMode === 'goldSilver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 rounded-full border border-amber-300/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'ne' ? 'सुनचाँदी मूल्य तथा गहना हिसाब' : 'Gold & Silver Jeweller Calculator'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                {lang === 'ne' ? 'तोला, लाल, ज्याला र जर्ती हिसाब' : 'Tola, Lal, Making Charge & Wastage'}
              </h3>
            </div>

            {/* Metal Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fineGold', labelNe: 'छापावाल सुन', labelEn: 'Fine Gold', defaultRate: 165000 },
                { id: 'tejabiGold', labelNe: 'तेजाबी सुन', labelEn: 'Tejabi Gold', defaultRate: 164200 },
                { id: 'silver', labelNe: 'चाँदी', labelEn: 'Silver', defaultRate: 2000 },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMetalType(m.id as any);
                    setRatePerTola(m.defaultRate);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    metalType === m.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {lang === 'ne' ? m.labelNe : m.labelEn}
                </button>
              ))}
            </div>

            {/* Rate Input */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {lang === 'ne' ? 'प्रति तोला दर (Rate per Tola - NPR):' : 'Rate per Tola (NPR):'}
              </label>
              <input
                type="number"
                value={ratePerTola}
                onChange={(e) => setRatePerTola(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Weight: Tola & Lal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {lang === 'ne' ? 'तोला (Tola):' : 'Tola:'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={weightTola}
                  onChange={(e) => setWeightTola(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {lang === 'ne' ? 'लाल (Lal - १०० लाल = १ तोला):' : 'Lal (100 Lal = 1 Tola):'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={weightLal}
                  onChange={(e) => setWeightLal(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Making charge & Jarti */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {lang === 'ne' ? 'ज्याला (Making Charge - NPR):' : 'Making Charge (NPR):'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={makingCharge}
                  onChange={(e) => setMakingCharge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {lang === 'ne' ? 'जर्ती (Wastage %):' : 'Wastage (Jarti %):'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={jartiPercent}
                  onChange={(e) => setJartiPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Results Receipt */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-850 rounded-3xl p-6 sm:p-8 border border-amber-300 dark:border-stone-800 shadow-sm space-y-5">
            <div className="text-center p-5 bg-amber-500/20 dark:bg-amber-950/40 rounded-2xl border border-amber-400/50">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
                {lang === 'ne' ? 'कुल मूल्य (Total Payable):' : 'Net Total Amount:'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-900 dark:text-amber-200">
                रु. {useNepaliDigits ? toNepaliDigits(goldResult.totalCost.toLocaleString('en-IN')) : goldResult.totalCost.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'कुल तौल:' : 'Total Weight:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  {goldResult.totalTolas} {lang === 'ne' ? 'तोला' : 'Tola'} ({goldResult.totalGrams} {lang === 'ne' ? 'ग्राम' : 'g'})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'धातुको मूल्य:' : 'Pure Metal Cost:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {goldResult.baseCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'जर्ती रकम:' : 'Jarti (Wastage):'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {goldResult.jartiCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'कालीगढ ज्याला:' : 'Making Charge:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {goldResult.makingCharge.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center">
              १ तोला = १०० लाल = ११.६६४ ग्राम (नेपाल सुनचाँदी व्यवसायी महासंघ मानक)
            </p>
          </div>
        </div>
      )}

      {/* VAT & Discount Calculator */}
      {calcMode === 'vatDiscount' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/70 rounded-full border border-amber-300/40 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Receipt className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'ne' ? 'नेपाली १३% भ्याट तथा छुट क्याल्कुलेटर' : 'Nepal 13% VAT & Discount'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                {lang === 'ne' ? 'बिल, छुट र मूल्य अभिवृद्धि कर (VAT) हिसाब' : 'Invoice, Discount & VAT Breakdown'}
              </h3>
            </div>

            {/* Mode switch: Normal or Reverse */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setIsReverseVat(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isReverseVat ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {lang === 'ne' ? 'सामान्य हिसाब (रकम + छुट + भ्याट)' : 'Standard (Amount + VAT)'}
              </button>
              <button
                type="button"
                onClick={() => setIsReverseVat(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isReverseVat ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {lang === 'ne' ? 'उल्टो हिसाब (भ्याट सहितको कुल बिलबाट)' : 'Reverse (Extract VAT from Bill)'}
              </button>
            </div>

            {/* Bill Amount */}
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {isReverseVat
                  ? (lang === 'ne' ? 'भ्याट सहितको कुल बिल रकम (Gross Bill Amount):' : 'Gross Bill Amount (Inclusive of VAT):')
                  : (lang === 'ne' ? 'सुरुको रकम (Base Amount - NPR):' : 'Base Amount (NPR):')}
              </label>
              <input
                type="number"
                min="0"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {!isReverseVat && (
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {lang === 'ne' ? 'छुट प्रतिशत (Discount %):' : 'Discount Percentage (%):'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {lang === 'ne' ? 'भ्याट प्रतिशत (नेपाल सरकार मानक १३%):' : 'VAT Rate (Nepal Standard 13%):'}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={vatPercent}
                onChange={(e) => setVatPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-850 rounded-3xl p-6 sm:p-8 border border-amber-300 dark:border-stone-800 shadow-sm space-y-5">
            <div className="text-center p-5 bg-amber-500/20 dark:bg-amber-950/40 rounded-2xl border border-amber-400/50">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
                {lang === 'ne' ? 'अन्तिम तिर्नुपर्ने रकम (Final Payable):' : 'Final Payable Amount:'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-900 dark:text-amber-200">
                रु. {useNepaliDigits ? toNepaliDigits(vatResult.finalPayable.toLocaleString('en-IN')) : vatResult.finalPayable.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'सुरुको बिल रकम:' : 'Initial Amount:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {vatResult.grossBill.toLocaleString('en-IN')}
                </span>
              </div>
              {!isReverseVat && (
                <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                  <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'छुट रकम:' : 'Discount Deducted:'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    - रु. {vatResult.discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? 'भ्याट लाग्ने आधार रकम:' : 'Taxable Base Amount:'}</span>
                <span className="font-bold text-stone-900 dark:text-white font-mono">
                  रु. {vatResult.taxableAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-600 dark:text-stone-400">{lang === 'ne' ? '१३% भ्याट कर रकम:' : '13% VAT Amount:'}</span>
                <span className="font-bold text-red-600 dark:text-red-400 font-mono">
                  + रु. {vatResult.vatAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
