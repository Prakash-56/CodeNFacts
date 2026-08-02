"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Sparkles,
  Terminal,
  Hash,
  ArrowRight,
  ArrowUpRight,
  ListTree,
  Check,
  Copy,
  Download,
  PartyPopper,
} from "lucide-react";

/**
 * app/category/java/page.tsx
 * ----------------------------
 * The Java learning hub for CodeNFacts. Mirrors app/category/python/page.tsx
 * structurally (sticky scroll-spy TOC + one section per topic with a
 * summary, key points, and a highlighted, compilable code example) but
 * with a Java-aware syntax highlighter and curriculum.
 *
 * Update notes:
 * - Code blocks now use explicit inline colors (instead of relying on
 *   Tailwind's `dark:` cascade) so the syntax highlighting stays legible
 *   in both light and dark mode — the block is intentionally a fixed
 *   "always-dark" terminal look, so text contrast no longer washes out
 *   when the rest of the page is in light mode.
 * - Added a "Download Java Notes" button that generates a plain-text
 *   study guide from every topic on the page and downloads it, with a
 *   toast that shows a "Downloading…" state followed by a thank-you
 *   message.
 */

// ---------------------------------------------------------------------------
// Topic data
// ---------------------------------------------------------------------------

interface JavaTopic {
  id: string;
  number: string;
  title: string;
  summary: string;
  points: string[];
  code: string;
  output?: string;
  filename?: string;
}

const topics: JavaTopic[] = [
  {
    id: "intro-syntax",
    number: "01",
    title: "Introduction & Syntax",
    summary:
      "Java is statically typed and compiled, and every executable program needs a public class whose name matches the file, plus a main method as the entry point. Curly braces define blocks, and every statement ends with a semicolon — both required, not optional whitespace like Python.",
    points: [
      "The file MyClass.java must contain a class actually named MyClass.",
      "public static void main(String[] args) is where execution starts.",
      "Comments: // for a single line, /* ... */ for a block.",
    ],
    code: `// Every Java program needs a class with a main method
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeNFacts!");

        if (true) {
            System.out.println("This runs inside the if-block");
        }
    }
}`,
    output: `Hello, CodeNFacts!
This runs inside the if-block`,
  },
  {
    id: "variables-types",
    number: "02",
    title: "Variables & Data Types",
    summary:
      "Every variable in Java has a fixed type declared up front, and that type can never change. Primitives (int, double, boolean, char) store raw values directly; String and everything else are reference types that store a pointer to an object.",
    points: [
      "Common primitives: int, long, double, float, boolean, char.",
      "String is technically an object, not a primitive, even though it's used constantly.",
      "Declaring a variable without a value (int x;) leaves it unusable until assigned.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int age = 25;              // whole numbers
        double price = 9.99;       // decimals
        String name = "Ada";       // text
        boolean isActive = true;   // true or false
        char grade = 'A';          // a single character

        System.out.println(age);
        System.out.println(price);
        System.out.println(name + " scored an " + grade);
        System.out.println(isActive);
    }
}`,
    output: `25
9.99
Ada scored an A
true`,
  },
  {
    id: "operators",
    number: "03",
    title: "Operators",
    summary:
      "Java's arithmetic operators behave differently depending on the types involved — dividing two ints truncates toward zero, so you have to explicitly cast to double if you want a fractional result. Comparison and logical operators work the same way you'd expect from most C-family languages.",
    points: [
      "int / int always produces an int; cast one side to double for real division.",
      "% is the remainder operator, not just for floats.",
      "&& and || short-circuit, just like Python's and/or.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int a = 10, b = 3;

        System.out.println(a + b);            // 13
        System.out.println(a - b);             // 7
        System.out.println(a * b);             // 30
        System.out.println(a / b);             // 3 (int division truncates)
        System.out.println(a % b);             // 1
        System.out.println((double) a / b);     // 3.3333333333333335

        System.out.println(a > b && b > 0);     // true
    }
}`,
    output: `13
7
30
3
1
3.3333333333333335
true`,
  },
  {
    id: "strings",
    number: "04",
    title: "Strings",
    summary:
      "A Java String is immutable — every method that looks like it modifies a string actually returns a brand-new one. That's why you always assign the result back (s = s.toUpperCase()) instead of expecting the original variable to change in place.",
    points: [
      "+= and + concatenate strings; mixing types auto-converts to String.",
      "Common methods: .toUpperCase(), .substring(), .replace(), .split(), .charAt().",
      "Use .equals() to compare string content — == compares object identity instead.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        String name = "codenfacts";

        System.out.println(name.toUpperCase());       // CODENFACTS
        System.out.println(name.charAt(0));             // c
        System.out.println(name.substring(0, 4));       // code
        System.out.println(name.replace("code", "learn"));

        int age = 5;
        System.out.println(name + " is " + age + " years old");

        String[] words = "java is fun".split(" ");
        System.out.println(String.join("-", words));    // java-is-fun
    }
}`,
    output: `CODENFACTS
