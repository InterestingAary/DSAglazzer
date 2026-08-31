import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ChevronDown, ChevronUp, RefreshCw, X, CheckCircle2, AlertCircle, Loader2, Globe, ExternalLink } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

type Platform = 'leetcode' | 'codechef' | 'hackerrank' | 'codecademy';

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
  description: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    icon: <GitBranch className="w-5 h-5" />,
    color: '#FFA116',
    available: true,
    description: 'Import solved problems, submissions, and solutions',
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    icon: <Globe className="w-5 h-5" />,
    color: '#5B4638',
    available: false,
    description: 'Integration coming soon',
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    icon: <Globe className="w-5 h-5" />,
    color: '#2EC866',
    available: false,
    description: 'Integration coming soon',
  },
  {
    id: 'codecademy',
    name: 'Codecademy',
    icon: <Globe className="w-5 h-5" />,
    color: '#000000',
    available: false,
    description: 'Integration coming soon',
  },
];

const initialConnectedAccounts: Record<Platform, { connected: boolean; lastSynced: string | null; syncing: boolean; username: string | null }> = {
  leetcode: { connected: false, lastSynced: null, syncing: false, username: null },
  codechef: { connected: false, lastSynced: null, syncing: false, username: null },
  hackerrank: { connected: false, lastSynced: null, syncing: false, username: null },
  codecademy: { connected: false, lastSynced: null, syncing: false, username: null },
};

const initialImportJobs: Record<Platform, { status: string; progress: number }> = {
  leetcode: { status: 'idle', progress: 0 },
  codechef: { status: 'idle', progress: 0 },
  hackerrank: { status: 'idle', progress: 0 },
  codecademy: { status: 'idle', progress: 0 },
};

