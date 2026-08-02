"use client";

import { useState, useRef, type ReactNode, type ComponentType } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Boxes,
  Shield,
  GitBranch,
  Repeat,
  EyeOff,
  Download,
  CheckCircle2,
  Code2,
  Map as MapIcon,
  ListChecks,
  Lightbulb,
  Rocket,
  BookOpen,
  Layers,
  Link2,
  Puzzle,
  X,
  ChevronRight,
  Terminal,
  FileText,
  Compass,
} from "lucide-react";

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ============================================================
   THEME STYLES — CSS custom properties, flipped purely via
   the `.dark` class on <html> (ThemeProvider already handles
   the toggle in the header). No JS theme reads here.
   ============================================================ */
function ThemeVars() {
  return (
    <style jsx global>{`
      .oop-page {
        --page-bg: #f7f8fa;
        --panel-bg: #ffffff;
        --panel-alt: #f2f3f6;
        --border: #e3e5ea;
        --text-primary: #14171f;
        --text-secondary: #565c6b;
        --accent: #b45309;
        --accent-soft: #fef3e2;
        --accent-strong: #92400e;
        --code-bg: #0d1117;
        --code-text: #e6edf3;
        --chip-bg: #eef0f4;
        --shadow: 0 1px 2px rgba(20, 23, 31, 0.04), 0 8px 24px rgba(20, 23, 31, 0.05);
      }
      .dark .oop-page {
        --page-bg: #0a0e14;
        --panel-bg: #0d1117;
        --panel-alt: #10151d;
        --border: #1f2733;
        --text-primary: #eef1f6;
        --text-secondary: #93a0b4;
        --accent: #34d399;
        --accent-soft: rgba(52, 211, 153, 0.1);
        --accent-strong: #6ee7b7;
        --code-bg: #05070b;
        --code-text: #d5f5e6;
        --chip-bg: #131a24;
        --shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 12px 32px rgba(0, 0, 0, 0.35);
      }
    `}</style>
  );
}

/* ============================================================
   SMALL PRIMITIVES
   ============================================================ */
