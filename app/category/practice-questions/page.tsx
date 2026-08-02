"use client";

import { useMemo, useState } from "react";

/* ============================================================================
   CodeNFacts — Practise Questions
   A self-contained category page: subject grid -> in-page MCQ quiz engine.

   HOW TO ADD MORE QUESTIONS (to reach 40+ per subject)
   ----------------------------------------------------
   Find the subject's array inside QUESTION_BANK below and push more objects
   shaped like:
     { q: "...", options: ["A", "B", "C", "D"], answer: 2, exp: "..." }
   `answer` is the zero-based index of the correct option in `options`.
   Nothing else in the file needs to change — counts, progress bars and the
   "questions available" badges are all derived from array length.

   THEMING
   -------
   This page follows your app's existing light/dark toggle. It assumes
   Tailwind's class-based dark mode (darkMode: 'class' in tailwind.config)
   and that your header's toggle adds/removes a `dark` class on <html>.
   All colors below are written as `<light-classes> dark:<dark-classes>`.
   ========================================================================== */

type Question = {
  q: string;
  options: string[];
  answer: number; // index into options
  exp: string; // short explanation shown after answering
};

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type SubjectMeta = {
  key: string;
  name: string;
  group: string;
  blurb: string;
  difficulty: Difficulty;
  accent: string; // hex used for the subject's accent color
};

/* ---------------------------------------------------------------------- */
/* Subject metadata                                                       */
/* ---------------------------------------------------------------------- */

const SUBJECTS: SubjectMeta[] = [
  { key: "python", name: "Python", group: "Languages", blurb: "Syntax, data types, functions & core idioms.", difficulty: "Beginner", accent: "#4B8BBE" },
  { key: "java", name: "Java", group: "Languages", blurb: "OOP fundamentals, JVM internals & collections.", difficulty: "Beginner", accent: "#E76F51" },
  { key: "c", name: "C", group: "Languages", blurb: "Pointers, memory management & low-level basics.", difficulty: "Intermediate", accent: "#5C6BC0" },
  { key: "cpp", name: "C++", group: "Languages", blurb: "Classes, STL, memory model & polymorphism.", difficulty: "Intermediate", accent: "#00599C" },
  { key: "js", name: "JavaScript", group: "Web", blurb: "Closures, async, the DOM & array methods.", difficulty: "Beginner", accent: "#F0DB4F" },
  { key: "html", name: "HTML", group: "Web", blurb: "Semantic markup, forms, media & structure.", difficulty: "Beginner", accent: "#E44D26" },
  { key: "css", name: "CSS", group: "Web", blurb: "Box model, flexbox, specificity & positioning.", difficulty: "Beginner", accent: "#2965F1" },
  { key: "dsa", name: "DSA", group: "Core CS", blurb: "Complexity, trees, graphs, sorting & search.", difficulty: "Intermediate", accent: "#8E44AD" },
  { key: "os", name: "Operating System", group: "Core CS", blurb: "Processes, scheduling, memory & deadlocks.", difficulty: "Intermediate", accent: "#16A085" },
  { key: "cn", name: "Computer Networks", group: "Core CS", blurb: "OSI/TCP layers, protocols & addressing.", difficulty: "Intermediate", accent: "#2C7DA0" },
  { key: "ai", name: "AI", group: "AI & ML", blurb: "Search, agents, heuristics & game playing.", difficulty: "Intermediate", accent: "#7C3AED" },
  { key: "ml", name: "Machine Learning", group: "AI & ML", blurb: "Supervised/unsupervised learning & evaluation.", difficulty: "Intermediate", accent: "#D62828" },
  { key: "dl", name: "Deep Learning", group: "AI & ML", blurb: "Neural nets, activations, optimizers & training.", difficulty: "Advanced", accent: "#1D3557" },
  { key: "cnn", name: "CNN", group: "AI & ML", blurb: "Convolutions, pooling & vision architectures.", difficulty: "Advanced", accent: "#0077B6" },
  { key: "rnn", name: "RNN", group: "AI & ML", blurb: "Sequences, LSTM/GRU & long-term dependencies.", difficulty: "Advanced", accent: "#6A4C93" },
  { key: "nlp", name: "NLP", group: "AI & ML", blurb: "Tokenization, embeddings, transformers & more.", difficulty: "Advanced", accent: "#9D4EDD" },
  { key: "probability", name: "Probability", group: "Math & Data", blurb: "Events, distributions & Bayes' theorem.", difficulty: "Intermediate", accent: "#2A9D8F" },
  { key: "statistics", name: "Statistics", group: "Math & Data", blurb: "Central tendency, hypothesis testing & spread.", difficulty: "Intermediate", accent: "#264653" },
  { key: "numpy", name: "NumPy", group: "Math & Data", blurb: "Arrays, broadcasting, shapes & vectorized ops.", difficulty: "Beginner", accent: "#4D77CF" },
  { key: "pandas", name: "Pandas", group: "Math & Data", blurb: "DataFrames, Series, grouping & cleaning.", difficulty: "Beginner", accent: "#150458" },
  { key: "dataanalysis", name: "Data Analysis", group: "Math & Data", blurb: "EDA, visualization, wrangling & KPIs.", difficulty: "Beginner", accent: "#E9724C" },
];

const GROUPS = ["All", ...Array.from(new Set(SUBJECTS.map((s) => s.group)))];

/* ---------------------------------------------------------------------- */
/* Question bank                                                          */
/* ---------------------------------------------------------------------- */

