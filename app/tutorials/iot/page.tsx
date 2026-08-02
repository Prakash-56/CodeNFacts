"use client";

import { useState } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import {
  Cpu,
  Wifi,
  Radio,
  Thermometer,
  Gauge,
  Waves,
  MapPin,
  Zap,
  ShieldCheck,
  Brain,
  ChevronDown,
  Activity,
  Router,
  Cloud,
  TerminalSquare,
  Lightbulb,
  AlertTriangle,
  CircuitBoard,
  Sprout,
  HeartPulse,
  Factory,
  Building2,
  Watch,
  Home,
  Database,
  Lock,
  Layers,
  BatteryMedium,
  Bug,
} from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

/* ----------------------------- Data ----------------------------- */

const nav = [
  { id: "what-is-iot", label: "What is IoT" },
  { id: "why-now", label: "Why Now" },
  { id: "architecture", label: "How It Works" },
  { id: "stack", label: "Tech Stack" },
  { id: "boards", label: "Pi vs Arduino" },
  { id: "sensors", label: "Sensors" },
  { id: "learn-with-ai", label: "Learn with AI" },
  { id: "cheatsheets", label: "Cheat Sheets" },
  { id: "checklist", label: "Keep In Mind" },
  { id: "interview", label: "Interview Qs" },
];

const useCases = [
  { icon: Home, title: "Smart Home", desc: "Lights, locks, thermostats, and plugs that react to presence, time, and voice — without a human flipping a switch." },
  { icon: HeartPulse, title: "Healthcare", desc: "Wearable heart-rate and SpO2 monitors stream vitals to a doctor's dashboard in real time, catching problems before an appointment would." },
  { icon: Sprout, title: "Agriculture", desc: "Soil-moisture and weather sensors trigger irrigation only when needed — cutting water use while protecting yield." },
  { icon: Factory, title: "Industry 4.0", desc: "Vibration and temperature sensors on motors predict a bearing failure weeks before it happens, instead of after the line stops." },
  { icon: Building2, title: "Smart Cities", desc: "Parking sensors, smart streetlights, and air-quality stations turn a city into a system that reports its own condition." },
  { icon: Watch, title: "Wearables", desc: "Fitness bands and smartwatches fuse accelerometer, GPS, and heart data into a single picture of a person's day." },
];

const sensors = [
  { name: "DHT11 / DHT22", icon: Thermometer, use: "Temperature & humidity", note: "DHT22 is slower but more accurate than DHT11 — pick DHT22 for anything you'd actually publish." },
  { name: "PIR (HC-SR501)", icon: Activity, use: "Motion detection", note: "Detects infrared body heat change, not motion itself — a stationary warm object won't re-trigger it." },
  { name: "HC-SR04", icon: Waves, use: "Ultrasonic distance", note: "Times an echo pulse; accuracy drops on soft or angled surfaces that absorb or deflect sound." },
  { name: "LDR", icon: Lightbulb, use: "Light intensity", note: "A simple voltage-divider resistor — needs a second fixed resistor to produce a readable analog signal." },
  { name: "MQ-2 / MQ-135", icon: AlertTriangle, use: "Gas & air quality", note: "Needs a 24–48h 'burn-in' and constant heater current — budget for continuous power draw." },
  { name: "Soil Moisture", icon: Sprout, use: "Irrigation control", note: "Capacitive versions resist corrosion far longer than the cheaper resistive probes." },
  { name: "MPU6050", icon: Gauge, use: "Accelerometer + gyro", note: "Talks over I2C — remember it needs its own address if you're chaining multiple sensors." },
  { name: "NEO-6M GPS", icon: MapPin, use: "Location tracking", note: "Needs clear sky view to get a fix; indoors it can take minutes or never lock at all." },
];

