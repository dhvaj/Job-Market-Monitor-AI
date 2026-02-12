import React, { useState, useCallback } from 'react';
import { Job, JobSchema, LogEntry, AnalysisResult, UserSettings } from './types';
import { MOCK_JOBS, INITIAL_SETTINGS } from './constants';
import { createLog } from './services/logger';
import { analyzeJobMatch } from './services/geminiService';
import { sendDiscordNotification } from './services/discordService';
import JobCard from './components/JobCard';
import LogsPanel from './components/LogsPanel';
import { Play, Settings, Save, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import { z } from 'zod';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  // Helper to add logs
  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, createLog(level, message)]);
  }, []);

  // Simulate Scraping (Playwright)
  const handleScrape = async () => {
    setIsScraping(true);
    addLog('info', 'Starting scraper agent...');
    addLog('info', 'Initializing headless browser (Mock Playwright)...');
    
    // Simulate network delay
    setTimeout(() => {
      addLog('info', 'Navigating to Mock Job Board...');
      
      try {
        // Validate mock data using Zod (like Pydantic)
        const validJobs: Job[] = [];
        let validationErrors = 0;

        MOCK_JOBS.forEach((rawJob, index) => {
          const result = JobSchema.safeParse(rawJob);
          if (result.success) {
            validJobs.push(result.data);
          } else {
            validationErrors++;
            addLog('warning', `Validation failed for job index ${index}: ${result.error.message}`);
          }
        });

        setJobs(validJobs);
        addLog('success', `Scraping complete. Found ${validJobs.length} valid jobs. ${validationErrors} skipped.`);
        
        // Auto-analyze after scraping
        handleAnalyzeAll(validJobs);
        
      } catch (e: any) {
        addLog('error', `Scraper failed: ${e.message}`);
      } finally {
        setIsScraping(false);
      }
    }, 1500);
  };

  const handleAnalyzeAll = async (jobsToAnalyze: Job[]) => {
    if (jobsToAnalyze.length === 0) return;

    addLog('info', 'Starting Gemini analysis for retrieved jobs...');
    
    for (const job of jobsToAnalyze) {
      setAnalyzingIds(prev => new Set(prev).add(job.id));
      addLog('info', `Analyzing match for: ${job.title}...`);

      const result = await analyzeJobMatch(job, settings.skills);
      
      setAnalyses(prev => ({ ...prev, [job.id]: result }));
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });

      addLog(
        result.rating >= 8 ? 'success' : 'info', 
        `Analyzed ${job.title}: Rating ${result.rating}/10.`
      );

      // Notification Logic
      if (result.rating >= settings.minRatingForNotify) {
        if (settings.discordWebhook) {
            addLog('info', `Triggering Discord Webhook for ${job.title}...`);
            const sent = await sendDiscordNotification(settings.discordWebhook, job, result);
            if (sent) {
              addLog('success', `Notification sent to Discord for ${job.title}`);
            } else {
              addLog('warning', `Failed to send Discord notification (Check CORS or URL)`);
            }
        } else {
            addLog('warning', `High match found (${result.rating}/10) but no Webhook URL configured.`);
        }
      }
    }
    addLog('success', 'Batch analysis complete.');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Settings Area */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${showSettings ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">JobMonitor AI</h1>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">My Skills</label>
              <textarea
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                value={settings.skills}
                onChange={(e) => setSettings({...settings, skills: e.target.value})}
                placeholder="List your technical skills..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discord Webhook URL</label>
              <input
                type="text"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={settings.discordWebhook}
                onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                placeholder="https://discord.com/api/webhooks/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Used to notify when match rating {'>'}= {settings.minRatingForNotify}.
              </p>
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Threshold</label>
               <div className="flex items-center gap-3">
                 <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={settings.minRatingForNotify}
                    onChange={(e) => setSettings({...settings, minRatingForNotify: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <span className="font-bold text-blue-600 w-6">{settings.minRatingForNotify}</span>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
             <button 
               className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium transition-colors"
               onClick={() => addLog('success', 'Settings saved.')}
             >
               <Save className="w-4 h-4" /> Save Configuration
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
           <h1 className="font-bold text-gray-900">JobMonitor AI</h1>
           <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-gray-100 rounded-md">
             <Settings className="w-5 h-5 text-gray-600" />
           </button>
        </div>

        {/* Toolbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Monitoring Mock Job Board • {jobs.length} Jobs Found</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleScrape}
               disabled={isScraping}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm text-white transition-all
                 ${isScraping ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow active:scale-95'}
               `}
             >
               {isScraping ? (
                 <RefreshCw className="w-4 h-4 animate-spin" />
               ) : (
                 <Play className="w-4 h-4 fill-current" />
               )}
               {isScraping ? 'Scraping...' : 'Run Scraper'}
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {jobs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <RefreshCw className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500">No jobs loaded</p>
              <p className="text-sm">Click "Run Scraper" to fetch jobs from the mock board.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-64"> 
            {/* pb-64 to make room for logs panel */}
              {jobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  analysis={analyses[job.id]}
                  isAnalyzing={analyzingIds.has(job.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Logs Panel - Fixed Bottom */}
        <div className="h-64 bg-gray-900 border-t border-gray-800 flex-shrink-0">
          <LogsPanel logs={logs} onClear={() => setLogs([])} />
        </div>
      </main>

      {/* Overlay for mobile settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
