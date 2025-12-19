
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Key, CheckCircle, BrainCircuit, Lock, Fingerprint, ChevronRight, RefreshCw, MessageSquare, ExternalLink, Settings } from 'lucide-react';
import PasswordTester from './components/PasswordTester';
import ComparisonChart from './components/ComparisonChart';
import InfoSection from './components/InfoSection';
import SecurityChat from './components/SecurityChat';
import { getSecurityTip } from './services/gemini';

// Fix: Define the AIStudio interface and update the Window declaration to match expected global types and modifiers.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [tip, setTip] = useState<string>('Loading daily security tip...');
  const [hasKey, setHasKey] = useState<boolean>(true); // Default to true to avoid flicker if they have one

  useEffect(() => {
    checkKey();
    getSecurityTip().then(setTip);

    const handleError = () => {
      setHasKey(false);
    };
    window.addEventListener('gemini-api-error', handleError);
    return () => window.removeEventListener('gemini-api-error', handleError);
  }, []);

  const checkKey = async () => {
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true); // Proceed assuming success as per instructions
    getSecurityTip().then(setTip);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-center">
          <div className="bg-blue-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="text-blue-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">API Setup Required</h1>
          <p className="text-slate-400 mb-8">
            To provide real-time AI analysis and chat, SecurePass Analyst requires a Google Gemini API key. Please select a key from a paid GCP project.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 mb-4"
          >
            Select API Key
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-400 transition-colors"
          >
            Learn about API billing <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 rounded-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">SecurePass<span className="text-blue-500">Analyst</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
              <a href="#importance" onClick={(e) => handleScroll(e, 'importance')} className="hover:text-blue-400 transition-colors">Importance</a>
              <a href="#lab" onClick={(e) => handleScroll(e, 'lab')} className="hover:text-blue-400 transition-colors">Lab</a>
              <a href="#chat" onClick={(e) => handleScroll(e, 'chat')} className="hover:text-blue-400 transition-colors flex items-center gap-1"><MessageSquare size={14}/> Ask AI</a>
              <a href="#recommendations" onClick={(e) => handleScroll(e, 'recommendations')} className="hover:text-blue-400 transition-colors">Best Practices</a>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSelectKey}
                title="Change API Key"
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
              <a 
                href="#lab" 
                onClick={(e) => handleScroll(e, 'lab')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Try the Lab
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] opacity-5 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/80 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 animate-pulse">
            <BrainCircuit size={16} />
            <span>AI-Powered Security Analysis</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Is Your Password <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Secure Enough?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
            Discover the mechanics of password strength, visualize cracking speeds, and audit your security habits with our interactive toolkit.
          </p>
          
          {/* Daily Tip */}
          <div className="max-w-lg mx-auto bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
             <div className="bg-emerald-500/20 p-2 rounded-md shrink-0">
                <CheckCircle className="text-emerald-400 w-5 h-5" />
             </div>
             <div className="text-left">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Analyst Tip of the Moment</h4>
                <p className="text-sm text-slate-300">{tip}</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-32">
        
        {/* Section 1: Importance */}
        <section id="importance" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center scroll-mt-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Why Strong Passwords Matter</h2>
            <div className="space-y-6">
              <InfoSection title="The First Line of Defense" icon={Shield}>
                <p>
                  Passwords act as the gatekeepers to your digital identity. In an era of frequent data breaches, a weak password is like leaving your front door unlocked.
                </p>
              </InfoSection>
              <InfoSection title="Credential Stuffing Attacks" icon={Fingerprint}>
                <p>
                  Attackers use automated bots to try millions of leaked username/password combinations. If you reuse passwords, one breach compromises all your accounts.
                </p>
              </InfoSection>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl">
             <h3 className="text-xl font-bold text-white mb-6">Breach Statistics (2024)</h3>
             <ul className="space-y-4">
               <li className="flex items-center justify-between border-b border-slate-700 pb-2">
                 <span>Attacks per second</span>
                 <span className="text-rose-400 font-mono font-bold">~921</span>
               </li>
               <li className="flex items-center justify-between border-b border-slate-700 pb-2">
                 <span>Avg. cost of breach</span>
                 <span className="text-rose-400 font-mono font-bold">$4.45M</span>
               </li>
               <li className="flex items-center justify-between pb-2">
                 <span>Weak passwords cause</span>
                 <span className="text-rose-400 font-mono font-bold">81% of breaches</span>
               </li>
             </ul>
          </div>
        </section>

        {/* Section 2: Mistakes */}
        <section id="mistakes" className="scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Common Password Mistakes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Even tech-savvy users fall into these convenient but dangerous traps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <InfoSection title="Predictable Patterns" icon={AlertTriangle} variant="alert">
                <p className="mb-2">Humans are predictable. We love patterns like:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm">
                  <li>Keyboard walks (qwerty, asdf)</li>
                  <li>Sequential numbers (123456)</li>
                  <li>Years (Password2023)</li>
                </ul>
             </InfoSection>
             
             <InfoSection title="Personal Information" icon={Fingerprint} variant="alert">
                <p className="mb-2">Using data easily found on social media:</p>
                <ul className="list-disc list-inside text-slate-400 text-sm">
                  <li>Pet names</li>
                  <li>Birthdays or Anniversaries</li>
                  <li>Street names</li>
                </ul>
             </InfoSection>
             
             <InfoSection title="Password Reuse" icon={RefreshCw} variant="alert">
                <p>
                  The "Cardinal Sin" of security. Using the same password for banking and a random forum. If the forum is hacked, your bank is vulnerable.
                </p>
             </InfoSection>
          </div>
        </section>

        {/* Section 3: Interactive Lab & Comparison */}
        <section id="lab" className="scroll-mt-24">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
             <div className="bg-slate-800/50 p-8 border-b border-slate-700">
               <h2 className="text-3xl font-bold text-white">Interactive Security Lab</h2>
               <p className="text-slate-400">Test your passwords and visualize the difference in entropy.</p>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-700 bg-slate-900/50">
                  <PasswordTester />
                </div>
                <div className="p-8 bg-slate-900/50 flex flex-col justify-center">
                  <ComparisonChart />
                </div>
             </div>
           </div>
        </section>
        
        {/* Section 3.5: Chat */}
        <section id="chat" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
               <BrainCircuit size={16} />
               <span>AI Expert Online</span>
             </div>
             <h2 className="text-3xl font-bold text-white">Have Questions? <br/>Ask the Analyst.</h2>
             <p className="text-slate-400 text-lg">
               Unsure if an email is phishing? Wondering how 2FA works? 
               Our AI-powered security analyst is here to answer your specific questions in real-time.
             </p>
             <ul className="space-y-2 text-slate-400">
               <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Personalized security advice</li>
               <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Explanations of complex terms</li>
               <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Available 24/7</li>
             </ul>
          </div>
          <div className="lg:col-span-7">
             <SecurityChat />
          </div>
        </section>

        {/* Section 4: Recommendations */}
        <section id="recommendations" className="max-w-4xl mx-auto scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Security Recommendations</h2>
            <p className="text-slate-400">Actionable steps to secure your digital life immediately.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-emerald-500 shadow-lg flex gap-6 items-start hover:transform hover:scale-[1.01] transition-all">
               <div className="bg-emerald-500/10 p-4 rounded-full">
                 <Lock className="w-8 h-8 text-emerald-500" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Use a Password Manager</h3>
                 <p className="text-slate-400">
                   Stop memorizing. Use tools like Bitwarden, 1Password, or Dashlane. They generate long, random strings for every site and store them in an encrypted vault.
                 </p>
               </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-blue-500 shadow-lg flex gap-6 items-start hover:transform hover:scale-[1.01] transition-all">
               <div className="bg-blue-500/10 p-4 rounded-full">
                 <Key className="w-8 h-8 text-blue-500" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Enable Multi-Factor Authentication (MFA)</h3>
                 <p className="text-slate-400">
                   Even the strongest password can be phished. MFA (like an app generated code or YubiKey) ensures that even if a hacker has your password, they can't get in.
                 </p>
               </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-purple-500 shadow-lg flex gap-6 items-start hover:transform hover:scale-[1.01] transition-all">
               <div className="bg-purple-500/10 p-4 rounded-full">
                 <BrainCircuit className="w-8 h-8 text-purple-500" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white mb-2">Use Passphrases</h3>
                 <p className="text-slate-400">
                   If you must memorize a password (e.g., for your computer login), use a passphrase. 
                   <br/>
                   <span className="font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded text-sm mt-2 inline-block">Correct-Horse-Battery-Staple</span>
                   <br/> 
                   is far stronger and easier to remember than <span className="font-mono text-rose-400 text-sm">Tr0ub4dor&3</span>.
                 </p>
               </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="bg-slate-800/50 rounded-3xl p-12 text-center border border-slate-700">
           <h2 className="text-3xl font-bold text-white mb-6">Conclusion</h2>
           <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
             Password security is not about being a computer genius; it's about adopting the right habits. 
             Length beats complexity, randomness beats patterns, and a password manager beats human memory every time.
           </p>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
           >
             Back to Top <ChevronRight size={16} />
           </button>
        </section>

      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center text-slate-600 text-sm">
        <p className="flex justify-center items-center gap-4 mb-4">
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline">API Billing Info</a>
           <button onClick={handleSelectKey} className="hover:text-blue-400 underline">Update API Key</button>
        </p>
        <p>&copy; {new Date().getFullYear()} SecurePass Analyst. Built for Educational Purposes.</p>
        <p className="mt-2">Powered by Gemini 3 Flash</p>
      </footer>
    </div>
  );
};

export default App;
