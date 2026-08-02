"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Search,
  BookOpen,
  Layers,
  Terminal,
  Code2,
  Copy,
  Check,
} from "lucide-react";

/* ============================================================================
   CodeNFacts — C Language Page
   Route: /category/c
   ----------------------------------------------------------------------------
   HOW TO ADD A NEW TOPIC
   Push a new object into `C_TOPICS` below following the existing shape.

   HOW TO ADD A NEW EXAMPLE TO AN EXISTING TOPIC
   Find the topic and push a new object into its `examples` array.
   ============================================================================ */

interface CExample {
  id: string;
  title: string;
  explanation: string;
  code: string;
  output: string;
}

interface CTopic {
  slug: string;
  title: string;
  tagline: string;
  concept: string;
  cheatsheet: string[];
  examples: CExample[];
}

const C_TOPICS: CTopic[] = [
  {
    slug: "basics",
    title: "Introduction & Structure",
    tagline: "How a C program is put together",
    concept:
      "C is a compiled, procedural, statically-typed language created by Dennis Ritchie in 1972 at Bell Labs. Every C program starts execution from the main() function, regardless of how many other functions exist. A program is compiled in stages: the preprocessor expands #include and #define directives first, then the compiler translates the resulting code to assembly, the assembler turns that into machine code (object files), and finally the linker combines object files and libraries into a single executable. Because C has no built-in memory safety, garbage collector, or bounds checking, the programmer is directly responsible for memory layout — this is exactly what makes C fast and close to the hardware, and also why understanding pointers and memory is non-negotiable for writing correct C.",
    cheatsheet: [
      "Every program needs exactly one main() function — the entry point.",
      "#include <stdio.h> pulls in standard I/O functions like printf/scanf via the preprocessor.",
      "Statements end with a semicolon ; — forgetting it is the #1 beginner compile error.",
      "Compilation pipeline: preprocessing -> compiling -> assembling -> linking -> executable.",
      "Compile with gcc: gcc program.c -o program, then run with ./program.",
      "return 0; at the end of main() signals successful execution to the OS.",
      "Comments: // for single-line, /* ... */ for multi-line.",
    ],
    examples: [
      {
        id: "hello-world",
        title: "Hello, World!",
        explanation:
          "The smallest complete C program. #include <stdio.h> brings in printf's declaration. main() is where execution begins, and it returns an int (0 conventionally means 'success') back to the operating system.",
        code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        output: "Hello, World!",
      },
      {
        id: "compile-anatomy",
        title: "Reading and Printing Multiple Values",
        explanation:
          "scanf reads formatted input from the user into variables — note the & before age, which passes the variable's ADDRESS so scanf can write into it directly (this is your first real encounter with pointers, even before formally learning them).",
        code: `#include <stdio.h>

int main() {
    char name[50];
    int age;

    printf("Enter your name: ");
    scanf("%s", name);          // no & needed, array name decays to address

    printf("Enter your age: ");
    scanf("%d", &age);          // & needed for non-array variables

    printf("Hello %s, you are %d years old.\\n", name, age);
    return 0;
}`,
        output: "Enter your name: Prakash\nEnter your age: 20\nHello Prakash, you are 20 years old.",
      },
    ],
  },
  {
    slug: "data-types",
    title: "Data Types & Variables",
    tagline: "How C represents and stores values",
    concept:
      "C is statically typed: every variable must have a declared type before use, and that type determines how many bytes it occupies and how those bytes are interpreted. The basic types are int (whole numbers), float and double (decimals, double has roughly twice the precision of float), char (a single byte, typically holding an ASCII character), and the boolean-ish _Bool from C99 onward (commonly via stdbool.h). Type sizes are platform-dependent (use sizeof() to check, never assume), but a common 64-bit baseline is: char = 1 byte, int = 4 bytes, float = 4 bytes, double = 8 bytes. Type qualifiers (signed/unsigned, short/long) further adjust the range a type can represent — for instance unsigned int can't hold negatives but doubles its positive range compared to a signed int of the same size.",
    cheatsheet: [
      "sizeof(type) tells you the exact byte size on your platform — never hardcode assumed sizes.",
      "int: whole numbers. float: ~6-7 decimal digits precision. double: ~15-16 digits precision.",
      "char holds a single byte, often used for ASCII characters (e.g. 'A' is really the integer 65).",
      "unsigned types can't represent negative numbers but double the positive range vs signed of the same size.",
      "Use const to declare a variable that cannot be reassigned after initialization.",
      "Implicit type conversion (int + float -> float) happens automatically; explicit casting: (int)3.9 -> 3.",
      "Format specifiers must match the type: %d int, %f float/double, %c char, %s string, %ld long, %u unsigned.",
    ],
    examples: [
      {
        id: "sizeof-types",
        title: "Checking Type Sizes",
        explanation:
          "sizeof is a compile-time operator (not a function call in the runtime sense) that returns the number of bytes a type or variable occupies. Always use it instead of assuming a fixed size, since it can vary across compilers/platforms.",
        code: `#include <stdio.h>

int main() {
    printf("char:   %zu byte(s)\\n", sizeof(char));
    printf("int:    %zu byte(s)\\n", sizeof(int));
    printf("float:  %zu byte(s)\\n", sizeof(float));
    printf("double: %zu byte(s)\\n", sizeof(double));
    return 0;
}`,
        output: "char:   1 byte(s)\nint:    4 byte(s)\nfloat:  4 byte(s)\ndouble: 8 byte(s)",
      },
      {
        id: "implicit-explicit-cast",
        title: "Implicit vs Explicit Type Conversion",
        explanation:
          "When operands of different types appear in an expression, C implicitly promotes the 'smaller' type to the 'larger' one before computing (here int becomes float). Explicit casting with (type) forces a conversion you control directly, such as truncating a float down to an int by discarding the decimal part.",
        code: `#include <stdio.h>

int main() {
    int a = 7;
    float b = 2.0;

    float implicit = a / b;          // a is implicitly promoted to float
    int explicitCast = (int) 9.99;   // explicitly truncated, not rounded

    printf("Implicit result: %.2f\\n", implicit);
    printf("Explicit cast:   %d\\n", explicitCast);
    return 0;
}`,
        output: "Implicit result: 3.50\nExplicit cast:   9",
      },
    ],
  },
  {
    slug: "operators",
    title: "Operators",
    tagline: "Arithmetic, relational, logical, and bitwise",
    concept:
      "Operators let you combine and compare values. Arithmetic operators (+ - * / %) do math — note that % (modulo) only works on integers, and integer division truncates the decimal part (7 / 2 is 3, not 3.5). Relational operators (== != < > <= >=) produce 1 (true) or 0 (false), since C has no dedicated boolean type pre-C99. Logical operators (&& || !) combine boolean expressions and short-circuit — meaning the second operand of && is never evaluated if the first is already false. Bitwise operators (& | ^ ~ << >>) operate directly on the binary representation of integers, which is essential for flags, masks, and low-level optimization. Operator precedence determines evaluation order when operators are mixed without parentheses — when in doubt, add parentheses for clarity.",
    cheatsheet: [
      "Integer division truncates: 7 / 2 == 3, not 3.5. Use floats if you need the fraction.",
      "% (modulo) is integer-only — 7 % 2 == 1. Common use: checking even/odd, wrapping indices.",
      "&& and || short-circuit: the right operand isn't evaluated if the result is already determined.",
      "Bitwise AND &, OR |, XOR ^, NOT ~, left shift <<, right shift >> — operate on raw bits.",
      "x << n multiplies x by 2^n (for non-negative values); x >> n divides by 2^n (integer division).",
      "Don't confuse = (assignment) with == (equality comparison) — a classic C bug.",
      "++x (pre-increment) increments then returns; x++ (post-increment) returns then increments.",
    ],
    examples: [
      {
        id: "arithmetic-modulo",
        title: "Arithmetic & Modulo",
        explanation:
          "Demonstrates integer division truncation versus floating-point division, and the modulo operator for finding remainders — the classic way to check if a number is even or odd.",
        code: `#include <stdio.h>

int main() {
    int a = 17, b = 5;

    printf("Integer division: %d\\n", a / b);       // truncates
    printf("Float division:   %.2f\\n", (float)a / b);
    printf("Modulo (remainder): %d\\n", a % b);

    int n = 14;
    if (n % 2 == 0) {
        printf("%d is even\\n", n);
    } else {
        printf("%d is odd\\n", n);
    }
    return 0;
}`,
        output: "Integer division: 3\nFloat division:   3.40\nModulo (remainder): 2\n14 is even",
      },
      {
        id: "bitwise-ops",
        title: "Bitwise Operators",
        explanation:
          "Bitwise operators work directly on each bit of an integer's binary representation. Here, 5 (0101) and 3 (0011) are combined with AND, OR, and XOR, and shifted to show how shifting relates to multiplication/division by powers of 2.",
        code: `#include <stdio.h>

int main() {
    int a = 5;  // binary: 0101
    int b = 3;  // binary: 0011

    printf("a & b = %d\\n", a & b);   // AND -> 0001 = 1
    printf("a | b = %d\\n", a | b);   // OR  -> 0111 = 7
    printf("a ^ b = %d\\n", a ^ b);   // XOR -> 0110 = 6
    printf("a << 1 = %d\\n", a << 1); // 0101 -> 1010 = 10 (a * 2)
    printf("a >> 1 = %d\\n", a >> 1); // 0101 -> 0010 = 2  (a / 2)
    return 0;
}`,
        output: "a & b = 1\na | b = 7\na ^ b = 6\na << 1 = 10\na >> 1 = 2",
      },
    ],
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    tagline: "if/else, switch, and loops",
    concept:
      "Control flow statements decide which code runs and how many times. if/else if/else branches execute one block based on a condition. switch is an alternative to a long if-else chain when comparing one variable against several constant values — but every case needs a break, or execution 'falls through' into the next case (sometimes intentional, usually a bug). C has three loop constructs: for (best when you know the iteration count up front, since init/condition/increment live in one line), while (checks the condition before each iteration, so the body might run zero times), and do-while (checks the condition AFTER each iteration, guaranteeing the body runs at least once). break exits a loop/switch entirely; continue skips to the next iteration.",
    cheatsheet: [
      "for (init; condition; update) { } — all three clauses are optional but the semicolons are required.",
      "while checks condition BEFORE the body — may run zero times. do-while checks AFTER — runs at least once.",
      "switch needs a break in every case, or execution falls through into the next case.",
      "break exits the nearest enclosing loop or switch entirely. continue skips to the next iteration.",
      "Any non-zero value is treated as 'true' in a condition; only 0 is 'false'.",
      "Infinite loop idiom: for (;;) { } or while (1) { } — paired with an internal break to exit.",
    ],
    examples: [
      {
        id: "for-vs-while",
        title: "for vs while vs do-while",
        explanation:
          "All three loops here print 1 through 5, but they illustrate the structural difference: for bundles all loop control in one line, while checks first, and do-while guarantees at least one execution — useful for menu-driven programs where you want the menu to show at least once.",
        code: `#include <stdio.h>

int main() {
    printf("for loop: ");
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");

    printf("while loop: ");
    int j = 1;
    while (j <= 5) {
        printf("%d ", j);
        j++;
    }
    printf("\\n");

    printf("do-while loop: ");
    int k = 1;
    do {
        printf("%d ", k);
        k++;
    } while (k <= 5);
    printf("\\n");

    return 0;
}`,
        output: "for loop: 1 2 3 4 5 \nwhile loop: 1 2 3 4 5 \ndo-while loop: 1 2 3 4 5",
      },
      {
        id: "switch-grade",
        title: "switch-case: Grade Calculator",
        explanation:
          "switch compares 'grade' against each case label. The break after each case prevents fall-through into the next one. default catches any value that doesn't match a listed case — equivalent to a final else.",
        code: `#include <stdio.h>

int main() {
    char grade = 'B';

    switch (grade) {
        case 'A':
            printf("Excellent!\\n");
            break;
        case 'B':
            printf("Good job!\\n");
            break;
        case 'C':
            printf("You can do better.\\n");
            break;
        default:
            printf("Invalid grade.\\n");
    }
    return 0;
}`,
        output: "Good job!",
      },
      {
        id: "nested-loop-pattern",
        title: "Nested Loops: Number Pyramid",
        explanation:
          "Nested loops let the outer loop control rows while the inner loop controls what's printed within each row — a classic pattern for printing shapes and is a good test of loop-control intuition.",
        code: `#include <stdio.h>

int main() {
    int rows = 5;

    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("%d ", j);
        }
        printf("\\n");
    }
    return 0;
}`,
        output: "1 \n1 2 \n1 2 3 \n1 2 3 4 \n1 2 3 4 5",
      },
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    tagline: "Reusable blocks with their own scope",
    concept:
      "A function groups a sequence of statements under a name, taking inputs (parameters) and optionally producing an output (return value). C requires a function to either be defined or at least declared (a prototype: return type, name, parameter types) before it's called — otherwise the compiler doesn't know its signature. Arguments in C are passed BY VALUE by default, meaning the function receives a copy of each argument; changes inside the function don't affect the caller's original variable. To let a function modify the caller's data, you must pass a pointer to it (pass by reference, simulated via pointers). Recursion — a function calling itself — works because each call gets its own stack frame with its own local variables; every recursive function needs a base case to avoid infinite recursion (and a stack overflow).",
    cheatsheet: [
      "Function prototype: returnType name(paramTypes); — declares the signature before use/definition.",
      "Arguments are passed BY VALUE — the function gets a copy, not the original variable.",
      "To modify a caller's variable, pass its address (a pointer) and dereference inside the function.",
      "void as a return type means the function returns nothing. void as the only parameter means it takes none.",
      "Every recursive function needs a base case — the condition that stops further recursive calls.",
      "Local variables exist only within the function's scope and are destroyed when it returns.",
      "static local variables retain their value between function calls (unlike normal locals).",
    ],
    examples: [
      {
        id: "pass-by-value-vs-pointer",
        title: "Pass by Value vs Pass by Pointer",
        explanation:
          "tryToDouble receives a COPY of x, so doubling it inside the function has no effect on the caller's variable. actuallyDouble receives the ADDRESS of x (a pointer) and dereferences it with *ptr to modify the original value directly — this is how C simulates 'pass by reference'.",
        code: `#include <stdio.h>

void tryToDouble(int x) {
    x = x * 2; // only changes the local copy
}

void actuallyDouble(int *x) {
    *x = *x * 2; // dereferences the pointer to modify the original
}

int main() {
    int num = 10;

    tryToDouble(num);
    printf("After tryToDouble: %d\\n", num); // unchanged

    actuallyDouble(&num);
    printf("After actuallyDouble: %d\\n", num); // changed

    return 0;
}`,
        output: "After tryToDouble: 10\nAfter actuallyDouble: 20",
      },
      {
        id: "recursion-factorial",
        title: "Recursion: Factorial",
        explanation:
          "factorial(n) is defined as n * factorial(n-1), with factorial(0) as the base case that stops the recursion. Each call waits on the stack for the result of the next smaller call, and the results multiply back up once the base case is reached.",
        code: `#include <stdio.h>

long factorial(int n) {
    if (n == 0) {       // base case
        return 1;
    }
    return n * factorial(n - 1); // recursive case
}

int main() {
    int num = 6;
    printf("%d! = %ld\\n", num, factorial(num));
    return 0;
}`,
        output: "6! = 720",
      },
    ],
  },
  {
    slug: "arrays",
    title: "Arrays",
    tagline: "Fixed-size, contiguous, same-type collections",
    concept: `An array stores a fixed number of elements of the same type in contiguous memory. Once declared, its size cannot change. Indexing starts at 0, and C performs NO bounds checking—reading or writing past the array's end is undefined behavior (it might crash or silently corrupt nearby memory). The array's name, when used in most expressions, "decays" into a pointer to its first element. This is why you don't need & when passing an array to a function like scanf("%s", name). Multidimensional arrays (e.g. int grid[3][4]) are stored in row-major order, meaning an entire row is contiguous in memory before the next row begins.`,
    cheatsheet: [
      "Declaration: type name[size]; — size must be known at compile time for a fixed array.",
      "Indexing starts at 0; valid indices run from 0 to size-1. No automatic bounds checking — be careful.",
      "An array's name decays to a pointer to its first element in most expressions: arr is like &arr[0].",
      "sizeof(arr) / sizeof(arr[0]) gives the element count — only works inside the scope where arr is a real array, not after it's passed to a function (it decays to a pointer there).",
      "2D arrays: int grid[rows][cols]; stored row-major (an entire row is contiguous before the next starts).",
      "Arrays passed to functions are always passed as pointers — the function can't tell the original size.",
    ],
    examples: [
      {
        id: "array-basics",
        title: "Array Declaration, Initialization & Traversal",
        explanation:
          "Arrays can be initialized at declaration with a list of values. The for loop here walks through every index from 0 to length-1, computed via the sizeof trick (valid here since 'numbers' is a real array in this scope, not a decayed pointer parameter).",
        code: `#include <stdio.h>

int main() {
    int numbers[5] = {10, 20, 30, 40, 50};
    int length = sizeof(numbers) / sizeof(numbers[0]);

    int sum = 0;
    for (int i = 0; i < length; i++) {
        printf("numbers[%d] = %d\\n", i, numbers[i]);
        sum += numbers[i];
    }

    printf("Sum: %d\\n", sum);
    return 0;
}`,
        output: "numbers[0] = 10\nnumbers[1] = 20\nnumbers[2] = 30\nnumbers[3] = 40\nnumbers[4] = 50\nSum: 150",
      },
      {
        id: "2d-array-matrix",
        title: "2D Array: Matrix Addition",
        explanation:
          "Two 3x3 matrices are added element by element using nested loops — the outer loop walks rows, the inner loop walks columns within that row. This is the standard pattern for any operation that needs to touch every cell of a 2D array.",
        code: `#include <stdio.h>

int main() {
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{5, 6}, {7, 8}};
    int result[2][2];

    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }

    printf("Result matrix:\\n");
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            printf("%d ", result[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`,
        output: "Result matrix:\n6 8 \n10 12",
      },
    ],
  },
  {
    slug: "strings",
    title: "Strings",
    tagline: "Character arrays terminated by '\\0'",
    concept:
      "C has no dedicated string type — a string is just a char array ending with a special null terminator character '\\0' (byte value 0), which marks where the string stops. Every standard string function relies on finding this terminator, which is why forgetting it (e.g. when manually building a char array) causes functions to read past the intended end of the data. string.h provides the core toolkit: strlen (length, NOT counting the terminator), strcpy (copy), strcat (concatenate), strcmp (lexicographic compare, returns 0 if equal), and strstr (substring search). String literals like \"hello\" are automatically null-terminated by the compiler.",
    cheatsheet: [
      "A C string is a char array ending in '\\0' — the null terminator. Functions rely on finding it.",
      "strlen(s) returns length WITHOUT counting '\\0'. A buffer needs length+1 bytes to hold a string.",
      "strcpy(dest, src) copies; strcat(dest, src) appends — both require dest to have enough space already.",
      "strcmp(a, b) returns 0 if equal, negative if a < b, positive if a > b (lexicographically) — NOT a boolean.",
      "char str[20]; is mutable; char *str = \"text\"; points to a read-only string literal — don't modify it.",
      "Always size buffers with the null terminator in mind: char name[20] holds at most 19 real characters.",
    ],
    examples: [
      {
        id: "string-builtins",
        title: "Core string.h Functions",
        explanation:
          "Demonstrates the most commonly used string.h functions in one place: measuring length, comparing two strings (note 0 means equal, which trips up beginners expecting a boolean), and concatenating one string onto the end of another.",
        code: `#include <stdio.h>
#include <string.h>

int main() {
    char greeting[50] = "Hello";
    char name[] = "World";

    printf("Length of greeting: %zu\\n", strlen(greeting));

    strcat(greeting, ", ");
    strcat(greeting, name);
    strcat(greeting, "!");
    printf("After concatenation: %s\\n", greeting);

    char a[] = "apple";
    char b[] = "banana";
    int cmp = strcmp(a, b);
    printf("strcmp(a, b) = %d (negative means a < b)\\n", cmp);

    return 0;
}`,
        output: "Length of greeting: 5\nAfter concatenation: Hello, World!\nstrcmp(a, b) = -1 (negative means a < b)",
      },
      {
        id: "manual-string-reverse",
        title: "Reversing a String In-Place",
        explanation:
          "A two-pointer swap, same pattern as reversing an array: one index starts at the front, one at the back (just before the null terminator), and they swap characters while moving toward each other until they meet or cross.",
        code: `#include <stdio.h>
#include <string.h>

void reverseString(char *str) {
    int left = 0;
    int right = strlen(str) - 1;

    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

int main() {
    char text[] = "CodeNFacts";
    reverseString(text);
    printf("Reversed: %s\\n", text);
    return 0;
}`,
        output: "Reversed: stcaFNedoC",
      },
    ],
  },
  {
    slug: "pointers",
    title: "Pointers",
    tagline: "Variables that store memory addresses",
    concept:
      "A pointer is a variable whose value is the memory address of another variable. The & operator gets the address of a variable; the * operator (dereference) accesses the value stored at the address a pointer holds. Pointers are what let C achieve pass-by-reference, build dynamic data structures (linked lists, trees), and work directly with raw memory. Pointer arithmetic is type-aware: incrementing an int* moves forward by sizeof(int) bytes, not 1 byte — this is exactly why pointer + index works correctly to navigate an array. A pointer that doesn't point anywhere valid should be set to NULL, and should always be checked before dereferencing — dereferencing an uninitialized or NULL pointer is a leading cause of crashes in C programs. Double pointers (int **) are pointers to pointers, often used when a function needs to modify what a pointer itself points to (not just the value behind it).",
    cheatsheet: [
      "& gets the address of a variable. * dereferences a pointer — accesses the value at that address.",
      "int *p declares p as a pointer to an int. Always initialize pointers — an uninitialized pointer is 'wild'.",
      "NULL means 'points to nothing valid' — always check (if (p != NULL)) before dereferencing.",
      "Pointer arithmetic is type-aware: ptr + 1 moves forward by sizeof(*ptr) bytes, not 1 byte.",
      "Array name decays to a pointer to its first element: arr[i] is equivalent to *(arr + i).",
      "A double pointer (int **pp) points to a pointer — used when a function must reassign the caller's pointer itself.",
      "Dangling pointer: a pointer still pointing to memory that's already been freed — using it is undefined behavior.",
    ],
    examples: [
      {
        id: "pointer-basics",
        title: "Pointer Fundamentals",
        explanation:
          "p stores the address of num (obtained with &). Dereferencing p with *p reads the value at that address. Modifying *p changes num itself, since they refer to the exact same memory location.",
        code: `#include <stdio.h>

int main() {
    int num = 42;
    int *p = &num; // p holds the address of num

    printf("Value of num: %d\\n", num);
    printf("Address of num: %p\\n", (void*)&num);
    printf("Value of p (address it stores): %p\\n", (void*)p);
    printf("Value pointed to by p (*p): %d\\n", *p);

    *p = 100; // modifies num through the pointer
    printf("num after *p = 100: %d\\n", num);

    return 0;
}`,
        output: "Value of num: 42\nAddress of num: 0x7ffeefbff5ac\nValue of p (address it stores): 0x7ffeefbff5ac\nValue pointed to by p (*p): 42\nnum after *p = 100: 100",
      },
      {
        id: "pointer-array-arithmetic",
        title: "Pointer Arithmetic with Arrays",
        explanation:
          "Since an array name decays to a pointer to its first element, *(arr + i) is exactly equivalent to arr[i] — this loop walks the array purely with pointer arithmetic to make that equivalence concrete, incrementing the pointer itself rather than indexing.",
        code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40};
    int *p = arr; // decays to &arr[0]

    for (int i = 0; i < 4; i++) {
        printf("*(p + %d) = %d\\n", i, *(p + i));
    }
    return 0;
}`,
        output: "*(p + 0) = 10\n*(p + 1) = 20\n*(p + 2) = 30\n*(p + 3) = 40",
      },
    ],
  },
  {
    slug: "structures",
    title: "Structures & Unions",
    tagline: "Grouping different types into one custom type",
    concept:
      "A struct groups multiple variables (possibly of different types) under one name, letting you model real-world entities like a 'Student' (name, roll number, marks) as a single unit. Each member gets its own memory, and the struct's total size is at least the sum of its members (often more, due to compiler-inserted padding for alignment). A union looks similar but ALL members share the same memory location — a union's size equals its largest member, and writing to one member overwrites any others, since they're not actually separate memory at all. Unions are used when you need to represent one of several possible types in the same memory space and you'll always know which member is 'active'. Accessing struct members uses dot notation (s.name) for a struct variable, or arrow notation (ptr->name) when you have a pointer to a struct — ptr->name is shorthand for (*ptr).name.",
    cheatsheet: [
      "struct groups different-typed members; each gets its own memory. Use typedef struct {...} Name; for convenience.",
      "Dot notation s.member for a struct variable; arrow notation ptr->member for a pointer to a struct.",
      "ptr->member is exactly equivalent to (*ptr).member — arrow exists purely for readability.",
      "union members all share the same memory — writing one member can overwrite another's data.",
      "sizeof(struct) is generally >= sum of member sizes, due to compiler padding/alignment.",
      "Structs can be passed to functions by value (copies everything) or by pointer (efficient, allows mutation).",
      "Nested structs and arrays of structs are common — e.g. struct Student classroom[30];",
    ],
    examples: [
      {
        id: "struct-basics",
        title: "Defining and Using a Struct",
        explanation:
          "typedef struct {...} Student; defines a new type called Student in one step, avoiding the need to write 'struct Student' everywhere. Members are accessed with dot notation on a struct variable.",
        code: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[30];
    int rollNumber;
    float marks;
} Student;

int main() {
    Student s1;
    strcpy(s1.name, "Prakash");
    s1.rollNumber = 21;
    s1.marks = 88.5;

    printf("Name: %s\\n", s1.name);
    printf("Roll Number: %d\\n", s1.rollNumber);
    printf("Marks: %.1f\\n", s1.marks);

    return 0;
}`,
        output: "Name: Prakash\nRoll Number: 21\nMarks: 88.5",
      },
      {
        id: "struct-pointer-arrow",
        title: "Struct Pointers & Arrow Notation",
        explanation:
          "A function that needs to MODIFY a struct (not just read it) should take a pointer to it, both for efficiency (avoiding a full copy) and so changes persist after the function returns. Inside the function, ptr->field is used instead of (*ptr).field for readability.",
        code: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

void movePoint(Point *p, int dx, int dy) {
    p->x += dx; // shorthand for (*p).x += dx;
    p->y += dy;
}

int main() {
    Point origin = {0, 0};
    movePoint(&origin, 5, 3);

    printf("New position: (%d, %d)\\n", origin.x, origin.y);
    return 0;
}`,
        output: "New position: (5, 3)",
      },
    ],
  },
  {
    slug: "memory-management",
    title: "Dynamic Memory Management",
    tagline: "malloc, calloc, realloc, and free",
    concept:
      "Arrays declared normally have a fixed size baked in at compile time. Dynamic memory allocation, via functions in stdlib.h, lets a program request memory at RUN time, whose size can depend on user input or other runtime conditions, and that memory lives on the heap rather than the stack. malloc(size) allocates raw uninitialized bytes and returns a void* (cast it to the type you need); calloc(count, size) allocates and zero-initializes memory for an array of elements; realloc(ptr, newSize) resizes a previous allocation, possibly moving it. Every successful malloc/calloc/realloc call MUST be paired with exactly one free(ptr) call once the memory is no longer needed — forgetting this causes a memory leak, and calling free twice on the same pointer (a 'double free') or using memory after freeing it ('use after free') are both undefined behavior. Always check the return value of allocation functions against NULL, since allocation can fail.",
    cheatsheet: [
      "malloc(n * sizeof(type)) allocates n elements of uninitialized memory — cast the void* return to your type.",
      "calloc(n, sizeof(type)) allocates AND zero-initializes — slightly slower than malloc but starts clean.",
      "realloc(ptr, newSize) resizes a previous allocation — may move the block, always reassign the return value.",
      "Every malloc/calloc/realloc needs exactly one matching free() — mismatched calls cause leaks or crashes.",
      "Always check if (ptr == NULL) after allocating — allocation CAN fail, especially for large requests.",
      "After free(ptr), set ptr = NULL to avoid accidentally dereferencing a 'dangling' pointer later.",
      "Stack memory (normal local variables) is automatic; heap memory (malloc'd) is fully manual — you own its lifetime.",
    ],
    examples: [
      {
        id: "malloc-dynamic-array",
        title: "Dynamically Sized Array with malloc",
        explanation:
          "Unlike a fixed-size array, here the size 'n' comes from user input at runtime — only possible because the array's memory is requested with malloc AFTER n is known, rather than being baked into the compiled program.",
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    printf("How many numbers? ");
    scanf("%d", &n);

    int *arr = (int *) malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    printf("Array contents: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr); // required — release the heap memory
    arr = NULL;

    return 0;
}`,
        output: "How many numbers? 4\nArray contents: 10 20 30 40",
      },
      {
        id: "realloc-growing-array",
        title: "Growing an Array with realloc",
        explanation:
          "Starts with a small allocation for 2 ints, then grows it to hold 5 using realloc — which preserves the existing contents (10, 20) and extends the block, possibly relocating it in memory if needed, which is why you must always capture realloc's return value rather than assuming the pointer stays the same.",
        code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int *) malloc(2 * sizeof(int));
    arr[0] = 10;
    arr[1] = 20;

    int *temp = (int *) realloc(arr, 5 * sizeof(int));
    if (temp == NULL) {
        printf("Reallocation failed!\\n");
        free(arr);
        return 1;
    }
    arr = temp; // always reassign — the block may have moved

    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;

    printf("Array after realloc: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    free(arr);
    return 0;
}`,
        output: "Array after realloc: 10 20 30 40 50",
      },
    ],
  },
  {
    slug: "file-handling",
    title: "File Handling",
    tagline: "Reading and writing files with FILE*",
    concept:
      "C interacts with files through a FILE* handle obtained from fopen(filename, mode), where mode determines the operation: \"r\" (read, file must exist), \"w\" (write, creates or truncates), \"a\" (append, creates if missing), and \"r+\"/\"w+\"/\"a+\" variants for read+write access. After opening, fprintf/fputs write formatted/plain text, fscanf/fgets read it back, and fclose(file) MUST be called when done to flush buffered output to disk and release the OS file handle — skipping this can lose data that's still sitting in a buffer. Always check fopen's return value against NULL before using the handle, since the file might not exist or you might lack permission. For reading line by line, fgets is generally preferred over fscanf with %s since it respects a buffer size limit and handles whitespace in lines correctly.",
    cheatsheet: [
      "fopen(\"file.txt\", \"r\") opens for reading; \"w\" for writing (truncates existing content); \"a\" to append.",
      "ALWAYS check if (file == NULL) after fopen — the file may not exist or be inaccessible.",
      "fprintf(file, ...) writes formatted text; fputs(str, file) writes a plain string.",
      "fgets(buffer, size, file) reads one line, respecting the buffer size limit — safer than fscanf(\"%s\").",
      "fclose(file) is mandatory once done — it flushes buffered writes to disk and frees the OS handle.",
      "feof(file) returns true once the end of the file has been reached during reading.",
      "Binary mode (\"rb\"/\"wb\") is used for non-text data; fread/fwrite handle raw binary blocks.",
    ],
    examples: [
      {
        id: "write-read-file",
        title: "Writing to and Reading from a File",
        explanation:
          "First opens notes.txt in write mode and writes two lines with fprintf, then closes it (required to flush the write). Reopens the same file in read mode and reads it back line by line with fgets until EOF, printing each line as it goes.",
        code: `#include <stdio.h>

int main() {
    FILE *file = fopen("notes.txt", "w");
    if (file == NULL) {
        printf("Could not open file for writing.\\n");
        return 1;
    }
    fprintf(file, "Learning C with CodeNFacts\\n");
    fprintf(file, "File handling is essential!\\n");
    fclose(file);

    file = fopen("notes.txt", "r");
    if (file == NULL) {
        printf("Could not open file for reading.\\n");
        return 1;
    }

    char line[100];
    printf("File contents:\\n");
    while (fgets(line, sizeof(line), file) != NULL) {
        printf("%s", line);
    }
    fclose(file);

    return 0;
}`,
        output: "File contents:\nLearning C with CodeNFacts\nFile handling is essential!",
      },
    ],
  },
  {
    slug: "preprocessor",
    title: "Preprocessor Directives",
    tagline: "Text substitution before compilation even begins",
    concept:
      "The preprocessor runs BEFORE actual compilation and performs pure text substitution and conditional inclusion — it doesn't understand C syntax at all, just directives starting with #. #include pulls in another file's content (angle brackets <> for system/standard headers, quotes \"\" for your own project files). #define creates either a simple constant (#define PI 3.14159) or a macro with parameters (#define SQUARE(x) ((x) * (x))) — macros are substituted literally, which is why parameters should almost always be wrapped in parentheses to avoid operator-precedence bugs. Include guards (#ifndef / #define / #endif) prevent a header file from being included multiple times in the same compilation, which would otherwise cause 'redefinition' errors.",
    cheatsheet: [
      "#include <header.h> for standard library headers; #include \"header.h\" for your own project files.",
      "#define NAME value creates a constant; #define NAME(x) expr creates a macro — both are pure text substitution.",
      "ALWAYS parenthesize macro parameters: #define SQUARE(x) ((x) * (x)), not x * x — avoids precedence bugs.",
      "Include guards: #ifndef HEADER_H / #define HEADER_H / ...contents... / #endif — prevents double inclusion.",
      "#ifdef / #ifndef / #else / #endif allow conditional compilation, e.g. for platform-specific code.",
      "Macros are NOT type-checked and don't respect scope the way functions/constants do — prefer const or inline functions in modern code where possible.",
    ],
    examples: [
      {
        id: "define-macro",
        title: "Constants and Function-like Macros",
        explanation:
          "PI is a simple text-substitution constant. SQUARE(x) is a macro that gets literally pasted in wherever it's used — note the defensive parentheses around x and the whole expression, which prevent bugs when SQUARE is called with an expression like SQUARE(a + b).",
        code: `#include <stdio.h>

#define PI 3.14159
#define SQUARE(x) ((x) * (x))

int main() {
    float radius = 4.0;
    float area = PI * SQUARE(radius);

    printf("Area of circle: %.2f\\n", area);
    printf("SQUARE(2 + 3) = %d\\n", SQUARE(2 + 3)); // (2+3)*(2+3) = 25, thanks to parentheses

    return 0;
}`,
        output: "Area of circle: 50.27\nSQUARE(2 + 3) = 25",
      },
      {
        id: "include-guard",
        title: "Include Guards in a Header File",
        explanation:
          "If mathutils.h were included twice across different files that both get compiled together, the #ifndef/#define/#endif guard ensures its contents are only processed once — without it, the compiler would see the function declared twice and throw a redefinition error.",
        code: `// mathutils.h
#ifndef MATHUTILS_H
#define MATHUTILS_H

int cube(int x);

#endif // MATHUTILS_H

// mathutils.c
#include "mathutils.h"

int cube(int x) {
    return x * x * x;
}

// main.c
#include <stdio.h>
#include "mathutils.h"

int main() {
    printf("Cube of 3: %d\\n", cube(3));
    return 0;
}`,
        output: "Cube of 3: 27",
      },
    ],
  },
  {
    slug: "storage-classes",
    title: "Storage Classes & Scope",
    tagline: "Where variables live and how long they survive",
    concept:
      "A storage class controls a variable's scope (where it's visible), lifetime (how long it exists), and default initial value. auto is the default for local variables (rarely written explicitly) — they live on the stack and are destroyed when their block exits. static changes a local variable's LIFETIME (it persists across function calls, retaining its last value, while staying scoped only to that function) and changes a global variable's/function's SCOPE (restricting visibility to just the current file, not other files in the project). extern declares that a variable is DEFINED elsewhere (typically another file), letting multiple files share one global variable without each defining their own copy. register is a hint (largely ignored by modern optimizing compilers) suggesting a variable be kept in a CPU register for fast access.",
    cheatsheet: [
      "auto: default for local variables, stack-allocated, destroyed when the block exits (rarely written explicitly).",
      "static (local variable): retains its value between function calls instead of resetting each time.",
      "static (global variable/function): restricts visibility to the current file only (internal linkage).",
      "extern: declares a variable is defined in another file — used to share globals across multiple files.",
      "register: a (largely obsolete) hint to keep a variable in a CPU register for faster access.",
      "Global variables default to 0/NULL if not explicitly initialized; local variables do NOT — they're garbage until set.",
    ],
    examples: [
      {
        id: "static-local-counter",
        title: "static Local Variable: Call Counter",
        explanation:
          "Without static, 'count' would reset to 0 every time the function is called. With static, it's initialized to 0 only ONCE (the first call) and then retains its updated value across every subsequent call, demonstrating how static changes a local variable's lifetime.",
        code: `#include <stdio.h>

void trackCalls() {
    static int count = 0; // initialized only once, ever
    count++;
    printf("This function has been called %d time(s)\\n", count);
}

int main() {
    trackCalls();
    trackCalls();
    trackCalls();
    return 0;
}`,
        output: "This function has been called 1 time(s)\nThis function has been called 2 time(s)\nThis function has been called 3 time(s)",
      },
    ],
  },
];

type TabKey = "concept" | "cheatsheet" | "examples";

export default function CLanguagePage() {
  const [activeSlug, setActiveSlug] = useState(C_TOPICS[0].slug);
  const [activeTab, setActiveTab] = useState<TabKey>("concept");
  const [query, setQuery] = useState("");
  const [openExampleId, setOpenExampleId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTopic = useMemo(
    () => C_TOPICS.find((t) => t.slug === activeSlug) ?? C_TOPICS[0],
    [activeSlug]
  );

  const filteredTopics = useMemo(() => {
    if (!query.trim()) return C_TOPICS;
    const q = query.toLowerCase();
    return C_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.examples.some((e) => e.title.toLowerCase().includes(q))
    );
  }, [query]);

  async function copyCode(id: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1500);
    } catch {
      // clipboard unavailable, fail silently
    }
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-neutral-50/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-900 dark:bg-emerald-500/20">
              <Terminal className="h-4 w-4 text-neutral-50 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold leading-none tracking-tight">
                Code<span className="text-emerald-600 dark:text-emerald-400">N</span>Facts
              </p>
              <p className="mt-1 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                C Language - Concepts, Cheatsheets & Code Examples
              </p>
            </div>
          </div>

          <div className="relative w-full sm:max-w-xs sm:shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics or examples..."
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-emerald-500/30 transition focus:ring-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:flex-row">
        {/* ===== Sidebar (topics) — desktop only ===== */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-1 overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isActive = topic.slug === activeSlug;
              return (
                <button
                  key={topic.slug}
                  onClick={() => {
                    setActiveSlug(topic.slug);
                    setActiveTab("concept");
                    setOpenExampleId(null);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-neutral-900 text-neutral-50 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  }`}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium">{topic.title}</span>
                    <span
                      className={`truncate text-[11px] ${
                        isActive
                          ? "text-neutral-300 dark:text-emerald-400/70"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      {topic.tagline}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                      isActive
                        ? "bg-white/15 text-neutral-50 dark:bg-emerald-400/15 dark:text-emerald-300"
                        : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {topic.examples.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ===== Mobile topic selector ===== */}
        <div className="w-full lg:hidden">
          <div className="-mx-3 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2">
              {filteredTopics.map((topic) => {
                const isActive = topic.slug === activeSlug;
                return (
                  <button
                    key={topic.slug}
                    onClick={() => {
                      setActiveSlug(topic.slug);
                      setActiveTab("concept");
                      setOpenExampleId(null);
                    }}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
                      isActive
                        ? "bg-neutral-900 text-neutral-50 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-neutral-200/70 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
                    }`}
                  >
                    {topic.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== Main content ===== */}
        <main className="min-w-0 flex-1">
          {/* Topic header */}
          <div className="mb-4 flex flex-col gap-1 border-b border-neutral-200 pb-3 dark:border-neutral-800 sm:mb-5 sm:pb-4">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
              {activeTopic.title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {activeTopic.tagline}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex w-full gap-1 rounded-lg bg-neutral-200/60 p-1 dark:bg-neutral-900 sm:mb-5 sm:w-fit">
            {(
              [
                { key: "concept", label: "Concept", icon: BookOpen },
                { key: "cheatsheet", label: "Cheatsheet", icon: Layers },
                { key: "examples", label: "Code Examples", icon: Code2 },
              ] as { key: TabKey; label: string; icon: typeof BookOpen }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-2.5 text-xs font-medium transition sm:flex-none sm:px-4 ${
                  activeTab === key
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-50"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{label}</span>
                {key === "examples" && (
                  <span className="ml-0.5 rounded-full bg-neutral-200 px-1.5 text-[10px] dark:bg-neutral-700">
                    {activeTopic.examples.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* === Concept tab === */}
          {activeTab === "concept" && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-5 md:p-6">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-[15px]">
                {activeTopic.concept}
              </p>
            </div>
          )}

          {/* === Cheatsheet tab === */}
          {activeTab === "cheatsheet" && (
            <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {activeTopic.cheatsheet.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 px-4 py-3.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 sm:px-5 md:px-6"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* === Examples tab === */}
          {activeTab === "examples" && (
            <div className="space-y-3">
              {activeTopic.examples.map((example) => {
                const isOpen = openExampleId === example.id;
                return (
                  <div
                    key={example.id}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <button
                      onClick={() =>
                        setOpenExampleId(isOpen ? null : example.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left active:bg-neutral-50 dark:active:bg-neutral-800/50 sm:px-5"
                    >
                      <span className="min-w-0 truncate text-sm font-medium sm:text-[15px]">
                        {example.title}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="space-y-4 border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 sm:px-5">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                            Explanation
                          </p>
                          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            {example.explanation}
                          </p>
                        </div>

                        <div>
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                              Code
                            </p>
                            <button
                              onClick={() =>
                                copyCode(example.id, example.code)
                              }
                              className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[11px] text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 active:scale-95 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                            >
                              {copiedId === example.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="overflow-x-auto rounded-lg bg-neutral-950 p-3 text-[12px] leading-relaxed text-neutral-100 dark:bg-black sm:p-4 sm:text-[13px]">
                            <code className="font-mono whitespace-pre">{example.code}</code>
                          </pre>
                        </div>

                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                            Output
                          </p>
                          <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[12px] leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-300 sm:p-3.5 sm:text-[13px]">
                            <code className="font-mono whitespace-pre">{example.output}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}