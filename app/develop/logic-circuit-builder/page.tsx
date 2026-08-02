"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Bit = 0 | 1;
type GateType = "AND" | "OR" | "NOT" | "XOR";

interface Scenario {
  name: string;
  icon: string;
  labelA: string;
  labelB: string;
}

interface Puzzle {
  id: number;
  scenario: Scenario;
  a: Bit;
  b: Bit;
}

/* ------------------------------------------------------------------ */
/*  Gate logic                                                         */
/* ------------------------------------------------------------------ */

function applyGate(gate: GateType, a: Bit, b: Bit): boolean {
  switch (gate) {
    case "AND":
      return a === 1 && b === 1;
    case "OR":
      return a === 1 || b === 1;
    case "XOR":
      return a !== b;
    case "NOT":
      return a === 0;
  }
}

const GATE_INFO: {
  type: GateType;
  icon: string;
  blurb: string;
  table: [string, string, string][];
}[] = [
  {
    type: "AND",
    icon: "✳️",
    blurb: "TRUE only when BOTH inputs are TRUE.",
    table: [
      ["0", "0", "0"],
      ["0", "1", "0"],
      ["1", "0", "0"],
      ["1", "1", "1"],
    ],
  },
  {
    type: "OR",
    icon: "➕",
    blurb: "TRUE when AT LEAST ONE input is TRUE.",
    table: [
      ["0", "0", "0"],
      ["0", "1", "1"],
      ["1", "0", "1"],
      ["1", "1", "1"],
    ],
  },
  {
    type: "NOT",
    icon: "🚫",
    blurb: "Flips a single input (ignores B).",
    table: [
      ["0", "—", "1"],
      ["1", "—", "0"],
    ],
  },
  {
    type: "XOR",
    icon: "🔀",
    blurb: "TRUE only when the inputs are DIFFERENT.",
    table: [
      ["0", "0", "0"],
      ["0", "1", "1"],
      ["1", "0", "1"],
      ["1", "1", "0"],
    ],
  },
];

function gateClasses(type: GateType): string {
  switch (type) {
    case "AND":
      return "bg-amber-400 dark:bg-amber-500 border-amber-600 dark:border-amber-300 text-amber-950";
    case "OR":
      return "bg-sky-400 dark:bg-sky-500 border-sky-600 dark:border-sky-300 text-sky-950";
    case "NOT":
      return "bg-rose-400 dark:bg-rose-500 border-rose-600 dark:border-rose-300 text-rose-950";
    case "XOR":
      return "bg-violet-400 dark:bg-violet-500 border-violet-600 dark:border-violet-300 text-violet-950";
  }
}

/* ------------------------------------------------------------------ */
/*  150 puzzle generator                                               */
/* ------------------------------------------------------------------ */

