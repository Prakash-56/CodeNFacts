"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA CONSTANTS ───────────────────────────────────────────────────────────

const DSA_PROBLEMS = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", solved: false,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation: "Use a HashMap to store visited numbers. For each number, check if its complement (target - num) exists in the map. O(n) time, O(n) space."
  },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example: "Input: s = '()[]{}'\nOutput: true",
    solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if ('({['.includes(char)) stack.push(char);
    else if (stack.pop() !== map[char]) return false;
  }
  return stack.length === 0;
}`,
    explanation: "Use a stack. Push opening brackets, pop and verify matching for closing brackets. Stack must be empty at end."
  },
  { id: 3, title: "Reverse Linked List", difficulty: "Easy", category: "Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    example: "Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
    solution: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    explanation: "Iteratively reverse pointers. Keep track of previous, current, and next nodes. O(n) time, O(1) space."
  },
  { id: 4, title: "Maximum Subarray", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    example: "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6",
    solution: `function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    explanation: "Kadane's Algorithm: At each position, decide whether to extend current subarray or start new one. Track global maximum."
  },
  { id: 5, title: "Binary Search", difficulty: "Easy", category: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
    example: "Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4",
    solution: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    explanation: "Divide search space in half each iteration. Compare middle element with target to decide which half to search next."
  },
  { id: 6, title: "Merge Two Sorted Lists", difficulty: "Easy", category: "Linked List",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    example: "Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]",
    solution: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}`,
    explanation: "Use a dummy head node. Compare heads of both lists, attach smaller one, advance that pointer. Attach remaining list at end."
  },
  { id: 7, title: "Climbing Stairs", difficulty: "Easy", category: "Dynamic Programming",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
    example: "Input: n = 3\nOutput: 3",
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    explanation: "Fibonacci sequence pattern. Ways to reach step n = ways to reach step (n-1) + ways to reach step (n-2). O(n) time, O(1) space."
  },
  { id: 8, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", category: "Arrays",
    description: "Given an array prices where prices[i] is the price of a given stock on the ith day, maximize your profit.",
    example: "Input: prices = [7,1,5,3,6,4]\nOutput: 5",
    solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
    explanation: "Track minimum price seen so far. For each price, calculate potential profit. Update maximum profit accordingly."
  },
  { id: 9, title: "Invert Binary Tree", difficulty: "Easy", category: "Trees",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    example: "Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]",
    solution: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
    explanation: "Recursively swap left and right children for every node. Base case: null node returns null."
  },
  { id: 10, title: "Valid BST", difficulty: "Medium", category: "Trees",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    example: "Input: root = [2,1,3]\nOutput: true",
    solution: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && 
         isValidBST(root.right, root.val, max);
}`,
    explanation: "Pass valid range (min, max) for each node. Each node must be strictly within its valid range. Recurse with updated bounds."
  },
  { id: 11, title: "Number of Islands", difficulty: "Medium", category: "Graph",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    example: "Input: grid = [['1','1','0'],['0','1','0'],['0','0','1']]\nOutput: 2",
    solution: `function numIslands(grid) {
  let count = 0;
  const dfs = (i, j) => {
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);
  };
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
      if (grid[i][j] === '1') { dfs(i, j); count++; }
  return count;
}`,
    explanation: "Use DFS to sink each island (mark visited cells as '0'). Count how many DFS calls we initiate."
  },
  { id: 12, title: "Course Schedule", difficulty: "Medium", category: "Graph",
    description: "There are numCourses courses. Given an array prerequisites where prerequisites[i] = [ai, bi], determine if you can finish all courses.",
    example: "Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true",
    solution: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  prerequisites.forEach(([a, b]) => graph[b].push(a));
  const visited = new Array(numCourses).fill(0);
  const dfs = (node) => {
    if (visited[node] === 1) return false;
    if (visited[node] === 2) return true;
    visited[node] = 1;
    for (const next of graph[node]) if (!dfs(next)) return false;
    visited[node] = 2;
    return true;
  };
  for (let i = 0; i < numCourses; i++) if (!dfs(i)) return false;
  return true;
}`,
    explanation: "Detect cycle in directed graph using DFS with 3 states: unvisited(0), in-progress(1), done(2). Cycle means impossible."
  },
  { id: 13, title: "Longest Common Subsequence", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    example: "Input: text1 = 'abcde', text2 = 'ace'\nOutput: 3",
    solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = text1[i-1] === text2[j-1] 
        ? dp[i-1][j-1] + 1 
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}`,
    explanation: "2D DP table. If characters match, LCS extends by 1. Otherwise, take max of excluding one character from either string."
  },
  { id: 14, title: "Word Search", difficulty: "Medium", category: "Backtracking",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
    example: "Input: board = [['A','B','C'],['S','F','C'],['A','D','E']], word = 'ABCCED'\nOutput: true",
    solution: `function exist(board, word) {
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || j < 0 || i >= board.length || j >= board[0].length || board[i][j] !== word[k]) return false;
    const temp = board[i][j]; board[i][j] = '#';
    const found = dfs(i+1,j,k+1) || dfs(i-1,j,k+1) || dfs(i,j+1,k+1) || dfs(i,j-1,k+1);
    board[i][j] = temp;
    return found;
  };
  for (let i = 0; i < board.length; i++)
    for (let j = 0; j < board[0].length; j++)
      if (dfs(i, j, 0)) return true;
  return false;
}`,
    explanation: "DFS backtracking. Mark cell visited temporarily, explore all 4 directions, restore cell after exploration."
  },
  { id: 15, title: "Merge K Sorted Lists", difficulty: "Hard", category: "Linked List",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    example: "Input: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]",
    solution: `function mergeKLists(lists) {
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(mergeTwoLists(lists[i], lists[i+1] || null));
    }
    lists = merged;
  }
  return lists[0];
}`,
    explanation: "Divide and conquer: repeatedly merge pairs of lists until one remains. O(N log k) time where N is total nodes, k is number of lists."
  },
  { id: 16, title: "Trapping Rain Water", difficulty: "Hard", category: "Arrays",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    example: "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6",
    solution: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
      left++;
    } else {
      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
      right--;
    }
  }
  return water;
}`,
    explanation: "Two pointer approach. Water at any position = min(maxLeft, maxRight) - height. Move the pointer with smaller max height inward."
  },
  { id: 17, title: "LRU Cache", difficulty: "Hard", category: "Design",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    example: "LRUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1",
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, value);
  }
}`,
    explanation: "JavaScript Map preserves insertion order. Delete and re-insert on access to maintain recency. Evict first (oldest) entry when full."
  },
  { id: 18, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Binary Search",
    description: "Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays.",
    example: "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.0",
    solution: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxL1 = i === 0 ? -Infinity : nums1[i-1];
    const minR1 = i === m ? Infinity : nums1[i];
    const maxL2 = j === 0 ? -Infinity : nums2[j-1];
    const minR2 = j === n ? Infinity : nums2[j];
    if (maxL1 <= minR2 && maxL2 <= minR1) {
      if ((m + n) % 2 === 0) return (Math.max(maxL1,maxL2) + Math.min(minR1,minR2)) / 2;
      return Math.max(maxL1, maxL2);
    } else if (maxL1 > minR2) hi = i - 1;
    else lo = i + 1;
  }
}`,
    explanation: "Binary search on partition point of smaller array. Find partition where all left elements ≤ all right elements across both arrays."
  },
  { id: 19, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", category: "Trees",
    description: "Design an algorithm to serialize and deserialize a binary tree.",
    example: "serialize([1,2,3,null,null,4,5]) = '1,2,3,null,null,4,5'",
    solution: `function serialize(root) {
  if (!root) return 'null';
  return root.val + ',' + serialize(root.left) + ',' + serialize(root.right);
}
function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  const build = () => {
    if (vals[i] === 'null') { i++; return null; }
    const node = new TreeNode(parseInt(vals[i++]));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}`,
    explanation: "Preorder traversal for both operations. Serialize null pointers explicitly. Deserialize using index into split string array."
  },
  { id: 20, title: "Sliding Window Maximum", difficulty: "Hard", category: "Sliding Window",
    description: "Given an array of integers nums, there is a sliding window of size k which moves from left to right. Return the max sliding window.",
    example: "Input: nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [3,3,5,5,6,7]",
    solution: `function maxSlidingWindow(nums, k) {
  const deque = [], result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length-1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
    explanation: "Monotonic deque stores indices in decreasing order of values. Front always holds index of maximum in current window."
  },
  { id: 21, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given a string s, return the longest palindromic substring in s.",
    example: "Input: s = 'babad'\nOutput: 'bab'",
    solution: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}`,
    explanation: "Expand around center for both odd and even length palindromes. Track start and max length of best palindrome found."
  },
  { id: 22, title: "Jump Game", difficulty: "Medium", category: "Greedy",
    description: "Given an integer array nums, you are initially at first index. Determine if you can reach the last index.",
    example: "Input: nums = [2,3,1,1,4]\nOutput: true",
    solution: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    explanation: "Greedy: track maximum reachable index. If current index exceeds max reach, we're stuck. Update max reach at each step."
  },
  { id: 23, title: "3Sum", difficulty: "Medium", category: "Arrays",
    description: "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i ≠ j ≠ k and they sum to zero.",
    example: "Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]",
    solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) { result.push([nums[i],nums[l],nums[r]]); while(nums[l]===nums[l+1])l++; while(nums[r]===nums[r-1])r--; l++; r--; }
      else if (sum < 0) l++;
      else r--;
    }
  }
  return result;
}`,
    explanation: "Sort array, fix one element, use two pointers for remaining two. Skip duplicates to avoid duplicate triplets."
  },
  { id: 24, title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers",
    description: "Given n non-negative integers a1,a2,...,an representing heights of lines, find two lines that form a container with most water.",
    example: "Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49",
    solution: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    maxWater = Math.max(maxWater, Math.min(height[left], height[right]) * (right - left));
    height[left] < height[right] ? left++ : right--;
  }
  return maxWater;
}`,
    explanation: "Two pointers from ends. Area = min(height) × width. Move pointer with smaller height (moving larger can't increase min)."
  },
  { id: 25, title: "Subsets", difficulty: "Medium", category: "Backtracking",
    description: "Given an integer array nums of unique elements, return all possible subsets (the power set).",
    example: "Input: nums = [1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
    solution: `function subsets(nums) {
  const result = [[]];
  for (const num of nums) {
    const newSubsets = result.map(subset => [...subset, num]);
    result.push(...newSubsets);
  }
  return result;
}`,
    explanation: "For each number, create new subsets by adding it to all existing subsets. Start with empty set. Iterative approach."
  },
  { id: 26, title: "Permutations", difficulty: "Medium", category: "Backtracking",
    description: "Given an array nums of distinct integers, return all possible permutations.",
    example: "Input: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
    solution: `function permute(nums) {
  const result = [];
  const backtrack = (current, remaining) => {
    if (!remaining.length) { result.push([...current]); return; }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0,i), ...remaining.slice(i+1)]);
      current.pop();
    }
  };
  backtrack([], nums);
  return result;
}`,
    explanation: "Backtracking: at each step, pick any remaining number, add to current permutation, recurse with rest. Undo choice after recursion."
  },
  { id: 27, title: "Unique Paths", difficulty: "Medium", category: "Dynamic Programming",
    description: "A robot is on an m×n grid top-left corner. It can only move right or down. How many unique paths are there to reach bottom-right?",
    example: "Input: m = 3, n = 7\nOutput: 28",
    solution: `function uniquePaths(m, n) {
  const dp = Array(m).fill(null).map(() => Array(n).fill(1));
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
  return dp[m-1][n-1];
}`,
    explanation: "DP: paths to any cell = paths from above + paths from left. First row and column are all 1s (only one way to reach them)."
  },
  { id: 28, title: "House Robber", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given an array of non-negative integers representing house values, determine the maximum amount you can rob without robbing adjacent houses.",
    example: "Input: nums = [2,7,9,3,1]\nOutput: 12",
    solution: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const num of nums) {
    [prev2, prev1] = [prev1, Math.max(prev1, prev2 + num)];
  }
  return prev1;
}`,
    explanation: "DP with space optimization. At each house: either skip it (prev1) or rob it (prev2 + current). Take max. Only need 2 variables."
  },
  { id: 29, title: "Coin Change", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given an integer array coins and an integer amount, return the fewest number of coins needed to make up that amount.",
    example: "Input: coins = [1,5,11,25], amount = 11\nOutput: 1",
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++)
    for (const coin of coins)
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    explanation: "Bottom-up DP. For each amount, try all coins and take minimum coins needed. Build solution from base case (0 coins for amount 0)."
  },
  { id: 30, title: "Decode Ways", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given a string s containing only digits, return the number of ways to decode it.",
    example: "Input: s = '226'\nOutput: 3 (BZ, VF, BBF)",
    solution: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i-1]);
    const two = parseInt(s.substring(i-2, i));
    if (one >= 1) dp[i] += dp[i-1];
    if (two >= 10 && two <= 26) dp[i] += dp[i-2];
  }
  return dp[n];
}`,
    explanation: "DP: single digit decode + two digit decode. Single digit valid if 1-9. Two digit valid if 10-26."
  },
  { id: 31, title: "Word Break", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given a string s and a dictionary wordDict, return true if s can be segmented into dictionary words.",
    example: "Input: s = 'leetcode', wordDict = ['leet','code']\nOutput: true",
    solution: `function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++)
    for (let j = 0; j < i; j++)
      if (dp[j] && set.has(s.substring(j, i))) { dp[i] = true; break; }
  return dp[s.length];
}`,
    explanation: "DP: dp[i] = true if s[0..i] can be segmented. For each position, check if any valid word ends there and dp[start] is true."
  },
  { id: 32, title: "Longest Increasing Subsequence", difficulty: "Medium", category: "Dynamic Programming",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    example: "Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4",
    solution: `function lengthOfLIS(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      tails[mid] < num ? lo = mid + 1 : hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}`,
    explanation: "Binary search patience sorting. Maintain array of smallest tail elements. Length of this array = LIS length. O(n log n)."
  },
  { id: 33, title: "Pacific Atlantic Water Flow", difficulty: "Medium", category: "Graph",
    description: "Given an m×n island matrix of heights, return all cells that can flow to both the Pacific and Atlantic oceans.",
    example: "Input: heights = [[1,2,2,3,5],[3,2,3,4,4],...]\nOutput: [[0,4],[1,3],[1,4],...]",
    solution: `function pacificAtlantic(heights) {
  const m = heights.length, n = heights[0].length;
  const pac = Array.from({length:m}, () => new Array(n).fill(false));
  const atl = Array.from({length:m}, () => new Array(n).fill(false));
  const dfs = (i, j, visited, prevH) => {
    if (i<0||j<0||i>=m||j>=n||visited[i][j]||heights[i][j]<prevH) return;
    visited[i][j] = true;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([di,dj]) => dfs(i+di,j+dj,visited,heights[i][j]));
  };
  for (let i=0;i<m;i++) { dfs(i,0,pac,heights[i][0]); dfs(i,n-1,atl,heights[i][n-1]); }
  for (let j=0;j<n;j++) { dfs(0,j,pac,heights[0][j]); dfs(m-1,j,atl,heights[m-1][j]); }
  const res = [];
  for (let i=0;i<m;i++) for (let j=0;j<n;j++) if (pac[i][j]&&atl[i][j]) res.push([i,j]);
  return res;
}`,
    explanation: "Reverse DFS from ocean borders. Water flows in reverse from ocean to higher cells. Find intersection of reachable sets."
  },
  { id: 34, title: "Rotting Oranges", difficulty: "Medium", category: "BFS",
    description: "Given a grid with fresh(1) and rotten(2) oranges, return minimum minutes until no fresh orange exists, or -1 if impossible.",
    example: "Input: grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4",
    solution: `function orangesRotting(grid) {
  const queue = [], m = grid.length, n = grid[0].length;
  let fresh = 0, time = 0;
  for (let i=0;i<m;i++) for (let j=0;j<n;j++) {
    if (grid[i][j]===2) queue.push([i,j,0]);
    if (grid[i][j]===1) fresh++;
  }
  let idx = 0;
  while (idx < queue.length) {
    const [i, j, t] = queue[idx++];
    for (const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const ni=i+di, nj=j+dj;
      if (ni>=0&&nj>=0&&ni<m&&nj<n&&grid[ni][nj]===1) {
        grid[ni][nj]=2; fresh--; time=t+1; queue.push([ni,nj,t+1]);
      }
    }
  }
  return fresh===0 ? time : -1;
}`,
    explanation: "Multi-source BFS starting from all rotten oranges simultaneously. Track time and remaining fresh count."
  },
  { id: 35, title: "Minimum Window Substring", difficulty: "Hard", category: "Sliding Window",
    description: "Given strings s and t, return the minimum window in s which will contain all characters in t.",
    example: "Input: s = 'ADOBECODEBANC', t = 'ABC'\nOutput: 'BANC'",
    solution: `function minWindow(s, t) {
  const need = new Map(), window = new Map();
  for (const c of t) need.set(c, (need.get(c)||0)+1);
  let left=0, valid=0, start=0, minLen=Infinity;
  for (let right=0; right<s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c)||0)+1);
    if (need.has(c) && window.get(c)===need.get(c)) valid++;
    while (valid===need.size) {
      if (right-left+1<minLen) { minLen=right-left+1; start=left; }
      const d=s[left++];
      if (need.has(d) && window.get(d)===need.get(d)) valid--;
      window.set(d, window.get(d)-1);
    }
  }
  return minLen===Infinity ? '' : s.substring(start, start+minLen);
}`,
    explanation: "Sliding window with frequency maps. Expand right until valid window, then shrink left while maintaining validity."
  },
  { id: 36, title: "N-Queens", difficulty: "Hard", category: "Backtracking",
    description: "The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.",
    example: "Input: n = 4\nOutput: [['..Q.','Q...','...Q','.Q..'],...]",
    solution: `function solveNQueens(n) {
  const result = [], board = Array(n).fill(null).map(() => Array(n).fill('.'));
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  const backtrack = (row) => {
    if (row === n) { result.push(board.map(r => r.join(''))); return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col)||diag1.has(row-col)||diag2.has(row+col)) continue;
      board[row][col]='Q'; cols.add(col); diag1.add(row-col); diag2.add(row+col);
      backtrack(row+1);
      board[row][col]='.'; cols.delete(col); diag1.delete(row-col); diag2.delete(row+col);
    }
  };
  backtrack(0);
  return result;
}`,
    explanation: "Backtracking with sets for column, diagonal attack tracking. Place one queen per row, check safety using sets."
  },
  { id: 37, title: "Regular Expression Matching", difficulty: "Hard", category: "Dynamic Programming",
    description: "Given input string s and pattern p, implement regular expression matching with '.' and '*'.",
    example: "Input: s = 'aab', p = 'c*a*b'\nOutput: true",
    solution: `function isMatch(s, p) {
  const m=s.length, n=p.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let j=1;j<=n;j++) if (p[j-1]==='*') dp[0][j]=dp[0][j-2];
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) {
    if (p[j-1]==='*') {
      dp[i][j] = dp[i][j-2] || ((p[j-2]==='.'||p[j-2]===s[i-1]) && dp[i-1][j]);
    } else {
      dp[i][j] = (p[j-1]==='.'||p[j-1]===s[i-1]) && dp[i-1][j-1];
    }
  }
  return dp[m][n];
}`,
    explanation: "2D DP. Handle '*' as zero occurrences (skip pair) or one+ occurrences (match and advance in s). '.' matches any character."
  },
  { id: 38, title: "Alien Dictionary", difficulty: "Hard", category: "Graph",
    description: "Given a sorted dictionary of an alien language, find the order of characters in the alien language.",
    example: "Input: words = ['wrt','wrf','er','ett','rftt']\nOutput: 'wertf'",
    solution: `function alienOrder(words) {
  const adj = new Map(), inDegree = new Map();
  for (const w of words) for (const c of w) { if (!adj.has(c)) adj.set(c,[]); if (!inDegree.has(c)) inDegree.set(c,0); }
  for (let i=0;i<words.length-1;i++) {
    const [w1,w2]=[words[i],words[i+1]];
    const minLen=Math.min(w1.length,w2.length);
    if (w1.length>w2.length && w1.startsWith(w2)) return '';
    for (let j=0;j<minLen;j++) if (w1[j]!==w2[j]) { adj.get(w1[j]).push(w2[j]); inDegree.set(w2[j],(inDegree.get(w2[j])||0)+1); break; }
  }
  const queue=[...inDegree.entries()].filter(([,v])=>v===0).map(([k])=>k);
  let result='';
  while (queue.length) {
    const c=queue.shift(); result+=c;
    for (const next of adj.get(c)) { inDegree.set(next,inDegree.get(next)-1); if (!inDegree.get(next)) queue.push(next); }
  }
  return result.length===inDegree.size ? result : '';
}`,
    explanation: "Topological sort. Compare adjacent words to build dependency graph. BFS from nodes with in-degree 0."
  },
  { id: 39, title: "Bus Routes", difficulty: "Hard", category: "BFS",
    description: "You are given an array routes, where routes[i] is a bus route. Return the least number of buses to travel from source to target.",
    example: "Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6\nOutput: 2",
    solution: `function numBusesToDestination(routes, source, target) {
  if (source === target) return 0;
  const stopToRoutes = new Map();
  routes.forEach((route, i) => route.forEach(stop => {
    if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
    stopToRoutes.get(stop).push(i);
  }));
  const visitedStop = new Set([source]), visitedRoute = new Set();
  let queue = [source], buses = 0;
  while (queue.length) {
    const nextQ = []; buses++;
    for (const stop of queue) for (const route of (stopToRoutes.get(stop)||[])) {
      if (visitedRoute.has(route)) continue;
      visitedRoute.add(route);
      for (const s of routes[route]) {
        if (s === target) return buses;
        if (!visitedStop.has(s)) { visitedStop.add(s); nextQ.push(s); }
      }
    }
    queue = nextQ;
  }
  return -1;
}`,
    explanation: "BFS on routes level. For each stop in current level, find all routes through it, add all stops on those routes to next level."
  },
  { id: 40, title: "Shortest Path in Binary Matrix", difficulty: "Medium", category: "BFS",
    description: "Given n×n binary matrix, return the length of shortest clear path from top-left to bottom-right. Path uses 8-directional movement.",
    example: "Input: grid = [[0,1],[1,0]]\nOutput: 2",
    solution: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0]===1 || grid[n-1][n-1]===1) return -1;
  const queue = [[0,0,1]]; grid[0][0]=1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  while (queue.length) {
    const [r,c,d] = queue.shift();
    if (r===n-1 && c===n-1) return d;
    for (const [dr,dc] of dirs) {
      const [nr,nc] = [r+dr, c+dc];
      if (nr>=0&&nc>=0&&nr<n&&nc<n&&grid[nr][nc]===0) { grid[nr][nc]=1; queue.push([nr,nc,d+1]); }
    }
  }
  return -1;
}`,
    explanation: "BFS guarantees shortest path. Mark visited cells by setting to 1. Explore all 8 directions at each step."
  },
  { id: 41, title: "Task Scheduler", difficulty: "Medium", category: "Greedy",
    description: "Given a characters array tasks and a non-negative integer n, return minimum intervals CPU will take to finish all the tasks.",
    example: "Input: tasks = ['A','A','A','B','B','B'], n = 2\nOutput: 8",
    solution: `function leastInterval(tasks, n) {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0)-65]++;
  freq.sort((a,b)=>b-a);
  const maxFreq = freq[0];
  let maxCount = freq.filter(f=>f===maxFreq).length;
  return Math.max(tasks.length, (maxFreq-1)*(n+1)+maxCount);
}`,
    explanation: "Formula: (maxFreq-1)*(n+1)+countOfMaxFreq. Arrange most frequent task as anchor, fill cooldown with others. Take max with tasks.length."
  },
  { id: 42, title: "Meeting Rooms II", difficulty: "Medium", category: "Greedy",
    description: "Given an array of meeting time intervals, find the minimum number of conference rooms required.",
    example: "Input: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2",
    solution: `function minMeetingRooms(intervals) {
  const starts = intervals.map(i=>i[0]).sort((a,b)=>a-b);
  const ends = intervals.map(i=>i[1]).sort((a,b)=>a-b);
  let rooms = 0, endIdx = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] >= ends[endIdx]) endIdx++;
    else rooms++;
  }
  return rooms;
}`,
    explanation: "Sort starts and ends separately. For each meeting start, if earliest end has passed, reuse that room; else need new room."
  },
  { id: 43, title: "Top K Frequent Elements", difficulty: "Medium", category: "Heap",
    description: "Given an integer array nums and an integer k, return the k most frequent elements.",
    example: "Input: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]",
    solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n)||0)+1);
  const buckets = Array.from({length: nums.length+1}, ()=>[]);
  for (const [num, count] of freq) buckets[count].push(num);
  const result = [];
  for (let i = buckets.length-1; i >= 0 && result.length < k; i--)
    result.push(...buckets[i]);
  return result.slice(0, k);
}`,
    explanation: "Bucket sort by frequency. Create array of buckets indexed by frequency. Iterate from highest frequency to collect top k."
  },
  { id: 44, title: "Find Median from Data Stream", difficulty: "Hard", category: "Heap",
    description: "Implement MedianFinder class with addNum and findMedian methods.",
    example: "addNum(1); addNum(2); findMedian()→1.5; addNum(3); findMedian()→2.0",
    solution: `class MedianFinder {
  constructor() {
    this.small = new MaxHeap(); // lower half
    this.large = new MinHeap(); // upper half
  }
  addNum(num) {
    this.small.push(num);
    this.large.push(this.small.pop());
    if (this.small.size() < this.large.size())
      this.small.push(this.large.pop());
  }
  findMedian() {
    return this.small.size() > this.large.size()
      ? this.small.peek()
      : (this.small.peek() + this.large.peek()) / 2;
  }
}`,
    explanation: "Two heaps: max-heap for lower half, min-heap for upper half. Keep balanced (max difference 1). Median from tops."
  },
  { id: 45, title: "Longest Consecutive Sequence", difficulty: "Medium", category: "Hash Map",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
    example: "Input: nums = [100,4,200,1,3,2]\nOutput: 4 (sequence: 1,2,3,4)",
    solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let curr = num, len = 1;
      while (set.has(curr + 1)) { curr++; len++; }
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}`,
    explanation: "Only start counting from sequence beginnings (no num-1 in set). Count consecutive numbers. O(n) average time."
  },
  { id: 46, title: "Group Anagrams", difficulty: "Medium", category: "Hash Map",
    description: "Given an array of strings strs, group the anagrams together.",
    example: "Input: strs = ['eat','tea','tan','ate','nat','bat']\nOutput: [['bat'],['nat','tan'],['ate','eat','tea']]",
    solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}`,
    explanation: "Sort each string to create canonical form (key). Group strings by their sorted key. Anagrams share same sorted key."
  },
  { id: 47, title: "Letter Combinations of Phone Number", difficulty: "Medium", category: "Backtracking",
    description: "Given a string containing digits 2-9, return all possible letter combinations that the number could represent.",
    example: "Input: digits = '23'\nOutput: ['ad','ae','af','bd','be','bf','cd','ce','cf']",
    solution: `function letterCombinations(digits) {
  if (!digits) return [];
  const map = { '2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz' };
  const result = [];
  const backtrack = (idx, current) => {
    if (idx === digits.length) { result.push(current); return; }
    for (const c of map[digits[idx]]) backtrack(idx+1, current+c);
  };
  backtrack(0, '');
  return result;
}`,
    explanation: "Backtracking: for each digit position, try all mapped letters. Build combinations character by character."
  },
  { id: 48, title: "Path Sum III", difficulty: "Medium", category: "Trees",
    description: "Given root of binary tree and targetSum, return the number of paths where the path sums to targetSum. Path doesn't need to start or end at root/leaf.",
    example: "Input: root = [10,5,-3,...], targetSum = 8\nOutput: 3",
    solution: `function pathSum(root, targetSum) {
  const prefixSums = new Map([[0, 1]]);
  let count = 0;
  const dfs = (node, currSum) => {
    if (!node) return;
    currSum += node.val;
    count += (prefixSums.get(currSum - targetSum) || 0);
    prefixSums.set(currSum, (prefixSums.get(currSum) || 0) + 1);
    dfs(node.left, currSum);
    dfs(node.right, currSum);
    prefixSums.set(currSum, prefixSums.get(currSum) - 1);
  };
  dfs(root, 0);
  return count;
}`,
    explanation: "Prefix sum + DFS. At each node, check if (currSum - targetSum) exists in prefix map. Undo prefix sum entry after backtracking."
  },
  { id: 49, title: "Diameter of Binary Tree", difficulty: "Easy", category: "Trees",
    description: "Given the root of a binary tree, return the length of the diameter of the tree (longest path between any two nodes).",
    example: "Input: root = [1,2,3,4,5]\nOutput: 3",
    solution: `function diameterOfBinaryTree(root) {
  let diameter = 0;
  const depth = (node) => {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
  };
  depth(root);
  return diameter;
}`,
    explanation: "At each node, diameter through it = left depth + right depth. Track global max during DFS depth calculation."
  },
  { id: 50, title: "Balanced Binary Tree", difficulty: "Easy", category: "Trees",
    description: "Given a binary tree, determine if it is height-balanced (depth of two subtrees of every node never differs by more than 1).",
    example: "Input: root = [3,9,20,null,null,15,7]\nOutput: true",
    solution: `function isBalanced(root) {
  const height = (node) => {
    if (!node) return 0;
    const left = height(node.left);
    if (left === -1) return -1;
    const right = height(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  };
  return height(root) !== -1;
}`,
    explanation: "Return -1 as sentinel for unbalanced subtrees. Propagate -1 upward to short-circuit. Avoids redundant traversals."
  },
  { id: 51, title: "Kth Smallest in BST", difficulty: "Medium", category: "Trees",
    description: "Given the root of a BST and an integer k, return the kth smallest value among all node values in the tree.",
    example: "Input: root = [3,1,4,null,2], k = 1\nOutput: 1",
    solution: `function kthSmallest(root, k) {
  let count = 0, result = 0;
  const inorder = (node) => {
    if (!node || count >= k) return;
    inorder(node.left);
    if (++count === k) { result = node.val; return; }
    inorder(node.right);
  };
  inorder(root);
  return result;
}`,
    explanation: "Inorder traversal of BST gives sorted order. Count nodes visited; k-th node visited is the answer."
  },
  { id: 52, title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", category: "Trees",
    description: "Given two arrays preorder and inorder traversal of a tree, construct and return the binary tree.",
    example: "Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]",
    solution: `function buildTree(preorder, inorder) {
  if (!preorder.length || !inorder.length) return null;
  const rootVal = preorder[0];
  const mid = inorder.indexOf(rootVal);
  const root = new TreeNode(rootVal);
  root.left = buildTree(preorder.slice(1, mid+1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid+1), inorder.slice(mid+1));
  return root;
}`,
    explanation: "Preorder first element is root. Find root in inorder to split left/right subtrees. Recursively build each subtree."
  },
  { id: 53, title: "Level Order Traversal", difficulty: "Medium", category: "Trees",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (level by level, left to right).",
    example: "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
    solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    explanation: "BFS with queue. At each level, process exactly 'size' nodes (snapshot queue length). Add children for next level."
  },
  { id: 54, title: "Zigzag Level Order", difficulty: "Medium", category: "Trees",
    description: "Given the root of a binary tree, return the zigzag level order traversal (alternating left-to-right and right-to-left by level).",
    example: "Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[20,9],[15,7]]",
    solution: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const size = queue.length, level = new Array(size);
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      const idx = leftToRight ? i : size - 1 - i;
      level[idx] = node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
    leftToRight = !leftToRight;
  }
  return result;
}`,
    explanation: "BFS with direction flag. Use index calculation to fill level array in correct direction. Flip direction each level."
  },
  { id: 55, title: "Maximum Depth of Binary Tree", difficulty: "Easy", category: "Trees",
    description: "Given the root of a binary tree, return its maximum depth.",
    example: "Input: root = [3,9,20,null,null,15,7]\nOutput: 3",
    solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    explanation: "Recursive DFS. Depth of tree = 1 + max depth of left and right subtrees. Base case: null node has depth 0."
  },
  { id: 56, title: "Symmetric Tree", difficulty: "Easy", category: "Trees",
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    example: "Input: root = [1,2,2,3,4,4,3]\nOutput: true",
    solution: `function isSymmetric(root) {
  const isMirror = (l, r) => {
    if (!l && !r) return true;
    if (!l || !r || l.val !== r.val) return false;
    return isMirror(l.left, r.right) && isMirror(l.right, r.left);
  };
  return isMirror(root?.left, root?.right);
}`,
    explanation: "Recursively check if left and right subtrees are mirrors. Left's left mirrors right's right, and left's right mirrors right's left."
  },
  { id: 57, title: "Flatten Binary Tree to Linked List", difficulty: "Medium", category: "Trees",
    description: "Given the root of a binary tree, flatten the tree into a linked list in-place following preorder traversal.",
    example: "Input: root = [1,2,5,3,4,null,6]\nOutput: [1,null,2,null,3,null,4,null,5,null,6]",
    solution: `function flatten(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let rightmost = curr.left;
      while (rightmost.right) rightmost = rightmost.right;
      rightmost.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}`,
    explanation: "Morris-style traversal. For each node with left child, find rightmost node of left subtree, attach current right there, move left to right."
  },
  { id: 58, title: "Count Good Nodes in Binary Tree", difficulty: "Medium", category: "Trees",
    description: "Given binary tree root, return the number of good nodes (path from root to node has no value greater than node's value).",
    example: "Input: root = [3,1,4,3,null,1,5]\nOutput: 4",
    solution: `function goodNodes(root) {
  const dfs = (node, maxSoFar) => {
    if (!node) return 0;
    const isGood = node.val >= maxSoFar ? 1 : 0;
    const newMax = Math.max(maxSoFar, node.val);
    return isGood + dfs(node.left, newMax) + dfs(node.right, newMax);
  };
  return dfs(root, -Infinity);
}`,
    explanation: "DFS tracking maximum value on path from root. Node is good if its value >= max on path. Count all good nodes."
  },
  { id: 59, title: "Surrounded Regions", difficulty: "Medium", category: "Graph",
    description: "Given an m×n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'.",
    example: "Input: [['X','X','X'],['X','O','X'],['X','X','X']]\nOutput: [['X','X','X'],['X','X','X'],['X','X','X']]",
    solution: `function solve(board) {
  const m=board.length, n=board[0].length;
  const dfs = (i,j) => {
    if (i<0||j<0||i>=m||j>=n||board[i][j]!=='O') return;
    board[i][j]='S';
    dfs(i+1,j);dfs(i-1,j);dfs(i,j+1);dfs(i,j-1);
  };
  for (let i=0;i<m;i++) { dfs(i,0); dfs(i,n-1); }
  for (let j=0;j<n;j++) { dfs(0,j); dfs(m-1,j); }
  for (let i=0;i<m;i++) for (let j=0;j<n;j++)
    board[i][j] = board[i][j]==='S' ? 'O' : 'X';
}`,
    explanation: "DFS from border 'O' cells, marking as 'S' (safe). Then flip: 'S'→'O' (kept), everything else →'X' (captured)."
  },
  { id: 60, title: "Clone Graph", difficulty: "Medium", category: "Graph",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    example: "Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: same structure, new nodes",
    solution: `function cloneGraph(node) {
  if (!node) return null;
  const visited = new Map();
  const dfs = (n) => {
    if (visited.has(n)) return visited.get(n);
    const clone = new Node(n.val);
    visited.set(n, clone);
    for (const neighbor of n.neighbors)
      clone.neighbors.push(dfs(neighbor));
    return clone;
  };
  return dfs(node);
}`,
    explanation: "DFS with HashMap to avoid cycles. Create clone node before recursing into neighbors (handles cycles by checking map first)."
  }
];

