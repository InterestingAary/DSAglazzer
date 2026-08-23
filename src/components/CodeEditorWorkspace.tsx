import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Check,
  Flame,
  Plus,
  Terminal,
  BookOpen,
  Code2,
} from 'lucide-react';
import { sampleProblems } from '../data/mockData';
import type { AProblem, ATestCase, ALDifficulty } from '../data/mockData';

type SupportedLang = 'typescript' | 'python' | 'cpp' | 'java';

export const CodeEditorWorkspace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const problemId = searchParams.get('id') || sampleProblems[0].id;

  const currentProblem: AProblem =
    sampleProblems.find((p) => p.id === problemId) || sampleProblems[0];

  const [language, setLanguage] = useState<SupportedLang>('typescript');
  const [code, setCode] = useState<string>(
    currentProblem.starterCode[language] || currentProblem.starterCode.typescript
  );
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [customTestInput, setCustomTestInput] = useState('');
  const [customTestExpected, setCustomTestExpected] = useState('');
  const [testCases, setTestCases] = useState<ATestCase[]>(currentProblem.testCases);
  const [hintsExpanded, setHintsExpanded] = useState(false);
  const [intuitionExpanded, setIntuitionExpanded] = useState(false);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'idle' | 'success' | 'failed' | 'submitted';
    executionTimeMs?: number;
    memoryMb?: number;
    passedCases?: number;
    totalCases?: number;
    actualOutput?: string;
    logs?: string[];
  }>({ status: 'idle' });

  // Synchronize starter code on problem or language change
  useEffect(() => {
    setCode(currentProblem.starterCode[language] || currentProblem.starterCode.typescript);
    setTestCases(currentProblem.testCases);
    setSelectedTestCaseIdx(0);
    setExecutionResult({ status: 'idle' });
  }, [currentProblem.id, currentProblem.starterCode, currentProblem.testCases, language]);

  // Handle Tab indentation in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionResult({ status: 'idle' });

    setTimeout(() => {
      setIsRunning(false);
      const activeCase = testCases[selectedTestCaseIdx] || testCases[0];
      const execTime = Math.floor(Math.random() * 18) + 8;
      const memMb = +(Math.random() * 4 + 38).toFixed(1);

      setExecutionResult({
        status: 'success',
        executionTimeMs: execTime,
        memoryMb: memMb,
        passedCases: testCases.length,
        totalCases: testCases.length,
        actualOutput: activeCase?.expectedOutput || '',
        logs: [
          `[Runtime] Initializing sandbox environment for ${language.toUpperCase()}...`,
          `[Compiler] AST verified with 0 syntax warnings.`,
          `[Execution] Case ${selectedTestCaseIdx + 1}: Passed invariant check in ${execTime}ms.`,
        ],
      });
    }, 450);
  };

  const handleApplySolution = () => {
    setCode(currentProblem.solutionCode[language] || currentProblem.solutionCode.typescript);
  };

  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      currentProblem.status = 'solved';
      const execTime = Math.floor(Math.random() * 14) + 6;
      const memMb = +(Math.random() * 3 + 36.5).toFixed(1);

      setExecutionResult({
        status: 'submitted',
        executionTimeMs: execTime,
        memoryMb: memMb,
        passedCases: testCases.length,
        totalCases: testCases.length,
        actualOutput: testCases[selectedTestCaseIdx]?.expectedOutput || '',
        logs: [
          `[Validation] 15/15 Hidden & Boundary Test Cases Passed.`,
          `[Memory] Peak allocated heap: ${memMb} MB (Beats 94.2% of submissions).`,
          `[Speed] Runtime ${execTime} ms (Beats 98.7% of submissions).`,
          `[SRS] Spaced Repetition interval advanced to +7 Days.`,
        ],
      });

      // Update local storage
      try {
        const solvedList = JSON.parse(localStorage.getItem('algo_elite_solved') || '[]');
        if (!solvedList.includes(currentProblem.id)) {
          solvedList.push(currentProblem.id);
          localStorage.setItem('algo_elite_solved', JSON.stringify(solvedList));
        }
      } catch {}
    }, 650);
  };

  const handleAddCustomTestCase = () => {
    if (!customTestInput.trim()) return;
    const newCase: ATestCase = {
      id: `custom-${Date.now()}`,
      input: customTestInput,
      expectedOutput: customTestExpected || 'true',
      isCustom: true,
    };
    const updated = [...testCases, newCase];
    setTestCases(updated);
    setSelectedTestCaseIdx(updated.length - 1);
    setCustomTestInput('');
    setCustomTestExpected('');
  };

  const getDifficultyColor = (diff: ALDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30';
      case 'Medium':
        return 'text-[#ffb869] bg-[#ffb869]/10 border-[#ffb869]/30';
      case 'Hard':
        return 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30';
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-4">
      {/* ── Top Workspace Bar ─────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 bg-[#0c0c0c] border border-[#27272a] rounded-xl gap-3">
        {/* Left: Problem Selector & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={currentProblem.id}
            onChange={(e) => setSearchParams({ id: e.target.value })}
            className="px-3 py-1.5 bg-[#161616] border border-[#27272a] text-xs font-mono font-bold text-white rounded-lg outline-none cursor-pointer hover:border-[#10b981]/40"
          >
            {sampleProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty} · {p.topic})
              </option>
            ))}
          </select>

          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 border rounded ${getDifficultyColor(
              currentProblem.difficulty
            )}`}
          >
            {currentProblem.difficulty}
          </span>

          <span className="text-xs font-mono px-2 py-0.5 bg-[#161616] border border-[#27272a] text-zinc-300 rounded hidden sm:inline">
            {currentProblem.topic}
          </span>

          <span className="text-xs font-mono text-zinc-400 hidden md:inline">
            Target: <span className="text-[#10b981]">{currentProblem.timeComplexity}</span> /{' '}
            <span className="text-[#10b981]">{currentProblem.spaceComplexity}</span>
          </span>
        </div>

        {/* Right: Language Selector & Run/Submit Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language selector */}
          <div className="flex items-center bg-[#121212] border border-[#27272a] rounded-lg p-0.5">
            {(['typescript', 'python', 'cpp', 'java'] as SupportedLang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors cursor-pointer ${
                  language === lang
                    ? 'bg-[#27272a] text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang === 'typescript' ? 'TS' : lang === 'cpp' ? 'C++' : lang}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCode(
                currentProblem.starterCode[language] || currentProblem.starterCode.typescript
              )
            }
            className="p-2 text-zinc-400 hover:text-white border border-[#27272a] bg-[#121212] hover:bg-[#161616] rounded-lg transition-colors cursor-pointer"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleApplySolution}
            className="px-2.5 py-1.5 text-xs font-mono text-zinc-400 hover:text-[#10b981] border border-[#27272a] bg-[#121212] hover:bg-[#161616] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Load Reference Solution"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ref Solution</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 bg-[#161616] hover:bg-[#202020] border border-[#27272a] hover:border-[#10b981]/50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current text-[#10b981]" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 bg-[#10b981] hover:bg-[#34d399] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-all hover:scale-105 flex items-center gap-1.5 shadow-lg shadow-[#10b981]/20 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isSubmitting ? 'Verifying...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* ── Tripartite Main Workspace ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT PANEL: Problem Statement & Hints (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col bg-[#0c0c0c] border border-[#27272a] rounded-xl overflow-hidden min-h-[600px]">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-[#27272a]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Problem Description
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {currentProblem.acceptanceRate} Pass Rate
            </span>
          </div>

          {/* Scrollable Problem Body */}
          <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[650px] text-xs leading-relaxed text-zinc-300">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white mb-2">
                {currentProblem.title}
              </h2>
              <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                {currentProblem.description}
              </p>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-white uppercase block">
                Examples
              </span>
              {currentProblem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#161616] border border-[#27272a] rounded-lg font-mono space-y-1.5 text-[11px]"
                >
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 font-bold uppercase mr-1">Input:</span>
                    <code className="text-[#10b981]">{ex.input}</code>
                  </div>
                  <div className="text-zinc-400">
                    <span className="text-zinc-500 font-bold uppercase mr-1">Output:</span>
                    <code className="text-white font-bold">{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="text-zinc-400 text-[10px] pt-1 border-t border-[#27272a]">
                      <span className="text-zinc-500 mr-1">Note:</span> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white uppercase block">
                Constraints
              </span>
              <ul className="space-y-1 font-mono text-[11px] text-zinc-400 list-disc list-inside">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i}>
                    <code className="text-zinc-300">{c}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collapsible Algorithmic Invariant & Intuition */}
            <div className="border border-[#27272a] rounded-lg overflow-hidden bg-[#121212]">
              <button
                onClick={() => setIntuitionExpanded(!intuitionExpanded)}
                className="w-full flex items-center justify-between p-3 text-left font-mono font-bold text-xs text-white hover:bg-[#161616] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffb869]" />
                  <span>Loop Invariant & Proof</span>
                </div>
                {intuitionExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {intuitionExpanded && (
                <div className="p-3 pt-1 border-t border-[#27272a] space-y-2 text-[11px] font-mono text-zinc-300">
                  <div>
                    <span className="text-[#ffb869] font-bold block mb-0.5">Intuition:</span>
                    <p className="text-zinc-400 leading-relaxed">{currentProblem.intuition}</p>
                  </div>
                  <div>
                    <span className="text-[#10b981] font-bold block mb-0.5">Formal Invariant:</span>
                    <p className="text-zinc-400 leading-relaxed">{currentProblem.invariant}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible Hints */}
            <div className="border border-[#27272a] rounded-lg overflow-hidden bg-[#121212]">
              <button
                onClick={() => setHintsExpanded(!hintsExpanded)}
                className="w-full flex items-center justify-between p-3 text-left font-mono font-bold text-xs text-zinc-300 hover:text-white hover:bg-[#161616] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Progressive Hints ({currentProblem.hints.length})</span>
                </div>
                {hintsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {hintsExpanded && (
                <div className="p-3 pt-1 border-t border-[#27272a] space-y-2 text-[11px] font-mono text-zinc-400">
                  {currentProblem.hints.map((hint, idx) => (
                    <div key={idx} className="p-2 bg-[#161616] border border-[#27272a] rounded">
                      <span className="text-[#10b981] font-bold mr-1">Hint {idx + 1}:</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CENTER & RIGHT PANELS: Code Editor & Test Runner (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Code Editor Container */}
          <div className="flex flex-col bg-[#0c0c0c] border border-[#27272a] rounded-xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#121212] border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#10b981]" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Solution.{language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {lineCount} Lines · Tab Size: 2
              </span>
            </div>

            {/* Line-numbered Code Editor Area */}
            <div className="relative flex bg-[#080808] font-mono text-xs overflow-hidden min-h-[340px]">
              {/* Line Numbers Gutter */}
              <div className="py-4 pl-3 pr-2.5 select-none text-right font-mono text-[11px] text-zinc-600 bg-[#080808] border-r border-[#1f1f23]">
                {Array.from({ length: Math.max(lineCount, 16) }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Editable TextArea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 p-4 bg-transparent font-mono text-xs leading-6 text-zinc-100 placeholder-zinc-700 outline-none resize-none border-none overflow-x-auto whitespace-pre tab-2"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          {/* Test Runner & Telemetry Container */}
          <div className="bg-[#0c0c0c] border border-[#27272a] rounded-xl overflow-hidden p-4 space-y-4">
            {/* Test Case Tab Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#27272a]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-white mr-1 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-[#10b981]" /> Test Cases:
                </span>
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    onClick={() => setSelectedTestCaseIdx(idx)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                      selectedTestCaseIdx === idx
                        ? 'bg-[#10b981] text-black font-bold'
                        : 'bg-[#161616] text-zinc-400 hover:text-white border border-[#27272a]'
                    }`}
                  >
                    Case {idx + 1} {tc.isCustom ? '(Custom)' : ''}
                  </button>
                ))}
              </div>

              {/* Execution status indicator badge */}
              {executionResult.status !== 'idle' && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  {executionResult.status === 'submitted' ? (
                    <span className="px-2.5 py-0.5 bg-[#10b981]/20 text-[#10b981] font-bold rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-[#10b981]/10 text-[#10b981] font-bold rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                    </span>
                  )}
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ffb869]" /> {executionResult.executionTimeMs} ms
                  </span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-[#06b9d4]" /> {executionResult.memoryMb} MB
                  </span>
                </div>
              )}
            </div>

            {/* Selected Test Case Inputs / Output Diff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#161616] border border-[#27272a] rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Input</span>
                <div className="text-[#10b981] break-all">
                  {testCases[selectedTestCaseIdx]?.input}
                </div>
              </div>

              <div className="p-3 bg-[#161616] border border-[#27272a] rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Expected Output
                </span>
                <div className="text-white font-bold break-all">
                  {testCases[selectedTestCaseIdx]?.expectedOutput}
                </div>
              </div>
            </div>

            {/* Actual Output vs Expected diff if executed */}
            {executionResult.actualOutput && (
              <div className="p-3 bg-[#121212] border border-[#27272a] rounded-lg space-y-1 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-[#10b981] block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Sandbox Actual Output
                </span>
                <div className="text-zinc-200 bg-[#080808] p-2 rounded border border-[#1f1f23]">
                  {executionResult.actualOutput}
                </div>
              </div>
            )}

            {/* Execution logs */}
            {executionResult.logs && executionResult.logs.length > 0 && (
              <div className="p-3 bg-[#080808] border border-[#27272a] rounded-lg space-y-1 font-mono text-[11px] text-zinc-400">
                {executionResult.logs.map((log, i) => (
                  <div key={i} className="leading-5">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Test Case Form */}
            <div className="pt-3 border-t border-[#27272a] space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-[#10b981]" /> Add Custom Test Harness
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-xs">
                <input
                  type="text"
                  placeholder="Custom Input (e.g. nums=[5,2,8], target=10)"
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-1.5 bg-[#121212] border border-[#27272a] focus:border-[#10b981] text-white rounded outline-none"
                />
                <input
                  type="text"
                  placeholder="Expected (e.g. [0,2])"
                  value={customTestExpected}
                  onChange={(e) => setCustomTestExpected(e.target.value)}
                  className="w-full sm:w-40 px-3 py-1.5 bg-[#121212] border border-[#27272a] focus:border-[#10b981] text-white rounded outline-none"
                />
                <button
                  onClick={handleAddCustomTestCase}
                  className="w-full sm:w-auto px-3 py-1.5 bg-[#161616] hover:bg-[#222] border border-[#27272a] text-zinc-200 text-xs uppercase font-bold rounded transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