const SCENARIOS: Scenario[] = [
  { name: "Porch Light", icon: "💡", labelA: "Motion Sensor", labelB: "Dusk Sensor" },
  { name: "Garage Door", icon: "🚪", labelA: "Remote Signal", labelB: "Safety Beam" },
  { name: "Security Alarm", icon: "🚨", labelA: "Door Sensor", labelB: "Window Sensor" },
  { name: "Sprinkler System", icon: "💧", labelA: "Soil Sensor", labelB: "Rain Sensor" },
  { name: "Elevator Door", icon: "🛗", labelA: "Call Button", labelB: "Weight Sensor" },
  { name: "Vending Machine", icon: "🥤", labelA: "Coin Slot", labelB: "Card Reader" },
  { name: "Traffic Signal", icon: "🚦", labelA: "Pedestrian Button", labelB: "Timer" },
  { name: "Drone Launch", icon: "🚁", labelA: "GPS Lock", labelB: "Battery OK" },
  { name: "Smart Lock", icon: "🔒", labelA: "Keycard", labelB: "PIN Code" },
  { name: "Coffee Maker", icon: "☕", labelA: "Water Level", labelB: "Power Button" },
  { name: "Ceiling Fan", icon: "🌀", labelA: "Heat Sensor", labelB: "Manual Switch" },
  { name: "Greenhouse Vent", icon: "🌱", labelA: "Temp Sensor", labelB: "Humidity Sensor" },
  { name: "Robot Arm", icon: "🤖", labelA: "Start Signal", labelB: "Safety Guard" },
  { name: "Car Alarm", icon: "🚗", labelA: "Door Sensor", labelB: "Motion Sensor" },
  { name: "Washing Machine", icon: "🧺", labelA: "Lid Closed", labelB: "Start Button" },
  { name: "Fire Sprinkler", icon: "🔥", labelA: "Smoke Detector", labelB: "Heat Detector" },
  { name: "Auto Gate", icon: "🚧", labelA: "RFID Tag", labelB: "Guard Override" },
  { name: "Smart Thermostat", icon: "🌡️", labelA: "Temp High", labelB: "Schedule Active" },
  { name: "ATM Dispenser", icon: "🏧", labelA: "Card Valid", labelB: "PIN Correct" },
  { name: "Streetlight", icon: "🏮", labelA: "Dusk Sensor", labelB: "Manual Override" },
  { name: "Escalator", icon: "🪜", labelA: "Step Sensor", labelB: "Emergency Stop" },
  { name: "Rocket Launch", icon: "🚀", labelA: "Fuel Ready", labelB: "Weather Clear" },
  { name: "Submarine Hatch", icon: "🛳️", labelA: "Pressure OK", labelB: "Crew Ready" },
  { name: "Bank Vault", icon: "🏦", labelA: "Time Lock", labelB: "Manager Key" },
  { name: "Smart Blinds", icon: "🪟", labelA: "Sunlight Sensor", labelB: "Manual Switch" },
  { name: "Dishwasher", icon: "🍽️", labelA: "Door Latch", labelB: "Start Button" },
  { name: "Autopilot", icon: "✈️", labelA: "Altitude OK", labelB: "Pilot Engaged" },
  { name: "Smart Doorbell", icon: "🔔", labelA: "Motion Detected", labelB: "Button Pressed" },
  { name: "Irrigation Valve", icon: "🚿", labelA: "Timer Active", labelB: "Moisture Low" },
  { name: "Game Console", icon: "🎮", labelA: "Controller On", labelB: "Disc Inserted" },
  { name: "3D Printer", icon: "🖨️", labelA: "Bed Heated", labelB: "Filament Loaded" },
  { name: "Solar Tracker", icon: "☀️", labelA: "Light Sensor", labelB: "Motor Ready" },
  { name: "Home Alarm Panel", icon: "📟", labelA: "Code Entered", labelB: "Sensor Armed" },
  { name: "Toy Robot", icon: "🧸", labelA: "Button A", labelB: "Button B" },
  { name: "Conveyor Belt", icon: "📦", labelA: "Item Detected", labelB: "Belt Running" },
  { name: "Wind Turbine Brake", icon: "🌬️", labelA: "Wind Speed High", labelB: "Manual Brake" },
  { name: "Server Cooling Fan", icon: "🖥️", labelA: "CPU Hot", labelB: "Fan Override" },
  { name: "Music Player", icon: "🎵", labelA: "Play Button", labelB: "Headphones In" },
];

const COMBOS: [Bit, Bit][] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

function buildPuzzles(count: number): Puzzle[] {
  const puzzles: Puzzle[] = [];
  for (let i = 0; i < count; i++) {
    const scenario = SCENARIOS[i % SCENARIOS.length];
    const comboIndex = (i + Math.floor(i / SCENARIOS.length)) % COMBOS.length;
    const [a, b] = COMBOS[comboIndex];
    puzzles.push({ id: i + 1, scenario, a, b });
  }
  return puzzles;
}

