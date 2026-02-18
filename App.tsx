
import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Search, 
  Database, 
  Layers, 
  Clock, 
  Activity, 
  Shield,
  Save,
  AlertCircle,
  Briefcase,
  ExternalLink,
  Sun,
  Moon,
  Globe,
  Link as LinkIcon,
  PieChart,
  RefreshCcw,
  X,
  FileText,
  MousePointer2,
  Users,
  Terminal
} from 'lucide-react';
import { AppMode, InsightReport, SystemTelemetry, GroundingSource } from './types';
import { geminiService } from './services/geminiService';
import { memoryService } from './services/memoryService';

const STRATEGIC_TEMPLATES = [
  { 
    title: "Market Vectoring", 
    prompt: "Identify the top 5 material innovation trends in the sustainable activewear market for the upcoming fiscal year.", 
    icon: Globe,
    category: "Strategic Research"
  },
  { 
    title: "Competitor Benchmarking", 
    prompt: "Extract core pricing tiers and discounting patterns for high-end organic skincare leaders.", 
    icon: Database,
    category: "Market Positioning"
  },
  { 
    title: "Data Forensics", 
    prompt: "Conduct a sentiment audit on premium home appliance feedback to identify feature gaps.", 
    icon: Layers,
    category: "Operational Audit"
  },
  { 
    title: "Category Expansion", 
    prompt: "Forecast 3 underserved product niches in the pet technology sector based on emerging consumer interest.", 
    icon: BarChart3,
    category: "Growth Vectoring"
  }
];