const techStack: { group: string; icon: any; items: string[] }[] = [
  { group: "Microcontrollers & SBCs", icon: Cpu, items: ["Arduino Uno/Nano", "ESP32", "ESP8266", "Raspberry Pi 4/5", "STM32", "Raspberry Pi Pico"] },
  { group: "Connectivity", icon: Wifi, items: ["Wi-Fi", "Bluetooth / BLE", "Zigbee", "LoRa / LoRaWAN", "NB-IoT", "5G / Cellular"] },
  { group: "Messaging Protocols", icon: Radio, items: ["MQTT", "CoAP", "HTTP/REST", "WebSockets", "AMQP"] },
  { group: "Languages", icon: TerminalSquare, items: ["C / C++", "MicroPython", "Python", "JavaScript (Node-RED)", "Rust (embedded)"] },
  { group: "Cloud & Backend", icon: Cloud, items: ["AWS IoT Core", "Azure IoT Hub", "Google Cloud IoT", "ThingsBoard", "Firebase"] },
  { group: "Data & Dashboards", icon: Database, items: ["InfluxDB", "Grafana", "Node-RED", "TimescaleDB", "MongoDB"] },
  { group: "Security", icon: Lock, items: ["TLS/DTLS", "X.509 certs", "Secure boot", "OTA signing", "VLAN segmentation"] },
];

const protocolCheatSheet = [
  { name: "MQTT", layer: "Application (pub/sub)", range: "Internet-wide", power: "Low", bestFor: "Frequent small telemetry updates to a broker" },
  { name: "CoAP", layer: "Application (REST-like, UDP)", range: "Internet-wide", power: "Very low", bestFor: "Constrained devices that can't afford TCP overhead" },
  { name: "HTTP/REST", layer: "Application (request/response)", range: "Internet-wide", power: "High", bestFor: "One-off requests, firmware downloads, dashboards" },
  { name: "BLE", layer: "Link (short range)", range: "~10–30 m", power: "Very low", bestFor: "Wearables, phone-paired sensors" },
  { name: "Zigbee", layer: "Mesh network", range: "~10–100 m (mesh extends it)", power: "Low", bestFor: "Smart home mesh networks (bulbs, switches)" },
  { name: "LoRaWAN", layer: "Long-range WAN", range: "2–15+ km", power: "Very low", bestFor: "Rural sensors sending a few bytes per hour" },
];

const learningSteps = [
  { step: "01", title: "Get one board blinking", desc: "Arduino Uno or ESP32 + the classic blink sketch. This proves your toolchain, drivers, and upload process all work.", aiTip: "Paste any upload error verbatim into Claude — 90% of first-week bugs are a missing board driver or wrong COM port." },
  { step: "02", title: "Read one sensor", desc: "Wire a DHT22 or an LDR and print readings to the Serial Monitor. Learn what 'noisy data' actually looks like.", aiTip: "Ask AI to explain your sensor's datasheet in plain English — datasheets are dense on purpose, AI compresses them fast." },
  { step: "03", title: "Simulate before you solder", desc: "Use Wokwi or Tinkercad Circuits to test wiring and code virtually — no risk of frying a board while learning.", aiTip: "Describe your circuit in words and ask AI to generate a starting Wokwi diagram.json to skip the blank-canvas problem." },
  { step: "04", title: "Talk to the internet", desc: "Publish sensor data over MQTT to a free broker (e.g. HiveMQ public broker) and view it on a simple dashboard.", aiTip: "Ask AI to write both the publisher firmware AND a matching subscriber script — mismatched topics are the #1 silent failure." },
  { step: "05", title: "Add a brain", desc: "Move from 'if sensor > threshold' to a small on-device model (TinyML) or a cloud rule engine for real decisions.", aiTip: "Ask AI to explain the tradeoff between edge inference (fast, private) and cloud inference (powerful, needs connectivity) for your exact project." },
  { step: "06", title: "Build a full loop", desc: "Sensor → microcontroller → broker → database → dashboard → alert. One real end-to-end project teaches more than ten tutorials.", aiTip: "Have AI review your architecture diagram before you build — catching a design flaw on paper is free; catching it after wiring 12 nodes isn't." },
];

