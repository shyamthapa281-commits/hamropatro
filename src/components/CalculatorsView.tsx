import React, { useState, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { triggerCalculationConfetti } from '../utils/confetti';

interface CalculatorsViewProps {
  lang: Language;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ lang }) => {
  const [calcMode, setCalcMode] = useState<'standard' | 'scientific'>('standard');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [useNepaliDigits, setUseNepaliDigits] = useState<boolean>(lang === 'ne');
  const [historyList, setHistoryList] = useState<{ expr: string; result: string }[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

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
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-stone-200/80 p-1 rounded-2xl">
          <button
            id="calc-mode-standard-btn"
            onClick={() => setCalcMode('standard')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              calcMode === 'standard'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {lang === 'ne' ? 'साधारण क्याल्कुलेटर (Standard)' : 'Standard Calculator'}
          </button>
          <button
            id="calc-mode-scientific-btn"
            onClick={() => setCalcMode('scientific')}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              calcMode === 'scientific'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {lang === 'ne' ? 'वैज्ञानिक क्याल्कुलेटर (Scientific)' : 'Scientific Calculator'}
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

      {/* Calculator & History Grid */}
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
    </div>
  );
};
