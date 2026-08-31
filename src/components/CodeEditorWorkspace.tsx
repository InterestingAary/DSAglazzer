import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Problem, Language, TestCase } from '../types';
import { useApp } from '../context/AppContext';
import { runTests } from '../utils/piston';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface CodeEditorWorkspaceProps {
  problem: Problem;
  onBack: () => void;
}

const LANG_MAP: Record<Language, { label: string; ext: any }> = {
  javascript: { label: 'JavaScript', ext: javascript() },
  python: { label: 'Python', ext: python() },
  cpp: { label: 'C++', ext: cpp() },
  java: { label: 'Java', ext: java() },
};

const DIFFICULTY_CLASSES: Record<string, string> = {
  Easy: 'badge-emerald',
  Medium: 'badge-amber',
  Hard: 'badge-danger',
};

export const CodeEditorWorkspace: React.FC<CodeEditorWorkspaceProps> = ({ problem, onBack }) => {
  const { state, solveProblem, attemptProblem, getProblemStatus } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(state.settings.language);
  const [code, setCode] = useState<string>(problem.starterCode[selectedLanguage] || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    results: { id: number; passed: boolean; input: string; expected: string; actual: string; error?: string }[];
  } | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<'description' | 'submissions'>('description');
  const [showHints, setShowHints] = useState(false);
  const [selectedHint, setSelectedHint] = useState(0);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    setCode(problem.starterCode[selectedLanguage] || '');
    setTestResults(null);
    setExecutionTime(null);
  }, [problem.id, selectedLanguage]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang] || '');
  };

  const handleRunTests = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setTestResults(null);

    const start = Date.now();
    try {
      const result = await runTests(code, selectedLanguage, problem.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })));
      setTestResults(result);
      setExecutionTime(Date.now() - start);

      if (result.failed === 0 && result.passed > 0) {
        solveProblem(problem.id, selectedLanguage, problem.difficulty, problem.topic);
      } else {
        attemptProblem(problem.id, selectedLanguage);
      }
    } catch {
      setTestResults({ passed: 0, failed: 1, results: [{ id: 1, passed: false, input: '', expected: '', actual: '', error: 'Execution failed' }] });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, problem, isRunning, solveProblem, attemptProblem]);

  const handleSubmit = useCallback(async () => {
    await handleRunTests();
  }, [handleRunTests]);

  const status = getProblemStatus(problem.id);
  const solved = status?.status === 'solved';

  return (
    <motion.section
      className="card p-4 sm:p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <button
            onClick={onBack}
            className="btn btn-ghost px-3 py-1.5 text-xs uppercase font-bold"
          >
            ← Back
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{problem.title}</h2>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${DIFFICULTY_CLASSES[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="px-2 py-0.5 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] rounded-full border border-[var(--color-border)]">
                {problem.topic}
              </span>
              {solved && (
                <span className="px-2 py-0.5 text-xs font-bold badge badge-emerald">
                  ✓ Solved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[var(--color-surface-elevated)] rounded-lg p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex gap-2 mb-4 divider pb-2">
              <button
                onClick={() => setActiveTestTab('description')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  activeTestTab === 'description' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTestTab('submissions')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  activeTestTab === 'submissions' ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                Submissions {testResults ? `(${testResults.passed}/${testResults.passed + testResults.failed})` : ''}
              </button>
            </div>

            {activeTestTab === 'description' ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">{problem.description}</p>

                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="bg-[var(--color-surface-elevated)] rounded-lg p-3 divider">
                    <p className="font-bold text-[var(--color-accent)] text-xs uppercase tracking-wider">Example {idx + 1}</p>
                    <div className="mt-2 space-y-1 font-mono text-xs">
                      <div><span className="text-[var(--color-text-muted)]">Input:</span> <span className="text-[var(--color-text-primary)]">{ex.input}</span></div>
                      <div><span className="text-[var(--color-text-muted)]">Output:</span> <span className="text-[var(--color-text-primary)]">{ex.output}</span></div>
                      {ex.explanation && <div><span className="text-[var(--color-text-muted)]">Explanation:</span> <span className="text-[var(--color-text-muted)]">{ex.explanation}</span></div>}
                    </div>
                  </div>
                ))}

                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-bold mb-2">Constraints</p>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-[var(--color-text-secondary)] font-mono">• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2 divider">
                  <span className="text-xs text-[var(--color-text-muted)]">Time: {problem.timeComplexity}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">Space: {problem.spaceComplexity}</span>
                </div>

                <button
                  onClick={() => { setShowHints(!showHints); setSelectedHint(0); }}
                  className="btn btn-ghost px-3 py-1.5 text-xs uppercase font-bold"
                >
                  {showHints ? 'Hide Hints' : `Show Hints (${problem.hints.length})`}
                </button>
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[var(--color-surface-elevated)] rounded-lg p-3 space-y-2 divider">
                        {problem.hints.map((hint, i) => (
                          <div key={i} className="text-xs text-[var(--color-text-secondary)]">
                            <span className="text-[var(--color-accent)] font-bold">Hint {i + 1}:</span> {hint}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults ? (
                  <>
                    <div className="flex gap-4 text-sm font-bold">
                      <span className="text-[var(--color-accent-emerald)]">✓ {testResults.passed} Passed</span>
                      <span className="text-[var(--color-accent-danger)]">✗ {testResults.failed} Failed</span>
                      {executionTime && <span className="text-[var(--color-text-muted)]">{executionTime}ms</span>}
                    </div>
                    {testResults.results.map((r) => (
                      <div key={r.id} className={`bg-[var(--color-surface-elevated)] rounded-lg p-3 divider ${r.passed ? 'border-[var(--color-accent-emerald)]/20' : 'border-[var(--color-accent-danger)]/20'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={r.passed ? 'text-[var(--color-accent-emerald)]' : 'text-[var(--color-accent-danger)]'}>
                            {r.passed ? '✓' : '✗'}
                          </span>
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">Test {r.id}</span>
                        </div>
                        {!r.passed && (
                          <div className="mt-2 space-y-1 font-mono text-xs">
                            <div><span className="text-[var(--color-text-muted)]">Input:</span> <span className="text-[var(--color-text-primary)]">{r.input}</span></div>
                            <div><span className="text-[var(--color-text-muted)]">Expected:</span> <span className="text-[var(--color-accent-emerald)]">{r.expected}</span></div>
                            <div><span className="text-[var(--color-text-muted)]">Got:</span> <span className="text-[var(--color-accent-danger)]">{r.actual}</span></div>
                            {r.error && <div><span className="text-[var(--color-text-muted)]">Error:</span> <span className="text-[var(--color-accent-danger)]">{r.error}</span></div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-[var(--color-text-muted)] text-xs">Run your code to see test results here.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(Object.keys(LANG_MAP) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] border border-transparent'
                    }`}
                  >
                    {LANG_MAP[lang].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-surface-elevated)] rounded-lg overflow-hidden border border-[var(--color-border)]" style={{ minHeight: '400px' }}>
              <CodeMirror
                value={code}
                height="400px"
                theme={oneDark}
                extensions={[LANG_MAP[selectedLanguage].ext, EditorView.lineWrapping]}
                onChange={(value) => setCode(value)}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightActiveLineGutter: true,
                  foldGutter: true,
                  autocompletion: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  indentOnInput: true,
                  tabSize: 2,
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className={`flex-1 btn px-5 py-2.5 text-sm uppercase font-bold tracking-wider cursor-pointer ${
                  isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isRunning ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⟳</motion.span>
                    Running...
                  </span>
                ) : '▶ Run Tests'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className={`flex-1 btn btn-primary px-5 py-2.5 text-sm uppercase font-bold tracking-wider cursor-pointer ${
                  isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Submit
              </button>
            </div>

            <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
              <span>Acceptance: {problem.acceptanceRate}%</span>
              <span>•</span>
              <span>Submissions: {problem.tags.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};