const importantPoints = [
  { icon: Zap, title: "3.3V vs 5V is not a suggestion", desc: "Feeding a 5V signal into a 3.3V-only pin (most ESP32/Raspberry Pi GPIO) can permanently damage it. Always check the board's logic level before wiring a sensor." },
  { icon: BatteryMedium, title: "Power budget kills more projects than code bugs", desc: "Wi-Fi radios and gas sensors are power-hungry. A battery project that isn't measured in mA-hours on paper first will die in the field within days." },
  { icon: ShieldCheck, title: "Every internet-connected device is an attack surface", desc: "Default passwords and unencrypted MQTT are how IoT botnets happen. Use TLS, unique credentials per device, and sign your OTA updates." },
  { icon: Layers, title: "Decide what runs on the edge vs the cloud", desc: "Sending raw data to the cloud for every decision adds latency and cost. Time-critical logic (like an emergency shutoff) belongs on the device itself." },
  { icon: Bug, title: "Debounce and filter before you trust a reading", desc: "A single noisy sensor spike can trigger a false alarm. Average multiple readings or use a debounce window before acting on sensor data." },
  { icon: CircuitBoard, title: "I2C addresses must be unique on a bus", desc: "Two sensors sharing the same default I2C address will collide. Check the datasheet for an address-select pin or use a multiplexer (e.g. TCA9548A)." },
];

const interviewQs = [
  {
    q: "Two I2C sensors on the same bus both default to address 0x68. What actually happens if you don't change either one?",
    a: "Both devices respond to every read/write meant for 0x68, so their responses collide on the shared SDA line — you get garbled or undefined data, not a clean error. Fix it via an address-select pin, a multiplexer like the TCA9548A, or by putting one sensor on a second I2C bus.",
  },
  {
    q: "Your battery-powered sensor node dies in 3 days instead of the expected 3 months. The code looks correct — what do you check first?",
    a: "Deep-sleep configuration. It's the single biggest power sink bug: Wi-Fi/BLE radios left enabled during 'sleep', a pull-up resistor bleeding current, or the MCU never actually entering its low-power mode. Measure actual current draw with a multimeter in series rather than trusting the datasheet's 'typical' sleep current.",
  },
  {
    q: "Why would you choose CoAP over MQTT for a battery-powered sensor that reports once per hour?",
    a: "MQTT keeps a persistent TCP connection to a broker, which costs power to maintain even when idle. CoAP runs over UDP and is designed for occasional request/response — the device can wake, send one datagram, and sleep, with far less connection overhead for infrequent updates.",
  },
  {
    q: "A PIR motion sensor keeps 'detecting motion' from a stationary space heater. Is the sensor faulty?",
    a: "Probably not — PIR sensors detect a *change* in infrared radiation, not motion itself. A heater cycling on/off, or sunlight moving across a room, changes the IR pattern enough to trigger it. The fix is usually sensor placement, a lens with a narrower field of view, or a software debounce window, not a new sensor.",
  },
  {
    q: "Your MQTT broker shows the device as 'connected' but it stopped publishing 20 minutes ago. What's the most likely cause?",
    a: "A dead TCP connection that the broker hasn't noticed yet — this is exactly what MQTT's keep-alive and Last Will and Testament (LWT) exist for. If keep-alive pings aren't configured, the broker can hold a stale 'connected' state long after the device actually dropped off the network.",
  },
  {
    q: "Why can't you just plug a 5V Arduino sensor output straight into a Raspberry Pi GPIO pin?",
    a: "Raspberry Pi GPIO pins are 3.3V-tolerant only; a 5V signal can damage them permanently. You need a logic-level shifter (or a simple resistor voltage divider) between a 5V source and any Pi input pin.",
  },
  {
    q: "A LoRaWAN sensor 8 km away sometimes fails to deliver a reading — is that a bug?",
    a: "Not necessarily. LoRaWAN trades reliability for range and power efficiency; it's typically unacknowledged (Class A, unconfirmed messages) to save battery, so occasional packet loss is expected behavior, not a defect. If every reading must arrive, use confirmed messages — at the cost of more airtime and power.",
  },
  {
    q: "What's the actual difference between 'IoT' and just 'a device with an internet connection'?",
    a: "IoT implies a sensing-to-action loop: a device senses the physical world, that data is processed (locally or in the cloud), and the outcome changes something in the physical world again — often with minimal human involvement. A smart TV browsing Netflix is internet-connected; a soil sensor that triggers a valve is IoT.",
  },
];