c
code
learnnfacts
codenfacts is 5 years old
java-is-fun`,
  },
  {
    id: "arrays",
    number: "05",
    title: "Arrays",
    summary:
      "An array is a fixed-size, ordered block of values of the same type. Once created, its length can't grow or shrink — for a resizable collection, you reach for ArrayList instead (covered next).",
    points: [
      "Declared with a type and square brackets: int[] scores.",
      "arr.length is a field, not a method — no parentheses.",
      "The enhanced for-loop (for (int x : arr)) reads every element without an index.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int[] scores = {90, 85, 77};

        System.out.println(scores[0]);   // 90
        scores[1] = 88;
        System.out.println(scores.length); // 3

        for (int score : scores) {
            System.out.println(score);
        }
    }
}`,
    output: `90
3
90
88
77`,
  },
  {
    id: "arraylist",
    number: "06",
    title: "ArrayList (Collections)",
    summary:
      "ArrayList is Java's resizable, general-purpose list — part of the Collections framework. Unlike arrays, it grows automatically as you add elements, and it only works with object types, so primitives get auto-boxed (int becomes Integer).",
    points: [
      "Declared through the List interface: List<String> items = new ArrayList<>().",
      ".add(), .remove(), .get(index), and .set(index, value) are the core operations.",
      "The diamond operator <> lets Java infer the generic type on the right side.",
    ],
    code: `import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        fruits.add("apple");
        fruits.add("banana");
        fruits.add("cherry");

        fruits.set(1, "blueberry");
        System.out.println(fruits);              // [apple, blueberry, cherry]

        fruits.remove("cherry");
        System.out.println(fruits.size());         // 2
        System.out.println(fruits.contains("apple")); // true
    }
}`,
    output: `[apple, blueberry, cherry]
2
true`,
  },
  {
    id: "hashmap",
    number: "07",
    title: "HashMap",
    summary:
      "HashMap stores key-value pairs for near-instant lookup by key, the same role Python's dict plays. Regular HashMap doesn't guarantee any order — LinkedHashMap is the variant to reach for when insertion order actually matters.",
    points: [
      ".get(key) returns null if the key is missing; .getOrDefault() avoids that surprise.",
      "Iterate with .entrySet() to get both keys and values in one pass.",
      "Keys need a proper .equals()/.hashCode() pair — Strings and boxed numbers already have one.",
    ],
    code: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> ages = new LinkedHashMap<>();
        ages.put("Ada", 30);
        ages.put("Bo", 25);

        System.out.println(ages.get("Ada"));             // 30
        System.out.println(ages.getOrDefault("Cy", -1));  // -1

        for (Map.Entry<String, Integer> entry : ages.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
    output: `30
-1
Ada: 30
Bo: 25`,
  },
  {
    id: "conditionals",
    number: "08",
    title: "Conditionals",
    summary:
      "if / else if / else routes execution down different branches, evaluated top to bottom until one condition is true. The ternary operator (condition ? a : b) packs a simple if/else into a single expression when you just need to pick a value.",
    points: [
      "Conditions must evaluate to a boolean — unlike some languages, 0 and null aren't automatically falsy.",
      "switch is a common alternative to a long elif-style chain for a single variable.",
      "The ternary operator is an expression, so it can sit directly inside an assignment.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        int score = 82;
        String grade;

        if (score >= 90) {
            grade = "A";
        } else if (score >= 80) {
            grade = "B";
        } else if (score >= 70) {
            grade = "C";
        } else {
            grade = "F";
        }

        System.out.println(grade);   // B

        String label = (score % 2 == 0) ? "even" : "odd";
        System.out.println(label);    // even
    }
}`,
    output: `B
even`,
  },
  {
    id: "loops",
    number: "09",
    title: "Loops",
    summary:
      "The classic for loop gives full control over the counter, condition, and increment in one line; the enhanced for loop reads through a collection without needing an index at all. while and break/continue behave the same way they do in most languages.",
    points: [
      "for (init; condition; update) is the traditional counted loop.",
      "for (Type item : collection) is the enhanced loop for reading, not indexing.",
      "break exits the loop entirely; continue skips to the next iteration.",
    ],
    code: `public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            System.out.println("count: " + i);
        }

        String[] fruits = {"apple", "banana", "cherry"};
        for (int i = 0; i < fruits.length; i++) {
            System.out.println(i + " " + fruits[i]);
        }

        int n = 0;
        while (n < 5) {
            if (n == 3) break;
            System.out.println("n is " + n);
            n++;
        }
    }
}`,
    output: `count: 0
