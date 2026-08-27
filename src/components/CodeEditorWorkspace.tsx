import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Problem, TestCase } from '../types';

interface CodeEditorWorkspaceProps {
  problem: Problem;
  onProblemSolved: (problemId: string) => void;
}

export const CodeEditorWorkspace: React.FC<CodeEditorWorkspaceProps> = ({problem, onProblemSolved}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof Problem['starterCode']>('typescript');
  const [code, setCode] = useState<string>(problem.starterCode.typescript);
  const [testResults, setTestResults] = useState<{passed: number; failed: number; logs: string[]}>({passed: 0, failed: 0, logs: []});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as keyof Problem['starterCode'];
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang]);
  };

  const executeTestCase = (tc: TestCase) => {
    setTestResults(prev => ({...prev, logs: [...prev.logs, `Running test: ${tc.id}`]}));
    const passed = tc.expectedOutput.trim() === code.trim().slice(0, Math.min(code.length, tc.expectedOutput.length));
    setTestResults(prev => ({
      ...prev,
      passed: passed ? prev.passed + 1 : prev.passed,
      failed: !passed ? prev.failed + 1 : prev.failed,
      logs: [...prev.logs, `Test ${tc.id}: ${passed ? 'PASS' : 'FAIL'}`]
    }));
  };

  const handleSolve = () => {
    onProblemSolved(problem.id);
  };

  return (
    <motion.section
      className="spatial-card p-6 sm:p-8 noise-overlay gradient-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="px-4 py-2 glass-surface rounded-xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-accent text-sm font-mono cursor-pointer"
          >
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={handleSolve}
            className="spatial-btn-solid px-5 py-2 text-sm uppercase font-bold tracking-wider cursor-pointer"
          >
            Run & Solve
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Problem Statement</h3>
            <div className="space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">{problem.description}</p>
              <p className="text-xs text-text-muted">{problem.constraints.join('. ')}.</p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-3 text-sm uppercase tracking-wider">Examples</h4>
              <div className="space-y-3">
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="glass-surface rounded-xl p-4">
                    <p className="font-bold text-accent text-xs uppercase tracking-wider">Example {idx + 1}:</p>
                    <p className="mt-2 text-sm text-text-primary font-mono">{ex.input} → {ex.output}</p>
                    {ex.explanation && <p className="mt-1 text-xs text-text-muted">{ex.explanation}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Editor</h3>
            <div className="glass-surface rounded-2xl overflow-hidden">
              <pre className="p-4 text-sm text-text-primary font-mono overflow-x-auto leading-relaxed">
                {code}
              </pre>
            </div>

            <div className="mt-4 glass-surface rounded-2xl p-4">
              <h4 className="font-medium text-text-primary mb-2 text-sm uppercase tracking-wider">Test Case Results</h4>
              {isRunning && <p className="text-accent text-sm font-mono">Running tests...</p>}
              {!isRunning && testResults.logs.length === 0 && (
                <p className="text-text-muted text-xs">No test runs yet. Click <span className="text-accent font-bold">Run & Solve</span> to execute.</p>
              )}
              {testResults.logs.length > 0 && (
                <div className="mt-3 space-y-1 text-xs font-mono">
                  {testResults.logs.map((log, i) => (
                    <div key={i} className={log.includes('PASS') ? 'text-accent-emerald' : log.includes('FAIL') ? 'text-accent-danger' : 'text-text-muted'}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-4 text-xs font-bold">
                <span className="text-accent-emerald">Passed: {testResults.passed}</span>
                <span className="text-accent-danger">Failed: {testResults.failed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-glass-border">
          <button
            onClick={handleSolve}
            className="w-full spatial-btn-solid py-3 text-sm uppercase font-bold tracking-wider cursor-pointer"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </motion.section>
  );
};
