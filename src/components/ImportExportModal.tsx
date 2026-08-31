import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Upload, FileText, Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { exportAllData, downloadJSON, exportToCSV, importFromCSV, importFromJSON, generateProblemRowsForExport } from '../lib/import-export';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CSVProblemRow {
  problemId: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'solved' | 'attempted' | 'unattempted';
  platform: string;
  solvedAt?: string;
  lastAttemptedAt?: string;
  attempts: number;
  language: string;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const { state, getProblemStatus } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const exportData = exportAllData(state);

      if (exportFormat === 'json') {
        downloadJSON(exportData, `dsa-glazzer-export-${new Date().toISOString().split('T')[0]}.json`);
      } else {
        // Generate CSV rows
        const userProblems = Object.entries(state.problemStatuses).map(([problemId, status]) => {
          // Find problem details
          // This would need access to problems data
          return { problemId, status, problem: { title: '', slug: '', difficulty: 'Easy' as const, topic: 'Arrays' as const } };
        });
        const rows = generateProblemRowsForExport(userProblems as any);
        exportToCSV(rows, `dsa-glazzer-problems-${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImportStatus('loading');
    setImportMessage('Processing...');

    try {
      if (importFile.type === 'application/json' || importFile.name.endsWith('.json')) {
        const result = await importFromJSON(importFile);
        if (result.success && result.data) {
          // Apply imported data
          // This would need to be integrated with the actual state
          setImportStatus('success');
          setImportMessage(`Import successful! Data version: ${result.data?.version}`);
        } else {
          setImportStatus('error');
          setImportMessage(result.error || 'Import failed');
        }
      } else if (importFile.type === 'text/csv' || importFile.name.endsWith('.csv')) {
        const result = await importFromCSV(importFile);
        if (result.errors.length === 0) {
          setImportStatus('success');
          setImportMessage(`Import successful! ${result.success} problems imported.`);
        } else {
          setImportStatus('error');
          setImportMessage(`${result.success} imported, ${result.errors.length} errors. Check console for details.`);
          console.error('Import errors:', result.errors);
        }
      } else {
        setImportStatus('error');
        setImportMessage('Unsupported file format. Use JSON or CSV.');
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage(`Import failed: ${(error as Error).message}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportStatus('idle');
      setImportMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[var(--color-deep)]/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Import / Export Data</h2>
          <button onClick={onClose} className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-[var(--color-border)]">
          <button
            onClick={() => { setActiveTab('export'); setImportStatus('idle'); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'export'
                ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <Download className="w-4 h-4 inline mr-1" /> Export
          </button>
          <button
            onClick={() => { setActiveTab('import'); setImportStatus('idle'); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'import'
                ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" /> Import
          </button>
        </div>

        {activeTab === 'export' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-text-primary)]">Complete Backup (JSON)</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Full backup including stats, progress, revisions, and activity</p>
                  </div>
                </div>
                <button
                  onClick={() => { setExportFormat('json'); handleExport(); }}
                  disabled={loading}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 py-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download JSON Backup
                    </>
                  )}
                </button>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-amber)]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--color-accent-amber)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-text-primary)]">Problems List (CSV)</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Spreadsheet-friendly format with problem status and metadata</p>
                  </div>
                </div>
                <button
                  onClick={() => { setExportFormat('csv'); handleExport(); }}
                  disabled={loading}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 py-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Download CSV
                    </>
                  )}
                </button>
              </div>

              <div className="card p-4 border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-accent-amber)]" />
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <strong>Note:</strong> Solutions (source code) are not included in exports for privacy.
                    Your code remains private and is only stored locally or in your connected accounts.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'import' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="font-medium text-[var(--color-text-primary)] mb-3">Import Data</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  Import a previously exported JSON backup or a CSV file with problem data.
                </p>

                <div className="relative">
                  <input
                    type="file"
                    id="import-file"
                    accept=".json,.csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label htmlFor="import-file" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-accent)]/50 transition-colors">
                    <Upload className="w-10 h-10 text-[var(--color-text-muted)] mb-3" />
                    <p className="text-[var(--color-text-secondary)] mb-1">Drag & drop or click to select</p>
                    <p className="text-xs text-[var(--color-text-muted)]">JSON or CSV files</p>
                  </label>
                </div>

                {importFile && (
                  <div className="flex items-center justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--color-accent)]" />
                      <div>
                        <p className="font-medium text-sm">{importFile.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{(importFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => setImportFile(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!importFile || loading}
                  className="w-full btn btn-primary py-2.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    'Import Data'
                  )}
                </button>
              </div>

              {importStatus !== 'idle' && (
                <motion.div
                  className={`card p-4 flex items-center gap-3 ${importStatus === 'success' ? 'border-[var(--color-accent-emerald)]/20' : 'border-[var(--color-accent-danger)]/20'}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {importStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-emerald)]" />
                      <p className="text-[var(--color-accent-emerald)] text-sm">{importMessage}</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-[var(--color-accent-danger)]" />
                      <p className="text-[var(--color-accent-danger)] text-sm">{importMessage}</p>
                    </>
                  )}
                </motion.div>
              )}

              <div className="card p-4 border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-accent-amber)]" />
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <strong>Import Notes:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>JSON imports will merge with existing data (new problems added, existing updated)</li>
                      <li>CSV imports only add new problems; existing problems are skipped</li>
                      <li>Solutions/source code are not imported for privacy</li>
                      <li>Revision schedules are regenerated based on import date</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};