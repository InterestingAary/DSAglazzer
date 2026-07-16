import React, { useRef, useState } from 'react';
import { 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
        <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Settings & Sync</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your browser notifications, export/import tracker data, and reset options.
        </p>
      </div>

      <div className="space-y-4">
        {/* Notifications Preference */}
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
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
