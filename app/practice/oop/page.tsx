"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  BookOpen,
  Code2,
  Layers,
  GitBranch,
  Box,
  Shield,
  Repeat,
  Puzzle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle,
  Filter,
  Search,
  Lightbulb,
  Eye,
  EyeOff,
  Award,
  Target,
  Zap,
  Brain,
  FileCode,
  Component,
  Link2,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Hexagon,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Concept =
  | "Classes & Objects"
  | "Encapsulation"
  | "Inheritance"
  | "Polymorphism"
  | "Abstraction"
  | "Interfaces"
  | "Association"
  | "Composition"
  | "Aggregation"
  | "SOLID"
  | "Design Patterns"
  | "Constructors"
  | "Static & Final"
  | "Access Modifiers"
  | "Overloading & Overriding"
  | "Abstract Classes"
  | "Packages"
  | "Exception Handling OOP"
  | "Inner Classes"
  | "Generics OOP";

interface Question {
  id: number;
  concept: Concept;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}

interface ConceptCard {
  id: Concept;
  title: string;
  icon: React.ReactNode;
  short: string;
  details: string;
  visual: React.ReactNode;
  keyPoints: string[];
  javaExample: string;
}

/* ─────────────────────────────────────────────
   Visual Diagram Components
───────────────────────────────────────────── */
const InheritanceDiagram = () => (
  <div className="flex flex-col items-center gap-2 text-xs font-mono">
    <div className="px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 font-semibold">
      Animal
    </div>
    <div className="text-muted-foreground">▼ extends</div>
    <div className="flex gap-6">
      <div className="px-3 py-1.5 rounded border border-green-500 bg-green-500/10 dark:bg-green-500/20">
        Dog
      </div>
      <div className="px-3 py-1.5 rounded border border-green-500 bg-green-500/10 dark:bg-green-500/20">
        Cat
      </div>
      <div className="px-3 py-1.5 rounded border border-green-500 bg-green-500/10 dark:bg-green-500/20">
        Bird
      </div>
    </div>
  </div>
);

const EncapsulationDiagram = () => (
  <div className="relative w-full max-w-xs mx-auto">
    <div className="border-2 border-dashed border-amber-500 rounded-xl p-4 bg-amber-500/5">
      <div className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
        Class Boundary (private)
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-background border text-xs">
          <Shield className="w-3 h-3 text-red-500" /> private int balance
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-background border text-xs">
          <Shield className="w-3 h-3 text-red-500" /> private String pin
        </div>
      </div>
      <div className="mt-3 flex gap-2 justify-center">
        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] border border-green-500/40">
          deposit()
        </span>
        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] border border-green-500/40">
          withdraw()
        </span>
      </div>
    </div>
    <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground rotate-90 origin-center">
      public API
    </div>
  </div>
);

const PolymorphismDiagram = () => (
  <div className="flex flex-col items-center gap-3 text-xs">
    <div className="px-3 py-1.5 rounded-full border-2 border-purple-500 bg-purple-500/10 font-semibold">
      Shape shape = ...
    </div>
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Circle className="w-8 h-8 text-blue-500" />
        <span>Circle</span>
        <code className="text-[10px] text-muted-foreground">.area()</code>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Square className="w-8 h-8 text-green-500" />
        <span>Square</span>
        <code className="text-[10px] text-muted-foreground">.area()</code>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Triangle className="w-8 h-8 text-orange-500" />
        <span>Triangle</span>
        <code className="text-[10px] text-muted-foreground">.area()</code>
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground text-center">
      Same method call → different behavior at runtime
    </p>
  </div>
);

const CompositionDiagram = () => (
  <div className="flex flex-col items-center gap-2 text-xs">
    <div className="px-4 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-500/10 font-semibold">
      Car
    </div>
    <div className="text-muted-foreground">has-a (owns)</div>
    <div className="flex gap-3">
      <div className="px-2 py-1 rounded border border-rose-500 bg-rose-500/10">
        Engine
      </div>
      <div className="px-2 py-1 rounded border border-rose-500 bg-rose-500/10">
        Wheel[]
      </div>
      <div className="px-2 py-1 rounded border border-rose-500 bg-rose-500/10">
        Battery
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground">
      Engine dies when Car is destroyed
    </p>
  </div>
);

const AbstractionDiagram = () => (
  <div className="space-y-2 text-xs max-w-xs mx-auto">
    <div className="border-2 border-cyan-500 rounded-lg p-3 bg-cyan-500/5">
      <div className="font-semibold text-cyan-700 dark:text-cyan-400 mb-1">
        abstract class Vehicle
      </div>
      <div className="space-y-1 text-muted-foreground">
        <div>• abstract void start()</div>
        <div>• void stop() &#123; ... &#125;</div>
      </div>
    </div>
    <div className="flex justify-center text-muted-foreground">↓ implements</div>
    <div className="grid grid-cols-2 gap-2">
      <div className="border rounded p-2 bg-background">
        <div className="font-medium">Car</div>
        <div className="text-[10px]">start() → ignition</div>
      </div>
      <div className="border rounded p-2 bg-background">
        <div className="font-medium">Bike</div>
        <div className="text-[10px]">start() → kick</div>
      </div>
    </div>
  </div>
);

const SolidDiagram = () => (
  <div className="grid grid-cols-5 gap-1 text-[9px] font-semibold text-center">
    {[
      { l: "S", t: "Single\nResponsibility" },
      { l: "O", t: "Open/\nClosed" },
      { l: "L", t: "Liskov\nSubstitution" },
      { l: "I", t: "Interface\nSegregation" },
      { l: "D", t: "Dependency\nInversion" },
    ].map((item) => (
      <div
        key={item.l}
        className="flex flex-col items-center gap-1 p-1.5 rounded-lg border bg-background"
      >
        <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm">
          {item.l}
        </div>
        <span className="leading-tight whitespace-pre-line text-muted-foreground">
          {item.t}
        </span>
      </div>
    ))}
  </div>
);

