import React, { useRef, useState, useEffect } from 'react';
import { 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getRevisionIntervals, setRevisionIntervals, DEFAULT_INTERVALS } from '../utils/spacedRepetition';

export const Settings: React.FC = () => {
  const { 
    notificationPermission, 
    requestNotificationPermission, 
    exportDatabase, 
    importDatabase, 
    resetDatabase,
    triggerNotification
  } = useDatabase();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [intervals, setIntervals] = useState<number[]>(DEFAULT_INTERVALS);
  const [newInterval, setNewInterval] = useState('');

  useEffect(() => {
    setIntervals(getRevisionIntervals());
  }, []);

  const handleAddInterval = () => {
    const value = parseInt(newInterval, 10);
    if (!isNaN(value) && value > 0 && value <= 365 && !intervals.includes(value)) {
      const updated = [...intervals, value].sort((a, b) => a - b);
      setIntervals(updated);
      setRevisionIntervals(updated);
      setNewInterval('');
    }
  };

  const handleRemoveInterval = (value: number) => {
    if (intervals.length <= 1) return;
    const updated = intervals.filter(i => i !== value);
    setIntervals(updated);
    setRevisionIntervals(updated);
  };

  const handleResetIntervals = () => {
    setIntervals(DEFAULT_INTERVALS);
    setRevisionIntervals(DEFAULT_INTERVALS);
  };

  // Handle Export data
  const handleExport = () => {
    try {
      const dataStr = exportDatabase();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dsa-revision-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      triggerNotification('Backup Exported', 'Your DSA revision backup was downloaded successfully.');
    } catch (e) {
      console.error(e);
      alert('Failed to export backup.');
    }
  };

  // Handle Import data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const success = importDatabase(result);
      if (success) {
        setImportStatus('success');
        triggerNotification('Backup Imported', 'All question logs have been successfully restored.');
        setTimeout(() => setImportStatus('idle'), 3000);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle Reset database
  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    resetDatabase();
    setResetConfirm(false);
    triggerNotification('Database Reset', 'All local storage questions have been removed.');
    window.location.reload(); // Reload to refresh seed state if any
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1 block">Preferences</span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Settings & Sync</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage your browser notifications, export/import tracker data, and reset options.
        </p>
      </div>

      <div className="space-y-4">
        {/* Notifications Preference */}
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20 shrink-0">
              <Bell size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Browser Push Notifications</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Receive notifications when you have question revisions due today.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                <span>Status:</span>
                <span className={`font-semibold capitalize ${
                  notificationPermission === 'granted' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : notificationPermission === 'denied' 
                      ? 'text-rose-600 dark:text-rose-455' 
                      : 'text-zinc-500'
                }`}>
                  {notificationPermission === 'default' ? 'Not requested yet' : notificationPermission}
                </span>
              </div>
            </div>
          </div>
          
          {notificationPermission !== 'granted' && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={requestNotificationPermission}
              className="shrink-0 active:scale-[0.98]"
            >
              Request Permission
            </Button>
          )}
        </Card>

        {/* Sync Backup and Restore */}
        <Card className="p-5 space-y-4">
          <div className="flex gap-4 items-start border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0">
              <Download size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Backup & Restore</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                Save your progress. Export all solved questions and scheduled repetitions to a local JSON file.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Export */}
            <Button variant="secondary" size="sm" onClick={handleExport} className="cursor-pointer">
              <Download size={14} />
              Export Backup JSON
            </Button>

            {/* Import */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <Button variant="secondary" size="sm" onClick={triggerFileInput} className="cursor-pointer">
              <Upload size={14} />
              Import Backup JSON
            </Button>

            {/* Status alerts */}
            {importStatus === 'success' && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse-subtle">
                <Check size={14} /> Backup loaded successfully!
              </span>
            )}
            {importStatus === 'error' && (
              <span className="text-xs text-red-650 dark:text-red-400 flex items-center gap-1 font-semibold">
                <AlertTriangle size={14} /> Invalid file format.
              </span>
            )}
          </div>
        </Card>

        {/* Spaced Repetition Intervals */}
        <Card className="p-5 space-y-4">
          <div className="flex gap-4 items-start border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
              <RotateCcw size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Spaced Repetition Intervals</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                Customize the revision schedule intervals (in days). Default: 3, 7, 30 days.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {intervals.map((interval, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Day {interval}</span>
                  <button
                    onClick={() => handleRemoveInterval(interval)}
                    className="p-0.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                    aria-label={`Remove ${interval} day interval`}
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="365"
                placeholder="Add interval (days)"
                value={newInterval}
                onChange={(e) => setNewInterval(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInterval()}
                className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-500 w-40"
              />
              <Button variant="secondary" size="sm" onClick={handleAddInterval} className="cursor-pointer">
                <Plus size={14} />
                Add
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={handleResetIntervals} className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
              <RotateCcw size={13} />
              Reset to Default (3, 7, 30)
            </Button>
          </div>
        </Card>

        {/* Reset Database (Danger Zone) */}
        <Card className="p-5 border-red-200 dark:border-red-950/30 bg-red-500/[0.02] space-y-4">
          <div className="flex gap-4 items-start border-b border-red-100 dark:border-red-950/20 pb-4">
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20 shrink-0">
              <Trash2 size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-red-650 dark:text-red-400">Danger Zone</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                Permanently delete all solved questions, stats, and streaks from this browser. This action is irreversible.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant={resetConfirm ? 'danger' : 'secondary'} 
              size="sm" 
              onClick={handleReset}
              className="cursor-pointer"
            >
              <Trash2 size={14} />
              {resetConfirm ? 'Click to Confirm Reset' : 'Reset Database'}
            </Button>
            
            {resetConfirm && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResetConfirm(false)}
                className="text-xs font-semibold text-zinc-500"
              >
                Cancel
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Settings;