count: 1
count: 2
0 apple
1 banana
2 cherry
n is 0
n is 1
n is 2`,
  },
  {
    id: "methods",
    number: "10",
    title: "Methods",
    summary:
      "A method is Java's version of a function — always attached to a class, always declared with an explicit return type (or void for none). static methods belong to the class itself and can be called without creating an object first.",
    points: [
      "The return type comes right before the method name: static int total(...).",
      "Varargs (int... numbers) let a method accept any number of arguments as an array.",
      "A method declared void must not return a value.",
    ],
    code: `public class Main {
    static String greet(String name) {
        return "Hello, " + name + "!";
    }

    static int total(int... numbers) {
        int sum = 0;
        for (int n : numbers) sum += n;
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(greet("Ada"));       // Hello, Ada!
        System.out.println(total(1, 2, 3, 4));   // 10
    }
}`,
    output: `Hello, Ada!
10`,
  },
  {
    id: "classes-objects",
    number: "11",
    title: "Classes & Objects",
    summary:
      "A class defines the fields (data) and methods (behavior) that every object created from it will have. new allocates an actual object in memory and hands you back a reference to it — that reference is what a variable of the class type actually holds.",
    points: [
      "Fields declared in a class become instance variables — each object gets its own copy.",
      "this refers to the current instance inside a non-static method.",
      "A class can be as simple as data + methods, with no inheritance involved at all.",
    ],
    code: `public class Main {
    static class Dog {
        String name;
        String breed;

        Dog(String name, String breed) {
            this.name = name;
            this.breed = breed;
        }

        String bark() {
            return name + " says woof!";
        }
    }

    public static void main(String[] args) {
        Dog rex = new Dog("Rex", "Labrador");
        System.out.println(rex.bark());              // Rex says woof!
        System.out.println(rex.name + " is a " + rex.breed);
    }
}`,
    output: `Rex says woof!
Rex is a Labrador`,
  },
  {
    id: "constructors",
    number: "12",
    title: "Constructors",
    summary:
      "A constructor runs automatically when an object is created with new, and its job is to set up the object's initial state. A class can have several constructors with different parameter lists — this(...) lets one constructor delegate to another instead of repeating setup logic.",
    points: [
      "A constructor shares its name with the class and has no return type, not even void.",
      "If you write zero constructors, Java gives you a free no-argument one — but only until you write your own.",
      "@Override marks a method that's intentionally replacing a parent's version.",
    ],
    code: `public class Main {
    static class Point {
        int x, y;

        Point() {
            this(0, 0); // delegates to the constructor below
        }

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public String toString() {
            return "(" + x + ", " + y + ")";
        }
    }

    public static void main(String[] args) {
        Point origin = new Point();
        Point p = new Point(3, 4);

        System.out.println(origin);   // (0, 0)
        System.out.println(p);         // (3, 4)
    }
}`,
    output: `(0, 0)
