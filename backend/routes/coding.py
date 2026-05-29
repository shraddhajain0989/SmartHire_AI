import sys
import io
import traceback
import tempfile
import subprocess
import json
import os
import shutil
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from bson import ObjectId
from backend.utils.db import db

coding_bp = Blueprint('coding', __name__, url_prefix='/coding')

CODING_QUESTIONS = [
    {
        'id': 'two_sum',
        'title': 'Two Sum',
        'difficulty': 'Easy',
        'description': (
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n"
            "You may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n"
            "**Example 1:**\n"
            "Input: nums = [2, 7, 11, 15], target = 9\n"
            "Output: [0, 1]\n"
            "Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\n"
            "**Example 2:**\n"
            "Input: nums = [3, 2, 4], target = 6\n"
            "Output: [1, 2]"
        ),
        'templates': {
            'python': (
                "def two_sum(nums, target):\n"
                "    # Write your Python code here\n"
                "    pass\n"
            ),
            'javascript': (
                "function twoSum(nums, target) {\n"
                "    // Write your JavaScript code here\n"
                "    \n"
                "}\n"
            ),
            'c': (
                "#include <stdlib.h>\n\n"
                "int* two_sum(int* nums, int numsSize, int target, int* returnSize) {\n"
                "    // Write your C code here\n"
                "    // Return a malloc'ed array of size 2, and set returnSize to 2\n"
                "    *returnSize = 2;\n"
                "    int* result = (int*)malloc(2 * sizeof(int));\n"
                "    return result;\n"
                "}\n"
            ),
            'cpp': (
                "#include <vector>\n"
                "using namespace std;\n\n"
                "vector<int> two_sum(vector<int>& nums, int target) {\n"
                "    // Write your C++ code here\n"
                "    return {};\n"
                "}\n"
            ),
            'java': (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public int[] twoSum(int[] nums, int target) {\n"
                "        // Write your Java code here\n"
                "        return new int[0];\n"
                "    }\n"
                "}\n"
            )
        },
        'function_names': {
            'python': 'two_sum',
            'javascript': 'twoSum',
            'c': 'two_sum',
            'cpp': 'two_sum',
            'java': 'twoSum'
        },
        'test_cases': [
            {'inputs': [[2, 7, 11, 15], 9], 'expected': [0, 1]},
            {'inputs': [[3, 2, 4], 6], 'expected': [1, 2]},
            {'inputs': [[3, 3], 6], 'expected': [0, 1]}
        ],
        'drivers': {
            'c': (
                "#include <stdio.h>\n"
                "#include <stdlib.h>\n"
                "#include <stdbool.h>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    printf(\"===JSON_START===\\n\");\n"
                "    int tc1_nums[] = {{2, 7, 11, 15}};\n"
                "    int tc1_ret = 0;\n"
                "    int* tc1_ans = two_sum(tc1_nums, 4, 9, &tc1_ret);\n"
                "    bool tc1_pass = (tc1_ret == 2 && tc1_ans != NULL && tc1_ans[0] == 0 && tc1_ans[1] == 1);\n"
                "    if (tc1_ans) free(tc1_ans);\n\n"
                "    int tc2_nums[] = {{3, 2, 4}};\n"
                "    int tc2_ret = 0;\n"
                "    int* tc2_ans = two_sum(tc2_nums, 3, 6, &tc2_ret);\n"
                "    bool tc2_pass = (tc2_ret == 2 && tc2_ans != NULL && tc2_ans[0] == 1 && tc2_ans[1] == 2);\n"
                "    if (tc2_ans) free(tc2_ans);\n\n"
                "    int tc3_nums[] = {{3, 3}};\n"
                "    int tc3_ret = 0;\n"
                "    int* tc3_ans = two_sum(tc3_nums, 2, 6, &tc3_ret);\n"
                "    bool tc3_pass = (tc3_ret == 2 && tc3_ans != NULL && tc3_ans[0] == 0 && tc3_ans[1] == 1);\n"
                "    if (tc3_ans) free(tc3_ans);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    printf(\"{{\\\"success\\\":true,\\\"all_passed\\\":%s\", all_passed ? \"true\" : \"false\");\n"
                "    printf(\",\\\"results\\\":[\");\n"
                "    printf(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"[2,7,11,15], 9\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":%s}},\", tc1_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"[3,2,4], 6\\\",\\\"expected\\\":\\\"[1, 2]\\\",\\\"passed\\\":%s}},\", tc2_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"[3,3], 6\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":%s}}\", tc3_pass ? \"true\" : \"false\");\n"
                "    printf(\"]}}\\n===JSON_END===\\n\");\n"
                "    return 0;\n"
                "}}"
            ),
            'cpp': (
                "#include <iostream>\n"
                "#include <vector>\n"
                "#include <string>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    std::cout << \"===JSON_START===\\n\";\n"
                "    std::vector<int> tc1_nums = {{2, 7, 11, 15}};\n"
                "    std::vector<int> tc1_ans = two_sum(tc1_nums, 9);\n"
                "    bool tc1_pass = (tc1_ans.size() == 2 && tc1_ans[0] == 0 && tc1_ans[1] == 1);\n\n"
                "    std::vector<int> tc2_nums = {{3, 2, 4}};\n"
                "    std::vector<int> tc2_ans = two_sum(tc2_nums, 6);\n"
                "    bool tc2_pass = (tc2_ans.size() == 2 && tc2_ans[0] == 1 && tc2_ans[1] == 2);\n\n"
                "    std::vector<int> tc3_nums = {{3, 3}};\n"
                "    std::vector<int> tc3_ans = two_sum(tc3_nums, 6);\n"
                "    bool tc3_pass = (tc3_ans.size() == 2 && tc3_ans[0] == 0 && tc3_ans[1] == 1);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    std::cout << \"{{\\\"success\\\":true,\\\"all_passed\\\": \" << (all_passed ? \"true\" : \"false\");\n"
                "    std::cout << \",\\\"results\\\":[\";\n"
                "    std::cout << \"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"[2,7,11,15], 9\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":\" << (tc1_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"[3,2,4], 6\\\",\\\"expected\\\":\\\"[1, 2]\\\",\\\"passed\\\":\" << (tc2_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"[3,3], 6\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":\" << (tc3_pass ? \"true\" : \"false\") << \"}}\";\n"
                "    std::cout << \"]}}\\n===JSON_END===\\n\";\n"
                "    return 0;\n"
                "}}"
            ),
            'java': (
                "import java.util.*;\n\n"
                "{code}\n\n"
                "public class DriverClass {{\n"
                "    public static void main(String[] args) {{\n"
                "        System.out.println(\"===JSON_START===\");\n"
                "        Solution s = new Solution();\n"
                "        \n"
                "        int[] tc1_nums = new int[]{{2, 7, 11, 15}};\n"
                "        int[] tc1_ans = s.twoSum(tc1_nums, 9);\n"
                "        boolean tc1_pass = (tc1_ans != null && tc1_ans.length == 2 && tc1_ans[0] == 0 && tc1_ans[1] == 1);\n\n"
                "        int[] tc2_nums = new int[]{{3, 2, 4}};\n"
                "        int[] tc2_ans = s.twoSum(tc2_nums, 6);\n"
                "        boolean tc2_pass = (tc2_ans != null && tc2_ans.length == 2 && tc2_ans[0] == 1 && tc2_ans[1] == 2);\n\n"
                "        int[] tc3_nums = new int[]{{3, 3}};\n"
                "        int[] tc3_ans = s.twoSum(tc3_nums, 6);\n"
                "        boolean tc3_pass = (tc3_ans != null && tc3_ans.length == 2 && tc3_ans[0] == 0 && tc3_ans[1] == 1);\n\n"
                "        boolean all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "        System.out.print(\"{{\\\"success\\\":true,\\\"all_passed\\\":\" + (all_passed ? \"true\" : \"false\"));\n"
                "        System.out.print(\",\\\"results\\\":[\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"[2,7,11,15], 9\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":\" + (tc1_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"[3,2,4], 6\\\",\\\"expected\\\":\\\"[1, 2]\\\",\\\"passed\\\":\" + (tc2_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"[3,3], 6\\\",\\\"expected\\\":\\\"[0, 1]\\\",\\\"passed\\\":\" + (tc3_pass ? \"true\" : \"false\") + \"}}\");\n"
                "        System.out.println(\"]}}\");\n"
                "        System.out.println(\"===JSON_END===\");\n"
                "    }}\n"
                "}}"
            )
        }
    },
    {
        'id': 'reverse_string',
        'title': 'Reverse String',
        'difficulty': 'Easy',
        'description': (
            "Write a function that takes a string `s` and returns the reversed string.\n\n"
            "**Example 1:**\n"
            "Input: s = \"hello\"\n"
            "Output: \"olleh\"\n\n"
            "**Example 2:**\n"
            "Input: s = \"SmartHire\"\n"
            "Output: \"eriHtramS\""
        ),
        'templates': {
            'python': (
                "def reverse_string(s):\n"
                "    # Write your Python code here\n"
                "    pass\n"
            ),
            'javascript': (
                "function reverseString(s) {\n"
                "    // Write your JavaScript code here\n"
                "    \n"
                "}\n"
            ),
            'c': (
                "#include <string.h>\n"
                "#include <stdlib.h>\n\n"
                "char* reverse_string(char* s) {\n"
                "    // Write your C code here\n"
                "    // Return a dynamically allocated reversed string\n"
                "    return s;\n"
                "}\n"
            ),
            'cpp': (
                "#include <string>\n"
                "using namespace std;\n\n"
                "string reverse_string(string s) {\n"
                "    // Write your C++ code here\n"
                "    return s;\n"
                "}\n"
            ),
            'java': (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public String reverseString(String s) {\n"
                "        // Write your Java code here\n"
                "        return s;\n"
                "    }\n"
                "}\n"
            )
        },
        'function_names': {
            'python': 'reverse_string',
            'javascript': 'reverseString',
            'c': 'reverse_string',
            'cpp': 'reverse_string',
            'java': 'reverseString'
        },
        'test_cases': [
            {'inputs': ["hello"], 'expected': "olleh"},
            {'inputs': ["SmartHire"], 'expected': "eriHtramS"},
            {'inputs': ["a"], 'expected': "a"}
        ],
        'drivers': {
            'c': (
                "#include <stdio.h>\n"
                "#include <stdlib.h>\n"
                "#include <string.h>\n"
                "#include <stdbool.h>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    printf(\"===JSON_START===\\n\");\n"
                "    char s1[] = \"hello\";\n"
                "    char* r1 = reverse_string(s1);\n"
                "    bool tc1_pass = (r1 != NULL && strcmp(r1, \"olleh\") == 0);\n\n"
                "    char s2[] = \"SmartHire\";\n"
                "    char* r2 = reverse_string(s2);\n"
                "    bool tc2_pass = (r2 != NULL && strcmp(r2, \"eriHtramS\") == 0);\n\n"
                "    char s3[] = \"a\";\n"
                "    char* r3 = reverse_string(s3);\n"
                "    bool tc3_pass = (r3 != NULL && strcmp(r3, \"a\") == 0);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    printf(\"{{\\\"success\\\":true,\\\\\"all_passed\\\":%s\", all_passed ? \"true\" : \"false\");\n"
                "    printf(\",\\\"results\\\":[\");\n"
                "    printf(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"hello\\\",\\\"expected\\\":\\\"olleh\\\",\\\"passed\\\":%s}},\", tc1_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"SmartHire\\\",\\\"expected\\\":\\\"eriHtramS\\\",\\\"passed\\\":%s}},\", tc2_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"a\\\",\\\"expected\\\":\\\"a\\\",\\\"passed\\\":%s}}\", tc3_pass ? \"true\" : \"false\");\n"
                "    printf(\"]}}\\n===JSON_END===\\n\");\n"
                "    return 0;\n"
                "}}"
            ),
            'cpp': (
                "#include <iostream>\n"
                "#include <string>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    std::cout << \"===JSON_START===\\n\";\n"
                "    bool tc1_pass = (reverse_string(\"hello\") == \"olleh\");\n"
                "    bool tc2_pass = (reverse_string(\"SmartHire\") == \"eriHtramS\");\n"
                "    bool tc3_pass = (reverse_string(\"a\") == \"a\");\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    std::cout << \"{{\\\"success\\\":true,\\\"all_passed\\\": \" << (all_passed ? \"true\" : \"false\");\n"
                "    std::cout << \",\\\"results\\\":[\";\n"
                "    std::cout << \"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"hello\\\",\\\"expected\\\":\\\"olleh\\\",\\\"passed\\\":\" << (tc1_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"SmartHire\\\",\\\"expected\\\":\\\"eriHtramS\\\",\\\"passed\\\":\" << (tc2_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"a\\\",\\\"expected\\\":\\\"a\\\",\\\"passed\\\":\" << (tc3_pass ? \"true\" : \"false\") << \"}}\";\n"
                "    std::cout << \"]}}\\n===JSON_END===\\n\";\n"
                "    return 0;\n"
                "}}"
            ),
            'java': (
                "import java.util.*;\n\n"
                "{code}\n\n"
                "public class DriverClass {{\n"
                "    public static void main(String[] args) {{\n"
                "        System.out.println(\"===JSON_START===\");\n"
                "        Solution s = new Solution();\n"
                "        boolean tc1_pass = s.reverseString(\"hello\").equals(\"olleh\");\n"
                "        boolean tc2_pass = s.reverseString(\"SmartHire\").equals(\"eriHtramS\");\n"
                "        boolean tc3_pass = s.reverseString(\"a\").equals(\"a\");\n\n"
                "        boolean all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "        System.out.print(\"{{\\\"success\\\":true,\\\"all_passed\\\":\" + (all_passed ? \"true\" : \"false\"));\n"
                "        System.out.print(\",\\\"results\\\":[\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"hello\\\",\\\"expected\\\":\\\"olleh\\\",\\\"passed\\\":\" + (tc1_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"SmartHire\\\",\\\"expected\\\":\\\"eriHtramS\\\",\\\"passed\\\":\" + (tc2_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"a\\\",\\\"expected\\\":\\\"a\\\",\\\"passed\\\":\" + (tc3_pass ? \"true\" : \"false\") + \"}}\");\n"
                "        System.out.println(\"]}}\");\n"
                "        System.out.println(\"===JSON_END===\");\n"
                "    }}\n"
                "}}"
            )
        }
    },
    {
        'id': 'is_palindrome',
        'title': 'Palindrome Number',
        'difficulty': 'Easy',
        'description': (
            "Given an integer `x`, return `True` if `x` is a palindrome, and `False` otherwise.\n\n"
            "**Example 1:**\n"
            "Input: x = 121\n"
            "Output: True\n\n"
            "**Example 2:**\n"
            "Input: x = -121\n"
            "Output: False\n"
            "Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
        ),
        'templates': {
            'python': (
                "def is_palindrome(x):\n"
                "    # Write your Python code here\n"
                "    pass\n"
            ),
            'javascript': (
                "function isPalindrome(x) {\n"
                "    // Write your JavaScript code here\n"
                "    \n"
                "}\n"
            ),
            'c': (
                "#include <stdbool.h>\n\n"
                "bool is_palindrome(int x) {\n"
                "    // Write your C code here\n"
                "    return false;\n"
                "}\n"
            ),
            'cpp': (
                "using namespace std;\n\n"
                "bool is_palindrome(int x) {\n"
                "    // Write your C++ code here\n"
                "    return false;\n"
                "}\n"
            ),
            'java': (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public boolean isPalindrome(int x) {\n"
                "        // Write your Java code here\n"
                "        return false;\n"
                "    }\n"
                "}\n"
            )
        },
        'function_names': {
            'python': 'is_palindrome',
            'javascript': 'isPalindrome',
            'c': 'is_palindrome',
            'cpp': 'is_palindrome',
            'java': 'isPalindrome'
        },
        'test_cases': [
            {'inputs': [121], 'expected': True},
            {'inputs': [-121], 'expected': False},
            {'inputs': [10], 'expected': False}
        ],
        'drivers': {
            'c': (
                "#include <stdio.h>\n"
                "#include <stdbool.h>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    printf(\"===JSON_START===\\n\");\n"
                "    bool tc1_pass = (is_palindrome(121) == true);\n"
                "    bool tc2_pass = (is_palindrome(-121) == false);\n"
                "    bool tc3_pass = (is_palindrome(10) == false);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    printf(\"{{\\\"success\\\":true,\\\"all_passed\\\":%s\", all_passed ? \"true\" : \"false\");\n"
                "    printf(\",\\\"results\\\":[\");\n"
                "    printf(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"121\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":%s}},\", tc1_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"-121\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":%s}},\", tc2_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"10\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":%s}}\", tc3_pass ? \"true\" : \"false\");\n"
                "    printf(\"]}}\\n===JSON_END===\\n\");\n"
                "    return 0;\n"
                "}}"
            ),
            'cpp': (
                "#include <iostream>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    std::cout << \"===JSON_START===\\n\";\n"
                "    bool tc1_pass = (is_palindrome(121) == true);\n"
                "    bool tc2_pass = (is_palindrome(-121) == false);\n"
                "    bool tc3_pass = (is_palindrome(10) == false);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "    std::cout << \"{{\\\"success\\\":true,\\\"all_passed\\\": \" << (all_passed ? \"true\" : \"false\");\n"
                "    std::cout << \",\\\"results\\\":[\";\n"
                "    std::cout << \"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"121\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" << (tc1_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"-121\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" << (tc2_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"10\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" << (tc3_pass ? \"true\" : \"false\") << \"}}\";\n"
                "    std::cout << \"]}}\\n===JSON_END===\\n\";\n"
                "    return 0;\n"
                "}}"
            ),
            'java': (
                "import java.util.*;\n\n"
                "{code}\n\n"
                "public class DriverClass {{\n"
                "    public static void main(String[] args) {{\n"
                "        System.out.println(\"===JSON_START===\");\n"
                "        Solution s = new Solution();\n"
                "        boolean tc1_pass = s.isPalindrome(121) == true;\n"
                "        boolean tc2_pass = s.isPalindrome(-121) == false;\n"
                "        boolean tc3_pass = s.isPalindrome(10) == false;\n\n"
                "        boolean all_passed = tc1_pass && tc2_pass && tc3_pass;\n"
                "        System.out.print(\"{{\\\"success\\\":true,\\\"all_passed\\\":\" + (all_passed ? \"true\" : \"false\"));\n"
                "        System.out.print(\",\\\"results\\\":[\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"121\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" + (tc1_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"-121\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" + (tc2_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"10\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" + (tc3_pass ? \"true\" : \"false\") + \"}}\");\n"
                "        System.out.println(\"]}}\");\n"
                "        System.out.println(\"===JSON_END===\");\n"
                "    }}\n"
                "}}"
            )
        }
    },
    {
        'id': 'is_valid_parentheses',
        'title': 'Valid Parentheses',
        'difficulty': 'Medium',
        'description': (
            "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\n"
            "An input string is valid if:\n"
            "1. Open brackets must be closed by the same type of brackets.\n"
            "2. Open brackets must be closed in the correct order.\n\n"
            "**Example 1:**\n"
            "Input: s = \"()[]{}\"\n"
            "Output: True\n\n"
            "**Example 2:**\n"
            "Input: s = \"(]\"\n"
            "Output: False"
        ),
        'templates': {
            'python': (
                "def is_valid_parentheses(s):\n"
                "    # Write your Python code here\n"
                "    pass\n"
            ),
            'javascript': (
                "function isValidParentheses(s) {\n"
                "    // Write your JavaScript code here\n"
                "    \n"
                "}\n"
            ),
            'c': (
                "#include <stdbool.h>\n\n"
                "bool is_valid_parentheses(char* s) {\n"
                "    // Write your C code here\n"
                "    return false;\n"
                "}\n"
            ),
            'cpp': (
                "#include <string>\n"
                "using namespace std;\n\n"
                "bool is_valid_parentheses(string s) {\n"
                "    // Write your C++ code here\n"
                "    return false;\n"
                "}\n"
            ),
            'java': (
                "import java.util.*;\n\n"
                "public class Solution {\n"
                "    public boolean isValidParentheses(String s) {\n"
                "        // Write your Java code here\n"
                "        return false;\n"
                "    }\n"
                "}\n"
            )
        },
        'function_names': {
            'python': 'is_valid_parentheses',
            'javascript': 'isValidParentheses',
            'c': 'is_valid_parentheses',
            'cpp': 'is_valid_parentheses',
            'java': 'isValidParentheses'
        },
        'test_cases': [
            {'inputs': ["()[]{}"], 'expected': True},
            {'inputs': ["(]"], 'expected': False},
            {'inputs': ["([)]"], 'expected': False},
            {'inputs': ["{[]}"], 'expected': True}
        ],
        'drivers': {
            'c': (
                "#include <stdio.h>\n"
                "#include <stdbool.h>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    printf(\"===JSON_START===\\n\");\n"
                "    bool tc1_pass = (is_valid_parentheses(\"()[]{{\}}\") == true);\n"
                "    bool tc2_pass = (is_valid_parentheses(\"(]\") == false);\n"
                "    bool tc3_pass = (is_valid_parentheses(\"([)]\") == false);\n"
                "    bool tc4_pass = (is_valid_parentheses(\"{{[]}}\") == true);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass && tc4_pass;\n"
                "    printf(\"{{\\\"success\\\":true,\\\"all_passed\\\":%s\", all_passed ? \"true\" : \"false\");\n"
                "    printf(\",\\\"results\\\":[\");\n"
                "    printf(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"()[]{}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":%s}},\", tc1_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"(]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":%s}},\", tc2_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"([)]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":%s}},\", tc3_pass ? \"true\" : \"false\");\n"
                "    printf(\"{{\\\"test_case\\\":4,\\\"inputs\\\":\\\"{{[]}}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":%s}}\", tc4_pass ? \"true\" : \"false\");\n"
                "    printf(\"]}}\\n===JSON_END===\\n\");\n"
                "    return 0;\n"
                "}}"
            ),
            'cpp': (
                "#include <iostream>\n"
                "#include <string>\n\n"
                "{code}\n\n"
                "int main() {{\n"
                "    std::cout << \"===JSON_START===\\n\";\n"
                "    bool tc1_pass = (is_valid_parentheses(\"()[]{{\}}\") == true);\n"
                "    bool tc2_pass = (is_valid_parentheses(\"(]\") == false);\n"
                "    bool tc3_pass = (is_valid_parentheses(\"([)]\") == false);\n"
                "    bool tc4_pass = (is_valid_parentheses(\"{{[]}}\") == true);\n\n"
                "    bool all_passed = tc1_pass && tc2_pass && tc3_pass && tc4_pass;\n"
                "    std::cout << \"{{\\\"success\\\":true,\\\"all_passed\\\": \" << (all_passed ? \"true\" : \"false\");\n"
                "    std::cout << \",\\\"results\\\":[\";\n"
                "    std::cout << \"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"()[]{}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" << (tc1_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"(]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" << (tc2_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"([)]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" << (tc3_pass ? \"true\" : \"false\") << \"}},\";\n"
                "    std::cout << \"{{\\\"test_case\\\":4,\\\"inputs\\\":\\\"{{[]}}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" << (tc4_pass ? \"true\" : \"false\") << \"}}\";\n"
                "    std::cout << \"]}}\\n===JSON_END===\\n\";\n"
                "    return 0;\n"
                "}}"
            ),
            'java': (
                "import java.util.*;\n\n"
                "{code}\n\n"
                "public class DriverClass {{\n"
                "    public static void main(String[] args) {{\n"
                "        System.out.println(\"===JSON_START===\");\n"
                "        Solution s = new Solution();\n"
                "        boolean tc1_pass = s.isValidParentheses(\"()[]{{}}\") == true;\n"
                "        boolean tc2_pass = s.isValidParentheses(\"(]\") == false;\n"
                "        boolean tc3_pass = s.isValidParentheses(\"([)]\") == false;\n"
                "        boolean tc4_pass = s.isValidParentheses(\"{{[]}}\") == true;\n\n"
                "        boolean all_passed = tc1_pass && tc2_pass && tc3_pass && tc4_pass;\n"
                "        System.out.print(\"{{\\\"success\\\":true,\\\"all_passed\\\":\" + (all_passed ? \"true\" : \"false\"));\n"
                "        System.out.print(\",\\\"results\\\":[\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":1,\\\"inputs\\\":\\\"()[]{}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" + (tc1_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":2,\\\"inputs\\\":\\\"(]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" + (tc2_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":3,\\\"inputs\\\":\\\"([)]\\\",\\\"expected\\\":\\\"False\\\",\\\"passed\\\":\" + (tc3_pass ? \"true\" : \"false\") + \"}},\");\n"
                "        System.out.print(\"{{\\\"test_case\\\":4,\\\"inputs\\\":\\\"{{[]}}\\\",\\\"expected\\\":\\\"True\\\",\\\"passed\\\":\" + (tc4_pass ? \"true\" : \"false\") + \"}}\");\n"
                "        System.out.println(\"]}}\");\n"
                "        System.out.println(\"===JSON_END===\");\n"
                "    }}\n"
                "}}"
            )
        }
    }
]


def run_compiled_c(code: str, q: dict) -> dict:
    driver_template = q.get('drivers', {}).get('c')
    full_code = driver_template.format(code=code)
    
    temp_dir = tempfile.gettempdir()
    fd_src, path_src = tempfile.mkstemp(suffix='.c', dir=temp_dir)
    path_bin = path_src + '_bin'
    try:
        with os.fdopen(fd_src, 'w') as tmp:
            tmp.write(full_code)
            
        compile_proc = subprocess.run(
            ['gcc', '-O2', path_src, '-o', path_bin],
            capture_output=True,
            text=True,
            timeout=5
        )
        if compile_proc.returncode != 0:
            return {
                'success': False,
                'error': f"C Compilation Error:\n{compile_proc.stderr or compile_proc.stdout}",
                'stdout': ""
            }
            
        run_proc = subprocess.run(
            [path_bin],
            capture_output=True,
            text=True,
            timeout=5
        )
        stdout = run_proc.stdout
        stderr = run_proc.stderr
        
        if run_proc.returncode != 0:
            return {
                'success': False,
                'error': f"C Runtime Error (Exit Code {run_proc.returncode}):\n{stderr or stdout}",
                'stdout': stdout
            }
            
        if "===JSON_START===" in stdout:
            parts = stdout.split("===JSON_START===")
            log_output = parts[0]
            json_block = parts[1].split("===JSON_END===")[0].strip()
            res = json.loads(json_block)
            res['stdout'] = log_output
            return res
        else:
            return {
                'success': False,
                'error': f"Failed to parse test execution output:\n{stdout}",
                'stdout': stdout
            }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': "Execution Timeout: Code took longer than 5 seconds to run/compile.",
            'stdout': ""
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Subprocess Error:\n{str(e)}",
            'stdout': ""
        }
    finally:
        try: os.remove(path_src)
        except Exception: pass
        try: os.remove(path_bin)
        except Exception: pass


def run_compiled_cpp(code: str, q: dict) -> dict:
    driver_template = q.get('drivers', {}).get('cpp')
    full_code = driver_template.format(code=code)
    
    temp_dir = tempfile.gettempdir()
    fd_src, path_src = tempfile.mkstemp(suffix='.cpp', dir=temp_dir)
    path_bin = path_src + '_bin'
    try:
        with os.fdopen(fd_src, 'w') as tmp:
            tmp.write(full_code)
            
        compile_proc = subprocess.run(
            ['g++', '-std=c++17', '-O2', path_src, '-o', path_bin],
            capture_output=True,
            text=True,
            timeout=5
        )
        if compile_proc.returncode != 0:
            return {
                'success': False,
                'error': f"C++ Compilation Error:\n{compile_proc.stderr or compile_proc.stdout}",
                'stdout': ""
            }
            
        run_proc = subprocess.run(
            [path_bin],
            capture_output=True,
            text=True,
            timeout=5
        )
        stdout = run_proc.stdout
        stderr = run_proc.stderr
        
        if run_proc.returncode != 0:
            return {
                'success': False,
                'error': f"C++ Runtime Error (Exit Code {run_proc.returncode}):\n{stderr or stdout}",
                'stdout': stdout
            }
            
        if "===JSON_START===" in stdout:
            parts = stdout.split("===JSON_START===")
            log_output = parts[0]
            json_block = parts[1].split("===JSON_END===")[0].strip()
            res = json.loads(json_block)
            res['stdout'] = log_output
            return res
        else:
            return {
                'success': False,
                'error': f"Failed to parse test execution output:\n{stdout}",
                'stdout': stdout
            }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': "Execution Timeout: Code took longer than 5 seconds to run/compile.",
            'stdout': ""
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Subprocess Error:\n{str(e)}",
            'stdout': ""
        }
    finally:
        try: os.remove(path_src)
        except Exception: pass
        try: os.remove(path_bin)
        except Exception: pass


def run_compiled_java(code: str, q: dict) -> dict:
    driver_template = q.get('drivers', {}).get('java')
    full_code = driver_template.format(code=code)
    
    temp_dir = tempfile.mkdtemp()
    path_src = os.path.join(temp_dir, 'DriverClass.java')
    
    try:
        with open(path_src, 'w') as tmp:
            tmp.write(full_code)
            
        compile_proc = subprocess.run(
            ['javac', 'DriverClass.java'],
            cwd=temp_dir,
            capture_output=True,
            text=True,
            timeout=6
        )
        if compile_proc.returncode != 0:
            return {
                'success': False,
                'error': f"Java Compilation Error:\n{compile_proc.stderr or compile_proc.stdout}",
                'stdout': ""
            }
            
        run_proc = subprocess.run(
            ['java', 'DriverClass'],
            cwd=temp_dir,
            capture_output=True,
            text=True,
            timeout=5
        )
        stdout = run_proc.stdout
        stderr = run_proc.stderr
        
        if run_proc.returncode != 0:
            return {
                'success': False,
                'error': f"Java Runtime Error (Exit Code {run_proc.returncode}):\n{stderr or stdout}",
                'stdout': stdout
            }
            
        if "===JSON_START===" in stdout:
            parts = stdout.split("===JSON_START===")
            log_output = parts[0]
            json_block = parts[1].split("===JSON_END===")[0].strip()
            res = json.loads(json_block)
            res['stdout'] = log_output
            return res
        else:
            return {
                'success': False,
                'error': f"Failed to parse test execution output:\n{stdout}",
                'stdout': stdout
            }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': "Execution Timeout: Code took longer than 6 seconds to run/compile.",
            'stdout': ""
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Subprocess Error:\n{str(e)}",
            'stdout': ""
        }
    finally:
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass


def run_javascript(code: str, q: dict) -> dict:
    js_test_cases = []
    for tc in q['test_cases']:
        js_test_cases.append({
            'inputs': tc['inputs'],
            'expected': tc['expected']
        })
        
    js_test_cases_str = json.dumps(js_test_cases)
    func_name = q['function_names'].get('javascript')
    
    driver = f"""
{code}

const testCases = {js_test_cases_str};
const results = [];
let allPassed = true;

function equals(a, b) {{
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== undefined && b.length !== undefined) {{
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {{
            if (!equals(a[i], b[i])) return false;
        }}
        return true;
    }}
    if (typeof a === 'object' && typeof b === 'object') {{
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const k of keysA) {{
            if (!equals(a[k], b[k])) return false;
        }}
        return true;
    }}
    return false;
}}

for (let i = 0; i < testCases.length; i++) {{
    const tc = testCases[i];
    try {{
        const output = {func_name}(...tc.inputs);
        const passed = equals(output, tc.expected);
        if (!passed) allPassed = false;
        results.push({{
            test_case: i + 1,
            inputs: JSON.stringify(tc.inputs),
            expected: JSON.stringify(tc.expected),
            output: JSON.stringify(output),
            passed: passed
        }});
    }} catch (e) {{
        allPassed = false;
        results.push({{
            test_case: i + 1,
            inputs: JSON.stringify(tc.inputs),
            expected: JSON.stringify(tc.expected),
            error: e.stack || e.message,
            passed: false
        }});
    }}
}}

console.log("===JSON_START===");
console.log(JSON.stringify({{
    success: true,
    all_passed: allPassed,
    results: results
}}));
console.log("===JSON_END===");
"""
    temp_dir = tempfile.gettempdir()
    fd, path = tempfile.mkstemp(suffix='.js', dir=temp_dir)
    try:
        with os.fdopen(fd, 'w') as tmp:
            tmp.write(driver)
            
        process = subprocess.run(
            ['node', path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        stdout = process.stdout
        stderr = process.stderr
        
        if process.returncode != 0:
            return {
                'success': False,
                'error': f"Node.js Runtime Error (Exit Code {process.returncode}):\n{stderr or stdout}",
                'stdout': stdout
            }
            
        if "===JSON_START===" in stdout:
            parts = stdout.split("===JSON_START===")
            log_output = parts[0]
            json_block = parts[1].split("===JSON_END===")[0].strip()
            res = json.loads(json_block)
            res['stdout'] = log_output
            return res
        else:
            return {
                'success': False,
                'error': f"Failed to parse test execution output:\n{stdout}",
                'stdout': stdout
            }
            
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': "Execution Timeout: Code took longer than 5 seconds to run.",
            'stdout': ""
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Subprocess Error:\n{str(e)}",
            'stdout': ""
        }
    finally:
        try:
            os.remove(path)
        except Exception:
            pass


def run_python(code: str, q: dict) -> dict:
    stdout_capture = io.StringIO()
    original_stdout = sys.stdout
    sys.stdout = stdout_capture

    try:
        namespace = {}
        exec(code, namespace)

        func_name = q['function_names'].get('python')
        if func_name not in namespace:
            return {
                'success': False,
                'error': f"Function '{func_name}' not defined in the code.",
                'stdout': stdout_capture.getvalue()
            }

        func = namespace[func_name]
        results = []
        all_passed = True

        for idx, tc in enumerate(q['test_cases']):
            inputs = tc['inputs']
            expected = tc['expected']
            try:
                import copy
                inputs_copy = copy.deepcopy(inputs)
                
                output = func(*inputs_copy)
                passed = output == expected
                if not passed:
                    all_passed = False
                results.append({
                    'test_case': idx + 1,
                    'inputs': str(inputs),
                    'expected': str(expected),
                    'output': str(output),
                    'passed': passed
                })
            except Exception as e_run:
                all_passed = False
                results.append({
                    'test_case': idx + 1,
                    'inputs': str(inputs),
                    'expected': str(expected),
                    'error': str(e_run),
                    'passed': False
                })

        return {
            'success': True,
            'all_passed': all_passed,
            'results': results,
            'stdout': stdout_capture.getvalue()
        }

    except Exception as e_compile:
        tb = traceback.format_exc()
        return {
            'success': False,
            'error': f"Syntax/Compilation Error:\n{tb}",
            'stdout': stdout_capture.getvalue()
        }
    finally:
        sys.stdout = original_stdout


@coding_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    
    query = {}
    if category:
        query['category'] = category
    if difficulty:
        query['difficulty'] = difficulty
        
    db_questions = list(db.coding_questions.find(query))
    
    if not db_questions:
        # Fallback to CODING_QUESTIONS list
        db_questions = CODING_QUESTIONS
        if category:
            db_questions = [q for q in db_questions if q.get('category') == category]
        if difficulty:
            db_questions = [q for q in db_questions if q.get('difficulty') == difficulty]
            
    payload = [
        {
            'id': str(q.get('_id', q.get('id'))),
            'question_id': q.get('id'), # internal string ID
            'title': q['title'],
            'difficulty': q['difficulty'],
            'category': q.get('category', 'Algorithms'),
            'description': q['description'],
            'templates': q['templates']
        }
        for q in db_questions
    ]
    return jsonify({'questions': payload})


@coding_bp.route('/random', methods=['GET'])
@jwt_required()
def get_random_question():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    
    query = {}
    if category:
        query['category'] = category
    if difficulty:
        query['difficulty'] = difficulty
        
    db_questions = list(db.coding_questions.find(query))
    if not db_questions:
        db_questions = CODING_QUESTIONS
        if category:
            db_questions = [q for q in db_questions if q.get('category') == category]
        if difficulty:
            db_questions = [q for q in db_questions if q.get('difficulty') == difficulty]
            
    if not db_questions:
        return jsonify({'message': 'No questions found.'}), 404
        
    import random
    q = random.choice(db_questions)
    
    return jsonify({
        'id': str(q.get('_id', q.get('id'))),
        'question_id': q.get('id'),
        'title': q['title'],
        'difficulty': q['difficulty'],
        'category': q.get('category', 'Algorithms'),
        'description': q['description'],
        'templates': q['templates']
    })


@coding_bp.route('/daily', methods=['GET'])
@jwt_required()
def get_daily_question():
    db_questions = list(db.coding_questions.find())
    if not db_questions:
        db_questions = CODING_QUESTIONS
        
    # Use current day of the year to pick a deterministic question
    from datetime import datetime
    day_of_year = datetime.utcnow().timetuple().tm_yday
    idx = day_of_year % len(db_questions)
    q = db_questions[idx]
    
    return jsonify({
        'id': str(q.get('_id', q.get('id'))),
        'question_id': q.get('id'),
        'title': q['title'],
        'difficulty': q['difficulty'],
        'category': q.get('category', 'Algorithms'),
        'description': q['description'],
        'templates': q['templates'],
        'is_daily': True
    })


@coding_bp.route('/ai-generate', methods=['POST'])
@jwt_required()
def ai_generate_question():
    data = request.get_json(force=True)
    category = data.get('category', 'Arrays')
    difficulty = data.get('difficulty', 'Medium')
    
    # Try calling OpenAI API
    from backend.services.ai_service import client as openai_client, OPENAI_API_KEY
    try:
        if not openai_client or not OPENAI_API_KEY or "REPLACE" in OPENAI_API_KEY:
            raise ValueError("No OpenAI credentials found")
            
        prompt = (
            f"You are a coding question creator. Generate a brand new, unique LeetCode-style coding question.\n"
            f"Topic/Category: {category}\n"
            f"Difficulty: {difficulty}\n"
            f"Provide the description in clean Markdown format.\n"
            f"Provide starter code templates for 'python' and 'javascript'.\n"
            f"Provide 2 simple test cases.\n\n"
            f"Output MUST be in strict JSON format matching this schema:\n"
            f"{{\n"
            f"  \"id\": \"unique_snake_case_string\",\n"
            f"  \"title\": \"Question Title\",\n"
            f"  \"difficulty\": \"{difficulty}\",\n"
            f"  \"category\": \"{category}\",\n"
            f"  \"description\": \"Question description in markdown\",\n"
            f"  \"templates\": {{\n"
            f"    \"python\": \"def func_name(args):\\n    pass\",\n"
            f"    \"javascript\": \"function funcName(args) {{\\n}}\"\n"
            f"  }},\n"
            f"  \"function_names\": {{\n"
            f"    \"python\": \"func_name\",\n"
            f"    \"javascript\": \"funcName\"\n"
            f"  }},\n"
            f"  \"test_cases\": [\n"
            f"    {{\"inputs\": [arg1, arg2], \"expected\": output}},\n"
            f"    {{\"inputs\": [arg1, arg2], \"expected\": output}}\n"
            f"  ]\n"
            f"}}\n"
            f"Do not wrap in Markdown blocks other than standard json."
        )
        
        response = openai_client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': 'You are a helpful software engineer. Return only raw JSON.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=800,
            temperature=0.7,
        )
        content = response.choices[0].message.content.strip()
        # strip markdown code blocks if any
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
            
        q_data = json.loads(content)
        
        # Save generated question to DB so it becomes part of the permanent bank
        db.coding_questions.insert_one(q_data)
        
        # Remove Mongo ObjectId before return
        if '_id' in q_data:
            q_data['_id'] = str(q_data['_id'])
            
        return jsonify(q_data)
        
    except Exception as e:
        print(f"[AI Service] OpenAI ai-generate coding question failed: {e}. Falling back to random question from bank.")
        # Fallback to random question matching filters
        query = {'category': category, 'difficulty': difficulty}
        questions = list(db.coding_questions.find(query))
        if not questions:
            questions = list(db.coding_questions.find())
            
        import random
        q = random.choice(questions) if questions else CODING_QUESTIONS[0]
        
        return jsonify({
            'id': str(q.get('_id', q.get('id'))),
            'question_id': q.get('id'),
            'title': q['title'] + " (AI Offline Fallback)",
            'difficulty': q['difficulty'],
            'category': q.get('category', 'Algorithms'),
            'description': q['description'],
            'templates': q['templates'],
            'function_names': q.get('function_names', {}),
            'test_cases': q.get('test_cases', [])
        })


@coding_bp.route('/run', methods=['POST'])
@jwt_required()
def run_code():
    user_id = get_jwt_identity()
    data = request.get_json(force=True)
    question_id = data.get('question_id')
    code = data.get('code')
    language = data.get('language', 'python')

    if not question_id or not code:
        return jsonify({'message': 'Missing question_id or code.'}), 400

    # Search in DB coding_questions
    q = db.coding_questions.find_one({'id': question_id})
    if not q:
        # Fallback to hardcoded list
        q = next((item for item in CODING_QUESTIONS if item['id'] == question_id), None)
        
    if not q:
        # Check if it is a user-created custom question
        # If it is, build a mock question shell to execute
        custom_q = db.custom_questions.find_one({'_id': ObjectId(question_id)}) if len(question_id) == 24 else None
        if custom_q:
            # We construct a mock question structure to let them run code
            q = {
                'id': question_id,
                'title': custom_q['title'],
                'difficulty': custom_q.get('difficulty', 'Medium'),
                'function_names': {'python': 'solution', 'javascript': 'solution'},
                'test_cases': [{'inputs': [], 'expected': None}] # simple mock check
            }
            # Add simple solution runners
            # If language is python, execute it inside custom run namespace
            if language == 'python':
                try:
                    stdout_capture = io.StringIO()
                    original_stdout = sys.stdout
                    sys.stdout = stdout_capture
                    namespace = {}
                    exec(code, namespace)
                    sys.stdout = original_stdout
                    
                    res = {
                        'success': True,
                        'all_passed': True,
                        'results': [{
                            'test_case': 1,
                            'inputs': '[]',
                            'expected': 'None',
                            'output': 'Success',
                            'passed': True
                        }],
                        'stdout': stdout_capture.getvalue()
                    }
                except Exception as ex:
                    sys.stdout = original_stdout
                    res = {
                        'success': False,
                        'error': str(ex),
                        'stdout': stdout_capture.getvalue()
                    }
                # Log custom reattempt in custom question history
                db.custom_questions.update_one(
                    {'_id': ObjectId(question_id)},
                    {
                        '$push': {
                            'attempts': {
                                'code': code,
                                'language': language,
                                'passed': res.get('success', False),
                                'stdout': res.get('stdout', ''),
                                'completed_at': datetime.utcnow().isoformat()
                            }
                        },
                        '$set': {
                            'best_score': 100 if res.get('success', False) else 0
                        }
                    }
                )
                return jsonify(res)
                
            elif language == 'javascript':
                # Javascript custom compiler check
                temp_dir = tempfile.gettempdir()
                fd, path = tempfile.mkstemp(suffix='.js', dir=temp_dir)
                try:
                    with os.fdopen(fd, 'w') as tmp:
                        tmp.write(code + "\nconsole.log('Execution finished successfully');")
                    process = subprocess.run(['node', path], capture_output=True, text=True, timeout=5)
                    stdout = process.stdout
                    stderr = process.stderr
                    
                    if process.returncode != 0:
                        res = {
                            'success': False,
                            'error': stderr or stdout,
                            'stdout': stdout
                        }
                    else:
                        res = {
                            'success': True,
                            'all_passed': True,
                            'results': [{
                                'test_case': 1,
                                'inputs': '[]',
                                'expected': 'None',
                                'output': 'Success',
                                'passed': True
                            }],
                            'stdout': stdout
                        }
                except Exception as ex:
                    res = {
                        'success': False,
                        'error': str(ex),
                        'stdout': ""
                    }
                finally:
                    try:
                        os.remove(path)
                    except:
                        pass
                
                db.custom_questions.update_one(
                    {'_id': ObjectId(question_id)},
                    {
                        '$push': {
                            'attempts': {
                                'code': code,
                                'language': language,
                                'passed': res.get('success', False),
                                'stdout': res.get('stdout', ''),
                                'completed_at': datetime.utcnow().isoformat()
                            }
                        },
                        '$set': {
                            'best_score': 100 if res.get('success', False) else 0
                        }
                    }
                )
                return jsonify(res)

    if not q:
        return jsonify({'message': 'Question not found.'}), 404

    # Execute code depending on chosen language
    if language == 'javascript':
        res = run_javascript(code, q)
    elif language == 'python':
        res = run_python(code, q)
    elif language == 'c':
        res = run_compiled_c(code, q)
    elif language == 'cpp':
        res = run_compiled_cpp(code, q)
    elif language == 'java':
        res = run_compiled_java(code, q)
    else:
        return jsonify({'message': f"Unsupported language '{language}'."}), 400

    # Save coding attempt in MongoDB
    db.coding_attempts.insert_one({
        'user_id': ObjectId(user_id),
        'question_id': question_id,
        'question_title': q['title'],
        'difficulty': q['difficulty'],
        'category': q.get('category', 'Algorithms'),
        'language': language,
        'code': code,
        'passed': res.get('all_passed', False) if res.get('success') else False,
        'created_at': datetime.utcnow().isoformat()
    })

    return jsonify(res)