const InterfaceDiagram = () => (
  <div className="flex flex-col items-center gap-2 text-xs">
    <div className="px-3 py-1.5 rounded border-2 border-dashed border-teal-500 bg-teal-500/10 font-semibold">
      «interface» Flyable
    </div>
    <div className="text-muted-foreground">implements</div>
    <div className="flex gap-4">
      <div className="px-2 py-1 rounded border bg-background">Bird</div>
      <div className="px-2 py-1 rounded border bg-background">Airplane</div>
      <div className="px-2 py-1 rounded border bg-background">Drone</div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Concept Data
───────────────────────────────────────────── */
const CONCEPTS: ConceptCard[] = [
  {
    id: "Classes & Objects",
    title: "Classes & Objects",
    icon: <Box className="w-5 h-5" />,
    short: "Blueprint vs Instance",
    details:
      "A class is a blueprint that defines the structure (fields) and behavior (methods) of objects. An object is a concrete instance of a class created at runtime with its own state.",
    visual: (
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg border-2 border-blue-500 flex items-center justify-center font-mono bg-blue-500/10">
            Class
          </div>
          <p className="mt-1 text-muted-foreground">Blueprint</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2">
          {["obj1", "obj2", "obj3"].map((o) => (
            <div key={o} className="text-center">
              <div className="w-12 h-12 rounded border border-green-500 flex items-center justify-center bg-green-500/10 text-[10px]">
                {o}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    keyPoints: [
      "Class = template; Object = instance",
      "new ClassName() allocates memory on the heap",
      "Each object has its own copy of instance variables",
      "Methods are shared (stored once in method area)",
    ],
    javaExample: `class Dog {
  String name;
  void bark() { System.out.println(name + " says woof"); }
}

Dog d1 = new Dog();  // object 1
d1.name = "Rex";
Dog d2 = new Dog();  // object 2
d2.name = "Max";`,
  },
  {
    id: "Encapsulation",
    title: "Encapsulation",
    icon: <Shield className="w-5 h-5" />,
    short: "Data Hiding + Controlled Access",
    details:
      "Bundling data and methods that operate on that data within a single unit (class) and restricting direct access to the internal state using access modifiers. Provides getters/setters for controlled interaction.",
    visual: <EncapsulationDiagram />,
    keyPoints: [
      "private fields + public getters/setters",
      "Protects invariants and prevents invalid states",
      "Increases maintainability and security",
      "Allows validation logic inside setters",
    ],
    javaExample: `class BankAccount {
  private double balance;

  public void deposit(double amount) {
    if (amount > 0) balance += amount;
  }

  public double getBalance() {
    return balance;
  }
}`,
  },
  {
    id: "Inheritance",
    title: "Inheritance",
    icon: <GitBranch className="w-5 h-5" />,
    short: "is-a Relationship",
    details:
      "A mechanism where a new class (subclass/child) acquires the properties and behaviors of an existing class (superclass/parent). Promotes code reuse and hierarchical classification.",
    visual: <InheritanceDiagram />,
    keyPoints: [
      "extends keyword for class inheritance",
      "Java supports single class inheritance only",
      "super() calls parent constructor",
      "protected members are accessible to subclasses",
      "All classes ultimately inherit from Object",
    ],
    javaExample: `class Animal {
  void eat() { System.out.println("Eating"); }
}

class Dog extends Animal {
  void bark() { System.out.println("Barking"); }
}

Dog d = new Dog();
d.eat();  // inherited
d.bark(); // own method`,
  },
  {
    id: "Polymorphism",
    title: "Polymorphism",
    icon: <Puzzle className="w-5 h-5" />,
    short: "Many Forms – One Interface",
    details:
      "Ability of an object to take many forms. Compile-time (method overloading) and runtime (method overriding via dynamic dispatch). Enables writing flexible, extensible code.",
    visual: <PolymorphismDiagram />,
    keyPoints: [
      "Overloading = same name, different parameters (compile-time)",
      "Overriding = same signature in subclass (runtime)",
      "Parent reference can point to child object",
      "Dynamic method dispatch selects the correct implementation",
    ],
    javaExample: `class Shape {
  double area() { return 0; }
}
class Circle extends Shape {
  double r;
  double area() { return Math.PI * r * r; }
}

Shape s = new Circle(); // upcasting
s.area(); // calls Circle.area() at runtime`,
  },
  {
    id: "Abstraction",
    title: "Abstraction",
    icon: <Layers className="w-5 h-5" />,
    short: "Hide Complexity, Show Essentials",
    details:
      "Hiding implementation details and showing only the necessary features of an object. Achieved via abstract classes and interfaces. Focuses on what an object does rather than how.",
    visual: <AbstractionDiagram />,
    keyPoints: [
      "abstract class can have abstract + concrete methods",
      "Cannot instantiate an abstract class",
      "Subclass must implement all abstract methods (or be abstract)",
      "Interfaces provide pure abstraction (pre-Java 8)",
    ],
    javaExample: `abstract class Vehicle {
  abstract void start();
  void stop() { System.out.println("Stopped"); }
}

class Car extends Vehicle {
  void start() { System.out.println("Engine started"); }
}`,
  },
  {
    id: "Interfaces",
    title: "Interfaces",
    icon: <Component className="w-5 h-5" />,
    short: "Contract for Behavior",
    details:
      "A fully abstract type that defines a contract of methods a class must implement. Enables multiple inheritance of type and loose coupling. Supports default and static methods since Java 8.",
    visual: <InterfaceDiagram />,
    keyPoints: [
      "implements keyword",
      "All methods are public abstract by default (pre-Java 8)",
      "A class can implement multiple interfaces",
      "default methods provide backward-compatible evolution",
      "Functional interfaces enable lambdas",
    ],
    javaExample: `interface Flyable {
  void fly();
  default void land() { System.out.println("Landing"); }
}

class Bird implements Flyable {
  public void fly() { System.out.println("Flapping wings"); }
}`,
  },
  {
    id: "Composition",
    title: "Composition",
    icon: <Link2 className="w-5 h-5" />,
    short: "Strong has-a (owns lifecycle)",
    details:
      "A strong form of association where the contained object cannot exist independently of the container. When the parent is destroyed, the child is also destroyed.",
    visual: <CompositionDiagram />,
    keyPoints: [
      "Part-of relationship with exclusive ownership",
      "Contained object has no independent lifecycle",
      "Prefer composition over inheritance when possible",
      "Promotes better encapsulation and flexibility",
    ],
    javaExample: `class Engine {
  void start() { /* ... */ }
}

class Car {
  private final Engine engine = new Engine(); // composition
  void start() { engine.start(); }
}`,
  },
  {
    id: "Aggregation",
    title: "Aggregation",
    icon: <Hexagon className="w-5 h-5" />,
    short: "Weak has-a (shared lifecycle)",
    details:
      "A weaker form of association. The contained object can exist independently of the container. The relationship is “has-a” but ownership is not exclusive.",
    visual: (
      <div className="flex flex-col items-center gap-2 text-xs">
        <div className="px-4 py-2 rounded-lg border-2 border-sky-500 bg-sky-500/10 font-semibold">
          University
        </div>
        <div className="text-muted-foreground">has-a (shares)</div>
        <div className="px-3 py-1 rounded border border-emerald-500 bg-emerald-500/10">
          Student
        </div>
        <p className="text-[10px] text-muted-foreground">
          Student continues to exist if University is closed
        </p>
      </div>
    ),
    keyPoints: [
      "Contained objects can live without the container",
      "Often implemented with collections of references",
      "Weaker coupling than composition",
      "Example: Department ↔ Professor",
    ],
    javaExample: `class Student { String name; }

class University {
  private List<Student> students = new ArrayList<>();
  void enroll(Student s) { students.add(s); }
  // Students exist independently
}`,
  },
  {
    id: "Association",
    title: "Association",
    icon: <Link2 className="w-5 h-5" />,
    short: "uses-a / knows-a Relationship",
    details:
      "A general relationship between two classes where one class uses or interacts with another. Can be unidirectional or bidirectional. Aggregation and Composition are specialized forms.",
    visual: (
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="px-3 py-2 rounded border-2 border-blue-500 bg-blue-500/10">
          Teacher
        </div>
        <div className="flex flex-col items-center">
          <span className="text-muted-foreground">teaches</span>
          <div className="w-12 h-px bg-border" />
        </div>
        <div className="px-3 py-2 rounded border-2 border-green-500 bg-green-500/10">
          Student
        </div>
      </div>
    ),
    keyPoints: [
      "Objects of one class are linked to objects of another",
      "Can be one-to-one, one-to-many, many-to-many",
      "Does not imply ownership",
      "Implemented via fields holding references",
    ],
    javaExample: `class Teacher {
  private List<Student> students;
  void teach(Student s) { /* ... */ }
}`,
  },
  {
    id: "SOLID",
    title: "SOLID Principles",
    icon: <Award className="w-5 h-5" />,
    short: "Five Design Principles",
    details:
      "A set of five design principles intended to make software designs more understandable, flexible, and maintainable. Widely used in object-oriented design.",
    visual: <SolidDiagram />,
    keyPoints: [
      "S – One class, one reason to change",
      "O – Open for extension, closed for modification",
      "L – Subtypes must be substitutable for base types",
      "I – Prefer many small interfaces over large ones",
      "D – Depend on abstractions, not concretions",
    ],
    javaExample: `// Dependency Inversion
interface Logger {
  void log(String msg);
}

class OrderService {
  private final Logger logger; // depend on abstraction
  OrderService(Logger logger) { this.logger = logger; }
}`,
  },
  {
    id: "Constructors",
    title: "Constructors",
    icon: <FileCode className="w-5 h-5" />,
    short: "Object Initialization",
    details:
      "Special methods invoked automatically when an object is created. Used to initialize the object’s state. Can be overloaded. Default no-arg constructor is provided if none is defined.",
    visual: (
      <div className="text-xs font-mono space-y-1 text-center">
        <div className="px-3 py-1 rounded bg-background border">
          new Person("Alice", 25)
        </div>
        <div className="text-muted-foreground">↓</div>
        <div className="px-3 py-1 rounded bg-violet-500/10 border border-violet-500/40">
          Person(String name, int age)
        </div>
      </div>
    ),
    keyPoints: [
      "Same name as the class, no return type",
      "Can be overloaded",
      "this() and super() must be first statement",
      "Private constructors enable Singleton / Factory patterns",
    ],
    javaExample: `class Person {
  String name;
  int age;

  Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  Person(String name) {
    this(name, 0); // constructor chaining
  }
}`,
  },
  {
    id: "Static & Final",
    title: "Static & Final",
    icon: <Zap className="w-5 h-5" />,
    short: "Class-level & Immutability",
    details:
      "static members belong to the class rather than any instance. final prevents reassignment (variables), overriding (methods), or inheritance (classes).",
    visual: (
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 rounded border bg-background text-center">
          <div className="font-semibold text-amber-600">static</div>
          <div className="text-muted-foreground mt-1">one copy<br/>shared by all</div>
        </div>
        <div className="p-2 rounded border bg-background text-center">
          <div className="font-semibold text-rose-600">final</div>
          <div className="text-muted-foreground mt-1">cannot change<br/>or override</div>
        </div>
      </div>
    ),
    keyPoints: [
      "static methods cannot access instance members directly",
      "static blocks run once when class is loaded",
      "final variables must be initialized once",
      "final methods cannot be overridden",
      "final classes cannot be extended",
    ],
    javaExample: `class MathUtils {
  public static final double PI = 3.14159;
  public static int add(int a, int b) { return a + b; }
}

final class ImmutablePoint {
  private final int x, y;
  ImmutablePoint(int x, int y) { this.x = x; this.y = y; }
}`,
  },
  {
    id: "Access Modifiers",
    title: "Access Modifiers",
    icon: <Shield className="w-5 h-5" />,
    short: "Visibility Control",
    details:
      "Keywords that set the accessibility of classes, methods, and fields: public, protected, default (package-private), and private.",
    visual: (
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-1 text-left">Modifier</th>
              <th className="p-1">Class</th>
              <th className="p-1">Package</th>
              <th className="p-1">Subclass</th>
              <th className="p-1">World</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["public", "✓", "✓", "✓", "✓"],
              ["protected", "✓", "✓", "✓", "✗"],
              ["default", "✓", "✓", "✗", "✗"],
              ["private", "✓", "✗", "✗", "✗"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-border/50">
                {row.map((cell, i) => (
                  <td key={i} className={`p-1 text-center ${i === 0 ? "text-left font-medium" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    keyPoints: [
      "private → only within the same class",
      "default → same package",
      "protected → package + subclasses",
      "public → everywhere",
    ],
    javaExample: `public class Example {
  public int a;      // anywhere
  protected int b;   // package + children
  int c;             // package only
  private int d;     // this class only
}`,
  },
  {
    id: "Overloading & Overriding",
    title: "Overloading & Overriding",
    icon: <Repeat className="w-5 h-5" />,
    short: "Compile-time vs Runtime",
    details:
      "Overloading: multiple methods with the same name but different parameter lists in the same class. Overriding: redefining a method in a subclass with the same signature.",
    visual: (
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 rounded border bg-background">
          <div className="font-semibold text-blue-600 mb-1">Overloading</div>
          <code className="text-[10px] block">void print(int)</code>
          <code className="text-[10px] block">void print(String)</code>
          <code className="text-[10px] block">void print(int,int)</code>
        </div>
        <div className="p-2 rounded border bg-background">
          <div className="font-semibold text-purple-600 mb-1">Overriding</div>
          <code className="text-[10px] block">Animal.speak()</code>
          <code className="text-[10px] block">↓</code>
          <code className="text-[10px] block">Dog.speak()</code>
        </div>
      </div>
    ),
    keyPoints: [
      "Overloading resolved at compile time",
      "Overriding resolved at runtime (virtual dispatch)",
      "@Override annotation is recommended",
      "Overridden method cannot be more restrictive",
      "static, final, private methods cannot be overridden",
    ],
    javaExample: `class Calculator {
  int add(int a, int b) { return a + b; }
  double add(double a, double b) { return a + b; } // overload
}

class Animal {
  void speak() { System.out.println("..."); }
}
class Dog extends Animal {
  @Override
  void speak() { System.out.println("Woof"); } // override
}`,
  },
  {
    id: "Abstract Classes",
    title: "Abstract Classes",
    icon: <Layers className="w-5 h-5" />,
    short: "Partial Implementation",
    details:
      "A class declared with the abstract keyword that may contain both abstract and concrete methods. Serves as a base for subclasses that provide the missing implementations.",
    visual: (
      <div className="text-xs space-y-2">
        <div className="px-3 py-2 rounded border-2 border-dashed border-orange-500 bg-orange-500/5">
          abstract class Shape
          <div className="text-muted-foreground mt-1">
            abstract double area();
            <br />
            void display() &#123;...&#125;
          </div>
        </div>
      </div>
    ),
    keyPoints: [
      "Cannot be instantiated",
      "Can have constructors, fields, concrete methods",
      "Can implement interfaces",
      "Useful when classes share common state/behavior",
    ],
    javaExample: `abstract class Shape {
  String color;
  Shape(String color) { this.color = color; }
  abstract double area();
  void printColor() { System.out.println(color); }
}`,
  },
  {
    id: "Packages",
    title: "Packages",
    icon: <Box className="w-5 h-5" />,
    short: "Namespace & Organization",
    details:
      "A mechanism to group related classes and interfaces. Provides namespace management, access control, and easier maintenance of large codebases.",
    visual: (
      <div className="text-xs font-mono space-y-1">
        <div>com.example</div>
        <div className="pl-3">├── model</div>
        <div className="pl-6">│   ├── User.java</div>
        <div className="pl-6">│   └── Order.java</div>
        <div className="pl-3">├── service</div>
        <div className="pl-6">│   └── OrderService.java</div>
        <div className="pl-3">└── util</div>
      </div>
    ),
    keyPoints: [
      "package statement must be first line",
      "import brings classes into scope",
      "Default package has no name (discouraged)",
      "Naming convention: reverse domain (com.company.project)",
    ],
    javaExample: `package com.example.model;

public class User {
  // ...
}

// elsewhere
import com.example.model.User;
User u = new User();`,
  },
  {
    id: "Inner Classes",
    title: "Inner Classes",
    icon: <Component className="w-5 h-5" />,
    short: "Classes inside Classes",
    details:
      "A class defined within another class. Types: member inner, static nested, local, and anonymous. Useful for logically grouping classes and accessing outer private members.",
    visual: (
      <div className="text-xs border-2 border-indigo-500 rounded-lg p-3 bg-indigo-500/5">
        <div className="font-semibold">Outer</div>
        <div className="ml-3 mt-1 border border-dashed rounded p-2">
          Inner (has access to Outer’s private fields)
        </div>
      </div>
    ),
    keyPoints: [
      "Non-static inner class holds a reference to outer instance",
      "Static nested class does not",
      "Anonymous classes used for one-off implementations",
      "Local classes defined inside methods",
    ],
    javaExample: `class Outer {
  private int x = 10;
  class Inner {
    void print() { System.out.println(x); }
  }
}

Outer o = new Outer();
Outer.Inner i = o.new Inner();`,
  },
  {
    id: "Design Patterns",
    title: "Design Patterns",
    icon: <Brain className="w-5 h-5" />,
    short: "Reusable Solutions",
    details:
      "Proven solutions to recurring design problems. Categorized as Creational, Structural, and Behavioral. Examples: Singleton, Factory, Observer, Strategy, Adapter, Decorator.",
    visual: (
      <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
        <div className="p-2 rounded border bg-background">
          <div className="font-semibold text-blue-600">Creational</div>
          Singleton<br />Factory<br />Builder
        </div>
        <div className="p-2 rounded border bg-background">
          <div className="font-semibold text-green-600">Structural</div>
          Adapter<br />Decorator<br />Facade
        </div>
        <div className="p-2 rounded border bg-background">
          <div className="font-semibold text-purple-600">Behavioral</div>
          Observer<br />Strategy<br />Command
        </div>
      </div>
    ),
    keyPoints: [
      "Singleton → only one instance",
      "Factory → create objects without exposing creation logic",
      "Observer → one-to-many dependency for event notification",
      "Strategy → encapsulate interchangeable algorithms",
    ],
    javaExample: `// Singleton (eager)
public class Database {
  private static final Database INSTANCE = new Database();
  private Database() {}
  public static Database getInstance() { return INSTANCE; }
}`,
  },
  {
    id: "Generics OOP",
    title: "Generics & OOP",
    icon: <Code2 className="w-5 h-5" />,
    short: "Type-Safe Polymorphism",
    details:
      "Generics enable classes, interfaces, and methods to operate on typed parameters, providing compile-time type safety while retaining the flexibility of polymorphism.",
    visual: (
      <div className="text-xs font-mono text-center space-y-1">
        <div className="px-3 py-1 rounded border bg-background">
          List&lt;String&gt;
        </div>
        <div className="text-muted-foreground">vs</div>
        <div className="px-3 py-1 rounded border bg-background opacity-60">
          List&lt;Object&gt; (raw / unsafe)
        </div>
      </div>
    ),
    keyPoints: [
      "Type parameters are erased at runtime (type erasure)",
      "Bounded types: &lt;T extends Number&gt;",
      "Wildcards: ?, ? extends, ? super",
      "Enable writing reusable, type-safe collections and APIs",
    ],
    javaExample: `class Box<T> {
  private T value;
  void set(T v) { value = v; }
  T get() { return value; }
}

Box<Integer> intBox = new Box<>();
intBox.set(42);`,
  },
  {
    id: "Exception Handling OOP",
    title: "Exceptions in OOP",
    icon: <Target className="w-5 h-5" />,
    short: "Hierarchy & Custom Exceptions",
    details:
      "Exceptions form an inheritance hierarchy rooted at Throwable. Custom exceptions extend Exception or RuntimeException to represent domain-specific error conditions.",
    visual: (
      <div className="text-xs font-mono space-y-0.5">
        <div>Throwable</div>
        <div className="pl-3">├── Error</div>
        <div className="pl-3">└── Exception</div>
        <div className="pl-6">├── RuntimeException</div>
        <div className="pl-6">└── (checked exceptions)</div>
      </div>
    ),
    keyPoints: [
      "Checked vs Unchecked exceptions",
      "Custom exceptions should provide meaningful messages",
      "Prefer specific exceptions over generic ones",
      "try-with-resources for AutoCloseable resources",
    ],
    javaExample: `class InsufficientFundsException extends Exception {
  public InsufficientFundsException(String msg) {
    super(msg);
  }
}

void withdraw(double amount) throws InsufficientFundsException {
  if (amount > balance)
    throw new InsufficientFundsException("Not enough funds");
}`,
  },
];

/* ─────────────────────────────────────────────
   Question Bank – 120 unique questions
───────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  // ── Classes & Objects (1-8)
  {
    id: 1,
    concept: "Classes & Objects",
    difficulty: "Beginner",
    question: "What is the primary difference between a class and an object in Java?",
    options: [
      "A class is an instance of an object",
      "A class is a blueprint; an object is an instance of that blueprint",
      "Objects define methods; classes hold data only",
      "There is no difference; the terms are interchangeable",
    ],
    correctIndex: 1,
    explanation:
      "A class is a template that defines fields and methods. An object is a concrete instance created from that template using the new keyword.",
  },
  {
    id: 2,
    concept: "Classes & Objects",
    difficulty: "Beginner",
    question: "Where are objects stored in memory in the JVM?",
    options: ["Stack", "Heap", "Method area", "PC register"],
    correctIndex: 1,
    explanation:
      "Objects are allocated on the heap. References to those objects may live on the stack (local variables) or in other heap objects.",
  },
  {
    id: 3,
    concept: "Classes & Objects",
    difficulty: "Intermediate",
    question: "What happens if you do not provide any constructor in a Java class?",
    options: [
      "Compilation error",
      "The class cannot be instantiated",
      "Java provides a default no-argument constructor",
      "Only static methods can be called",
    ],
    correctIndex: 2,
    explanation:
      "If no constructor is declared, the compiler inserts a public no-arg constructor that calls super().",
  },
  {
    id: 4,
    concept: "Classes & Objects",
    difficulty: "Beginner",
    question: "Which keyword is used to create an object in Java?",
    options: ["create", "new", "alloc", "instance"],
    correctIndex: 1,
    explanation: "The new keyword allocates memory on the heap and invokes the constructor.",
  },
  {
    id: 5,
    concept: "Classes & Objects",
    difficulty: "Intermediate",
    question:
      "Can two objects of the same class have different values for their instance variables?",
    options: [
      "No, instance variables are shared",
      "Yes, each object has its own copy of instance variables",
      "Only if the variables are static",
      "Only if they are declared final",
    ],
    correctIndex: 1,
    explanation:
      "Instance variables belong to individual objects. Static variables are shared across all instances.",
  },
  {
    id: 6,
    concept: "Classes & Objects",
    difficulty: "Advanced",
    question:
      "What is the output of System.out.println(new Object().getClass().getName()); ?",
    options: ["Object", "java.lang.Object", "class Object", "null"],
    correctIndex: 1,
    explanation:
      "getClass() returns the runtime Class object, whose getName() yields the fully qualified name “java.lang.Object”.",
  },
  {
    id: 7,
    concept: "Classes & Objects",
    difficulty: "Intermediate",
    question: "How many objects are created by the statement: String s = new String(\"Hello\"); ?",
    options: [
      "1 – only the String object",
      "2 – the String object and the string literal in the pool",
      "0 – strings are not objects",
      "Depends on the JVM",
    ],
    correctIndex: 1,
    explanation:
      "The literal “Hello” is placed in the string pool (if not already present) and new String(...) creates a distinct object on the heap that copies the characters.",
  },
  {
    id: 8,
    concept: "Classes & Objects",
    difficulty: "Beginner",
    question: "Which of the following is true about the this keyword?",
    options: [
      "It refers to the current class’s static members",
      "It refers to the current object instance",
      "It is used only inside static methods",
      "It creates a new object",
    ],
    correctIndex: 1,
    explanation:
      "this is a reference to the current instance. It cannot be used in static contexts because static methods have no associated instance.",
  },

  // ── Encapsulation (9-14)
  {
    id: 9,
    concept: "Encapsulation",
    difficulty: "Beginner",
    question: "What is the main purpose of encapsulation?",
    options: [
      "To allow multiple inheritance",
      "To hide internal state and require all interaction through methods",
      "To speed up method calls",
      "To force every class to have a main method",
    ],
    correctIndex: 1,
    explanation:
      "Encapsulation protects an object’s integrity by preventing external code from putting it into an invalid state.",
  },
  {
    id: 10,
    concept: "Encapsulation",
    difficulty: "Beginner",
    question: "Which access modifier provides the strongest encapsulation for a field?",
    options: ["public", "protected", "default", "private"],
    correctIndex: 3,
    explanation: "private restricts access to the declaring class only.",
  },
  {
    id: 11,
    concept: "Encapsulation",
    difficulty: "Intermediate",
    question:
      "Why are getters and setters preferred over public fields?",
    options: [
      "They are faster",
      "They allow validation, lazy initialization, and future changes without breaking clients",
      "Java does not allow public fields",
      "They reduce memory usage",
    ],
    correctIndex: 1,
    explanation:
      "Getters/setters give you a single place to add logic later while keeping the public API stable.",
  },
  {
    id: 12,
    concept: "Encapsulation",
    difficulty: "Intermediate",
    question:
      "Is it possible to have a read-only property in Java using encapsulation?",
    options: [
      "No",
      "Yes – provide only a getter, no setter",
      "Yes – mark the field final and public",
      "Only with reflection",
    ],
    correctIndex: 1,
    explanation:
      "Omitting the setter makes the property read-only from outside the class (assuming the field is private).",
  },
  {
    id: 13,
    concept: "Encapsulation",
    difficulty: "Advanced",
    question:
      "What is a common risk when returning a reference to a mutable internal collection from a getter?",
    options: [
      "Performance degradation",
      "The caller can modify the internal state, breaking encapsulation",
      "Compilation error",
      "Nothing; it is always safe",
    ],
    correctIndex: 1,
    explanation:
      "Returning the live list lets external code change the object’s internals. Prefer defensive copies or unmodifiable views.",
  },
  {
    id: 14,
    concept: "Encapsulation",
    difficulty: "Beginner",
    question: "Encapsulation is often described as:",
    options: [
      "is-a relationship",
      "has-a relationship",
      "data hiding",
      "dynamic binding",
    ],
    correctIndex: 2,
    explanation: "Data hiding is the core idea behind encapsulation.",
  },

  // ── Inheritance (15-22)
  {
    id: 15,
    concept: "Inheritance",
    difficulty: "Beginner",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correctIndex: 1,
    explanation: "extends establishes an is-a relationship between subclass and superclass.",
  },
  {
    id: 16,
    concept: "Inheritance",
    difficulty: "Beginner",
    question: "Does Java support multiple class inheritance?",
    options: [
      "Yes, using commas",
      "No, only single class inheritance is allowed",
      "Yes, via the extends keyword multiple times",
      "Only for abstract classes",
    ],
    correctIndex: 1,
    explanation:
      "A class may extend only one other class. Multiple inheritance of type is achieved through interfaces.",
  },
  {
    id: 17,
    concept: "Inheritance",
    difficulty: "Intermediate",
    question: "What is the purpose of the super keyword?",
    options: [
      "To create a superclass instance",
      "To access superclass members or call a superclass constructor",
      "To mark a method as final",
      "To prevent inheritance",
    ],
    correctIndex: 1,
    explanation:
      "super refers to the immediate parent class. super() invokes a parent constructor; super.method() calls an overridden parent method.",
  },
  {
    id: 18,
    concept: "Inheritance",
    difficulty: "Intermediate",
    question:
      "If class B extends A and class C extends B, what is the inheritance relationship?",
    options: [
      "Multiple inheritance",
      "Hierarchical inheritance",
      "Multilevel inheritance",
      "Hybrid inheritance",
    ],
    correctIndex: 2,
    explanation: "A → B → C forms a multilevel inheritance chain.",
  },
  {
    id: 19,
    concept: "Inheritance",
    difficulty: "Advanced",
    question:
      "Can a subclass access private members of its superclass directly?",
    options: [
      "Yes, always",
      "No, private members are not inherited in the sense of direct access",
      "Only if the subclass is in the same package",
      "Only via reflection, which is still not “direct”",
    ],
    correctIndex: 1,
    explanation:
      "Private members are not visible to subclasses. They can only be accessed indirectly through public/protected methods of the superclass.",
  },
  {
    id: 20,
    concept: "Inheritance",
    difficulty: "Intermediate",
    question: "What is the root class of every Java class?",
    options: ["Class", "Object", "Main", "Super"],
    correctIndex: 1,
    explanation: "java.lang.Object is the ultimate superclass of all classes.",
  },
  {
    id: 21,
    concept: "Inheritance",
    difficulty: "Advanced",
    question:
      "If a constructor in a subclass does not explicitly call super(...), what happens?",
    options: [
      "Compilation fails",
      "The compiler inserts a call to the no-arg constructor of the superclass",
      "No superclass constructor is called",
      "The Object constructor is skipped",
    ],
    correctIndex: 1,
    explanation:
      "The compiler automatically inserts super() as the first statement if you don’t write any explicit constructor call.",
  },
  {
    id: 22,
    concept: "Inheritance",
    difficulty: "Beginner",
    question: "Inheritance models which relationship?",
    options: ["has-a", "is-a", "uses-a", "part-of"],
    correctIndex: 1,
    explanation: "Inheritance expresses an “is-a” relationship (Dog is-a Animal).",
  },

  // ── Polymorphism (23-30)
  {
    id: 23,
    concept: "Polymorphism",
    difficulty: "Beginner",
    question: "What are the two main types of polymorphism in Java?",
    options: [
      "Static and Dynamic",
      "Compile-time (overloading) and Runtime (overriding)",
      "Early and Late binding only",
      "Interface and Abstract",
    ],
    correctIndex: 1,
    explanation:
      "Method overloading is resolved at compile time; method overriding uses dynamic dispatch at runtime.",
  },
  {
    id: 24,
    concept: "Polymorphism",
    difficulty: "Intermediate",
    question:
      "What is dynamic method dispatch?",
    options: [
      "Choosing an overloaded method at compile time",
      "The JVM selecting the overridden method to invoke based on the actual object type at runtime",
      "Inlining of final methods",
      "Loading classes dynamically",
    ],
    correctIndex: 1,
    explanation:
      "When a superclass reference points to a subclass object, the JVM looks up the method in the actual class of the object.",
  },
  {
    id: 25,
    concept: "Polymorphism",
    difficulty: "Beginner",
    question:
      "Given Shape s = new Circle(); which area() method is called by s.area()?",
    options: [
      "Shape.area() always",
      "Circle.area() if it overrides Shape.area()",
      "Neither; it is a compile error",
      "Both are called",
    ],
    correctIndex: 1,
    explanation:
      "Runtime polymorphism selects the most specific overriding implementation.",
  },
  {
    id: 26,
    concept: "Polymorphism",
    difficulty: "Advanced",
    question:
      "Can you override a static method in Java?",
    options: [
      "Yes, and it participates in dynamic dispatch",
      "No – static methods are hidden, not overridden",
      "Only if marked final",
      "Only in interfaces",
    ],
    correctIndex: 1,
    explanation:
      "Static methods are resolved at compile time based on the reference type. Declaring a static method with the same signature in a subclass hides the parent method.",
  },
  {
    id: 27,
    concept: "Polymorphism",
    difficulty: "Intermediate",
    question:
      "Which annotation helps the compiler catch accidental overloading instead of overriding?",
    options: ["@Deprecated", "@Override", "@FunctionalInterface", "@SafeVarargs"],
    correctIndex: 1,
    explanation:
      "@Override causes a compile error if the method does not actually override a superclass method.",
  },
  {
    id: 28,
    concept: "Polymorphism",
    difficulty: "Beginner",
    question: "Method overloading is an example of:",
    options: [
      "Runtime polymorphism",
      "Compile-time polymorphism",
      "Inheritance",
      "Encapsulation",
    ],
    correctIndex: 1,
    explanation: "The compiler chooses the correct overloaded method based on the argument list.",
  },
  {
    id: 29,
    concept: "Polymorphism",
    difficulty: "Advanced",
    question:
      "What is covariant return type in Java?",
    options: [
      "Returning a different primitive type when overriding",
      "An overriding method may return a subtype of the return type declared in the superclass method",
      "Returning void instead of a value",
      "A feature only available with generics",
    ],
    correctIndex: 1,
    explanation:
      "Since Java 5, an overriding method can return a more specific type (e.g., Dog instead of Animal).",
  },
  {
    id: 30,
    concept: "Polymorphism",
    difficulty: "Intermediate",
    question:
      "Upcasting is:",
    options: [
      "Casting a subclass reference to a superclass type (always safe)",
      "Casting a superclass reference to a subclass type (may fail)",
      "Converting primitives to objects",
      "Impossible in Java",
    ],
    correctIndex: 0,
    explanation:
      "Upcasting is implicit and safe because a subclass instance is-a superclass instance.",
  },

  // ── Abstraction (31-36)
  {
    id: 31,
    concept: "Abstraction",
    difficulty: "Beginner",
    question: "Which of the following cannot be instantiated?",
    options: [
      "A concrete class",
      "An abstract class",
      "A final class",
      "A class with a private constructor only if you also provide a public one",
    ],
    correctIndex: 1,
    explanation: "Abstract classes exist to be extended; you cannot write new AbstractClass().",
  },
  {
    id: 32,
    concept: "Abstraction",
    difficulty: "Intermediate",
    question:
      "Can an abstract class have a constructor?",
    options: [
      "No",
      "Yes – it is called when a subclass is instantiated",
      "Yes, but only a private one",
      "Only if it has no abstract methods",
    ],
    correctIndex: 1,
    explanation:
      "Abstract classes can (and often do) have constructors to initialize common state for subclasses.",
  },
  {
    id: 33,
    concept: "Abstraction",
    difficulty: "Beginner",
    question: "Abstraction focuses on:",
    options: [
      "How an object does something",
      "What an object does, hiding the implementation details",
      "Memory layout of objects",
      "Garbage collection",
    ],
    correctIndex: 1,
    explanation: "Abstraction lets you work with high-level concepts without caring about low-level details.",
  },
  {
    id: 34,
    concept: "Abstraction",
    difficulty: "Advanced",
    question:
      "If an abstract class implements an interface but does not implement one of its methods, what must be true?",
    options: [
      "The code will not compile",
      "The abstract class must declare that method as abstract (or leave it unimplemented, which is equivalent)",
      "The method becomes private",
      "The interface is ignored",
    ],
    correctIndex: 1,
    explanation:
      "An abstract class may leave interface methods unimplemented; they remain abstract for concrete subclasses to fulfill.",
  },
  {
    id: 35,
    concept: "Abstraction",
    difficulty: "Intermediate",
    question:
      "Which is a better choice when you need to share code among related classes and also define a common contract?",
    options: [
      "Only interfaces",
      "An abstract class",
      "A final class",
      "A static utility class",
    ],
    correctIndex: 1,
    explanation:
      "Abstract classes can contain both abstract methods (contract) and concrete methods/fields (shared code).",
  },
  {
    id: 36,
    concept: "Abstraction",
    difficulty: "Beginner",
    question: "Is it mandatory for an abstract class to have at least one abstract method?",
    options: [
      "Yes",
      "No – a class can be declared abstract even with zero abstract methods",
      "Only if it extends another abstract class",
      "Only in Java 8+",
    ],
    correctIndex: 1,
    explanation:
      "You can declare a class abstract purely to prevent instantiation, even if every method has a body.",
  },

  // ── Interfaces (37-44)
  {
    id: 37,
    concept: "Interfaces",
    difficulty: "Beginner",
    question: "Which keyword does a class use to adopt an interface?",
    options: ["extends", "implements", "inherits", "uses"],
    correctIndex: 1,
    explanation: "implements is used for interfaces; extends is used for classes.",
  },
  {
    id: 38,
    concept: "Interfaces",
    difficulty: "Beginner",
    question: "Can a class implement multiple interfaces?",
    options: ["No", "Yes", "Only if they have no common methods", "Only with default methods"],
    correctIndex: 1,
    explanation:
      "Java allows a class to implement any number of interfaces, providing a form of multiple inheritance of type.",
  },
  {
    id: 39,
    concept: "Interfaces",
    difficulty: "Intermediate",
    question:
      "What is the default access level of methods declared in an interface (pre-Java 9)?",
    options: ["private", "protected", "public abstract", "package-private"],
    correctIndex: 2,
    explanation:
      "Interface methods are implicitly public and abstract (unless they are default or static).",
  },
  {
    id: 40,
    concept: "Interfaces",
    difficulty: "Intermediate",
    question: "What are default methods in interfaces used for?",
    options: [
      "To force every implementing class to override them",
      "To add new methods to interfaces without breaking existing implementors",
      "To replace abstract classes entirely",
      "Only for functional interfaces",
    ],
    correctIndex: 1,
    explanation:
      "Default methods provide a body, so older classes that implement the interface continue to compile.",
  },
  {
    id: 41,
    concept: "Interfaces",
    difficulty: "Advanced",
    question:
      "If two interfaces declare the same default method and a class implements both, what happens?",
    options: [
      "The class compiles and inherits both",
      "The class must override the method to resolve the conflict",
      "The JVM picks one at random",
      "Compilation succeeds only if the methods are identical",
    ],
    correctIndex: 1,
    explanation:
      "The compiler requires the implementing class to override the conflicting method and choose (or combine) the desired behavior.",
  },
  {
    id: 42,
    concept: "Interfaces",
    difficulty: "Beginner",
    question: "Can an interface extend another interface?",
    options: ["No", "Yes, using extends", "Yes, using implements", "Only one level deep"],
    correctIndex: 1,
    explanation: "Interfaces can extend multiple other interfaces with the extends keyword.",
  },
  {
    id: 43,
    concept: "Interfaces",
    difficulty: "Advanced",
    question:
      "What is a functional interface?",
    options: [
      "Any interface with default methods",
      "An interface with exactly one abstract method (SAM)",
      "An interface that contains only static methods",
      "An interface used only with streams",
    ],
    correctIndex: 1,
    explanation:
      "Functional interfaces can be the target of lambda expressions or method references. @FunctionalInterface documents the intent.",
  },
  {
    id: 44,
    concept: "Interfaces",
    difficulty: "Intermediate",
    question:
      "Fields declared in an interface are implicitly:",
    options: [
      "public static final",
      "private final",
      "protected static",
      "public instance variables",
    ],
    correctIndex: 0,
    explanation: "Interface fields are constants: public, static, and final.",
  },

  // ── Association / Aggregation / Composition (45-52)
  {
    id: 45,
    concept: "Association",
    difficulty: "Beginner",
    question: "Association in OOP represents:",
    options: [
      "An is-a relationship",
      "A relationship where objects of one class are linked to objects of another",
      "Method overriding",
      "Package structure",
    ],
    correctIndex: 1,
    explanation: "Association is a structural relationship (uses-a / knows-a).",
  },
  {
    id: 46,
    concept: "Composition",
    difficulty: "Intermediate",
    question:
      "In composition, what happens to the part when the whole is destroyed?",
    options: [
      "The part continues to exist independently",
      "The part is also destroyed",
      "The part becomes static",
      "Nothing; composition has no lifecycle implications",
    ],
    correctIndex: 1,
    explanation:
      "Composition implies exclusive ownership; the part’s lifetime is bound to the whole.",
  },
  {
    id: 47,
    concept: "Aggregation",
    difficulty: "Intermediate",
    question:
      "Aggregation differs from composition because:",
    options: [
      "Aggregation is stronger",
      "In aggregation the part can exist independently of the whole",
      "Aggregation uses inheritance",
      "There is no difference",
    ],
    correctIndex: 1,
    explanation:
      "Aggregation is a weak has-a relationship; the child object can live without the parent.",
  },
  {
    id: 48,
    concept: "Composition",
    difficulty: "Beginner",
    question:
      "Which relationship is typically implemented by creating the part object inside the whole’s constructor?",
    options: ["Inheritance", "Composition", "Aggregation", "Dependency"],
    correctIndex: 1,
    explanation:
      "Creating the part inside the whole and never exposing it outside is a classic composition pattern.",
  },
  {
    id: 49,
    concept: "Association",
    difficulty: "Advanced",
    question:
      "A Teacher object holds a list of Student objects, and each Student also holds a reference to the Teacher. This is an example of:",
    options: [
      "Unidirectional association",
      "Bidirectional association",
      "Composition",
      "Inheritance",
    ],
    correctIndex: 1,
    explanation: "Both sides know about each other → bidirectional association.",
  },
  {
    id: 50,
    concept: "Composition",
    difficulty: "Intermediate",
    question:
      "Why is “prefer composition over inheritance” a common design guideline?",
    options: [
      "Composition is always faster",
      "Composition provides more flexibility and avoids the fragile base-class problem",
      "Inheritance is deprecated",
      "Composition uses less memory",
    ],
    correctIndex: 1,
    explanation:
      "Composition lets you change behavior at runtime by swapping parts and avoids tight coupling to a parent’s implementation.",
  },
  {
    id: 51,
    concept: "Aggregation",
    difficulty: "Beginner",
    question:
      "A University has many Students. When the University object is garbage-collected, the Student objects may still be reachable. This describes:",
    options: ["Composition", "Aggregation", "Inheritance", "Polymorphism"],
    correctIndex: 1,
    explanation: "Students have an independent lifecycle → aggregation.",
  },
  {
    id: 52,
    concept: "Association",
    difficulty: "Intermediate",
    question:
      "Which of the following is NOT a form of association?",
    options: ["Aggregation", "Composition", "Inheritance", "Simple uses-a relationship"],
    correctIndex: 2,
    explanation: "Inheritance is an is-a relationship, not a has-a / uses-a association.",
  },

  // ── SOLID (53-60)
  {
    id: 53,
    concept: "SOLID",
    difficulty: "Beginner",
    question: "What does the ‘S’ in SOLID stand for?",
    options: [
      "Static Responsibility",
      "Single Responsibility Principle",
      "Shared Responsibility",
      "Secure Runtime",
    ],
    correctIndex: 1,
    explanation:
      "A class should have only one reason to change – a single responsibility.",
  },
  {
    id: 54,
    concept: "SOLID",
    difficulty: "Intermediate",
    question:
      "The Open/Closed Principle states that software entities should be:",
    options: [
      "Open for modification, closed for extension",
      "Open for extension, closed for modification",
      "Always final",
      "Never use inheritance",
    ],
    correctIndex: 1,
    explanation:
      "You should be able to add new behavior without changing existing source code (e.g., via polymorphism or strategy).",
  },
  {
    id: 55,
    concept: "SOLID",
    difficulty: "Intermediate",
    question:
      "Liskov Substitution Principle requires that:",
    options: [
      "Subclasses must override every method",
      "Objects of a superclass should be replaceable with objects of a subclass without breaking the program",
      "All methods must be final",
      "Inheritance must be multilevel",
    ],
    correctIndex: 1,
    explanation:
      "Subtypes must honor the contract of the base type so that clients remain correct.",
  },
  {
    id: 56,
    concept: "SOLID",
    difficulty: "Advanced",
    question:
      "Interface Segregation Principle advises against:",
    options: [
      "Using multiple interfaces",
      "Fat interfaces that force clients to depend on methods they do not use",
      "Default methods",
      "Functional interfaces",
    ],
    correctIndex: 1,
    explanation:
      "Clients should not be forced to implement or depend on methods that are irrelevant to them.",
  },
  {
    id: 57,
    concept: "SOLID",
    difficulty: "Intermediate",
    question:
      "Dependency Inversion Principle says high-level modules should depend on:",
    options: [
      "Concrete low-level modules",
      "Abstractions (interfaces / abstract classes)",
      "Static methods only",
      "Global variables",
    ],
    correctIndex: 1,
    explanation:
      "Both high-level and low-level modules should depend on abstractions, improving decoupling and testability.",
  },
  {
    id: 58,
    concept: "SOLID",
    difficulty: "Beginner",
    question:
      "A class that both connects to a database and formats a PDF report most likely violates which principle?",
    options: ["OCP", "SRP", "LSP", "ISP"],
    correctIndex: 1,
    explanation:
      "Two reasons to change (DB logic and PDF logic) → Single Responsibility Principle violation.",
  },
  {
    id: 59,
    concept: "SOLID",
    difficulty: "Advanced",
    question:
      "Which principle is most directly supported by the Strategy design pattern?",
    options: ["SRP", "OCP", "LSP", "DIP"],
    correctIndex: 1,
    explanation:
      "Strategy lets you add new algorithms without modifying the context class → Open/Closed.",
  },
  {
    id: 60,
    concept: "SOLID",
    difficulty: "Intermediate",
    question:
      "Making a method final can help satisfy which principle in some designs?",
    options: [
      "ISP – by reducing interface size",
      "LSP – by preventing subclasses from breaking the contract via overriding",
      "DIP – by forcing dependency on concrete classes",
      "SRP – by adding more responsibilities",
    ],
    correctIndex: 1,
    explanation:
      "Preventing override can protect the base-class contract, aiding Liskov Substitution.",
  },

  // ── Constructors (61-66)
  {
    id: 61,
    concept: "Constructors",
    difficulty: "Beginner",
    question: "A constructor must:",
    options: [
      "Have a return type of void",
      "Have the same name as the class and no return type",
      "Be declared static",
      "Always be public",
    ],
    correctIndex: 1,
    explanation: "Constructors share the class name and do not declare a return type.",
  },
  {
    id: 62,
    concept: "Constructors",
    difficulty: "Intermediate",
    question:
      "What is constructor chaining?",
    options: [
      "Calling methods from a constructor",
      "A constructor calling another constructor of the same class via this()",
      "Inheritance of constructors",
      "Using multiple new keywords",
    ],
    correctIndex: 1,
    explanation:
      "this(...) must be the first statement and allows reuse of initialization logic.",
  },
  {
    id: 63,
    concept: "Constructors",
    difficulty: "Advanced",
    question:
      "Can a constructor be final, static, or abstract?",
    options: [
      "Yes, all three",
      "Only final",
      "No – none of those modifiers are allowed on constructors",
      "Only static",
    ],
    correctIndex: 2,
    explanation:
      "Constructors are not inherited, cannot be overridden, and are not ordinary methods, so those modifiers are illegal.",
  },
  {
    id: 64,
    concept: "Constructors",
    difficulty: "Intermediate",
    question:
      "What is the first action of a constructor body (unless this() is used)?",
    options: [
      "Initialize static fields",
      "Call the superclass constructor (explicitly or implicitly)",
      "Run instance initializer blocks after the body",
      "Allocate the object on the stack",
    ],
    correctIndex: 1,
    explanation:
      "Every constructor (except Object’s) begins by invoking a superclass constructor.",
  },
  {
    id: 65,
    concept: "Constructors",
    difficulty: "Beginner",
    question:
      "If you write any constructor yourself, does the compiler still supply a default no-arg constructor?",
    options: ["Yes", "No", "Only for abstract classes", "Only if the class is public"],
    correctIndex: 1,
    explanation:
      "The default constructor is added only when the class declares no constructors at all.",
  },
  {
    id: 66,
    concept: "Constructors",
    difficulty: "Advanced",
    question:
      "A private constructor is commonly used to:",
    options: [
      "Prevent instantiation from outside the class (Singleton, Factory, utility classes)",
      "Make the class abstract",
      "Allow multiple inheritance",
      "Force subclasses to call it",
    ],
    correctIndex: 0,
    explanation:
      "Private constructors hide the creation logic and are a building block of several creational patterns.",
  },

  // ── Static & Final (67-72)
  {
    id: 67,
    concept: "Static & Final",
    difficulty: "Beginner",
    question: "A static variable belongs to:",
    options: [
      "Each instance separately",
      "The class itself (one shared copy)",
      "The package",
      "The thread",
    ],
    correctIndex: 1,
    explanation: "Static members are associated with the class, not with any particular object.",
  },
  {
    id: 68,
    concept: "Static & Final",
    difficulty: "Intermediate",
    question:
      "Can a static method access instance variables directly?",
    options: [
      "Yes",
      "No – it needs an object reference",
      "Only if the variable is public",
      "Only inside the same package",
    ],
    correctIndex: 1,
    explanation:
      "Static methods have no this reference, so they cannot touch instance state without an explicit object.",
  },
  {
    id: 69,
    concept: "Static & Final",
    difficulty: "Beginner",
    question: "A final variable:",
    options: [
      "Can be reassigned anytime",
      "Must be assigned exactly once and cannot change afterward",
      "Is always static",
      "Can only hold primitive values",
    ],
    correctIndex: 1,
    explanation: "final means the reference (or primitive value) cannot be changed after initialization.",
  },
  {
    id: 70,
    concept: "Static & Final",
    difficulty: "Intermediate",
    question: "A final method:",
    options: [
      "Cannot be overloaded",
      "Cannot be overridden in a subclass",
      "Cannot be called",
      "Must be static",
    ],
    correctIndex: 1,
    explanation: "final methods lock the implementation so subclasses cannot change it.",
  },
  {
    id: 71,
    concept: "Static & Final",
    difficulty: "Advanced",
    question:
      "When does a static initialization block execute?",
    options: [
      "Every time an object is created",
      "Once, when the class is first loaded by the JVM",
      "Only when main is called",
      "At the end of the program",
    ],
    correctIndex: 1,
    explanation:
      "Static blocks run during class initialization, before any instance is created or static method is called.",
  },
  {
    id: 72,
    concept: "Static & Final",
    difficulty: "Intermediate",
    question: "A final class:",
    options: [
      "Cannot be instantiated",
      "Cannot be extended (subclassed)",
      "Cannot have methods",
      "Must contain only static members",
    ],
    correctIndex: 1,
    explanation: "final classes (e.g., String, Integer) seal the hierarchy.",
  },

  // ── Access Modifiers (73-76)
  {
    id: 73,
    concept: "Access Modifiers",
    difficulty: "Beginner",
    question:
      "Which modifier makes a member visible only inside its own class?",
    options: ["public", "protected", "default", "private"],
    correctIndex: 3,
    explanation: "private is the most restrictive access level.",
  },
  {
    id: 74,
    concept: "Access Modifiers",
    difficulty: "Intermediate",
    question:
      "A protected member is accessible from:",
    options: [
      "Only the same class",
      "Same package and subclasses (even in other packages)",
      "Anywhere",
      "Only subclasses in the same package",
    ],
    correctIndex: 1,
    explanation:
      "protected = package access + access from subclasses outside the package.",
  },
  {
    id: 75,
    concept: "Access Modifiers",
    difficulty: "Beginner",
    question:
      "What is the default (package-private) access level?",
    options: [
      "Visible everywhere",
      "Visible only within the same package",
      "Visible to subclasses only",
      "Invisible even inside the class",
    ],
    correctIndex: 1,
    explanation: "No modifier means the member is visible to all classes in the same package.",
  },
  {
    id: 76,
    concept: "Access Modifiers",
    difficulty: "Advanced",
    question:
      "Can a subclass in a different package access a protected instance field of its parent via a parent-type reference?",
    options: [
      "Yes, always",
      "No – access is allowed only through the subclass type (or inside the subclass code on its own instance)",
      "Only if the field is static",
      "Yes, if the field is final",
    ],
    correctIndex: 1,
    explanation:
      "The Java Language Specification restricts protected access from outside the package to the subclass’s own objects.",
  },

  // ── Overloading & Overriding (77-82)
  {
    id: 77,
    concept: "Overloading & Overriding",
    difficulty: "Beginner",
    question:
      "Changing only the return type of a method while keeping the same parameter list creates:",
    options: [
      "A valid overload",
      "A valid override",
      "A compile-time error",
      "A runtime exception",
    ],
    correctIndex: 2,
    explanation:
      "Return type is not part of the method signature for overloading purposes. Two methods that differ only in return type are illegal.",
  },
  {
    id: 78,
    concept: "Overloading & Overriding",
    difficulty: "Intermediate",
    question:
      "When overriding, the access level of the subclass method must be:",
    options: [
      "More restrictive than the parent",
      "The same or less restrictive than the parent",
      "Always public",
      "Always private",
    ],
    correctIndex: 1,
    explanation:
      "You may widen access (protected → public) but never narrow it (public → protected).",
  },
  {
    id: 79,
    concept: "Overloading & Overriding",
    difficulty: "Advanced",
    question:
      "Can you overload a method by changing only the exception list in the throws clause?",
    options: ["Yes", "No", "Only for checked exceptions", "Only for RuntimeException"],
    correctIndex: 1,
    explanation:
      "The throws clause is not part of the method signature used for overloading resolution.",
  },
  {
    id: 80,
    concept: "Overloading & Overriding",
    difficulty: "Intermediate",
    question:
      "Which methods cannot be overridden?",
    options: [
      "public methods",
      "final, static, and private methods",
      "protected methods",
      "methods with covariant return types",
    ],
    correctIndex: 1,
    explanation:
      "final prevents overriding, static methods are hidden, private methods are not visible to subclasses.",
  },
  {
    id: 81,
    concept: "Overloading & Overriding",
    difficulty: "Beginner",
    question:
      "Overloading occurs in:",
    options: [
      "A single class (or between parent and child with different signatures)",
      "Only across inheritance hierarchies",
      "Only inside interfaces",
      "Only with static methods",
    ],
    correctIndex: 0,
    explanation:
      "You can overload methods within the same class; inheritance is not required.",
  },
  {
    id: 82,
    concept: "Overloading & Overriding",
    difficulty: "Advanced",
    question:
      "If a subclass method has the same name and parameters as a parent method but a different (incompatible) return type, the result is:",
    options: [
      "Overloading",
      "Overriding with covariant return",
      "A compile-time error",
      "Runtime polymorphism",
    ],
    correctIndex: 2,
    explanation:
      "Unless the return type is a subtype (covariant), the signatures clash and the code fails to compile.",
  },

  // ── Abstract Classes (83-86)
  {
    id: 83,
    concept: "Abstract Classes",
    difficulty: "Beginner",
    question:
      "An abstract method must be:",
    options: [
      "Declared inside an abstract class or interface and have no body",
      "Static",
      "Final",
      "Private",
    ],
    correctIndex: 0,
    explanation:
      "Abstract methods end with a semicolon and leave the implementation to concrete subclasses.",
  },
  {
    id: 84,
    concept: "Abstract Classes",
    difficulty: "Intermediate",
    question:
      "Can an abstract class implement only some methods of an interface?",
    options: ["No", "Yes", "Only if the interface has default methods", "Only in Java 9+"],
    correctIndex: 1,
    explanation:
      "The remaining methods stay abstract and must be implemented by concrete subclasses.",
  },
  {
    id: 85,
    concept: "Abstract Classes",
    difficulty: "Advanced",
    question:
      "Why might you choose an abstract class over an interface?",
    options: [
      "You need to share state (fields) and concrete method implementations among subclasses",
      "You need multiple inheritance of type",
      "You want only constants",
      "Abstract classes are always faster",
    ],
    correctIndex: 0,
    explanation:
      "Abstract classes can hold instance fields and non-public methods; interfaces cannot (pre-Java 9 private methods).",
  },
  {
    id: 86,
    concept: "Abstract Classes",
    difficulty: "Beginner",
    question:
      "Is it legal to have a constructor in an abstract class?",
    options: ["No", "Yes", "Only a public one", "Only a private one"],
    correctIndex: 1,
    explanation:
      "Constructors are used by subclasses via super(...).",
  },

  // ── Packages (87-90)
  {
    id: 87,
    concept: "Packages",
    difficulty: "Beginner",
    question:
      "The package statement must appear:",
    options: [
      "After all import statements",
      "As the first non-comment statement in the source file",
      "Anywhere in the file",
      "Only in interfaces",
    ],
    correctIndex: 1,
    explanation: "package is the very first statement (comments and blank lines may precede it).",
  },
  {
    id: 88,
    concept: "Packages",
    difficulty: "Intermediate",
    question:
      "What does import java.util.*; do?",
    options: [
      "Imports only the List interface",
      "Imports all public types from the java.util package (not sub-packages)",
      "Imports the entire Java standard library",
      "Creates a dependency on every class in util at runtime",
    ],
    correctIndex: 1,
    explanation:
      "The wildcard imports types from that exact package; sub-packages need their own import.",
  },
  {
    id: 89,
    concept: "Packages",
    difficulty: "Beginner",
    question:
      "Which of the following is a recommended package naming convention?",
    options: [
      "Uppercase names",
      "Reverse domain name (com.company.project)",
      "Single-letter names",
      "Names starting with a digit",
    ],
    correctIndex: 1,
    explanation: "Reverse-DNS naming avoids collisions across organizations.",
  },
  {
    id: 90,
    concept: "Packages",
    difficulty: "Advanced",
    question:
      "If two classes with the same simple name exist in different packages, how do you use both in one file?",
    options: [
      "You cannot",
      "Import one and use the fully-qualified name for the other",
      "Use import static",
      "Rename one class at runtime",
    ],
    correctIndex: 1,
    explanation:
      "Only one of them can be imported by simple name; the other must be referenced with its full package path.",
  },

  // ── Inner Classes (91-94)
  {
    id: 91,
    concept: "Inner Classes",
    difficulty: "Intermediate",
    question:
      "A non-static inner class:",
    options: [
      "Can be instantiated without an outer instance",
      "Holds an implicit reference to an instance of the outer class",
      "Cannot access private members of the outer class",
      "Must be declared public",
    ],
    correctIndex: 1,
    explanation:
      "You need an outer instance: outer.new Inner(). The inner object can touch all members of that outer instance.",
  },
  {
    id: 92,
    concept: "Inner Classes",
    difficulty: "Beginner",
    question:
      "A static nested class:",
    options: [
      "Requires an outer instance",
      "Does not hold a reference to an outer instance and can be instantiated independently",
      "Cannot have static members",
      "Is the same as a local class",
    ],
    correctIndex: 1,
    explanation:
      "Static nested classes behave like top-level classes but are nested for packaging/encapsulation reasons.",
  },
  {
    id: 93,
    concept: "Inner Classes",
    difficulty: "Advanced",
    question:
      "Anonymous inner classes are commonly used to:",
    options: [
      "Create multiple named subclasses",
      "Provide a one-time implementation of an interface or abstract class (e.g., event listeners)",
      "Replace all lambda expressions",
      "Declare static fields",
    ],
    correctIndex: 1,
    explanation:
      "They let you write a quick inline implementation without a separate .java file.",
  },
  {
    id: 94,
    concept: "Inner Classes",
    difficulty: "Intermediate",
    question:
      "A local class is defined:",
    options: [
      "At package level",
      "Inside a method or block",
      "Only inside interfaces",
      "As a top-level public class",
    ],
    correctIndex: 1,
    explanation: "Local classes have method scope and can capture final or effectively-final local variables.",
  },

  // ── Design Patterns (95-100)
  {
    id: 95,
    concept: "Design Patterns",
    difficulty: "Beginner",
    question:
      "The Singleton pattern ensures:",
    options: [
      "Many instances of a class",
      "Exactly one instance of a class with a global access point",
      "No instances can be created",
      "Instances are created only on the stack",
    ],
    correctIndex: 1,
    explanation: "Classic use case: configuration objects, connection pools, loggers.",
  },
  {
    id: 96,
    concept: "Design Patterns",
    difficulty: "Intermediate",
    question:
      "The Factory Method pattern is primarily used to:",
    options: [
      "Destroy objects",
      "Create objects without exposing the instantiation logic to the client",
      "Force a class to have only one method",
      "Implement multiple inheritance",
    ],
    correctIndex: 1,
    explanation:
      "Clients depend on a creator abstraction; concrete creators decide which product to instantiate.",
  },
  {
    id: 97,
    concept: "Design Patterns",
    difficulty: "Intermediate",
    question:
      "Observer pattern defines:",
    options: [
      "A one-to-one relationship only",
      "A one-to-many dependency so that when one object changes state, all its dependents are notified",
      "A way to hide a complex subsystem",
      "A way to add responsibilities dynamically",
    ],
    correctIndex: 1,
    explanation: "Classic publish-subscribe / event-listener design.",
  },
  {
    id: 98,
    concept: "Design Patterns",
    difficulty: "Advanced",
    question:
      "Which pattern lets you attach additional responsibilities to an object dynamically?",
    options: ["Singleton", "Decorator", "Factory", "Adapter"],
    correctIndex: 1,
    explanation:
      "Decorator wraps an object and adds behavior while keeping the same interface.",
  },
  {
    id: 99,
    concept: "Design Patterns",
    difficulty: "Beginner",
    question:
      "The Adapter pattern is used when:",
    options: [
      "You need only one instance",
      "You need to convert the interface of a class into another interface clients expect",
      "You need to notify many objects",
      "You need to create families of related objects",
    ],
    correctIndex: 1,
    explanation: "Adapter makes incompatible interfaces work together.",
  },
  {
    id: 100,
    concept: "Design Patterns",
    difficulty: "Advanced",
    question:
      "Strategy pattern enables:",
    options: [
      "Selecting an algorithm’s implementation at runtime",
      "Guaranteeing a single instance",
      "Adding methods to a sealed class",
      "Automatic garbage collection",
    ],
    correctIndex: 0,
    explanation:
      "You encapsulate each algorithm in its own class and make them interchangeable via a common interface.",
  },

  // ── Generics OOP (101-106)
  {
    id: 101,
    concept: "Generics OOP",
    difficulty: "Beginner",
    question:
      "What is the main benefit of using generics?",
    options: [
      "Faster runtime execution",
      "Compile-time type safety and elimination of most casts",
      "Ability to create objects without new",
      "Automatic parallelization",
    ],
    correctIndex: 1,
    explanation:
      "Generics let the compiler prove that you won’t insert the wrong type into a collection, for example.",
  },
  {
    id: 102,
    concept: "Generics OOP",
    difficulty: "Intermediate",
    question:
      "What does type erasure mean?",
    options: [
      "Generic type information is removed at runtime; the compiled code uses raw types",
      "The compiler deletes unused classes",
      "Objects are erased from the heap",
      "Only primitive types are allowed",
    ],
    correctIndex: 0,
    explanation:
      "At runtime a List<String> is just a List; the String bound exists only for the compiler.",
  },
  {
    id: 103,
    concept: "Generics OOP",
    difficulty: "Advanced",
    question:
      "What is the difference between <? extends T> and <? super T>?",
    options: [
      "They are identical",
      "extends is for reading (producer), super is for writing (consumer) – PECS",
      "extends is for writing, super is for reading",
      "Both only work with interfaces",
    ],
    correctIndex: 1,
    explanation:
      "Producer-Extends, Consumer-Super (PECS) is the mnemonic for wildcard usage.",
  },
  {
    id: 104,
    concept: "Generics OOP",
    difficulty: "Intermediate",
    question:
      "Can you create an array of a generic type parameter, e.g., new T[10]?",
    options: [
      "Yes",
      "No – generic array creation is illegal because of type erasure",
      "Only for bounded types",
      "Only inside static methods",
    ],
    correctIndex: 1,
    explanation:
      "The compiler cannot guarantee array store safety after erasure, so it forbids generic array creation.",
  },
  {
    id: 105,
    concept: "Generics OOP",
    difficulty: "Beginner",
    question:
      "In class Box<T>, T is called a:",
    options: ["Wildcard", "Type parameter", "Raw type", "Primitive"],
    correctIndex: 1,
    explanation: "T is a formal type parameter that will be replaced by a concrete type argument.",
  },
  {
    id: 106,
    concept: "Generics OOP",
    difficulty: "Advanced",
    question:
      "A raw type (e.g., List without <...>) :",
    options: [
      "Is the preferred style in modern Java",
      "Exists for backward compatibility and bypasses generic type checking",
      "Is required for primitive collections",
      "Provides better performance",
    ],
    correctIndex: 1,
    explanation:
      "Raw types disable generic checking and should be avoided in new code.",
  },

  // ── Exception Handling OOP (107-112)
  {
    id: 107,
    concept: "Exception Handling OOP",
    difficulty: "Beginner",
    question:
      "All exceptions in Java inherit ultimately from:",
    options: ["Error", "Exception", "Throwable", "RuntimeException"],
    correctIndex: 2,
    explanation: "Throwable is the root of the hierarchy; Error and Exception are its direct children.",
  },
  {
    id: 108,
    concept: "Exception Handling OOP",
    difficulty: "Intermediate",
    question:
      "Checked exceptions must be:",
    options: [
      "Ignored",
      "Declared in a throws clause or handled with try-catch",
      "Only subclasses of Error",
      "Always RuntimeExceptions",
    ],
    correctIndex: 1,
    explanation:
      "The compiler enforces handling or declaration of checked exceptions.",
  },
  {
    id: 109,
    concept: "Exception Handling OOP",
    difficulty: "Beginner",
    question:
      "RuntimeException and its subclasses are:",
    options: [
      "Checked exceptions",
      "Unchecked exceptions",
      "Errors",
      "Interfaces",
    ],
    correctIndex: 1,
    explanation:
      "Unchecked exceptions do not need to be declared or caught (though they can be).",
  },
  {
    id: 110,
    concept: "Exception Handling OOP",
    difficulty: "Advanced",
    question:
      "When creating a custom checked exception you typically extend:",
    options: ["RuntimeException", "Error", "Exception", "Throwable directly"],
    correctIndex: 2,
    explanation:
      "Extending Exception (but not RuntimeException) makes your exception checked.",
  },
  {
    id: 111,
    concept: "Exception Handling OOP",
    difficulty: "Intermediate",
    question:
      "try-with-resources requires the resource to implement:",
    options: ["Closeable or AutoCloseable", "Serializable", "Cloneable", "Comparable"],
    correctIndex: 0,
    explanation:
      "AutoCloseable (and the older Closeable) define the close() method that is called automatically.",
  },
  {
    id: 112,
    concept: "Exception Handling OOP",
    difficulty: "Advanced",
    question:
      "If a subclass overrides a method, the overridden method may:",
    options: [
      "Throw any new checked exceptions not declared by the parent",
      "Only throw the same or fewer checked exceptions (or subclasses of them)",
      "Never throw any exception",
      "Throw Errors only",
    ],
    correctIndex: 1,
    explanation:
      "The subclass method must be compatible with the parent’s throws clause for checked exceptions.",
  },

  // ── Extra mixed advanced (113-120)
  {
    id: 113,
    concept: "Polymorphism",
    difficulty: "Advanced",
    question:
      "What is the output of the following?\nclass A { void m() { System.out.print(\"A\"); } }\nclass B extends A { void m() { System.out.print(\"B\"); } }\nA obj = new B(); obj.m();",
    options: ["A", "B", "AB", "Compilation error"],
    correctIndex: 1,
    explanation: "Dynamic dispatch calls B.m() because the actual object is a B.",
    codeSnippet: `class A { void m() { System.out.print("A"); } }
class B extends A { void m() { System.out.print("B"); } }
A obj = new B();
obj.m();`,
  },
  {
    id: 114,
    concept: "Inheritance",
    difficulty: "Advanced",
    question:
      "If a parent class has a final method, a child class:",
    options: [
      "Can override it",
      "Cannot override it",
      "Can overload it but the final method disappears",
      "Must re-declare it as final",
    ],
    correctIndex: 1,
    explanation: "final methods are frozen; subclasses cannot change their implementation.",
  },
  {
    id: 115,
    concept: "Encapsulation",
    difficulty: "Advanced",
    question:
      "Immutable objects (e.g., String) achieve their immutability mainly through:",
    options: [
      "Making all fields public",
      "private final fields, no setters, and defensive copies",
      "Using only static methods",
      "Inheriting from a special Immutable class",
    ],
    correctIndex: 1,
    explanation:
      "Classic immutable design: final fields + no mutators + careful handling of mutable components.",
  },
  {
    id: 116,
    concept: "Interfaces",
    difficulty: "Advanced",
    question:
      "Since Java 9, interfaces can contain:",
    options: [
      "Only public abstract methods",
      "private methods (instance and static) to share code among default methods",
      "Protected fields",
      "Constructors",
    ],
    correctIndex: 1,
    explanation:
      "Private interface methods help keep default-method implementations DRY without exposing helpers.",
  },
  {
    id: 117,
    concept: "Design Patterns",
    difficulty: "Intermediate",
    question:
      "The Builder pattern is especially useful when:",
    options: [
      "An object has many optional parameters and you want readable construction",
      "You need only one instance",
      "You need to notify observers",
      "You need to adapt interfaces",
    ],
    correctIndex: 0,
    explanation:
      "Builder replaces telescoping constructors with a fluent, step-by-step API.",
  },
  {
    id: 118,
    concept: "SOLID",
    difficulty: "Advanced",
    question:
      "A classic violation of the Liskov Substitution Principle is:",
    options: [
      "A Square class that extends Rectangle and overrides setWidth/setHeight to keep sides equal, breaking client expectations",
      "Using an interface instead of a concrete class",
      "Making a method final",
      "Adding a default method to an interface",
    ],
    correctIndex: 0,
    explanation:
      "Clients of Rectangle expect independent width and height; Square violates that contract.",
  },
  {
    id: 119,
    concept: "Classes & Objects",
    difficulty: "Advanced",
    question:
      "What does the equals() method in Object test by default?",
    options: [
      "Value equality of all fields",
      "Reference equality (same object in memory)",
      "Hash-code equality",
      "Class-name equality",
    ],
    correctIndex: 1,
    explanation:
      "Object.equals() is the same as ==. Classes that care about value equality must override it (and hashCode).",
  },
  {
    id: 120,
    concept: "Abstraction",
    difficulty: "Intermediate",
    question:
      "Which statement about abstract classes and interfaces is true in modern Java (17+)?",
    options: [
      "Interfaces can have instance fields",
      "Abstract classes can have constructors; interfaces cannot",
      "Interfaces cannot have static methods",
      "A class may extend multiple abstract classes",
    ],
    correctIndex: 1,
    explanation:
      "Interfaces still cannot declare constructors or instance fields (only constants). Abstract classes can.",
  },
];

/* ─────────────────────────────────────────────
   Helper Components
───────────────────────────────────────────── */
const DifficultyBadge = ({ d }: { d: Difficulty }) => {
  const colors =
    d === "Beginner"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : d === "Intermediate"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
        : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors}`}>
      {d}
    </span>
  );
};

const ConceptBadge = ({ c }: { c: Concept }) => (
  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
    {c}
  </span>
);

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
export default function OopPracticePage() {
  const [activeTab, setActiveTab] = useState<"concepts" | "practice" | "quiz">("concepts");
  const [expandedConcept, setExpandedConcept] = useState<Concept | null>("Classes & Objects");
  const [selectedConcept, setSelectedConcept] = useState<Concept | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set());
  const [shuffledIds, setShuffledIds] = useState<number[]>([]);
  const [quizMode, setQuizMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (selectedConcept !== "All" && q.concept !== selectedConcept) return false;
      if (selectedDifficulty !== "All" && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const s = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(s) ||
          q.concept.toLowerCase().includes(s) ||
          q.explanation.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [selectedConcept, selectedDifficulty, searchQuery]);

  // Initialize / reshuffle
  const reshuffle = useCallback(() => {
    const ids = filteredQuestions.map((q) => q.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledIds(ids);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setAnsweredIds(new Set());
    setScore({ correct: 0, total: 0 });
  }, [filteredQuestions]);

  useEffect(() => {
    reshuffle();
  }, [filteredQuestions, reshuffle]);

  const currentQuestion = useMemo(() => {
    if (shuffledIds.length === 0) return null;
    const id = shuffledIds[currentQIndex];
    return QUESTIONS.find((q) => q.id === id) ?? null;
  }, [shuffledIds, currentQIndex]);

  const handleSelectOption = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null || !currentQuestion || showAnswer) return;
    setShowAnswer(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    setAnsweredIds((prev) => new Set(prev).add(currentQuestion.id));
  };

  const handleNext = () => {
    if (currentQIndex < shuffledIds.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((i) => i - 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const allConcepts = useMemo(
    () => Array.from(new Set(QUESTIONS.map((q) => q.concept))),
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              Java Practice Arena
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Object-Oriented Programming
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Master every OOP concept with visual diagrams, clear explanations, and{" "}
            <span className="font-semibold text-foreground">{QUESTIONS.length}+ unique questions</span>{" "}
            covering Classes, Encapsulation, Inheritance, Polymorphism, SOLID, Design Patterns and more.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("concepts")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "concepts"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Visual Concepts
            </button>
            <button
              onClick={() => {
                setActiveTab("practice");
                setQuizMode(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "practice"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <Target className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Practice Mode
            </button>
            <button
              onClick={() => {
                setActiveTab("quiz");
                setQuizMode(true);
                reshuffle();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "quiz"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <Brain className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Quiz Challenge
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-violet-500" />
            <span className="text-muted-foreground">Concepts:</span>
            <span className="font-semibold">{CONCEPTS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-500" />
            <span className="text-muted-foreground">Questions:</span>
            <span className="font-semibold">{QUESTIONS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground">Score:</span>
            <span className="font-semibold">
              {score.correct}/{score.total}
              {score.total > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({Math.round((score.correct / score.total) * 100)}%)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ═══════════ CONCEPTS TAB ═══════════ */}
        {activeTab === "concepts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                OOP Concepts – Visual Guide
              </h2>
              <p className="text-sm text-muted-foreground">
                Click any card to expand diagrams, key points & Java examples
              </p>
            </div>

            <div className="grid gap-4">
              {CONCEPTS.map((c) => {
                const isOpen = expandedConcept === c.id;
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/5"
                        : "border-border bg-card hover:border-violet-500/30 hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedConcept(isOpen ? null : c.id)}
                      className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isOpen
                            ? "bg-violet-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base sm:text-lg">{c.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{c.short}</div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-violet-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-border/50 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {c.details}
                        </p>

                        {/* Visual diagram */}
                        <div className="rounded-xl border border-border bg-background/80 p-4 sm:p-6">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Visual Sketch
                          </div>
                          {c.visual}
                        </div>

                        {/* Key points */}
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Key Points
                          </div>
                          <ul className="grid sm:grid-cols-2 gap-1.5">
                            {c.keyPoints.map((kp, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Code example */}
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" /> Java Example
                          </div>
                          <pre className="rounded-xl bg-zinc-950 text-zinc-100 dark:bg-zinc-900 p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono border border-zinc-800">
                            <code>{c.javaExample}</code>
                          </pre>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedConcept(c.id);
                            setActiveTab("practice");
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          Practice questions on {c.title}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════ PRACTICE / QUIZ TAB ═══════════ */}
        {(activeTab === "practice" || activeTab === "quiz") && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedConcept}
                    onChange={(e) =>
                      setSelectedConcept(e.target.value as Concept | "All")
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  >
                    <option value="All">All Concepts</option>
                    {allConcepts.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) =>
                      setSelectedDifficulty(e.target.value as Difficulty | "All")
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <button
                  onClick={reshuffle}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors"
                  title="Shuffle questions"
                >
                  <Shuffle className="w-4 h-4" />
                  Shuffle
                </button>

                <button
                  onClick={() => {
                    setScore({ correct: 0, total: 0 });
                    setAnsweredIds(new Set());
                    setSelectedOption(null);
                    setShowAnswer(false);
                    setCurrentQIndex(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background text-sm hover:bg-muted transition-colors"
                  title="Reset progress"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing <strong className="text-foreground">{filteredQuestions.length}</strong>{" "}
                  question{filteredQuestions.length !== 1 ? "s" : ""}
                  {shuffledIds.length > 0 && (
                    <>
                      {" "}
                      · Question{" "}
                      <strong className="text-foreground">
                        {currentQIndex + 1}
                      </strong>{" "}
                      of {shuffledIds.length}
                    </>
                  )}
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showExplanation}
                    onChange={(e) => setShowExplanation(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-xs">Show explanations</span>
                </label>
              </div>
            </div>

            {/* Question card */}
            {currentQuestion ? (
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
                  <ConceptBadge c={currentQuestion.concept} />
                  <DifficultyBadge d={currentQuestion.difficulty} />
                  <span className="text-xs text-muted-foreground ml-auto">
                    ID #{currentQuestion.id}
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  <h3 className="text-base sm:text-lg font-semibold leading-snug whitespace-pre-wrap">
                    {currentQuestion.question}
                  </h3>

                  {currentQuestion.codeSnippet && (
                    <pre className="rounded-xl bg-zinc-950 text-zinc-100 dark:bg-zinc-900 p-4 overflow-x-auto text-xs sm:text-sm font-mono border border-zinc-800">
                      <code>{currentQuestion.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;
                      let optionStyle =
                        "border-border bg-background hover:border-violet-400/60 hover:bg-violet-500/5";

                      if (showAnswer) {
                        if (isCorrect) {
                          optionStyle =
                            "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                        } else if (isSelected && !isCorrect) {
                          optionStyle =
                            "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-300";
                        } else {
                          optionStyle = "border-border bg-background opacity-60";
                        }
                      } else if (isSelected) {
                        optionStyle =
                          "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={showAnswer}
                          className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all text-sm ${optionStyle}`}
                        >
                          <span
                            className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                              showAnswer && isCorrect
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : showAnswer && isSelected && !isCorrect
                                  ? "border-rose-500 bg-rose-500 text-white"
                                  : isSelected
                                    ? "border-violet-500 bg-violet-500 text-white"
                                    : "border-muted-foreground/40"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 pt-0.5">{opt}</span>
                          {showAnswer && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showAnswer && showExplanation && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-sm leading-relaxed">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">
                          Explanation:{" "}
                        </span>
                        {currentQuestion.explanation}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {!showAnswer ? (
                      <button
                        onClick={handleCheck}
                        disabled={selectedOption === null}
                        className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-500/20"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        disabled={currentQIndex >= shuffledIds.length - 1}
                        className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-500/20"
                      >
                        Next Question
                        <ArrowRight className="w-4 h-4 inline ml-1.5 -mt-0.5" />
                      </button>
                    )}

                    <button
                      onClick={handlePrev}
                      disabled={currentQIndex === 0}
                      className="px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {showAnswer && (
                      <span
                        className={`text-sm font-medium ml-auto ${
                          selectedOption === currentQuestion.correctIndex
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {selectedOption === currentQuestion.correctIndex
                          ? "✓ Correct!"
                          : "✗ Incorrect"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                <EyeOff className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No questions match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedConcept("All");
                    setSelectedDifficulty("All");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Progress strip */}
            {shuffledIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {shuffledIds.map((id, i) => {
                  const answered = answeredIds.has(id);
                  const isCurrent = i === currentQIndex;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setCurrentQIndex(i);
                        setSelectedOption(null);
                        setShowAnswer(false);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isCurrent
                          ? "bg-violet-500 scale-125 ring-2 ring-violet-500/40"
                          : answered
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/25 hover:bg-muted-foreground/40"
                      }`}
                      title={`Question ${i + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer note */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-muted-foreground">
          Java OOP Practice · {QUESTIONS.length} questions · Covers all major concepts ·
        </div>
      </footer>
    </div>
  );
}