(3, 4)`,
  },
  {
    id: "inheritance",
    number: "13",
    title: "Inheritance",
    summary:
      "extends lets one class reuse and build on another's fields and methods. The subclass can override any inherited method to change its behavior, and super(...) reaches back into the parent's constructor to initialize the parts it's responsible for.",
    points: [
      "Java only supports single inheritance for classes — one direct parent, no more.",
      "instanceof checks whether an object is (or descends from) a given type.",
      "A method call on a parent-typed variable still runs the subclass's overridden version.",
    ],
    code: `public class Main {
    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        String speak() { return name + " makes a sound"; }
    }

    static class Cat extends Animal {
        Cat(String name) { super(name); }

        @Override
        String speak() { return name + " says meow"; }
    }

    public static void main(String[] args) {
        Animal whiskers = new Cat("Whiskers");
        System.out.println(whiskers.speak());          // Whiskers says meow
        System.out.println(whiskers instanceof Animal); // true
    }
}`,
    output: `Whiskers says meow
true`,
  },
  {
    id: "interfaces-abstract",
    number: "14",
    title: "Interfaces & Abstract Classes",
    summary:
      "An interface defines a contract — a set of methods any implementing class must provide — without dictating how. It's how Java gets around single inheritance: a class can implement several interfaces even though it can only extend one class.",
    points: [
      "implements is used for interfaces, extends is used for classes.",
      "A class implementing an interface must define every method the interface declares.",
      "An abstract class can mix fully implemented methods with ones subclasses must fill in.",
    ],
    code: `public class Main {
    interface Shape {
        double area();
    }

    static class Circle implements Shape {
        double radius;
        Circle(double radius) { this.radius = radius; }

        @Override
        public double area() { return Math.PI * radius * radius; }
    }

    public static void main(String[] args) {
        Shape shape = new Circle(2);
        System.out.printf("Area: %.2f%n", shape.area()); // Area: 12.57
    }
}`,
    output: `Area: 12.57`,
  },
  {
    id: "polymorphism",
    number: "15",
    title: "Polymorphism",
    summary:
      "Polymorphism means the same method call can behave differently depending on the actual object it's called on, decided at runtime. Storing different subclasses in a single array typed as the parent class is what makes this pattern so useful — one loop, many behaviors.",
    points: [
      "This is called 'dynamic dispatch': Java looks at the object's real type, not the variable's declared type.",
      "It's the core mechanic behind writing code that works with any Shape, Animal, etc.",
      "Overloading (same name, different parameters) is a separate concept from overriding.",
    ],
    code: `public class Main {
    static class Animal {
        String speak() { return "..."; }
    }
    static class Dog extends Animal {
        @Override String speak() { return "Woof"; }
    }
    static class Cat extends Animal {
        @Override String speak() { return "Meow"; }
    }

    public static void main(String[] args) {
        Animal[] animals = { new Dog(), new Cat() };
        for (Animal a : animals) {
            System.out.println(a.speak()); // each runs its own override
        }
    }
}`,
    output: `Woof
Meow`,
  },
  {
    id: "exceptions",
    number: "16",
    title: "Exception Handling",
    summary:
      "try/catch lets a program recover from a runtime error instead of crashing. Java distinguishes checked exceptions (which a method must declare with throws) from unchecked ones like ArithmeticException, which can be thrown anywhere without warning.",
    points: [
      "catch blocks match by exception type — catch the most specific type you can handle.",
      "finally always runs, whether an exception was thrown or not — great for cleanup.",
      "throw lets you raise your own exception; throws declares one a method might pass along.",
    ],
    code: `public class Main {
    static Integer divide(int a, int b) {
        try {
            int result = a / b;
            System.out.println("Division succeeded");
            return result;
        } catch (ArithmeticException e) {
            System.out.println("Can't divide by zero!");
            return null;
        } finally {
            System.out.println("Done attempting division");
        }
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 2));
        System.out.println(divide(10, 0));
    }
}`,
    output: `Division succeeded
