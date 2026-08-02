'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/* ------------------------------------------------------------------ */

type Section = {
  id: string;
  num: number;
  title: string;
  body: string[];
  code?: string;
  keyPoints?: string[];
  diagram?: string; // key into DIAGRAMS map
};

const sections: Section[] = [
  {
    id: 'intro',
    num: 1,
    title: 'Introduction to C++',
    body: [
      'C++ was created by Bjarne Stroustrup in 1985 as an extension of C, adding classes and object-oriented features. It compiles to native machine code, which is why it still powers game engines, operating systems, browsers, and trading systems where performance is non-negotiable.',
      'It is a statically typed, compiled, multi-paradigm language: you can write procedural code, object-oriented code, or generic template code in the same file.',
    ],
    keyPoints: [
      'C++ is a superset of C — most valid C compiles as C++.',
      'Compiled languages trade a build step for raw execution speed.',
      'Standardized by ISO; current widely-used revisions are C++17, C++20, C++23.',
    ],
  },
  {
    id: 'features',
    num: 2,
    title: 'Features of C++',
    body: [
      'C++ blends low-level control (manual memory, pointer arithmetic) with high-level abstractions (classes, templates, STL). This dual nature is its whole identity.',
    ],
    keyPoints: [
      'Object-oriented: classes, inheritance, polymorphism.',
      'Fast: compiles directly to machine code, no VM overhead.',
      'Portable: same source runs on any platform with a conforming compiler.',
      'Rich standard library: containers, algorithms, iterators (the STL).',
      'Fine-grained memory control via pointers, new/delete, and RAII.',
    ],
  },
  {
    id: 'structure',
    num: 3,
    title: 'Structure of a C++ Program',
    body: [
      'Every C++ program needs at least one function named main — execution always starts there. Headers bring in declarations you need; the compiler stitches everything together at build time.',
    ],
    code: `#include <iostream>   // header for cin/cout
using namespace std;   // avoid typing std:: everywhere

int main() {
    cout << "Hello, World!" << endl;
    return 0;           // 0 means "exited successfully"
}`,
    keyPoints: [
      '#include pulls in a header before compilation.',
      'main() is the mandatory entry point.',
      'return 0 signals success to the operating system.',
    ],
  },
  {
    id: 'io',
    num: 4,
    title: 'Input & Output',
    body: [
      'C++ streams model I/O as a flow of data. cin reads from standard input, cout writes to standard output, cerr writes unbuffered errors, and clog writes buffered log messages.',
    ],
    code: `int age;
cout << "Enter your age: ";
cin >> age;
cout << "You are " << age << " years old.\\n";`,
    keyPoints: [
      '<< inserts into a stream, >> extracts from one.',
      'cin >> stops at whitespace — use getline() for full lines.',
      'cerr is unbuffered, so error messages appear immediately.',
    ],
  },
  {
    id: 'variables',
    num: 5,
    title: 'Variables',
    body: [
      'A variable is a named, typed storage location. C++ requires every variable to have a declared type before use, and that type cannot change afterward.',
    ],
    code: `int score = 0;
double price = 19.99;
char grade = 'A';
bool passed = true;`,
    keyPoints: [
      'Names are case-sensitive and cannot start with a digit.',
      'Prefer initializing at declaration to avoid garbage values.',
      'Scope (block, function, global, class) controls a variable\'s lifetime.',
    ],
  },
  {
    id: 'datatypes',
    num: 6,
    title: 'Data Types',
    body: [
      'Built-in types fall into a few families: integer types, floating-point types, character types, and bool. Sizes are platform-dependent but guaranteed minimums exist.',
    ],
    code: `int      i = 42;        // typically 4 bytes
short    s = 10;         // >= 2 bytes
long     l = 100000L;    // >= 4 bytes
float    f = 3.14f;      // ~7 digit precision
double   d = 3.14159;    // ~15 digit precision
char     c = 'X';        // 1 byte
bool     b = false;      // true / false
void*    p = nullptr;    // typeless pointer`,
    keyPoints: [
      'Use sizeof(type) to check the exact size on your platform.',
      'Prefer double over float unless memory is tight.',
      'auto lets the compiler deduce the type from the initializer.',
    ],
  },
  {
    id: 'operators',
    num: 7,
    title: 'Operators',
    body: [
      'Operators combine into expressions following precedence and associativity rules, the same way arithmetic order-of-operations works on paper.',
    ],
    code: `a + b, a - b, a * b, a / b, a % b   // arithmetic
a == b, a != b, a < b, a >= b       // relational
a && b, a || b, !a                  // logical
a & b, a | b, a ^ b, ~a, a<<1, a>>1 // bitwise
a = b, a += b, a -= b               // assignment
a > b ? a : b                       // ternary`,
    keyPoints: [
      '% (modulo) only works on integer types.',
      '&& and || short-circuit — the right side may never evaluate.',
      'Bitwise operators are distinct from logical ones (& vs &&).',
    ],
  },
  {
    id: 'typeconv',
    num: 8,
    title: 'Type Conversion',
    body: [
      'Implicit conversion happens automatically when types mix (int to double, for example). Explicit conversion — casting — is when you tell the compiler exactly what you want.',
    ],
    code: `int x = 10;
double y = x;               // implicit: int -> double

double pi = 3.14159;
int truncated = (int)pi;    // C-style cast
int safer = static_cast<int>(pi); // preferred C++ cast`,
    keyPoints: [
      'Prefer static_cast, dynamic_cast, const_cast over C-style casts.',
      'Narrowing conversions (double -> int) can silently lose data.',
      'dynamic_cast is checked at runtime and used with polymorphic types.',
    ],
  },
  {
    id: 'constants',
    num: 9,
    title: 'Constants',
    body: [
      'A constant is a value that cannot change after initialization. Prefer const or constexpr over the older #define macro, since they respect scope and type.',
    ],
    code: `const double PI = 3.14159;
constexpr int MAX_USERS = 100; // evaluated at compile time`,
    keyPoints: [
      'const is checked by the type system; #define is a blind text substitution.',
      'constexpr guarantees the value is known at compile time.',
      'Literal suffixes like 10L, 3.14f, \'a\' fix a literal\'s type.',
    ],
  },
  {
    id: 'control',
    num: 10,
    title: 'Control Statements',
    body: [
      'Control statements decide which code runs, based on a condition. if/else branches on a boolean expression; switch branches on a single value against several cases.',
    ],
    code: `if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}

switch (day) {
    case 1: cout << "Mon"; break;
    case 2: cout << "Tue"; break;
    default: cout << "Other";
}`,
    keyPoints: [
      'Forgetting break in a switch falls through to the next case.',
      'switch only compares against constant integral/enum values.',
      'Every if should have braces, even for one-line bodies — safer to maintain.',
    ],
  },
  {
    id: 'loops',
    num: 11,
    title: 'Loops',
    body: [
      'Loops repeat a block of code. Choose for when you know the iteration count, while when the condition drives it, and do-while when the body must run at least once.',
    ],
    code: `for (int i = 0; i < 5; i++) cout << i;

int n = 5;
while (n > 0) { cout << n; n--; }

do { cout << "runs once"; } while (false);

for (int x : {1, 2, 3}) cout << x; // range-based for`,
    keyPoints: [
      'break exits a loop immediately; continue skips to the next iteration.',
      'Range-based for avoids off-by-one indexing errors.',
      'Infinite loops (for(;;)) are legal — used with an internal break.',
    ],
  },
  {
    id: 'arrays',
    num: 12,
    title: 'Arrays',
    body: [
      'An array is a fixed-size, contiguous block of elements of the same type. Indexing starts at 0, and C++ does not check bounds for you.',
    ],
    code: `int scores[5] = {90, 85, 77, 60, 95};
cout << scores[0];            // 90

int grid[2][3] = {{1,2,3}, {4,5,6}}; // 2D array
cout << grid[1][2];           // 6`,
    keyPoints: [
      'Array size is fixed at compile time (unless dynamically allocated).',
      'Out-of-bounds access is undefined behavior — no automatic error.',
      'Prefer std::array or std::vector in modern C++ for safety.',
    ],
  },
  {
    id: 'strings',
    num: 13,
    title: 'Strings',
    body: [
      'C-style strings are just char arrays terminated by \\0. std::string, from the standard library, manages its own memory and offers a much richer, safer API.',
    ],
    code: `char cstr[] = "Hi";          // C-style, null-terminated

#include <string>
std::string s = "Hello";
s += ", World!";
cout << s.length();          // 13
cout << s.substr(0, 5);      // "Hello"`,
    keyPoints: [
      'Always prefer std::string in new code.',
      's.length() and s.size() are equivalent.',
      'std::string overloads + for concatenation and == for comparison.',
    ],
  },
  {
    id: 'functions',
    num: 14,
    title: 'Functions',
    body: [
      'A function packages a task under a name so it can be reused. Parameters can have default values, and two functions can share a name if their parameter lists differ (overloading).',
    ],
    code: `int add(int a, int b = 10) {  // default argument
    return a + b;
}

double add(double a, double b) { // overload
    return a + b;
}

add(5);        // 15 (uses default)
add(2.5, 3.5); // calls the double version`,
    keyPoints: [
      'A function needs a declaration (prototype) before it is used, or a definition above the call site.',
      'Overload resolution picks the best-matching signature at compile time.',
      'Pass large objects by const reference to avoid copying.',
    ],
  },
  {
    id: 'recursion',
    num: 15,
    title: 'Recursion',
    body: [
      'A recursive function calls itself with a smaller version of the problem, and stops at a base case. Each call adds a frame to the call stack, so unbounded recursion overflows it.',
    ],
    code: `int factorial(int n) {
    if (n <= 1) return 1;      // base case
    return n * factorial(n-1); // recursive case
}`,
    keyPoints: [
      'Every recursive function needs at least one base case.',
      'Deep recursion risks a stack overflow — loops are safer for large n.',
      'Some recursive problems (tree traversal, divide-and-conquer) are far clearer than their loop equivalent.',
    ],
  },
  {
    id: 'pointers',
    num: 16,
    title: 'Pointers',
    body: [
      'A pointer stores the memory address of another variable. & takes an address, * dereferences a pointer to reach the value it points to.',
    ],
    code: `int x = 10;
int* p = &x;      // p holds the address of x
cout << *p;        // 10, dereferenced value
*p = 20;            // changes x through the pointer
cout << x;          // 20

int* q = nullptr;   // points to nothing`,
    keyPoints: [
      'A pointer can be reassigned to point elsewhere; a reference cannot.',
      'Always initialize pointers — an uninitialized pointer is dangerous.',
      'Dereferencing nullptr or a dangling pointer is undefined behavior.',
    ],
    diagram: 'pointerRef',
  },
  {
    id: 'references',
    num: 17,
    title: 'References',
    body: [
      'A reference is an alias for an existing variable — a second name for the same memory. Unlike a pointer, it must be bound at creation and can never be null or reseated.',
    ],
    code: `int x = 10;
int& ref = x;   // ref IS x, just another name
ref = 20;        // x becomes 20

void increment(int& n) { n++; } // pass by reference
increment(x);   // x becomes 21, no copy made`,
    keyPoints: [
      'References cannot be null — they always refer to a valid object.',
      'Pass-by-reference avoids copying and lets a function modify the caller\'s variable.',
      'const int& lets you avoid a copy while preventing modification.',
    ],
  },
  {
    id: 'dynamicmem',
    num: 18,
    title: 'Dynamic Memory',
    body: [
      'new allocates memory on the heap at runtime; delete frees it. Unlike stack variables, heap memory persists until you explicitly release it — forgetting to do so is a memory leak.',
    ],
    code: `int* p = new int(42);   // heap allocation
cout << *p;
delete p;                 // release it
p = nullptr;               // avoid a dangling pointer

int* arr = new int[10];   // array on the heap
delete[] arr;              // must use delete[] for arrays`,
    keyPoints: [
      'Every new must be paired with exactly one delete (or delete[]).',
      'Forgetting delete leaks memory; calling delete twice is undefined behavior.',
      'Modern C++ prefers smart pointers over raw new/delete (see section 32).',
    ],
    diagram: 'memory',
  },
  {
    id: 'structs',
    num: 19,
    title: 'Structures',
    body: [
      'A struct groups related variables of different types under one name. In C++ (unlike C), a struct can also have functions, constructors, and inheritance — the only default difference from a class is that struct members are public by default.',
    ],
    code: `struct Point {
    int x;
    int y;
};

Point p1 = {3, 4};
cout << p1.x << ", " << p1.y;`,
    keyPoints: [
      'struct members default to public; class members default to private.',
      'Use struct for simple data bundles, class when encapsulation matters.',
      'Structs can be nested inside other structs or classes.',
    ],
  },
  {
    id: 'enums',
    num: 20,
    title: 'Enumerations',
    body: [
      'An enum gives readable names to a set of integer constants. enum class (a "scoped enum") is the modern, safer version — its values don\'t leak into the surrounding scope and don\'t implicitly convert to int.',
    ],
    code: `enum Color { RED, GREEN, BLUE };      // classic
Color c = RED;

enum class Direction { North, South, East, West }; // scoped
Direction d = Direction::North;`,
    keyPoints: [
      'Plain enum values start at 0 unless assigned otherwise.',
      'enum class prevents accidental comparisons between unrelated enums.',
      'Prefer enum class in new code for type safety.',
    ],
  },
  {
    id: 'oop',
    num: 21,
    title: 'Object-Oriented Programming',
    body: [
      'OOP models a program as a collection of interacting objects, each bundling data (attributes) with behavior (methods). A class is the blueprint; an object is an instance built from it.',
    ],
    code: `class Car {
public:
    string brand;
    void honk() { cout << brand << " says beep!"; }
};

Car myCar;
myCar.brand = "Toyota";
myCar.honk();`,
    keyPoints: [
      'The four pillars: encapsulation, abstraction, inheritance, polymorphism.',
      'A class defines a type; an object is a concrete value of that type.',
      'Members are accessed with the dot operator on an object, or -> on a pointer.',
    ],
    diagram: 'pillars',
  },
  {
    id: 'constructors',
    num: 22,
    title: 'Constructors',
    body: [
      'A constructor is a special function that runs automatically when an object is created, typically to set up initial state. It shares the class name and has no return type.',
    ],
    code: `class Point {
public:
    int x, y;
    Point() : x(0), y(0) {}           // default constructor
    Point(int a, int b) : x(a), y(b) {} // parameterized
    Point(const Point& other) = default; // copy constructor
};

Point p1;         // calls default constructor
Point p2(3, 4);    // calls parameterized constructor
Point p3 = p2;     // calls copy constructor`,
    keyPoints: [
      'A member initializer list (: x(a), y(b)) is preferred over assigning in the body.',
      'The compiler generates a default and copy constructor if you define none.',
      'A constructor can be overloaded just like any other function.',
    ],
  },
  {
    id: 'destructors',
    num: 23,
    title: 'Destructors',
    body: [
      'A destructor runs automatically when an object goes out of scope or is deleted, and is the natural place to release resources the object owns (memory, files, locks) — the basis of the RAII pattern.',
    ],
    code: `class FileHandler {
public:
    FileHandler() { cout << "Opening file\\n"; }
    ~FileHandler() { cout << "Closing file\\n"; } // destructor
};

{
    FileHandler f; // constructor runs
} // f goes out of scope here -> destructor runs automatically`,
    keyPoints: [
      'A destructor has no parameters and cannot be overloaded.',
      'RAII (Resource Acquisition Is Initialization) ties resource lifetime to object lifetime.',
      'Mark destructors virtual in a base class if you plan to delete derived objects through a base pointer.',
    ],
  },
  {
    id: 'inheritance',
    num: 24,
    title: 'Inheritance',
    body: [
      'Inheritance lets a derived class reuse and extend a base class\'s members. It models an "is-a" relationship: a Dog is an Animal.',
    ],
    code: `class Animal {
public:
    void eat() { cout << "eating\\n"; }
};

class Dog : public Animal {   // Dog inherits from Animal
public:
    void bark() { cout << "woof\\n"; }
};

Dog d;
d.eat();  // inherited
d.bark(); // its own`,
    keyPoints: [
      'public inheritance keeps access levels as-is; protected/private tighten them.',
      'Types: single, multilevel, multiple, hierarchical, hybrid.',
      'C++ allows multiple inheritance, which other languages often avoid due to ambiguity.',
    ],
    diagram: 'inheritance',
  },
  {
    id: 'polymorphism',
    num: 25,
    title: 'Polymorphism',
    body: [
      'Polymorphism means "many forms": the same interface behaves differently depending on the actual object. Compile-time polymorphism is function/operator overloading; runtime polymorphism uses virtual functions resolved through a base pointer or reference.',
    ],
    code: `class Shape {
public:
    virtual double area() const { return 0; }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

Shape* s = new Circle(2.0);
cout << s->area();  // calls Circle's version at runtime`,
    keyPoints: [
      'virtual enables runtime dispatch; override documents the intent and is checked by the compiler.',
      'Without virtual, the base class version always runs, even for a derived object.',
      'Runtime polymorphism needs access through a pointer or reference, not a plain object.',
    ],
  },
  {
    id: 'abstraction',
    num: 26,
    title: 'Abstraction',
    body: [
      'Abstraction hides implementation detail behind a simple interface. An abstract class — one with at least one pure virtual function — defines "what" without saying "how", forcing derived classes to provide the implementation.',
    ],
    code: `class Shape {
public:
    virtual double area() const = 0; // pure virtual -> abstract class
};

// Shape s; // ERROR: cannot instantiate an abstract class

class Square : public Shape {
    double side;
public:
    Square(double s) : side(s) {}
    double area() const override { return side * side; }
};`,
    keyPoints: [
      'An abstract class cannot be instantiated directly.',
      'A derived class must override every pure virtual function to become concrete.',
      'Abstraction defines a contract; encapsulation protects the data behind it.',
    ],
  },
  {
    id: 'encapsulation',
    num: 27,
    title: 'Encapsulation',
    body: [
      'Encapsulation bundles data with the methods that operate on it, and restricts direct access to that data using access specifiers, exposing a controlled interface instead.',
    ],
    code: `class BankAccount {
private:
    double balance = 0;
public:
    void deposit(double amt) {
        if (amt > 0) balance += amt;   // validated access
    }
    double getBalance() const { return balance; }
};`,
    keyPoints: [
      'private hides members from outside the class; public exposes them; protected exposes them to derived classes only.',
      'Getters/setters let you validate or change internal representation later without breaking callers.',
      'Encapsulation reduces the surface area for bugs by limiting who can touch what.',
    ],
  },
  {
    id: 'filehandling',
    num: 28,
    title: 'File Handling',
    body: [
      'The <fstream> header provides ifstream for reading files, ofstream for writing, and fstream for both. Streams close automatically when they go out of scope, thanks to RAII.',
    ],
    code: `#include <fstream>

ofstream out("data.txt");
out << "Hello, file!";
out.close();

ifstream in("data.txt");
string line;
while (getline(in, line)) cout << line << "\\n";
in.close();`,
    keyPoints: [
      'Always check if(file) or file.is_open() before reading/writing.',
      'Streams flush and close automatically when destroyed, but closing explicitly is clearer.',
      'Open in ios::binary mode for non-text data.',
    ],
  },
  {
    id: 'exceptions',
    num: 29,
    title: 'Exception Handling',
    body: [
      'Exceptions separate error-handling code from normal logic. throw raises an exception, a try block wraps code that might fail, and catch handles a specific exception type.',
    ],
    code: `#include <stdexcept>

double divide(double a, double b) {
    if (b == 0) throw std::runtime_error("division by zero");
    return a / b;
}

try {
    cout << divide(10, 0);
} catch (const std::runtime_error& e) {
    cout << "Error: " << e.what();
}`,
    keyPoints: [
      'Catch by const reference to avoid slicing derived exception types.',
      'A catch(...) block catches anything, useful as a last resort.',
      'Exceptions unwind the stack, calling destructors along the way — RAII keeps this safe.',
    ],
  },
  {
    id: 'templates',
    num: 30,
    title: 'Templates',
    body: [
      'Templates let you write a function or class once and have the compiler generate a version for whatever type you use it with — the foundation of generic programming and the STL itself.',
    ],
    code: `template <typename T>
T maxVal(T a, T b) {
    return (a > b) ? a : b;
}

maxVal(3, 7);        // T = int
maxVal(2.5, 1.1);     // T = double

template <typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};`,
    keyPoints: [
      'Templates are resolved at compile time — no runtime overhead.',
      'A template only compiles for a given type when it is actually used with that type.',
      'Class templates power containers like std::vector<T>.',
    ],
  },
  {
    id: 'stl',
    num: 31,
    title: 'STL (Standard Template Library)',
    body: [
      'The STL is a library of generic containers, iterators, and algorithms. Containers store data, iterators traverse it uniformly, and algorithms (sort, find, accumulate...) operate on any container through iterators.',
    ],
    code: `#include <vector>
#include <algorithm>

vector<int> nums = {5, 2, 8, 1};
sort(nums.begin(), nums.end());          // 1 2 5 8

for (int n : nums) cout << n << " ";

auto it = find(nums.begin(), nums.end(), 8);
if (it != nums.end()) cout << "found";`,
    keyPoints: [
      'Common containers: vector, list, deque, map, set, unordered_map, stack, queue.',
      'Algorithms work generically across containers via iterators.',
      'vector is the default choice unless you need a specific container\'s tradeoffs.',
    ],
    diagram: 'stl',
  },
  {
    id: 'smartptrs',
    num: 32,
    title: 'Smart Pointers',
    body: [
      'Smart pointers, from <memory>, wrap a raw pointer and automatically delete it when no longer needed — eliminating most manual new/delete bugs.',
    ],
    code: `#include <memory>

unique_ptr<int> u = make_unique<int>(5); // sole owner
// u2 = u; // ERROR: cannot copy a unique_ptr

shared_ptr<int> s1 = make_shared<int>(10); // shared ownership
shared_ptr<int> s2 = s1;                    // ref count = 2

weak_ptr<int> w = s1; // observes without owning`,
    keyPoints: [
      'unique_ptr: exclusive ownership, cannot be copied, only moved.',
      'shared_ptr: reference-counted shared ownership, freed when the count hits zero.',
      'weak_ptr breaks reference cycles between shared_ptrs.',
    ],
  },
  {
    id: 'lambdas',
    num: 33,
    title: 'Lambda Functions',
    body: [
      'A lambda is an anonymous, inline function, useful for short callbacks passed to STL algorithms. The [] capture list decides which surrounding variables it can access.',
    ],
    code: `auto add = [](int a, int b) { return a + b; };
cout << add(2, 3); // 5

int threshold = 5;
auto above = [threshold](int x) { return x > threshold; }; // capture by value

vector<int> nums = {1, 6, 3, 9};
count_if(nums.begin(), nums.end(), above);`,
    keyPoints: [
      '[] captures nothing, [=] captures all by value, [&] captures all by reference.',
      'Lambdas can be stored in a variable with auto or a std::function.',
      'They are heavily used as predicates for sort, find_if, count_if, and more.',
    ],
  },
  {
    id: 'namespaces',
    num: 34,
    title: 'Namespaces',
    body: [
      'A namespace groups related names to prevent collisions between identically-named identifiers from different libraries.',
    ],
    code: `namespace math {
    int square(int x) { return x * x; }
}

cout << math::square(4); // 16
using namespace math;
cout << square(5);        // 25, now unqualified`,
    keyPoints: [
      'std is the namespace holding the entire standard library.',
      'using namespace std; is convenient but risky in headers — it can cause name clashes.',
      'Nested namespaces are written namespace a::b { ... } since C++17.',
    ],
  },
  {
    id: 'preprocessor',
    num: 35,
    title: 'Preprocessor Directives',
    body: [
      'Directives run before compilation proper, on the raw text of the source file. #include inserts a file\'s contents; #define creates a macro; conditional directives include or exclude code blocks.',
    ],
    code: `#include <iostream>       // insert a header's contents
#define MAX 100             // text-substitution macro

#ifndef HEADER_H            // include guard
#define HEADER_H
// declarations here
#endif`,
    keyPoints: [
      'Macros are blind text substitution — no type checking, so prefer const/constexpr/inline functions.',
      'Include guards (or #pragma once) stop a header from being processed twice.',
      'Directives start with # and don\'t end with a semicolon.',
    ],
  },
  {
    id: 'bestpractices',
    num: 36,
    title: 'Best Practices',
    body: [
      'Idiomatic, modern C++ ("C++ Core Guidelines" style) avoids the sharp edges of the language rather than fighting them.',
    ],
    keyPoints: [
      'Prefer smart pointers and containers over raw new/delete.',
      'Mark anything that doesn\'t modify state const, including member functions.',
      'Initialize every variable at the point of declaration.',
      'Pass small types by value, large types by const reference.',
      'Follow the Rule of Zero/Five: let compiler-generated special members handle resources, or define all five if you must manage one manually.',
      'Prefer range-based for and STL algorithms over manual index loops.',
      'Compile with warnings treated seriously (-Wall -Wextra) — most bugs show up there first.',
      'Avoid using namespace std; in header files.',
    ],
  },
  {
    id: 'interview',
    num: 37,
    title: 'Common Interview Questions',
    body: [
      'A quick-fire set of questions that come up often in C++ interviews, useful as a final self-check.',
    ],
    keyPoints: [
      'What is the difference between a pointer and a reference? — A reference cannot be null or reseated; a pointer can be reassigned and can be null.',
      'What is a virtual function, and why does it matter? — It enables runtime polymorphism, letting a base pointer call the derived class\'s override.',
      'What is the difference between struct and class? — Only the default access level: public for struct, private for class.',
      'What is RAII? — Tying a resource\'s lifetime to an object\'s lifetime, so it\'s released automatically when the object is destroyed.',
      'What happens if you don\'t define a destructor? — The compiler generates a default one, which is fine unless your class manually owns a resource.',
      'What is the Rule of Three/Five? — If you define one of destructor, copy constructor, or copy assignment, you likely need all three (plus move constructor/assignment for Five).',
      'What is a memory leak? — Allocated heap memory that is never freed because the last pointer to it is lost.',
      'What is the difference between shallow copy and deep copy? — A shallow copy duplicates pointers (sharing the pointed-to data); a deep copy duplicates the underlying data too.',
      'What is function overloading vs overriding? — Overloading picks a function by signature at compile time; overriding replaces a virtual base function at runtime.',
      'What is a dangling pointer? — A pointer that still holds the address of memory that has already been freed.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Cheat sheet data                                                    */
/* ------------------------------------------------------------------ */

const cheatSheet: { group: string; rows: [string, string][] }[] = [
  {
    group: 'Type sizes (typical, 64-bit)',
    rows: [
      ['char', '1 byte'],
      ['short', '2 bytes'],
      ['int', '4 bytes'],
      ['long', '8 bytes'],
      ['float', '4 bytes'],
      ['double', '8 bytes'],
      ['bool', '1 byte'],
      ['pointer', '8 bytes'],
    ],
  },
  {
    group: 'STL container quick pick',
    rows: [
      ['vector<T>', 'dynamic array, fast random access'],
      ['deque<T>', 'fast push/pop at both ends'],
      ['list<T>', 'doubly linked list, fast insert/erase'],
      ['map<K,V>', 'sorted key-value pairs, O(log n)'],
      ['unordered_map<K,V>', 'hash map, avg O(1) lookup'],
      ['set<T>', 'sorted unique elements'],
      ['stack<T>', 'LIFO adapter'],
      ['queue<T>', 'FIFO adapter'],
      ['priority_queue<T>', 'max-heap by default'],
    ],
  },
  {
    group: 'Common syntax at a glance',
    rows: [
      ['auto x = 5;', 'compiler deduces the type'],
      ['const int x = 5;', 'immutable value'],
      ['int& r = x;', 'reference / alias'],
      ['int* p = &x;', 'pointer to x'],
      ['new T(...) / delete p;', 'heap allocate / free'],
      ['try { } catch (...) { }', 'exception handling'],
      ['[capture](args){ }', 'lambda expression'],
      ['template<typename T>', 'generic function/class'],
      ['class C : public Base {}', 'public inheritance'],
      ['virtual void f() = 0;', 'pure virtual (abstract)'],
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Inline SVG diagrams (theme-aware via currentColor / CSS vars)      */
/* ------------------------------------------------------------------ */

function MemoryDiagram() {
  const blocks = [
    { label: 'Code / Text segment', desc: 'compiled instructions', color: 'var(--accent-4)' },
    { label: 'Data / BSS segment', desc: 'global & static variables', color: 'var(--accent-3)' },
    { label: 'Heap', desc: 'grows upward — new / malloc', color: 'var(--accent-2)' },
    { label: 'Stack', desc: 'grows downward — local variables, function calls', color: 'var(--accent)' },
  ];
  return (
    <svg viewBox="0 0 640 320" className="diagram-svg" role="img" aria-label="Program memory layout">
      {blocks.map((b, i) => (
        <g key={b.label} transform={`translate(0, ${i * 76})`}>
          <rect x="40" y="8" width="320" height="60" rx="8" fill="none" stroke={b.color} strokeWidth="2" />
          <text x="56" y="34" className="diagram-label" fill="var(--text)">{b.label}</text>
          <text x="56" y="54" className="diagram-sub" fill="var(--muted)">{b.desc}</text>
        </g>
      ))}
      <line x1="400" y1="20" x2="400" y2="120" stroke="var(--accent-2)" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="412" y="75" className="diagram-sub" fill="var(--accent-2)">grows ↓</text>
      <line x1="500" y1="292" x2="500" y2="192" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="512" y="245" className="diagram-sub" fill="var(--accent)">grows ↑</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function PointerRefDiagram() {
  return (
    <svg viewBox="0 0 640 220" className="diagram-svg" role="img" aria-label="Pointer versus reference">
      <text x="20" y="26" className="diagram-title" fill="var(--text)">Pointer</text>
      <rect x="20" y="40" width="120" height="48" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="80" y="69" textAnchor="middle" className="diagram-label" fill="var(--text)">p</text>
      <rect x="220" y="40" width="120" height="48" rx="6" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <text x="280" y="69" textAnchor="middle" className="diagram-label" fill="var(--text)">x = 10</text>
      <line x1="140" y1="64" x2="215" y2="64" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arrow2)" />
      <text x="140" y="112" className="diagram-sub" fill="var(--muted)">p holds x's address · can be reassigned · can be nullptr</text>

      <text x="20" y="160" className="diagram-title" fill="var(--text)">Reference</text>
      <rect x="20" y="174" width="120" height="0" />
      <rect x="220" y="174" width="120" height="0" />
      <text x="80" y="200" textAnchor="middle" className="diagram-label" fill="var(--text)">ref</text>
      <text x="280" y="200" textAnchor="middle" className="diagram-label" fill="var(--text)">= x</text>
      <text x="140" y="150" className="diagram-sub" fill="var(--muted)"></text>
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--accent)" />
        </marker>
      </defs>
      <text x="20" y="216" className="diagram-sub" fill="var(--muted)">ref is just another name for x itself — same address, no reassignment, never null</text>
    </svg>
  );
}

function PillarsDiagram() {
  const items = [
    { title: 'Encapsulation', desc: 'bundle data + methods, hide internals', color: 'var(--accent)' },
    { title: 'Abstraction', desc: 'expose what, hide how', color: 'var(--accent-2)' },
    { title: 'Inheritance', desc: 'reuse & extend a base class', color: 'var(--accent-3)' },
    { title: 'Polymorphism', desc: 'one interface, many behaviors', color: 'var(--accent-4)' },
  ];
  return (
    <svg viewBox="0 0 640 300" className="diagram-svg" role="img" aria-label="Four pillars of object-oriented programming">
      <circle cx="320" cy="150" r="46" fill="none" stroke="var(--border)" strokeWidth="2" />
      <text x="320" y="146" textAnchor="middle" className="diagram-label" fill="var(--text)">OOP</text>
      <text x="320" y="163" textAnchor="middle" className="diagram-sub" fill="var(--muted)">4 pillars</text>
      {items.map((it, i) => {
        const angle = (Math.PI / 2) * i - Math.PI / 4;
        const cx = 320 + Math.cos(angle) * 210;
        const cy = 150 + Math.sin(angle) * 105;
        return (
          <g key={it.title}>
            <line x1="320" y1="150" x2={cx} y2={cy} stroke={it.color} strokeWidth="1.5" opacity="0.6" />
            <rect x={cx - 90} y={cy - 28} width="180" height="56" rx="8" fill="none" stroke={it.color} strokeWidth="2" />
            <text x={cx} y={cy - 6} textAnchor="middle" className="diagram-label" fill="var(--text)">{it.title}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="diagram-sub" fill="var(--muted)">{it.desc}</text>
          </g>
        );
      })}
    </svg>
  );
}

function InheritanceDiagram() {
  return (
    <svg viewBox="0 0 640 300" className="diagram-svg" role="img" aria-label="Types of inheritance">
      {/* Single */}
      <text x="30" y="24" className="diagram-title" fill="var(--text)">Single</text>
      <rect x="20" y="34" width="90" height="34" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="65" y="56" textAnchor="middle" className="diagram-sub" fill="var(--text)">Base</text>
      <line x1="65" y1="68" x2="65" y2="90" stroke="var(--accent)" strokeWidth="2" />
      <rect x="20" y="90" width="90" height="34" rx="6" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <text x="65" y="112" textAnchor="middle" className="diagram-sub" fill="var(--text)">Derived</text>

      {/* Multilevel */}
      <text x="180" y="24" className="diagram-title" fill="var(--text)">Multilevel</text>
      <rect x="170" y="34" width="90" height="30" rx="6" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <text x="215" y="54" textAnchor="middle" className="diagram-sub" fill="var(--text)">A</text>
      <line x1="215" y1="64" x2="215" y2="80" stroke="var(--accent-2)" strokeWidth="2" />
      <rect x="170" y="80" width="90" height="30" rx="6" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <text x="215" y="100" textAnchor="middle" className="diagram-sub" fill="var(--text)">B : A</text>
      <line x1="215" y1="110" x2="215" y2="126" stroke="var(--accent-2)" strokeWidth="2" />
      <rect x="170" y="126" width="90" height="30" rx="6" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <text x="215" y="146" textAnchor="middle" className="diagram-sub" fill="var(--text)">C : B</text>

      {/* Hierarchical */}
      <text x="340" y="24" className="diagram-title" fill="var(--text)">Hierarchical</text>
      <rect x="365" y="34" width="90" height="30" rx="6" fill="none" stroke="var(--accent-3)" strokeWidth="2" />
      <text x="410" y="54" textAnchor="middle" className="diagram-sub" fill="var(--text)">Base</text>
      <line x1="410" y1="64" x2="345" y2="90" stroke="var(--accent-3)" strokeWidth="2" />
      <line x1="410" y1="64" x2="475" y2="90" stroke="var(--accent-3)" strokeWidth="2" />
      <rect x="300" y="90" width="90" height="30" rx="6" fill="none" stroke="var(--accent-3)" strokeWidth="2" />
      <text x="345" y="110" textAnchor="middle" className="diagram-sub" fill="var(--text)">DerivedA</text>
      <rect x="430" y="90" width="90" height="30" rx="6" fill="none" stroke="var(--accent-3)" strokeWidth="2" />
      <text x="475" y="110" textAnchor="middle" className="diagram-sub" fill="var(--text)">DerivedB</text>

      {/* Multiple */}
      <text x="340" y="180" className="diagram-title" fill="var(--text)">Multiple</text>
      <rect x="300" y="192" width="90" height="30" rx="6" fill="none" stroke="var(--accent-4)" strokeWidth="2" />
      <text x="345" y="212" textAnchor="middle" className="diagram-sub" fill="var(--text)">Base A</text>
      <rect x="430" y="192" width="90" height="30" rx="6" fill="none" stroke="var(--accent-4)" strokeWidth="2" />
      <text x="475" y="212" textAnchor="middle" className="diagram-sub" fill="var(--text)">Base B</text>
      <line x1="345" y1="222" x2="410" y2="250" stroke="var(--accent-4)" strokeWidth="2" />
      <line x1="475" y1="222" x2="410" y2="250" stroke="var(--accent-4)" strokeWidth="2" />
      <rect x="365" y="250" width="90" height="30" rx="6" fill="none" stroke="var(--accent-4)" strokeWidth="2" />
      <text x="410" y="270" textAnchor="middle" className="diagram-sub" fill="var(--text)">Derived</text>
    </svg>
  );
}

function StlDiagram() {
  const cols = [
    { title: 'Sequence', items: ['vector', 'deque', 'list', 'array'], color: 'var(--accent)' },
    { title: 'Associative', items: ['map', 'set', 'multimap', 'multiset'], color: 'var(--accent-2)' },
    { title: 'Unordered', items: ['unordered_map', 'unordered_set'], color: 'var(--accent-3)' },
    { title: 'Adapters', items: ['stack', 'queue', 'priority_queue'], color: 'var(--accent-4)' },
  ];
  return (
    <svg viewBox="0 0 640 260" className="diagram-svg" role="img" aria-label="STL container families">
      {cols.map((col, ci) => (
        <g key={col.title} transform={`translate(${20 + ci * 160}, 10)`}>
          <text x="70" y="16" textAnchor="middle" className="diagram-title" fill={col.color}>{col.title}</text>
          {col.items.map((it, ii) => (
            <g key={it} transform={`translate(0, ${34 + ii * 44})`}>
              <rect x="0" y="0" width="140" height="34" rx="6" fill="none" stroke={col.color} strokeWidth="1.6" />
              <text x="70" y="22" textAnchor="middle" className="diagram-sub" fill="var(--text)">{it}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

const DIAGRAMS: Record<string, () => ReactElement> = {
  memory: MemoryDiagram,
  pointerRef: PointerRefDiagram,
  pillars: PillarsDiagram,
  inheritance: InheritanceDiagram,
  stl: StlDiagram,
};

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function CppPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('cpp-theme') : null;
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) window.localStorage.setItem('cpp-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const totalSections = sections.length;

  return (
    <div data-theme={theme} className="cpp-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .cpp-page {
          --bg: #ffffff;
          --surface: #f6f8fb;
          --surface-2: #eef1f6;
          --border: #e3e8ef;
          --text: #151a23;
          --muted: #5b6472;
          --accent: #2f6fed;
          --accent-2: #d9720c;
          --accent-3: #16874f;
          --accent-4: #7c5cfc;
          --code-bg: #0d1117;
          --code-text: #e6edf3;
          --code-border: #21262d;

          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .cpp-page[data-theme='dark'] {
          --bg: #0a0e14;
          --surface: #111820;
          --surface-2: #161f2b;
          --border: #232e3d;
          --text: #e6edf3;
          --muted: #8b98a8;
          --accent: #6ea3ff;
          --accent-2: #ffab5c;
          --accent-3: #52d68a;
          --accent-4: #b8a4ff;
          --code-bg: #05070a;
          --code-text: #d7e0ea;
          --code-border: #1c2531;
        }

        .cpp-page * { box-sizing: border-box; }

        .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        /* ---------- Header ---------- */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: color-mix(in srgb, var(--bg) 88%, transparent);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .logo {
          display: flex;
          align-items: baseline;
          gap: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: var(--text);
        }
        .logo span.accent { color: var(--accent); }
        .cursor-blink {
          display: inline-block;
          width: 9px;
          height: 20px;
          background: var(--accent-2);
          margin-left: 4px;
          animation: blink 1.1s steps(1) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .progress-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 5px 12px;
          display: none;
        }
        @media (min-width: 720px) { .progress-chip { display: inline-block; } }
        .theme-toggle {
          position: relative;
          width: 52px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 3px;
        }
        .theme-toggle .knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          transform: translateX(0);
        }
        .cpp-page[data-theme='dark'] .theme-toggle .knob { transform: translateX(24px); }
        .toc-toggle-btn {
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
        }
        @media (min-width: 960px) { .toc-toggle-btn { display: none; } }

        /* ---------- Layout ---------- */
        .layout {
          display: grid;
          grid-template-columns: 1fr;
          max-width: 1240px;
          margin: 0 auto;
        }
        @media (min-width: 960px) {
          .layout { grid-template-columns: 260px 1fr; gap: 32px; }
        }

        .sidebar {
          border-right: 1px solid var(--border);
          padding: 20px 12px 40px;
          position: sticky;
          top: 61px;
          height: calc(100vh - 61px);
          overflow-y: auto;
          display: none;
        }
        .sidebar.open { display: block; }
        @media (min-width: 960px) { .sidebar { display: block; } }

        .toc-heading {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--muted);
          padding: 0 12px 10px;
          font-weight: 600;
        }
        .toc-list { list-style: none; margin: 0; padding: 0; }
        .toc-list a {
          display: flex;
          gap: 10px;
          align-items: baseline;
          padding: 6px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.4;
        }
        .toc-list a:hover { background: var(--surface); color: var(--text); }
        .toc-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--accent);
          width: 22px;
          flex-shrink: 0;
        }

        main.content { padding: 32px 20px 100px; min-width: 0; }
        @media (min-width: 640px) { main.content { padding: 40px 32px 120px; } }

        .hero { margin-bottom: 48px; }
        .hero h1 {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }
        .hero p { color: var(--muted); max-width: 640px; font-size: 15.5px; line-height: 1.6; margin: 0 0 20px; }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .hero-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--muted);
          padding: 4px 10px;
          border-radius: 999px;
        }

        section.topic {
          padding: 36px 0;
          border-bottom: 1px solid var(--border);
          scroll-margin-top: 76px;
        }
        section.topic:first-of-type { padding-top: 0; }
        .topic-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
        .topic-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: var(--accent);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 3px 9px;
        }
        .topic-title { font-size: 22px; font-weight: 700; margin: 0; }
        .topic p { color: var(--text); line-height: 1.7; font-size: 15px; margin: 0 0 12px; }

        .code-window {
          margin: 16px 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--code-border);
          background: var(--code-bg);
        }
        .code-window .titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-bottom: 1px solid var(--code-border);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #febc2e; }
        .dot.green { background: #28c840; }
        .code-filename {
          margin-left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          color: #8b98a8;
        }
        .code-window pre {
          margin: 0;
          padding: 16px 18px;
          overflow-x: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.65;
          color: var(--code-text);
        }

        .keypoints {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent-3);
          border-radius: 10px;
          padding: 14px 18px;
          margin-top: 14px;
        }
        .keypoints .kp-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--accent-3);
          font-weight: 700;
          margin-bottom: 8px;
        }
        .keypoints ul { margin: 0; padding-left: 18px; }
        .keypoints li { color: var(--text); font-size: 14px; line-height: 1.6; margin-bottom: 5px; }

        .diagram-wrap {
          margin: 18px 0;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          padding: 12px;
        }
        .diagram-svg { width: 100%; height: auto; display: block; }
        .diagram-svg text { font-family: 'JetBrains Mono', monospace; }
        .diagram-label { font-size: 12px; font-weight: 600; }
        .diagram-title { font-size: 12.5px; font-weight: 700; }
        .diagram-sub { font-size: 10.5px; }

        /* ---------- Cheat sheet ---------- */
        .cheat-section { padding: 48px 0; border-bottom: 1px solid var(--border); }
        .section-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px;
          color: var(--accent-2);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .section-h2 { font-size: 26px; font-weight: 800; margin: 0 0 24px; }
        .cheat-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
        @media (min-width: 800px) { .cheat-grid { grid-template-columns: repeat(3, 1fr); } }
        .cheat-card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--surface); }
        .cheat-card h3 {
          margin: 0;
          padding: 12px 16px;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
        }
        .cheat-row { display: flex; justify-content: space-between; gap: 12px; padding: 9px 16px; border-bottom: 1px solid var(--border); font-size: 13px; }
        .cheat-row:last-child { border-bottom: none; }
        .cheat-row .k { font-family: 'JetBrains Mono', monospace; color: var(--accent); white-space: nowrap; }
        .cheat-row .v { color: var(--muted); text-align: right; }

        /* ---------- Important callout ---------- */
        .warn-banner {
          margin: 40px 0;
          border: 1px solid var(--accent-2);
          background: color-mix(in srgb, var(--accent-2) 10%, var(--surface));
          border-radius: 12px;
          padding: 18px 20px;
        }
        .warn-banner h3 { margin: 0 0 8px; font-size: 15px; color: var(--accent-2); }
        .warn-banner ul { margin: 0; padding-left: 18px; }
        .warn-banner li { font-size: 13.5px; line-height: 1.6; margin-bottom: 4px; }

        footer.site-footer {
          border-top: 1px solid var(--border);
          padding: 28px 24px;
          text-align: center;
          color: var(--muted);
          font-size: 13px;
        }
      `}</style>

      {/* ---------------- Header ---------------- */}
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="toc-toggle-btn" onClick={() => setTocOpen((v) => !v)} aria-label="Toggle table of contents">
            ☰
          </button>
          <div className="logo">
            <span>C</span><span className="accent">++</span>
            <span className="cursor-blink" aria-hidden="true" />
          </div>
        </div>
        <div className="header-right">
          <span className="progress-chip mono">{totalSections} topics</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            <span className="knob">{theme === 'light' ? '☀' : '🌙'}</span>
          </button>
        </div>
      </header>

      <div className="layout">
        {/* ---------------- Sidebar TOC ---------------- */}
        <aside className={`sidebar${tocOpen ? ' open' : ''}`}>
          <div className="toc-heading">Table of Contents</div>
          <ul className="toc-list">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setTocOpen(false)}>
                  <span className="toc-num">{String(s.num).padStart(2, '0')}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#cheatsheet" onClick={() => setTocOpen(false)}>
                <span className="toc-num">#</span>
                <span>Cheat Sheet</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* ---------------- Main content ---------------- */}
        <main className="content">
          <div className="hero">
            <h1>C++ - the complete reference</h1>
            <p>
              From your first "Hello, World!" to smart pointers, templates, and the STL - a single-page
              walkthrough of the C++ language, with diagrams, code you can actually run, and a cheat sheet
              at the end for quick lookups.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">37 topics</span>
              <span className="hero-tag">runnable snippets</span>
              <span className="hero-tag">diagrams</span>
              <span className="hero-tag">interview prep</span>
            </div>
          </div>

          {sections.map((s) => (
            <section key={s.id} id={s.id} className="topic">
              <div className="topic-head">
                <span className="topic-num mono">{String(s.num).padStart(2, '0')}</span>
                <h2 className="topic-title">{s.title}</h2>
              </div>

              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {s.diagram && DIAGRAMS[s.diagram] && (
                <div className="diagram-wrap">
                  {DIAGRAMS[s.diagram]()}
                </div>
              )}

              {s.code && (
                <div className="code-window">
                  <div className="titlebar">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                    <span className="code-filename">main.cpp</span>
                  </div>
                  <pre><code>{s.code}</code></pre>
                </div>
              )}

              {s.keyPoints && s.keyPoints.length > 0 && (
                <div className="keypoints">
                  <div className="kp-title">
                    {s.id === 'interview' ? 'Questions & short answers' : 'Key points to remember'}
                  </div>
                  <ul>
                    {s.keyPoints.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          {/* ---------------- Important things banner ---------------- */}
          <div className="warn-banner">
            <h3>⚠ Things that trip people up most often</h3>
            <ul>
              <li>Every new needs exactly one matching delete (or use smart pointers instead).</li>
              <li>= is assignment, == is comparison — mixing them up in an if is a classic bug.</li>
              <li>Array bounds are not checked — an out-of-range index is silent undefined behavior.</li>
              <li>A missing break in a switch falls through to the next case.</li>
              <li>Returning a reference or pointer to a local variable leaves it dangling once the function returns.</li>
              <li>Comparing floating-point numbers with == is unreliable — compare within a small epsilon instead.</li>
            </ul>
          </div>

          {/* ---------------- Cheat sheet ---------------- */}
          <section id="cheatsheet" className="cheat-section">
            <div className="section-eyebrow">Quick reference</div>
            <h2 className="section-h2">Cheat Sheet</h2>
            <div className="cheat-grid">
              {cheatSheet.map((card) => (
                <div key={card.group} className="cheat-card">
                  <h3>{card.group}</h3>
                  {card.rows.map(([k, v]) => (
                    <div key={k} className="cheat-row">
                      <span className="k">{k}</span>
                      <span className="v">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <footer className="site-footer">
        C++ Reference · {totalSections} topics · built for quick learning and even quicker lookups
      </footer>
    </div>
  );
}