/* --------------------------- Small pieces --------------------------- */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
      <span className="font-mono text-xs tracking-[0.2em] uppercase text-teal-700 dark:text-teal-400">
        {children}
      </span>
    </div>
  );
}

function TraceDivider() {
  return (
    <div className="relative h-16 w-full overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 800 64" className="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1="32" x2="800" y2="32" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="1" strokeDasharray="2 6" />
        <circle cx="400" cy="32" r="4" className="fill-teal-500 dark:fill-teal-400">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-4 text-left px-5 py-4"
          >
            <span className="flex gap-3 items-start">
              <span className="font-mono text-xs mt-0.5 text-amber-600 dark:text-amber-400 shrink-0">
                Q{String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-100">{item.q}</span>
            </span>
            <ChevronDown
              className={`shrink-0 mt-0.5 h-4 w-4 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5 pl-14">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Diagrams ------------------------------ */

function LayersDiagram() {
  const layers = [
    { label: "Perception Layer", sub: "sensors & actuators — the physical world", color: "#0d9488" },
    { label: "Network Layer", sub: "Wi-Fi, BLE, LoRa, Zigbee — moves the data", color: "#0891b2" },
    { label: "Processing Layer", sub: "edge device, broker, cloud rules engine", color: "#7c3aed" },
    { label: "Application Layer", sub: "dashboard, alert, automated action", color: "#d97706" },
  ];
  return (
    <svg viewBox="0 0 640 300" className="w-full h-auto">
      {layers.map((l, i) => (
        <g key={i} transform={`translate(0, ${i * 72})`}>
          <rect x="0" y="0" width="640" height="56" rx="10" fill={l.color} fillOpacity="0.1" stroke={l.color} strokeWidth="1.5" />
          <circle cx="30" cy="28" r="6" fill={l.color} />
          <text x="52" y="24" className="font-semibold" fontSize="15" fill="currentColor">{l.label}</text>
          <text x="52" y="42" fontSize="12" fill="currentColor" opacity="0.6">{l.sub}</text>
          {i < layers.length - 1 && (
            <line x1="30" y1="56" x2="30" y2="72" stroke={l.color} strokeWidth="1.5" strokeDasharray="3 3" />
          )}
        </g>
      ))}
    </svg>
  );
}

function ArchitectureDiagram() {
  const nodes = [
    { label: "Sensor", sub: "reads the world", icon: "◆" },
    { label: "Microcontroller", sub: "ESP32 / Arduino", icon: "▣" },
    { label: "Gateway", sub: "Wi-Fi / LoRa / BLE", icon: "▲" },
    { label: "Broker / Cloud", sub: "MQTT, AWS IoT", icon: "☁" },
    { label: "Dashboard", sub: "you decide & act", icon: "▤" },
  ];
  const w = 130;
  const gap = 24;
  return (
    <svg viewBox={`0 0 ${nodes.length * (w + gap)} 170`} className="w-full h-auto">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
      {nodes.map((n, i) => {
        const x = i * (w + gap);
        return (
          <g key={i}>
            <rect
              x={x}
              y="40"
              width={w}
              height="80"
              rx="12"
              className="fill-white dark:fill-slate-900 stroke-teal-500/60 dark:stroke-teal-400/50"
              strokeWidth="1.5"
            />
            <text x={x + w / 2} y="72" textAnchor="middle" fontSize="20" className="fill-teal-600 dark:fill-teal-400">
              {n.icon}
            </text>
            <text x={x + w / 2} y="94" textAnchor="middle" fontSize="12.5" fontWeight="600" fill="currentColor">
              {n.label}
            </text>
            <text x={x + w / 2} y="110" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.55">
              {n.sub}
            </text>
            {i < nodes.length - 1 && (
              <line
                x1={x + w}
                y1="80"
                x2={x + w + gap}
                y2="80"
                markerEnd="url(#arrow)"
                className="stroke-slate-400 dark:stroke-slate-500"
                strokeWidth="1.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ArduinoSketch() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto">
      <rect x="10" y="10" width="340" height="200" rx="10" className="fill-teal-50 dark:fill-teal-950/40 stroke-teal-600/60" strokeWidth="1.5" />
      <text x="180" y="35" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">ARDUINO UNO — sketch</text>
      <rect x="30" y="50" width="90" height="34" rx="4" className="fill-slate-800 dark:fill-slate-200" />
      <text x="75" y="71" textAnchor="middle" fontSize="9" className="fill-white dark:fill-slate-900">USB-B</text>
      <circle cx="290" cy="65" r="16" className="fill-none stroke-slate-400" strokeWidth="1.5" />
      <text x="290" y="69" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">DC IN</text>
      {["AREF","GND","13","12","~11","~10","~9","8"].map((p,i)=>(
        <g key={p} transform={`translate(${40+i*36},110)`}>
          <circle r="4" className="fill-amber-500" />
          <text y="-8" textAnchor="middle" fontSize="8" fill="currentColor">{p}</text>
        </g>
      ))}
      {["A0","A1","A2","A3","A4","A5"].map((p,i)=>(
        <g key={p} transform={`translate(${60+i*40},190)`}>
          <circle r="4" className="fill-cyan-500" />
          <text y="14" textAnchor="middle" fontSize="8" fill="currentColor">{p}</text>
        </g>
      ))}
      <text x="20" y="150" fontSize="9" fill="currentColor" opacity="0.6">Digital pins (top) — amber</text>
      <text x="20" y="205" fontSize="9" fill="currentColor" opacity="0.6">Analog pins (bottom) — cyan</text>
    </svg>
  );
}

function RaspberryPiSketch() {
  const left = ["3V3","GPIO2 (SDA)","GPIO3 (SCL)","GPIO4","GND","GPIO17","GPIO27","GPIO22","3V3","GPIO10 (MOSI)"];
  const right = ["5V","5V","GND","GPIO14 (TX)","GPIO15 (RX)","GPIO18","GND","GPIO23","GPIO24","GND"];
  return (
    <svg viewBox="0 0 360 260" className="w-full h-auto">
      <rect x="10" y="10" width="340" height="240" rx="10" className="fill-violet-50 dark:fill-violet-950/30 stroke-violet-600/50" strokeWidth="1.5" />
      <text x="180" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">RASPBERRY PI — GPIO sketch (first 10 pairs)</text>
      {left.map((p, i) => (
        <g key={p}>
          <g transform={`translate(70, ${55 + i * 19})`}>
            <text x="-8" textAnchor="end" fontSize="8.5" fill="currentColor">{p}</text>
            <circle r="4" className={p.includes("3V3")||p.includes("5V") ? "fill-red-500" : p==="GND" ? "fill-slate-500" : "fill-emerald-500"} />
          </g>
          <g transform={`translate(290, ${55 + i * 19})`}>
            <circle r="4" className={right[i].includes("3V3")||right[i].includes("5V") ? "fill-red-500" : right[i]==="GND" ? "fill-slate-500" : "fill-emerald-500"} />
            <text x="8" textAnchor="start" fontSize="8.5" fill="currentColor">{right[i]}</text>
          </g>
          <line x1="74" y1={55+i*19} x2="286" y2={55+i*19} stroke="currentColor" strokeOpacity="0.08" strokeWidth="6" />
        </g>
      ))}
      <g transform="translate(70,235)">
        <circle r="4" className="fill-red-500" /><text x="12" y="3" fontSize="8.5" fill="currentColor" opacity="0.7">Power</text>
        <circle cx="70" r="4" className="fill-slate-500" /><text x="82" y="3" fontSize="8.5" fill="currentColor" opacity="0.7">Ground</text>
        <circle cx="150" r="4" className="fill-emerald-500" /><text x="162" y="3" fontSize="8.5" fill="currentColor" opacity="0.7">GPIO / data</text>
      </g>
    </svg>
  );
}

function BreadboardSketch() {
  return (
    <svg viewBox="0 0 380 180" className="w-full h-auto">
      <rect x="10" y="10" width="360" height="160" rx="8" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
      {Array.from({ length: 20 }).map((_, col) =>
        Array.from({ length: 5 }).map((_, row) => (
          <circle key={`${col}-${row}`} cx={28 + col * 17} cy={35 + row * 12} r="1.6" className="fill-slate-400 dark:fill-slate-500" />
        ))
      )}
      {Array.from({ length: 20 }).map((_, col) =>
        Array.from({ length: 5 }).map((_, row) => (
          <circle key={`b${col}-${row}`} cx={28 + col * 17} cy={110 + row * 12} r="1.6" className="fill-slate-400 dark:fill-slate-500" />
        ))
      )}
      <rect x="140" y="55" width="16" height="35" rx="2" className="fill-red-500" />
      <text x="148" y="102" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">LED</text>
      <rect x="200" y="60" width="40" height="10" rx="2" className="fill-amber-600" />
      <text x="220" y="86" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">220Ω resistor</text>
      <line x1="156" y1="72" x2="200" y2="65" stroke="currentColor" strokeWidth="1.5" />
      <line x1="240" y1="65" x2="280" y2="47" stroke="currentColor" strokeWidth="1.5" />
      <text x="20" y="25" fontSize="9" fontWeight="600" fill="currentColor">Breadboard sketch — LED + resistor</text>
    </svg>
  );
}

/* -------------------------------- Page -------------------------------- */

export default function IoTTutorialPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} font-[var(--font-body)] bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100 transition-colors duration-300`}
    >
      {/* Ambient breadboard-hole backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden="true"
      />

      {/* ---------------- Hero ---------------- */}
      <header className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-teal-700 dark:text-teal-400 mb-6">
            <CircuitBoard className="h-4 w-4" />
             / iot
          </div>
          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            The Internet of Things,
            <br />
            <span className="text-teal-600 dark:text-teal-400">wired up from first principles.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A sensor reads the world, a network carries it, a system decides, and something physical
            reacts. That loop is the whole idea. This page walks through it - architecture, boards,
            sensors, protocols, cheat sheets, and the trick questions interviewers actually ask.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Cpu, label: "Boards & MCUs" },
              { icon: Radio, label: "Protocols" },
              { icon: Thermometer, label: "Sensors" },
              { icon: Brain, label: "Learn with AI" },
            ].map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                <b.icon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* in-page nav */}
        <nav className="sticky top-0 z-10 backdrop-blur bg-white/80 dark:bg-[#0b1220]/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="max-w-5xl mx-auto px-6 flex gap-6 text-sm">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap py-3 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* ---------------- What is IoT ---------------- */}
        <section id="what-is-iot" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 01</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">What is IoT, really?</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            The Internet of Things is a network of physical objects — sensors, appliances, vehicles,
            machines — embedded with electronics and software that let them collect data and exchange
            it with each other or the cloud, usually with little to no human in the loop. It's not one
            technology; it's four layers stacked on top of each other, each doing one job:
          </p>
          <div className="mt-10 max-w-3xl">
            <LayersDiagram />
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            A single project rarely needs custom work at every layer — most tutorials start at
            Perception and stop at Network. The Processing and Application layers are where a toy
            project turns into a product.
          </p>
        </section>

        <TraceDivider />

        {/* ---------------- Why now / what if not ---------------- */}
        <section id="why-now" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 02</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">
            Why IoT matters now — and what the world looks like without it
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-8">
            Sensors got cheap, Wi-Fi chips got tiny, and cloud storage got nearly free — all in the
            same decade. That combination is why IoT went from research labs to every home in about
            ten years. Here's the difference it actually makes:
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" /> Without IoT
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>A factory motor is inspected on a fixed monthly schedule — it fails silently between checks.</li>
                <li>A farmer waters on a calendar, not on actual soil moisture — wasting water or under-watering.</li>
                <li>A patient's vitals are only known during a clinic visit, once every few months.</li>
                <li>A city discovers a water leak from a resident's complaint, weeks after it started.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-300 dark:border-teal-700 p-6 bg-teal-50 dark:bg-teal-950/30">
              <h3 className="font-semibold text-teal-700 dark:text-teal-400 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> With IoT
              </h3>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <li>Vibration sensors flag bearing wear weeks in advance — maintenance happens before failure.</li>
                <li>Irrigation triggers only when soil moisture actually drops below threshold.</li>
                <li>A wearable streams heart rate continuously, flagging anomalies the same day they occur.</li>
                <li>Flow sensors on the water grid catch a leak within hours, not weeks.</li>
              </ul>
            </div>
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Use cases ---------------- */}
        <section className="py-4">
          <h3 className="font-[var(--font-display)] text-xl font-bold mb-6">Where it shows up</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {useCases.map((u, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
              >
                <u.icon className="h-5 w-5 text-teal-600 dark:text-teal-400 mb-3" />
                <h4 className="font-semibold text-sm mb-1.5">{u.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Architecture ---------------- */}
        <section id="architecture" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 03</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">How an IoT system actually works</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-10">
            Strip away the branding and almost every IoT product is the same five-node pipeline. Data
            flows right; decisions and commands can flow back left.
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <ArchitectureDiagram />
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            The gateway step is easy to skip in a tutorial (your ESP32 can talk straight to the cloud)
            but matters at scale — a real deployment often has dozens of cheap sensors reporting to one
            gateway that handles the expensive internet connection.
          </p>
        </section>

        <TraceDivider />

        {/* ---------------- Tech stack ---------------- */}
        <section id="stack" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 04</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-8">The full tech stack</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {techStack.map((g, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <g.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-semibold text-sm">{g.group}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it, j) => (
                    <span
                      key={j}
                      className="font-[var(--font-mono)] text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Pi vs Arduino ---------------- */}
        <section id="boards" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 05</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">Raspberry Pi vs Arduino</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-8">
            The single most common beginner confusion. The short version:{" "}
            <strong className="text-slate-800 dark:text-slate-100">Arduino is a microcontroller</strong> — it
            runs one program, close to the hardware, forever, with no operating system.{" "}
            <strong className="text-slate-800 dark:text-slate-100">Raspberry Pi is a full computer</strong> — it
            boots Linux, runs multiple programs, and is far more powerful but also far less predictable
            in timing.
          </p>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Trait</th>
                  <th className="py-2 pr-4 font-medium">Arduino Uno</th>
                  <th className="py-2 pr-4 font-medium">Raspberry Pi 4/5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  ["Runs", "One C/C++ program on bare metal", "Full Linux OS, multitasking"],
                  ["Boot time", "Instant, deterministic", "10–30 seconds"],
                  ["Real-time control", "Excellent — precise microsecond timing", "Poor — OS scheduling adds jitter"],
                  ["Best at", "Reading sensors, driving motors, low power", "Vision, networking servers, running AI models"],
                  ["Power draw", "~20–50 mA active", "~600 mA–1.2 A active"],
                  ["Price (approx.)", "$5–25", "$35–80"],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2.5 pr-4 ${j === 0 ? "text-slate-500 dark:text-slate-400" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-teal-800 dark:text-teal-300"><ArduinoSketch /></div>
            <div className="text-violet-800 dark:text-violet-300"><RaspberryPiSketch /></div>
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Sensors ---------------- */}
        <section id="sensors" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 06</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-8">Sensors you'll actually use</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {sensors.map((s, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <s.icon className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm">{s.name}</h4>
                    <span className="text-[11px] text-slate-400">{s.use}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto text-slate-700 dark:text-slate-300">
            <BreadboardSketch />
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Learn with AI ---------------- */}
        <section id="learn-with-ai" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 07</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">How to learn IoT with AI as your lab partner</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-10">
            AI won't solder your board, but it collapses the two slowest parts of learning embedded
            systems: reading dense datasheets and debugging a circuit you can't see. Use it as a second
            pair of eyes at every step, not a replacement for actually wiring things up.
          </p>
          <ol className="space-y-6">
            {learningSteps.map((s, i) => (
              <li key={i} className="flex gap-5">
                <span className="font-[var(--font-mono)] text-xs text-slate-400 mt-1 shrink-0 w-6">{s.step}</span>
                <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-5 pb-1">
                  <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
                  <p className="mt-2 flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                    <Brain className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {s.aiTip}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <TraceDivider />

        {/* ---------------- Cheat sheets ---------------- */}
        <section id="cheatsheets" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 08</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-8">Cheat sheets</h2>

          <h3 className="font-semibold text-sm mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide">Protocol comparison</h3>
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Protocol</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Range</th>
                  <th className="py-2 pr-4 font-medium">Power</th>
                  <th className="py-2 pr-4 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {protocolCheatSheet.map((p, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 font-[var(--font-mono)] text-teal-700 dark:text-teal-400">{p.name}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{p.layer}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{p.range}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{p.power}</td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">{p.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-sm mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide">Arduino sketch skeleton</h3>
          <pre className="font-[var(--font-mono)] text-xs rounded-xl bg-slate-900 text-slate-100 p-5 overflow-x-auto mb-12 leading-relaxed">
{`void setup() {
  Serial.begin(115200);      // debug output
  pinMode(2, INPUT);         // sensor pin
  pinMode(13, OUTPUT);       // actuator / LED
}

void loop() {
  int reading = digitalRead(2);
  if (reading == HIGH) {
    digitalWrite(13, HIGH);  // react to sensor
  } else {
    digitalWrite(13, LOW);
  }
  delay(50);                 // simple debounce
}`}
          </pre>

          <h3 className="font-semibold text-sm mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide">MQTT publish / subscribe (Python)</h3>
          <pre className="font-[var(--font-mono)] text-xs rounded-xl bg-slate-900 text-slate-100 p-5 overflow-x-auto mb-12 leading-relaxed">
{`import paho.mqtt.client as mqtt

BROKER, TOPIC = "broker.hivemq.com", "myhome/livingroom/temp"

# --- publisher (on the device) ---
client = mqtt.Client()
client.connect(BROKER, 1883)
client.publish(TOPIC, payload="24.5", qos=1)

# --- subscriber (on the dashboard) ---
def on_message(client, userdata, msg):
    print(msg.topic, msg.payload.decode())

sub = mqtt.Client()
sub.on_message = on_message
sub.connect(BROKER, 1883)
sub.subscribe(TOPIC, qos=1)
sub.loop_forever()`}
          </pre>

          <h3 className="font-semibold text-sm mb-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide">Raspberry Pi GPIO (Python)</h3>
          <pre className="font-[var(--font-mono)] text-xs rounded-xl bg-slate-900 text-slate-100 p-5 overflow-x-auto leading-relaxed">
{`from gpiozero import LED, MotionSensor
from time import sleep

led = LED(17)
pir = MotionSensor(4)

while True:
    if pir.motion_detected:
        led.on()
    else:
        led.off()
    sleep(0.1)`}
          </pre>
        </section>

        <TraceDivider />

        {/* ---------------- Important checklist ---------------- */}
        <section id="checklist" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 09</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-8">Important things to keep in mind</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {importantPoints.map((p, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-5">
                <p.icon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{p.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <TraceDivider />

        {/* ---------------- Interview questions ---------------- */}
        <section id="interview" className="scroll-mt-16 py-16">
          <SectionEyebrow>Node 10</SectionEyebrow>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-4">Puzzled? Try these interview questions</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-8">
            These aren't definition-recall questions — they're the kind that expose whether you've
            actually debugged a circuit at 1am. Tap a question to reveal the answer.
          </p>
          <Accordion items={interviewQs} />
        </section>

        {/* ---------------- Footer ---------------- */}
        <footer className="py-16 border-t border-slate-200 dark:border-slate-800 mt-8">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-[var(--font-mono)]">
            <Router className="h-4 w-4" />
            end of transmission - go build something that senses the room it's in.
          </div>
        </footer>
      </main>
    </div>
  );
}