Done attempting division
5
Can't divide by zero!
Done attempting division
null`,
  },
  {
    id: "file-io",
    number: "17",
    title: "File I/O",
    summary:
      "Java's file APIs are more explicit than Python's — try-with-resources ensures a file handle gets closed automatically once the block finishes, even if an exception is thrown partway through. The newer java.nio.file API (Files, Paths) is usually the more convenient choice for simple reads and writes.",
    points: [
      "try (Resource r = ...) { } automatically closes r when the block ends.",
      "Most file operations declare throws IOException — Java forces you to acknowledge failure is possible.",
      "Files.readAllLines() is a quick way to pull a whole text file into a List<String>.",
    ],
    code: `import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws IOException {
        // Writing to a file
        try (FileWriter writer = new FileWriter("notes.txt")) {
            writer.write("Learning Java with CodeNFacts\\n");
            writer.write("File I/O is verbose but explicit\\n");
        }

        // Reading it back
        Files.readAllLines(Paths.get("notes.txt"))
             .forEach(System.out::println);
    }
}`,
    output: `Learning Java with CodeNFacts
File I/O is verbose but explicit`,
  },
  {
    id: "packages-imports",
    number: "18",
    title: "Packages & Imports",
    summary:
      "A package groups related classes under a namespace, mirrored by folder structure on disk, which keeps large codebases organized and avoids class name collisions. import brings a class from another package into scope so you can reference it by its short name.",
    points: [
      "The package declaration, if present, must be the very first line in the file.",
      "java.lang (String, Math, System, ...) is imported automatically — everything else needs an explicit import.",
      "A wildcard import (import com.codenfacts.utils.*) pulls in every public class in that package.",
    ],
    code: `// File 1: com/codenfacts/utils/MathHelper.java
package com.codenfacts.utils;

public class MathHelper {
    public static int square(int n) {
        return n * n;
    }
}

// File 2: Main.java, in a different package
import com.codenfacts.utils.MathHelper;

public class Main {
    public static void main(String[] args) {
        System.out.println(MathHelper.square(6)); // 36
    }
}`,
    output: `36`,
    filename: "PackageExample.java",
  },
  {
    id: "generics",
    number: "19",
    title: "Generics",
    summary:
      "Generics let a class or method work with any type while still catching type mismatches at compile time, instead of at runtime like raw Object-based code would. Box<String> and Box<Integer> share one implementation but are checked as distinct, type-safe versions of it.",
    points: [
      "The type parameter (commonly T) acts as a placeholder filled in when the class is used.",
      "Generics only work with reference types — use Integer instead of int, for example.",
      "A generic method declares its own type parameter before the return type: static <T> T method(...).",
    ],
    code: `public class Main {
    static class Box<T> {
        private T content;

        void put(T item) { this.content = item; }
        T get() { return content; }
    }

    static <T> T firstElement(T[] items) {
        return items[0];
    }

    public static void main(String[] args) {
        Box<String> box = new Box<>();
        box.put("hello");
        System.out.println(box.get());           // hello

        Integer[] nums = {1, 2, 3};
        System.out.println(firstElement(nums));   // 1
    }
}`,
    output: `hello
1`,
  },
  {
    id: "streams-lambdas",
    number: "20",
    title: "Streams & Lambda Expressions",
    summary:
      "A lambda (n -> n * n) is a compact, unnamed function, most often passed straight into a Stream operation. Streams let you chain filter, map, and collect operations to transform a collection declaratively, instead of writing a manual loop with a mutable accumulator.",
    points: [
      "A stream doesn't run anything until a terminal operation (like .collect() or .sum()) is called.",
      "Method references (Integer::intValue) are shorthand for a lambda that just calls one method.",
      "Streams don't modify the original collection — they produce a new result.",
    ],
    code: `import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

        List<Integer> evenSquares = nums.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());

        System.out.println(evenSquares);   // [4, 16, 36]

        int total = nums.stream().mapToInt(Integer::intValue).sum();
        System.out.println(total);          // 21
    }
}`,
    output: `[4, 16, 36]
