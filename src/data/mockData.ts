// ALGO_ELITE types and comprehensive data store
export type ALDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ATopic =
  | 'Arrays'
  | 'Strings'
  | 'Two Pointers'
  | 'Sliding Window'
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
  intuition: string;
  invariant: string;
  edgeCases: string[];
  testCases: ATestCase[];
  status: 'solved' | 'failed' | 'unattempted';
  lastAttempted?: string;
  nextRevisionDate?: string;
  tags: string[];
  eloRating?: number;
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
  tier?: string;
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
  intuition: string;
  invariant: string;
  timeComplexity: string;
  spaceComplexity: string;
  edgeCases: string[];
}

export interface AUserStats {
  name: string;
  handle: string;
  streak: number;
  currentStreak?: number;
  dueForRevisionCount?: number;
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

export interface ARoadmapStage {
  id: string;
  tier: number;
  title: string;
  subtitle: string;
  description: string;
  requiredUnlocked: boolean;
  topics: ATopic[];
  problemsCount: number;
  completedCount: number;
  problemIds: string[];
}

// ── Rich Problem Dataset ───────────────────────────────────────────────
export const sampleProblems: AProblem[] = [
  {
    id: 'p001',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptanceRate: '48.5%',
    eloRating: 1100,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Implement optimal O(n) hash map solution
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    },
    solutionCode: {
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); ++i) {\n        if (seen.count(target - nums[i])) return {seen[target - nums[i]], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int comp = target - nums[i];\n        if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n        seen.put(nums[i], i);\n    }\n    return new int[0];\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: ['A brute-force solution checks all pairs in O(N^2). Can we do better with a hash map?', 'Store each element and index as you iterate, and check if (target - num) was already recorded.'],
    intuition: 'Instead of searching forward for the pair, look backward at visited elements stored in a hash map for instantaneous O(1) lookup.',
    invariant: 'At step i, seen contains all elements in nums[0...i-1] mapped to their unique index.',
    edgeCases: ['Array with negative numbers and zero', 'Duplicate values forming the exact target (e.g. [3,3], target=6)', 'Target resulting from two large integers'],
    testCases: [
      { id: 'tc1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', isCustom: false },
      { id: 'tc2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', isCustom: false },
      { id: 'tc3', input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]', isCustom: false },
      { id: 'tc4', input: 'nums = [-1,-2,-3,-4,-5], target = -8', expectedOutput: '[2,4]', isCustom: true },
    ],
    status: 'solved',
    tags: ['hash-map', 'arrays', 'math'],
  },
  {
    id: 'p002',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    acceptanceRate: '34.2%',
    eloRating: 1450,
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      typescript: `function lengthOfLongestSubstring(s: string): number {
  let maxLen = 0;
  let left = 0;
  const lastPos = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastPos.has(ch) && lastPos.get(ch)! >= left) {
      left = lastPos.get(ch)! + 1;
    }
    lastPos.set(ch, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    last_pos = {}
    max_len = 0
    left = 0
    for right, ch in enumerate(s):
        if ch in last_pos and last_pos[ch] >= left:
            left = last_pos[ch] + 1
        last_pos[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastPos;
    int maxLen = 0, left = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        if (lastPos.count(s[right]) && lastPos[s[right]] >= left) {
            left = lastPos[s[right]] + 1;
        }
        lastPos[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastPos = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (lastPos.containsKey(ch) && lastPos.get(ch) >= left) {
                left = lastPos.get(ch) + 1;
            }
            lastPos.put(ch, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
    },
    solutionCode: {
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  let maxLen = 0, left = 0;\n  const last = new Map<string, number>();\n  for (let right = 0; right < s.length; right++) {\n    if (last.has(s[right]) && last.get(s[right])! >= left) left = last.get(s[right])! + 1;\n    last.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`,
      python: `def length_of_longest_substring(s: str) -> int:\n    last = {}\n    max_len = left = 0\n    for right, ch in enumerate(s):\n        if ch in last and last[ch] >= left:\n            left = last[ch] + 1\n        last[ch] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    unordered_map<char, int> last;\n    int maxLen = 0, left = 0;\n    for (int r = 0; r < s.size(); ++r) {\n        if (last.count(s[r]) && last[s[r]] >= left) left = last[s[r]] + 1;\n        last[s[r]] = r;\n        maxLen = max(maxLen, r - left + 1);\n    }\n    return maxLen;\n}`,
      java: `public int lengthOfLongestSubstring(String s) {\n    Map<Character, Integer> last = new HashMap<>();\n    int maxLen = 0, left = 0;\n    for (int r = 0; r < s.length(); r++) {\n        if (last.containsKey(s.charAt(r)) && last.get(s.charAt(r)) >= left) left = last.get(s.charAt(r)) + 1;\n        last.put(s.charAt(r), r);\n        maxLen = Math.max(maxLen, r - left + 1);\n    }\n    return maxLen;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, Σ))',
    hints: ['Use sliding window pointers [left, right] and jump left pointer directly past the previous duplicate position.'],
    intuition: 'Maintain a window containing all unique characters. When a repeat character enters from the right, contract the left boundary directly past its previous position.',
    invariant: 'The window s[left...right] always contains distinct characters.',
    edgeCases: ['Empty string "" -> 0', 'Single character "a" -> 1', 'All duplicate characters "bbbbb" -> 1', 'Spaces and symbols "a b c a"'],
    testCases: [
      { id: 'tc1', input: 's = "abcabcbb"', expectedOutput: '3', isCustom: false },
      { id: 'tc2', input: 's = "bbbbb"', expectedOutput: '1', isCustom: false },
      { id: 'tc3', input: 's = "pwwkew"', expectedOutput: '3', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['sliding-window', 'strings', 'hash-map'],
  },
  {
    id: 'p003',
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptanceRate: '33.1%',
    eloRating: 1520,
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Distinct zero-sum triplets.' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    starterCode: {
      typescript: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return res`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`,
    },
    solutionCode: {
      typescript: `function threeSum(nums: number[]): number[][] {\n  nums.sort((a, b) => a - b);\n  const res: number[][] = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (s < 0) l++; else r--;\n    }\n  }\n  return res;\n}`,
      python: `def three_sum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> res;\n    for (int i = 0; i < (int)nums.size() - 2; ++i) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.size() - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (s == 0) {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) ++l;\n                while (l < r && nums[r] == nums[r-1]) --r;\n                ++l; --r;\n            } else if (s < 0) ++l;\n            else --r;\n        }\n    }\n    return res;\n}`,
      java: `public List<List<Integer>> threeSum(int[] nums) {\n    Arrays.sort(nums);\n    List<List<Integer>> res = new ArrayList<>();\n    for (int i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (s == 0) {\n                res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            } else if (s < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}`,
    },
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1) auxiliary',
    hints: ['Sort the array first to allow directional two-pointer scans.', 'Skip duplicate elements at both the fixed index and two-pointer boundaries.'],
    intuition: 'Fix one element at index i, transforming 3Sum into Two-Sum on the remaining sorted subarray using converging left/right pointers.',
    invariant: 'The array is strictly sorted, and every triplet added is non-decreasing with duplicate heads/tails skipped.',
    edgeCases: ['Multiple duplicate zeroes [0, 0, 0, 0]', 'No triplets possible [1, 2, 3]', 'Extremes: large negative and positive numbers'],
    testCases: [
      { id: 'tc1', input: 'nums = [-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isCustom: false },
      { id: 'tc2', input: 'nums = [0,0,0]', expectedOutput: '[[0,0,0]]', isCustom: false },
      { id: 'tc3', input: 'nums = [0,1,1]', expectedOutput: '[]', isCustom: false },
    ],
    status: 'solved',
    tags: ['two-pointers', 'arrays', 'sorting'],
  },
  {
    id: 'p004',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptanceRate: '54.1%',
    eloRating: 1400,
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area between index 1 (height 8) and index 8 (height 7): min(8,7) * 7 = 49.' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: {
      typescript: `function maxArea(height: number[]): number {
  let max = 0;
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    const w = right - left;
    const h = Math.min(height[left], height[right]);
    max = Math.max(max, w * h);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}`,
      python: `def max_area(height: list[int]) -> int:
    max_w = 0
    l, r = 0, len(height) - 1
    while l < r:
        h = min(height[l], height[r])
        max_w = max(max_w, (r - l) * h)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int maxWater = 0, l = 0, r = height.size() - 1;
    while (l < r) {
        maxWater = max(maxWater, (r - l) * min(height[l], height[r]));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return maxWater;
}`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int max = 0, l = 0, r = height.length - 1;
        while (l < r) {
            max = Math.max(max, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}`,
    },
    solutionCode: {
      typescript: `function maxArea(height: number[]): number {\n  let max = 0, l = 0, r = height.length - 1;\n  while (l < r) {\n    max = Math.max(max, (r - l) * Math.min(height[l], height[r]));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return max;\n}`,
      python: `def max_area(height):\n    l, r, ans = 0, len(height) - 1, 0\n    while l < r:\n        ans = max(ans, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return ans`,
      cpp: `int maxArea(vector<int>& height) {\n    int l = 0, r = height.size() - 1, ans = 0;\n    while (l < r) {\n        ans = max(ans, (r - l) * min(height[l], height[r]));\n        if (height[l] < height[r]) ++l; else --r;\n    }\n    return ans;\n}`,
      java: `public int maxArea(int[] height) {\n    int l = 0, r = height.length - 1, ans = 0;\n    while (l < r) {\n        ans = Math.max(ans, (r - l) * Math.min(height[l], height[r]));\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return ans;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['The area is constrained by the shorter line. Moving the taller line inward can only reduce width without increasing the height bottleneck.', 'Always advance the pointer of the shorter line.'],
    intuition: 'Start with maximum width. To find a larger area with smaller width, we must find a taller boundary, which requires replacing the limiting (shorter) pillar.',
    invariant: 'Any container using the shorter pillar and any line strictly between [left...right] cannot exceed the current evaluated area.',
    edgeCases: ['Uniform heights [5, 5, 5, 5]', 'Descending or Ascending stairs [1, 2, 3, 4, 5]'],
    testCases: [
      { id: 'tc1', input: 'height = [1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isCustom: false },
      { id: 'tc2', input: 'height = [1,1]', expectedOutput: '1', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['two-pointers', 'greedy', 'arrays'],
  },
  {
    id: 'p005',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    acceptanceRate: '59.8%',
    eloRating: 1850,
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The 6 units of rain water are trapped between elevation bars.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    starterCode: {
      typescript: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let total = 0;
  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
      python: `def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    l_max = r_max = total = 0
    while l < r:
        if height[l] <= height[r]:
            if height[l] >= l_max:
                l_max = height[l]
            else:
                total += l_max - height[l]
            l += 1
        else:
            if height[r] >= r_max:
                r_max = height[r]
            else:
                total += r_max - height[r]
            r -= 1
    return total`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, total = 0;
    while (l < r) {
        if (height[l] <= height[r]) {
            if (height[l] >= lMax) lMax = height[l];
            else total += lMax - height[l];
            l++;
        } else {
            if (height[r] >= rMax) rMax = height[r];
            else total += rMax - height[r];
            r--;
        }
    }
    return total;
}`,
      java: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1, lMax = 0, rMax = 0, total = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= lMax) lMax = height[l];
                else total += lMax - height[l];
                l++;
            } else {
                if (height[r] >= rMax) rMax = height[r];
                else total += rMax - height[r];
                r--;
            }
        }
        return total;
    }
}`,
    },
    solutionCode: {
      typescript: `function trap(height: number[]): number {\n  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, ans = 0;\n  while (l < r) {\n    if (height[l] <= height[r]) {\n      if (height[l] >= lMax) lMax = height[l];\n      else ans += lMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rMax) rMax = height[r];\n      else ans += rMax - height[r];\n      r--;\n    }\n  }\n  return ans;\n}`,
      python: `def trap(height):\n    l, r, l_max, r_max, ans = 0, len(height) - 1, 0, 0, 0\n    while l < r:\n        if height[l] <= height[r]:\n            if height[l] >= l_max: l_max = height[l]\n            else: ans += l_max - height[l]\n            l += 1\n        else:\n            if height[r] >= r_max: r_max = height[r]\n            else: ans += r_max - height[r]\n            r -= 1\n    return ans`,
      cpp: `int trap(vector<int>& h) {\n    int l = 0, r = h.size() - 1, lM = 0, rM = 0, ans = 0;\n    while (l < r) {\n        if (h[l] <= h[r]) {\n            if (h[l] >= lM) lM = h[l];\n            else ans += lM - h[l];\n            ++l;\n        } else {\n            if (h[r] >= rM) rM = h[r];\n            else ans += rM - h[r];\n            --r;\n        }\n    }\n    return ans;\n}`,
      java: `public int trap(int[] h) {\n    int l = 0, r = h.length - 1, lM = 0, rM = 0, ans = 0;\n    while (l < r) {\n        if (h[l] <= h[r]) {\n            if (h[l] >= lM) lM = h[l];\n            else ans += lM - h[l];\n            l++;\n        } else {\n            if (h[r] >= rM) rM = h[r];\n            else ans += rM - h[r];\n            r--;\n        }\n    }\n    return ans;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['Water trapped above index i is min(max_left, max_right) - height[i].', 'Maintain left_max and right_max dynamically with two pointers converging inwards.'],
    intuition: 'Since the water trapped at any column is bounded by the smaller of the maximum walls to its left and right, we can safely fill water from whichever side currently has the lower maximum.',
    invariant: 'When leftMax <= rightMax, the true global right wall for index left is at least rightMax (which is >= leftMax), making leftMax the definitive limiter.',
    edgeCases: ['Array with fewer than 3 elements -> 0', 'Monotonically increasing or decreasing heights -> 0', 'All zeroes'],
    testCases: [
      { id: 'tc1', input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isCustom: false },
      { id: 'tc2', input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['two-pointers', 'dynamic-programming', 'stack'],
  },
  {
    id: 'p006',
    title: 'Valid Sudoku',
    slug: 'valid-sudoku',
    difficulty: 'Medium',
    topic: 'Backtracking',
    acceptanceRate: '58.2%',
    eloRating: 1350,
    description: 'Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: 1. Each row must contain the digits 1-9 without repetition. 2. Each column must contain the digits 1-9 without repetition. 3. Each of the nine 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.',
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: 'true',
      },
    ],
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit 1-9 or \'.\'.'],
    starterCode: {
      typescript: `function isValidSudoku(board: string[][]): boolean {
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;
      const rowKey = \`r\${r}-\${val}\`;
      const colKey = \`c\${c}-\${val}\`;
      const boxKey = \`b\${Math.floor(r / 3)}-\${Math.floor(c / 3)}-\${val}\`;
      if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) return false;
      seen.add(rowKey);
      seen.add(colKey);
      seen.add(boxKey);
    }
  }
  return true;
}`,
      python: `def is_valid_sudoku(board: list[list[str]]) -> bool:
    seen = set()
    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val == '.':
                continue
            row_key = f"r{r}-{val}"
            col_key = f"c{c}-{val}"
            box_key = f"b{r // 3}-{c // 3}-{val}"
            if row_key in seen or col_key in seen or box_key in seen:
                return False
            seen.add(row_key)
            seen.add(col_key)
            seen.add(box_key)
    return True`,
      cpp: `#include <vector>
#include <unordered_set>
#include <string>
using namespace std;

bool isValidSudoku(vector<vector<char>>& board) {
    unordered_set<string> seen;
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char val = board[r][c];
            if (val == '.') continue;
            string rowK = "r" + to_string(r) + "-" + val;
            string colK = "c" + to_string(c) + "-" + val;
            string boxK = "b" + to_string(r / 3) + "-" + to_string(c / 3) + "-" + val;
            if (seen.count(rowK) || seen.count(colK) || seen.count(boxK)) return false;
            seen.insert(rowK);
            seen.insert(colK);
            seen.insert(boxK);
        }
    }
    return true;
}`,
      java: `import java.util.*;

class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char val = board[r][c];
                if (val == '.') continue;
                String rk = "r" + r + "-" + val;
                String ck = "c" + c + "-" + val;
                String bk = "b" + (r / 3) + "-" + (c / 3) + "-" + val;
                if (!seen.add(rk) || !seen.add(ck) || !seen.add(bk)) return false;
            }
        }
        return true;
    }
}`,
    },
    solutionCode: {
      typescript: `function isValidSudoku(board: string[][]): boolean {\n  const seen = new Set<string>();\n  for (let r = 0; r < 9; r++) {\n    for (let c = 0; c < 9; c++) {\n      const val = board[r][c];\n      if (val === '.') continue;\n      const rk = \`r\${r}-\${val}\`, ck = \`c\${c}-\${val}\`, bk = \`b\${Math.floor(r/3)}-\${Math.floor(c/3)}-\${val}\`;\n      if (seen.has(rk) || seen.has(ck) || seen.has(bk)) return false;\n      seen.add(rk); seen.add(ck); seen.add(bk);\n    }\n  }\n  return true;\n}`,
      python: `def is_valid_sudoku(board):\n    seen = set()\n    for r in range(9):\n        for c in range(9):\n            v = board[r][c]\n            if v != '.':\n                keys = (f"r{r}-{v}", f"c{c}-{v}", f"b{r//3}-{c//3}-{v}")\n                if any(k in seen for k in keys): return False\n                seen.update(keys)\n    return True`,
      cpp: `bool isValidSudoku(vector<vector<char>>& board) {\n    unordered_set<string> seen;\n    for (int r = 0; r < 9; ++r) {\n        for (int c = 0; c < 9; ++c) {\n            char v = board[r][c];\n            if (v == '.') continue;\n            string rk = "r" + to_string(r) + v, ck = "c" + to_string(c) + v, bk = "b" + to_string(r/3) + to_string(c/3) + v;\n            if (seen.count(rk) || seen.count(ck) || seen.count(bk)) return false;\n            seen.insert(rk); seen.insert(ck); seen.insert(bk);\n        }\n    }\n    return true;\n}`,
      java: `public boolean isValidSudoku(char[][] board) {\n    Set<String> seen = new HashSet<>();\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            char v = board[r][c];\n            if (v != '.') {\n                if (!seen.add("r" + r + v) || !seen.add("c" + c + v) || !seen.add("b" + (r/3) + (c/3) + v)) return false;\n            }\n        }\n    }\n    return true;\n}`,
    },
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Check row, column, and 3x3 block constraints by creating unique string or bitmask identifiers.'],
    intuition: 'Each cell contains a constraint in 3 distinct domains: row index, column index, and 3x3 block index ((r/3)*3 + (c/3)).',
    invariant: 'No value exists more than once across its assigned row, col, and subgrid hash sets.',
    edgeCases: ['Completely empty board with only "."', 'Board with multiple valid digits but invalid block placement'],
    testCases: [
      {
        id: 'tc1',
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        expectedOutput: 'true',
        isCustom: false,
      },
    ],
    status: 'unattempted',
    tags: ['matrix', 'hash-set', 'backtracking'],
  },
  {
    id: 'p007',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptanceRate: '50.3%',
    eloRating: 1200,
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      typescript: `function maxSubArray(nums: number[]): number {
  // Kadane's Algorithm
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    curr_sum = max_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int curr = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        curr = max(nums[i], curr + nums[i]);
        best = max(best, curr);
    }
    return best;
}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int curr = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            best = Math.max(best, curr);
        }
        return best;
    }
}`,
    },
    solutionCode: {
      typescript: `function maxSubArray(nums: number[]): number {\n  let cur = nums[0], max = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    max = Math.max(max, cur);\n  }\n  return max;\n}`,
      python: `def max_sub_array(nums):\n    cur = best = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    int cur = nums[0], best = nums[0];\n    for (size_t i = 1; i < nums.size(); ++i) {\n        cur = max(nums[i], cur + nums[i]);\n        best = max(best, cur);\n    }\n    return best;\n}`,
      java: `public int maxSubArray(int[] nums) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        best = Math.max(best, cur);\n    }\n    return best;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ["Kadane's invariant: At each index, decide whether to extend the previous running subarray or restart fresh at nums[i]."],
    intuition: 'If the prefix sum becomes negative, it can only drag down the subsequent sum, so discard it and start fresh from the current index.',
    invariant: 'currSum stores the maximum subarray sum ending exactly at index i.',
    edgeCases: ['All negative numbers [-5, -2, -8, -1] -> -1', 'Single element array [100]'],
    testCases: [
      { id: 'tc1', input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isCustom: false },
      { id: 'tc2', input: 'nums = [1]', expectedOutput: '1', isCustom: false },
      { id: 'tc3', input: 'nums = [5,4,-1,7,8]', expectedOutput: '23', isCustom: false },
    ],
    status: 'solved',
    tags: ['arrays', 'dynamic-programming', 'divide-and-conquer'],
  },
  {
    id: 'p008',
    title: 'Course Schedule II',
    slug: 'course-schedule-ii',
    difficulty: 'Hard',
    topic: 'Graphs',
    acceptanceRate: '48.9%',
    eloRating: 1720,
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]', explanation: 'To take course 1 you should have finished course 0.' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,2,1,3]', explanation: 'Valid topological orders: [0,1,2,3] or [0,2,1,3].' },
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)', 'prerequisites[i].length == 2', '0 <= ai, bi < numCourses', 'ai != bi', 'All the pairs [ai, bi] are distinct.'],
    starterCode: {
      typescript: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => [] as number[]);
  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    inDegree[dest]++;
  }
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  const order: number[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`,
      python: `from collections import deque

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    
    q = deque([i for i in range(num_courses) if in_degree[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return order if len(order) == num_courses else []`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<int> inDegree(numCourses, 0);
    vector<vector<int>> adj(numCourses);
    for (auto& edge : prerequisites) {
        adj[edge[1]].push_back(edge[0]);
        inDegree[edge[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }
    return (int)order.size() == numCourses ? order : vector<int>{};
}`,
      java: `import java.util.*;

class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] edge : prerequisites) {
            adj.get(edge[1]).add(edge[0]);
            inDegree[edge[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.offer(i);
        }
        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[idx++] = u;
            for (int v : adj.get(u)) {
                if (--inDegree[v] == 0) q.offer(v);
            }
        }
        return idx == numCourses ? order : new int[0];
    }
}`,
    },
    solutionCode: {
      typescript: `function findOrder(n: number, pre: number[][]): number[] {\n  const deg = new Array(n).fill(0), adj = Array.from({length: n}, () => [] as number[]);\n  for (const [d, s] of pre) { adj[s].push(d); deg[d]++; }\n  const q: number[] = [], ord: number[] = [];\n  for (let i = 0; i < n; i++) if (deg[i] === 0) q.push(i);\n  while (q.length) {\n    const u = q.shift()!; ord.push(u);\n    for (const v of adj[u]) if (--deg[v] === 0) q.push(v);\n  }\n  return ord.length === n ? ord : [];\n}`,
      python: `def find_order(n, pre):\n    from collections import deque\n    adj, deg = [[] for _ in range(n)], [0]*n\n    for d, s in pre:\n        adj[s].append(d); deg[d] += 1\n    q = deque([i for i in range(n) if deg[i] == 0])\n    res = []\n    while q:\n        u = q.popleft(); res.append(u)\n        for v in adj[u]:\n            deg[v] -= 1\n            if deg[v] == 0: q.append(v)\n    return res if len(res) == n else []`,
      cpp: `vector<int> findOrder(int n, vector<vector<int>>& pre) {\n    vector<int> deg(n, 0), ord; vector<vector<int>> adj(n);\n    for (auto& p : pre) { adj[p[1]].push_back(p[0]); deg[p[0]]++; }\n    queue<int> q;\n    for (int i = 0; i < n; ++i) if (!deg[i]) q.push(i);\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); ord.push_back(u);\n        for (int v : adj[u]) if (--deg[v] == 0) q.push(v);\n    }\n    return ord.size() == n ? ord : vector<int>{};\n}`,
      java: `public int[] findOrder(int n, int[][] pre) {\n    int[] deg = new int[n]; List<List<Integer>> adj = new ArrayList<>();\n    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n    for (int[] p : pre) { adj.get(p[1]).add(p[0]); deg[p[0]]++; }\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < n; i++) if (deg[i] == 0) q.offer(i);\n    int[] ord = new int[n]; int idx = 0;\n    while (!q.isEmpty()) {\n        int u = q.poll(); ord[idx++] = u;\n        for (int v : adj.get(u)) if (--deg[v] == 0) q.offer(v);\n    }\n    return idx == n ? ord : new int[0];\n}`,
    },
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    hints: ["Use Kahn's algorithm (BFS queue of nodes with in-degree 0).", 'If cycle exists, the topological queue exhausts before visiting all V vertices.'],
    intuition: 'A course can only be scheduled once all its prerequisites have in-degree 0. Repeatedly pop zero-dependency courses and decrement dependent neighbor in-degrees.',
    invariant: 'Every node appended to the topological order has had all its dependencies processed.',
    edgeCases: ['Graph with pure cycle [[1,0],[0,1]] -> []', 'Completely disconnected courses with 0 prerequisites'],
    testCases: [
      { id: 'tc1', input: 'numCourses = 2, prerequisites = [[1,0]]', expectedOutput: '[0,1]', isCustom: false },
      { id: 'tc2', input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: '[0,1,2,3]', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['graphs', 'topological-sort', 'bfs'],
  },
  {
    id: 'p009',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    acceptanceRate: '52.4%',
    eloRating: 1050,
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      typescript: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
      python: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
    },
    solutionCode: {
      typescript: `function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }\n  return b;\n}`,
      python: `def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1): a, b = b, a + b\n    return b`,
      cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; ++i) { int c = a + b; a = b; b = c; }\n    return b;\n}`,
      java: `public int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: ['dp[i] = dp[i-1] + dp[i-2]. Standard Fibonacci transition.'],
    intuition: 'To reach step n, you must arrive either from step n-1 (single leap) or step n-2 (double leap). Total combinations equal the sum of both paths.',
    invariant: 'b stores the exact number of distinct paths to step i.',
    edgeCases: ['n = 1 -> 1', 'n = 2 -> 2'],
    testCases: [
      { id: 'tc1', input: 'n = 2', expectedOutput: '2', isCustom: false },
      { id: 'tc2', input: 'n = 3', expectedOutput: '3', isCustom: false },
      { id: 'tc3', input: 'n = 5', expectedOutput: '8', isCustom: false },
    ],
    status: 'solved',
    tags: ['dynamic-programming', 'memoization', 'math'],
  },
  {
    id: 'p010',
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    topic: 'Trees',
    acceptanceRate: '75.2%',
    eloRating: 1150,
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Mirror image swap of all left and right subtrees.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    starterCode: {
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root: TreeNode | None) -> TreeNode | None:
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}`,
      java: `public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
    },
    solutionCode: {
      typescript: `function invertTree(root: TreeNode | null): TreeNode | null {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}`,
      python: `def invert_tree(root):\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    TreeNode* t = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(t);\n    return root;\n}`,
      java: `public TreeNode invertTree(TreeNode root) {\n    if (root == null) return null;\n    TreeNode t = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(t);\n    return root;\n}`,
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) where H is tree height',
    hints: ['Recursively swap the left and right children for every node.'],
    intuition: 'Inversion is a recursive mirror transformation: invert the left child, invert the right child, and swap them.',
    invariant: 'For any subtree rooted at node, all descendants have had their left and right children transposed.',
    edgeCases: ['Null tree root -> null', 'Single node tree'],
    testCases: [
      { id: 'tc1', input: 'root = [4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]', isCustom: false },
      { id: 'tc2', input: 'root = [2,1,3]', expectedOutput: '[2,3,1]', isCustom: false },
    ],
    status: 'unattempted',
    tags: ['trees', 'binary-tree', 'dfs'],
  },
];

// ── Curriculum Roadmap Tiers ──────────────────────────────────────────
export const roadmapStages: ARoadmapStage[] = [
  {
    id: 'stage-1',
    tier: 1,
    title: 'Foundational Mechanics',
    subtitle: 'Arrays, Two Pointers & Sliding Windows',
    description: 'Master in-place array manipulation, hash map lookups, container boundaries, and dynamic window expansion/contraction.',
    requiredUnlocked: true,
    topics: ['Arrays', 'Strings', 'Two Pointers', 'Sliding Window'],
    problemsCount: 4,
    completedCount: 3,
    problemIds: ['p001', 'p002', 'p003', 'p004'],
  },
  {
    id: 'stage-2',
    tier: 2,
    title: 'Linear & Monotonic Invariants',
    subtitle: 'Kadane, Monotonic Stacks & Water Trapping',
    description: 'Construct maximum subarray envelopes, prefix accumulation, and bidirectional wall constraint propagation.',
    requiredUnlocked: true,
    topics: ['Arrays', 'Two Pointers', 'Stack & Queue'],
    problemsCount: 3,
    completedCount: 1,
    problemIds: ['p005', 'p007'],
  },
  {
    id: 'stage-3',
    tier: 3,
    title: 'Hierarchical & Relational Graphs',
    subtitle: 'Binary Trees, Topological Sort & Cycles',
    description: 'Traverse recursive tree structures, detect dependency cycles using Kahn\'s BFS algorithm, and schedule courses.',
    requiredUnlocked: true,
    topics: ['Trees', 'Graphs'],
    problemsCount: 2,
    completedCount: 0,
    problemIds: ['p008', 'p010'],
  },
  {
    id: 'stage-4',
    tier: 4,
    title: 'Combinatorics & State Compression',
    subtitle: 'Backtracking, DP & State Machines',
    description: 'Explore state space matrices with pruning, subgrid bitmasks, memoized recurrence relations, and Fibonacci state steps.',
    requiredUnlocked: false,
    topics: ['Dynamic Programming', 'Backtracking'],
    problemsCount: 2,
    completedCount: 1,
    problemIds: ['p006', 'p009'],
  },
];

// ── Spaced Repetition SRS Flashcards Deck ──────────────────────────────
export const flashcardsDeck: ARevisionItem[] = [
  {
    id: 'rev-01',
    problemId: 'p008',
    title: 'Course Schedule II',
    topic: 'Graphs',
    difficulty: 'Hard',
    daysAgo: 5,
    urgency: 'urgent',
    retention: 32,
    intervalDays: 1,
    intuition: "Build adjacency list and in-degree counts. Push all 0-degree vertices to a BFS queue. When popped, decrement neighbor in-degrees and push newly 0-degree vertices.",
    invariant: "Queue always contains courses whose full prerequisite tree has already been fulfilled.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    edgeCases: ["Cycles (e.g. [1,0], [0,1]) returning empty array", "Disjoint components"],
  },
  {
    id: 'rev-02',
    problemId: 'p005',
    title: 'Trapping Rain Water',
    topic: 'Two Pointers',
    difficulty: 'Hard',
    daysAgo: 3,
    urgency: 'urgent',
    retention: 45,
    intervalDays: 2,
    intuition: "Water column depth is limited by min(maxL, maxR). Two pointers converging inwards allow us to advance the side with the strictly smaller bounding wall.",
    invariant: "If leftMax <= rightMax, leftMax is the true bottleneck for column left because an equal or taller wall exists on the right side.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    edgeCases: ["Ascending or descending stairs", "Arrays < 3 elements"],
  },
  {
    id: 'rev-03',
    problemId: 'p002',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    daysAgo: 2,
    urgency: 'warning',
    retention: 68,
    intervalDays: 4,
    intuition: "Maintain dynamic window [left, right] with a hash map of character last-seen indices. Jump left pointer directly past duplicate character.",
    invariant: "Window s[left...right] always contains distinct unique characters.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(min(N, 128))",
    edgeCases: ["All identical chars 'bbbbb'", "Empty string ''", "Symbols and whitespace"],
  },
  {
    id: 'rev-04',
    problemId: 'p006',
    title: 'Valid Sudoku',
    topic: 'Backtracking',
    difficulty: 'Medium',
    daysAgo: 1,
    urgency: 'normal',
    retention: 84,
    intervalDays: 7,
    intuition: "Represent cell constraints using three hash keys: row-val, col-val, and box-(r/3)-(c/3)-val. Check collisions in a single pass.",
    invariant: "Each valid non-empty cell adds 3 mutually disjoint domain signatures to the visited set.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    edgeCases: ["Valid subgrids with empty '.' cells", "Repeated digits in sub-box"],
  },
  {
    id: 'rev-05',
    problemId: 'p001',
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    daysAgo: 0,
    urgency: 'normal',
    retention: 96,
    intervalDays: 14,
    intuition: "Complement lookup in hash map. Check if (target - num) exists before inserting current num.",
    invariant: "At index i, the map holds all previous array values and their corresponding indices.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    edgeCases: ["Negative targets", "Duplicate elements forming target"],
  },
];

// ── Universe Nodes ──────────────────────────────────────────────────
export const universeNodes: AUniverseNode[] = [
  { id: 'u-arrays', topic: 'Arrays', tier: 'Tier 1', progress: 85, totalProblems: 15, solvedProblems: 13, status: 'completed', description: 'In-place element manipulation, hash table indexing, and prefix transformations.', position: { x: 0, y: 0 }, connections: ['u-two-pointers', 'u-strings'] },
  { id: 'u-two-pointers', topic: 'Two Pointers', tier: 'Tier 1', progress: 75, totalProblems: 12, solvedProblems: 9, status: 'completed', description: 'Directional boundary scans, pair-sum convergence, and geometric area optimization.', position: { x: 180, y: -40 }, connections: ['u-arrays', 'u-sliding-window'] },
  { id: 'u-sliding-window', topic: 'Sliding Window', tier: 'Tier 2', progress: 60, totalProblems: 10, solvedProblems: 6, status: 'in_progress', description: 'Dynamic subsegment expansion, frequency counting, and string pattern matching.', position: { x: 360, y: -80 }, connections: ['u-two-pointers', 'u-trees'] },
  { id: 'u-trees', topic: 'Trees', tier: 'Tier 2', progress: 50, totalProblems: 14, solvedProblems: 7, status: 'in_progress', description: 'Binary tree recursions, mirror transpositions, BST properties, and depth bounds.', position: { x: 540, y: -40 }, connections: ['u-sliding-window', 'u-graphs'] },
  { id: 'u-graphs', topic: 'Graphs', tier: 'Tier 3', progress: 40, totalProblems: 16, solvedProblems: 6, status: 'in_progress', description: 'Adjacency lists, Kahn topological ordering, BFS shortest paths, and cycle diagnostics.', position: { x: 720, y: 0 }, connections: ['u-trees', 'u-dp', 'u-backtracking'] },
  { id: 'u-dp', topic: 'Dynamic Programming', tier: 'Tier 4', progress: 35, totalProblems: 18, solvedProblems: 6, status: 'in_progress', description: 'Optimal substructure, memoized recurrence relations, state transitions, and knapsack bounds.', position: { x: 720, y: 120 }, connections: ['u-graphs'] },
  { id: 'u-backtracking', topic: 'Backtracking', tier: 'Tier 3', progress: 45, totalProblems: 8, solvedProblems: 4, status: 'in_progress', description: 'State-space tree exploration, constraint pruning, and combinatoric solutions.', position: { x: 540, y: 120 }, connections: ['u-graphs'] },
  { id: 'u-strings', topic: 'Strings', tier: 'Tier 1', progress: 70, totalProblems: 10, solvedProblems: 7, status: 'completed', description: 'String tokenization, anagram frequency mappings, and palindromic invariants.', position: { x: 180, y: 60 }, connections: ['u-arrays', 'u-sliding-window'] },
];

// ── Initial User Stats ──────────────────────────────────────────────
export const initialUserStats: AUserStats = {
  name: 'Aaryan',
  handle: 'InterestingAary',
  streak: 12,
  currentStreak: 12,
  dueForRevisionCount: 4,
  problemsThisWeek: 18,
  accuracy: 89,
  totalPracticeHours: 46.5,
  totalSolved: 93,
  totalProblems: 150,
  easySolved: 52,
  easyTotal: 60,
  mediumSolved: 34,
  mediumTotal: 70,
  hardSolved: 7,
  hardTotal: 20,
  rank: 'Knight / Guardian',
  rating: 1842,
};

// ── Aaryan Projects ─────────────────────────────────────────────────
export const aaryanProjects: AProjectInfo[] = [
  {
    id: 'pr1',
    title: 'DSAglazzer - Command Center',
    description: 'High-performance spaced repetition DSA tracker with interactive tripartite code IDE and telemetry matrix.',
    tech: ['React 19', 'TypeScript', 'TailwindCSS v4', 'Vite', 'LocalStorage SRS'],
    stars: 142,
    githubUrl: 'https://github.com/InterestingAary/DSAglazzer',
    liveUrl: 'https://interestingaary.github.io/DSAglazzer/',
    featured: true,
  },
  {
    id: 'pr2',
    title: 'ALGO_ELITE Cosmic Terminal',
    description: 'Algorithmic training platform with WebGL shader visualizers and interactive CLI command prompt.',
    tech: ['TypeScript', 'WebGL / GLSL', 'Canvas', 'framer-motion'],
    stars: 96,
    githubUrl: 'https://github.com/InterestingAary/algo-elite',
    featured: true,
  },
  {
    id: 'pr3',
    title: 'Srujana Smart Assist IoT',
    description: 'Award-winning computer vision and assistive IoT solution for accessibility, recognizing gestures in real-time.',
    tech: ['Python', 'OpenCV', 'TensorFlow Lite', 'Raspberry Pi'],
    stars: 64,
    githubUrl: 'https://github.com/InterestingAary/smart-assist',
    featured: false,
  },
  {
    id: 'pr4',
    title: 'DSA Quick-Launch Chrome Extension',
    description: 'Manifest V3 browser toolbar extension connecting competitive platforms directly to spaced repetition queues.',
    tech: ['JavaScript', 'MV3', 'Chrome API', 'CSS3'],
    stars: 38,
    githubUrl: 'https://github.com/InterestingAary/dsa-extension',
    featured: false,
  },
];
