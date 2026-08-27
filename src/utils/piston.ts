import { Language, ExecutionResult } from '../types';

const PISTON_API = 'https://emkc.org/piston/v2';

const LANGUAGE_MAP: Record<Language, { piston: string; version: string }> = {
  javascript: { piston: 'javascript', version: '18.15.0' },
  python: { piston: 'python', version: '3.10.0' },
  cpp: { piston: 'c++', version: '10.2.0' },
  java: { piston: 'java', version: '15.0.2' },
};

export async function executeCode(
  code: string,
  language: Language,
  stdin: string = ''
): Promise<ExecutionResult> {
  const lang = LANGUAGE_MAP[language];

  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.piston,
        version: lang.version,
        files: [{ content: code }],
        stdin,
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      stdout: data.run?.stdout || '',
      stderr: data.run?.stderr || '',
      output: data.run?.output || '',
      code: data.run?.code ?? -1,
      signal: data.run?.signal || null,
      compile: data.compile ? {
        output: data.compile.output || '',
        stderr: data.compile.stderr || '',
        code: data.compile.code ?? -1,
      } : undefined,
    };
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : 'Execution failed',
      output: '',
      code: -1,
      signal: null,
    };
  }
}

export function wrapUserCode(
  language: Language,
  functionSignature: string,
  userBody: string,
  testCode: string
): string {
  if (language === 'javascript') {
    return `
${functionSignature} {
${userBody}
}

${testCode}
`;
  }

  if (language === 'python') {
    return `
${functionSignature}
${userBody}

${testCode}
`;
  }

  if (language === 'cpp') {
    return `
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

${functionSignature} {
${userBody}
}

${testCode}
`;
  }

  if (language === 'java') {
    return `
import java.util.*;

class Solution {
${functionSignature} {
${userBody}
}
}

${testCode}
`;
  }

  return userBody;
}

export async function runTests(
  code: string,
  language: Language,
  testCases: { input: string; expectedOutput: string }[]
): Promise<{ passed: number; failed: number; results: { id: number; passed: boolean; input: string; expected: string; actual: string; error?: string }[] }> {
  const results: { id: number; passed: boolean; input: string; expected: string; actual: string; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const result = await executeCode(code, language, tc.input);

    const actual = result.stdout.trim();
    const expected = tc.expectedOutput.trim();
    const testPassed = actual === expected && result.code === 0;

    if (testPassed) {
      passed++;
    } else {
      failed++;
    }

    results.push({
      id: i + 1,
      passed: testPassed,
      input: tc.input,
      expected,
      actual,
      error: result.stderr || (result.code !== 0 ? `Exit code: ${result.code}` : undefined),
    });
  }

  return { passed, failed, results };
}
