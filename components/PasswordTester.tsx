import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, RefreshCw, Lock, Eye, EyeOff } from 'lucide-react';
import { analyzePasswordWithAI, SecurityAnalysis } from '../services/gemini';

const PasswordTester: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!password) return;
    setLoading(true);
    const result = await analyzePasswordWithAI(password);
    setAnalysis(result);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-rose-500 bg-rose-500';
    if (score < 70) return 'text-amber-500 bg-amber-500';
    return 'text-emerald-500 bg-emerald-500';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Password Strength Lab</h2>
          <p className="text-slate-400 text-sm">Test potential passwords against AI analysis</p>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password to audit..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !password}
        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
          loading || !password
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
        }`}
      >
        {loading ? (
          <>
            <RefreshCw className="animate-spin" size={20} /> Analyzing...
          </>
        ) : (
          <>
            <ShieldCheck size={20} /> Run Security Audit
          </>
        )}
      </button>

      {analysis && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 uppercase text-xs font-bold tracking-wider">Security Verdict</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold bg-opacity-20 ${getScoreColor(analysis.score).replace('text-', 'bg-').replace('bg-', 'text-')} bg-opacity-10`}>
              {analysis.verdict}
            </span>
          </div>

          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getScoreColor(analysis.score).split(' ')[1]}`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400" /> Vulnerabilities
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h4 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Recommendations
              </h4>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
            <p className="text-blue-200 text-sm text-center">
              Estimated Time to Crack: <span className="font-bold text-white text-lg block mt-1">{analysis.crackTimeEstimate}</span>
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-200/80 text-center">
        ⚠️ Educational use only. Do not enter your real banking or email passwords here.
      </div>
    </div>
  );
};

export default PasswordTester;