const PUZZLES: Puzzle[] = buildPuzzles(150);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LogicCircuitBuilderPage() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [placedGate, setPlacedGate] = useState<GateType | null>(null);
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [shake, setShake] = useState(false);

  const puzzle = PUZZLES[index];

  /* dark mode: default to system preference, persist choice */
  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("lcb-theme") : null;
    if (stored) {
      setDark(stored === "dark");
    } else if (typeof window !== "undefined" && window.matchMedia) {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("lcb-theme", dark ? "dark" : "light");
  }, [dark, mounted]);

  const output = useMemo(() => {
    if (!placedGate) return null;
    return applyGate(placedGate, puzzle.a, puzzle.b);
  }, [placedGate, puzzle]);

  function resetGate() {
    setPlacedGate(null);
    setSelectedGate(null);
    setStatus("idle");
  }

  function placeGate(gate: GateType) {
    setPlacedGate(gate);
    setSelectedGate(null);
    const result = applyGate(gate, puzzle.a, puzzle.b);
    if (result) {
      setStatus("correct");
      setSolved((prev) => {
        const next = new Set(prev);
        next.add(puzzle.id);
        return next;
      });
    } else {
      setStatus("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const gate = e.dataTransfer.getData("gate") as GateType;
    if (gate) placeGate(gate);
  }

  function handleDropZoneClick() {
    if (selectedGate) {
      placeGate(selectedGate);
    } else if (placedGate) {
      resetGate();
    }
  }

  function goTo(newIndex: number) {
    const wrapped = ((newIndex % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
    setIndex(wrapped);
    resetGate();
  }

  function restartAll() {
    setSolved(new Set());
    goTo(0);
  }

  const scenario = puzzle.scenario;
  const colorA = puzzle.a === 1 ? "#16a34a" : "#94a3b8";
  const colorB = puzzle.b === 1 ? "#16a34a" : "#94a3b8";
  const colorOut = output === null ? "#94a3b8" : output ? "#f59e0b" : "#94a3b8";

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        {/* ---------------------------------------------------------- */}
        {/* Header                                                      */}
        {/* ---------------------------------------------------------- */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              ⚡ Logic Circuit Builder
            </h1>
            <p className="mt-1 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
              Drag a gate into the circuit and make the output turn{" "}
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                TRUE
              </span>
              .
            </p>
          </div>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Progress                                                    */}
        {/* ---------------------------------------------------------- */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${(solved.size / PUZZLES.length) * 100}%` }}
            />
          </div>
          <span className="whitespace-nowrap font-mono text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
            {solved.size}/{PUZZLES.length} solved
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
          {/* -------------------------------------------------------- */}
          {/* Main puzzle card                                          */}
          {/* -------------------------------------------------------- */}
          <div>
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5 md:p-7">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  Puzzle #{puzzle.id}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => goTo(index - 1)}
                    className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => goTo(index + 1)}
                    className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <h2 className="mt-4 text-lg md:text-xl font-semibold flex items-center gap-2">
                <span>{scenario.icon}</span>
                {scenario.name}
              </h2>
              <p className="mt-1.5 text-sm md:text-base text-neutral-600 dark:text-neutral-300">
                <span className="font-medium">{scenario.labelA}</span> is{" "}
                <span className="font-mono">{puzzle.a === 1 ? "ON (1)" : "OFF (0)"}</span>, and{" "}
                <span className="font-medium">{scenario.labelB}</span> is{" "}
                <span className="font-mono">{puzzle.b === 1 ? "ON (1)" : "OFF (0)"}</span>. Pick the
                gate that lights up the output.
              </p>

              {/* --------------------------- Circuit --------------------------- */}
              <div className={`mt-6 ${shake ? "animate-[wiggle_0.4s_ease-in-out]" : ""}`}>
                <svg viewBox="0 0 640 220" className="w-full h-auto max-w-xl mx-auto select-none">
                  {/* input A wire */}
                  <polyline
                    points="96,55 190,55 190,95 258,95"
                    fill="none"
                    stroke={colorA}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  {/* input B wire */}
                  <polyline
                    points="96,165 190,165 190,125 258,125"
                    fill="none"
                    stroke={colorB}
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity={placedGate === "NOT" ? 0.25 : 1}
                  />
                  {/* output wire */}
                  <polyline
                    points="378,110 470,110"
                    fill="none"
                    stroke={colorOut}
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* input A node */}
                  <circle cx="70" cy="55" r="26" fill={colorA} stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
                  <text x="70" y="61" textAnchor="middle" className="fill-white font-mono font-bold text-[20px]">
                    {puzzle.a}
                  </text>
                  <text x="70" y="98" textAnchor="middle" className="fill-current text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">
                    A
                  </text>

                  {/* input B node */}
                  <circle cx="70" cy="165" r="26" fill={colorB} stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
                  <text x="70" y="171" textAnchor="middle" className="fill-white font-mono font-bold text-[20px]">
                    {puzzle.b}
                  </text>
                  <text x="70" y="208" textAnchor="middle" className="fill-current text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">
                    B
                  </text>

                  {/* gate drop zone */}
                  <foreignObject x="258" y="65" width="120" height="90">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={handleDropZoneClick}
                      role="button"
                      tabIndex={0}
                      aria-label={placedGate ? `Placed gate: ${placedGate}. Click to reset.` : "Drop zone: drop or tap a gate here"}
                      className={`w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        placedGate
                          ? gateClasses(placedGate) + " border-solid shadow-md"
                          : "border-dashed border-neutral-400 dark:border-neutral-600 bg-white/60 dark:bg-neutral-800/60 hover:border-amber-500"
                      }`}
                    >
                      {placedGate ? (
                        <>
                          <span className="text-xl">{GATE_INFO.find((g) => g.type === placedGate)?.icon}</span>
                          <span className="text-sm font-bold font-mono">{placedGate}</span>
                        </>
                      ) : (
                        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 text-center px-2">
                          Drop / Tap<br />Gate Here
                        </span>
                      )}
                    </div>
                  </foreignObject>

                  {/* output bulb */}
                  <circle
                    cx="520"
                    cy="110"
                    r="34"
                    fill={output ? "#fbbf24" : "#cbd5e1"}
                    className={dark && !output ? "opacity-40" : ""}
                    style={{ filter: output ? "drop-shadow(0 0 14px #f59e0b)" : "none", transition: "all .3s ease" }}
                  />
                  <text x="520" y="117" textAnchor="middle" className="fill-neutral-900 font-mono font-bold text-[20px]">
                    {output === null ? "?" : output ? "1" : "0"}
                  </text>
                  <text x="520" y="160" textAnchor="middle" className="fill-current text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">
                    OUTPUT
                  </text>
                </svg>
              </div>

              {/* --------------------------- Feedback --------------------------- */}
              <div className="mt-2 min-h-[2.5rem] flex items-center justify-center">
                {status === "correct" && (
                  <p className="text-center font-semibold text-emerald-600 dark:text-emerald-400 animate-[pop_0.3s_ease-out]">
                    🎉 Correct! Output is TRUE — circuit complete.
                  </p>
                )}
                {status === "wrong" && (
                  <p className="text-center font-semibold text-rose-600 dark:text-rose-400">
                    ❌ Output is FALSE. Try a different gate.
                  </p>
                )}
              </div>

              {/* --------------------------- Gate palette --------------------------- */}
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide font-semibold text-neutral-500 dark:text-neutral-400 mb-2 text-center">
                  Gate Palette — drag onto the circuit, or tap then tap the drop zone
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {GATE_INFO.map((g) => (
                    <div
                      key={g.type}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("gate", g.type)}
                      onClick={() => setSelectedGate((s) => (s === g.type ? null : g.type))}
                      role="button"
                      tabIndex={0}
                      aria-label={`${g.type} gate`}
                      className={`cursor-grab active:cursor-grabbing select-none rounded-xl border-2 px-4 py-2.5 flex items-center gap-2 font-mono font-bold transition-transform duration-150 hover:-translate-y-0.5 ${gateClasses(
                        g.type
                      )} ${selectedGate === g.type ? "ring-4 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950" : ""}`}
                    >
                      <span>{g.icon}</span>
                      {g.type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={resetGate}
                  className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Reset Gate
                </button>
                <button
                  onClick={() => goTo(index + 1)}
                  disabled={status !== "correct"}
                  className="rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Next Puzzle →
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Jump to puzzle:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={PUZZLES.length}
                  value={puzzle.id}
                  onChange={(e) => goTo(Number(e.target.value) - 1)}
                  className="w-16 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 font-mono text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                />
                <button onClick={restartAll} className="underline hover:text-neutral-800 dark:hover:text-neutral-200">
                  Restart progress
                </button>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Sidebar: gate reference / truth tables                    */}
          {/* -------------------------------------------------------- */}
          <aside className="lg:sticky lg:top-8 h-fit">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
              <h3 className="font-semibold mb-3">📘 Gate Reference</h3>
              <div className="space-y-4">
                {GATE_INFO.map((g) => (
                  <div key={g.type} className="border-t border-neutral-200 dark:border-neutral-800 pt-3 first:border-0 first:pt-0">
                    <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-mono font-bold border ${gateClasses(g.type)}`}>
                      <span>{g.icon}</span>
                      {g.type}
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400">{g.blurb}</p>
                    <table className="mt-2 w-full text-[11px] font-mono text-center border-collapse">
                      <thead>
                        <tr className="text-neutral-400 dark:text-neutral-500">
                          <th className="font-normal pb-1">A</th>
                          <th className="font-normal pb-1">B</th>
                          <th className="font-normal pb-1">OUT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.table.map((row, i) => (
                          <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800">
                            {row.map((cell, j) => (
                              <td key={j} className={`py-0.5 ${j === 2 && cell === "1" ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              💡 Some puzzles have more than one gate that works — every gate that lights the
              bulb counts as solved. Puzzles where A = B = 0 only ever light up with{" "}
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">NOT</span>.
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}