const AI_ML_CONCEPTS = [
  {
    title: "Linear Regression",
    category: "Supervised Learning",
    description: "A fundamental algorithm that models the relationship between a dependent variable and one or more independent variables by fitting a linear equation.",
    formula: "y = β₀ + β₁x₁ + β₂x₂ + ... + ε",
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
X = np.random.randn(100, 1) * 2
y = 3 * X.squeeze() + 1.5 + np.random.randn(100) * 0.5

# Train model
model = LinearRegression()
model.fit(X, y)

print(f"Coefficient: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print(f"R² Score: {model.score(X, y):.4f}")

# Predictions
X_test = np.linspace(-5, 5, 100).reshape(-1, 1)
y_pred = model.predict(X_test)`,
    keyPoints: ["Assumes linear relationship", "Minimizes Mean Squared Error", "Sensitive to outliers", "No feature scaling needed"]
  },
  {
    title: "Neural Networks",
    category: "Deep Learning",
    description: "Computational models inspired by biological neural networks, consisting of interconnected layers of nodes that learn representations from data.",
    formula: "a = σ(Wx + b)",
    code: `import torch
import torch.nn as nn
import torch.optim as optim

class NeuralNetwork(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, output_size)
        )
    
    def forward(self, x):
        return self.network(x)

# Initialize
model = NeuralNetwork(784, 256, 10)
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

# Training loop
for epoch in range(100):
    optimizer.zero_grad()
    output = model(X_batch)
    loss = criterion(output, y_batch)
    loss.backward()
    optimizer.step()`,
    keyPoints: ["Backpropagation for training", "Activation functions add non-linearity", "Dropout prevents overfitting", "Batch normalization speeds training"]
  },
  {
    title: "Convolutional Neural Networks",
    category: "Deep Learning",
    description: "Specialized neural networks for processing grid-like data (images) using convolutional filters to automatically learn spatial hierarchies of features.",
    formula: "(f * g)(t) = Σ f(τ)g(t-τ)",
    code: `import torch.nn as nn

class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
        )
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((4, 4)),
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)`,
    keyPoints: ["Parameter sharing reduces complexity", "Local receptive fields", "Translation invariant", "Max pooling for downsampling"]
  },
  {
    title: "Transformers & Attention",
    category: "Deep Learning",
    description: "Architecture based on self-attention mechanisms that model relationships between all elements in a sequence simultaneously, revolutionizing NLP and beyond.",
    formula: "Attention(Q,K,V) = softmax(QKᵀ/√dk)V",
    code: `import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_k = d_model // num_heads
        self.num_heads = num_heads
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def scaled_dot_product(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2,-1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn = torch.softmax(scores, dim=-1)
        return torch.matmul(attn, V)
    
    def forward(self, x):
        B, L, _ = x.shape
        Q = self.W_q(x).view(B, L, self.num_heads, self.d_k).transpose(1,2)
        K = self.W_k(x).view(B, L, self.num_heads, self.d_k).transpose(1,2)
        V = self.W_v(x).view(B, L, self.num_heads, self.d_k).transpose(1,2)
        out = self.scaled_dot_product(Q, K, V)
        out = out.transpose(1,2).contiguous().view(B, L, -1)
        return self.W_o(out)`,
    keyPoints: ["Self-attention captures long-range dependencies", "Positional encodings for sequence order", "Parallelizable unlike RNNs", "Foundation of GPT, BERT, ViT"]
  },
  {
    title: "Gradient Descent & Optimizers",
    category: "Optimization",
    description: "Algorithms for minimizing the loss function by iteratively adjusting model parameters in the direction of steepest descent.",
    formula: "θ = θ - α∇J(θ)",
    code: `# Implementing Adam optimizer from scratch
import numpy as np

class Adam:
    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, epsilon=1e-8):
        self.lr = lr
        self.beta1 = beta1
        self.beta2 = beta2
        self.epsilon = epsilon
        self.m = None  # First moment
        self.v = None  # Second moment
        self.t = 0     # Time step
    
    def update(self, params, grads):
        if self.m is None:
            self.m = np.zeros_like(params)
            self.v = np.zeros_like(params)
        
        self.t += 1
        self.m = self.beta1 * self.m + (1 - self.beta1) * grads
        self.v = self.beta2 * self.v + (1 - self.beta2) * grads**2
        
        # Bias correction
        m_hat = self.m / (1 - self.beta1**self.t)
        v_hat = self.v / (1 - self.beta2**self.t)
        
        params -= self.lr * m_hat / (np.sqrt(v_hat) + self.epsilon)
        return params`,
    keyPoints: ["SGD: stochastic gradient descent", "Adam: adaptive learning rates", "Momentum: smooths oscillations", "Learning rate scheduling"]
  },
  {
    title: "Generative Adversarial Networks",
    category: "Generative AI",
    description: "Two neural networks (generator and discriminator) compete in a minimax game to generate realistic synthetic data indistinguishable from real data.",
    formula: "min_G max_D V(D,G) = E[log D(x)] + E[log(1-D(G(z)))]",
    code: `import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, latent_dim=100, img_size=784):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 256),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(256),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.BatchNorm1d(512),
            nn.Linear(512, img_size),
            nn.Tanh()
        )
    def forward(self, z): return self.model(z)