function TerminalChrome({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 border-b"
      style={{ borderColor: "var(--border)", background: "var(--panel-alt)" }}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
      <span
        className="ml-2 text-xs font-mono tracking-tight"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </span>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
    >
      <TerminalChrome label={title} />
      <pre
        className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono"
        style={{ background: "var(--code-bg)", color: "var(--code-text)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Icon size={16} />
        </span>
        <span
          className="text-xs font-mono uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </span>
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {desc && (
        <p
          className="mt-2 max-w-2xl text-sm sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {desc}
        </p>
      )}
    </motion.div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 ${className}`}
      style={{
        background: "var(--panel-bg)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   BLUEPRINT-STYLE SVG DIAGRAMS
   ============================================================ */
function BlueprintGrid() {
  return (
    <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path
        d="M 24 0 L 0 0 0 24"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
    </pattern>
  );
}

function ClassBoxDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
      </defs>
      <rect width="640" height="260" fill="url(#bp-grid)" />
      <rect
        x="220"
        y="30"
        width="200"
        height="200"
        rx="6"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <line x1="220" y1="80" x2="420" y2="80" stroke="var(--border)" strokeWidth="1.5" />
      <line x1="220" y1="150" x2="420" y2="150" stroke="var(--border)" strokeWidth="1.5" />
      <text
        x="320"
        y="60"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="var(--text-primary)"
        fontFamily="monospace"
      >
        Car
      </text>
      <text x="235" y="102" fontSize="12" fill="var(--text-secondary)" fontFamily="monospace">
        - brand: String
      </text>
      <text x="235" y="120" fontSize="12" fill="var(--text-secondary)" fontFamily="monospace">
        - speed: int
      </text>
      <text x="235" y="138" fontSize="12" fill="var(--text-secondary)" fontFamily="monospace">
        - fuel: double
      </text>
      <text x="235" y="172" fontSize="12" fill="var(--accent)" fontFamily="monospace">
        + accelerate()
      </text>
      <text x="235" y="190" fontSize="12" fill="var(--accent)" fontFamily="monospace">
        + brake()
      </text>
      <text x="235" y="208" fontSize="12" fill="var(--accent)" fontFamily="monospace">
        + refuel()
      </text>
      <text
        x="320"
        y="245"
        textAnchor="middle"
        fontSize="11"
        fill="var(--text-secondary)"
        fontFamily="monospace"
      >
        class = blueprint · object = built instance
      </text>
    </svg>
  );
}

function EncapsulationDiagram() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
        </marker>
      </defs>
      <rect width="640" height="220" fill="url(#bp-grid)" />
      <circle
        cx="320"
        cy="110"
        r="90"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <rect
        x="270"
        y="80"
        width="100"
        height="60"
        rx="6"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <text
        x="320"
        y="105"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-primary)"
      >
        private
      </text>
      <text
        x="320"
        y="122"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-secondary)"
      >
        balance
      </text>
      <line
        x1="410"
        y1="110"
        x2="470"
        y2="110"
        stroke="var(--accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrow)"
      />
      <text x="480" y="105" fontSize="12" fontFamily="monospace" fill="var(--text-primary)">
        getBalance()
      </text>
      <text x="480" y="122" fontSize="12" fontFamily="monospace" fill="var(--text-primary)">
        deposit()
      </text>
      <text
        x="320"
        y="200"
        textAnchor="middle"
        fontSize="11"
        fill="var(--text-secondary)"
        fontFamily="monospace"
      >
        data hidden inside · access only through public methods
      </text>
    </svg>
  );
}

function InheritanceTreeDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
      </defs>
      <rect width="640" height="260" fill="url(#bp-grid)" />
      <rect
        x="270"
        y="20"
        width="100"
        height="46"
        rx="6"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="320"
        y="48"
        textAnchor="middle"
        fontSize="13"
        fontFamily="monospace"
        fontWeight="700"
        fill="var(--text-primary)"
      >
        Animal
      </text>
      <line x1="320" y1="66" x2="180" y2="130" stroke="var(--border)" strokeWidth="1.5" />
      <line x1="320" y1="66" x2="320" y2="130" stroke="var(--border)" strokeWidth="1.5" />
      <line x1="320" y1="66" x2="460" y2="130" stroke="var(--border)" strokeWidth="1.5" />
      {[
        { x: 130, label: "Dog" },
        { x: 270, label: "Cat" },
        { x: 410, label: "Bird" },
      ].map((n) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y="130"
            width="100"
            height="46"
            rx="6"
            fill="var(--panel-bg)"
            stroke="var(--text-secondary)"
            strokeWidth="1.5"
          />
          <text
            x={n.x + 50}
            y="158"
            textAnchor="middle"
            fontSize="13"
            fontFamily="monospace"
            fill="var(--text-primary)"
          >
            {n.label}
          </text>
        </g>
      ))}
      <text
        x="320"
        y="230"
        textAnchor="middle"
        fontSize="11"
        fill="var(--text-secondary)"
        fontFamily="monospace"
      >
        extends Animal · reuses fields &amp; methods, adds its own
      </text>
    </svg>
  );
}

function PolymorphismDiagram() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
      </defs>
      <rect width="640" height="220" fill="url(#bp-grid)" />
      <rect
        x="270"
        y="20"
        width="100"
        height="44"
        rx="6"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="320"
        y="47"
        textAnchor="middle"
        fontSize="12"
        fontFamily="monospace"
        fill="var(--text-primary)"
      >
        Shape.draw()
      </text>
      {[
        { x: 90, label: "Circle", note: "○" },
        { x: 260, label: "Square", note: "□" },
        { x: 430, label: "Triangle", note: "△" },
      ].map((n) => (
        <g key={n.label}>
          <line
            x1="320"
            y1="64"
            x2={n.x + 60}
            y2="120"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <rect
            x={n.x}
            y="120"
            width="120"
            height="60"
            rx="6"
            fill="var(--panel-bg)"
            stroke="var(--text-secondary)"
            strokeWidth="1.5"
          />
          <text
            x={n.x + 60}
            y="148"
            textAnchor="middle"
            fontSize="12"
            fontFamily="monospace"
            fill="var(--text-primary)"
          >
            {n.label}
          </text>
          <text
            x={n.x + 60}
            y="168"
            textAnchor="middle"
            fontSize="16"
            fill="var(--accent)"
          >
            {n.note}
          </text>
        </g>
      ))}
      <text
        x="320"
        y="205"
        textAnchor="middle"
        fontSize="11"
        fill="var(--text-secondary)"
        fontFamily="monospace"
      >
        one call, many shapes · each overrides draw() its own way
      </text>
    </svg>
  );
}

function AbstractionDiagram() {
  return (
    <svg viewBox="0 0 640 200" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
      </defs>
      <rect width="640" height="200" fill="url(#bp-grid)" />
      <rect
        x="80"
        y="60"
        width="180"
        height="70"
        rx="8"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="170"
        y="90"
        textAnchor="middle"
        fontSize="13"
        fontFamily="monospace"
        fill="var(--text-primary)"
      >
        pressBrakePedal()
      </text>
      <text
        x="170"
        y="110"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-secondary)"
      >
        (visible to driver)
      </text>
      <line
        x1="260"
        y1="95"
        x2="380"
        y2="95"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <rect
        x="380"
        y="40"
        width="200"
        height="110"
        rx="8"
        fill="var(--panel-alt)"
        stroke="var(--text-secondary)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <text
        x="480"
        y="65"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-secondary)"
      >
        hidden complexity
      </text>
      <text
        x="480"
        y="90"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-secondary)"
      >
        hydraulics · pads
      </text>
      <text
        x="480"
        y="112"
        textAnchor="middle"
        fontSize="11"
        fontFamily="monospace"
        fill="var(--text-secondary)"
      >
        sensors · ABS logic
      </text>
      <text
        x="320"
        y="185"
        textAnchor="middle"
        fontSize="11"
        fill="var(--text-secondary)"
        fontFamily="monospace"
      >
        expose the what, hide the how
      </text>
    </svg>
  );
}

function PillarsOverviewDiagram() {
  const pillars = [
    { label: "Encapsulation", x: 60 },
    { label: "Inheritance", x: 220 },
    { label: "Polymorphism", x: 380 },
    { label: "Abstraction", x: 540 },
  ];
  return (
    <svg viewBox="0 0 640 180" className="w-full h-auto">
      <defs>
        <BlueprintGrid />
      </defs>
      <rect width="640" height="180" fill="url(#bp-grid)" />
      <rect
        x="20"
        y="20"
        width="600"
        height="50"
        rx="8"
        fill="var(--panel-bg)"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <text
        x="320"
        y="52"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="monospace"
        fill="var(--text-primary)"
      >
        Object-Oriented Programming
      </text>
      {pillars.map((p) => (
        <g key={p.label}>
          <line
            x1="320"
            y1="70"
            x2={p.x + 55}
            y2="110"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <rect
            x={p.x}
            y="110"
            width="110"
            height="50"
            rx="6"
            fill="var(--panel-alt)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
          <text
            x={p.x + 55}
            y="140"
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
            fill="var(--text-primary)"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   CONTENT DATA
   ============================================================ */
const pillars = [
  {
    key: "encapsulation",
    title: "Encapsulation",
    icon: Shield,
    tagline: "Bundle data + behavior, hide the internals.",
    definition:
      "Encapsulation means wrapping fields and the methods that operate on them inside a single class, and restricting direct access to the fields from outside. The class exposes only what's needed through public methods (getters/setters), while the actual data stays private.",
    why: "Without it, any part of a program could reach in and corrupt an object's state directly. Encapsulation protects invariants — e.g. a bank balance can never be set to a negative number if the setter enforces that rule.",
    analogy:
      "Think of a medicine capsule: the drug (data) is sealed inside, and you interact with it only through the outer shell (methods) — you never touch the raw powder directly.",
    diagram: EncapsulationDiagram,
    code: `public class BankAccount {
    // fields are private — hidden from outside
    private double balance;

    public BankAccount(double openingBalance) {
        this.balance = openingBalance;
    }

    // public methods control access to the data
    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        } else {
            System.out.println("Invalid withdrawal");
        }
    }
}

// usage
BankAccount acc = new BankAccount(1000);
acc.deposit(500);
acc.withdraw(200);
System.out.println(acc.getBalance()); // 1300.0
// acc.balance = -50; // ❌ not allowed, balance is private`,
  },
  {
    key: "inheritance",
    title: "Inheritance",
    icon: GitBranch,
    tagline: "A class acquires the fields and methods of another.",
    definition:
      "Inheritance lets one class (subclass/child) reuse the fields and methods of another class (superclass/parent) using the extends keyword, and add or override behavior of its own.",
    why: "It avoids duplicating code across related classes. Common behavior lives once in the parent; each child only adds what makes it different.",
    analogy:
      "A Dog and a Cat are both Animals — they share eat() and sleep(), but each has its own bark() or meow().",
    diagram: InheritanceTreeDiagram,
    code: `class Animal {
    protected String name;
    Animal(String name) { this.name = name; }

    void eat() {
        System.out.println(name + " is eating");
    }
}

class Dog extends Animal {
    Dog(String name) { super(name); } // call parent constructor

    void bark() {
        System.out.println(name + " says Woof!");
    }
}

// usage
Dog d = new Dog("Rex");
d.eat();   // inherited from Animal
d.bark();  // defined in Dog

// Java supports single class inheritance, but multiple
// interface inheritance:
interface Flyable { void fly(); }
interface Swimmable { void swim(); }

class Duck extends Animal implements Flyable, Swimmable {
    Duck(String name) { super(name); }
    public void fly() { System.out.println(name + " flies"); }
    public void swim() { System.out.println(name + " swims"); }
}`,
  },
  {
    key: "polymorphism",
    title: "Polymorphism",
    icon: Repeat,
    tagline: "One interface, many implementations.",
    definition:
      "Polymorphism ('many forms') lets the same method call behave differently depending on the object it's called on. Java supports it two ways: compile-time (method overloading) and runtime (method overriding).",
    why: "It lets you write code against a general type (Shape) and have it automatically do the right thing for whatever concrete object (Circle, Square) is passed in — no giant if/else chains checking types.",
    analogy:
      "Pressing 'print' behaves differently on a laser printer vs a photo printer, but you call the same print() action either way.",
    diagram: PolymorphismDiagram,
    code: `abstract class Shape {
    abstract double area(); // runtime polymorphism
}

class Circle extends Shape {
    double radius;
    Circle(double r) { radius = r; }
    double area() { return Math.PI * radius * radius; }
}

class Square extends Shape {
    double side;
    Square(double s) { side = s; }
    double area() { return side * side; }
}

// runtime polymorphism — decided at runtime based on actual object
Shape[] shapes = { new Circle(3), new Square(4) };
for (Shape s : shapes) {
    System.out.println(s.area()); // calls the correct override
}

// compile-time polymorphism — method overloading
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
}`,
  },
  {
    key: "abstraction",
    title: "Abstraction",
    icon: EyeOff,
    tagline: "Show what an object does, hide how it does it.",
    definition:
      "Abstraction means exposing only the essential features of an object and hiding the implementation details. In Java this is done through abstract classes and interfaces.",
    why: "It lets you design against a contract instead of a concrete implementation, so the implementation can change later without breaking the code that uses it.",
    analogy:
      "Driving a car — you press the brake pedal (the 'what'); you never need to know about the hydraulics or ABS sensors underneath (the 'how').",
    diagram: AbstractionDiagram,
    code: `// abstract class: can mix abstract + concrete methods
abstract class Vehicle {
    abstract void start();          // must be implemented
    void honk() {                    // shared, concrete
        System.out.println("Beep beep!");
    }
}

class Car extends Vehicle {
    void start() {
        System.out.println("Car starts with a key/button");
    }
}

// interface: pure contract (Java 8+ allows default methods too)
interface Payable {
    double calculateSalary();
    default void printSlip() {
        System.out.println("Salary: " + calculateSalary());
    }
}

class Employee implements Payable {
    double baseSalary;
    Employee(double baseSalary) { this.baseSalary = baseSalary; }
    public double calculateSalary() { return baseSalary * 1.1; }
}`,
  },
];