21`,
  },
];

// ---------------------------------------------------------------------------
// Lightweight Java syntax highlighting (no external deps)
//
// Colors are applied as inline `style` values rather than Tailwind
// `text-*` classes. The code block is intentionally a fixed "terminal"
// surface (always a dark slate background, in both light and dark page
// mode), so its text colors must NOT depend on Tailwind's `dark:`
// variant or on cascading text-color utilities from an ancestor — either
// of which can silently wash out contrast in light mode. Inline styles
// guarantee the same, readable colors regardless of page theme.
// ---------------------------------------------------------------------------

const JAVA_KEYWORDS =
  "public|private|protected|static|final|void|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|import|package|this|super|null|true|false|int|long|double|float|boolean|char|byte|short|String|abstract|enum|instanceof";

const TOKEN_PATTERN = new RegExp(
  `(//.*)|("(?:[^"\\\\]|\\\\.)*")|('(?:[^'\\\\]|\\\\.)*')|(@[A-Za-z]+)|\\b(${JAVA_KEYWORDS})\\b|\\b(\\d+\\.?\\d*)\\b|\\b([A-Za-z_][A-Za-z0-9_]*)(?=\\()`,
  "g"
);

// Fixed palette tuned for contrast against the code block's dark slate
// background (#0f172a), independent of the page's light/dark mode.
const CODE_COLORS = {
  plain: "#e2e8f0", // slate-200
  comment: "#94a3b8", // slate-400
  string: "#fbbf24", // amber-400
  annotation: "#38bdf8", // sky-400
  keyword: "#34d399", // emerald-400
  number: "#38bdf8", // sky-400
  fn: "#c084fc", // purple-400
};

function highlightLine(line: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let idx = 0;
  const pattern = new RegExp(TOKEN_PATTERN.source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    const [full, comment, dstr, sstr, annotation, keyword, num, fn] = match;
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`${keyPrefix}-${idx++}`} style={{ color: CODE_COLORS.plain }}>
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }
    let color = CODE_COLORS.plain;
    let fontStyle: "italic" | "normal" = "normal";
    let fontWeight: "500" | "normal" = "normal";
    if (comment) {
      color = CODE_COLORS.comment;
      fontStyle = "italic";
    } else if (dstr || sstr) {
      color = CODE_COLORS.string;
    } else if (annotation) {
      color = CODE_COLORS.annotation;
    } else if (keyword) {
      color = CODE_COLORS.keyword;
      fontWeight = "500";
    } else if (num) {
      color = CODE_COLORS.number;
    } else if (fn) {
      color = CODE_COLORS.fn;
    }

    nodes.push(
      <span key={`${keyPrefix}-${idx++}`} style={{ color, fontStyle, fontWeight }}>
        {full}
      </span>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) {
    nodes.push(
      <span key={`${keyPrefix}-${idx++}`} style={{ color: CODE_COLORS.plain }}>
        {line.slice(lastIndex)}
      </span>
    );
  }
  if (nodes.length === 0) nodes.push("\u00A0");
  return nodes;
}

// ---------------------------------------------------------------------------
// Code block component
// ---------------------------------------------------------------------------

function CodeBlock({ code, filename = "Main.java" }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "#334155", backgroundColor: "#0f172a" }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-4 py-2"
        style={{ borderColor: "#334155", backgroundColor: "#1e293b" }}
      >
        <span
          className="flex items-center gap-1.5 text-xs font-mono"
          style={{ color: "#94a3b8" }}
        >
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          {filename}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-mono transition-colors hover:text-emerald-400"
          style={{ color: "#94a3b8" }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed font-mono">
        <code>
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line, `l${i}`)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function OutputBlock({ output }: { output: string }) {
  const lines = output.split("\n");
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-slate-500">
        output
      </div>
      <pre className="px-4 py-3 text-[13px] leading-relaxed font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i}>{line || "\u00A0"}</div>
        ))}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download Java Notes button + toast
// ---------------------------------------------------------------------------

