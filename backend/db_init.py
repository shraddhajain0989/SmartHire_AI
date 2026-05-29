import sys
import os
from datetime import datetime

# Adjust Python path to include parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.utils.db import db

# Coding Questions Bank
CODING_QUESTIONS = [
    {
        "id": "two_sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "category": "Arrays",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "templates": {
            "python": "def two_sum(nums, target):\n    # Write your Python code here\n    pass\n",
            "javascript": "function twoSum(nums, target) {\n    // Write your JavaScript code here\n    return [];\n}\n"
        },
        "function_names": {"python": "two_sum", "javascript": "twoSum"},
        "test_cases": [
            {"inputs": [[2, 7, 11, 15], 9], "expected": [0, 1]},
            {"inputs": [[3, 2, 4], 6], "expected": [1, 2]},
            {"inputs": [[3, 3], 6], "expected": [0, 1]}
        ]
    },
    {
        "id": "reverse_string",
        "title": "Reverse String",
        "difficulty": "Easy",
        "category": "Strings",
        "description": "Write a function that reverses a string. The input string is given as an array of characters `s`.",
        "templates": {
            "python": "def reverse_string(s):\n    # Write your Python code here\n    return s[::-1]\n",
            "javascript": "function reverseString(s) {\n    // Write your JavaScript code here\n    return s.split('').reverse().join('');\n}\n"
        },
        "function_names": {"python": "reverse_string", "javascript": "reverseString"},
        "test_cases": [
            {"inputs": ["hello"], "expected": "olleh"},
            {"inputs": ["Hannah"], "expected": "hannaH"}
        ]
    },
    {
        "id": "is_palindrome",
        "title": "Valid Palindrome",
        "difficulty": "Easy",
        "category": "Strings",
        "description": "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise. Consider only alphanumeric characters and ignore cases.",
        "templates": {
            "python": "def is_palindrome(s):\n    # Write your Python code here\n    clean = ''.join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]\n",
            "javascript": "function isPalindrome(s) {\n    // Write your JavaScript code here\n    const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\n    return clean === clean.split('').reverse().join('');\n}\n"
        },
        "function_names": {"python": "is_palindrome", "javascript": "isPalindrome"},
        "test_cases": [
            {"inputs": ["A man, a plan, a canal: Panama"], "expected": True},
            {"inputs": ["race a car"], "expected": False}
        ]
    },
    {
        "id": "valid_parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "category": "Stack",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if brackets close in correct order and of the same type.",
        "templates": {
            "python": "def is_valid(s):\n    # Write your Python code here\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n",
            "javascript": "function isValid(s) {\n    // Write your JavaScript code here\n    const stack = [];\n    const mapping = { ')': '(', '}': '{', ']': '[' };\n    for (let char of s) {\n        if (mapping[char]) {\n            const top = stack.pop() || '#';\n            if (mapping[char] !== top) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}\n"
        },
        "function_names": {"python": "is_valid", "javascript": "isValid"},
        "test_cases": [
            {"inputs": ["()"], "expected": True},
            {"inputs": ["()[]{}"], "expected": True},
            {"inputs": ["(]"], "expected": False}
        ]
    },
    {
        "id": "binary_search",
        "title": "Binary Search",
        "difficulty": "Easy",
        "category": "Binary Search",
        "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
        "templates": {
            "python": "def search(nums, target):\n    # Write your Python code here\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: return m\n        elif nums[m] < target: l = m + 1\n        else: r = m - 1\n    return -1\n",
            "javascript": "function search(nums, target) {\n    // Write your JavaScript code here\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        let m = Math.floor((l + r) / 2);\n        if (nums[m] === target) return m;\n        else if (nums[m] < target) l = m + 1;\n        else r = m - 1;\n    }\n    return -1;\n}\n"
        },
        "function_names": {"python": "search", "javascript": "search"},
        "test_cases": [
            {"inputs": [[-1, 0, 3, 5, 9, 12], 9], "expected": 4},
            {"inputs": [[-1, 0, 3, 5, 9, 12], 2], "expected": -1}
        ]
    },
    {
        "id": "max_subarray",
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "category": "Greedy",
        "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        "templates": {
            "python": "def max_sub_array(nums):\n    # Write your Python code here\n    max_so_far = max_ending_here = nums[0]\n    for x in nums[1:]:\n        max_ending_here = max(x, max_ending_here + x)\n        max_so_far = max(max_so_far, max_ending_here)\n    return max_so_far\n",
            "javascript": "function maxSubArray(nums) {\n    // Write your JavaScript code here\n    let maxSoFar = nums[0];\n    let maxEndingHere = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n        maxSoFar = Math.max(maxSoFar, maxEndingHere);\n    }\n    return maxSoFar;\n}\n"
        },
        "function_names": {"python": "max_sub_array", "javascript": "maxSubArray"},
        "test_cases": [
            {"inputs": [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], "expected": 6},
            {"inputs": [[1]], "expected": 1},
            {"inputs": [[5, 4, -1, 7, 8]], "expected": 23}
        ]
    },
    {
        "id": "coin_change",
        "title": "Coin Change",
        "difficulty": "Medium",
        "category": "Dynamic Programming",
        "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
        "templates": {
            "python": "def coin_change(coins, amount):\n    # Write your Python code here\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1\n",
            "javascript": "function coinChange(coins, amount) {\n    // Write your JavaScript code here\n    const dp = Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (let c of coins) {\n            if (a - c >= 0) {\n                dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n            }\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}\n"
        },
        "function_names": {"python": "coin_change", "javascript": "coinChange"},
        "test_cases": [
            {"inputs": [[1, 2, 5], 11], "expected": 3},
            {"inputs": [[2], 3], "expected": -1},
            {"inputs": [[1], 0], "expected": 0}
        ]
    }
]