const comparisonRows = [
  ["Approach", "Procedural (C-style)", "Object-Oriented (Java)"],
  ["Unit of design", "Functions acting on data", "Objects bundling data + behavior"],
  ["Data safety", "Global/shared data, easily corrupted", "Encapsulated, access-controlled"],
  ["Code reuse", "Copy-paste or function libraries", "Inheritance & composition"],
  ["Scalability", "Gets tangled as codebase grows", "Modular — classes evolve independently"],
  ["Real-world mapping", "Low — thinks in steps", "High — thinks in entities & relationships"],
  ["Change impact", "Ripples across functions", "Contained inside the responsible class"],
];

const roadmap = [
  { step: "Classes & Objects", detail: "Fields, methods, `this`, constructors" },
  { step: "Encapsulation", detail: "Access modifiers, getters/setters" },
  { step: "Inheritance", detail: "extends, super, method overriding" },
  { step: "Polymorphism", detail: "Overloading vs overriding, dynamic dispatch" },
  { step: "Abstraction", detail: "Abstract classes vs interfaces" },
  { step: "Object methods", detail: "toString(), equals(), hashCode()" },
  { step: "Relationships", detail: "Association, aggregation, composition" },
  { step: "static & final", detail: "Class-level members, immutability" },
  { step: "SOLID principles", detail: "Writing OOP that scales cleanly" },
  { step: "Design patterns", detail: "Singleton, Factory, Observer, Strategy" },
];