class Discriminator(nn.Module):
    def __init__(self, img_size=784):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(img_size, 512),
            nn.LeakyReLU(0.2),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
    def forward(self, img): return self.model(img)

# Training
G, D = Generator(), Discriminator()
g_opt = torch.optim.Adam(G.parameters(), lr=0.0002)
d_opt = torch.optim.Adam(D.parameters(), lr=0.0002)
criterion = nn.BCELoss()`,
    keyPoints: ["Mode collapse is a key challenge", "Wasserstein GAN improves stability", "StyleGAN for high-quality faces", "Training requires careful balancing"]
  },
  {
    title: "Reinforcement Learning",
    category: "RL",
    description: "Learning through interaction with an environment to maximize cumulative reward using trial and error.",
    formula: "Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]",
    code: `import numpy as np
from collections import deque
import random

class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95    # Discount rate
        self.epsilon = 1.0   # Exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
    
    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))
    
    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)  # Explore
        return np.argmax(self.q_network.predict(state))  # Exploit
    
    def replay(self, batch_size=32):
        minibatch = random.sample(self.memory, batch_size)
        for state, action, reward, next_state, done in minibatch:
            target = reward
            if not done:
                target += self.gamma * np.max(self.q_network.predict(next_state))
            # Update Q-value for taken action
            self.train_step(state, action, target)
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay`,
    keyPoints: ["Exploration vs exploitation tradeoff", "Q-learning estimates action values", "Policy gradient methods optimize directly", "PPO is the industry standard for RL"]
  },
  {
    title: "Natural Language Processing",
    category: "NLP",
    description: "Techniques for processing and understanding human language, from tokenization to large language models.",
    formula: "P(w₁,...,wₙ) = Π P(wᵢ | w₁,...,wᵢ₋₁)",
    code: `from transformers import pipeline, AutoTokenizer, AutoModel