export const ConnectedAccounts: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, session } = useAuth();
  const { syncFromCloud } = useApp();

  const [connectedAccounts, setConnectedAccounts] = useState<Record<Platform, { connected: boolean; lastSynced: string | null; syncing: boolean; username: string | null }>>(initialConnectedAccounts);
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  const [importJobs, setImportJobs] = useState<Record<Platform, { status: string; progress: number }>>(initialImportJobs);

  const fetchConnectedAccounts = async () => {
    if (!supabase || !user) return;

    const { data } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      const newState = { ...initialConnectedAccounts };
      for (const account of data) {
        if (account.platform in newState) {
          newState[account.platform as Platform] = {
            connected: true,
            lastSynced: account.last_synced_at,
            syncing: false,
            username: account.platform_username,
          };
        }
      }
      setConnectedAccounts(newState);
    }
  };

  useEffect(() => {
    if (user && isSupabaseConfigured()) {
      fetchConnectedAccounts();
    }
  }, [user]);

  const handleConnect = async (platform: Platform) => {
    if (!supabase || !user) return;

    if (platform === 'leetcode') {
      const token = prompt('Enter your LeetCode session token (LEETCODE_SESSION cookie):');
      if (!token) return;

      try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `LEETCODE_SESSION=${token}`,
          },
          body: JSON.stringify({
            query: `
              query getCurrentUser {
                user {
                  username
                  profile {
                    userSlug
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.errors) throw new Error('Invalid token');

        const username = result.data?.user?.username;

        await supabase.from('connected_accounts').upsert({
          user_id: user.id,
          platform: 'leetcode',
          platform_username: username,
          access_token: token,
          sync_enabled: true,
        }, { onConflict: 'user_id,platform' });

        setConnectedAccounts(prev => ({
          ...prev,
          leetcode: { connected: true, lastSynced: null, syncing: false, username },
        }));
      } catch (error) {
        alert('Failed to connect: ' + (error as Error).message);
      }
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    if (!supabase || !user) return;

    if (!confirm(`Disconnect ${platform}? This will remove the connection but keep your imported problems.`)) return;

    await supabase
      .from('connected_accounts')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform);

    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: { connected: false, lastSynced: null, syncing: false, username: null },
    }));
  };

  const handleSync = async (platform: Platform) => {
    if (!supabase || !user) return;

    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: { ...prev[platform], syncing: true },
    }));

    setImportJobs(prev => ({
      ...prev,
      [platform]: { status: 'syncing', progress: 0 },
    }));

    try {
      if (platform === 'leetcode') {
        const account = await supabase
          .from('connected_accounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', 'leetcode')
          .single();

        if (!account.data?.access_token) throw new Error('No token found');

        const { data, error } = await supabase.functions.invoke('leetcode-sync', {
          body: { token: account.data.access_token },
        });

        if (error) throw error;

        await supabase
          .from('connected_accounts')
          .update({
            last_synced_at: new Date().toISOString(),
            last_sync_status: 'completed',
            last_sync_count: data?.newImported || 0,
          })
          .eq('user_id', user.id)
          .eq('platform', 'leetcode');

        await fetchConnectedAccounts();
        await syncFromCloud();

        setImportJobs(prev => ({
          ...prev,
          [platform]: { status: 'completed', progress: 100 },
        }));
      }
    } catch (error) {
      await supabase
        .from('connected_accounts')
        .update({ last_sync_status: 'failed' })
        .eq('user_id', user.id)
        .eq('platform', platform);

      setImportJobs(prev => ({
        ...prev,
        [platform]: { status: 'failed', progress: 0 },
      }));

      alert('Sync failed: ' + (error as Error).message);
    } finally {
      setConnectedAccounts(prev => ({
        ...prev,
        [platform]: { ...prev[platform], syncing: false },
      }));
    }
  };

  const toggleExpand = (platform: Platform) => {
    setExpandedPlatform(prev => prev === platform ? null : platform);
  };

  if (!isSupabaseConfigured()) {
    return (
      <motion.div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-[var(--color-accent-amber)] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Backend Not Configured</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Connected Accounts requires Supabase backend. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
        </p>
        <button onClick={onClose} className="btn btn-ghost mt-4">Close</button>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Connected Accounts</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Link your coding platform accounts to import problems and track progress</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const account = connectedAccounts[platform.id];
          const isExpanded = expandedPlatform === platform.id;
          const importJob = importJobs[platform.id];

          return (
            <motion.div
              key={platform.id}
              className="card p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <button
                onClick={() => toggleExpand(platform.id)}
                className="w-full flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: platform.color + '20' }}>
                    {platform.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{platform.name}</h3>
                      {account.connected && (
                        <span className="badge badge-emerald text-[9px]">Connected</span>
                      )}
                      {!account.connected && platform.available && (
                        <span className="badge badge-accent text-[9px]">Available</span>
                      )}
                      {!platform.available && (
                        <span className="badge text-[9px]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Coming Soon</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{platform.description}</p>
                    {account.username && (
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">@{account.username}</p>
                    )}
                    {account.lastSynced && (
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-1">
                        Last synced: {new Date(account.lastSynced).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {importJob?.status === 'syncing' && (
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--color-accent)]" />
                  )}
                  {account.connected ? (
                    <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-[var(--color-border)]"
                  >
                    <div className="flex flex-col gap-3">
                      {account.connected ? (
                        <>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSync(platform.id)}
                              disabled={account.syncing}
                              className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-2"
                            >
                              {account.syncing ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Syncing...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4" />
                                  Sync Now
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDisconnect(platform.id)}
                              className="flex-1 btn btn-ghost flex items-center justify-center gap-2 py-2"
                            >
                              <X className="w-4 h-4" />
                              Disconnect
                            </button>
                          </div>

                          {importJob && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-text-secondary)]">Sync Status</span>
                                <span className="font-mono text-[var(--color-accent)]">{importJob.status}</span>
                              </div>
                              <div className="w-full h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${importJob.progress}%`,
                                    background: importJob.status === 'failed' ? 'var(--color-accent-danger)' : 'var(--color-accent)',
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : platform.available ? (
                        <button
                          onClick={() => handleConnect(platform.id)}
                          className="w-full btn btn-primary py-2 flex items-center justify-center gap-2"
                        >
                          {platform.icon}
                          Connect {platform.name}
                        </button>
                      ) : (
                        <button className="w-full btn btn-ghost py-2" disabled>
                          Integration Coming Soon
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {!user && (
        <motion.div className="card p-6 text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <AlertCircle className="w-12 h-12 text-[var(--color-accent-amber)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Sign In Required</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">Connect your coding platform accounts after signing in.</p>
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </motion.div>
      )}
    </motion.div>
  );
};