const cheatSheet = [
  { term: "class", detail: "Blueprint for creating objects" },
  { term: "object", detail: "Instance of a class, created with `new`" },
  { term: "this", detail: "Refers to the current object instance" },
  { term: "super", detail: "Refers to the immediate parent class" },
  { term: "extends", detail: "Class inheritance (single, in Java)" },
  { term: "implements", detail: "A class fulfilling an interface contract" },
  { term: "abstract", detail: "Class/method with no full implementation" },
  { term: "interface", detail: "Pure contract of method signatures" },
  { term: "private", detail: "Accessible only within the same class" },
  { term: "protected", detail: "Accessible in same package + subclasses" },
  { term: "public", detail: "Accessible from anywhere" },
  { term: "(default)", detail: "Accessible only within the same package" },
  { term: "static", detail: "Belongs to the class, not any instance" },
  { term: "final", detail: "Cannot be overridden / reassigned / extended" },
  { term: "@Override", detail: "Marks a method as overriding a parent's" },
  { term: "instanceof", detail: "Checks an object's runtime type" },
];

const useCases = [
  {
    title: "Enterprise software",
    detail:
      "Banking, ERP & billing systems model real entities (Account, Invoice, Customer) directly as classes.",
  },
  {
    title: "Android & desktop apps",
    detail:
      "UI components (Activity, View, Fragment) are all class hierarchies built on inheritance.",
  },
  {
    title: "Game development",
    detail:
      "Player, Enemy, Weapon — polymorphism lets one update loop handle every game object uniformly.",
  },
  {
    title: "Frameworks & libraries",
    detail:
      "Spring, Hibernate, and most Java frameworks rely on interfaces + abstraction to stay extensible.",
  },
  {
    title: "Simulation systems",
    detail:
      "Traffic, physics, or crowd simulations map naturally onto interacting objects with their own state.",
  },
];