import torch

# Sentiment analysis
classifier = pipeline("sentiment-analysis")
result = classifier("I love deep learning!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# Token embeddings
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')

text = "The quick brown fox"
inputs = tokenizer(text, return_tensors='pt', padding=True)

with torch.no_grad():
    outputs = model(**inputs)

# Get sentence embedding (CLS token)
sentence_embedding = outputs.last_hidden_state[:, 0, :]
print(f"Embedding shape: {sentence_embedding.shape}")  # [1, 768]

# Cosine similarity between sentences
def cosine_sim(a, b):
    return torch.nn.functional.cosine_similarity(a, b)

# Named Entity Recognition
ner = pipeline("ner", grouped_entities=True)
entities = ner("Apple Inc. was founded by Steve Jobs in Cupertino.")`,
    keyPoints: ["Tokenization splits text into tokens", "Word embeddings capture semantics", "Attention handles long contexts", "BERT: bidirectional, GPT: causal"]
  }
];

const QUIZ_QUESTIONS = [
  { id: 1, question: "What is the time complexity of QuickSort in the average case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1, explanation: "QuickSort has O(n log n) average case because each partition step takes O(n) and we recurse on roughly n/2 sized sub-problems, giving log n levels." },
  { id: 2, question: "Which data structure uses LIFO (Last In First Out) principle?", options: ["Queue", "Heap", "Stack", "Linked List"], answer: 2, explanation: "A Stack follows LIFO - the last element pushed is the first to be popped. Think of a stack of plates." },
  { id: 3, question: "What is the space complexity of BFS?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "BFS uses a queue that can hold at most all nodes at the widest level. In the worst case, this is O(n)." },
  { id: 4, question: "Which sorting algorithm is stable AND has O(n log n) guaranteed worst case?", options: ["QuickSort", "HeapSort", "MergeSort", "BubbleSort"], answer: 2, explanation: "MergeSort is stable (preserves relative order of equal elements) and guarantees O(n log n) in all cases." },
  { id: 5, question: "What does the 'P' in Big-O P complexity class stand for?", options: ["Polynomial", "Prime", "Parallel", "Probabilistic"], answer: 0, explanation: "P stands for Polynomial time - problems solvable in polynomial time by a deterministic Turing machine." },
  { id: 6, question: "In a min-heap, the parent node is always:", options: ["Greater than children", "Less than or equal to children", "Equal to children", "The largest element"], answer: 1, explanation: "In a min-heap, every parent node is less than or equal to its children. The root is always the minimum element." },
  { id: 7, question: "What is the output of: console.log(typeof null)?", options: ["null", "undefined", "object", "string"], answer: 2, explanation: "This is a famous JavaScript bug. typeof null returns 'object' due to a historical implementation error in early JavaScript." },
  { id: 8, question: "Which HTTP status code means 'Not Found'?", options: ["200", "301", "404", "500"], answer: 2, explanation: "404 is the HTTP status code for 'Not Found'. It means the requested resource could not be found on the server." },
  { id: 9, question: "What is the output of: [1,2,3].map(x => x * 2)?", options: ["[1,4,9]", "[2,4,6]", "[1,2,3,2]", "undefined"], answer: 1, explanation: "Array.map creates a new array with the results of calling a function on every element. 1×2=2, 2×2=4, 3×2=6." },
  { id: 10, question: "Which Python keyword is used to handle exceptions?", options: ["catch", "except", "handle", "error"], answer: 1, explanation: "Python uses try/except blocks (not try/catch like JavaScript/Java). 'except' catches exceptions." },
  { id: 11, question: "What does SQL stand for?", options: ["Structured Query Language", "Standard Query Language", "System Query Library", "Sequential Queue Logic"], answer: 0, explanation: "SQL stands for Structured Query Language - the standard language for managing relational databases." },
  { id: 12, question: "In binary search, what's the maximum number of comparisons for an array of 1024 elements?", options: ["1024", "512", "10", "32"], answer: 2, explanation: "log₂(1024) = 10. Binary search divides the array in half each step, so at most log₂(n) comparisons are needed." },
  { id: 13, question: "What is the purpose of 'useEffect' in React?", options: ["State management", "Side effects handling", "Component rendering", "Event handling"], answer: 1, explanation: "useEffect handles side effects like data fetching, subscriptions, and DOM manipulation after component renders." },
  { id: 14, question: "What is a closure in JavaScript?", options: ["A way to close browsers", "A function with access to its outer scope variables", "A type of loop", "An error handling mechanism"], answer: 1, explanation: "A closure is a function that retains access to its lexical scope even when executed outside that scope." },
  { id: 15, question: "What is the difference between '==' and '===' in JavaScript?", options: ["No difference", "'===' also checks type", "'==' is faster", "'===' only works for numbers"], answer: 1, explanation: "'==' checks value with type coercion (1 == '1' is true), '===' checks both value AND type (1 === '1' is false)." },
];

const FACTS = [
  { id: 1, category: "CS History", fact: "The first computer bug was an actual bug! In 1947, Grace Hopper's team found a moth stuck in a relay of the Harvard Mark II computer. The term 'debugging' comes from this event.", icon: "🐛" },
  { id: 2, category: "Internet", fact: "The first website ever created is still online! It was created by Tim Berners-Lee at CERN in 1991 and can be found at info.cern.ch", icon: "🌐" },
  { id: 3, category: "Programming", fact: "The most expensive software bug in history cost over $1.2 billion. The Ariane 5 rocket exploded in 1996 due to a 64-bit float to 16-bit integer conversion overflow.", icon: "💸" },
  { id: 4, category: "AI", fact: "GPT-3 was trained on 45TB of text data. Its neural network has 175 billion parameters-roughly 1000x more parameters than neurons in a human brain.", icon: "🤖" },
  { id: 5, category: "Security", fact: "The password '123456' has been exposed in data breaches over 23 million times. 'Password' is the second most common compromised password.", icon: "🔒" },
  { id: 6, category: "Performance", fact: "Google found that a 0.5-second delay in search results caused a 20% drop in traffic. Amazon found each 100ms delay cost them 1% of revenue.", icon: "⚡" },
  { id: 7, category: "Data", fact: "Every day, 2.5 quintillion bytes of data are created. 90% of the world's data has been generated in the last two years.", icon: "📊" },
  { id: 8, category: "Coding", fact: "The average developer writes about 10-12 lines of production-ready code per day when accounting for meetings, debugging, reading code, and planning.", icon: "👨‍💻" },
  { id: 9, category: "Open Source", fact: "Linux powers 96.4% of the world's top 1 million servers, 90% of cloud infrastructure, and all 500 of the world's fastest supercomputers.", icon: "🐧" },
  { id: 10, category: "Math", fact: "The number of possible chess games is estimated to be 10^120 (Shannon Number)-more than the number of atoms in the observable universe (10^80).", icon: "♟️" },
];

const INTERVIEW_QUESTIONS = [
  { 
    category: "System Design", question: "Design a URL shortener like bit.ly", 
    answer: "Key components: 1) API layer (REST endpoints for creating and redirecting short URLs), 2) Database (SQL for user data, NoSQL/Redis for URL mappings), 3) Hash generation (base62 encoding of auto-increment ID or MD5 hash), 4) Cache layer (Redis for hot URLs), 5) Load balancer for scale. Consider: collision handling, custom aliases, analytics, expiration, rate limiting.",
    difficulty: "Medium", tags: ["System Design", "Databases", "Caching"]
  },
  {
    category: "JavaScript", question: "Explain the event loop in JavaScript.",
    answer: "JavaScript is single-threaded. The event loop coordinates: 1) Call Stack (executes synchronous code), 2) Web APIs (async operations like setTimeout, fetch), 3) Callback Queue (completed async callbacks wait here), 4) Microtask Queue (Promises resolve here, higher priority than callback queue). The event loop checks: if call stack is empty → process all microtasks → process one callback → repeat.",
    difficulty: "Medium", tags: ["JavaScript", "Async", "Concurrency"]
  },
  {
    category: "React", question: "What is the difference between useMemo and useCallback?",
    answer: "useMemo memoizes the RESULT of a computation: const value = useMemo(() => expensiveCalc(a, b), [a, b]). useCallback memoizes the FUNCTION ITSELF: const fn = useCallback(() => doSomething(a, b), [a, b]). Use useMemo to avoid expensive recalculations. Use useCallback to prevent unnecessary re-renders when passing callbacks to child components or as dependency in other hooks.",
    difficulty: "Medium", tags: ["React", "Hooks", "Performance"]
  },
  {
    category: "System Design", question: "How would you design a distributed cache?",
    answer: "Key decisions: 1) Caching strategy (write-through, write-back, write-around), 2) Eviction policy (LRU, LFU, FIFO), 3) Distribution (consistent hashing to distribute keys, virtual nodes for load balancing), 4) Replication (master-slave for reliability), 5) Cache coherency (invalidation on update). Redis Cluster uses hash slots (0-16383) and shards them. Handle cache stampede with mutex locks or probabilistic early expiration.",
    difficulty: "Hard", tags: ["System Design", "Caching", "Distributed Systems"]
  },
  {
    category: "Algorithms", question: "How does a HashMap work internally?",
    answer: "A HashMap uses: 1) Array of buckets, 2) Hash function to map key→bucket index, 3) Collision resolution (chaining via linked lists, or open addressing). Java 8+ uses balanced BST (Red-Black Tree) when chain length > 8. Key operations: O(1) average, O(n) worst case. Load factor (default 0.75) triggers resize when 75% full, doubling capacity and rehashing. hashCode() and equals() must be consistent for correct behavior.",
    difficulty: "Medium", tags: ["Data Structures", "Java", "Algorithms"]
  },
  {
    category: "OS", question: "Explain the difference between process and thread.",
    answer: "Process: Independent program instance with its own memory space, heap, code, and data segments. Heavyweight, isolation prevents bugs from spreading. Thread: Lightweight execution unit within a process, shares memory space (heap, code, data). Faster context switching, but shared memory causes concurrency issues needing synchronization. Use processes for isolation (microservices), threads for performance within a service. Python GIL limits true parallelism for CPU-bound threads.",
    difficulty: "Easy", tags: ["OS", "Concurrency", "Systems"]
  },
  {
    category: "Database", question: "What are ACID properties?",
    answer: "Atomicity: Transaction is all-or-nothing (rollback on failure). Consistency: Database remains in valid state before and after transaction. Isolation: Concurrent transactions don't interfere (4 levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable). Durability: Committed transactions survive system failures (WAL - Write-Ahead Logging). Trade-off with performance/availability (CAP theorem: can't have all 3 - Consistency, Availability, Partition tolerance).",
    difficulty: "Medium", tags: ["Database", "SQL", "Transactions"]
  },
  {
    category: "Networking", question: "Explain TCP vs UDP and when to use each.",
    answer: "TCP: Connection-oriented (3-way handshake), reliable (acknowledgments, retransmission), ordered delivery, flow/congestion control. Overhead: ~20 bytes header. Use for: HTTP/HTTPS, email, file transfer, anything requiring reliability. UDP: Connectionless, unreliable, no ordering guarantee. Low latency, ~8 bytes header. Use for: video streaming, gaming, DNS, VoIP, real-time applications where occasional packet loss is acceptable but speed is critical. QUIC (HTTP/3) builds reliability on top of UDP.",
    difficulty: "Easy", tags: ["Networking", "Protocols", "Systems"]
  },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Section = "dashboard" | "dsa" | "code-runner" | "aiml" | "quiz" | "facts" | "interview" | "profile";
type Tab = "problem" | "solution" | "explanation";

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("Coder");
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [selectedDSA, setSelectedDSA] = useState(DSA_PROBLEMS[0]);
  const [dsaTab, setDsaTab] = useState<Tab>("problem");
  const [dsaFilter, setDsaFilter] = useState("All");
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const [code, setCode] = useState(`// Write your JavaScript code here\nfunction solution() {\n  console.log("Hello, CodeNFacts!");\n  return 42;\n}\n\nsolution();`);
  const [codeOutput, setCodeOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [xp, setXp] = useState(1250);
  const [level, setLevel] = useState(8);
  const [selectedAIML, setSelectedAIML] = useState(AI_ML_CONCEPTS[0]);
  const [expandedInterview, setExpandedInterview] = useState<number | null>(null);
  const [particles, setParticles] = useState<{id:number,x:number,y:number,vx:number,vy:number,size:number,opacity:number}[]>([]);
  const [time, setTime] = useState(new Date());
  const [glowEffect, setGlowEffect] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Load user name from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("codenFacts_users");
    if (stored) setUserName(stored);
    
    // Generate particles
    const initParticles = Array.from({length: 50}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(initParticles);

    // Pulse glow
    const glowInterval = setInterval(() => setGlowEffect(g => !g), 3000);
    // Update time
    const timeInterval = setInterval(() => setTime(new Date()), 1000);
    return () => { clearInterval(glowInterval); clearInterval(timeInterval); };
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100,
      })));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setCodeOutput("");
    const logs: string[] = [];
    const fakeConsole = { log: (...args: unknown[]) => logs.push(args.map(a => JSON.stringify(a)).join(" ")) };
    setTimeout(() => {
      try {
        const fn = new Function("console", code);
        fn(fakeConsole);
        setCodeOutput(logs.join("\n") || "✓ Code executed successfully (no output)");
      } catch (e: unknown) {
        const err = e as Error;
        setCodeOutput(`❌ Error: ${err.message}`);
      }
      setIsRunning(false);
    }, 600);
  }, [code]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === QUIZ_QUESTIONS[quizIndex].answer) {
      setQuizScore(s => s + 1);
      setXp(x => x + 50);
    }
    setTimeout(() => {
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        setQuizIndex(i => i + 1);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  const toggleSolved = (id: number) => {
    setSolvedProblems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.add(id); setXp(x => x + 100); }
      return next;
    });
  };

  const categories = ["All", ...Array.from(new Set(DSA_PROBLEMS.map(p => p.category)))];
  const filteredProblems = dsaFilter === "All" ? DSA_PROBLEMS : DSA_PROBLEMS.filter(p => p.category === dsaFilter);
  const difficultyColor = (d: string) => d === "Easy" ? "#00ff88" : d === "Medium" ? "#ffaa00" : "#ff4466";

  const navItems: {id: Section; icon: string; label: string}[] = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "dsa", icon: "◈", label: "DSA" },
    { id: "code-runner", icon: "▶", label: "Code" },
    { id: "aiml", icon: "◉", label: "AI/ML" },
    { id: "quiz", icon: "◆", label: "Quiz" },
    { id: "facts", icon: "★", label: "Facts" },
    { id: "interview", icon: "◇", label: "Interview" },
    { id: "profile", icon: "○", label: "Profile" },
  ];

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      background: "#050510",
      minHeight: "100vh",
      color: "#e0e8ff",
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
    }}>
      {/* Styles scoped to this component */}
      <style>{`
        .cnf-root { all: initial; }
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700;800&family=Orbitron:wght@400;700;900&display=swap');
        
        .cnf-particle { position: absolute; border-radius: 50%; pointer-events: none; }
        
        .cnf-nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 12px 8px; cursor: pointer; border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid transparent; min-width: 60px;
          font-family: 'JetBrains Mono', monospace;
          background: none; color: #7888cc; font-size: 10px;
          position: relative; overflow: hidden;
        }
        .cnf-nav-item::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(100,120,255,0.1), rgba(0,255,200,0.05));
          opacity: 0; transition: opacity 0.3s;
        }
        .cnf-nav-item:hover::before, .cnf-nav-item.active::before { opacity: 1; }
        .cnf-nav-item:hover, .cnf-nav-item.active {
          color: #00ffcc; border-color: rgba(0,255,200,0.3);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,255,200,0.15), 0 0 0 1px rgba(0,255,200,0.1);
        }
        .cnf-nav-item .icon { font-size: 20px; transition: transform 0.3s; }
        .cnf-nav-item:hover .icon, .cnf-nav-item.active .icon { transform: scale(1.2) rotate(10deg); }
        
        .cnf-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(100,120,255,0.05));
          border: 1px solid rgba(100,120,255,0.15);
          border-radius: 16px; padding: 24px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }
        .cnf-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,200,0.5), transparent);
        }
        .cnf-card:hover {
          border-color: rgba(0,255,200,0.25);
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,200,0.1);
        }

        .cnf-stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(100,120,255,0.08));
          border: 1px solid rgba(100,120,255,0.2);
          border-radius: 12px; padding: 20px; text-align: center;
          transition: all 0.3s ease; cursor: default;
          animation: cnf-float 3s ease-in-out infinite;
        }
        .cnf-stat-card:nth-child(2) { animation-delay: 0.5s; }
        .cnf-stat-card:nth-child(3) { animation-delay: 1s; }
        .cnf-stat-card:nth-child(4) { animation-delay: 1.5s; }
        
        @keyframes cnf-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .cnf-btn {
          background: linear-gradient(135deg, #00ffcc, #0088ff);
          color: #050510; border: none; border-radius: 8px;
          padding: 10px 20px; cursor: pointer; font-weight: 700;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative; overflow: hidden; letter-spacing: 1px;
        }
        .cnf-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.4s;
        }
        .cnf-btn:hover::before { left: 100%; }
        .cnf-btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(0,255,200,0.4); }
        .cnf-btn:active { transform: scale(0.97); }
        
        .cnf-btn-ghost {
          background: transparent;
          color: #00ffcc; border: 1px solid rgba(0,255,200,0.3);
          border-radius: 8px; padding: 8px 16px; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          transition: all 0.3s ease;
        }
        .cnf-btn-ghost:hover {
          background: rgba(0,255,200,0.1);
          box-shadow: 0 0 20px rgba(0,255,200,0.2);
        }

        .cnf-code {
          background: rgba(0,0,0,0.5); border: 1px solid rgba(100,120,255,0.2);
          border-radius: 10px; padding: 20px; font-family: 'JetBrains Mono', monospace;
          font-size: 13px; line-height: 1.7; overflow-x: auto; color: #a8d8ff;
          position: relative;
        }
        .cnf-code::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, #00ffcc, #0088ff, #8800ff);
          border-radius: 3px 0 0 3px;
        }

        .cnf-textarea {
          background: rgba(0,0,0,0.6); border: 1px solid rgba(100,120,255,0.3);
          border-radius: 10px; padding: 16px; font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: #a8d8ff; resize: vertical; width: 100%;
          min-height: 320px; line-height: 1.7; outline: none;
          transition: border-color 0.3s; box-sizing: border-box;
        }
        .cnf-textarea:focus { border-color: rgba(0,255,200,0.5); box-shadow: 0 0 20px rgba(0,255,200,0.1); }

        .cnf-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .cnf-progress {
          height: 6px; border-radius: 3px; overflow: hidden;
          background: rgba(255,255,255,0.05);
        }
        .cnf-progress-bar {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #00ffcc, #0088ff);
          transition: width 1s ease;
          position: relative; overflow: hidden;
        }
        .cnf-progress-bar::after {
          content: ''; position: absolute; top: 0; left: -100%; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: cnf-shimmer 2s infinite;
        }
        @keyframes cnf-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .cnf-problem-item {
          padding: 14px 16px; border-radius: 10px; cursor: pointer;
          border: 1px solid rgba(100,120,255,0.1);
          transition: all 0.25s ease; margin-bottom: 6px;
          background: rgba(255,255,255,0.02);
          display: flex; align-items: center; gap: 12px;
        }
        .cnf-problem-item:hover {
          background: rgba(0,255,200,0.05);
          border-color: rgba(0,255,200,0.2);
          transform: translateX(4px);
        }
        .cnf-problem-item.selected {
          background: rgba(0,255,200,0.08);
          border-color: rgba(0,255,200,0.35);
        }

        .cnf-tab {
          padding: 8px 18px; border-radius: 8px; cursor: pointer;
          background: transparent; border: 1px solid rgba(100,120,255,0.15);
          color: #7888cc; font-family: 'JetBrains Mono', monospace;
          font-size: 12px; transition: all 0.25s ease;
        }
        .cnf-tab.active {
          background: rgba(0,255,200,0.15);
          border-color: rgba(0,255,200,0.4);
          color: #00ffcc;
        }
        .cnf-tab:hover { border-color: rgba(0,255,200,0.25); color: #aaddff; }

        .cnf-quiz-option {
          padding: 14px 18px; border-radius: 10px; cursor: pointer;
          border: 1px solid rgba(100,120,255,0.2);
          background: rgba(255,255,255,0.02); transition: all 0.25s ease;
          display: flex; align-items: center; gap: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          margin-bottom: 8px;
        }
        .cnf-quiz-option:hover:not(.disabled) {
          background: rgba(100,120,255,0.08);
          border-color: rgba(100,120,255,0.4);
          transform: translateX(4px);
        }
        .cnf-quiz-option.correct { background: rgba(0,255,136,0.12); border-color: #00ff88; color: #00ff88; }
        .cnf-quiz-option.wrong { background: rgba(255,68,102,0.12); border-color: #ff4466; color: #ff4466; }
        .cnf-quiz-option.disabled { cursor: default; pointer-events: none; }

        .cnf-aiml-card {
          padding: 18px; border-radius: 12px; cursor: pointer;
          border: 1px solid rgba(100,120,255,0.15);
          background: rgba(255,255,255,0.02); transition: all 0.3s ease;
          margin-bottom: 10px;
        }
        .cnf-aiml-card:hover { background: rgba(136,0,255,0.08); border-color: rgba(136,0,255,0.4); }
        .cnf-aiml-card.selected { background: rgba(136,0,255,0.12); border-color: rgba(136,0,255,0.5); }

        .cnf-interview-item {
          border-radius: 12px; overflow: hidden; margin-bottom: 10px;
          border: 1px solid rgba(100,120,255,0.15);
          transition: border-color 0.3s; background: rgba(255,255,255,0.02);
        }
        .cnf-interview-item:hover { border-color: rgba(255,170,0,0.3); }
        .cnf-interview-header {
          padding: 16px 20px; cursor: pointer; display: flex; justify-content: space-between;
          align-items: center; transition: background 0.3s;
        }
        .cnf-interview-header:hover { background: rgba(255,170,0,0.05); }

        .cnf-glow-text {
          background: linear-gradient(135deg, #00ffcc, #0088ff, #8800ff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Orbitron', sans-serif;
        }

        .cnf-pulse {
          animation: cnf-pulse-anim 2s ease-in-out infinite;
        }
        @keyframes cnf-pulse-anim {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .cnf-spin {
          animation: cnf-spin-anim 1.5s linear infinite;
        }
        @keyframes cnf-spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cnf-slideIn {
          animation: cnf-slideIn-anim 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes cnf-slideIn-anim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cnf-fadeIn {
          animation: cnf-fadeIn-anim 0.5s ease;
        }
        @keyframes cnf-fadeIn-anim {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cnf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cnf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cnf-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        
        @media (max-width: 768px) {
          .cnf-grid-2, .cnf-grid-3, .cnf-grid-4 { grid-template-columns: 1fr 1fr; }
          .cnf-sidebar { display: none !important; }
          .cnf-mobile-nav { display: flex !important; }
          .cnf-main-layout { flex-direction: column !important; }
          .cnf-content-area { padding: 16px !important; }
        }
        @media (max-width: 480px) {
          .cnf-grid-2, .cnf-grid-3, .cnf-grid-4 { grid-template-columns: 1fr; }
        }

        .cnf-scrollbar::-webkit-scrollbar { width: 4px; }
        .cnf-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .cnf-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.3); border-radius: 2px; }

        .cnf-mobile-nav {
          display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(5,5,20,0.95); backdrop-filter: blur(20px);
          border-top: 1px solid rgba(100,120,255,0.2);
          padding: 8px 4px; justify-content: space-around; flex-wrap: nowrap;
        }
        .cnf-mobile-nav .cnf-nav-item { min-width: 40px; padding: 6px 4px; font-size: 9px; }
        .cnf-mobile-nav .cnf-nav-item .icon { font-size: 16px; }

        .cnf-rank-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          font-weight: 900; font-size: 14px; color: #000;
          box-shadow: 0 4px 12px rgba(255,215,0,0.4);
        }

        .cnf-hex-avatar {
          clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      {/* Animated background particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="cnf-particle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.id % 3 === 0 ? "#00ffcc" : p.id % 3 === 1 ? "#0088ff" : "#8800ff",
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Background gradient mesh */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(0,136,255,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(136,0,255,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(0,255,200,0.03) 0%, transparent 70%)
        `
      }} />

      {/* Scanning line effect */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.008) 2px, rgba(0,255,200,0.008) 4px)",
        opacity: 0.5,
      }} />

      {/* Main layout container */}
      <div className="cnf-main-layout" style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        
        {/* Sidebar nav - desktop */}
        <aside className="cnf-sidebar" style={{
          width: 90, minWidth: 90, background: "rgba(5,5,20,0.9)",
          backdropFilter: "blur(20px)", borderRight: "1px solid rgba(100,120,255,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "20px 8px", gap: 4, position: "sticky", top: 0, height: "100vh",
          overflowY: "auto",
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "linear-gradient(135deg, #00ffcc, #0088ff, #8800ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, marginBottom: 6, boxShadow: "0 0 20px rgba(0,255,200,0.3)",
            }}>⟨/⟩</div>
            <div style={{ fontSize: 8, color: "#00ffcc", letterSpacing: 2, fontWeight: 700 }}>CNF</div>
          </div>
          
          {navItems.map(item => (
            <button
              key={item.id}
              className={`cnf-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* XP display */}
          <div style={{ marginTop: "auto", textAlign: "center", paddingTop: 16 }}>
            <div style={{ fontSize: 9, color: "#7888cc", marginBottom: 4 }}>LVL {level}</div>
            <div style={{ width: 44, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, #00ffcc, #0088ff)", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 9, color: "#00ffcc", marginTop: 4 }}>{xp} XP</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="cnf-content-area cnf-fadeIn" style={{
          flex: 1, padding: "28px 32px", overflowY: "auto",
          paddingBottom: 80,
        }}>

          {/* ─── DASHBOARD ───────────────────────────────────────────────────── */}
          {activeSection === "dashboard" && (
            <div className="cnf-slideIn">
              {/* Header */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#7888cc", marginBottom: 6, letterSpacing: 2 }}>
                      {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: -1 }}>
                      Welcome back, <span className="cnf-glow-text">{userName}</span> 👋
                    </h1>
                    <div style={{ fontSize: 14, color: "#7888cc", marginTop: 8 }}>
                      Keep up the momentum. Your streak is on fire! 🔥
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#ff8c00" }}>🔥 {dailyStreak}</div>
                      <div style={{ fontSize: 11, color: "#7888cc" }}>Day Streak</div>
                    </div>
                    <div style={{
                      width: 64, height: 64,
                      background: "linear-gradient(135deg, #00ffcc, #0088ff)",
                      borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#050510",
                      boxShadow: "0 0 30px rgba(0,255,200,0.4)",
                    }}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="cnf-grid-4" style={{ marginBottom: 32 }}>
                {[
                  { label: "Problems Solved", value: solvedProblems.size, total: 60, icon: "◈", color: "#00ffcc" },
                  { label: "XP Points", value: xp.toLocaleString(), icon: "★", color: "#ffd700" },
                  { label: "Level", value: `Lv.${level}`, icon: "◆", color: "#8800ff" },
                  { label: "Quiz Score", value: `${quizScore}/${QUIZ_QUESTIONS.length}`, icon: "◉", color: "#ff4466" },
                ].map((s, i) => (
                  <div key={i} className="cnf-stat-card">
                    <div style={{ fontSize: 24, marginBottom: 8, color: s.color }}>{s.icon}</div>
                    <div style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#7888cc", marginTop: 4 }}>{s.label}</div>
                    {s.total && (
                      <div style={{ marginTop: 10 }}>
                        <div className="cnf-progress">
                          <div className="cnf-progress-bar" style={{ width: `${(solvedProblems.size / s.total) * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Feature cards */}
              <div className="cnf-grid-2" style={{ marginBottom: 24 }}>
                {[
                  { title: "DSA Practice", desc: "60 real problems with solutions", icon: "◈", color: "#00ffcc", section: "dsa" as Section, count: "60 Problems" },
                  { title: "Code Runner", desc: "Live JavaScript execution engine", icon: "▶", color: "#0088ff", section: "code-runner" as Section, count: "Multi-lang" },
                  { title: "AI/ML Concepts", desc: "8 concepts with code snippets", icon: "◉", color: "#8800ff", section: "aiml" as Section, count: "8 Topics" },
                  { title: "Daily Quiz", desc: `${QUIZ_QUESTIONS.length} questions to test your knowledge`, icon: "◆", color: "#ff8c00", section: "quiz" as Section, count: "15 Questions" },
                  { title: "Tech Facts", desc: "Mind-blowing CS & tech facts", icon: "★", color: "#ff4466", section: "facts" as Section, count: `${FACTS.length} Facts` },
                  { title: "Interview Prep", desc: "Real interview Q&A with depth", icon: "◇", color: "#ffd700", section: "interview" as Section, count: `${INTERVIEW_QUESTIONS.length} Questions` },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="cnf-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveSection(item.section)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 28, marginBottom: 10, color: item.color }}>{item.icon}</div>
                        <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#e0e8ff" }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: 12, color: "#7888cc", lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                      <span className="cnf-tag" style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44`, flexShrink: 0 }}>{item.count}</span>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, color: item.color, fontSize: 12 }}>
                      <span>Explore →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="cnf-card">
                <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#00ffcc", letterSpacing: 1 }}>▪ RECENT ACTIVITY</h3>
                {[
                  { action: "Solved", item: "Two Sum", xp: "+100 XP", icon: "✓" },
                  { action: "Completed", item: "Daily Quiz", xp: "+50 XP", icon: "◆" },
                  { action: "Studied", item: "Transformer Architecture", xp: "+30 XP", icon: "◉" },
                  { action: "Solved", item: "Binary Search", xp: "+100 XP", icon: "✓" },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(100,120,255,0.08)" : "none",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#00ffcc", flexShrink: 0,
                    }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#e0e8ff" }}>{a.action} <span style={{ color: "#00ffcc" }}>{a.item}</span></div>
                      <div style={{ fontSize: 11, color: "#7888cc" }}>{a.time}</div>
                    </div>
                    <span className="cnf-tag" style={{ background: "rgba(0,255,200,0.1)", color: "#00ffcc", border: "1px solid rgba(0,255,200,0.2)" }}>{a.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── DSA SECTION ─────────────────────────────────────────────────── */}
          {activeSection === "dsa" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">DSA Practice</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>60 problems • solutions • explanations</div>
              </div>

              {/* Progress */}
              <div className="cnf-card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Overall Progress</span>
                  <span style={{ fontSize: 14, color: "#00ffcc", fontWeight: 700 }}>{solvedProblems.size} / 60 Solved</span>
                </div>
                <div className="cnf-progress" style={{ height: 10 }}>
                  <div className="cnf-progress-bar" style={{ width: `${(solvedProblems.size / 60) * 100}%` }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                  {["Easy", "Medium", "Hard"].map(d => {
                    const count = DSA_PROBLEMS.filter(p => p.difficulty === d).length;
                    const solved = DSA_PROBLEMS.filter(p => p.difficulty === d && solvedProblems.has(p.id)).length;
                    return (
                      <span key={d} style={{ fontSize: 12, color: difficultyColor(d) }}>
                        {d}: {solved}/{count}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Category filter */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {categories.slice(0, 12).map(cat => (
                  <button key={cat} className={`cnf-tab ${dsaFilter === cat ? "active" : ""}`} onClick={() => setDsaFilter(cat)}>
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 320px) 1fr", gap: 20 }}>
                {/* Problem list */}
                <div style={{ maxHeight: "70vh", overflowY: "auto" }} className="cnf-scrollbar">
                  {filteredProblems.map(p => (
                    <div
                      key={p.id}
                      className={`cnf-problem-item ${selectedDSA.id === p.id ? "selected" : ""}`}
                      onClick={() => { setSelectedDSA(p); setDsaTab("problem"); }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                        background: solvedProblems.has(p.id) ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${solvedProblems.has(p.id) ? "#00ff88" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                        color: solvedProblems.has(p.id) ? "#00ff88" : "transparent",
                      }}>✓</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.id}. {p.title}
                        </div>
                        <div style={{ fontSize: 10, color: "#7888cc", marginTop: 2 }}>{p.category}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: difficultyColor(p.difficulty), flexShrink: 0 }}>
                        {p.difficulty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Problem detail */}
                <div className="cnf-card" style={{ minHeight: 500 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{selectedDSA.id}. {selectedDSA.title}</h3>
                        <span className="cnf-tag" style={{ background: `${difficultyColor(selectedDSA.difficulty)}22`, color: difficultyColor(selectedDSA.difficulty), border: `1px solid ${difficultyColor(selectedDSA.difficulty)}44` }}>
                          {selectedDSA.difficulty}
                        </span>
                        <span className="cnf-tag" style={{ background: "rgba(100,120,255,0.1)", color: "#8899ff", border: "1px solid rgba(100,120,255,0.3)" }}>
                          {selectedDSA.category}
                        </span>
                      </div>
                    </div>
                    <button
                      className="cnf-btn"
                      style={{ background: solvedProblems.has(selectedDSA.id) ? "linear-gradient(135deg, #00ff88, #00cc66)" : undefined }}
                      onClick={() => toggleSolved(selectedDSA.id)}
                    >
                      {solvedProblems.has(selectedDSA.id) ? "✓ Solved!" : "Mark Solved"}
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {(["problem", "solution", "explanation"] as Tab[]).map(tab => (
                      <button key={tab} className={`cnf-tab ${dsaTab === tab ? "active" : ""}`} onClick={() => setDsaTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {dsaTab === "problem" && (
                    <div>
                      <p style={{ fontSize: 14, lineHeight: 1.8, color: "#b8c8e8", marginBottom: 16 }}>{selectedDSA.description}</p>
                      <div className="cnf-code">
                        <div style={{ fontSize: 11, color: "#7888cc", marginBottom: 8 }}>EXAMPLE</div>
                        {selectedDSA.example}
                      </div>
                    </div>
                  )}
                  {dsaTab === "solution" && (
                    <div className="cnf-code">
                      <div style={{ fontSize: 11, color: "#7888cc", marginBottom: 8 }}>JAVASCRIPT SOLUTION</div>
                      {selectedDSA.solution}
                    </div>
                  )}
                  {dsaTab === "explanation" && (
                    <div>
                      <div className="cnf-code">
                        <div style={{ fontSize: 11, color: "#00ffcc", marginBottom: 8 }}>💡 EXPLANATION</div>
                        {selectedDSA.explanation}
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <button className="cnf-btn" onClick={() => { setCode(selectedDSA.solution); setActiveSection("code-runner"); }}>
                          ▶ Run in Code Runner
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── CODE RUNNER ─────────────────────────────────────────────────── */}
          {activeSection === "code-runner" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">Code Runner</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>Write, run and test JavaScript code live</div>
              </div>

              <div className="cnf-grid-2">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["JS", "Python", "Java"].map(lang => (
                        <span key={lang} className="cnf-tag" style={{ background: lang === "JS" ? "rgba(0,255,200,0.15)" : "rgba(255,255,255,0.05)", color: lang === "JS" ? "#00ffcc" : "#7888cc", border: `1px solid ${lang === "JS" ? "rgba(0,255,200,0.3)" : "transparent"}`, cursor: "pointer" }}>
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="cnf-btn-ghost" onClick={() => { setCode(`// Write your JavaScript code here\nfunction solution() {\n  console.log("Hello, CodeNFacts!");\n  return 42;\n}\n\nsolution();`); setCodeOutput(""); }}>Reset</button>
                      <button className="cnf-btn" onClick={runCode} disabled={isRunning}>
                        {isRunning ? <span className="cnf-spin">◉</span> : "▶ Run"}
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="cnf-textarea"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                <div>
                  <div style={{ marginBottom: 12, fontSize: 13, color: "#7888cc", letterSpacing: 1 }}>▪ OUTPUT</div>
                  <div style={{
                    background: "rgba(0,0,0,0.6)", border: "1px solid rgba(100,120,255,0.2)",
                    borderRadius: 10, padding: 20, minHeight: 340,
                    fontFamily: "JetBrains Mono, monospace", fontSize: 13, lineHeight: 1.7,
                    color: codeOutput.startsWith("❌") ? "#ff4466" : "#00ff88",
                    whiteSpace: "pre-wrap", position: "relative",
                  }}>
                    {isRunning ? (
                      <div style={{ color: "#7888cc" }}>
                        <span className="cnf-pulse">▶ Executing...</span>
                      </div>
                    ) : codeOutput || <span style={{ color: "#7888cc" }}>// Output will appear here</span>}
                  </div>

                  {/* Code snippets */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 13, color: "#7888cc", marginBottom: 10, letterSpacing: 1 }}>▪ QUICK TEMPLATES</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[
                        { label: "Fibonacci", code: `function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a,b] = [b, a+b];\n  return b;\n}\nconsole.log(fib(10));` },
                        { label: "Factorial", code: `const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);\nconsole.log(factorial(10));` },
                        { label: "Prime Check", code: `function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++)\n    if (n % i === 0) return false;\n  return true;\n}\nfor (let i = 2; i <= 20; i++) if(isPrime(i)) console.log(i);` },
                        { label: "Sort Array", code: `const arr = [64,34,25,12,22,11,90];\nconst bubbleSort = a => {\n  const arr = [...a];\n  for(let i=0;i<arr.length;i++)\n    for(let j=0;j<arr.length-i-1;j++)\n      if(arr[j]>arr[j+1])[arr[j],arr[j+1]]=[arr[j+1],arr[j]];\n  return arr;\n};\nconsole.log(JSON.stringify(bubbleSort(arr)));` },
                      ].map(t => (
                        <button key={t.label} className="cnf-btn-ghost" style={{ fontSize: 11 }} onClick={() => setCode(t.code)}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── AI/ML SECTION ───────────────────────────────────────────────── */}
          {activeSection === "aiml" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">AI/ML Concepts</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>8 core topics with Python code snippets</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 280px) 1fr", gap: 20 }}>
                <div>
                  {AI_ML_CONCEPTS.map(concept => (
                    <div
                      key={concept.title}
                      className={`cnf-aiml-card ${selectedAIML.title === concept.title ? "selected" : ""}`}
                      onClick={() => setSelectedAIML(concept)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#e0e8ff" }}>{concept.title}</div>
                        <span className="cnf-tag" style={{ background: "rgba(136,0,255,0.15)", color: "#bb44ff", border: "1px solid rgba(136,0,255,0.3)", fontSize: 10 }}>
                          {concept.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cnf-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>{selectedAIML.title}</h3>
                      <span className="cnf-tag" style={{ background: "rgba(136,0,255,0.15)", color: "#bb44ff", border: "1px solid rgba(136,0,255,0.3)" }}>
                        {selectedAIML.category}
                      </span>
                    </div>
                    <div className="cnf-code" style={{ padding: "8px 14px", borderRadius: 8 }}>
                      <span style={{ color: "#ffd700" }}>Formula: </span>
                      <span style={{ color: "#00ffcc" }}>{selectedAIML.formula}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#b8c8e8", marginBottom: 20 }}>
                    {selectedAIML.description}
                  </p>

                  <div className="cnf-code" style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#7888cc", marginBottom: 8 }}>PYTHON CODE</div>
                    {selectedAIML.code}
                  </div>

                  <div style={{ marginBottom: 8, fontSize: 13, color: "#bb44ff", fontWeight: 600, letterSpacing: 1 }}>▪ KEY POINTS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedAIML.keyPoints.map(pt => (
                      <span key={pt} className="cnf-tag" style={{ background: "rgba(136,0,255,0.1)", color: "#bb44ff", border: "1px solid rgba(136,0,255,0.2)", padding: "6px 14px", fontSize: 12 }}>
                        ▸ {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── QUIZ SECTION ────────────────────────────────────────────────── */}
          {activeSection === "quiz" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">Daily Practice Quiz</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>Test your knowledge • Build your streak</div>
              </div>

              {quizComplete ? (
                <div className="cnf-card" style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>
                    {quizScore >= 12 ? "🏆" : quizScore >= 8 ? "🥇" : quizScore >= 5 ? "🥈" : "🎯"}
                  </div>
                  <h2 className="cnf-glow-text" style={{ fontSize: 32, marginBottom: 8 }}>Quiz Complete!</h2>
                  <div style={{ fontSize: 48, fontWeight: 900, color: "#00ffcc", marginBottom: 16 }}>
                    {quizScore} / {QUIZ_QUESTIONS.length}
                  </div>
                  <div style={{ fontSize: 14, color: "#7888cc", marginBottom: 8 }}>
                    Accuracy: {Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%
                  </div>
                  <div style={{ fontSize: 14, color: "#ffd700", marginBottom: 32 }}>
                    +{quizScore * 50} XP Earned!
                  </div>
                  <button className="cnf-btn" onClick={resetQuiz}>Retry Quiz</button>
                </div>
              ) : (
                <div>
                  {/* Progress */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#7888cc" }}>Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span style={{ fontSize: 14, color: "#ffd700", fontWeight: 700 }}>Score: {quizScore}</span>
                  </div>
                  <div className="cnf-progress" style={{ marginBottom: 24 }}>
                    <div className="cnf-progress-bar" style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                  </div>

                  <div className="cnf-card" style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6, color: "#e0e8ff" }}>
                      {QUIZ_QUESTIONS[quizIndex].question}
                    </div>
                  </div>

                  <div>
                    {QUIZ_QUESTIONS[quizIndex].options.map((option, i) => (
                      <div
                        key={i}
                        className={`cnf-quiz-option ${
                          selectedAnswer !== null
                            ? i === QUIZ_QUESTIONS[quizIndex].answer
                              ? "correct"
                              : i === selectedAnswer
                              ? "wrong"
                              : "disabled"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(i)}
                      >
                        <span style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                        }}>
                          {["A","B","C","D"][i]}
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>

                  {selectedAnswer !== null && (
                    <div className="cnf-card" style={{ marginTop: 16, background: "rgba(0,255,200,0.05)", borderColor: "rgba(0,255,200,0.2)" }}>
                      <div style={{ fontSize: 12, color: "#00ffcc", marginBottom: 6, letterSpacing: 1 }}>💡 EXPLANATION</div>
                      <div style={{ fontSize: 13, color: "#b8c8e8", lineHeight: 1.7 }}>{QUIZ_QUESTIONS[quizIndex].explanation}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── FACTS SECTION ───────────────────────────────────────────────── */}
          {activeSection === "facts" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">Important Facts</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>Mind-blowing facts from the world of tech & CS</div>
              </div>

              <div className="cnf-grid-2">
                {FACTS.map(fact => (
                  <div key={fact.id} className="cnf-card">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ fontSize: 36, flexShrink: 0 }}>{fact.icon}</div>
                      <div>
                        <span className="cnf-tag" style={{
                          background: "rgba(255,68,102,0.1)", color: "#ff4466",
                          border: "1px solid rgba(255,68,102,0.2)", marginBottom: 10, display: "inline-flex",
                        }}>
                          {fact.category}
                        </span>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "#b8c8e8" }}>{fact.fact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Did You Know block */}
              <div className="cnf-card" style={{ marginTop: 16, background: "linear-gradient(135deg, rgba(255,170,0,0.05), rgba(255,68,102,0.05))", borderColor: "rgba(255,170,0,0.2)" }}>
                <h3 style={{ margin: "0 0 16px", color: "#ffaa00" }}>🧠 Extra Knowledge Bytes</h3>
                <div className="cnf-grid-3" style={{ gap: 12 }}>
                  {[
                    { title: "Moore's Law", fact: "Transistor count on microchips doubles approximately every 2 years, predicted by Gordon Moore in 1965." },
                    { title: "Metcalfe's Law", fact: "The value of a network is proportional to the square of the number of connected users." },
                    { title: "Amdahl's Law", fact: "Theoretical speedup by parallel computing is limited by the sequential fraction of the program." },
                    { title: "Conway's Law", fact: "Organizations design systems that mirror their own communication structures." },
                    { title: "Linus's Law", fact: "'Given enough eyeballs, all bugs are shallow.' With more reviewers, bugs are found faster." },
                    { title: "Goodhart's Law", fact: "When a measure becomes a target, it ceases to be a good measure-relevant to metrics in software." },
                  ].map(item => (
                    <div key={item.title} style={{ padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,170,0,0.1)" }}>
                      <div style={{ fontWeight: 700, color: "#ffaa00", marginBottom: 8, fontSize: 14 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "#7888cc", lineHeight: 1.6 }}>{item.fact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── INTERVIEW SECTION ───────────────────────────────────────────── */}
          {activeSection === "interview" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">Interview Questions</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>Interview Q&A with in-depth answers</div>
              </div>

              {/* Category filter */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {Array.from(new Set(INTERVIEW_QUESTIONS.map(q => q.category))).map(cat => (
                  <span key={cat} className="cnf-tag" style={{ background: "rgba(255,215,0,0.1)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.2)", padding: "6px 14px", cursor: "pointer" }}>
                    {cat}
                  </span>
                ))}
              </div>

              {INTERVIEW_QUESTIONS.map((q, i) => (
                <div key={i} className="cnf-interview-item">
                  <div className="cnf-interview-header" onClick={() => setExpandedInterview(expandedInterview === i ? null : i)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                        <span className="cnf-tag" style={{ background: "rgba(255,215,0,0.1)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.2)" }}>
                          {q.category}
                        </span>
                        <span className="cnf-tag" style={{ background: q.difficulty === "Easy" ? "rgba(0,255,136,0.1)" : q.difficulty === "Medium" ? "rgba(255,170,0,0.1)" : "rgba(255,68,102,0.1)", color: difficultyColor(q.difficulty), border: `1px solid ${difficultyColor(q.difficulty)}44` }}>
                          {q.difficulty}
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#e0e8ff" }}>{q.question}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                        {q.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 11, color: "#7888cc", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4 }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ color: "#7888cc", fontSize: 18, marginLeft: 12, transition: "transform 0.3s", transform: expandedInterview === i ? "rotate(180deg)" : "none" }}>
                      ▾
                    </span>
                  </div>
                  {expandedInterview === i && (
                    <div style={{ padding: "0 20px 20px", animation: "cnf-slideIn-anim 0.3s ease" }}>
                      <div className="cnf-code">
                        <div style={{ fontSize: 11, color: "#ffd700", marginBottom: 8 }}>✦ ANSWER</div>
                        <div style={{ color: "#b8c8e8", lineHeight: 1.8, fontSize: 13 }}>{q.answer}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── PROFILE SECTION ─────────────────────────────────────────────── */}
          {activeSection === "profile" && (
            <div className="cnf-slideIn">
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900 }}>
                  <span className="cnf-glow-text">Profile</span>
                </h2>
                <div style={{ fontSize: 13, color: "#7888cc" }}>Your CodeNFacts journey</div>
              </div>

              {/* Profile header */}
              <div className="cnf-card" style={{ marginBottom: 24, background: "linear-gradient(135deg, rgba(0,136,255,0.08), rgba(136,0,255,0.08))" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div className="cnf-hex-avatar" style={{
                      width: 96, height: 96,
                      background: "linear-gradient(135deg, #00ffcc, #0088ff, #8800ff)",
                      fontSize: 40, fontWeight: 900, color: "#050510",
                    }}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{
                      position: "absolute", bottom: -4, right: -4,
                      width: 24, height: 24, borderRadius: "50%",
                      background: "#00ff88", border: "2px solid #050510",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                    }}>✓</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{userName}</div>
                    <div style={{ fontSize: 13, color: "#7888cc", marginBottom: 12 }}>CodeNFacts Premium Member</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <div className="cnf-rank-badge">Lv</div>
                      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#7888cc" }}>Level {level}</span>
                          <span style={{ color: "#00ffcc" }}>{xp} / 2000 XP</span>
                        </div>
                        <div className="cnf-progress" style={{ height: 8 }}>
                          <div className="cnf-progress-bar" style={{ width: `${(xp / 2000) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {[
                      { label: "Streak", value: `🔥 ${dailyStreak}`, color: "#ff8c00" },
                      { label: "Rank", value: "#127", color: "#ffd700" },
                      { label: "Solved", value: `${solvedProblems.size}/60`, color: "#00ffcc" },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#7888cc" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats breakdown */}
              <div className="cnf-grid-2" style={{ marginBottom: 24 }}>
                {/* DSA stats */}
                <div className="cnf-card">
                  <h4 style={{ margin: "0 0 16px", color: "#00ffcc", letterSpacing: 1, fontSize: 14 }}>▪ DSA PROGRESS</h4>
                  {["Easy", "Medium", "Hard"].map(d => {
                    const total = DSA_PROBLEMS.filter(p => p.difficulty === d).length;
                    const solved = DSA_PROBLEMS.filter(p => p.difficulty === d && solvedProblems.has(p.id)).length;
                    const pct = Math.round((solved / total) * 100);
                    return (
                      <div key={d} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                          <span style={{ color: difficultyColor(d), fontWeight: 600 }}>{d}</span>
                          <span style={{ color: "#7888cc" }}>{solved} / {total}</span>
                        </div>
                        <div className="cnf-progress">
                          <div className="cnf-progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${difficultyColor(d)}, ${difficultyColor(d)}88)` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Achievements */}
                <div className="cnf-card">
                  <h4 style={{ margin: "0 0 16px", color: "#ffd700", letterSpacing: 1, fontSize: 14 }}>▪ ACHIEVEMENTS</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { icon: "🔥", label: "7-Day Streak", unlocked: true },
                      { icon: "⚡", label: "Speed Coder", unlocked: true },
                      { icon: "🧠", label: "Quiz Master", unlocked: quizScore >= 10 },
                      { icon: "💎", label: "Hard Solver", unlocked: DSA_PROBLEMS.filter(p => p.difficulty === "Hard" && solvedProblems.has(p.id)).length > 0 },
                      { icon: "🎯", label: "10 Solved", unlocked: solvedProblems.size >= 10 },
                      { icon: "🏆", label: "Level 10", unlocked: level >= 10 },
                    ].map(a => (
                      <div key={a.label} style={{
                        padding: 12, borderRadius: 10, textAlign: "center",
                        background: a.unlocked ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${a.unlocked ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.05)"}`,
                        opacity: a.unlocked ? 1 : 0.4,
                        transition: "all 0.3s",
                      }}>
                        <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
                        <div style={{ fontSize: 10, color: a.unlocked ? "#ffd700" : "#7888cc" }}>{a.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity calendar placeholder */}
              <div className="cnf-card">
                <h4 style={{ margin: "0 0 16px", color: "#8899ff", letterSpacing: 1, fontSize: 14 }}>▪ ACTIVITY HEATMAP with CodeNFacts</h4>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {Array.from({length: 84}, (_, i) => {
                    const intensity = Math.random();
                    const hasActivity = Math.random() > 0.4;
                    return (
                      <div key={i} style={{
                        width: 14, height: 14, borderRadius: 3,
                        background: hasActivity
                          ? `rgba(0,255,200,${0.15 + intensity * 0.85})`
                          : "rgba(255,255,255,0.04)",
                        transition: "transform 0.2s",
                        cursor: "default",
                      }} />
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#7888cc" }}>
                  <span>Less</span>
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                    <div key={o} style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(0,255,200,${o})` }} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="cnf-mobile-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`cnf-nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}