# MCQ Questions Bank
MCQ_QUESTIONS = [
    # DBMS
    {
        "topic": "DBMS",
        "difficulty": "Easy",
        "question": "Which of the following database models organizes data in a tree-like structure?",
        "options": ["Relational Model", "Hierarchical Model", "Network Model", "Object-Oriented Model"],
        "correctIndex": 1,
        "explanation": "The Hierarchical database model structures data in a parent-child relationship tree, where each child has a single parent."
    },
    {
        "topic": "DBMS",
        "difficulty": "Medium",
        "question": "In database normalization, which form ensures that all non-key attributes are fully functionally dependent on the primary key, removing partial dependencies?",
        "options": ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
        "correctIndex": 1,
        "explanation": "Second Normal Form (2NF) requires that a table is in 1NF and contains no partial dependencies, meaning every non-prime attribute is fully dependent on the primary key."
    },
    # OS
    {
        "topic": "OS",
        "difficulty": "Easy",
        "question": "What is the primary role of virtual memory in an operating system?",
        "options": ["To speed up network data transfer", "To allow executing programs larger than the physical RAM", "To manage hardware CPU cooling", "To store recovery backup data"],
        "correctIndex": 1,
        "explanation": "Virtual memory maps virtual addresses used by program processes to physical addresses in RAM or swap space on disk, permitting the execution of programs that exceed RAM size."
    },
    {
        "topic": "OS",
        "difficulty": "Medium",
        "question": "Which scheduling algorithm can cause starvation where lower priority tasks wait indefinitely?",
        "options": ["Round Robin", "First-Come First-Served", "Priority Scheduling", "Shortest Job First"],
        "correctIndex": 2,
        "explanation": "Priority Scheduling can lead to starvation if a continuous stream of high-priority processes keeps arriving, leaving low-priority processes waiting indefinitely."
    },
    # OOPs
    {
        "topic": "OOPs",
        "difficulty": "Easy",
        "question": "Which OOP concept is defined as 'binding code and the data it manipulates together'?",
        "options": ["Polymorphism", "Abstraction", "Inheritance", "Encapsulation"],
        "correctIndex": 3,
        "explanation": "Encapsulation restricts direct access to some of an object's components and bundles the data methods operating on that data inside one class unit."
    },
    {
        "topic": "OOPs",
        "difficulty": "Medium",
        "question": "What refers to the ability of a function to behave differently depending on the object it is acting upon, typically implemented via method overriding?",
        "options": ["Static Polymorphism", "Dynamic Polymorphism", "Multiple Inheritance", "Interface Aggregation"],
        "correctIndex": 1,
        "explanation": "Dynamic Polymorphism (or runtime polymorphism) resolves methods dynamically during runtime via method overriding in inheritance hierarchies."
    },
    # React
    {
        "topic": "React",
        "difficulty": "Easy",
        "question": "Which React hook is used to perform side effects in functional components?",
        "options": ["useState", "useContext", "useEffect", "useMemo"],
        "correctIndex": 2,
        "explanation": "The useEffect hook allows you to run asynchronous tasks, manual DOM updates, logging, and data fetching in functional components."
    },
    {
        "topic": "React",
        "difficulty": "Medium",
        "question": "What occurs when the state changes in a React context, and how can unnecessary re-renders be avoided?",
        "options": ["Only components calling useContext re-render", "All descendants of the Provider re-render unless memoized or split", "The page triggers a hard reload", "React fiber drops execution priority"],
        "correctIndex": 1,
        "explanation": "By default, any update to Context value forces all consumer components to re-render. Splitting contexts or using React.memo/useMemo can control re-renders."
    },
    # SQL
    {
        "topic": "SQL",
        "difficulty": "Easy",
        "question": "Which SQL command is used to remove all records from a table without logging the individual row deletions?",
        "options": ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
        "correctIndex": 2,
        "explanation": "TRUNCATE TABLE removes all rows from a table quickly by deallocating the pages, and it cannot be easily rolled back in some transactions compared to DELETE."
    },
    # Aptitude
    {
        "topic": "Aptitude",
        "difficulty": "Easy",
        "question": "A train covers a distance of 360 km in 4 hours. What is its speed in meters per second (m/s)?",
        "options": ["20 m/s", "25 m/s", "30 m/s", "35 m/s"],
        "correctIndex": 1,
        "explanation": "Speed = 360 km / 4 hours = 90 km/h. To convert km/h to m/s, multiply by 5/18: 90 * (5/18) = 25 m/s."
    }
]

def seed_db():
    print("Starting database seed...")
    
    # 1. Seed Coding Questions
    existing_coding_ids = db.coding_questions.distinct("id")
    coding_to_insert = [q for q in CODING_QUESTIONS if q["id"] not in existing_coding_ids]
    if coding_to_insert:
        db.coding_questions.insert_many(coding_to_insert)
        print(f"Inserted {len(coding_to_insert)} coding questions.")
    else:
        print("Coding questions are already seeded.")

    # 2. Seed MCQs
    # To prevent duplication, check if questions exist
    existing_questions = db.mcqs.distinct("question")
    mcqs_to_insert = [q for q in MCQ_QUESTIONS if q["question"] not in existing_questions]
    if mcqs_to_insert:
        db.mcqs.insert_many(mcqs_to_insert)
        print(f"Inserted {len(mcqs_to_insert)} MCQ questions.")
    else:
        print("MCQ questions are already seeded.")

    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