const blogSections = [
  {
    heading: "Why OOP still matters in 2026",
    body: "Functional programming and multi-paradigm languages have grown fast, but OOP hasn't gone anywhere — it's merged with them. Modern Java (records, sealed classes, pattern matching) keeps the object model but borrows functional ideas like immutability. Most large-scale systems — banking cores, Android, enterprise backends — are still organized around objects because teams of people reason about entities and responsibilities more easily than about pure data transformations.",
  },
  {
    heading: "The real cost of skipping it",
    body: "Codebases that skip OOP discipline don't fail immediately — they fail slowly. A few global functions mutating shared state work fine for a weekend project, then become unmaintainable once five people touch the same file. Encapsulation and clear class boundaries are what let a team split a large system into pieces that can be worked on, tested, and reasoned about independently.",
  },
  {
    heading: "Where it's heading",
    body: "The trend isn't 'OOP vs functional' — it's OOP absorbing functional safety nets. Java's records give you value-object style immutable classes with almost no boilerplate. Sealed classes make polymorphism exhaustive and compiler-checked. The four pillars remain the mental model; the syntax around them keeps getting leaner.",
  },
];

/* ============================================================
   DOWNLOAD NOTES
   ============================================================ */
function buildNotesMarkdown(): string {
  const lines: string[] = [];
  lines.push("# Object-Oriented Programming with Java — Complete Notes");
  lines.push("");
  lines.push("_Generated from CodeNFacts — codenfacts.com_");
  lines.push("");
  lines.push("## 1. What is OOP?");
  lines.push(
    "Object-Oriented Programming is a programming paradigm built around **objects** — bundles of data (fields) and behavior (methods) — instead of a sequence of instructions acting on separate data."
  );
  lines.push("");
  lines.push("## 2. Why use OOP?");
  lines.push("- Models real-world entities directly (Car, Account, Employee)");
  lines.push("- Keeps data safe via encapsulation");
  lines.push("- Reduces duplication via inheritance");
  lines.push("- Scales cleanly as codebases grow");
  lines.push("- Makes large systems easier to split across a team");
  lines.push("");
  lines.push("## 3. Why is it needed? (vs Procedural)");
  comparisonRows.slice(1).forEach((row) => {
    lines.push(`- **${row[0]}** — Procedural: ${row[1]} | OOP: ${row[2]}`);
  });
  lines.push("");
  lines.push("## 4. The Four Pillars");
  pillars.forEach((p) => {
    lines.push(`### ${p.title}`);
    lines.push(p.definition);
    lines.push("");
    lines.push(`**Why it matters:** ${p.why}`);
    lines.push("");
    lines.push(`**Analogy:** ${p.analogy}`);
    lines.push("");
    lines.push("```java");
    lines.push(p.code);
    lines.push("```");
    lines.push("");
  });
  lines.push("## 5. Cheat Sheet — Key Terms");
  cheatSheet.forEach((c) => lines.push(`- \`${c.term}\` — ${c.detail}`));
  lines.push("");
  lines.push("## 6. Learning Roadmap");
  roadmap.forEach((r, i) => lines.push(`${i + 1}. **${r.step}** — ${r.detail}`));
  lines.push("");
  lines.push("## 7. Real-World Use Cases");
  useCases.forEach((u) => lines.push(`- **${u.title}** — ${u.detail}`));
  lines.push("");
  lines.push("## 8. OOP: Features & Future");
  blogSections.forEach((b) => {
    lines.push(`### ${b.heading}`);
    lines.push(b.body);
    lines.push("");
  });
  lines.push("---");
  lines.push("Thanks for learning with CodeNFacts. Keep building! 🚀");
  return lines.join("\n");
}

