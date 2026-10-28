import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'dti' | 'affordability' | 'fraud'>('landing');

  // Состояния для калькулятора DTI
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [monthlyDebt, setMonthlyDebt] = useState<string>('');
  const [dtiResult, setDtiResult] = useState<number | null>(null);

  // Состояния для калькулятора доступности
  const [salary, setSalary] = useState<string>('');
  const [termMonths, setTermMonths] = useState<string>('12');
  const [affordResult, setAffordResult] = useState<number | null>(null);

  // Состояния для анализатора текстов
  const [fraudText, setFraudText] = useState<string>('');
  const [fraudAnalysis, setFraudAnalysis] = useState<{ risk: string; score: number; reasons: string[] } | null>(null);

  const calculateDTI = () => {
    const inc = parseFloat(monthlyIncome);
    const debt = parseFloat(monthlyDebt);
    if (!inc || inc <= 0) return;
    const ratio = (debt / inc) * 100;
    setDtiResult(Math.round(ratio));
  };

  const calculateAffordability = () => {
    const sal = parseFloat(salary);
    const months = parseFloat(termMonths);
    if (!sal || !months) return;
    // Пример расчета доступного лимита кредита исходя из 40% от доходов
    const maxMonthlyPayment = sal * 0.4;
    const totalLimit = maxMonthlyPayment * months;
    setAffordResult(Math.round(totalLimit));
  };

  const analyzeFraud = () => {
    if (!fraudText.trim()) return;
    const textLower = fraudText.toLowerCase();
    let score = 10;
    const reasons: string[] = [];

    if (textLower.includes('код') || textLower.includes('пароль') || textLower.includes('cvv')) {
      score += 50;
      reasons.push('⚠️ Запрос конфиденциальных данных (пароли, коды из СМС)');
    }
    if (textLower.includes('срочно') || textLower.includes('внимание')  || textLower.includes('заблокирован')) {
      score += 30;
      reasons.push('⚡ Создание искусственной паники и спешки');
    }
    if (textLower.includes('перевод') || textLower.includes('карта') || textLower.includes('безопасный счет')) {
      score += 40;
      reasons.push('💳 Упоминание переводов или "безопасных счетов"');
    }

    if (score > 100) score = 100;
    const risk = score > 60 ? 'Высокий риск мошенничества!' : score > 30 ? 'Средний риск' : 'Низкий риск';
    setFraudAnalysis({ risk, score, reasons });
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-sans pb-12">
      {/* Шапка */}
      <header className="border-b border-slate-800 bg-[#0b132b]/80 backdrop-blur sticky top-0 z-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <span className="text-2xl">🛡️</span>
          <span className="font-bold text-lg text-white">FinShield</span>
        </div>
        <nav className="flex space-x-2 text-xs sm:text-sm">
          <button onClick={() => setActiveTab('dti')} className={`px-2 py-1 rounded ${activeTab === 'dti' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>DTI</button>
          <button onClick={() => setActiveTab('affordability')} className={`px-2 py-1 rounded ${activeTab === 'affordability' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Кредит</button>
          <button onClick={() => setActiveTab('fraud')} className={`px-2 py-1 rounded ${activeTab === 'fraud' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Антифрод</button>
        </nav>
      </header>

      {/* Основной контент */}
      <main className="max-w-md mx-auto p-4 mt-4">
        {activeTab === 'landing' && (
          <div className="text-center space-y-6 mt-6">
            <div className="text-5xl">🛡️</div>
            <h1 className="text-2xl font-bold">Қаржылық қауіпсіздік және көмекші — FinShield</h1>
            <p className="text-slate-400 text-sm">Қарызыңызды есептеңіз, алаяқтардан қорғаныңыз және қаржыңызды сенімді басқарыңыз.</p>
            
            <div className="space-y-3 pt-4">
              <button onClick={() => setActiveTab('dti')} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-medium transition">
                📊 Қарыз жүктемесін есептеу (DTI)
              </button>
              <button onClick={() => setActiveTab('affordability')} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-medium transition">
                💳 Несие мүмкіндігін тексеру
              </button>
              <button onClick={() => setActiveTab('fraud')} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-medium transition">
                🔍 Алаяқтық мәтінін тексеру
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dti' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><span>📊</span> DTI Калькуляторы</h2>
            <p className="text-xs text-slate-400">Кредиттік жүктеме коэффициентін есептеңіз.</p>
            
            <div>
              <label className="text-xs text-slate-400">Айлық табысыңыз (₸):</label>
              <input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} placeholder="Мысалы: 300000" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Ай сайынғы төлемдер сомасы (₸):</label>
              <input type="number" value={monthlyDebt} onChange={e => setMonthlyDebt(e.target.value)} placeholder="Мысалы: 90000" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            </div>

            <button onClick={calculateDTI} className="w-full bg-blue-600 py-3 rounded-xl font-medium">Есептеу</button>

            {dtiResult !== null && (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl text-center border border-slate-800">
                <div className="text-sm text-slate-400">Сіздің DTI көрсеткішіңіз:</div>
                <div className={`text-2xl font-bold mt-1 ${dtiResult > 50 ? 'text-red-400' : 'text-green-400'}`}>{dtiResult}%</div>
                <div className="text-xs text-slate-400 mt-2">
                  {dtiResult > 50 ? '⚠️ Жоғары қарыз жүктемесі! Сақ болыңыз.' : '✅ Қарыз жүктемесі қалыпты шекте.'}
                </div>
              </div>
            )}
            <button onClick={() => setActiveTab('landing')} className="text-xs text-blue-400 block mx-auto pt-2">← Басты бетке қайту</button>
          </div>
        )}

        {activeTab === 'affordability' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><span>💳</span> Несие мүмкіндігі</h2>
            <div>
              <label className="text-xs text-slate-400">Айлық жалақы (₸):</label>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="250000" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Мерзімі (ай):</label>
              <input type="number" value={termMonths} onChange={e => setTermMonths(e.target.value)} placeholder="12" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white" />
            </div>
            <button onClick={calculateAffordability} className="w-full bg-blue-600 py-3 rounded-xl font-medium">Тексеру</button>

            {affordResult !== null && (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl text-center border border-slate-800">
                <div className="text-sm text-slate-400">Рұқсат етілген жалпы лимит:</div>
                <div className="text-xl font-bold text-green-400 mt-1">{affordResult.toLocaleString()} ₸</div>
              </div>
            )}
            <button onClick={() => setActiveTab('landing')} className="text-xs text-blue-400 block mx-auto pt-2">← Басты бетке қайту</button>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><span>🔍</span> Антифрод Анализатор</h2>
            <p className="text-xs text-slate-400">Күмәнді хабарлама немесе SMS мәтінін енгізіңіз:</p>
            
            <textarea rows={4} value={fraudText} onChange={e => setFraudText(e.target.value)} placeholder="Мысалы: Банктен хабарласамыз, картаңыз бұғатталды, кодты айтыңыз..." className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm" />

            <button onClick={analyzeFraud} className="w-full bg-blue-600 py-3 rounded-xl font-medium">Тексеру</button>

            {fraudAnalysis && (
              <div className="mt-4 p-4 bg-slate-950 rounded-xl space-y-2 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Қауіп деңгейі:</span>
                  <span className={`font-bold ${fraudAnalysis.score > 50 ? 'text-red-400' : 'text-green-400'}`}>{fraudAnalysis.risk}</span>
                </div>
                {fraudAnalysis.reasons.length > 0 && (
                  <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                    {fraudAnalysis.reasons.map((r, i) => <div key={i}>{r}</div>)}
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setActiveTab('landing')} className="text-xs text-blue-400 block mx-auto pt-2">← Басты бетке қайту</button>
          </div>
        )}
      </main>
    </div>
  );
}
