import { Pattern } from './types';

export const PATTERNS_DATA: Pattern[] = [
  {
    index: 0,
    name: 'Two Pointers',
    tag: 'Arrays',
    icon: '⛓',
    description: 'Efficient array/string traversal using two directional indicators',
    questions: [
      { id: 'p0-q0', name: 'Valid Palindrome', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: 'p0-q1', name: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { id: 'p0-q2', name: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
      { id: 'p0-q3', name: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: 'p0-q4', name: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: 'p0-q5', name: 'Sort Colors (75)', difficulty: 'Medium', url: 'https://leetcode.com/problems/sort-colors/' },
      { id: 'p0-q6', name: 'Trapping Rain Water', difficulty: 'Hard', url: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'p0-q7', name: 'Squares of a Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/' },
      { id: 'p0-q8', name: 'Max Consecutive Ones III', difficulty: 'Medium', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
      { id: 'p0-q9', name: 'Boats to Save People', difficulty: 'Medium', url: 'https://leetcode.com/problems/boats-to-save-people/' }
    ]
  },
  {
    index: 1,
    name: 'Sliding Window',
    tag: 'Arrays',
    icon: '📂',
    description: 'Track and compute subsegments of elements in linear arrays',
    questions: [
      { id: 'p1-q0', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: 'p1-q1', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'p1-q2', name: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
      { id: 'p1-q3', name: 'Permutation in String', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutation-in-string/' },
      { id: 'p1-q4', name: 'Minimum Window Substring', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: 'p1-q5', name: 'Sliding Window Maximum', difficulty: 'Hard', url: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: 'p1-q6', name: 'Maximum Average Subarray I', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      { id: 'p1-q7', name: 'Minimum Size Subarray Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
      { id: 'p1-q8', name: 'Fruit Into Baskets', difficulty: 'Medium', url: 'https://leetcode.com/problems/fruit-into-baskets/' },
      { id: 'p1-q9', name: 'Find All Anagrams in a String', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' }
    ]
  },
  {
    index: 2,
    name: 'Binary Search',
    tag: 'Search',
    icon: '🔍',
    description: 'Logarithmic lookup method on sorted search fields',
    questions: [
      { id: 'p2-q0', name: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
      { id: 'p2-q1', name: 'Search a 2D Matrix', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: 'p2-q2', name: 'Koko Eating Bananas', difficulty: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { id: 'p2-q3', name: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: 'p2-q4', name: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-min-in-rotated-sorted-array/' },
      { id: 'p2-q5', name: 'Find Peak Element', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-peak-element/' },
      { id: 'p2-q6', name: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: 'p2-q7', name: 'Search Insert Position', difficulty: 'Easy', url: 'https://leetcode.com/problems/search-insert-position/' },
      { id: 'p2-q8', name: 'First and Last Position of Element', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { id: 'p2-q9', name: 'Peak Index in a Mountain Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/' }
    ]
  },
  {
    index: 3,
    name: 'Fast & Slow Pointers',
    tag: 'LinkedList',
    icon: '⏱',
    description: 'LinkedList navigation and cycle checking with tortoise-hare pointers',
    questions: [
      { id: 'p3-q0', name: 'Linked List Cycle', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: 'p3-q1', name: 'Linked List Cycle II', difficulty: 'Medium', url: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
      { id: 'p3-q2', name: 'Happy Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/happy-number/' },
      { id: 'p3-q3', name: 'Middle of the Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: 'p3-q4', name: 'Palindrome Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/palindrome-linked-list/' },
      { id: 'p3-q5', name: 'Reorder List', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorder-list/' },
      { id: 'p3-q6', name: 'Remove Nth Node From End of List', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: 'p3-q7', name: 'Intersection of Two Linked Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
      { id: 'p3-q8', name: 'Reverse Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: 'p3-q9', name: 'Add Two Numbers', difficulty: 'Medium', url: 'https://leetcode.com/problems/add-two-numbers/' }
    ]
  },
  {
    index: 4,
    name: 'Merge Intervals',
    tag: 'Intervals',
    icon: '📅',
    description: 'Techniques to process overlapping slots and calendar schedules',
    questions: [
      { id: 'p4-q0', name: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/' },
      { id: 'p4-q1', name: 'Insert Interval', difficulty: 'Medium', url: 'https://leetcode.com/problems/insert-interval/' },
      { id: 'p4-q2', name: 'Interval List Intersections', difficulty: 'Medium', url: 'https://leetcode.com/problems/interval-list-intersections/' },
      { id: 'p4-q3', name: 'Non-overlapping Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { id: 'p4-q4', name: 'Meeting Rooms', difficulty: 'Easy', url: 'https://leetcode.com/problems/meeting-rooms/' },
      { id: 'p4-q5', name: 'Meeting Rooms II', difficulty: 'Medium', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { id: 'p4-q6', name: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/' },
      { id: 'p4-q7', name: 'Car Pooling', difficulty: 'Medium', url: 'https://leetcode.com/problems/car-pooling/' },
      { id: 'p4-q8', name: 'Summary Ranges', difficulty: 'Easy', url: 'https://leetcode.com/problems/summary-ranges/' },
      { id: 'p4-q9', name: 'Employee Free Time', difficulty: 'Hard', url: 'https://leetcode.com/problems/employee-free-time/' }
    ]
  },
  {
    index: 5,
    name: 'Cyclic Sort',
    tag: 'Arrays',
    icon: '🧪',
    description: 'In-place element sorting when values range from 1 to N',
    questions: [
      { id: 'p5-q0', name: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
      { id: 'p5-q1', name: 'Find All Numbers Disappeared in an Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/' },
      { id: 'p5-q2', name: 'Find the Duplicate Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
      { id: 'p5-q3', name: 'Find All Duplicates in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/' },
      { id: 'p5-q4', name: 'First Missing Positive', difficulty: 'Hard', url: 'https://leetcode.com/problems/first-missing-positive/' },
      { id: 'p5-q5', name: 'Set Mismatch', difficulty: 'Easy', url: 'https://leetcode.com/problems/set-mismatch/' },
      { id: 'p5-q6', name: 'Kth Missing Positive Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/kth-missing-positive-number/' },
      { id: 'p5-q7', name: 'Couples Holding Hands', difficulty: 'Hard', url: 'https://leetcode.com/problems/couples-holding-hands/' },
      { id: 'p5-q8', name: 'Array Nesting', difficulty: 'Medium', url: 'https://leetcode.com/problems/array-nesting/' },
      { id: 'p5-q9', name: 'Find the First K Missing Positives', difficulty: 'Medium', url: 'https://leetcode.com/problems/first-missing-positive/' }
    ]
  },
  {
    index: 6,
    name: 'Stack & Monotonic',
    tag: 'Stack',
    icon: '🥞',
    description: 'Use stacks to solve nested syntax or solve next-greater lookup',
    questions: [
      { id: 'p6-q0', name: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: 'p6-q1', name: 'Min Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/min-stack/' },
      { id: 'p6-q2', name: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
      { id: 'p6-q3', name: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
      { id: 'p6-q4', name: 'Next Greater Element I', difficulty: 'Easy', url: 'https://leetcode.com/problems/next-greater-element-i/' },
      { id: 'p6-q5', name: 'Online Stock Span', difficulty: 'Medium', url: 'https://leetcode.com/problems/online-stock-span/' },
      { id: 'p6-q6', name: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: 'p6-q7', name: 'Simplify Path', difficulty: 'Medium', url: 'https://leetcode.com/problems/simplify-path/' },
      { id: 'p6-q8', name: 'Basic Calculator', difficulty: 'Hard', url: 'https://leetcode.com/problems/basic-calculator/' },
      { id: 'p6-q9', name: 'Remove K Digits', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-k-digits/' }
    ]
  },
  {
    index: 7,
    name: 'BFS / Trees',
    tag: 'Trees',
    icon: '🌳',
    description: 'Level-by-level traversal using queues for tree and graph depth',
    questions: [
      { id: 'p7-q0', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: 'p7-q1', name: 'Binary Tree level Order Traversal II', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal-ii/' },
      { id: 'p7-q2', name: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
      { id: 'p7-q3', name: 'Average of Levels in Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/average-of-levels-in-binary-tree/' },
      { id: 'p7-q4', name: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium', url: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' },
      { id: 'p7-q5', name: 'Binary Tree Right Side View', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
      { id: 'p7-q6', name: 'Minimum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/' },
      { id: 'p7-q7', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: 'p7-q8', name: 'Same Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/same-tree/' },
      { id: 'p7-q9', name: 'Symmetric Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/symmetric-tree/' }
    ]
  },
  {
    index: 8,
    name: 'DFS / Backtracking',
    tag: 'Recursion',
    icon: '🔁',
    description: 'Recursive exploring and pruning options in states grids',
    questions: [
      { id: 'p8-q0', name: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/' },
      { id: 'p8-q1', name: 'Permutations', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations/' },
      { id: 'p8-q2', name: 'Combination Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum/' },
      { id: 'p8-q3', name: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/' },
      { id: 'p8-q4', name: 'N-Queens', difficulty: 'Hard', url: 'https://leetcode.com/problems/n-queens/' },
      { id: 'p8-q5', name: 'Path Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/path-sum/' },
      { id: 'p8-q6', name: 'Path Sum II', difficulty: 'Medium', url: 'https://leetcode.com/problems/path-sum-ii/' },
      { id: 'p8-q7', name: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: 'p8-q8', name: 'Generate Parentheses', difficulty: 'Medium', url: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: 'p8-q9', name: 'Sudoku Solver', difficulty: 'Hard', url: 'https://leetcode.com/problems/sudoku-solver/' }
    ]
  },
  {
    index: 9,
    name: 'Heap / Top-K',
    tag: 'Heap',
    icon: '⛰',
    description: 'Using priority queues to extract max/min values quickly',
    questions: [
      { id: 'p9-q0', name: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
      { id: 'p9-q1', name: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
      { id: 'p9-q2', name: 'Find K Closest Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-k-closest-elements/' },
      { id: 'p9-q3', name: 'K Closest Points to Origin', difficulty: 'Medium', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
      { id: 'p9-q4', name: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: 'p9-q5', name: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
      { id: 'p9-q6', name: 'Task Scheduler', difficulty: 'Medium', url: 'https://leetcode.com/problems/task-scheduler/' },
      { id: 'p9-q7', name: 'Sort Characters By Frequency', difficulty: 'Medium', url: 'https://leetcode.com/problems/sort-characters-by-frequency/' },
      { id: 'p9-q8', name: 'Last Stone Weight', difficulty: 'Easy', url: 'https://leetcode.com/problems/last-stone-weight/' },
      { id: 'p9-q9', name: 'Reorganize String', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorganize-string/' }
    ]
  },
  {
    index: 10,
    name: 'Dynamic Programming',
    tag: 'DP',
    icon: '💎',
    description: 'Sub-problem caching to optimize recursive calculations',
    questions: [
      { id: 'p10-q0', name: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: 'p10-q1', name: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
      { id: 'p10-q2', name: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { id: 'p10-q3', name: 'Partition Equal Subset Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
      { id: 'p10-q4', name: 'Edit Distance', difficulty: 'Hard', url: 'https://leetcode.com/problems/edit-distance/' },
      { id: 'p10-q5', name: 'House Robber', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber/' },
      { id: 'p10-q6', name: 'Word Break', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-break/' },
      { id: 'p10-q7', name: 'Unique Paths', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths/' },
      { id: 'p10-q8', name: 'Longest Common Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
      { id: 'p10-q9', name: 'House Robber II', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber-ii/' }
    ]
  },
  {
    index: 11,
    name: 'Graphs / BFS-DFS',
    tag: 'Graphs',
    icon: '🕸',
    description: 'Nodes relationship mapping and traversal over network matrices',
    questions: [
      { id: 'p11-q0', name: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'p11-q1', name: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
      { id: 'p11-q2', name: 'Course Schedule', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'p11-q3', name: 'Rotting Oranges', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotting-oranges/' },
      { id: 'p11-q4', name: 'Word Ladder', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' },
      { id: 'p11-q5', name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
      { id: 'p11-q6', name: 'Graph Valid Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/graph-valid-tree/' },
      { id: 'p11-q7', name: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/' },
      { id: 'p11-q8', name: 'Flood Fill', difficulty: 'Easy', url: 'https://leetcode.com/problems/flood-fill/' },
      { id: 'p11-q9', name: 'Keys and Rooms', difficulty: 'Easy', url: 'https://leetcode.com/problems/keys-and-rooms/' }
    ]
  },
  {
    index: 12,
    name: 'Trie',
    tag: 'Trie',
    icon: '⚡',
    description: 'Character prefix trees for ultra-fast word lookups',
    questions: [
      { id: 'p12-q0', name: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
      { id: 'p12-q1', name: 'Design Add and Search Words Data Structure', difficulty: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
      { id: 'p12-q2', name: 'Word Search II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/' },
      { id: 'p12-q3', name: 'Replace Words', difficulty: 'Medium', url: 'https://leetcode.com/problems/replace-words/' },
      { id: 'p12-q4', name: 'Longest Word in Dictionary', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-word-in-dictionary/' },
      { id: 'p12-q5', name: 'Search Suggestions System', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-suggestions-system/' },
      { id: 'p12-q6', name: 'Extra Characters in a String', difficulty: 'Medium', url: 'https://leetcode.com/problems/extra-characters-in-a-string/' },
      { id: 'p12-q7', name: 'Map Sum Pairs', difficulty: 'Medium', url: 'https://leetcode.com/problems/map-sum-pairs/' },
      { id: 'p12-q8', name: 'Shortest Unique Prefix', difficulty: 'Hard', url: 'https://leetcode.com/problems/short-encoding-of-words/' },
      { id: 'p12-q9', name: 'Prefixes Divisible By 5', difficulty: 'Easy', url: 'https://leetcode.com/problems/prefixes-divisible-by-5/' }
    ]
  },
  {
    index: 13,
    name: 'Greedy',
    tag: 'Greedy',
    icon: '🍕',
    description: 'Local optimization algorithms for interval schedules or storage weights',
    questions: [
      { id: 'p13-q0', name: 'Jump Game', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game/' },
      { id: 'p13-q1', name: 'Gas Station', difficulty: 'Medium', url: 'https://leetcode.com/problems/gas-station/' },
      { id: 'p13-q2', name: 'Partition Labels', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-labels/' },
      { id: 'p13-q3', name: 'Assign Cookies', difficulty: 'Easy', url: 'https://leetcode.com/problems/assign-cookies/' },
      { id: 'p13-q4', name: 'Jump Game II', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game-ii/' },
      { id: 'p13-q5', name: 'Hand of Straights', difficulty: 'Medium', url: 'https://leetcode.com/problems/hand-of-straights/' },
      { id: 'p13-q6', name: 'Avoid Flood in The City', difficulty: 'Medium', url: 'https://leetcode.com/problems/avoid-flood-in-the-city/' },
      { id: 'p13-q7', name: 'Candy', difficulty: 'Hard', url: 'https://leetcode.com/problems/candy/' },
      { id: 'p13-q8', name: 'Maximum Matching of Players With Trainers', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-matching-of-players-with-trainers/' },
      { id: 'p13-q9', name: 'Minimum Number of Taps to Open to Water a Garden', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/' }
    ]
  },
  {
    index: 14,
    name: 'Bit Manipulation',
    tag: 'Bits',
    icon: '🔮',
    description: 'Binary operations for fast, hardware-native logic math',
    questions: [
      { id: 'p14-q0', name: 'Number of 1 Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/number-of-1-bits/' },
      { id: 'p14-q1', name: 'Counting Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/counting-bits/' },
      { id: 'p14-q2', name: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/' },
      { id: 'p14-q3', name: 'Reverse Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-bits/' },
      { id: 'p14-q4', name: 'Sum of Two Integers', difficulty: 'Medium', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
      { id: 'p14-q5', name: 'Bitwise AND of Numbers Range', difficulty: 'Medium', url: 'https://leetcode.com/problems/bitwise-and-of-numbers-range/' },
      { id: 'p14-q6', name: 'UTF-8 Validation', difficulty: 'Medium', url: 'https://leetcode.com/problems/utf-8-validation/' },
      { id: 'p14-q7', name: 'Power of Two', difficulty: 'Easy', url: 'https://leetcode.com/problems/power-of-two/' },
      { id: 'p14-q8', name: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
      { id: 'p14-q9', name: 'Single Number III', difficulty: 'Medium', url: 'https://leetcode.com/problems/single-number-iii/' }
    ]
  }
];