function buildNotesText(): string {
  const header = [
    "CodeNFacts — Java Notes",
    "========================",
    "",
    `A quick-reference study guide covering ${topics.length} core Java topics.`,
    "",
    "",
  ].join("\n");

  const body = topics
    .map((t) => {
      const points = t.points.map((p) => `  • ${p}`).join("\n");
      return [
        `${t.number}. ${t.title}`,
        "-".repeat(`${t.number}. ${t.title}`.length),
        t.summary,
        "",
        "Key points:",
        points,
        "",
        "Example:",
        t.code,
        "",
        t.output ? `Output:\n${t.output}` : "",
        "",
        "",
      ].join("\n");
    })
    .join("\n");

  return header + body;
}

type ToastState = { message: string; kind: "downloading" | "thanks" } | null;

function DownloadNotesButton() {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleDownload = () => {
    // Clear any previously queued toast transitions
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    setToast({ message: "Downloading Java notes…", kind: "downloading" });

    try {
      const text = buildNotesText();
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "codenfacts-java-notes.txt";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      // If the download itself fails for any reason, still let the
      // "downloading" toast resolve instead of hanging silently.
    }

    const thanksTimeout = setTimeout(() => {
      setToast({ message: "Thanks for downloading the Java notes !!", kind: "thanks" });
    }, 1100);

    const hideTimeout = setTimeout(() => {
      setToast(null);
    }, 4200);

    timeoutsRef.current = [thanksTimeout, hideTimeout];
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
      >
        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        Download Java Notes
      </button>

      {/* Toast */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          toast ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        {toast && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-lg">
            {toast.kind === "downloading" ? (
              <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            ) : (
              <PartyPopper className="h-4 w-4 flex-shrink-0 text-emerald-500" />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {toast.message}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function JavaCategoryPage() {
  const [activeId, setActiveId] = useState(topics[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const totalExamples = useMemo(() => topics.length, []);

  return (
    <main className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 text-sm font-normal text-slate-600 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Java · {totalExamples} core topics
            </span>
          </div>
          <h1 className="text-center text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Learn{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Java</span>{" "}
            from the ground up
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg font-normal text-slate-500 dark:text-slate-400">
            Every core concept explained in plain language, with a
            compilable example and its actual output — from your first
            class to streams and generics.
          </p>
          <div className="mt-8 flex justify-center">
            <DownloadNotesButton />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-8 py-12">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-12">
          {/* Sticky table of contents */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-normal text-slate-400 dark:text-slate-500">
                <ListTree className="h-3.5 w-3.5 text-emerald-500" />
                on this page
              </div>
              <nav className="border-l border-slate-200 dark:border-slate-700 max-h-[70vh] overflow-y-auto pr-2">
                {topics.map((t) => {
                  const isActive = t.id === activeId;
                  return (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`block border-l-2 -ml-px pl-4 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-500/50"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 mr-1.5">
                        {t.number}
                      </span>
                      {t.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Topics */}
          <div className="lg:col-span-9 space-y-16">
            {topics.map((topic) => (
              <article
                key={topic.id}
                id={topic.id}
                ref={(el) => {
                  sectionRefs.current[topic.id] = el;
                }}
                className="scroll-mt-8"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-sm text-emerald-500">
                    {topic.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    {topic.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {topic.summary}
                </p>

                <ul className="mb-5 space-y-1.5">
                  {topic.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-normal text-slate-500 dark:text-slate-400"
                    >
                      <Hash className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="grid gap-3 sm:grid-cols-1">
                  <CodeBlock code={topic.code} filename={topic.filename ?? "Main.java"} />
                  {topic.output && <OutputBlock output={topic.output} />}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
            Ready to go deeper?
          </h3>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-normal">
            Ask the AI tutor any Java question and get a step-by-step
            walkthrough, live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/ai"
              className="group inline-flex items-center rounded-full bg-emerald-600 dark:bg-emerald-500 px-7 py-3.5 font-semibold text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors"
            >
              Ask the AI tutor
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/category"
              className="group inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-7 py-3.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300 transition-colors"
            >
              Browse other categories
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}