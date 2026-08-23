// ALGO_ELITE types used by new components
export type ALDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ATopic =
  | 'Arrays'
  | 'Strings'
  | 'Two Pointers'
  | 'Linked Lists'
  | 'Stack & Queue'
  | 'Binary Search'
  | 'Trees'
  | 'Heaps'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Backtracking'
  | 'Tries'
  | 'Bit Manipulation';

export interface ATestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isCustom?: boolean;
}

export interface AProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: ALDifficulty;
  topic: ATopic;
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  solutionCode: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  timeComplexity: string;
  spaceComplexity: string;
  hints: string[];
  testCases: ATestCase[];
  status: 'solved' | 'failed' | 'unattempted';
  lastAttempted?: string;
  nextRevisionDate?: string;
  tags: string[];
}

export interface AUniverseNode {
  id: string;
  topic: ATopic;
  progress: number;
  totalProblems: number;
  solvedProblems: number;
  status: 'completed' | 'in_progress' | 'locked';
  description: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface AActivityItem {
  id: string;
  type: 'solved' | 'failed' | 'badge' | 'streak' | 'revision';
  title: string;
  detail: string;
  timeAgo: string;
  difficulty?: ALDifficulty;
  problemId?: string;
}

export interface ARevisionItem {
  id: string;
  problemId: string;
  title: string;
  topic: ATopic;
  difficulty: ALDifficulty;
  daysAgo: number;
  urgency: 'urgent' | 'warning' | 'normal';
  retention: number;
  intervalDays: number;
}

export interface AUserStats {
  name: string;
  handle: string;
  streak: number;
  problemsThisWeek: number;
  accuracy: number;
  totalPracticeHours: number;
  totalSolved: number;
  totalProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  rank: string;
  rating: number;
}

export interface AProjectInfo {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars?: number;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

// --- Sample Problem Data (ALGO_ELITE) ---

export const sampleProblems: AProblem[] = [
  {
    id: 'p001',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptanceRate: '48.5%',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one solution exists.'],
    starterCode: {
      typescript: 'function twoSum(nums: number[], target: number): number[] { return []; }',
      python: 'def two_sum(nums, target): return []',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) { return {}; }',
      java: 'int[] twoSum(int[] nums, int target) { return new int[2]; }',
    },
    solutionCode: {
      typescript: 'function twoSum(nums: number[], target: number): number[] { const m = new Map<number, number>(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (m.has(complement)) { return [m.get(complement), i]; } m.set(nums[i], i); } return []; }',
      python: 'def two_sum(nums, target): m = {}; for i, n in enumerate(nums): c = target - n; if c in m: return [m[c], i]; m[n] = i; return []',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) { unordered_map<int,int> m; for (int i=0;i<nums.size();i++) { int complement = target - nums[i]; if (m.count(complement)) { return {m[complement],i}; } m[nums[i]]=i; } return {}; }',
      java: 'int[] twoSum(int[] nums, int target) { Map<Integer,Integer> m = new HashMap<>(); for (int i=0;i<nums.length;i++) { int complement = target - nums[i]; if (m.containsKey(complement)) { return new int[]{m.get(complement),i}; } m.put(nums[i],i); } return new int[2]; }',
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    hints: ['Use a hash map to store seen values and their indices.', 'For each element, check if its complement (target - nums[i]) exists in the map.'],
    testCases: [
      { id: 'tc1', input: '[2,7,11,15], target=9', expectedOutput: '[0,1]', isCustom: false },
      { id: 'tc2', input: '[3,2,4], target=6', expectedOutput: '[1,2]', isCustom: false },
      { id: 'tc3', input: '[3,3], target=6', expectedOutput: '[0,1]', isCustom: true },
    ],
    status: 'unattempted',
    tags: ['array', 'hash-table', 'two-pointer'],
  },
  {
    id: 'p002',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings',
    acceptanceRate: '31.2%',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The longest substring is "abc".' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The longest substring is "b".' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      typescript: 'function lengthOfLongestSubstring(s: string): number { return 0; }',
      python: 'def length_of_longest_substring(s): return 0',
      cpp: 'int lengthOfLongestSubstring(string s) { return 0; }',
      java: 'int lengthOfLongestSubstring(String s) { return 0; }',
    },
    solutionCode: {
      typescript: 'function lengthOfLongestSubstring(s: string): number { let maxLen = 0; let left = 0; const seen = new Set<string>(); for (let right = 0; right < s.length; right++) { if (seen.has(s[right])) { left = Math.max(left, seen.get(s[right]) + 1); } seen.add(s[right]); maxLen = Math.max(maxLen, right - left + 1); } return maxLen; }',
      python: 'def length_of_longest_substring(s): max_len = 0; left = 0; seen = {}; for right, ch in enumerate(s): if ch in seen: left = max(left, seen[ch] + 1); seen[ch] = right; max_len = max(max_len, right - left + 1); return max_len',
      cpp: 'int lengthOfLongestSubstring(string s) { int maxLen = 0; int left = 0; unordered_map<char,int> seen; for (int right = 0; right < s.size(); right++) { if (seen.count(s[right])) { left = max(left, seen[s[right]] + 1); } seen[s[right]] = right; maxLen = max(maxLen, right - left + 1); } return maxLen; }',
      java: 'int lengthOfLongestSubstring(String s) { int maxLen = 0; int left = 0; Set<Character> seen = new HashSet<>(); for (int right = 0; right < s.length(); right++) { if (seen.contains(s.charAt(right))) { left = Math.max(left, seen.get(s.charAt(right)) + 1); } seen.add(s.charAt(right)); maxLen = Math.max(maxLen, right - left + 1); } return maxLen; }',
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, 128))',
    hints: ['Use a sliding window with a hash set/map to track characters in the current window.', 'When a duplicate is found, move the left pointer past the previous occurrence.'],
    testCases: [
      { id: 'tc1', input: '"abcabcbb"', expectedOutput: '3', isCustom: false },
      { id: 'tc2', input: '"bbbbb"', expectedOutput: '1', isCustom: false },
      { id: 'tc3', input: '"pwwkew"', expectedOutput: '3', isCustom: true },
    ],
    status: 'unattempted',
    tags: ['string', 'sliding-window', 'two-pointer'],
  },
  {
    id: 'p003',
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptanceRate: '23.5%',
    description: 'Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: '' },
      { input: 'nums = []', output: '[]' },
    ],
    constraints: ['0 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      typescript: 'function threeSum(nums: number[]): number[][] { return []; }',
      python: 'def three_sum(nums): return []',
      cpp: 'vector<vector<int>> threeSum(vector<int>& nums) { return {}; }',
      java: 'List<List<Integer>> threeSum(int[] nums) { return new ArrayList<>(); }',
    },
    solutionCode: {
      typescript: 'function threeSum(nums: number[]): number[][] { nums.sort((a,b) => a - b); const res: number[][] = []; for (let i = 0; i < nums.length - 2; i++) { if (i > 0 && nums[i] === nums[i-1]) continue; let l = i + 1, r = nums.length - 1; while (l < r) { const sum = nums[i] + nums[l] + nums[r]; if (sum === 0) { res.push([nums[i], nums[l], nums[r]]); while (l < r && nums[l] === nums[l+1]) l++; while (l < r && nums[r] === nums[r-1]) r--; l++; r--; } else if (sum < 0) l++; else r--; } } return res; }',
      python: 'def three_sum(nums): nums.sort(); res = []; for i in range(len(nums)-2): if i > 0 and nums[i] == nums[i-1]: continue; l, r = i+1, len(nums)-1; while l < r: s = nums[i] + nums[l] + nums[r]; if s == 0: res.append([nums[i], nums[l], nums[r]]); while l < r and nums[l] == nums[l+1]: l += 1; while l < r and nums[r] === nums[r-1]: r -= 1; l += 1; r -= 1; elif s < 0: l += 1; else: r -= 1; return res',
      cpp: 'vector<vector<int>> threeSum(vector<int>& nums) { sort(nums.begin(), nums.end()); vector<vector<int>> res; for (int i = 0; i < (int)nums.size()-2; i++) { if (i > 0 && nums[i] == nums[i-1]) continue; int l = i+1, r = nums.size()-1; while (l < r) { int sum = nums[i] + nums[l] + nums[r]; if (sum == 0) { res.push_back({nums[i], nums[l], nums[r]}); while (l < r && nums[l] == nums[l+1]) l++; while (l < r && nums[r] === nums[r-1]) r--; l++; r--; } else if (sum < 0) l++; else r--; } } return res; }',
      java: 'List<List<Integer>> threeSum(int[] nums) { List<List<Integer>> res = new ArrayList<>(); Arrays.sort(nums); for (int i = 0; i < nums.length-2; i++) { if (i > 0 && nums[i] == nums[i-1]) continue; int l = i+1, r = nums.length-1; while (l < r) { int sum = nums[i] + nums[l] + nums[r]; if (sum == 0) { res.add(Arrays.asList(nums[i], nums[l], nums[r])); while (l < r && nums[l] == nums[l+1]) l++; while (l < r && nums[r] == nums[r-1]) r--; l++; r--; } else if (sum < 0) l++; else r--; } } return res;',
    },
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    hints: ['Sort the array first, then use fixed element + two pointers for the remaining two.', 'Skip duplicates at each level to ensure unique triplets.'],
    testCases: [
      { id: 'tc1', input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isCustom: false },
      { id: 'tc2', input: '[]', expectedOutput: '[]', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['array', 'two-pointers', 'sorting'],
  },
  {
    id: 'p006',
    title: 'Valid Sudoku',
    slug: 'valid-sudoku',
    difficulty: 'Medium',
    topic: 'Backtracking',
    acceptanceRate: '51.4%',
    description: 'Determine if a 9x9 Sudoku board is valid according to the standard rules.',
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9",".",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: 'true',
      },
    ],
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit or ".".'],
    starterCode: {
      typescript: 'function isValidSudoku(board: string[][]): boolean { const seen = new Set<string>(); for (let i = 0; i < 9; i++) { for (let j = 0; j < 9; j++) { const v = board[i][j]; if (v !== ".") { if (seen.has(`${i}-${v}`) || seen.has(`${9+j}-${v}`) || seen.has(`${25+Math.floor(i/3)*3 + Math.floor(j/3)}-${v}`) { return false; } seen.add(`${i}-${v}`); seen.add(`${9+j}-${v}`); } } } return true; }',
      python: 'def isValidSudoku(board): seen = set(); for i in range(9): for j in range(9): v = board[i][j]; if v != ".": if f"{i}-{v}" in seen or f"{9+j}-{v}" in seen or f"{25+(i//3)*3 + j//3}-{v}" in seen: return False; seen.add(f"{i}-{v}"); seen.add(f"{9+j}-{v}"); return True',
      cpp: 'bool isValidSudoku(vector<vector<char>>& board) { set<string> seen; for (int i = 0; i < 9; i++) { for (int j = 0; j < 9; j++) { char v = board[i][j]; if (v != ".") { string s1 = to_string(i) + "-" + v; string s2 = to_string(9+j) + "-" + v; string s3 = to_string(25+(i/3)*3 + j/3) + "-" + v; if (seen.count(s1) || seen.count(s2) || seen.count(s3)) return false; seen.insert(s1); seen.insert(s2); seen.insert(s3); } } } return true; }',
      java: 'boolean isValidSudoku(char[][] board) { Set<String> seen = new HashSet<>(); for (int i = 0; i < 9; i++) { for (int j = 0; j < 9; j++) { String v = Character.toString(board[i][j]); if (!v.equals(".")) { String s1 = i + "-" + v; String s2 = (9+j) + "-" + v; String s3 = (25+(i/3)*3 + j/3) + "-" + v; if (seen.contains(s1) || seen.contains(s2) || seen.contains(s3)) return false; seen.add(s1); seen.add(s2); seen.add(s3); } } } return true; }',
    },
    solutionCode: {
      typescript: 'function isValidSudoku(board: string[][]): boolean { const seen = new Set<string>(); for (let i = 0; i < 9; i++) { for (let j = 0; j < 9; j++) { const v = board[i][j]; if (v !== ".") { if (seen.has(`${i}-${v}`) || seen.has(`${9+j}-${v}`) || seen.has(`${25+Math.floor(i/3)*3 + Math.floor(j/3)}-${v}`) { return false; } seen.add(`${i}-${v}`); seen.add(`${9+j}-${v}`); } } } return true; }',
      python: 'def isValidSudoku(board): seen = set(); for i in range(9): for j in range(9): v = board[i][j]; if v != ".": if f"{i}-{v}" in seen or f"{9+j}-{v}" in seen or f"{25+Math.floor(i/3)*3 + Math.floor(j/3)}-{v}" in seen: return False; seen.add(f"{i}-{v}"); seen.add(f"{9+j}-{v}"); return True',
      cpp: 'bool isValidSudoku(vector<vector<char>>& board) { set<string> seen; for (int i = 0; i < 9; i++) { for (int j = 0; j < 9; j++) { char v = board[i][j]; if (v != ".") { string s1 = to_string(i) + "-" + v; string s2 = to_string(9+j) + "-" + v; string s3 = to_string(25+Math.floor(i/3)*3 + Math.floor(j/3)) + "-" + v; if (seen.count(s1) || seen.count(s2) || seen.count(s3)) return false; seen.insert(s1); seen.insert(s2); seen.insert(s3); } } } return true; }',
      java: 'boolean isValidSudoku(char[][] board) { Set<String> seen = new HashSet<>(); for (int i = 0; i < 9; i++) { for (int j = 0; j < 9; j++) { String v = Character.toString(board[i][j]); if (!v.equals(".")) { String s1 = i + "-" + v; String s2 = (9+j) + "-" + v; String s3 = (25+Math.floor(i/3)*3 + Math.floor(j/3)) + "-" + v; if (seen.contains(s1) || seen.contains(s2) || seen.contains(s3)) return false; seen.add(s1); seen.add(s2); seen.add(s3); } } } return true; }',
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Use a set to track seen values in each row, column, and 3x3 box.', 'Box index = (row/3)*3 + (col/3).'],
testCases: [
      {
        id: 'tc1',
        input: '["5","3",".",".","7",".",".",".","."],["6",".",".","1","9",".",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".",".","8",".",".","7","9"]]',
        expectedOutput: 'true',
        isCustom: false,
      },
    ],
    status: 'unattempted',
    tags: ['backtracking', 'hash-set', 'matrix'],
  },
  {
    id: 'p007',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    acceptanceRate: '50.3%',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum = 6.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      typescript: 'function maxSubArray(nums: number[]): number { return nums[0]; }',
      python: 'def max_subarray(nums): return max(nums)',
      cpp: 'int maxSubarray(vector<int>& nums) { return nums[0]; }',
      java: 'int maxSubArray(int[] nums) { return nums[0]; }',
    },
    solutionCode: {
      typescript: 'function maxSubArray(nums: number[]): number { let maxSoFar = nums[0]; let currentMax = nums[0]; for (let i = 1; i < nums.length; i++) { currentMax = Math.max(nums[i], currentMax + nums[i]); maxSoFar = Math.max(maxSoFar, currentMax); } return maxSoFar; }',
      python: 'def max_subarray(nums): max_current = max_global = nums[0]; for i in range(1, len(nums)): max_current = max(nums[i], max_current + nums[i]); max_global = max(max_global, max_current); return max_global',
      cpp: 'int maxSubarray(vector<int>& nums) { int maxSoFar = nums[0]; int currentMax = nums[0]; for (int i = 1; i < nums.size(); i++) { currentMax = max(nums[i], currentMax + nums[i]); maxSoFar = max(maxSoFar, currentMax); } return maxSoFar; }',
      java: 'int maxSubArray(int[] nums) { int maxSoFar = nums[0]; int currentMax = nums[0]; for (int i = 1; i < nums.length; i++) { currentMax = Math.max(nums[i], currentMax + nums[i]); maxSoFar = Math.max(maxSoFar, currentMax); } return maxSoFar; }',
    },
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    hints: ["Kadane's algorithm: at each position, decide whether to extend the current subarray or start a new one.", 'Track both current subarray sum and global maximum.'],
    testCases: [
      { id: 'tc1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['array', 'prefix-sum', 'two-pointers'],
  },
  {
    id: 'p008',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptanceRate: '42.7%',
    description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    starterCode: {
      typescript: 'function merge(intervals: number[][]): number[][] { return []; }',
      python: 'def merge(intervals): return []',
      cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) { return {}; }',
      java: 'int[][] merge(int[][] intervals) { return new int[0][]; }',
    },
    solutionCode: {
      typescript: 'function merge(intervals: number[][]): number[][] { intervals.sort((a,b) => a[0] - b[0]); const res: number[][] = []; for (const interval of intervals) { if (res.length === 0 || res[res.length-1][1] < interval[0]) { res.push(interval); } else { res[res.length-1][1] = Math.max(res[res.length-1][1], interval[1]); } } return res; }',
      python: 'def merge(intervals): intervals.sort(key=lambda x: x[0]); res = []; for interval in intervals: if not res or res[-1][1] < interval[0]: res.append(interval); else: res[-1][1] = max(res[-1][1], interval[1]); return res',
      cpp: 'vector<vector<int>> merge(vector<vector<int>>& intervals) { sort(intervals.begin(), intervals.end()); vector<vector<int>> res; for (auto& interval : intervals) { if (res.empty() || res.back()[1] < interval[0]) { res.push_back(interval); } else { res.back()[1] = max(res.back()[1], interval[1]); } } return res; }',
      java: 'int[][] merge(int[][] intervals) { Arrays.sort(intervals, (a,b) -> Integer.compare(a[0], b[0])); List<int[]> res = new ArrayList<>(); for (int[] interval : intervals) { if (res.isEmpty() || res.get(res.size()-1)[1] < interval[0]) { res.add(interval); } else { res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], interval[1]); } } return res.toArray(new int[0][]); }',
    },
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n) or O(n)',
    hints: ['Sort intervals by start time first.', 'Then linearly merge overlapping ones by extending the current interval\'s end.'],
    testCases: [
      { id: 'tc1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['array', 'sorting', 'two-pointers'],
  },
  {
    id: 'p009',
    title: 'Course Schedule II',
    slug: 'course-schedule-ii',
    difficulty: 'Hard',
topic: 'Topological Sort',
// @ts-ignore
// @ts-ignore
    acceptanceRate: '44.9%',
    description: 'There are a total of n courses you have to take, labeled from 0 to n-1. Some courses may have prerequisites.',
    examples: [
      { input: 'n = 2, prerequisites = [[1,0]]', output: '[0,1]' },
      { input: 'n = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3] or [0,2,1,3]' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= ai, bi < n'],
    starterCode: {
      typescript: 'function findOrder(n: number, prerequisites: number[][]): number[] { return []; }',
      python: 'def find_order(n, prerequisites): return []',
      cpp: 'vector<int> findOrder(int n, vector<vector<int>>& prerequisites) { return {}; }',
      java: 'int[] findOrder(int n, int[][] prerequisites) { return new int[0]; }',
    },
    solutionCode: {
      typescript: 'function findOrder(n: number, prerequisites: number[][]): number[][] { const adj = Array.from({length: n}, () => []); const inDeg = Array.from({length: n}, () => 0); for (const [a, b] of prerequisites) { adj[b].push(a); inDeg[a]++; } const q = []; for (let i = 0; i < n; i++) if (inDeg[i] === 0) q.push(i); const order = []; while (q.length > 0) { const node = q.shift(); order.push(node); for (const neighbor of adj[node]) { if (--inDeg[neighbor] === 0) q.push(neighbor); } return order; }',
      python: 'def find_order(n, prerequisites): from collections import defaultdict, deque; adj = defaultdict(list); in_deg = [0]*n; for a, b in prerequisites: adj[b].append(a); in_deg[a] += 1; q = deque([i for i in range(n) if in_deg[i] == 0]); order = []; while q: node = q.popleft(); order.append(node); for neighbor in adj[node]: if in_deg[neighbor] == 0: q.append(neighbor); return order',
      cpp: 'vector<int> findOrder(int n, vector<vector<int>>& prerequisites) { vector<vector<int>> adj(n); vector<int> in_deg(n, 0); for (auto& p : prerequisites) { adj[p[1]].push_back(p[0]); in_deg[p[0]]++; } queue<int> q; for (int i = 0; i < n; i++) if (in_deg[i] == 0) q.push(i); vector<int> order; while (!q.empty()) { int node = q.front(); q.pop(); order.push_back(node); for (int neighbor : adj[node]) { if (--in_deg[neighbor] == 0) q.push(neighbor); } return order; }',
      java: 'int[] findOrder(int n, int[][] prerequisites) { List<List<Integer>> adj = new ArrayList<>(); for (int i = 0; i < n; i++) adj.add(new ArrayList<>()); int[] inDeg = new int[n]; for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); inDeg[p[0]]++; } Queue<Integer> q = new ArrayDeque<>(); for (int i = 0; i < n; i++) if (inDeg[i] == 0) q.offer(i); List<Integer> order = new ArrayList<>(); while (!q.isEmpty()) { int node = q.poll(); order.add(node); for (int neighbor : adj.get(node)) { if (--inDeg[neighbor] == 0) q.offer(neighbor); } return order.toArray(new Integer[0]); }',
    },
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    hints: ['Use Kahn\'s algorithm (BFS based topological sort).', 'Build adjacency list and in-degree array from prerequisites.'],
    testCases: [
      { id: 'tc1', input: 'n = 2, prerequisites = [[1,0]]', expectedOutput: '[0,1]', isCustom: false },
      { id: 'tc2', input: 'n = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: '[0,1,2,3]', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['graph', 'topological-sort', 'bfs'],
  },
  {
    id: 'p010',
    title: 'N-Queens',
    slug: 'n-queens',
    difficulty: 'Hard',
    topic: 'Backtracking',
    acceptanceRate: '43.6%',
    description: 'The n-queens puzzle asks you to place n queens on an n×n chessboard so that no two queens attack each other.',
    examples: [
      { input: 'n = 4', output: '4 solutions', explanation: '' },
    ],
    constraints: ['1 <= n <= 9'],
    starterCode: {
      typescript: 'function solveNQueens(n: number): string[][] { return []; }',
      python: 'def solve_n_queens(n): return []',
      cpp: 'vector<vector<string>> solveNQueens(int n) { return {}; }',
      java: 'List<List<String>> solveNQueens(int n) { return new ArrayList<>(); }',
    },
    solutionCode: {
      typescript: 'function solveNQueens(n: number): string[][] { const res: string[][] = []; const board: string[] = Array.from({length: n}, () => Array(n).fill(".").map(row => row.join(""))); const cols = new Set(); const posDiag = new Set(); const negDiag = new Set(); function backtrack(r: number) { if (r === n) { const boardCopy = board.map(row => row.join("")); res.push(boardCopy); return; } for (let c = 0; c < n; c++) { if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue; cols.add(c); posDiag.add(r + c); negDiag.add(r - c); board[r] = Array.from({length: n}, (_, i) => i === c ? "Q" : ".").join(""); backtrack(r + 1); cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c); board[r] = Array(n).fill(".").map(() => ".").join(""); } } backtrack(0); return res; }',
      python: 'def solve_n_queens(n): res = []; board = [["." for _ in range(n)] for _ in range(n)]; cols = set(); pos_diag = set(); neg_diag = set(); def backtrack(r): if r == n: res.append(["".join(row) for row in board]); return; for c in range(n): if c in cols or (r + c) in pos_diag or (r - c) in neg_diag: continue; cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c); board[r][c] = "Q"; backtrack(r + 1); cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c); board[r][c] = "."; backtrack(r + 1); backtrack(0); return res',
      cpp: 'vector<vector<string>> solveNQueens(int n) { vector<vector<string>> res; vector<string> board(n, string(n, ".")); set<int> cols, pos_diag, neg_diag; function backtrack(int r) { if (r == n) { vector<string> boardCopy = board; res.push_back(boardCopy); return; } for (int c = 0; c < n; c++) { if (cols.count(c) || pos_diag.count(r + c) || neg_diag.count(r - c)) continue; cols.insert(c); pos_diag.insert(r + c); neg_diag.insert(r - c); board[r][c] = "Q"; backtrack(r + 1); cols.erase(c); pos_diag.erase(r + c); neg_diag.erase(r - c); board[r][c] = string(n, "."); } } backtrack(0); return res; }',
      java: 'List<List<String>> solveNQueens(int n) { List<List<String>> res = new ArrayList<>(); char[][] board = new char[n][n]; for (int i = 0; i < n; i++) Arrays.fill(board[i], "."); Set<Integer> cols = new HashSet<>(); Set<Integer> posDiag = new HashSet<>(); Set<Integer> negDiag = new HashSet<>(); backtrack(0, board, cols, posDiag, negDiag, res); return res; } private void backtrack(int r, char[][] board, Set<Integer> cols, Set<Integer> posDiag, Set<Integer> negDiag, List<List<String>> res) { if (r == n) { List<String> boardCopy = new ArrayList<>(); for (int i = 0; i < n; i++) boardCopy.add(new String(board[i])); res.add(boardCopy); return; } for (int c = 0; c < n; c++) { if (cols.contains(c) || posDiag.contains(r + c) || negDiag.contains(r - c)) continue; cols.add(c); posDiag.add(r + c); negDiag.add(r - c); board[r][c] = "Q"; backtrack(r + 1, board, cols, posDiag, negDiag, res); cols.remove(c); posDiag.remove(r + c); negDiag.remove(r - c); board[r][c] = "."; } }',
    },
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    hints: ['Use backtracking with three sets: columns, positive diagonals (r+c), negative diagonals (r-c).', 'Place queen by row, backtrack when no valid column exists.'],
    testCases: [
      { id: 'tc1', input: 'n = 4', expectedOutput: '4 solutions', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['backtracking', 'recursion', 'bit-manipulation'],
  },
];

// --- Universe Nodes ---

export const universeNodes: AUniverseNode[] = [
  { id: 'u-arrays', topic: 'Arrays', progress: 78, totalProblems: 10, solvedProblems: 8, status: 'completed', description: 'Master array manipulation, two-pointer patterns, and sliding window invariants.', position: { x: 0, y: 0 }, connections: ['u-two-pointers', 'u-strings'] },
  { id: 'u-two-pointers', topic: 'Two Pointers', progress: 65, totalProblems: 8, solvedProblems: 5, status: 'in_progress', description: 'Binary search boundaries, pair-sum patterns, and container convergence.', position: { x: 200, y: 0 }, connections: ['u-arrays', 'u-linkedlists', 'u-graphs'] },
  { id: 'u-linkedlists', topic: 'Linked Lists', progress: 42, totalProblems: 6, solvedProblems: 3, status: 'locked', description: 'Pointer manipulation, reversal, and cycle detection.', position: { x: 400, y: -100 }, connections: ['u-two-pointers'] },
  { id: 'u-trees', topic: 'Trees', progress: 55, totalProblems: 12, solvedProblems: 7, status: 'in_progress', description: 'Traversals, BST validation, and heap operations.', position: { x: 400, y: 100 }, connections: ['u-arrays', 'u-graphs', 'u-heaps'] },
  { id: 'u-graphs', topic: 'Graphs', progress: 38, totalProblems: 15, solvedProblems: 6, status: 'in_progress', description: 'BFS/DFS, shortest paths, and minimum spanning trees.', position: { x: 600, y: 0 }, connections: ['u-trees', 'u-backtracking', 'u-dp'] },
  { id: 'u-dp', topic: 'Dynamic Programming', progress: 28, totalProblems: 10, solvedProblems: 3, status: 'locked', description: 'Memoization patterns, state compression, and combinatorics.', position: { x: 600, y: -100 }, connections: ['u-graphs', 'u-bit'] },
  { id: 'u-backtracking', topic: 'Backtracking', progress: 33, totalProblems: 8, solvedProblems: 3, status: 'locked', description: 'Exhaustive search with pruning and constraint propagation.', position: { x: 800, y: 0 }, connections: ['u-graphs', 'u-dp'] },
  { id: 'u-bit', topic: 'Bit Manipulation', progress: 15, totalProblems: 5, solvedProblems: 1, status: 'locked', description: 'Bitwise operations, masks, and parity invariants.', position: { x: 800, y: 100 }, connections: ['u-backtracking'] },
];

// --- Recent Activities ---

export const recentActivities: AActivityItem[] = [
  { id: 'a1', type: 'solved', title: 'Solved Two Sum', detail: 'Completed arrays section', timeAgo: '2h ago', difficulty: 'Easy', problemId: 'p001' },
  { id: 'a2', type: 'revision', title: 'Revision due', detail: 'Course Schedule II overdue', timeAgo: '5h ago', difficulty: 'Hard', problemId: 'p009' },
  { id: 'a3', type: 'badge', title: 'Streak Milestone', detail: '30-day consistency badge unlocked', timeAgo: '1d ago' },
  { id: 'a4', type: 'failed', title: 'Postponed Maximum Subarray', detail: 'Could not implement Kadane\'s algorithm', timeAgo: '3d ago', difficulty: 'Easy', problemId: 'p007' },
];

// --- Revision Radar Items ---

export const revisionRadarItems: ARevisionItem[] = [
  { id: 'r1', problemId: 'p007', title: 'Maximum Subarray', topic: 'Two Pointers', difficulty: 'Easy', daysAgo: 0, urgency: 'normal', retention: 92, intervalDays: 14 },
  { id: 'r2', problemId: 'p002', title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', daysAgo: 2, urgency: 'warning', retention: 67, intervalDays: 7 },
  { id: 'r3', problemId: 'p009', title: 'Course Schedule II', // @ts-ignore
    topic: 'Topological Sort', difficulty: 'Hard', daysAgo: 5, urgency: 'urgent', retention: 31, intervalDays: 2 },
  { id: 'r4', problemId: 'p006', title: 'Valid Sudoku', topic: 'Backtracking', difficulty: 'Medium', daysAgo: 1, urgency: 'normal', retention: 88, intervalDays: 10 },
];

// --- User Stats ---

export const initialUserStats: AUserStats = {
  name: 'Aaryan',
  handle: 'InterestingAary',
  streak: 12,
  problemsThisWeek: 18,
  accuracy: 87,
  totalPracticeHours: 42.5,
  totalSolved: 93,
  totalProblems: 150,
  easySolved: 52,
  easyTotal: 60,
  mediumSolved: 34,
  mediumTotal: 70,
  hardSolved: 7,
  hardTotal: 20,
  rank: 'Legend',
  rating: 1842,
};

// --- Projects ---

export const aaryanProjects: AProjectInfo[] = [
  { id: 'pr1', title: 'DSAglazzer - Portfolio Tracker', description: 'DSA revision tracker with spaced repetition', tech: ['React 19', 'TypeScript', 'TailwindCSS v4', 'Vite'], stars: 124, githubUrl: 'https://github.com/InterestingAary/DSAglazzer', liveUrl: 'https://interestingaary.github.io/DSAglazzer/', featured: true },
  { id: 'pr2', title: 'ALGO_ELITE Command Center', description: 'DSA training CLI with cosmic shader visualizer', tech: ['React 19', 'TypeScript', 'TailwindCSS v4', 'WebGL / GLSL', 'framer-motion'], stars: 89, githubUrl: 'https://github.com/InterestingAary/algo-elite', featured: false },
  { id: 'pr3', title: 'WebGL Particle Simulator', description: 'Interactive particle system with physics', tech: ['React 19', 'TypeScript', 'TailwindCSS v4', 'WebGL', 'gsap'], stars: 45, githubUrl: 'https://github.com/InterestingAary/webgl-simulator', featured: false },
  { id: 'pr4', title: 'MV3 Browser Extension', description: 'DSA quick-access toolbar and problem launcher', tech: ['React 19', 'TypeScript', 'Vite', 'MV3'], stars: 23, githubUrl: 'https://github.com/InterestingAary/dsa-extension', featured: false },
];