function DownloadNotesButton() {
  const [showThanks, setShowThanks] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDownload() {
    const markdown = buildNotesMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OOP-with-Java-Notes-CodeNFacts.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setShowThanks(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowThanks(false), 4200);
  }

  return (
    <>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-transform active:scale-[0.97] hover:-translate-y-0.5"
        style={{
          background: "var(--accent)",
          color: "var(--code-bg)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Download size={16} />
        Download OOP Notes
      </button>

      {showThanks && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl border px-4 py-3.5 max-w-sm"
          style={{
            background: "var(--panel-bg)",
            borderColor: "var(--accent)",
            boxShadow: "var(--shadow)",
          }}
        >
          <CheckCircle2
            size={20}
            style={{ color: "var(--accent)" }}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Thanks for downloading! 🎉
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Your OOP notes are saved. Happy learning — go build something with it.
            </p>
          </div>
          <button
            onClick={() => setShowThanks(false)}
            className="ml-auto shrink-0"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function OOPWithJavaPage() {
  const [activePillar, setActivePillar] = useState(pillars[0].key);
  const current = pillars.find((p) => p.key === activePillar)!;

  return (
    <div className="oop-page min-h-screen" style={{ background: "var(--page-bg)" }}>
      <ThemeVars />

      {/* HERO */}
      <section className="px-4 sm:px-8 pt-14 pb-10 max-w-6xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={14} style={{ color: "var(--accent)" }} />
            <span
              className="text-xs font-mono uppercase tracking-[0.25em]"
              style={{ color: "var(--accent)" }}
            >
              CodeNFacts / OOP
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Object-Oriented Programming <br className="hidden sm:block" />
            with <span style={{ color: "var(--accent)" }}>Java</span>
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Every concept, every pillar, every diagram you need - what OOP is, why it
            exists, how Java implements it, and how it&apos;s actually used in real
            systems. Read it here, or grab the full notes below.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DownloadNotesButton />
            <span
              className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg"
              style={{ background: "var(--chip-bg)", color: "var(--text-secondary)" }}
            >
              <FileText size={13} /> Markdown notes · instant download
            </span>
          </div>
        </motion.div>
      </section>

      {/* WHAT / WHY / NEED */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="01 · Foundations"
          title="What is OOP, and why does it exist?"
          icon={Lightbulb}
        />
        <div className="grid md:grid-cols-3 gap-4">
          <Panel>
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              What is it?
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              A paradigm that organizes code around{" "}
              <strong style={{ color: "var(--text-primary)" }}>objects</strong> —
              self-contained units combining data (fields) and behavior (methods) —
              instead of a linear list of instructions.
            </p>
          </Panel>
          <Panel>
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Why use it?
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              It mirrors how we naturally think about the real world — cars, accounts,
              employees — so code maps to problem domains instead of fighting them. It
              also keeps large codebases maintainable.
            </p>
          </Panel>
          <Panel>
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Why is it needed?
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Procedural code with shared global state gets fragile fast. OOP contains
              change: fixing or extending one class shouldn&apos;t force you to touch
              ten unrelated functions.
            </p>
          </Panel>
        </div>

        <div className="mt-6">
          <Panel>
            <PillarsOverviewDiagram />
          </Panel>
        </div>
      </section>

      {/* PROCEDURAL VS OOP */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="02 · Comparison"
          title="Procedural vs Object-Oriented"
          icon={Layers}
        />
        <Panel className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[560px]">
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i === 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
                  }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="py-3 px-3"
                      style={{
                        color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                        fontWeight: i === 0 ? 700 : j === 0 ? 600 : 400,
                        fontFamily: i === 0 ? "inherit" : j === 0 ? "monospace" : "inherit",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </section>

      {/* CLASS & OBJECT */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="03 · Building block"
          title="Classes & Objects"
          desc="A class is the blueprint. An object is the thing you actually build from it."
          icon={Boxes}
        />
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Panel>
            <ClassBoxDiagram />
          </Panel>
          <CodeBlock
            title="Car.java"
            code={`public class Car {
    private String brand;
    private int speed;

    // constructor
    public Car(String brand) {
        this.brand = brand;
        this.speed = 0;
    }

    public void accelerate(int amount) {
        speed += amount;
    }

    public void printStatus() {
        System.out.println(brand + " is going " + speed + " km/h");
    }
}

// creating objects — each is an independent instance
Car tesla = new Car("Tesla");
Car civic = new Car("Honda");

tesla.accelerate(60);
civic.accelerate(30);

tesla.printStatus(); // Tesla is going 60 km/h
civic.printStatus(); // Honda is going 30 km/h`}
          />
        </div>
      </section>

      {/* FOUR PILLARS — TABS */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="04 · The core idea"
          title="The Four Pillars of OOP"
          desc="Every OOP concept in Java branches out from these four ideas."
          icon={Puzzle}
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isActive = activePillar === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setActivePillar(p.key)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border"
                style={{
                  background: isActive ? "var(--accent)" : "var(--panel-bg)",
                  color: isActive ? "var(--code-bg)" : "var(--text-secondary)",
                  borderColor: isActive ? "var(--accent)" : "var(--border)",
                }}
              >
                <Icon size={15} />
                {p.title}
              </button>
            );
          })}
        </div>

        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <Panel>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--accent)" }}
              >
                {current.tagline}
              </p>
              <p className="text-sm mb-3" style={{ color: "var(--text-primary)" }}>
                {current.definition}
              </p>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)" }}>Why it matters: </strong>
                {current.why}
              </p>
              <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
                {current.analogy}
              </p>
            </Panel>
            <Panel>
              <current.diagram />
            </Panel>
          </div>
          <CodeBlock title={`${current.title}.java`} code={current.code} />
        </motion.div>
      </section>

      {/* RELATIONSHIPS */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="05 · Beyond the pillars"
          title="Object Relationships"
          desc="How objects connect to each other — from a loose reference to full ownership."
          icon={Link2}
        />
        <div className="grid md:grid-cols-3 gap-4">
          <Panel>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Association
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              A general &quot;uses-a&quot; link. A Teacher teaches Students — neither owns
              the other&apos;s lifecycle.
            </p>
            <code className="text-xs font-mono" style={{ color: "var(--accent)" }}>
              class Teacher {"{"} Student student; {"}"}
            </code>
          </Panel>
          <Panel>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Aggregation
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              A &quot;has-a&quot; relationship where the part can exist independently. A
              Department has Employees, but they still exist if the Department is deleted.
            </p>
            <code className="text-xs font-mono" style={{ color: "var(--accent)" }}>
              class Department {"{"} List&lt;Employee&gt; staff; {"}"}
            </code>
          </Panel>
          <Panel>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Composition
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              Strong ownership — the part cannot exist without the whole. A House&apos;s
              Rooms disappear if the House is destroyed.
            </p>
            <code className="text-xs font-mono" style={{ color: "var(--accent)" }}>
              class House {"{"} private final Room room = new Room(); {"}"}
            </code>
          </Panel>
        </div>
      </section>

      {/* STATIC / FINAL / OBJECT METHODS */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="06 · Keywords that matter"
          title="static, final & the Object class"
          icon={Code2}
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <CodeBlock
            title="StaticFinalDemo.java"
            code={`class Counter {
    static int count = 0;      // shared across all instances
    final String id;          // set once, never changed

    Counter() {
        count++;
        id = "COUNTER-" + count;
    }
}

Counter a = new Counter();
Counter b = new Counter();
System.out.println(Counter.count); // 2 — shared field
System.out.println(a.id);          // COUNTER-1
// a.id = "X"; // ❌ compile error — final cannot be reassigned`}
          />
          <CodeBlock
            title="ObjectMethods.java"
            code={`class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() {
        return "Point(" + x + ", " + y + ")";
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}

Point p1 = new Point(1, 2);
Point p2 = new Point(1, 2);
System.out.println(p1);            // Point(1, 2)
System.out.println(p1.equals(p2)); // true`}
          />
        </div>
      </section>

      {/* CHEAT SHEET */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="07 · Quick reference"
          title="OOP Cheat Sheet"
          desc="Every keyword you'll actually type, in one glance."
          icon={ListChecks}
        />
        <Panel>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cheatSheet.map((c) => (
              <div
                key={c.term}
                className="rounded-lg p-3 border"
                style={{ background: "var(--panel-alt)", borderColor: "var(--border)" }}
              >
                <code className="text-xs font-bold" style={{ color: "var(--accent)" }}>
                  {c.term}
                </code>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* ROADMAP */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="08 · Learning path"
          title="OOP Roadmap"
          desc="Follow this order — each step builds on the last."
          icon={MapIcon}
        />
        <Panel>
          <div className="space-y-0">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
                viewport={{ once: true, amount: 0.3 }}
                className="flex items-start gap-4 py-3.5"
                style={{
                  borderBottom:
                    i < roadmap.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-bold shrink-0"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.step}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {r.detail}
                  </p>
                </div>
                {i < roadmap.length - 1 && (
                  <ChevronRight
                    size={14}
                    className="ml-auto mt-1 shrink-0"
                    style={{ color: "var(--border)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </Panel>
      </section>

      {/* USE CASES */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="09 · In the real world"
          title="Where OOP actually gets used"
          icon={Compass}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {useCases.map((u) => (
            <Panel key={u.title}>
              <h3
                className="font-semibold text-sm mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {u.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {u.detail}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* BLOG / THEORY */}
      <section className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="10 · Perspective"
          title="Features, theory & the future of OOP"
          icon={BookOpen}
        />
        <div className="space-y-4">
          {blogSections.map((b) => (
            <Panel key={b.heading}>
              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {b.heading}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {b.body}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 sm:px-8 py-16 max-w-6xl mx-auto">
        <Panel className="text-center py-10">
          <Rocket
            className="mx-auto mb-4"
            size={28}
            style={{ color: "var(--accent)" }}
          />
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Take the notes with you
          </h2>
          <p
            className="text-sm mb-6 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Everything on this page - pillars, diagrams, cheat sheet, roadmap -
            bundled into one file you can revisit anytime.
          </p>
          <div className="flex justify-center">
            <DownloadNotesButton />
          </div>
        </Panel>
      </section>
    </div>
  );
}