const QUESTION_BANK: Record<string, Question[]> = {
  python: [
    { q: "What is the output of type([])?", options: ["<class 'list'>", "list", "array", "<class 'array'>"], answer: 0, exp: "Every value has a type object; an empty list's type is <class 'list'>." },
    { q: "Which keyword defines a function in Python?", options: ["function", "def", "fun", "define"], answer: 1, exp: "Functions are declared with the def keyword." },
    { q: "What does len(\"hello\") return?", options: ["4", "5", "6", "Error"], answer: 1, exp: "\"hello\" has 5 characters." },
    { q: "Which of these is immutable in Python?", options: ["list", "dict", "tuple", "set"], answer: 2, exp: "Tuples cannot be modified after creation, unlike lists, dicts, and sets." },
    { q: "Which method adds an item to the end of a list?", options: ["add()", "append()", "insert()", "push()"], answer: 1, exp: "list.append(x) adds x to the end of the list." },
    { q: "What does the `self` parameter refer to in a class method?", options: ["The class itself", "The instance calling the method", "A global variable", "Nothing, it's optional"], answer: 1, exp: "self is a reference to the current instance of the class." },
    { q: "Which operator performs floor division?", options: ["/", "//", "%", "**"], answer: 1, exp: "// divides and rounds down to the nearest integer." },
    { q: "What is a lambda function?", options: ["A named recursive function", "A small anonymous inline function", "A class constructor", "A type of loop"], answer: 1, exp: "lambda creates small anonymous functions, e.g. lambda x: x + 1." },
    { q: "What does range(5) produce when iterated?", options: ["1,2,3,4,5", "0,1,2,3,4", "0,1,2,3,4,5", "1,2,3,4"], answer: 1, exp: "range(5) yields 0 through 4, five values total." },
    { q: "Which module provides regular expression support?", options: ["regex", "re", "regexp", "pyre"], answer: 1, exp: "Python's built-in module for regex is `re`." },
    { q: "What is the output of bool([])?", options: ["True", "False", "None", "Error"], answer: 1, exp: "Empty containers are falsy in Python." },
    { q: "Which built-in data structure stores key-value pairs?", options: ["list", "tuple", "dict", "set"], answer: 2, exp: "A dictionary (dict) maps keys to values." },
    { q: "What does the `is` operator check?", options: ["Value equality", "Identity (same object in memory)", "Type equality only", "Nothing, it's invalid"], answer: 1, exp: "`is` checks whether two references point to the same object, unlike `==` which checks value equality." },
    { q: "What is the correct way to open a file for reading in Python?", options: ["open(\"f.txt\", \"r\")", "read(\"f.txt\")", "file.open(\"f.txt\")", "input(\"f.txt\")"], answer: 0, exp: "open() with mode \"r\" opens a file for reading." },
    { q: "Which of these creates a set in Python?", options: ["{1, 2, 3}", "[1, 2, 3]", "(1, 2, 3)", "<1, 2, 3>"], answer: 0, exp: "Curly braces with comma-separated values (no colons) create a set." },
    { q: "What does the `*args` syntax allow in a function definition?", options: ["Passing a variable number of positional arguments", "Passing only keyword arguments", "Making all arguments optional strings", "Nothing, it's invalid syntax"], answer: 0, exp: "*args collects extra positional arguments into a tuple." },
    { q: "What is the output of \"3\" + \"4\" in Python?", options: ["7", "34", "\"7\"", "TypeError"], answer: 1, exp: "String concatenation joins them into \"34\"." },
    { q: "Which keyword is used for exception handling?", options: ["catch", "except", "rescue", "handle"], answer: 1, exp: "Python uses try/except blocks to handle exceptions." },
    { q: "What does list slicing a[1:3] return for a = [10,20,30,40]?", options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"], answer: 1, exp: "Slicing is start-inclusive, end-exclusive: indices 1 and 2." },
    { q: "Which comprehension creates a list of squares from 0 to 4?", options: ["[x**2 for x in range(5)]", "{x**2 for x in range(5)}", "(x**2 in range(5))", "square(range(5))"], answer: 0, exp: "List comprehensions use square brackets with a for clause." },
  ],
  java: [
    { q: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: 1, exp: "A class inherits another using the `extends` keyword." },
    { q: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java Visual Machine"], answer: 0, exp: "JVM runs compiled Java bytecode on any platform." },
    { q: "What is the default value of a boolean instance variable?", options: ["true", "false", "0", "null"], answer: 1, exp: "Uninitialized boolean fields default to false." },
    { q: "Which method is the entry point of a Java application?", options: ["start()", "run()", "main()", "init()"], answer: 2, exp: "public static void main(String[] args) is where execution begins." },
    { q: "Which keyword prevents a class from being subclassed?", options: ["static", "final", "const", "sealed"], answer: 1, exp: "A `final` class cannot be extended." },
    { q: "What is the size of an int in Java?", options: ["2 bytes", "4 bytes", "8 bytes", "Platform dependent"], answer: 1, exp: "Java's int is always 32 bits (4 bytes), regardless of platform." },
    { q: "Which collection does not allow duplicate elements?", options: ["List", "Map", "Set", "ArrayList"], answer: 2, exp: "Set implementations enforce uniqueness of elements." },
    { q: "What does the `super` keyword refer to?", options: ["The current object", "The parent class", "A static method", "An interface"], answer: 1, exp: "`super` accesses the parent class's members/constructor." },
    { q: "Java programs are considered platform independent because of:", options: ["Source code compiling directly to machine code", "Bytecode running on the JVM", "No use of compilers", "Built-in operating system support"], answer: 1, exp: "Compiled bytecode runs on any JVM, making Java portable." },
    { q: "Which operator is used to create a new object?", options: ["create", "make", "new", "alloc"], answer: 2, exp: "The `new` keyword allocates and initializes an object." },
    { q: "By default, interface methods (pre-Java 8 style) are:", options: ["private and final", "public and abstract", "protected and static", "public and final"], answer: 1, exp: "Traditional interface methods are implicitly public and abstract." },
    { q: "Which of these is NOT a feature of Java?", options: ["Platform independence", "Automatic garbage collection", "Pointer arithmetic", "Multithreading"], answer: 2, exp: "Java deliberately excludes direct pointer arithmetic for safety." },
    { q: "Which keyword is used to catch an exception?", options: ["catch", "except", "handle", "trap"], answer: 0, exp: "Java uses try/catch blocks for exception handling." },
    { q: "What is method overloading?", options: ["Same method name, same parameters, different class", "Same method name, different parameter lists", "Overriding a parent method", "Calling a method recursively"], answer: 1, exp: "Overloading means multiple methods share a name but differ in parameters." },
    { q: "Which package contains the Scanner class?", options: ["java.io", "java.util", "java.lang", "java.scanner"], answer: 1, exp: "Scanner lives in java.util." },
    { q: "What is the purpose of the `static` keyword on a method?", options: ["It belongs to the class, not an instance", "It can only be called once", "It makes the method private", "It disables inheritance"], answer: 0, exp: "Static methods belong to the class itself and can be called without an object." },
    { q: "Which of these correctly declares an array of 5 integers?", options: ["int arr(5);", "int[] arr = new int[5];", "array int arr[5];", "int arr = new int(5);"], answer: 1, exp: "Java arrays are created with `new type[size]`." },
    { q: "What does the `this` keyword refer to?", options: ["The parent class", "A static context", "The current instance", "An imported package"], answer: 2, exp: "`this` refers to the current object instance." },
    { q: "Which exception is thrown when dividing an integer by zero?", options: ["NullPointerException", "ArithmeticException", "ArrayIndexOutOfBoundsException", "ClassCastException"], answer: 1, exp: "Integer division by zero throws ArithmeticException at runtime." },
    { q: "What is the parent class of all Java classes?", options: ["Main", "Object", "Class", "System"], answer: 1, exp: "Every class implicitly extends java.lang.Object." },
  ],
  c: [
    { q: "Which header file declares printf()?", options: ["stdlib.h", "stdio.h", "string.h", "conio.h"], answer: 1, exp: "printf and scanf are declared in stdio.h." },
    { q: "What is the default return type of main() if unspecified in older C?", options: ["void", "int", "char", "float"], answer: 1, exp: "main() conventionally returns an int status code." },
    { q: "Which operator retrieves the address of a variable?", options: ["*", "&", "%", "#"], answer: 1, exp: "The `&` (address-of) operator gives a variable's memory address." },
    { q: "What is the typical size of an int on a 32-bit system?", options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"], answer: 2, exp: "On most 32-bit systems, int occupies 4 bytes." },
    { q: "Which keyword declares a constant in C?", options: ["final", "const", "constant", "readonly"], answer: 1, exp: "`const` marks a variable as unmodifiable after initialization." },
    { q: "Which loop is guaranteed to execute at least once?", options: ["for", "while", "do-while", "None of these"], answer: 2, exp: "do-while checks its condition after the loop body runs." },
    { q: "What does malloc() do?", options: ["Frees memory", "Allocates dynamic memory", "Copies a string", "Compares two values"], answer: 1, exp: "malloc() allocates a block of memory on the heap." },
    { q: "Which symbol is used to declare a pointer?", options: ["&", "*", "#", "@"], answer: 1, exp: "A pointer variable is declared using `*`, e.g. int *p;" },
    { q: "What does a NULL pointer represent?", options: ["An uninitialized integer", "A pointer pointing to no valid memory location", "A pointer to the first array element", "A syntax error"], answer: 1, exp: "NULL indicates the pointer doesn't reference a valid memory address." },
    { q: "Which function releases dynamically allocated memory?", options: ["delete()", "free()", "release()", "clear()"], answer: 1, exp: "free() deallocates memory previously reserved with malloc/calloc." },
    { q: "Which of these is not a built-in data type in C?", options: ["int", "float", "string", "char"], answer: 2, exp: "C has no built-in `string` type; strings are char arrays." },
    { q: "What does the `static` keyword do to a local variable?", options: ["Deletes it after the function ends", "Makes it retain its value between function calls", "Converts it to a global variable", "Makes it constant"], answer: 1, exp: "A static local variable keeps its value across multiple calls." },
    { q: "Which operator has higher precedence: * or +?", options: ["*", "+", "Same precedence", "Depends on compiler"], answer: 0, exp: "Multiplication binds tighter than addition in standard precedence rules." },
    { q: "What is the output of printf(\"%d\", 5/2)?", options: ["2.5", "2", "3", "Error"], answer: 1, exp: "Integer division truncates the decimal, giving 2." },
    { q: "Which header declares string manipulation functions like strlen?", options: ["stdio.h", "stdlib.h", "string.h", "ctype.h"], answer: 2, exp: "string.h declares strlen, strcpy, strcmp, and similar functions." },
    { q: "What does sizeof(char) return in C?", options: ["1", "2", "4", "Depends on the value"], answer: 0, exp: "By the C standard, sizeof(char) is always 1 byte." },
    { q: "Which of these correctly declares a function pointer?", options: ["int fp();", "int (*fp)(int);", "int *fp(int);", "pointer int fp(int);"], answer: 1, exp: "int (*fp)(int) declares fp as a pointer to a function taking an int and returning int." },
    { q: "What happens if you access an array out of its bounds in C?", options: ["Compile-time error", "Automatic resizing", "Undefined behavior", "Returns NULL"], answer: 2, exp: "C performs no bounds checking, so out-of-range access is undefined behavior." },
    { q: "Which storage class gives a variable program-wide lifetime and internal linkage by default at file scope?", options: ["auto", "extern", "static", "register"], answer: 2, exp: "A static global variable is limited to the file but persists for the program's lifetime." },
    { q: "What is the correct format specifier for printing a float?", options: ["%d", "%f", "%c", "%s"], answer: 1, exp: "%f is used to print floating-point values with printf." },
  ],
  cpp: [
    { q: "Which keyword defines a class in C++?", options: ["struct", "class", "object", "type"], answer: 1, exp: "`class` is used to define a class (struct also works but defaults to public members)." },
    { q: "What does OOP stand for?", options: ["Object Oriented Programming", "Ordered Object Protocol", "Open Object Platform", "Object Output Process"], answer: 0, exp: "OOP is a paradigm built around objects encapsulating data and behavior." },
    { q: "Which operator is used to access class members via an object?", options: ["->", ".", "::", "&"], answer: 1, exp: "The dot operator accesses members of an object directly." },
    { q: "What is a constructor?", options: ["A special method called automatically on object creation", "A method that deletes objects", "A static utility function", "A type of loop"], answer: 0, exp: "Constructors initialize an object when it's created." },
    { q: "Which keyword allocates memory dynamically in C++?", options: ["malloc", "alloc", "new", "create"], answer: 2, exp: "`new` allocates memory on the heap and calls the constructor." },
    { q: "What is function overloading?", options: ["Multiple functions with the same name but different parameters", "Calling a function repeatedly", "Overriding a base class function", "A syntax error"], answer: 0, exp: "Overloaded functions share a name but differ in parameter types/count." },
    { q: "Which STL container stores unique elements in sorted order?", options: ["vector", "list", "set", "queue"], answer: 2, exp: "std::set maintains unique, sorted elements." },
    { q: "What is inheritance in C++?", options: ["Copying a class's private members only", "Deriving a new class from an existing class", "Combining two unrelated classes", "A memory management technique"], answer: 1, exp: "Inheritance lets a derived class reuse and extend a base class." },
    { q: "Virtual functions primarily enable:", options: ["Compile-time polymorphism", "Runtime polymorphism", "Faster compilation", "Static binding"], answer: 1, exp: "Virtual functions resolve calls at runtime based on the actual object type." },
    { q: "Which operator is used for scope resolution?", options: ["::", ".", "->", "#"], answer: 0, exp: "`::` accesses namespace or class-scoped names, e.g. ClassName::member." },
    { q: "What does the `delete` operator do?", options: ["Removes a class definition", "Frees memory allocated with new", "Deletes a header file", "Ends the program"], answer: 1, exp: "`delete` deallocates heap memory obtained via `new`." },
    { q: "What is the default access specifier for class members?", options: ["public", "protected", "private", "internal"], answer: 2, exp: "Members of a `class` (not struct) are private by default." },
    { q: "Which of these is a C++ smart pointer?", options: ["auto_ptr", "unique_ptr", "raw_ptr", "safe_ptr"], answer: 1, exp: "std::unique_ptr manages exclusive ownership of a dynamically allocated object." },
    { q: "What is a friend function?", options: ["A function that has no return type", "A non-member function granted access to a class's private members", "A method inherited from a parent class", "A function that calls itself"], answer: 1, exp: "Declaring a function `friend` lets it access private/protected members." },
    { q: "Which header is needed to use std::vector?", options: ["<array>", "<vector>", "<list>", "<stl>"], answer: 1, exp: "std::vector is declared in the <vector> header." },
    { q: "What is operator overloading?", options: ["Redefining how operators behave for user-defined types", "Using too many operators in an expression", "A compiler error", "A way to overload functions only"], answer: 0, exp: "C++ allows redefining operators like + or == for custom classes." },
    { q: "What is the purpose of a destructor?", options: ["To initialize an object", "To clean up resources when an object is destroyed", "To copy an object", "To compare two objects"], answer: 1, exp: "A destructor (~ClassName) runs automatically when an object goes out of scope or is deleted." },
    { q: "Which keyword prevents a function from modifying class members?", options: ["static", "const", "final", "volatile"], answer: 1, exp: "A `const` member function promises not to modify the object's state." },
    { q: "What is multiple inheritance?", options: ["A class inheriting from more than one base class", "Inheriting the same class twice", "A function with multiple return types", "Using multiple constructors"], answer: 0, exp: "C++ allows a class to derive from multiple base classes simultaneously." },
    { q: "Which cast is safest for converting between related class pointers with runtime checking?", options: ["static_cast", "dynamic_cast", "reinterpret_cast", "const_cast"], answer: 1, exp: "dynamic_cast performs a runtime-checked cast, mainly for polymorphic types." },
  ],
  js: [
    { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "global", "def"], answer: 1, exp: "let (and const) are block-scoped, unlike var which is function-scoped." },
    { q: "What does === check?", options: ["Value equality only", "Strict equality (value and type)", "Reference equality only", "Nothing, it's invalid"], answer: 1, exp: "=== compares both value and type without type coercion." },
    { q: "Which method converts a JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "Object.parse()"], answer: 1, exp: "JSON.parse() converts a JSON string into a native object." },
    { q: "What is a closure?", options: ["A function bundled with its lexical scope, retaining access to outer variables", "A way to close a browser tab", "A loop that never ends", "A syntax error"], answer: 0, exp: "Closures let inner functions access variables from their enclosing scope even after it returns." },
    { q: "Which array method adds an element to the end?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0, exp: "push() appends an element to the end of an array." },
    { q: "What does typeof null return?", options: ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], answer: 1, exp: "This is a long-standing JS quirk: typeof null is \"object\"." },
    { q: "What is the purpose of async/await?", options: ["To make code run faster", "To write asynchronous code in a synchronous-looking style", "To declare global variables", "To handle CSS animations"], answer: 1, exp: "async/await is syntactic sugar over Promises for readable async code." },
    { q: "Which method selects an element by its ID?", options: ["document.querySelector()", "document.getElementById()", "document.getElement()", "document.selectId()"], answer: 1, exp: "getElementById() returns the element matching the given id." },
    { q: "What is event bubbling?", options: ["Events propagate from the target element up to its ancestors", "Events fire in a random order", "An event that never triggers", "A CSS animation effect"], answer: 0, exp: "In bubbling, an event fires on the target, then propagates upward through ancestors." },
    { q: "Which array method returns a new array by transforming each element?", options: ["forEach()", "filter()", "map()", "reduce()"], answer: 2, exp: "map() applies a function to each element and returns a new array." },
    { q: "What does NaN stand for?", options: ["Not a Node", "Not a Number", "New array Notation", "Null and None"], answer: 1, exp: "NaN represents a value that is not a valid number, e.g. 0/0." },
    { q: "Which keyword declares a variable that cannot be reassigned?", options: ["let", "var", "const", "static"], answer: 2, exp: "const bindings cannot be reassigned (though object contents can still change)." },
    { q: "In a regular function, what does `this` refer to?", options: ["Always the global object", "Depends on how the function is called", "Always undefined", "The nearest arrow function"], answer: 1, exp: "`this` is determined by the call site, not where the function is defined." },
    { q: "Which array method removes the last element?", options: ["pop()", "shift()", "slice()", "splice()"], answer: 0, exp: "pop() removes and returns the last element of an array." },
    { q: "What is a Promise in JavaScript?", options: ["A guaranteed function return value", "An object representing eventual completion or failure of an async operation", "A type of loop", "A CSS property"], answer: 1, exp: "Promises represent a value that may be available now, later, or never." },
    { q: "Which operator checks if a property exists in an object?", options: ["has", "in", "exists", "contains"], answer: 1, exp: "The `in` operator checks whether a key exists in an object." },
    { q: "What does the spread operator (...) do to an array?", options: ["Deletes all elements", "Expands elements individually", "Reverses the array", "Sorts the array"], answer: 1, exp: "Spread expands iterable elements, e.g. into function args or a new array." },
    { q: "Which method converts an array to a string joined by commas?", options: ["toString()", "join()", "concat()", "Both toString() and join()"], answer: 3, exp: "Both methods can produce a comma-joined string; join() lets you customize the separator." },
    { q: "What is hoisting?", options: ["Moving declarations to the top of their scope during compilation", "A way to style HTML elements", "Deleting unused variables", "A network optimization technique"], answer: 0, exp: "JS conceptually 'hoists' var and function declarations to the top of their scope." },
    { q: "Which method is used to handle a rejected Promise?", options: [".then()", ".catch()", ".resolve()", ".finally() only"], answer: 1, exp: ".catch() attaches a handler for a Promise's rejection case." },
  ],
  html: [
    { q: "What does HTML stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "HyperTransfer Meta Language", "Hyperlink Text Management Language"], answer: 0, exp: "HTML defines the structure of web content using markup." },
    { q: "Which tag defines the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2, exp: "<h1> is the largest and most important heading level." },
    { q: "Which attribute provides alternate text for an image?", options: ["title", "alt", "src", "desc"], answer: 1, exp: "The alt attribute describes an image for accessibility and fallback." },
    { q: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<nav>"], answer: 1, exp: "<a href=\"...\"> creates a clickable hyperlink." },
    { q: "Which tag inserts a line break?", options: ["<break>", "<lb>", "<br>", "<newline>"], answer: 2, exp: "<br> forces a line break without starting a new paragraph." },
    { q: "How do you create a checkbox input?", options: ["<input type=\"checkbox\">", "<checkbox>", "<input type=\"check\">", "<box type=\"checkbox\">"], answer: 0, exp: "The input element with type=\"checkbox\" renders a checkbox." },
    { q: "Which tag defines an unordered (bulleted) list?", options: ["<ol>", "<list>", "<ul>", "<li>"], answer: 2, exp: "<ul> wraps list items (<li>) rendered with bullets." },
    { q: "Which attribute uniquely identifies an HTML element?", options: ["class", "name", "id", "key"], answer: 2, exp: "id must be unique within the page and is used for targeting via CSS/JS." },
    { q: "Which tag is used to embed JavaScript?", options: ["<js>", "<script>", "<code>", "<javascript>"], answer: 1, exp: "The <script> tag embeds or references JavaScript." },
    { q: "What is the main purpose of the <head> tag?", options: ["Displays the page's main heading", "Holds metadata not directly shown on the page", "Contains the footer", "Defines the largest text"], answer: 1, exp: "<head> holds metadata like <title>, <meta>, and linked stylesheets." },
    { q: "Which doctype declaration is used for HTML5?", options: ["<!DOCTYPE HTML5>", "<!DOCTYPE html>", "<!HTML5>", "<!DOCTYPE web>"], answer: 1, exp: "HTML5 documents simply declare <!DOCTYPE html>." },
    { q: "Which tag defines a table row?", options: ["<td>", "<tr>", "<th>", "<row>"], answer: 1, exp: "<tr> defines a row inside a table; <td>/<th> define its cells." },
    { q: "Which element is typically used for site navigation links?", options: ["<menu>", "<nav>", "<links>", "<header>"], answer: 1, exp: "<nav> is a semantic element for grouping navigation links." },
    { q: "Which attribute makes a form field mandatory?", options: ["mandatory", "required", "validate", "must"], answer: 1, exp: "The required attribute prevents form submission until the field is filled." },
    { q: "Which tag embeds a video?", options: ["<media>", "<video>", "<movie>", "<embed-video>"], answer: 1, exp: "<video> embeds video content with optional controls." },
    { q: "What does the <form> element's `action` attribute specify?", options: ["The button label", "The URL where form data is submitted", "The form's CSS style", "The input's data type"], answer: 1, exp: "action defines where the form data is sent on submission." },
    { q: "Which tag is used to define a table header cell?", options: ["<td>", "<th>", "<head>", "<tr>"], answer: 1, exp: "<th> defines a header cell, typically bold and centered by default." },
    { q: "Which HTML5 element represents self-contained content like a blog post?", options: ["<section>", "<article>", "<div>", "<aside>"], answer: 1, exp: "<article> represents independent, reusable content." },
    { q: "Which attribute specifies the character encoding of an HTML document?", options: ["<meta charset=\"...\">", "<encoding>", "<meta lang=\"...\">", "<charset-type>"], answer: 0, exp: "<meta charset=\"UTF-8\"> declares the document's character encoding." },
    { q: "Which tag is used to group related form elements with a caption?", options: ["<group>", "<fieldset> with <legend>", "<formgroup>", "<section>"], answer: 1, exp: "<fieldset> groups controls and <legend> provides its caption." },
  ],
  css: [
    { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Styled Sections", "Colorful Style Syntax"], answer: 0, exp: "CSS describes how HTML elements should be displayed, following cascade rules." },
    { q: "Which property changes text color?", options: ["font-color", "text-color", "color", "foreground"], answer: 2, exp: "The `color` property sets an element's text color." },
    { q: "Which selector targets elements with a specific class?", options: ["#classname", ".classname", "*classname", "classname"], answer: 1, exp: "A dot prefix (.classname) selects elements by class." },
    { q: "What layout model does `display: flex` enable?", options: ["Grid layout", "Flexbox layout", "Table layout", "Absolute layout"], answer: 1, exp: "Flexbox arranges children in a flexible row or column." },
    { q: "Which unit is relative to the root element's font size?", options: ["em", "px", "rem", "vh"], answer: 2, exp: "rem is always relative to the html (root) element's font-size." },
    { q: "What does box-sizing: border-box do?", options: ["Removes borders", "Includes padding and border within the element's declared width/height", "Adds a shadow", "Forces box display"], answer: 1, exp: "border-box makes width/height include padding and border, simplifying sizing." },
    { q: "Which property adds space outside an element's border?", options: ["padding", "margin", "spacing", "gap"], answer: 1, exp: "margin controls space outside the border, between elements." },
    { q: "Which property controls stacking order of overlapping elements?", options: ["order", "z-index", "layer", "stack"], answer: 1, exp: "Higher z-index values render in front of lower ones (for positioned elements)." },
    { q: "`position: absolute` positions an element relative to:", options: ["The browser window always", "Its nearest positioned ancestor", "The document's <body> only", "Nothing, it's ignored"], answer: 1, exp: "It's positioned relative to the closest ancestor with a non-static position." },
    { q: "Which pseudo-class applies styles on mouse hover?", options: [":active", ":focus", ":hover", ":visited"], answer: 2, exp: ":hover applies while the pointer is over the element." },
    { q: "Which property creates rounded corners?", options: ["corner-radius", "border-radius", "round-corner", "edge-radius"], answer: 1, exp: "border-radius rounds an element's corners." },
    { q: "What does the @media rule enable?", options: ["Importing external fonts", "Applying styles conditionally based on device/viewport", "Adding animations", "Defining custom properties"], answer: 1, exp: "@media queries apply styles only when certain conditions (like screen width) are met." },
    { q: "Which display value hides an element and removes it from layout flow?", options: ["hidden", "invisible", "none", "collapse"], answer: 2, exp: "display: none removes the element entirely from rendering and layout." },
    { q: "What determines CSS specificity ranking?", options: ["File load order only", "A combination of selector types (inline, id, class, element)", "Alphabetical order of properties", "Random assignment"], answer: 1, exp: "Specificity is calculated from selector components: inline styles > IDs > classes > elements." },
    { q: "Which property sets spacing between grid or flex items?", options: ["space", "gap", "gutter", "margin-between"], answer: 1, exp: "gap sets consistent spacing between grid/flex children." },
    { q: "Which value of `position` keeps an element fixed relative to the viewport even when scrolling?", options: ["relative", "static", "fixed", "sticky"], answer: 2, exp: "fixed positioning keeps the element anchored to the viewport regardless of scroll." },
    { q: "What does the CSS `:nth-child(2)` selector target?", options: ["Every 2nd element", "Only the 2nd child of its parent", "All elements except the 2nd", "The 2nd class defined"], answer: 1, exp: ":nth-child(2) selects the element that is the second child of its parent." },
    { q: "Which property controls the direction items are laid out in a flex container?", options: ["flex-flow", "flex-direction", "flex-order", "flex-align"], answer: 1, exp: "flex-direction sets row/column (and reverse) layout direction." },
    { q: "Which CSS feature lets you define reusable custom values?", options: ["@mixins", "CSS custom properties (variables)", "@include", "Style functions"], answer: 1, exp: "Custom properties like --main-color: blue; can be reused via var(--main-color)." },
    { q: "Which property controls how an image is resized to fit its container?", options: ["object-fit", "image-size", "background-size only", "resize"], answer: 0, exp: "object-fit (e.g. cover, contain) controls how replaced content like <img> fits its box." },
  ],
  dsa: [
    { q: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1, exp: "Binary search halves the search space each step, giving O(log n)." },
    { q: "Which data structure follows FIFO order?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1, exp: "A queue processes elements First-In, First-Out." },
    { q: "Which data structure follows LIFO order?", options: ["Queue", "Stack", "Linked List", "Heap"], answer: 1, exp: "A stack processes elements Last-In, First-Out." },
    { q: "What is quicksort's best/average case time complexity?", options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"], answer: 2, exp: "With good pivot choices, quicksort averages O(n log n)." },
    { q: "Which tree traversal visits the root before its children?", options: ["Inorder", "Postorder", "Preorder", "Level-order"], answer: 2, exp: "Preorder visits root, then left subtree, then right subtree." },
    { q: "What is the time complexity of accessing an array element by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: 2, exp: "Arrays support direct indexed access in constant time." },
    { q: "Which data structure underlies function call recursion?", options: ["Queue", "Stack (the call stack)", "Heap", "Hash table"], answer: 1, exp: "Each function call is pushed onto the call stack and popped on return." },
    { q: "What defines a balanced binary tree?", options: ["All nodes have exactly 2 children", "Height difference between left and right subtrees is at most 1 at every node", "It has no leaf nodes", "It's always a complete tree"], answer: 1, exp: "Balance keeps operations efficient by bounding height difference." },
    { q: "Which sorting algorithm has O(n) time in the best case (nearly sorted input)?", options: ["Selection sort", "Insertion sort", "Heap sort", "Merge sort"], answer: 1, exp: "Insertion sort runs in O(n) when the array is already nearly sorted." },
    { q: "Which data structure is best suited to implement a priority queue?", options: ["Array", "Linked list", "Heap", "Stack"], answer: 2, exp: "A heap gives O(log n) insertion and O(1) access to the min/max element." },
    { q: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answer: 2, exp: "Merge sort requires additional O(n) space for merging." },
    { q: "Which algorithm finds the shortest path in a graph with non-negative weights?", options: ["DFS", "Dijkstra's algorithm", "Bubble sort", "Kruskal's algorithm"], answer: 1, exp: "Dijkstra's algorithm computes shortest paths from a source with non-negative edge weights." },
    { q: "What is a hash collision?", options: ["When a hash function fails to run", "When two different keys map to the same hash bucket/index", "When a hash table runs out of memory", "When keys are sorted incorrectly"], answer: 1, exp: "Collisions occur when distinct keys hash to the same slot, requiring resolution strategies." },
    { q: "Which traversal of a binary search tree produces sorted output?", options: ["Preorder", "Postorder", "Inorder", "Level-order"], answer: 2, exp: "Inorder traversal (left, root, right) yields elements in ascending order for a BST." },
    { q: "What is the time complexity of inserting at the head of a linked list?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: 2, exp: "Inserting at the head only requires updating a pointer, so it's constant time." },
    { q: "Which algorithm is used to detect a cycle in a graph using DFS?", options: ["Tracking visited and recursion-stack nodes", "Sorting all edges first", "Using a priority queue", "Random sampling"], answer: 0, exp: "Cycle detection via DFS tracks nodes in the current recursion path to spot back edges." },
    { q: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], answer: 2, exp: "Poor pivot choices (e.g. already sorted input with a naive pivot) degrade quicksort to O(n^2)." },
    { q: "Which data structure would you use to check for balanced parentheses in an expression?", options: ["Queue", "Stack", "Heap", "Hash map"], answer: 1, exp: "A stack naturally tracks the most recent unmatched opening bracket." },
    { q: "What is memoization?", options: ["Storing results of expensive calls to reuse later", "A sorting technique", "A type of tree rotation", "A way to compress data"], answer: 0, exp: "Memoization caches computed results, a core technique in dynamic programming." },
    { q: "What is the time complexity of searching in a balanced binary search tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1, exp: "A balanced BST keeps height at O(log n), bounding search time similarly." },
  ],
  os: [
    { q: "What is the primary role of an operating system?", options: ["Compile source code", "Manage hardware and software resources", "Design user interfaces only", "Write application logic"], answer: 1, exp: "The OS mediates access to CPU, memory, storage, and I/O for all programs." },
    { q: "What is a process?", options: ["A program stored on disk", "A program in execution", "A hardware component", "A type of file system"], answer: 1, exp: "A process is an active instance of a program with its own memory and state." },
    { q: "How does a thread differ from a process?", options: ["Threads are heavier weight than processes", "Threads share the process's memory space and are lighter weight", "Threads cannot run concurrently", "There is no difference"], answer: 1, exp: "Threads within a process share resources like memory, making context switches cheaper." },
    { q: "What is a deadlock?", options: ["A crash caused by a missing file", "A situation where processes wait indefinitely for resources held by each other", "A very slow disk read", "An error in compiling code"], answer: 1, exp: "Deadlock arises from circular resource dependencies with no progress possible." },
    { q: "Which scheduling algorithm selects the process with the smallest execution time next?", options: ["Round Robin", "First Come First Served", "Shortest Job First", "Priority Scheduling"], answer: 2, exp: "SJF picks the process estimated to need the least CPU time." },
    { q: "What is virtual memory?", options: ["Extra physical RAM installed on a motherboard", "A technique giving processes the illusion of more memory using disk space", "A type of cache memory", "Memory used only by the OS kernel"], answer: 1, exp: "Virtual memory extends usable memory by paging data to and from disk." },
    { q: "What is a page fault?", options: ["A syntax error in code", "An event when a program accesses a page not currently in physical memory", "A hardware failure", "A permission error"], answer: 1, exp: "The OS must fetch the needed page from disk into RAM when a page fault occurs." },
    { q: "What is context switching?", options: ["Switching between two files", "Saving and restoring process state so the CPU can switch between processes", "Changing a variable's type at runtime", "Rebooting the OS"], answer: 1, exp: "Context switches let the CPU share time among multiple processes/threads." },
    { q: "What is a semaphore used for?", options: ["Displaying error messages", "Synchronizing access to shared resources between processes", "Compiling code faster", "Managing file names"], answer: 1, exp: "Semaphores are counters used to control concurrent access to shared resources." },
    { q: "What is thrashing?", options: ["Excessive paging that severely degrades system performance", "A CPU overheating issue", "A network congestion issue", "A type of malware"], answer: 0, exp: "Thrashing happens when the system spends more time swapping pages than executing." },
    { q: "Which memory management technique divides memory into fixed-size blocks?", options: ["Segmentation", "Paging", "Compaction", "Fragmentation"], answer: 1, exp: "Paging splits memory into fixed-size pages/frames to reduce external fragmentation." },
    { q: "What is a critical section?", options: ["The first instruction of a program", "A code segment accessing shared resources that must not run concurrently by multiple processes", "The OS kernel's boot code", "A section of the hard disk"], answer: 1, exp: "Critical sections require mutual exclusion to avoid race conditions." },
    { q: "What is the purpose of a file system?", options: ["Manage network packets", "Organize, store, and retrieve files on storage devices", "Schedule CPU processes", "Manage RAM allocation only"], answer: 1, exp: "File systems structure how data is stored and accessed on disks." },
    { q: "What is multiprogramming?", options: ["Running only one program at a time", "Keeping multiple programs in memory to maximize CPU utilization", "Writing programs in multiple languages", "A debugging technique"], answer: 1, exp: "Multiprogramming keeps the CPU busy by switching among several loaded programs." },
    { q: "What is the role of a device driver?", options: ["Compile device-specific code", "Allow the OS to communicate with hardware devices", "Manage user accounts", "Encrypt files"], answer: 1, exp: "Drivers translate OS/software requests into hardware-specific commands." },
    { q: "Which of the four necessary conditions for deadlock involves processes holding resources while waiting for others?", options: ["Mutual exclusion", "Hold and wait", "No preemption", "Circular wait"], answer: 1, exp: "Hold and wait means a process holds at least one resource while requesting more." },
    { q: "What does the term 'starvation' refer to in OS scheduling?", options: ["A process running out of memory", "A process waiting indefinitely because resources keep going to other processes", "A CPU running too hot", "A disk running out of space"], answer: 1, exp: "Starvation occurs when a process is perpetually denied needed resources." },
    { q: "What is the main advantage of Round Robin scheduling?", options: ["Minimizes average waiting time always", "Provides fair CPU time-sharing with a fixed time quantum", "Guarantees shortest jobs finish first", "Eliminates context switching"], answer: 1, exp: "Round Robin cycles through processes giving each a fixed time slice, ensuring fairness." },
    { q: "What is a zombie process?", options: ["A process still consuming full CPU", "A terminated process whose exit status hasn't been read by its parent", "A process with no parent", "A process that never started"], answer: 1, exp: "A zombie has finished execution but its entry remains until the parent reads its status." },
    { q: "What is the purpose of paging table (page table)?", options: ["Store file names", "Map virtual addresses to physical memory addresses", "Store CPU registers", "Manage network routes"], answer: 1, exp: "The page table translates each process's virtual pages to physical frames." },
  ],
  cn: [
    { q: "What does OSI stand for?", options: ["Open Systems Interconnection", "Operating System Interface", "Open Standard Internet", "Online System Integration"], answer: 0, exp: "The OSI model standardizes network communication into 7 layers." },
    { q: "How many layers does the OSI model have?", options: ["4", "5", "7", "8"], answer: 2, exp: "OSI defines 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application." },
    { q: "Which OSI layer is primarily responsible for routing?", options: ["Data Link", "Network", "Transport", "Session"], answer: 1, exp: "The Network layer (Layer 3) handles logical addressing and routing." },
    { q: "What does TCP stand for?", options: ["Transfer Control Protocol", "Transmission Control Protocol", "Transport Communication Protocol", "Total Control Process"], answer: 1, exp: "TCP provides reliable, ordered, connection-oriented data delivery." },
    { q: "Which protocol is connectionless?", options: ["TCP", "FTP", "UDP", "HTTP over TCP"], answer: 2, exp: "UDP sends datagrams without establishing a connection or guaranteeing delivery." },
    { q: "What is the default port for HTTP?", options: ["21", "80", "443", "8080"], answer: 1, exp: "HTTP traffic conventionally uses port 80." },
    { q: "What is the default port for HTTPS?", options: ["80", "22", "443", "25"], answer: 2, exp: "HTTPS (HTTP over TLS) conventionally uses port 443." },
    { q: "Which device primarily operates at the Data Link layer?", options: ["Hub", "Switch", "Router", "Repeater"], answer: 1, exp: "Switches forward frames using MAC addresses at Layer 2." },
    { q: "What does DNS do?", options: ["Encrypts network traffic", "Translates domain names into IP addresses", "Assigns IP addresses dynamically", "Filters malicious traffic"], answer: 1, exp: "DNS resolves human-readable names like example.com into IP addresses." },
    { q: "What does IP stand for?", options: ["Internet Protocol", "Internal Process", "Interconnect Path", "Internet Provider"], answer: 0, exp: "IP handles addressing and routing of packets across networks." },
    { q: "Which topology connects all devices to one central hub?", options: ["Bus", "Ring", "Star", "Mesh"], answer: 2, exp: "In a star topology, every node connects to a central device." },
    { q: "What is the main purpose of a firewall?", options: ["Speed up internet connections", "Filter and monitor network traffic for security", "Assign domain names", "Compress data packets"], answer: 1, exp: "Firewalls enforce rules to allow or block traffic based on security policy." },
    { q: "Which protocol is used for sending email?", options: ["FTP", "SMTP", "HTTP", "SNMP"], answer: 1, exp: "SMTP (Simple Mail Transfer Protocol) is used to send email between servers." },
    { q: "What is the maximum decimal value of a single IPv4 octet?", options: ["99", "128", "255", "256"], answer: 2, exp: "Each IPv4 octet is 8 bits, giving a max value of 255." },
    { q: "What does DHCP do?", options: ["Encrypts web traffic", "Dynamically assigns IP addresses to devices on a network", "Resolves domain names", "Routes packets between autonomous systems"], answer: 1, exp: "DHCP automatically leases IP configuration to devices joining a network." },
    { q: "Which transport layer protocol establishes a reliable connection before data transfer?", options: ["UDP", "TCP", "IP", "ICMP"], answer: 1, exp: "TCP performs a three-way handshake to establish a reliable connection." },
    { q: "What does a subnet mask do?", options: ["Encrypts IP addresses", "Divides an IP address into network and host portions", "Assigns MAC addresses", "Blocks specific ports"], answer: 1, exp: "The subnet mask determines which part of an IP address identifies the network vs. the host." },
    { q: "Which protocol translates a domain name query recursively across servers?", options: ["ARP", "DNS", "ICMP", "NAT"], answer: 1, exp: "DNS resolution may involve recursive queries across root, TLD, and authoritative servers." },
    { q: "What is the purpose of NAT (Network Address Translation)?", options: ["Encrypt packets end-to-end", "Allow multiple devices to share a single public IP address", "Assign domain names to IPs", "Speed up DNS lookups"], answer: 1, exp: "NAT maps private internal addresses to a public IP for internet access." },
    { q: "Which layer of the OSI model is responsible for end-to-end communication and error recovery?", options: ["Physical", "Data Link", "Transport", "Presentation"], answer: 2, exp: "The Transport layer (e.g. TCP) manages reliable end-to-end delivery and error recovery." },
  ],
  ai: [
    { q: "What does AI stand for?", options: ["Automated Interface", "Artificial Intelligence", "Algorithmic Iteration", "Applied Informatics"], answer: 1, exp: "AI refers to systems designed to perform tasks that typically require human intelligence." },
    { q: "Which search algorithm guarantees the shortest path in an unweighted graph?", options: ["DFS", "BFS", "Greedy search", "Hill climbing"], answer: 1, exp: "Breadth-First Search explores level by level, guaranteeing shortest paths in unweighted graphs." },
    { q: "What is a heuristic function used for?", options: ["Guaranteeing an optimal solution always", "Estimating the cost from a node to the goal", "Sorting data", "Compressing search trees"], answer: 1, exp: "Heuristics guide informed search algorithms like A* toward the goal more efficiently." },
    { q: "What does the Turing Test evaluate?", options: ["A machine's processing speed", "A machine's ability to exhibit behavior indistinguishable from a human", "A machine's memory capacity", "A machine's error rate"], answer: 1, exp: "Proposed by Alan Turing, it tests whether a machine's responses can be told apart from a human's." },
    { q: "Which of these is a type of AI agent?", options: ["Reflex agent", "Compiler agent", "Cache agent", "Register agent"], answer: 0, exp: "A simple reflex agent acts based only on the current percept, without memory of history." },
    { q: "What is knowledge representation used for in AI?", options: ["Storing raw video data", "Representing facts about the world so a system can reason with them", "Compiling source code", "Rendering graphics"], answer: 1, exp: "Knowledge representation encodes facts/rules for inference and reasoning." },
    { q: "The A* search algorithm combines which two values to choose a path?", options: ["Depth and breadth", "Actual cost so far and estimated cost to goal", "Random cost and fixed cost", "Node count and edge count"], answer: 1, exp: "A* evaluates f(n) = g(n) + h(n): cost so far plus heuristic estimate to the goal." },
    { q: "What is an expert system?", options: ["A system that only stores expert contact info", "A program that mimics the decision-making ability of a human expert", "A hardware accelerator", "A type of database index"], answer: 1, exp: "Expert systems use encoded domain knowledge and inference rules to make decisions." },
    { q: "Which of these is NOT a recognized type of machine learning?", options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Static learning"], answer: 3, exp: "\"Static learning\" isn't a standard ML category; the three real types are supervised, unsupervised, and reinforcement learning." },
    { q: "The minimax algorithm is primarily used in:", options: ["Sorting algorithms", "Adversarial game-playing search", "Image compression", "Database indexing"], answer: 1, exp: "Minimax evaluates game trees assuming an opponent plays optimally against you." },
    { q: "Natural Language Understanding is a subfield of which broader area?", options: ["Computer graphics", "Artificial Intelligence", "Computer networks", "Operating systems"], answer: 1, exp: "NLU falls under AI/NLP, focused on machines comprehending human language." },
    { q: "What term describes a system's ability to improve performance from experience without explicit reprogramming?", options: ["Compilation", "Machine learning", "Virtualization", "Serialization"], answer: 1, exp: "Machine learning enables systems to learn patterns from data over time." },
    { q: "Fuzzy logic primarily deals with:", options: ["Only true/false binary values", "Degrees of truth between completely true and completely false", "Random number generation", "Encryption algorithms"], answer: 1, exp: "Fuzzy logic allows reasoning with partial truth rather than strict binary logic." },
    { q: "What is the goal of alpha-beta pruning?", options: ["Increase the depth of a game tree", "Reduce the number of nodes evaluated in minimax search", "Randomize search order", "Guarantee a draw in games"], answer: 1, exp: "Alpha-beta pruning skips branches that can't influence the final decision, saving computation." },
    { q: "Which is an example of narrow (weak) AI?", options: ["A general-purpose reasoning machine matching all human abilities", "A spam filter or voice assistant designed for a specific task", "A hypothetical superintelligent AI", "A fully self-aware robot"], answer: 1, exp: "Narrow AI performs a specific task well but lacks general intelligence." },
    { q: "What is the primary role of an agent's 'environment' in AI?", options: ["Where the agent's code is stored", "The external world the agent perceives and acts upon", "The programming language used", "The compiler used to build the agent"], answer: 1, exp: "The environment provides percepts and receives actions from the agent." },
    { q: "What is constraint satisfaction in AI used for?", options: ["Compressing files", "Finding values for variables that satisfy a set of constraints", "Rendering 3D graphics", "Sorting large datasets"], answer: 1, exp: "CSPs model problems like scheduling or Sudoku as variables bound by constraints." },
    { q: "Which search strategy expands the node that appears cheapest first based only on heuristic estimate?", options: ["Uniform cost search", "Greedy best-first search", "Breadth-first search", "Depth-limited search"], answer: 1, exp: "Greedy best-first search picks the node estimated closest to the goal, ignoring path cost so far." },
    { q: "What does 'rationality' mean for an AI agent?", options: ["Always acting randomly", "Choosing actions that maximize expected performance given available information", "Never making mistakes", "Acting exactly like a human"], answer: 1, exp: "A rational agent acts to achieve the best expected outcome given its knowledge." },
  ],
  ml: [
    { q: "Supervised learning trains models using:", options: ["Unlabeled data only", "Labeled data with known input-output pairs", "No data at all", "Random noise"], answer: 1, exp: "Supervised learning maps inputs to known correct outputs during training." },
    { q: "Which algorithm is commonly used for classification tasks?", options: ["Linear regression only", "Logistic regression / decision trees", "K-means only", "PCA only"], answer: 1, exp: "Logistic regression and decision trees are standard classification algorithms." },
    { q: "What is overfitting?", options: ["Model performs poorly on both training and test data", "Model performs well on training data but poorly on unseen data", "Model trains too quickly", "Model has too few parameters"], answer: 1, exp: "Overfitting means the model memorizes training data instead of generalizing." },
    { q: "Which metric is often preferred over accuracy for imbalanced classification datasets?", options: ["Mean Squared Error", "F1 score", "R-squared", "Standard deviation"], answer: 1, exp: "F1 score balances precision and recall, better reflecting performance on imbalanced classes." },
    { q: "What is the purpose of a train-test split?", options: ["Speed up training only", "Evaluate how well the model generalizes to unseen data", "Reduce the dataset size permanently", "Remove outliers automatically"], answer: 1, exp: "Holding out a test set lets you estimate real-world performance." },
    { q: "Which of these is an unsupervised learning algorithm?", options: ["Linear regression", "K-means clustering", "Logistic regression", "Decision tree classifier"], answer: 1, exp: "K-means groups unlabeled data into clusters based on similarity." },
    { q: "What is the purpose of regularization?", options: ["Increase model complexity", "Prevent overfitting by penalizing large weights", "Speed up data loading", "Normalize input images only"], answer: 1, exp: "Regularization (L1/L2) discourages overly complex models by penalizing large coefficients." },
    { q: "In K-Nearest Neighbors, what does 'k' represent?", options: ["Number of features", "Number of neighbors considered for prediction", "Number of classes", "Learning rate"], answer: 1, exp: "k determines how many nearest data points influence the prediction." },
    { q: "What is gradient descent used for?", options: ["Encrypting model weights", "Minimizing a loss function by iteratively adjusting parameters", "Splitting data into batches", "Visualizing decision boundaries"], answer: 1, exp: "Gradient descent updates parameters in the direction that reduces loss." },
    { q: "What is cross-validation used for?", options: ["Generating synthetic data", "Assessing model performance robustly across multiple data splits", "Speeding up inference", "Reducing feature count"], answer: 1, exp: "Cross-validation averages performance over multiple folds for a more reliable estimate." },
    { q: "Which loss function is commonly used for regression problems?", options: ["Cross-entropy", "Mean Squared Error", "Hinge loss", "Log loss"], answer: 1, exp: "MSE measures the average squared difference between predicted and actual values." },
    { q: "What does PCA stand for?", options: ["Predictive Class Analysis", "Principal Component Analysis", "Partial Correlation Algorithm", "Prime Cluster Assignment"], answer: 1, exp: "PCA is a dimensionality reduction technique using orthogonal components." },
    { q: "The bias-variance tradeoff describes:", options: ["The balance between model speed and accuracy", "The balance between underfitting (high bias) and overfitting (high variance)", "The tradeoff between CPU and GPU usage", "The choice between supervised and unsupervised learning"], answer: 1, exp: "Reducing bias often increases variance and vice versa; good models balance both." },
    { q: "Which algorithm builds an ensemble of decision trees?", options: ["K-means", "Random Forest", "Linear regression", "Naive Bayes"], answer: 1, exp: "Random Forest combines many decision trees to improve accuracy and reduce overfitting." },
    { q: "What is a confusion matrix used for?", options: ["Visualizing feature correlations", "Evaluating classification performance across predicted vs actual classes", "Reducing model size", "Encrypting predictions"], answer: 1, exp: "It breaks down true/false positives and negatives to assess a classifier." },
    { q: "What does 'feature scaling' typically accomplish?", options: ["Adds more features to the dataset", "Normalizes feature ranges so no single feature dominates due to scale", "Removes missing values", "Increases model bias"], answer: 1, exp: "Scaling (e.g. standardization) keeps features on comparable ranges for many algorithms." },
    { q: "What is the main idea behind ensemble learning?", options: ["Using a single very deep model", "Combining multiple models to improve overall performance", "Removing all but one feature", "Training only on test data"], answer: 1, exp: "Ensembles like bagging and boosting combine predictions from multiple models." },
    { q: "Which technique addresses class imbalance by generating synthetic minority samples?", options: ["PCA", "SMOTE", "Gradient boosting", "K-means"], answer: 1, exp: "SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic examples of the minority class." },
    { q: "What is the purpose of a validation set?", options: ["Final unbiased performance report", "Tuning hyperparameters during model development", "Storing raw unlabeled data", "Replacing the training set entirely"], answer: 1, exp: "A validation set helps tune hyperparameters without touching the held-out test set." },
    { q: "Which of these best describes 'underfitting'?", options: ["Model captures noise in training data", "Model is too simple to capture the underlying pattern", "Model has perfect training accuracy", "Model has too many parameters"], answer: 1, exp: "Underfitting occurs when a model is too simplistic to learn the data's structure." },
  ],
  dl: [
    { q: "What is a perceptron?", options: ["A type of database", "A single-layer neural network unit that makes binary decisions", "A deep CNN architecture", "A loss function"], answer: 1, exp: "The perceptron is the simplest neural network unit, computing a weighted sum plus threshold." },
    { q: "Which activation function outputs values strictly between 0 and 1?", options: ["ReLU", "Sigmoid", "Tanh", "Linear"], answer: 1, exp: "The sigmoid function squashes inputs into the (0,1) range." },
    { q: "What is backpropagation used for?", options: ["Initializing weights randomly", "Computing gradients to update weights based on the loss", "Splitting data into batches", "Visualizing neural activations"], answer: 1, exp: "Backprop applies the chain rule to propagate error gradients backward through the network." },
    { q: "Which activation function helps mitigate the vanishing gradient problem?", options: ["Sigmoid", "Tanh", "ReLU", "Step function"], answer: 2, exp: "ReLU's non-saturating positive region helps gradients flow better than sigmoid/tanh." },
    { q: "What is a hidden layer?", options: ["The output layer of a network", "A layer between the input and output layers that learns representations", "A layer that is never trained", "The layer that stores raw data"], answer: 1, exp: "Hidden layers transform inputs into increasingly abstract representations." },
    { q: "Which optimizer combines momentum with adaptive learning rates?", options: ["SGD", "Adam", "Plain gradient descent", "Newton's method"], answer: 1, exp: "Adam adapts learning rates per parameter while incorporating momentum-like terms." },
    { q: "What is dropout used for in neural networks?", options: ["Speeding up forward passes only", "Regularization by randomly deactivating neurons during training", "Increasing model size", "Normalizing pixel values"], answer: 1, exp: "Dropout reduces overfitting by preventing co-adaptation of neurons." },
    { q: "What is an epoch in training?", options: ["A single weight update", "One complete pass through the entire training dataset", "A type of loss function", "A hyperparameter search technique"], answer: 1, exp: "One epoch means the model has seen every training example once." },
    { q: "Which loss function is typically used for multi-class classification?", options: ["Mean Squared Error", "Categorical cross-entropy", "Hinge loss only", "Huber loss"], answer: 1, exp: "Categorical cross-entropy compares predicted class probabilities to true labels." },
    { q: "What does a fully connected (dense) layer do?", options: ["Connects only nearby neurons", "Connects every input neuron to every output neuron", "Only processes image pixels", "Skips the training process"], answer: 1, exp: "In a dense layer, each neuron receives input from all neurons in the previous layer." },
    { q: "What is the vanishing gradient problem?", options: ["Gradients grow uncontrollably large", "Gradients become too small, slowing or stopping learning in deep networks", "Loss becomes negative", "Weights become non-numeric"], answer: 1, exp: "In deep networks, repeated multiplication of small derivatives can shrink gradients toward zero." },
    { q: "Which network architecture is best suited for sequential data?", options: ["CNN", "RNN", "Autoencoder", "GAN"], answer: 1, exp: "RNNs maintain hidden state across time steps, suited for sequences." },
    { q: "What is batch normalization used for?", options: ["Reducing dataset size", "Stabilizing and accelerating training by normalizing layer inputs", "Replacing activation functions", "Encrypting model weights"], answer: 1, exp: "BatchNorm normalizes activations within a mini-batch, improving training stability." },
    { q: "What does the learning rate control?", options: ["Number of layers in the model", "The step size used when updating weights during training", "The size of the dataset", "The number of epochs"], answer: 1, exp: "A higher learning rate means larger weight updates per step." },
    { q: "Which of these is a popular deep learning framework?", options: ["React", "TensorFlow", "Django", "Bootstrap"], answer: 1, exp: "TensorFlow (along with PyTorch) is a major framework for building neural networks." },
    { q: "What is transfer learning?", options: ["Training a model from scratch every time", "Reusing a pretrained model's learned features for a new but related task", "Moving data between databases", "Compressing a trained model"], answer: 1, exp: "Transfer learning leverages knowledge from a pretrained model to speed up learning on new tasks." },
    { q: "What is the purpose of an activation function in a neural network?", options: ["Store weights", "Introduce non-linearity so the network can learn complex patterns", "Reduce the number of layers", "Load training data"], answer: 1, exp: "Without non-linear activations, stacked layers would collapse into a single linear transform." },
    { q: "What does 'weight initialization' affect?", options: ["Only the final accuracy", "How well and how fast the network converges during training", "The number of training epochs required only", "The choice of optimizer"], answer: 1, exp: "Poor initialization can cause vanishing/exploding gradients and slow convergence." },
    { q: "What is an autoencoder primarily used for?", options: ["Supervised classification only", "Learning compressed representations by reconstructing its input", "Generating random noise", "Only image classification"], answer: 1, exp: "Autoencoders learn to encode input into a compressed form and decode it back, useful for compression/denoising." },
    { q: "What is early stopping used for in training?", options: ["Starting training earlier in the day", "Halting training when validation performance stops improving, to prevent overfitting", "Reducing model size permanently", "Speeding up data loading"], answer: 1, exp: "Early stopping monitors validation loss and stops once it stops improving." },
  ],
  cnn: [
    { q: "What does CNN stand for?", options: ["Central Neural Network", "Convolutional Neural Network", "Continuous Node Network", "Cascading Neural Node"], answer: 1, exp: "CNNs use convolutional layers, particularly effective for grid-like data such as images." },
    { q: "What is the primary use case of CNNs?", options: ["Tabular data regression only", "Image processing and recognition", "Text translation only", "Database indexing"], answer: 1, exp: "CNNs excel at capturing spatial hierarchies in image data." },
    { q: "What does a convolutional layer do?", options: ["Randomly shuffles pixels", "Extracts local features by sliding filters/kernels over the input", "Removes all color channels", "Compresses the image to text"], answer: 1, exp: "Convolutional layers detect patterns like edges and textures via learnable filters." },
    { q: "What is the purpose of a pooling layer?", options: ["Increase spatial dimensions", "Reduce spatial dimensions while retaining important features", "Add more color channels", "Normalize pixel brightness"], answer: 1, exp: "Pooling (e.g. max pooling) downsamples feature maps, reducing computation and overfitting." },
    { q: "Which is a common pooling operation?", options: ["Min pooling only", "Max pooling", "Sum pooling only", "Random pooling"], answer: 1, exp: "Max pooling takes the maximum value in each window, preserving the strongest activations." },
    { q: "What does a filter/kernel do in a CNN?", options: ["Deletes unimportant pixels permanently", "Slides across the input to detect specific patterns", "Compiles the model", "Assigns class labels directly"], answer: 1, exp: "Each filter learns to detect a specific local pattern as it convolves over the input." },
    { q: "What is padding used for in CNNs?", options: ["Adding noise to training data", "Preserving spatial dimensions of the input after convolution", "Increasing the number of channels", "Reducing the number of filters"], answer: 1, exp: "Padding (e.g. zero-padding) prevents the output feature map from shrinking too much." },
    { q: "What is 'stride' in a CNN?", options: ["The number of layers in the network", "The step size the filter moves across the input", "The size of the training batch", "The number of output classes"], answer: 1, exp: "A stride of 2 moves the filter 2 pixels at a time, reducing output size." },
    { q: "Which layer is typically used at the end of a CNN for classification?", options: ["Convolutional layer", "Pooling layer", "Fully connected layer", "Input layer"], answer: 2, exp: "Fully connected layers combine extracted features to produce final class scores." },
    { q: "What is a feature map?", options: ["The raw input image", "The output produced by applying a filter to the input", "A lookup table of class names", "The model's loss curve"], answer: 1, exp: "Feature maps represent detected patterns after a convolution operation." },
    { q: "Which famous CNN architecture introduced residual (skip) connections?", options: ["AlexNet", "VGG", "ResNet", "LeNet"], answer: 2, exp: "ResNet introduced skip connections to enable training of very deep networks." },
    { q: "Why are CNNs more parameter-efficient than fully connected networks for images?", options: ["They use more layers", "Weight sharing means the same filter is reused across the whole image", "They ignore spatial structure", "They use larger images"], answer: 1, exp: "Convolutional weight sharing drastically reduces the number of parameters compared to dense layers." },
    { q: "What is the purpose of the ReLU activation in CNNs?", options: ["Reduce image size", "Introduce non-linearity so the network can learn complex patterns", "Normalize input images", "Combine multiple feature maps"], answer: 1, exp: "ReLU applies a simple non-linear transform, helping the network learn beyond linear mappings." },
    { q: "What does 'receptive field' refer to in a CNN?", options: ["The camera used to capture images", "The region of the input that influences a particular output neuron", "The size of the output layer", "The number of training epochs"], answer: 1, exp: "Deeper layers have larger receptive fields, capturing broader context from the input." },
    { q: "Which task is a CNN least naturally suited for compared to an RNN?", options: ["Image classification", "Object detection", "Long sequential text generation", "Image segmentation"], answer: 2, exp: "RNNs (or transformers) are typically better suited to sequential/text generation tasks than plain CNNs." },
    { q: "What is data augmentation commonly used for when training CNNs?", options: ["Reducing dataset size", "Artificially expanding training data via transformations like rotation/flipping", "Removing color channels", "Speeding up inference only"], answer: 1, exp: "Augmentation improves generalization by exposing the model to varied versions of training images." },
    { q: "What does '1x1 convolution' typically accomplish in architectures like Inception?", options: ["Increase image resolution", "Reduce/adjust the number of channels while combining features", "Remove all spatial information", "Replace pooling entirely"], answer: 1, exp: "1x1 convolutions mix channel information and can reduce dimensionality cheaply." },
    { q: "What is the role of the softmax function at the output of a CNN classifier?", options: ["Extract edges from images", "Convert raw scores into a probability distribution over classes", "Perform convolution", "Downsample feature maps"], answer: 1, exp: "Softmax normalizes output logits into class probabilities summing to 1." },
    { q: "What is transfer learning commonly used for with CNNs?", options: ["Training from scratch every time", "Reusing a pretrained CNN's learned filters for a new task", "Removing pooling layers", "Increasing dataset noise"], answer: 1, exp: "Pretrained CNNs (e.g. on ImageNet) provide useful learned features for new image tasks." },
    { q: "What problem does 'overlapping pooling regions' or excessive downsampling risk?", options: ["Losing too much spatial information", "Increasing dataset size", "Reducing training time to zero", "Guaranteeing higher accuracy"], answer: 0, exp: "Aggressive pooling can discard important spatial detail needed for fine-grained tasks." },
  ],
  rnn: [
    { q: "What does RNN stand for?", options: ["Random Neural Network", "Recurrent Neural Network", "Reduced Node Network", "Regressive Neural Network"], answer: 1, exp: "RNNs process sequences by maintaining a recurring hidden state." },
    { q: "RNNs are best suited for which type of data?", options: ["Static images", "Sequential or time-series data", "Unordered tabular data", "Single isolated data points"], answer: 1, exp: "RNNs are designed to capture dependencies across sequence steps." },
    { q: "What is the main architectural feature of an RNN?", options: ["Convolutional filters", "A hidden state passed and updated across time steps", "Fixed-size input only", "No memory of previous inputs"], answer: 1, exp: "The hidden state carries information from previous time steps forward." },
    { q: "What problem do vanilla RNNs commonly suffer from over long sequences?", options: ["Overfitting only", "Vanishing gradient, making long-term dependencies hard to learn", "Too much memory usage only", "Excessive accuracy"], answer: 1, exp: "Gradients can shrink drastically over many time steps, hindering long-range learning." },
    { q: "Which RNN variant was specifically designed to address long-term dependency issues?", options: ["Simple RNN", "LSTM", "Perceptron", "CNN"], answer: 1, exp: "LSTM introduces gating mechanisms to preserve information over long sequences." },
    { q: "What does LSTM stand for?", options: ["Large Scale Training Model", "Long Short-Term Memory", "Linear Sequential Time Machine", "Layered State Transition Model"], answer: 1, exp: "LSTM units use gates to control what information is kept or discarded over time." },
    { q: "What is a GRU?", options: ["A type of convolution", "A Gated Recurrent Unit, a simplified alternative to LSTM", "A dataset format", "A loss function"], answer: 1, exp: "GRUs merge some LSTM gates for a lighter-weight recurrent unit." },
    { q: "In an LSTM, which gate decides what information to discard from the cell state?", options: ["Input gate", "Output gate", "Forget gate", "Update gate"], answer: 2, exp: "The forget gate controls how much of the previous cell state is retained." },
    { q: "RNNs are commonly used for which task?", options: ["Static image classification only", "Language modeling and text generation", "Tabular regression only", "Clustering unlabeled points"], answer: 1, exp: "RNNs model the sequential structure of language well, aiding generation and modeling tasks." },
    { q: "What is 'teacher forcing' in RNN training?", options: ["Using random noise as input", "Feeding the actual target output as the next input during training", "Disabling backpropagation", "Freezing all weights"], answer: 1, exp: "Teacher forcing speeds convergence by using ground-truth outputs as next-step inputs during training." },
    { q: "What is a bidirectional RNN?", options: ["An RNN that only processes forward", "An RNN that processes the sequence in both forward and backward directions", "An RNN with no hidden state", "An RNN used only for images"], answer: 1, exp: "Bidirectional RNNs combine past and future context for each time step." },
    { q: "Which architecture combines RNNs with attention for tasks like translation?", options: ["CNN classifier", "Seq2seq with attention", "K-means clustering", "Random forest"], answer: 1, exp: "Sequence-to-sequence models with attention weigh relevant input parts when generating output." },
    { q: "What does a sequence-to-sequence (seq2seq) model do?", options: ["Classifies single images", "Maps an input sequence to an output sequence, often of different length", "Clusters static data points", "Compresses images only"], answer: 1, exp: "Seq2seq architectures (encoder-decoder) are used for tasks like translation and summarization." },
    { q: "What is the exploding gradient problem?", options: ["Gradients shrink toward zero", "Gradients grow uncontrollably large during training, destabilizing learning", "The model runs out of memory", "Loss becomes exactly zero"], answer: 1, exp: "Exploding gradients can cause unstable updates; gradient clipping is a common fix." },
    { q: "Which application commonly uses RNN-based models?", options: ["Speech recognition", "Static image resizing", "Sorting algorithms", "File compression"], answer: 0, exp: "Speech recognition processes sequential audio signals, a natural fit for RNNs." },
    { q: "What is the purpose of the output gate in an LSTM?", options: ["Decide what to forget", "Decide what part of the cell state to output as the hidden state", "Initialize weights", "Normalize inputs"], answer: 1, exp: "The output gate controls how much of the internal cell state influences the current hidden state." },
    { q: "Why might gradient clipping be used when training RNNs?", options: ["To speed up data loading", "To prevent exploding gradients by capping their magnitude", "To increase model depth", "To remove dropout"], answer: 1, exp: "Clipping caps gradient norms to avoid destabilizing weight updates." },
    { q: "What is a key limitation of RNNs that transformers were designed to address?", options: ["Inability to process any sequences", "Difficulty parallelizing training due to sequential dependency", "Too few parameters", "Inability to use GPUs at all"], answer: 1, exp: "RNNs process steps sequentially, limiting parallelization compared to transformer architectures." },
    { q: "In text generation with RNNs, what does the model typically predict at each step?", options: ["The entire sequence at once", "The next token given previous tokens", "A random token", "The input sequence reversed"], answer: 1, exp: "RNN language models predict the next token conditioned on prior context." },
    { q: "What is the main reason LSTMs use multiple gates instead of a single hidden state update?", options: ["To increase computation randomly", "To control information flow so long-term dependencies can be preserved", "To reduce the number of parameters to zero", "To eliminate the need for backpropagation"], answer: 1, exp: "Gates let LSTMs selectively remember or forget information, addressing vanishing gradients." },
  ],
  nlp: [
    { q: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Language Prediction", "Network Language Protocol", "Node Language Parser"], answer: 0, exp: "NLP focuses on enabling machines to understand and generate human language." },
    { q: "What is tokenization?", options: ["Encrypting text", "Splitting text into smaller units like words or subwords", "Translating text to another language", "Removing punctuation only"], answer: 1, exp: "Tokenization breaks raw text into tokens for further processing." },
    { q: "What is stemming?", options: ["Adding suffixes to words", "Reducing words to their root form by chopping affixes, often crudely", "Translating between languages", "Counting word frequency"], answer: 1, exp: "Stemming trims words (e.g. \"running\" -> \"run\") using heuristic rules." },
    { q: "What is lemmatization?", options: ["Same as stemming exactly", "Reducing words to their dictionary base form using linguistic context", "Splitting text into sentences", "Encrypting sensitive text"], answer: 1, exp: "Lemmatization uses vocabulary and grammar to find a word's proper base form (lemma)." },
    { q: "What is a stop word?", options: ["A word marking the end of a sentence", "A common word (like \"the\", \"is\") often filtered out in text processing", "A misspelled word", "A rare technical term"], answer: 1, exp: "Stop words carry little unique meaning and are often removed to reduce noise." },
    { q: "What is TF-IDF used for?", options: ["Translating text", "Measuring how important a word is to a document relative to a corpus", "Generating images from text", "Speech synthesis"], answer: 1, exp: "TF-IDF balances term frequency against how common a word is across all documents." },
    { q: "What does Named Entity Recognition (NER) do?", options: ["Detects grammar errors", "Identifies entities like names, places, and organizations in text", "Converts text to speech", "Compresses text files"], answer: 1, exp: "NER labels spans of text as people, locations, organizations, dates, etc." },
    { q: "What is Word2Vec used for?", options: ["Text summarization only", "Generating dense vector embeddings that capture word meaning", "Speech recognition", "Grammar correction"], answer: 1, exp: "Word2Vec learns embeddings where semantically similar words are close in vector space." },
    { q: "What is a bag-of-words model?", options: ["A model that preserves word order strictly", "Representing text as an unordered collection of word counts", "A neural translation architecture", "A speech-to-text model"], answer: 1, exp: "Bag-of-words ignores order and grammar, focusing only on word occurrence/frequency." },
    { q: "What is sentiment analysis?", options: ["Counting the number of words in a text", "Determining the emotional tone (positive/negative/neutral) of text", "Translating text to another language", "Checking grammar rules"], answer: 1, exp: "Sentiment analysis classifies text based on the attitude or emotion it expresses." },
    { q: "What are word embeddings?", options: ["Randomly assigned word IDs", "Dense vector representations of words that capture semantic relationships", "One-hot encoded sparse vectors only", "A list of stop words"], answer: 1, exp: "Embeddings place semantically related words closer together in continuous vector space." },
    { q: "What is Part-of-Speech (POS) tagging?", options: ["Translating parts of a sentence", "Labeling each word with its grammatical category (noun, verb, etc.)", "Removing punctuation", "Detecting sentence boundaries only"], answer: 1, exp: "POS tagging assigns grammatical roles to words in a sentence." },
    { q: "Which architecture introduced the widely used 'attention is all you need' concept?", options: ["CNN", "RNN", "Transformer", "Decision tree"], answer: 2, exp: "The Transformer architecture relies entirely on self-attention, without recurrence." },
    { q: "What is BERT primarily used for?", options: ["Image generation", "Contextual language understanding and embeddings", "Audio processing", "Numerical optimization"], answer: 1, exp: "BERT produces contextual word representations useful for many downstream NLP tasks." },
    { q: "What is an n-gram?", options: ["A neural network layer", "A contiguous sequence of n items (e.g. words) from text", "A type of activation function", "A translation metric"], answer: 1, exp: "N-grams capture local word sequences, e.g. bigrams are 2-word sequences." },
    { q: "What is the purpose of an attention mechanism in NLP models?", options: ["Reduce vocabulary size", "Let the model focus on relevant parts of the input when producing each output", "Remove stop words automatically", "Convert text to lowercase"], answer: 1, exp: "Attention assigns weights to input tokens based on their relevance to the current output step." },
    { q: "What is text summarization?", options: ["Translating text between languages", "Producing a shorter version of text that retains key information", "Counting characters in text", "Detecting spam"], answer: 1, exp: "Summarization condenses longer text into a concise version preserving main points." },
    { q: "What does 'corpus' refer to in NLP?", options: ["A single sentence", "A large, structured collection of text used for training/analysis", "A grammar rule set", "A type of neural network"], answer: 1, exp: "A corpus is the body of text data used to train or evaluate NLP models." },
    { q: "What is machine translation?", options: ["Converting speech to text", "Automatically translating text from one language to another", "Summarizing documents", "Detecting entities in text"], answer: 1, exp: "Machine translation systems (e.g. based on transformers) convert text between languages." },
    { q: "What is the purpose of subword tokenization (e.g. Byte-Pair Encoding)?", options: ["Remove all punctuation", "Handle rare/unseen words by splitting them into common subword units", "Translate text directly", "Detect sentence sentiment"], answer: 1, exp: "Subword tokenization balances vocabulary size and coverage of rare or novel words." },
  ],
  probability: [
    { q: "Probability values always range between:", options: ["-1 and 1", "0 and 1", "0 and 100", "1 and 10"], answer: 1, exp: "Probability is defined on a scale from 0 (impossible) to 1 (certain)." },
    { q: "What is the probability of a certain event?", options: ["0", "0.5", "1", "Undefined"], answer: 2, exp: "An event guaranteed to happen has probability 1." },
    { q: "For two mutually exclusive events A and B, P(A or B) equals:", options: ["P(A) x P(B)", "P(A) + P(B)", "P(A) - P(B)", "P(A) / P(B)"], answer: 1, exp: "Mutually exclusive events can't occur together, so their probabilities simply add." },
    { q: "What is conditional probability P(A|B)?", options: ["P(A) x P(B)", "P(A ∩ B) / P(B)", "P(A) + P(B)", "P(B) / P(A)"], answer: 1, exp: "Conditional probability measures P(A) given that B has occurred." },
    { q: "What is Bayes' theorem primarily used for?", options: ["Calculating averages", "Updating the probability of a hypothesis given new evidence", "Sorting data", "Measuring variance"], answer: 1, exp: "Bayes' theorem relates prior and posterior probabilities using observed evidence." },
    { q: "What is the probability of getting heads on a fair coin toss?", options: ["0.25", "0.5", "0.75", "1"], answer: 1, exp: "A fair coin has two equally likely outcomes, so P(heads) = 0.5." },
    { q: "What does it mean for two events to be independent?", options: ["They cannot both occur", "The occurrence of one does not affect the probability of the other", "They always occur together", "They have equal probabilities"], answer: 1, exp: "Independence means P(A|B) = P(A); knowing B gives no information about A." },
    { q: "What is expected value?", options: ["The most frequent outcome", "The weighted average of all possible outcomes", "The maximum possible outcome", "The variance of outcomes"], answer: 1, exp: "Expected value sums each outcome times its probability." },
    { q: "What is a sample space?", options: ["A subset of possible outcomes", "The set of all possible outcomes of an experiment", "The average outcome", "A single specific outcome"], answer: 1, exp: "The sample space contains every possible result of a random experiment." },
    { q: "Rolling a standard six-sided die, what is P(number > 4)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 1, exp: "Numbers greater than 4 are 5 and 6, so 2 out of 6 outcomes: 2/6 = 1/3." },
    { q: "For non-mutually exclusive events, what is the addition rule?", options: ["P(A) + P(B)", "P(A) x P(B)", "P(A) + P(B) - P(A ∩ B)", "P(A) - P(B)"], answer: 2, exp: "We subtract the overlap P(A ∩ B) to avoid double-counting." },
    { q: "What is a random variable?", options: ["A fixed constant value", "A variable whose value is the outcome of a random phenomenon", "A programming variable with no type", "A variable that never changes"], answer: 1, exp: "Random variables map outcomes of randomness to numerical values." },
    { q: "What does variance measure?", options: ["The average value", "The spread/dispersion of a random variable around its mean", "The most likely outcome", "The total number of outcomes"], answer: 1, exp: "Variance quantifies how much values deviate from the expected value." },
    { q: "What is the probability of drawing an Ace from a standard 52-card deck?", options: ["1/52", "1/13", "4/13", "1/4"], answer: 1, exp: "There are 4 aces out of 52 cards: 4/52 = 1/13." },
    { q: "Which distribution models the number of successes in a fixed number of independent trials with two outcomes?", options: ["Normal distribution", "Poisson distribution", "Binomial distribution", "Uniform distribution"], answer: 2, exp: "The Binomial distribution models discrete success/failure counts across n trials." },
    { q: "What is the complement rule in probability?", options: ["P(A) = 1 - P(not A)", "P(A) = P(not A)", "P(A) = 0", "P(A) x P(not A) = 1"], answer: 0, exp: "The probability of an event plus its complement always sums to 1." },
    { q: "What does the Poisson distribution typically model?", options: ["Continuous measurements like height", "The number of events occurring in a fixed interval of time or space", "Binary outcomes only", "Rankings of items"], answer: 1, exp: "Poisson models rare, discrete event counts, like calls received per hour." },
    { q: "In probability, what is a 'joint probability'?", options: ["The probability of exactly one event occurring", "The probability that two events occur simultaneously", "The probability of an impossible event", "The average of two probabilities"], answer: 1, exp: "Joint probability P(A ∩ B) is the likelihood both A and B happen together." },
    { q: "What is the law of total probability used for?", options: ["Calculating variance directly", "Computing the probability of an event by summing over conditional scenarios (partitions)", "Proving events are independent", "Finding the mode of a distribution"], answer: 1, exp: "It breaks down P(A) using a partition of the sample space and conditional probabilities." },
    { q: "If two dice are rolled, what is the probability of getting a sum of 7?", options: ["1/6", "1/12", "1/36", "6/36"], answer: 0, exp: "There are 6 combinations giving sum 7 out of 36 total outcomes: 6/36 = 1/6." },
  ],
  statistics: [
    { q: "What is the mean of a dataset?", options: ["The middle value", "The average of all values", "The most frequent value", "The range of values"], answer: 1, exp: "Mean is calculated by summing all values and dividing by the count." },
    { q: "What does standard deviation measure?", options: ["The average value", "The spread of data around the mean", "The most common value", "The total sample size"], answer: 1, exp: "Standard deviation quantifies how much data typically deviates from the mean." },
    { q: "What is the median of a dataset?", options: ["The average of all values", "The middle value when data is sorted", "The most frequently occurring value", "The largest value"], answer: 1, exp: "The median splits sorted data into two equal halves." },
    { q: "What is the mode of a dataset?", options: ["The average value", "The middle value", "The most frequently occurring value", "The range of values"], answer: 2, exp: "The mode is the value(s) that appear most often." },
    { q: "A normal distribution is characterized by:", options: ["A skewed, asymmetric shape", "A symmetric, bell-shaped curve", "A uniform flat shape", "Only discrete values"], answer: 1, exp: "The normal distribution is symmetric around its mean with a characteristic bell curve." },
    { q: "In hypothesis testing, what does a p-value indicate?", options: ["The probability the null hypothesis is true", "The probability of observing results this extreme (or more) if the null hypothesis is true", "The sample size needed", "The confidence level directly"], answer: 1, exp: "A small p-value suggests the observed data is unlikely under the null hypothesis." },
    { q: "What is a null hypothesis?", options: ["The hypothesis you're trying to prove is definitely true", "A default assumption of no effect or no difference", "A hypothesis that is always rejected", "A hypothesis based only on sample data"], answer: 1, exp: "The null hypothesis represents 'no effect', which testing tries to accept or reject." },
    { q: "What does correlation measure?", options: ["Causation between variables", "The strength and direction of a linear relationship between two variables", "The mean of a variable", "The variance of a single variable"], answer: 1, exp: "Correlation coefficients range from -1 to 1, showing relationship strength and direction." },
    { q: "Correlation does NOT necessarily imply:", options: ["Association", "Causation", "A numeric relationship", "A pattern in the data"], answer: 1, exp: "Two variables can correlate without one causing the other; confounders may be at play." },
    { q: "What is a Type I error?", options: ["Failing to reject a false null hypothesis", "Rejecting a true null hypothesis (false positive)", "Correctly rejecting a null hypothesis", "Having too small a sample size"], answer: 1, exp: "A Type I error mistakenly concludes an effect exists when it doesn't." },
    { q: "What is a Type II error?", options: ["Rejecting a true null hypothesis", "Failing to reject a false null hypothesis (false negative)", "Using the wrong statistical test", "Having a p-value of exactly 0"], answer: 1, exp: "A Type II error misses a real effect that actually exists." },
    { q: "What is the range of a dataset?", options: ["The average of all values", "The difference between the maximum and minimum values", "The middle value", "The standard deviation"], answer: 1, exp: "Range = max value - min value, a simple measure of spread." },
    { q: "What does a confidence interval represent?", options: ["The exact population parameter value", "A range likely to contain the true population parameter at a given confidence level", "The sample size used", "The p-value of a test"], answer: 1, exp: "E.g. a 95% CI means we'd expect the true parameter to fall in that range in 95% of repeated samples." },
    { q: "What is skewness?", options: ["A measure of central tendency", "A measure of the asymmetry of a distribution", "The count of outliers", "The variance of a sample"], answer: 1, exp: "Positive skew means a longer tail on the right; negative skew, a longer tail on the left." },
    { q: "Which measure of central tendency is most affected by outliers?", options: ["Median", "Mode", "Mean", "None, they're all equally affected"], answer: 2, exp: "Extreme values pull the mean toward them, while median/mode are more robust." },
    { q: "What does a high standard deviation indicate about a dataset?", options: ["Values are tightly clustered around the mean", "Values are spread out widely from the mean", "The dataset has no mean", "The dataset is symmetric"], answer: 1, exp: "A larger standard deviation reflects greater variability in the data." },
    { q: "What is a scatter plot commonly used to visualize?", options: ["Frequency of a single variable", "The relationship between two continuous variables", "Categorical proportions", "Time-series trends only"], answer: 1, exp: "Scatter plots reveal patterns, trends, or correlation between two variables." },
    { q: "What is statistical significance generally determined by comparing?", options: ["Sample size to population size", "The p-value to a chosen significance level (e.g. 0.05)", "The mean to the median", "The mode to the range"], answer: 1, exp: "If p-value < significance level (alpha), the result is typically considered statistically significant." },
    { q: "What does 'sampling bias' refer to?", options: ["Random variation in a sample", "A systematic error where some members of a population are more likely to be sampled than others", "A perfectly representative sample", "The standard deviation of a sample"], answer: 1, exp: "Sampling bias skews results away from the true population characteristics." },
    { q: "What is the Central Limit Theorem about?", options: ["All data is normally distributed", "The distribution of sample means approaches normal as sample size grows, regardless of the population's distribution", "Correlation always implies causation", "Standard deviation is always zero for large samples"], answer: 1, exp: "CLT justifies using normal-based inference methods even for non-normal populations, given large enough samples." },
  ],
  numpy: [
    { q: "NumPy is primarily used for:", options: ["Web development", "Numerical computing with efficient array operations", "Database management", "Building GUIs"], answer: 1, exp: "NumPy provides fast, vectorized operations on n-dimensional arrays." },
    { q: "Which function creates an array of zeros?", options: ["np.zeros()", "np.empty()", "np.null()", "np.blank()"], answer: 0, exp: "np.zeros(shape) creates an array filled with zeros of the given shape." },
    { q: "What does the `.shape` attribute return?", options: ["The data type of the array", "The dimensions (rows, columns, etc.) of the array", "The total number of elements", "The memory address of the array"], answer: 1, exp: "shape returns a tuple describing the array's dimensions." },
    { q: "Which function creates evenly spaced values within a given step interval?", options: ["np.linspace()", "np.arange()", "np.range()", "np.spacing()"], answer: 1, exp: "np.arange(start, stop, step) generates values with a fixed step size." },
    { q: "What is broadcasting in NumPy?", options: ["Sending data over a network", "A mechanism allowing operations on arrays of different but compatible shapes", "Converting arrays to lists", "Printing array contents"], answer: 1, exp: "Broadcasting lets NumPy apply operations across arrays without explicit loops, when shapes align." },
    { q: "Which method changes the shape of an array without changing its data?", options: ["resize()", "reshape()", "transform()", "flatten() only"], answer: 1, exp: "reshape() returns a view/array with new dimensions but the same underlying data." },
    { q: "What is ndarray?", options: ["A built-in Python list type", "NumPy's core n-dimensional array object", "A file format", "A visualization tool"], answer: 1, exp: "ndarray is the fundamental data structure in NumPy for storing homogeneous data." },
    { q: "Which function computes the mean of an array's elements?", options: ["np.total()", "np.mean()", "np.avg()", "np.center()"], answer: 1, exp: "np.mean() calculates the arithmetic average of array elements." },
    { q: "Which function stacks arrays vertically (row-wise)?", options: ["np.hstack()", "np.vstack()", "np.stack_v()", "np.concat_v()"], answer: 1, exp: "np.vstack() stacks arrays along a new row axis." },
    { q: "What does np.linspace(0, 10, 5) generate?", options: ["5 random numbers between 0 and 10", "5 evenly spaced numbers between 0 and 10 inclusive", "10 numbers starting from 0", "An error"], answer: 1, exp: "linspace(start, stop, num) returns `num` evenly spaced values including both endpoints." },
    { q: "Which operator performs element-wise multiplication on NumPy arrays?", options: ["@", "*", "matmul() only", "dot() only"], answer: 1, exp: "The * operator multiplies arrays element by element (not matrix multiplication)." },
    { q: "What does np.dot() typically compute for two 2D arrays?", options: ["Element-wise addition", "Matrix (dot) product", "Element-wise division", "Set intersection"], answer: 1, exp: "np.dot() performs matrix multiplication for 2D arrays." },
    { q: "Which attribute/function returns the transpose of a 2D array?", options: [".T", ".flip()", ".reverse()", ".invert()"], answer: 0, exp: "The .T attribute (or np.transpose()) swaps rows and columns." },
    { q: "Which function generates random floats uniformly distributed between 0 and 1?", options: ["np.random.randint()", "np.random.rand()", "np.random.choice()", "np.random.seed()"], answer: 1, exp: "np.random.rand() samples from a uniform distribution over [0, 1)." },
    { q: "What does np.concatenate() do?", options: ["Deletes elements from an array", "Joins two or more arrays along an existing axis", "Sorts an array", "Finds unique elements"], answer: 1, exp: "concatenate() merges arrays along a specified axis." },
    { q: "Which function returns the indices that would sort an array?", options: ["np.sort()", "np.argsort()", "np.index()", "np.order()"], answer: 1, exp: "argsort() returns the indices that would put the array in sorted order." },
    { q: "What does np.array([1,2,3]).dtype typically return for integers?", options: ["float64", "int64 (platform dependent)", "object", "str"], answer: 1, exp: "By default, NumPy infers an integer array's dtype as a native int type, commonly int64." },
    { q: "Which function finds the maximum value in an array?", options: ["np.max()", "np.top()", "np.highest()", "np.peak()"], answer: 0, exp: "np.max() (or ndarray.max()) returns the largest value." },
    { q: "What does slicing arr[::2] do to a 1D NumPy array?", options: ["Returns every element", "Returns every second element", "Reverses the array", "Returns an empty array"], answer: 1, exp: "The step value 2 selects every other element, starting from index 0." },
    { q: "Which function is used to save a NumPy array to disk in binary format?", options: ["np.save()", "np.write()", "np.export()", "np.dump()"], answer: 0, exp: "np.save() writes an array to a .npy binary file." },
  ],
  pandas: [
    { q: "Pandas is primarily used for:", options: ["3D game development", "Data manipulation and analysis", "Operating system scheduling", "Network security"], answer: 1, exp: "Pandas provides powerful data structures like DataFrame for working with tabular data." },
    { q: "What is a DataFrame?", options: ["A one-dimensional array", "A two-dimensional labeled data structure with rows and columns", "A type of plot", "A database connection object"], answer: 1, exp: "DataFrame is Pandas' primary structure, similar to a spreadsheet or SQL table." },
    { q: "Which function reads a CSV file into a DataFrame?", options: ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.import_csv()"], answer: 1, exp: "pd.read_csv() parses a CSV file into a DataFrame." },
    { q: "What does the `.head()` method do?", options: ["Returns column names only", "Displays the first few rows of the DataFrame", "Sorts the DataFrame", "Deletes the first row"], answer: 1, exp: "head() defaults to showing the first 5 rows, useful for a quick preview." },
    { q: "Which method removes rows/columns with missing values?", options: ["fillna()", "dropna()", "removena()", "clean()"], answer: 1, exp: "dropna() removes rows or columns containing NaN by default." },
    { q: "Which method fills missing values with a specified value?", options: ["dropna()", "fillna()", "replace_missing()", "impute()"], answer: 1, exp: "fillna(value) replaces NaN entries with the given value." },
    { q: "What is a Series in Pandas?", options: ["A two-dimensional table", "A one-dimensional labeled array", "A database connector", "A plotting function"], answer: 1, exp: "A Series is a single labeled column of data, the building block of a DataFrame." },
    { q: "Which method groups rows based on column values for aggregation?", options: ["sort_values()", "groupby()", "merge()", "pivot()"], answer: 1, exp: "groupby() splits data into groups for aggregate operations like sum or mean." },
    { q: "What does the `.describe()` method return?", options: ["Column names only", "Summary statistics (mean, std, min, max, etc.) for numeric columns", "The DataFrame's shape only", "A list of missing values"], answer: 1, exp: "describe() gives a quick statistical summary of numeric columns." },
    { q: "Which method merges two DataFrames similar to an SQL join?", options: ["concat()", "merge()", "append()", "join_rows()"], answer: 1, exp: "merge() combines DataFrames based on common columns/keys, like SQL joins." },
    { q: "What does `.loc[]` use for indexing?", options: ["Integer position only", "Label-based indexing", "Random access", "Column dtype"], answer: 1, exp: ".loc[] selects rows/columns by their labels (index names)." },
    { q: "What does `.iloc[]` use for indexing?", options: ["Label-based indexing", "Integer position-based indexing", "Boolean indexing only", "Hash-based indexing"], answer: 1, exp: ".iloc[] selects rows/columns by integer position, like array indexing." },
    { q: "Which method sorts a DataFrame by the values in a column?", options: ["sort_index()", "sort_values()", "order_by()", "arrange()"], answer: 1, exp: "sort_values(by='column') sorts rows based on values in the specified column." },
    { q: "What does `df.shape` return?", options: ["Column data types", "A tuple of (number of rows, number of columns)", "The DataFrame's memory usage", "The first row of data"], answer: 1, exp: "shape gives the dimensions of the DataFrame as (rows, columns)." },
    { q: "Which method removes duplicate rows from a DataFrame?", options: ["unique()", "drop_duplicates()", "distinct()", "remove_dupes()"], answer: 1, exp: "drop_duplicates() removes rows that are exact duplicates of others." },
    { q: "Which method applies a custom function to each element/column of a DataFrame?", options: ["map() only", "apply()", "transform() only", "run()"], answer: 1, exp: "apply() lets you run a custom function across rows or columns." },
    { q: "What does `pd.concat()` do?", options: ["Merges DataFrames using a key like SQL join", "Concatenates DataFrames along a particular axis (rows or columns)", "Deletes a DataFrame", "Sorts a DataFrame"], answer: 1, exp: "concat() stacks DataFrames together along an axis without needing a join key." },
    { q: "What does `df['col'].value_counts()` return?", options: ["The sum of the column", "The count of unique values in that column", "The mean of the column", "The column's data type"], answer: 1, exp: "value_counts() tallies how often each unique value appears." },
    { q: "Which attribute lists a DataFrame's column names?", options: ["df.index", "df.columns", "df.labels", "df.names"], answer: 1, exp: "df.columns returns the column labels of the DataFrame." },
    { q: "What does `df.isnull().sum()` typically compute?", options: ["Total row count", "The count of missing (NaN) values per column", "The sum of all numeric values", "The number of duplicate rows"], answer: 1, exp: "isnull() flags NaNs, and summing counts them per column." },
  ],
  dataanalysis: [
    { q: "What is data cleaning?", options: ["Deleting an entire dataset", "The process of fixing or removing incorrect, corrupted, or incomplete data", "Encrypting sensitive data", "Visualizing data trends"], answer: 1, exp: "Data cleaning improves data quality before analysis, handling errors, duplicates, and missing values." },
    { q: "What is an outlier?", options: ["The average value in a dataset", "A data point that differs significantly from other observations", "A missing value", "A duplicate record"], answer: 1, exp: "Outliers can indicate errors or genuinely rare, extreme observations." },
    { q: "What is data normalization used for?", options: ["Increasing dataset size", "Scaling numeric data to a common, comparable range", "Removing all outliers automatically", "Sorting categorical data"], answer: 1, exp: "Normalization rescales features (e.g. 0-1) so they contribute comparably to analysis or models." },
    { q: "What is exploratory data analysis (EDA)?", options: ["The final report of a project", "An initial investigation of data to discover patterns, anomalies, and relationships", "A machine learning algorithm", "A database query language"], answer: 1, exp: "EDA uses summary stats and visuals to understand a dataset before deeper analysis." },
    { q: "Which chart type is best for showing the distribution of a single numeric variable?", options: ["Pie chart", "Histogram", "Line chart only", "Scatter plot"], answer: 1, exp: "Histograms group data into bins to show its distribution shape." },
    { q: "What is a pivot table used for?", options: ["Encrypting data", "Summarizing and aggregating data by categories", "Removing missing values", "Storing raw data only"], answer: 1, exp: "Pivot tables reorganize and summarize data, often with grouping and aggregation." },
    { q: "What is data wrangling?", options: ["Randomly shuffling data", "The process of cleaning and transforming raw data into a usable format", "Encrypting data for storage", "Presenting final results only"], answer: 1, exp: "Wrangling (or munging) prepares messy raw data for analysis." },
    { q: "Which chart best shows the relationship between two continuous variables?", options: ["Bar chart", "Scatter plot", "Pie chart", "Histogram"], answer: 1, exp: "Scatter plots plot pairs of values, revealing correlation or patterns between variables." },
    { q: "What does a boxplot visualize?", options: ["Only the mean of a dataset", "The distribution of data via quartiles, median, and potential outliers", "Time-series trends only", "Categorical proportions"], answer: 1, exp: "Boxplots show the median, quartiles, whiskers, and outlier points." },
    { q: "What is data imputation?", options: ["Deleting missing rows entirely", "Filling in missing data values using estimation techniques", "Encrypting sensitive fields", "Removing duplicate columns"], answer: 1, exp: "Imputation estimates and fills gaps rather than discarding incomplete records." },
    { q: "What does ETL stand for?", options: ["Extract, Transform, Load", "Evaluate, Test, Launch", "Export, Transfer, Link", "Encode, Transmit, Log"], answer: 0, exp: "ETL describes the pipeline of pulling data, transforming it, and loading it into storage." },
    { q: "What is the purpose of feature engineering?", options: ["Deleting unnecessary features", "Creating new input variables to improve model or analysis performance", "Compressing datasets", "Visualizing raw data only"], answer: 1, exp: "Feature engineering derives useful new variables from existing raw data." },
    { q: "What is multicollinearity?", options: ["A single variable with high variance", "High correlation between two or more independent variables", "Missing data in a dataset", "A type of visualization"], answer: 1, exp: "Multicollinearity can distort coefficient estimates in regression models." },
    { q: "Which Python library is commonly used for data visualization?", options: ["NumPy", "Matplotlib", "Requests", "Flask"], answer: 1, exp: "Matplotlib (along with Seaborn/Plotly) is a standard plotting library in Python." },
    { q: "What is a KPI?", options: ["Key Programming Interface", "Key Performance Indicator", "Known Process Input", "Kernel Processing Index"], answer: 1, exp: "KPIs are measurable values used to track progress toward business objectives." },
    { q: "What does 'data granularity' refer to?", options: ["The color scheme of a chart", "The level of detail or summarization in a dataset", "The number of columns only", "The file format used"], answer: 1, exp: "Granularity describes how fine or coarse the data's detail level is (e.g. daily vs yearly)." },
    { q: "What is A/B testing commonly used for in data analysis?", options: ["Cleaning missing data", "Comparing two versions of something to see which performs better", "Encrypting user data", "Sorting large datasets"], answer: 1, exp: "A/B testing compares outcomes between two variants to make data-driven decisions." },
    { q: "What is a dashboard in the context of data analysis?", options: ["A raw data file", "A visual interface summarizing key metrics and trends at a glance", "A type of database", "A machine learning model"], answer: 1, exp: "Dashboards present curated visualizations and KPIs for quick monitoring." },
    { q: "What does 'data-driven decision making' mean?", options: ["Making decisions based on intuition only", "Basing decisions on data analysis and evidence rather than guesswork", "Avoiding data entirely", "Relying only on historical experience"], answer: 1, exp: "It emphasizes using measured evidence from data to guide choices." },
    { q: "What is the difference between structured and unstructured data?", options: ["There is no difference", "Structured data fits a defined schema (like tables); unstructured data does not (like free text or images)", "Unstructured data is always numeric", "Structured data cannot be stored in databases"], answer: 1, exp: "Structured data is organized (rows/columns); unstructured data lacks a predefined format." },
  ],
};

/* ---------------------------------------------------------------------- */
/* UI helpers                                                             */
/* ---------------------------------------------------------------------- */

function TerminalDot({ color }: { color: string }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />;
}

function DifficultyBadge({ level }: { level: Difficulty }) {
  const styles: Record<Difficulty, string> = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    Advanced: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
  };
  return (
    <span className={`rounded border px-2 py-0.5 text-[11px] font-mono tracking-wide ${styles[level]}`}>
      {level}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Quiz engine                                                            */
/* ---------------------------------------------------------------------- */

function Quiz({ subject, onExit }: { subject: SubjectMeta; onExit: () => void }) {
  const questions = QUESTION_BANK[subject.key] ?? [];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const total = questions.length;
  const answeredThis = selected !== null;

  const score = useMemo(
    () => answers.reduce((acc, a, i) => acc + (a !== null && a === questions[i]?.answer ? 1 : 0), 0),
    [answers, questions]
  );

  function choose(optIdx: number) {
    if (answeredThis) return;
    setSelected(optIdx);
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optIdx;
      return next;
    });
  }

  function next() {
    if (index + 1 < total) {
      setIndex(index + 1);
      setSelected(answers[index + 1] ?? null);
    } else {
      setFinished(true);
    }
  }

  function prev() {
    if (index > 0) {
      setIndex(index - 1);
      setSelected(answers[index - 1] ?? null);
    }
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setAnswers(Array(total).fill(null));
    setFinished(false);
  }

  if (total === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">// no questions found for this subject yet</p>
        <button onClick={onExit} className="mt-4 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Back to subjects
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const wrongList = answers
      .map((a, i) => ({ a, q: questions[i], i }))
      .filter((x) => x.a !== null && x.a !== x.q.answer);

    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 px-4 py-2.5">
          <TerminalDot color="#EF4444" />
          <TerminalDot color="#F59E0B" />
          <TerminalDot color="#10B981" />
          <span className="ml-2 font-mono text-xs text-zinc-500 dark:text-zinc-500">results.log — {subject.name}</span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Session complete</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl font-bold" style={{ color: subject.accent }}>{pct}%</span>
            <span className="text-zinc-600 dark:text-zinc-400">{score} / {total} correct</span>
          </div>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: subject.accent }} />
          </div>

          {wrongList.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                Review ({wrongList.length} missed)
              </p>
              <div className="space-y-3">
                {wrongList.map(({ q, a, i }) => (
                  <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">{q.q}</p>
                    <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">Your answer: {q.options[a as number]}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Correct: {q.options[q.answer]}</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{q.exp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={restart}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-950 transition hover:brightness-110"
              style={{ backgroundColor: subject.accent }}
            >
              Retry quiz
            </button>
            <button onClick={onExit} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              Back to subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <TerminalDot color="#EF4444" />
          <TerminalDot color="#F59E0B" />
          <TerminalDot color="#10B981" />
          <span className="ml-2 font-mono text-xs text-zinc-500">{subject.key}.quiz — question {index + 1}/{total}</span>
        </div>
        <button onClick={onExit} className="font-mono text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          exit ✕
        </button>
      </div>

      <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-900">
        <div
          className="h-full transition-all"
          style={{ width: `${((index + 1) / total) * 100}%`, backgroundColor: subject.accent }}
        />
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-xs" style={{ color: subject.accent }}>// {subject.name}</span>
        </div>
        <h3 className="text-lg font-medium leading-snug text-zinc-900 dark:text-zinc-100 sm:text-xl">{current.q}</h3>

        <div className="mt-6 grid gap-3">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.answer;
            const isChosen = i === selected;
            let stateClasses = "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/60";
            if (answeredThis) {
              if (isCorrect) stateClasses = "border-emerald-400 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40";
              else if (isChosen && !isCorrect) stateClasses = "border-rose-400 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40";
              else stateClasses = "border-zinc-200 dark:border-zinc-800 opacity-50";
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answeredThis}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm text-zinc-800 dark:text-zinc-200 transition ${stateClasses}`}
              >
                <span className="mt-0.5 font-mono text-xs text-zinc-500">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answeredThis && (
          <div className="mt-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-mono text-xs uppercase tracking-wide text-zinc-500">Why — </span>
            {current.exp}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={index === 0}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={next}
            disabled={!answeredThis}
            className="rounded-lg px-5 py-2 text-sm font-medium text-zinc-950 transition disabled:opacity-30 hover:brightness-110"
            style={{ backgroundColor: subject.accent }}
          >
            {index + 1 === total ? "Finish" : "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Subject card + grid                                                    */
/* ---------------------------------------------------------------------- */

function SubjectCard({ subject, count, onStart }: { subject: SubjectMeta; count: number; onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      className="group flex h-full flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 text-left transition hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold"
          style={{ backgroundColor: `${subject.accent}22`, color: subject.accent }}
        >
          {subject.name.slice(0, 2).toUpperCase()}
        </span>
        <DifficultyBadge level={subject.difficulty} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{subject.name}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">{subject.blurb}</p>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-3">
        <span className="font-mono text-xs text-zinc-500">{count} questions</span>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 transition group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
          start →
        </span>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function PractiseQuestionsPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [activeSubjectKey, setActiveSubjectKey] = useState<string | null>(null);

  const totalQuestions = useMemo(
    () => Object.values(QUESTION_BANK).reduce((sum, arr) => sum + arr.length, 0),
    []
  );

  const filtered = useMemo(() => {
    return SUBJECTS.filter((s) => {
      const matchesGroup = group === "All" || s.group === group;
      const matchesQuery =
        query.trim() === "" ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.blurb.toLowerCase().includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [query, group]);

  const activeSubject = SUBJECTS.find((s) => s.key === activeSubjectKey) ?? null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <TerminalDot color="#10B981" />
            <span>CodeNFacts</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Practise Questions
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            {SUBJECTS.length} subjects, {totalQuestions}+ MCQs. Pick a topic, answer at your own pace, and
            get an instant explanation after every question.
          </p>
        </header>

        {!activeSubject && (
          <>
            {/* Controls */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500 dark:text-zinc-600">/</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects…"
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 py-2.5 pl-8 pr-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {GROUPS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                      group === g
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <SubjectCard
                    key={s.key}
                    subject={s}
                    count={(QUESTION_BANK[s.key] ?? []).length}
                    onStart={() => setActiveSubjectKey(s.key)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 text-center">
                <p className="font-mono text-sm text-zinc-500">// no subjects match "{query}"</p>
              </div>
            )}
          </>
        )}

        {activeSubject && (
          <Quiz subject={activeSubject} onExit={() => setActiveSubjectKey(null)} />
        )}
      </div>
    </main>
  );
}