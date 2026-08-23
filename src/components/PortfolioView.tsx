import React, { useState } from 'react';
import {
  ExternalLink,
  Terminal,
  Star,
  Send,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { aaryanProjects, initialUserStats } from '../data/mockData';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface LogMessage {
  sender: 'user' | 'system';
  text: string;
}

export const PortfolioView: React.FC = () => {
  const stats = initialUserStats;
  const [cmdInput, setCmdInput] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<LogMessage[]>([
    { sender: 'system', text: 'ALGO_ELITE Command Interface v2.4.0' },
    { sender: 'system', text: 'Type "help" to list available telemetry directives.' },
  ]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cmdInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs: LogMessage[] = [...terminalLogs, { sender: 'user', text: `algo-elite > ${cmdInput}` }];

    if (cmd === 'help') {
      newLogs.push({
        sender: 'system',
        text: 'Directives: stats, skills, projects, rating, streak, clear, contact <msg>',
      });
    } else if (cmd === 'stats') {
      newLogs.push({
        sender: 'system',
        text: `Telemetry: ${stats.totalSolved}/${stats.totalProblems} Solved | 12D Streak | ${stats.accuracy}% Accuracy | ${stats.rating} ELO`,
      });
    } else if (cmd === 'skills') {
      newLogs.push({
        sender: 'system',
        text: 'Core Competencies: DSA (Graphs, DP, Trees, Two-Pointers), TypeScript, React 19, Python, C++20, WebGL, IoT',
      });
    } else if (cmd === 'projects') {
      newLogs.push({
        sender: 'system',
        text: 'Repositories: DSAglazzer, ALGO_ELITE Cosmic Terminal, Srujana Smart Assist IoT, Chrome Extension',
      });
    } else if (cmd === 'rating') {
      newLogs.push({
        sender: 'system',
        text: `Guardian Status: 1842 ELO · Top 5% of Global Competitive Algorithmic Solvers`,
      });
    } else if (cmd === 'streak') {
      newLogs.push({
        sender: 'system',
        text: `Active Streak: 12 Days uninterrupted focus sequence (+1.2x retention bonus)`,
      });
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    } else if (cmd.startsWith('contact')) {
      newLogs.push({
        sender: 'system',
        text: 'Transmission encrypted and received by Aaryan. Thank you for connecting.',
      });
    } else {
      newLogs.push({
        sender: 'system',
        text: `Directive "${cmd}" not recognized. Type "help" for a list of directives.`,
      });
    }

    setTerminalLogs(newLogs);
    setCmdInput('');
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setMsgSent(true);
    setContactMsg('');
    setTimeout(() => setMsgSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* ── Developer Bio / Hero Card ──────────────────────── */}
      <div className="p-6 sm:p-8 bg-[#0c0c0c] border border-[#27272a] rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-[#10b981]/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-display text-white">{stats.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] font-bold rounded">
                  Guardian / Knight
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                @{stats.handle} · B.Tech CCE · Srujana Hackathon Winner · Google Student Ambassador
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono">
                <span className="px-2.5 py-1 bg-[#161616] border border-[#27272a] text-zinc-300 rounded">
                  Algorithm Architect
                </span>
                <span className="px-2.5 py-1 bg-[#161616] border border-[#27272a] text-zinc-300 rounded">
                  Full-Stack Systems
                </span>
                <span className="px-2.5 py-1 bg-[#161616] border border-[#27272a] text-zinc-300 rounded">
                  Active Spaced Repetition (SRS)
                </span>
              </div>
            </div>
          </div>

          {/* Social & GitHub Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/InterestingAary"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#161616] hover:bg-[#202020] border border-[#27272a] hover:border-[#10b981]/50 text-white font-mono text-xs uppercase rounded-lg transition-all flex items-center gap-2"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
            <a
              href="https://github.com/InterestingAary/DSAglazzer"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#10b981] hover:bg-[#34d399] text-black font-mono text-xs uppercase font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-[#10b981]/20"
            >
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>Star Project</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Featured Projects Grid ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#10b981]" />
            <span>Featured Engineering Repositories</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">Open Source Creations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aaryanProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 bg-[#0c0c0c] border border-[#27272a] hover:border-[#10b981]/50 hover:bg-[#121212] rounded-xl transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white font-display flex items-center gap-2">
                    <span>{proj.title}</span>
                    {proj.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] font-bold rounded">
                        Featured
                      </span>
                    )}
                  </span>
                  {proj.stars && (
                    <span className="flex items-center gap-1 text-xs font-mono text-[#ffb869]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {proj.stars}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 bg-[#161616] border border-[#27272a] text-zinc-300 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#27272a] text-xs font-mono">
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" /> Source Code
                </a>
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#10b981] hover:underline flex items-center gap-1 font-bold"
                  >
                    Live Demo <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive CLI Transmission Terminal ───────────── */}
      <div className="p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#10b981]" />
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              ALGO_ELITE Interactive Terminal
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Live Shell</span>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 bg-[#080808] border border-[#1f1f23] rounded-lg font-mono text-xs space-y-2 h-44 overflow-y-auto terminal-scroll">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={log.sender === 'user' ? 'text-[#ffb869] font-bold' : 'text-zinc-300'}
            >
              {log.text}
            </div>
          ))}
        </div>

        {/* Command Form */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#10b981] font-bold">algo-elite &gt;</span>
          <input
            type="text"
            placeholder="Type directive (e.g. stats, skills, projects, clear)..."
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-[#121212] border border-[#27272a] focus:border-[#10b981] text-white rounded outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#161616] hover:bg-[#222] border border-[#27272a] text-zinc-200 uppercase font-bold rounded cursor-pointer"
          >
            Execute
          </button>
        </form>
      </div>

      {/* ── Encrypted Transmission Contact ─────────────────── */}
      <div className="p-5 bg-[#0c0c0c] border border-[#27272a] rounded-xl space-y-3">
        <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-[#10b981]" />
          <span>Transmit Message to Engineer</span>
        </h3>
        <p className="text-xs text-zinc-400 font-mono">
          Have an algorithm challenge or collaborative project? Transmit a dispatch directly to Aaryan.
        </p>

        {msgSent ? (
          <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg text-xs font-mono text-[#10b981] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Message transmission logged successfully!
          </div>
        ) : (
          <form onSubmit={handleSendContact} className="flex flex-col sm:flex-row gap-2 font-mono text-xs">
            <input
              type="text"
              placeholder="Your email or note (e.g. Hey Aaryan, loved your DSA spaced repetition engine)..."
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#121212] border border-[#27272a] focus:border-[#10b981] text-white rounded-lg outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#10b981] hover:bg-[#34d399] text-black font-bold uppercase rounded-lg transition-colors cursor-pointer"
            >
              Send Dispatch
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