const SystemOverview: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-[var(--bg-side)] w-full max-w-2xl rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden transition-colors duration-500">
      <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-blue-500" />
          <h2 className="text-xl font-black uppercase tracking-tight">Vantage Platform Overview</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">About the Platform</h3>
          <p className="text-[var(--text-muted)] font-medium leading-relaxed">
            Vantage Enterprise is a custom-built strategic data environment designed for high-stakes business decision-making. 
            Developed for professional e-commerce management, it bridges the gap between raw data and executive action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Grounded Research", desc: "Native external data nexus for real-world competitive accuracy.", icon: Globe },
            { title: "Proprietary Forensics", desc: "Custom ingestion logic optimized for audit logs.", icon: Layers },
            { title: "Precision Telemetry", desc: "Real-time visibility into system latency and reliability.", icon: Activity },
            { title: "Team Attribution", desc: "Engineered and maintained by Team KSB 48.", icon: Users }
          ].map((f, i) => (
            <div key={i} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex gap-4">
              <f.icon className="text-slate-500 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-sm text-[var(--text-main)]">{f.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="text-blue-600" size={18} />
            <div>
              <div className="text-[10px] font-black uppercase text-blue-600">Lead Architect</div>
              <div className="text-sm font-bold text-[var(--text-main)]">Chirag Tankan</div>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team KSB 48</div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.QUICK_CONSULT);
  const [strategy, setStrategy] = useState('');
  const [rawData, setRawData] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<InsightReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const scrollAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStrategy(memoryService.getStrategy());
    const savedTheme = localStorage.getItem('vantage_theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (report || error || isProcessing) {
      const timer = setTimeout(() => {
        scrollAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [report, error, isProcessing]);

  const toggleTheme = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem('vantage_theme', newVal ? 'dark' : 'light');
  };

  // Fix: Added handleApplySuggestion to fix "Cannot find name 'handleApplySuggestion'" error.
  const handleApplySuggestion = (suggestionText: string) => {
    setPrompt(suggestionText);
  };

  const handleSaveStrategy = () => {
    memoryService.saveStrategy(strategy);
    setStatusText("Directive committed.");
    setTimeout(() => setStatusText(''), 3000);
  };

  const handleRun = async () => {
    if (!prompt.trim() || cooldown > 0) return;
    setError(null);
    setIsProcessing(true);
    setReport(null);

    try {
      if (mode === AppMode.DEEP_ANALYSIS) {
        setStatusText("Aggregating internal data...");
        const context = await memoryService.retrieveRelevantContext(prompt, rawData);
        setStatusText("Compiling report...");
        const result = await geminiService.processRequest(prompt, mode, strategy, context);
        setReport(result);
      } else {
        setStatusText("Querying market vectors...");
        const result = await geminiService.processRequest(prompt, mode, strategy);
        setReport(result);
      }
    } catch (err: any) {
      setError(err.message || "Executive Platform Failure.");
      if (err.message?.includes('capacity')) {
        setCooldown(20);
      }
    } finally {
      setIsProcessing(false);
      setStatusText('');
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen flex transition-colors duration-500`}>
      {showOverview && <SystemOverview onClose={() => setShowOverview(false)} />}
      
      <div className="flex flex-col lg:flex-row w-full bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-500">
        
        <aside className="w-full lg:w-80 border-r border-[var(--border-color)] bg-[var(--bg-side)] p-6 flex flex-col h-screen lg:sticky top-0 z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg">
                <Shield size={22} className="text-blue-500" />
              </div>
              <h1 className="text-lg font-black tracking-tighter uppercase">Vantage <span className="text-slate-500">Pro</span></h1>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowOverview(true)} className="p-2 rounded-lg hover:bg-[var(--bg-surface-alt)] text-slate-500">
                <Terminal size={18} />
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--bg-surface-alt)]">
                {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto pr-2">
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">Enterprise Directive</label>
              <textarea 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full h-32 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 text-sm focus:ring-1 focus:ring-slate-500 outline-none transition-all resize-none text-[var(--text-main)]"
                placeholder="Platform baseline objectives..."
              />
              <button onClick={handleSaveStrategy} className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all">
                <Save size={14} /> Commit Context
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">Workspace Mode</label>
              {[
                { id: AppMode.QUICK_CONSULT, label: 'Market Research', icon: Globe, desc: 'External Vectoring' },
                { id: AppMode.DEEP_ANALYSIS, label: 'Audit Workspace', icon: Layers, desc: 'Internal Forensics' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id as AppMode)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    mode === opt.id ? 'border-slate-900 bg-slate-900/5' : 'border-[var(--border-color)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <opt.icon size={20} className={mode === opt.id ? 'text-slate-900 dark:text-white' : 'text-[var(--text-muted)]'} />
                  <div className="text-left">
                    <div className={`text-sm font-bold ${mode === opt.id ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>{opt.label}</div>
                    <div className="text-[10px] text-slate-400">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border-color)] text-[10px] font-bold text-slate-400">
            <div className="flex justify-between mb-2 uppercase tracking-widest">
              <span>Platform Status</span>
              <span className="text-green-500">● Operational</span>
            </div>
            <div className="p-3 bg-[var(--bg-surface)] rounded-lg space-y-1 border border-[var(--border-color)]">
              <div className="flex justify-between"><span>Core:</span> <span className="text-slate-800 dark:text-white">Vector Core v2.2</span></div>
              <div className="flex justify-between"><span>Authority:</span> <span className="text-slate-800 dark:text-white">Team KSB 48</span></div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {statusText && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
              <RefreshCcw size={14} className="animate-spin" /> {statusText}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 lg:p-12 pb-72 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {!report && !isProcessing && (
                <div className="py-12 text-center space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest border border-[var(--border-color)]">
                      <Shield size={14} className="text-blue-500" /> Enterprise Strategic Portal
                    </div>
                    <h2 className="text-5xl font-black tracking-tight leading-tight text-[var(--text-main)]">
                      Strategic Market <br /> <span className="text-slate-500">Forensics.</span>
                    </h2>
                    <p className="text-lg text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
                      Custom data environment for elite e-commerce operations. Professional data-driven vectoring.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Standard Research Directives</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      {STRATEGIC_TEMPLATES.map((s, idx) => (
                        <button key={idx} onClick={() => handleApplySuggestion(s.prompt)} className="group p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-slate-800 transition-all hover:shadow-lg text-left flex flex-col gap-3 relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600">
                              <s.icon size={16} /><span className="text-[10px] font-black uppercase tracking-wider">{s.category}</span>
                            </div>
                            <MousePointer2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-800" />
                          </div>
                          <div className="text-sm font-bold text-[var(--text-main)]">{s.prompt}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {mode === AppMode.DEEP_ANALYSIS && !report && (
                <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-xl">
                  <div className="bg-[var(--card-bg)] p-6 rounded-[14px]">
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-[var(--text-main)]">
                      <Database className="text-slate-500" size={18} /> Internal Record Workspace
                    </div>
                    <textarea 
                      value={rawData}
                      onChange={(e) => setRawData(e.target.value)}
                      placeholder="Input proprietary records for audit..."
                      className="w-full h-48 bg-transparent text-sm font-mono focus:outline-none resize-none text-[var(--text-main)]"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 flex gap-6">
                  <div className="p-3 bg-red-500 rounded-2xl h-fit"><AlertCircle className="text-white" size={24} /></div>
                  <div className="flex-1">
                    <h4 className="font-black uppercase tracking-widest text-xs text-red-500 mb-2">Protocol Warning</h4>
                    <div className="text-sm text-[var(--text-main)] font-medium leading-relaxed">{error}</div>
                    <div className="mt-4">
                       <button onClick={handleRun} disabled={cooldown > 0} className={`px-5 py-2 rounded-lg text-xs font-black uppercase shadow-lg transition-all ${cooldown > 0 ? 'bg-slate-400' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                         {cooldown > 0 ? `Optimizing Workspace (${cooldown}s)` : 'Retry Data Request'}
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {report && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="glass-card rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-slate-500 opacity-5"><FileText size={120} /></div>
                    
                    <div className="mb-8 flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Executive Brief Output</div>
                      <div className="text-[10px] font-bold text-slate-400">ID: VANTAGE-CORE-V2.2</div>
                    </div>

                    <div className="whitespace-pre-wrap text-lg leading-relaxed font-medium text-[var(--text-main)] tracking-wide">
                      {report.content}
                    </div>

                    {report.sources && report.sources.length > 0 && (
                      <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-500">
                          <LinkIcon size={14} /> Supporting Research Data
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {report.sources.map((src, i) => (
                            <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-alt)] transition-all flex items-center justify-between group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Globe size={14} className="text-slate-400 shrink-0" />
                                <span className="text-xs font-bold truncate text-[var(--text-main)]">{src.title}</span>
                              </div>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Platform Latency', value: `${report.telemetry.processingTime.toFixed(2)}s`, icon: Clock, color: 'text-slate-500' },
                      { label: 'Precision Rating', value: report.telemetry.precisionLevel, icon: Shield, color: 'text-blue-600' },
                      { label: 'Reliability Factor', value: `${report.telemetry.relevanceScore}%`, icon: PieChart, color: 'text-slate-800 dark:text-slate-200' }
                    ].map((stat, i) => (
                      <div key={i} className="glass-card p-5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[var(--bg-surface)]"><stat.icon size={20} className={stat.color} /></div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</div>
                          <div className="text-lg font-bold text-[var(--text-main)]">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={scrollAnchor} className="h-20" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 bg-gradient-to-t from-[var(--bg-app)] via-[var(--bg-app)] to-transparent pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-slate-400 dark:bg-slate-800 rounded-[22px] blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
                <div className="relative flex items-center bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-[20px] p-2 shadow-2xl focus-within:border-slate-800 transition-all duration-300">
                  <div className="pl-5 text-slate-400"><Search size={22} /></div>
                  <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                    disabled={isProcessing || cooldown > 0}
                    placeholder={cooldown > 0 ? `Platform cooling down (${cooldown}s)...` : "Enter strategic directive or market inquiry..."}
                    className="flex-1 bg-transparent py-5 px-5 text-[var(--text-main)] placeholder-slate-500 focus:outline-none text-base font-medium disabled:opacity-50"
                  />
                  <button onClick={handleRun} disabled={isProcessing || !prompt.trim() || cooldown > 0} className={`flex items-center gap-2 py-4 px-10 rounded-[14px] font-black transition-all ${isProcessing || !prompt.trim() || cooldown > 0 ? 'bg-slate-200 text-slate-400 dark:bg-slate-800' : 'bg-slate-900 text-white hover:bg-black active:scale-95'}`}>
                    {isProcessing ? <RefreshCcw className="animate-spin" size={18} /> : 'GENERATE BRIEF'}
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] px-2">
                <span>Vantage Enterprise Platform • v2.20 Build</span>
                <span>Maintained by Team KSB 48 • Lead: Chirag Tankan</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
