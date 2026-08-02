"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "intro", label: "What is IoT" },
  { id: "why", label: "Why IoT" },
  { id: "evolution", label: "Evolution" },
  { id: "architecture", label: "Architecture" },
  { id: "types", label: "Types of IoT" },
  { id: "components", label: "Components" },
  { id: "communication", label: "Communication Models" },
  { id: "protocols", label: "Protocols" },
  { id: "formulas", label: "Formulas" },
  { id: "security", label: "Security" },
  { id: "applications", label: "Applications" },
  { id: "pros-cons", label: "Pros & Cons" },
  { id: "features", label: "Features" },
  { id: "future", label: "Future / AIoT" },
  { id: "imp", label: "IMP Points" },
  { id: "cheatsheet", label: "Cheat Sheet" },
  { id: "diagrams", label: "Diagrams" },
];

const TIMELINE = [
  { year: "1982", text: "A modified Coke vending machine at Carnegie Mellon University is connected to the internet so students could check stock and temperature remotely — one of the earliest 'connected things'." },
  { year: "1990", text: "John Romkey builds an internet-connected toaster, controllable over the network — an early proof that everyday appliances could be networked." },
  { year: "1999", text: "Kevin Ashton uses the term 'Internet of Things' while working on RFID supply-chain tracking at Procter & Gamble / MIT Auto-ID Center." },
  { year: "2008-09", text: "The number of connected devices exceeds the number of people on Earth — widely treated as the symbolic 'birth' of the real IoT era." },
  { year: "2011", text: "IPv6 is launched publicly, providing the enormous address space needed to give every physical object a unique identity." },
  { year: "2014-16", text: "Smart-home hubs, voice assistants and wearables go mainstream; low-power wide-area networks such as LoRaWAN and NB-IoT emerge." },
  { year: "2018-20", text: "Industry 4.0 and Industrial IoT (IIoT) mature; 5G rollout begins, promising massive low-latency device density." },
  { year: "2021-25", text: "Edge computing + AI merge with IoT to create AIoT (Artificial Intelligence of Things); digital twins become common in manufacturing." },
  { year: "2026 →", text: "6G research, ambient intelligence, self-healing sensor networks and ultra-low-power energy-harvesting devices push IoT toward a truly invisible, always-on fabric of computing." },
];

const TYPES = [
  { title: "Consumer IoT (CIoT)", desc: "Devices built for everyday personal use.", examples: "Smart speakers, smart bulbs, fitness bands, smart TVs, smart locks" },
  { title: "Commercial IoT", desc: "Devices used in business and public-facing environments.", examples: "Smart POS systems, inventory trackers, connected medical equipment" },
  { title: "Industrial IoT (IIoT)", desc: "Devices used in manufacturing, energy and heavy industry for automation and monitoring.", examples: "Predictive maintenance sensors, robotic arms, SCADA systems" },
  { title: "Infrastructure IoT", desc: "Devices that monitor and manage public infrastructure.", examples: "Smart grids, smart streetlights, water-quality sensors, bridge-stress sensors" },
  { title: "Military IoT (IoMT / IoBT)", desc: "'Internet of Battlefield Things' — devices for defense and surveillance.", examples: "Reconnaissance drones, wearable soldier sensors, smart weapons tracking" },
  { title: "Internet of Medical Things (IoMT)", desc: "Connected healthcare and medical devices.", examples: "Remote patient monitors, smart insulin pumps, connected MRI machines" },
];

const LAYERS = [
  { name: "Perception Layer", also: "(Sensing Layer)", fn: "Physical layer that senses and gathers data from the environment using sensors and actuators.", ex: "Temperature sensor, GPS module, RFID tag, camera, accelerometer" },
  { name: "Network Layer", also: "(Transmission Layer)", fn: "Transmits sensed data from devices to processing systems using wired or wireless media.", ex: "Wi-Fi, Bluetooth, Zigbee, LoRaWAN, cellular (4G/5G), gateways, routers" },
  { name: "Middleware / Processing Layer", also: "(Edge & Cloud Layer)", fn: "Stores, analyzes and processes the massive incoming data; performs filtering and decision-making.", ex: "Edge servers, cloud platforms (AWS IoT, Azure IoT Hub), databases, ML models" },
  { name: "Application Layer", also: "(User Layer)", fn: "Delivers application-specific services and the interface through which the user interacts with the system.", ex: "Smart-home app, industrial dashboard, health-monitoring app" },
];

const COMM_MODELS = [
  { title: "Device-to-Device (D2D)", desc: "Two or more devices connect and communicate directly without an intermediary server, usually over Bluetooth, Zigbee or Z-Wave.", ex: "A smart bulb pairing directly with a smart switch." },
  { title: "Device-to-Cloud (D2C)", desc: "A device connects directly to an internet cloud service, typically over Wi-Fi or cellular, to send data and receive commands.", ex: "A smart thermostat pushing readings straight to a cloud dashboard." },
  { title: "Device-to-Gateway (D2G)", desc: "A device sends data to an intermediary gateway/hub, which performs protocol translation before forwarding it to the cloud.", ex: "A Zigbee sensor talking to a smart-home hub that relays data over Wi-Fi." },
  { title: "Back-End Data Sharing", desc: "Cloud data collected from many devices is exported and shared with authorised third-party systems for analytics.", ex: "A fleet-tracking platform sharing anonymised traffic data with a city planning system." },
];

const PROTOCOLS = [
  { name: "MQTT", type: "Application", range: "Internet-wide", power: "Very low", rate: "Low", use: "Lightweight publish/subscribe messaging for constrained devices" },
  { name: "CoAP", type: "Application", range: "Internet-wide", power: "Very low", rate: "Low", use: "REST-like protocol for constrained devices over UDP" },
  { name: "HTTP/HTTPS", type: "Application", range: "Internet-wide", power: "High", rate: "High", use: "Standard web protocol; heavier, used where power isn't constrained" },
  { name: "Bluetooth / BLE", type: "Network (short range)", range: "~10-100 m", power: "Low", rate: "Medium", use: "Wearables, personal area networks" },
  { name: "Zigbee", type: "Network (short range)", range: "~10-100 m (mesh)", power: "Very low", rate: "Low-Medium", use: "Mesh networks for smart-home/industrial sensors" },
  { name: "Z-Wave", type: "Network (short range)", range: "~30-100 m (mesh)", power: "Very low", rate: "Low", use: "Home-automation mesh networking" },
  { name: "Wi-Fi", type: "Network (LAN)", range: "~50 m indoor", power: "High", rate: "Very high", use: "High-bandwidth home/office connectivity" },
  { name: "LoRaWAN", type: "Network (LPWAN)", range: "2-15 km", power: "Extremely low", rate: "Very low", use: "Long-range, low-power sensor networks (agriculture, utilities)" },
  { name: "NB-IoT", type: "Network (LPWAN, cellular)", range: "1-10 km", power: "Extremely low", rate: "Low", use: "Cellular-based low-power wide-area IoT" },
  { name: "5G", type: "Network (cellular)", range: "Cell coverage", power: "Medium-High", rate: "Extremely high", use: "Massive device density, ultra-low latency IIoT & autonomous systems" },
  { name: "RFID", type: "Identification", range: "Few cm - few m", power: "Passive/low", rate: "Low", use: "Asset tagging, supply-chain tracking" },
  { name: "NFC", type: "Identification", range: "< 10 cm", power: "Very low", rate: "Low", use: "Contactless payments, pairing, access cards" },
];

const FORMULAS = [
  {
    name: "Battery / Node Life",
    formula: "Battery Life (hrs) = Battery Capacity (mAh) ÷ Average Current Draw (mA)",
    desc: "Estimates how long a sensor node will run before recharge/replacement — critical for LPWAN sensor planning.",
  },
  {
    name: "Duty Cycle",
    formula: "Duty Cycle (%) = (Active Time ÷ Total Cycle Time) × 100",
    desc: "Fraction of time a device is actively transmitting/awake; lowering it extends battery life.",
  },
  {
    name: "Free Space Path Loss (FSPL)",
    formula: "FSPL (dB) = 20·log₁₀(d) + 20·log₁₀(f) + 32.44",
    desc: "d = distance in km, f = frequency in MHz. Estimates signal loss between a sensor and gateway over open air.",
  },
  {
    name: "Shannon-Hartley Capacity",
    formula: "C = B · log₂(1 + S/N)",
    desc: "C = max channel data rate (bps), B = bandwidth (Hz), S/N = signal-to-noise ratio. Bounds the achievable data rate of a wireless IoT link.",
  },
  {
    name: "Nyquist Sampling Theorem",
    formula: "fs ≥ 2 · fmax",
    desc: "A sensor's sampling frequency must be at least twice the highest frequency component of the signal to avoid aliasing.",
  },
  {
    name: "IPv6 Address Space",
    formula: "Total Addresses = 2¹²⁸ ≈ 3.4 × 10³⁸",
    desc: "Explains why IPv6 (not IPv4's 2³² ≈ 4.3 billion) is required to give every IoT device a unique global address.",
  },
  {
    name: "Data Throughput",
    formula: "Throughput = Data Size ÷ Transmission Time",
    desc: "Effective useful data rate delivered by a device/network link, usually lower than the theoretical channel capacity.",
  },
  {
    name: "Latency Budget",
    formula: "Total Latency = Propagation Delay + Transmission Delay + Processing Delay + Queuing Delay",
    desc: "Sum of all delay sources between a sensor event and the application receiving it — vital for real-time IIoT control loops.",
  },
  {
    name: "Little's Law (Queueing)",
    formula: "L = λ · W",
    desc: "L = average number of messages in a queue/broker, λ = arrival rate, W = average time a message spends in the system. Used to size MQTT brokers/edge queues.",
  },
  {
    name: "Node Density / Coverage",
    formula: "N = Area ÷ (π · r²)",
    desc: "Minimum number of sensor nodes of radio range r needed to cover a given deployment area with no gaps.",
  },
  {
    name: "Energy Consumed",
    formula: "E (Joules) = V × I × t",
    desc: "V = voltage, I = current, t = time. Basic energy-budgeting formula for a sensor node's transmit/sleep cycle.",
  },
  {
    name: "Link Budget",
    formula: "Received Power (dBm) = Tx Power − FSPL + Antenna Gains − Losses",
    desc: "Confirms whether a signal will be strong enough at the receiver to be decoded correctly.",
  },
];

const APPLICATIONS = [
  { icon: "🏠", title: "Smart Home", desc: "Automated lighting, thermostats, security cameras and voice assistants that learn routines." },
  { icon: "🏥", title: "Healthcare (IoMT)", desc: "Remote patient monitoring, smart wearables, connected insulin pumps and hospital asset tracking." },
  { icon: "🌾", title: "Smart Agriculture", desc: "Soil-moisture and weather sensors driving precision irrigation and yield prediction." },
  { icon: "🏭", title: "Industry 4.0 / IIoT", desc: "Predictive maintenance, digital twins and robotic automation on the factory floor." },
  { icon: "🏙️", title: "Smart Cities", desc: "Smart traffic lights, waste-management sensors, air-quality monitoring and smart parking." },
  { icon: "⌚", title: "Wearables", desc: "Fitness trackers, smartwatches and biometric monitors for continuous personal health data." },
  { icon: "🚗", title: "Connected Vehicles", desc: "Telematics, fleet tracking, ADAS and the sensor backbone behind autonomous driving." },
  { icon: "🛒", title: "Smart Retail", desc: "Automated checkout, shelf-inventory sensors and personalised in-store experiences." },
  { icon: "⚡", title: "Smart Energy Grids", desc: "Smart meters and grid sensors balancing load and enabling demand-response pricing." },
  { icon: "🏢", title: "Smart Buildings", desc: "Occupancy-based HVAC, lighting and access control that cut energy waste in offices." },
];

const PROS = [
  "Automates repetitive tasks, saving time and manual effort",
  "Enables real-time monitoring and faster, data-driven decisions",
  "Improves efficiency and reduces operational/energy costs",
  "Enhances safety through predictive maintenance and early alerts",
  "Improves quality of life via smart healthcare and smart homes",
  "Generates rich data that fuels analytics, AI and better business insight",
];

const CONS = [
  "Security & privacy risks — more connected devices mean a larger attack surface",
  "Interoperability issues between vendors and communication standards",
  "High initial setup cost for sensors, gateways and infrastructure",
  "Heavy dependency on stable internet/network connectivity",
  "Massive data volumes need significant storage and processing capacity",
  "Complex device management at scale (updates, patching, monitoring)",
];

const FEATURES = [
  { title: "Connectivity", desc: "Devices are always reachable over a network — wired or wireless." },
  { title: "Sensing", desc: "Ability to perceive real-world physical/chemical/biological quantities." },
  { title: "Heterogeneity", desc: "Devices differ in hardware, protocols and vendors, yet must interoperate." },
  { title: "Scalability", desc: "Architecture must support billions of devices joining and leaving the network." },
  { title: "Dynamic & Self-Adapting", desc: "Devices adjust behaviour automatically based on context (e.g. location, load)." },
  { title: "Intelligence", desc: "Embedded/edge AI enables local decision-making without constant cloud round-trips." },
  { title: "Safety & Security", desc: "Protecting both the physical asset and the data it produces." },
  { title: "Interoperability", desc: "Common protocols/standards let unlike devices exchange data meaningfully." },
];

const IMP_POINTS = [
  "IoT = Internet of Things: a network of physical objects ('things') embedded with sensors, software and connectivity to exchange data over the internet without needing constant human intervention.",
  "The term was coined by Kevin Ashton in 1999 while working on RFID-based supply-chain tracking.",
  "The four commonly examined IoT architecture layers: Perception → Network → Middleware/Processing → Application.",
  "IPv6 (2¹²⁸ addresses) is essential to IoT because IPv4 (2³² addresses) cannot uniquely address billions of devices.",
  "MQTT is lightweight, publish/subscribe, and preferred for constrained, low-bandwidth IoT devices; HTTP is heavier and less power-efficient.",
  "The 4 communication models: Device-to-Device, Device-to-Cloud, Device-to-Gateway, Back-End Data Sharing.",
  "Edge computing processes data close to the source to cut latency; cloud computing centralises heavy storage/analytics.",
  "Sensors sense the environment; actuators act on the environment (e.g. a motor, valve, relay) — do not confuse the two in exams.",
  "IIoT (Industrial IoT) focuses on manufacturing/automation; IoT in general covers consumer + industrial + infrastructure use.",
  "AIoT = Artificial Intelligence + IoT — embedding intelligence directly into connected devices/edge nodes.",
  "LPWAN (LoRaWAN, NB-IoT) trades data rate for very long range and very low power — ideal for battery-run rural sensors.",
  "Digital Twin: a live virtual replica of a physical asset, kept in sync using real-time IoT sensor data.",
];

const NOTES_CONTENT = `INTERNET OF THINGS (IoT) - COMPLETE NOTES
============================================================

1. WHAT IS IoT?
------------------------------------------------------------
The Internet of Things (IoT) is a network of physical objects
("things") - devices, vehicles, appliances, sensors and more -
embedded with sensors, software and connectivity that allows
them to collect, exchange and act on data over the internet,
largely without direct human intervention.
Term coined by Kevin Ashton in 1999 during RFID-based
supply-chain work at MIT's Auto-ID Center.

2. WHY IS IoT USED / WHY IS IT NEEDED?
------------------------------------------------------------
- Automates manual, repetitive monitoring tasks
- Enables real-time visibility into remote assets/processes
- Reduces operational costs and downtime (predictive maintenance)
- Improves safety (early warning, hazard detection)
- Generates data for analytics, AI and better decisions
- Improves convenience and quality of life (smart homes/health)
- Optimises resource usage - energy, water, materials

3. EVOLUTION OF IoT (TIMELINE)
------------------------------------------------------------
1982  - Internet-connected Coke machine at CMU
1990  - John Romkey's internet toaster
1999  - Kevin Ashton coins "Internet of Things"
2008-09 - Connected devices outnumber people on Earth
2011  - IPv6 launched, unlocking massive address space
2014-16 - Smart-home hubs & wearables go mainstream
2018-20 - Industry 4.0 + 5G rollout begins
2021-25 - AIoT (AI + IoT), digital twins mature
2026+ - 6G, ambient intelligence, energy-harvesting IoT

4. IoT ARCHITECTURE (4 LAYERS)
------------------------------------------------------------
1. Perception Layer   - sensors & actuators sense the world
2. Network Layer      - transmits data (Wi-Fi/Zigbee/5G/etc.)
3. Middleware/Processing Layer - edge & cloud store/analyse data
4. Application Layer  - user-facing dashboards/apps/services

BLOCK DIAGRAM (TEXT VERSION):
  [Sensors/Actuators] -> [Gateway] -> [Network/Internet]
        -> [Edge/Cloud Processing] -> [Application/Dashboard]
        -> [End User] --(feedback/commands)--> [Actuators]

5. TYPES OF IoT
------------------------------------------------------------
- Consumer IoT (CIoT): smart speakers, bulbs, wearables
- Commercial IoT: POS systems, connected medical equipment
- Industrial IoT (IIoT): predictive maintenance, robotics
- Infrastructure IoT: smart grids, smart streetlights
- Military IoT (IoBT): drones, soldier sensors
- Internet of Medical Things (IoMT): remote patient monitors

6. COMMUNICATION MODELS
------------------------------------------------------------
- Device-to-Device (D2D)
- Device-to-Cloud (D2C)
- Device-to-Gateway (D2G)
- Back-End Data Sharing

7. KEY PROTOCOLS (QUICK REFERENCE)
------------------------------------------------------------
MQTT     - lightweight pub/sub, very low power, low bandwidth
CoAP     - REST-like, UDP based, constrained devices
HTTP/S   - heavy, high power, high bandwidth
BLE      - short range, low power, wearables
Zigbee   - mesh, short range, very low power
Z-Wave   - mesh, home automation
Wi-Fi    - high bandwidth, high power, ~50m indoor
LoRaWAN  - very long range (2-15 km), extremely low power
NB-IoT   - cellular LPWAN, 1-10 km, extremely low power
5G       - very high speed, ultra-low latency, massive density
RFID     - identification tags, passive, few cm-m range
NFC      - contactless, <10 cm range

8. IMPORTANT FORMULAS
------------------------------------------------------------
Battery Life (hrs) = Battery Capacity (mAh) / Avg Current (mA)
Duty Cycle (%) = (Active Time / Total Cycle Time) x 100
FSPL (dB) = 20 log10(d) + 20 log10(f) + 32.44   [d in km, f in MHz]
Shannon Capacity: C = B * log2(1 + S/N)
Nyquist Theorem: fs >= 2 * fmax
IPv6 Address Space = 2^128 (approx 3.4 x 10^38)
Throughput = Data Size / Transmission Time
Total Latency = Propagation + Transmission + Processing + Queuing Delay
Little's Law: L = lambda * W
Node Density: N = Area / (pi * r^2)
Energy: E (Joules) = V * I * t
Link Budget: Received Power (dBm) = Tx Power - FSPL + Gains - Losses

9. SECURITY IN IoT
------------------------------------------------------------
CIA Triad: Confidentiality, Integrity, Availability
Common threats: weak/default passwords, unpatched firmware,
botnets (e.g. Mirai), man-in-the-middle attacks, data leakage
Best practices: strong unique credentials, TLS/DTLS encryption,
regular OTA firmware updates, network segmentation,
device identity/certificates, minimal open ports

10. APPLICATIONS / WHERE IoT IS USED
------------------------------------------------------------
Smart Home, Healthcare (IoMT), Smart Agriculture,
Industry 4.0/IIoT, Smart Cities, Wearables,
Connected Vehicles, Smart Retail, Smart Energy Grids,
Smart Buildings

11. ADVANTAGES
------------------------------------------------------------
- Automation and time saving
- Real-time monitoring and faster decisions
- Reduced operational and energy costs
- Predictive maintenance improves safety
- Better quality of life
- Rich data for analytics and AI

12. DISADVANTAGES
------------------------------------------------------------
- Security and privacy risks
- Interoperability issues across vendors
- High initial infrastructure cost
- Dependency on stable connectivity
- Large data volumes need storage/processing
- Complex device management at scale

13. FEATURES OF IoT
------------------------------------------------------------
Connectivity, Sensing, Heterogeneity, Scalability,
Dynamic & Self-Adapting behaviour, Embedded Intelligence,
Safety & Security, Interoperability

14. FUTURE OF IoT / HOW IT IS CHANGING GENERATIONS
------------------------------------------------------------
- AIoT: merging AI directly into connected devices/edge nodes
- Edge AI reduces cloud dependency and latency
- 5G/6G enabling massive device density & near-zero latency
- Digital Twins: live virtual replicas synced with real assets
- Energy-harvesting, battery-free sensor nodes
- Ambient intelligence: computing that fades into environment
- IoT is shifting society from "connected people" to a
  "connected physical world," reshaping industry (Industry 4.0),
  healthcare (remote/preventive care), cities (smart & sustainable)
  and daily life (ambient automation) generation after generation.

15. IMPORTANT POINTS (IMP) - QUICK REVISION
------------------------------------------------------------
- IoT = network of physical "things" with sensors + connectivity
- Term coined by Kevin Ashton, 1999
- 4 Architecture layers: Perception, Network, Middleware, Application
- IPv6 needed because IPv4 cannot address billions of devices
- MQTT = lightweight pub/sub; HTTP = heavier
- 4 Communication models: D2D, D2C, D2G, Back-End Data Sharing
- Edge computing = process near source; Cloud = centralised heavy analytics
- Sensors sense; Actuators act - do not confuse them
- IIoT = Industrial focus; IoT = broader (consumer+industrial+infra)
- AIoT = AI + IoT
- LPWAN (LoRaWAN/NB-IoT) = long range + very low power, low data rate
- Digital Twin = live virtual replica synced via real-time IoT data

============================================================
Thank you for downloading these IoT notes. Study well and
all the best for your exams / projects!
============================================================
`;

/* ------------------------------------------------------------------ */
/*  SVG DIAGRAMS                                                       */
/* ------------------------------------------------------------------ */

function BlockDiagram() {
  return (
    <svg
      viewBox="0 0 900 260"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[
        { x: 10, label: "Sensors /", label2: "Actuators", sub: "Perception" },
        { x: 190, label: "Gateway /", label2: "Router", sub: "Network" },
        { x: 370, label: "Edge / Cloud", label2: "Processing", sub: "Middleware" },
        { x: 550, label: "Dashboard /", label2: "Application", sub: "Application" },
        { x: 730, label: "End", label2: "User", sub: "" },
      ].map((box, i) => (
        <g key={box.sub + i}>
          <rect
            x={box.x}
            y={70}
            width={150}
            height={90}
            rx={14}
            className="fill-cyan-50 dark:fill-cyan-950/40 stroke-cyan-500 dark:stroke-cyan-400"
            strokeWidth={2}
          />
          <text
            x={box.x + 75}
            y={108}
            textAnchor="middle"
            className="fill-slate-700 dark:fill-slate-200"
            fontSize="15"
            fontWeight={600}
          >
            {box.label}
          </text>
          <text
            x={box.x + 75}
            y={128}
            textAnchor="middle"
            className="fill-slate-700 dark:fill-slate-200"
            fontSize="15"
            fontWeight={600}
          >
            {box.label2}
          </text>
          {box.sub && (
            <text
              x={box.x + 75}
              y={55}
              textAnchor="middle"
              className="fill-amber-600 dark:fill-amber-400"
              fontSize="12"
              letterSpacing="1"
            >
              {box.sub.toUpperCase()}
            </text>
          )}
        </g>
      ))}

      {/* forward arrows */}
      {[160, 340, 520, 700].map((x, i) => (
        <g key={"arrow-" + i}>
          <line
            x1={x}
            y1={115}
            x2={x + 30}
            y2={115}
            className="stroke-slate-400 dark:stroke-slate-500"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
        </g>
      ))}

      {/* feedback path */}
      <path
        d="M 805 160 L 805 220 L 85 220 L 85 165"
        fill="none"
        className="stroke-amber-500 dark:stroke-amber-400"
        strokeWidth={2}
        strokeDasharray="6 4"
        markerEnd="url(#arrowhead-amber)"
      />
      <text
        x={445}
        y={238}
        textAnchor="middle"
        className="fill-amber-600 dark:fill-amber-400"
        fontSize="12"
      >
        feedback / control commands to actuators
      </text>

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
        <marker id="arrowhead-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-amber-500 dark:fill-amber-400" />
        </marker>
      </defs>
    </svg>
  );
}

function LayerSketch() {
  const layers = ["Application Layer", "Middleware / Processing Layer", "Network Layer", "Perception Layer"];
  return (
    <svg viewBox="0 0 500 260" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {layers.map((l, i) => (
        <g key={l}>
          <rect
            x={40}
            y={10 + i * 60}
            width={420}
            height={46}
            rx={10}
            className={
              i % 2 === 0
                ? "fill-cyan-50 dark:fill-cyan-950/40 stroke-cyan-500 dark:stroke-cyan-400"
                : "fill-amber-50 dark:fill-amber-950/30 stroke-amber-500 dark:stroke-amber-400"
            }
            strokeWidth={2}
          />
          <text
            x={250}
            y={10 + i * 60 + 29}
            textAnchor="middle"
            className="fill-slate-700 dark:fill-slate-200"
            fontSize="15"
            fontWeight={600}
          >
            {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function SmartHomeSketch() {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* house outline */}
      <path
        d="M60 140 L200 40 L340 140 L340 220 L60 220 Z"
        className="fill-none stroke-slate-500 dark:stroke-slate-400"
        strokeWidth={3}
      />
      <rect x={100} y={160} width={50} height={60} className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />
      <rect x={230} y={160} width={40} height={40} className="fill-none stroke-slate-500 dark:stroke-slate-400" strokeWidth={2} />

      {/* device dots */}
      {[
        { x: 200, y: 60, label: "Hub" },
        { x: 120, y: 175, label: "Lock" },
        { x: 250, y: 175, label: "Sensor" },
        { x: 300, y: 120, label: "Cam" },
        { x: 90, y: 120, label: "Bulb" },
      ].map((d) => (
        <g key={d.label}>
          <circle cx={d.x} cy={d.y} r={7} className="fill-cyan-500 dark:fill-cyan-400" />
          <text
            x={d.x}
            y={d.y - 12}
            textAnchor="middle"
            fontSize="11"
            className="fill-slate-600 dark:fill-slate-300"
          >
            {d.label}
          </text>
        </g>
      ))}

      {/* connecting lines to hub */}
      {[
        [120, 175],
        [250, 175],
        [300, 120],
        [90, 120],
      ].map(([x, y], i) => (
        <line
          key={i}
          x1={200}
          y1={60}
          x2={x}
          y2={y}
          className="stroke-amber-400 dark:stroke-amber-500"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ICONS                                                               */
/* ------------------------------------------------------------------ */



function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function IoTPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("iot-notes-theme") : null;
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("iot-notes-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t: "light" | "dark") => (t === "light" ? "dark" : "light"));

  const handleDownload = () => {
    const blob = new Blob([NOTES_CONTENT], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "IoT-Complete-Notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 4500);
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-[#0a0f1e] text-slate-800 dark:text-slate-200 transition-colors duration-300">
        {/* ---------------- HEADER ---------------- */}
        <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0a0f1e]/90 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-cyan-500 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-slate-900 font-mono font-bold text-sm">
                IoT
              </span>
              <div>
                <p className="font-mono font-bold leading-none text-slate-900 dark:text-white">IoT Notes</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  Complete guide &amp; cheat sheet
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-900 text-sm font-medium px-3.5 py-2 transition-colors"
              >
                <DownloadIcon />
                Download Notes
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-8">
          {/* ---------------- TOC (sidebar) ---------------- */}
          <aside className="hidden lg:block w-56 shrink-0 py-8">
            <nav className="sticky top-24 space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Contents
              </p>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 py-1 border-l-2 border-transparent hover:border-cyan-500 pl-3 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <main className="flex-1 min-w-0 py-8 space-y-20">
            {/* HERO */}
            <section className="pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
                Study Notes · IoT
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                Internet of Things
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl text-base md:text-lg">
                A complete, exam-ready guide to IoT - definitions, architecture, types,
                protocols, formulas, security, applications, cheat sheets and diagrams,
                all in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Definitions", "Block Diagrams", "Formulas", "Cheat Sheet", "IMP Points", "Downloadable Notes"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
              <button
                onClick={handleDownload}
                className="sm:hidden mt-6 flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 text-white dark:text-slate-900 text-sm font-medium px-4 py-2.5 transition-colors"
              >
                <DownloadIcon />
                Download Notes
              </button>
            </section>

            {/* WHAT IS IoT */}
            <section id="intro" className="scroll-mt-24">
              <SectionHeading eyebrow="01 · Basics" title="What is IoT?" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The <strong>Internet of Things (IoT)</strong> refers to a network of physical
                objects — "things" — such as sensors, appliances, vehicles and machines that are
                embedded with electronics, software and network connectivity. This lets them
                collect and exchange data, and often take action, over the internet largely
                without needing constant human involvement.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                In short: IoT connects the <em>physical world</em> to the <em>digital world</em>,
                turning everyday objects into data sources and remote-controllable endpoints. The
                phrase was popularised by <strong>Kevin Ashton</strong> in 1999 while describing
                RFID-based supply-chain tracking.
              </p>
              <div className="mt-5 rounded-xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/30 p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Simple definition to remember:</strong> "IoT = Sensors + Connectivity +
                  Data Processing + Action, applied to everyday physical objects."
                </p>
              </div>
            </section>

            {/* WHY IoT */}
            <section id="why" className="scroll-mt-24">
              <SectionHeading eyebrow="02 · Motivation" title="Why is IoT used? Why is it needed?" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Automates manual, repetitive monitoring and control tasks",
                  "Gives real-time visibility into remote assets and environments",
                  "Cuts operating costs via predictive maintenance and efficiency gains",
                  "Improves safety with early hazard detection and alerts",
                  "Produces rich data that fuels analytics, AI and better decisions",
                  "Improves convenience, health outcomes and quality of life",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900/40"
                  >
                    <span className="text-cyan-500 dark:text-cyan-400 mt-0.5">▸</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* EVOLUTION */}
            <section id="evolution" className="scroll-mt-24">
              <SectionHeading eyebrow="03 · History" title="How IoT Evolved: The Journey of an Era" />
              <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-6">
                {TIMELINE.map((t) => (
                  <div key={t.year} className="pl-6 relative">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-500 dark:bg-cyan-400 border-4 border-white dark:border-[#0a0f1e]" />
                    <p className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">{t.year}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{t.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="scroll-mt-24">
              <SectionHeading eyebrow="04 · System Design" title="IoT Architecture & Block Diagram" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Data flows from the physical world up through processing layers and back down
                again as control commands — a closed loop between sensing and acting.
              </p>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 bg-slate-50 dark:bg-slate-900/40">
                <BlockDiagram />
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[560px]">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Layer</th>
                      <th className="py-2 pr-4 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Function</th>
                      <th className="py-2 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LAYERS.map((l) => (
                      <tr key={l.name} className="border-b border-slate-100 dark:border-slate-800/60 align-top">
                        <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          {l.name}
                          <div className="text-xs text-slate-400 font-normal">{l.also}</div>
                        </td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{l.fn}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{l.ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* TYPES */}
            <section id="types" className="scroll-mt-24">
              <SectionHeading eyebrow="05 · Categories" title="Types of IoT" />
              <div className="grid sm:grid-cols-2 gap-4">
                {TYPES.map((t) => (
                  <div
                    key={t.title}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40"
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{t.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{t.desc}</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2.5 font-mono">{t.examples}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* COMPONENTS */}
            <section id="components" className="scroll-mt-24">
              <SectionHeading eyebrow="06 · Building Blocks" title="Core Components of an IoT System" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { t: "Sensors", d: "Detect physical/chemical quantities (temperature, motion, light, gas, etc.) and convert them into data." },
                  { t: "Actuators", d: "Act on the environment based on decisions — motors, relays, valves, servos." },
                  { t: "Connectivity", d: "Communication hardware/protocols moving data between devices, gateways and the cloud." },
                  { t: "Gateway", d: "Bridges local device protocols to internet protocols; often does local pre-processing." },
                  { t: "Data Processing", d: "Edge or cloud compute that filters, analyses and derives insight from raw sensor data." },
                  { t: "User Interface", d: "Dashboards, apps or voice interfaces through which people monitor/control the system." },
                ].map((c) => (
                  <div key={c.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{c.t}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{c.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* COMMUNICATION MODELS */}
            <section id="communication" className="scroll-mt-24">
              <SectionHeading eyebrow="07 · Networking" title="IoT Communication Models" />
              <div className="grid sm:grid-cols-2 gap-4">
                {COMM_MODELS.map((m) => (
                  <div key={m.title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{m.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{m.desc}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">e.g. {m.ex}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PROTOCOLS / CHEAT SHEET TABLE */}
            <section id="protocols" className="scroll-mt-24">
              <SectionHeading eyebrow="08 · Reference" title="Protocols Cheat Sheet" />
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm border-collapse min-w-[720px]">
                  <thead>
                    <tr className="text-left bg-slate-50 dark:bg-slate-900/60">
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Protocol</th>
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Type</th>
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Range</th>
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Power</th>
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Data Rate</th>
                      <th className="py-2.5 px-3 font-mono text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Typical Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROTOCOLS.map((p, i) => (
                      <tr
                        key={p.name}
                        className={`border-t border-slate-100 dark:border-slate-800/60 ${i % 2 === 0 ? "" : "bg-slate-50/60 dark:bg-slate-900/30"}`}
                      >
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">{p.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.type}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.range}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.power}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.rate}</td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{p.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FORMULAS */}
            <section id="formulas" className="scroll-mt-24">
              <SectionHeading eyebrow="09 · Math" title="Important Formulas" />
              <div className="grid md:grid-cols-2 gap-4">
                {FORMULAS.map((f) => (
                  <div key={f.name} className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{f.name}</h3>
                    <p className="font-mono text-sm text-amber-700 dark:text-amber-400 mt-2 bg-white/70 dark:bg-black/20 rounded px-2 py-1.5 inline-block">
                      {f.formula}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECURITY */}
            <section id="security" className="scroll-mt-24">
              <SectionHeading eyebrow="10 · Protection" title="Security in IoT" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                More connected endpoints means a larger attack surface. IoT security is judged
                against the classic <strong>CIA triad</strong>: Confidentiality, Integrity and
                Availability.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Common Threats</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                    <li>Weak or default device passwords</li>
                    <li>Unpatched / outdated firmware</li>
                    <li>Botnets built from hijacked devices (e.g. Mirai)</li>
                    <li>Man-in-the-middle attacks on unencrypted links</li>
                    <li>Unauthorised data collection / privacy leakage</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Best Practices</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                    <li>Strong, unique credentials per device</li>
                    <li>TLS/DTLS encryption for data in transit</li>
                    <li>Regular OTA (over-the-air) firmware updates</li>
                    <li>Network segmentation for IoT devices</li>
                    <li>Device identity via certificates; minimal open ports</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* APPLICATIONS */}
            <section id="applications" className="scroll-mt-24">
              <SectionHeading eyebrow="11 · Real World" title="Where is IoT Used Mostly?" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {APPLICATIONS.map((a) => (
                  <div key={a.title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/40">
                    <span className="text-2xl">{a.icon}</span>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-2">{a.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{a.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PROS / CONS */}
            <section id="pros-cons" className="scroll-mt-24">
              <SectionHeading eyebrow="12 · Is it worth it?" title="Is IoT Helpful? Advantages & Disadvantages" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 p-4">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Advantages</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1.5">
                    {PROS.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-emerald-500">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-red-200 dark:border-red-900/50 p-4">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Disadvantages</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1.5">
                    {CONS.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span className="text-red-500">✕</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="scroll-mt-24">
              <SectionHeading eyebrow="13 · Characteristics" title="Features of IoT" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FEATURES.map((f) => (
                  <div key={f.title} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FUTURE */}
            <section id="future" className="scroll-mt-24">
              <SectionHeading eyebrow="14 · What's Next" title="Future of IoT & How It's Reshaping Generations" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                IoT is steadily moving from "connected gadgets" toward an{" "}
                <strong>ambient, intelligent fabric</strong> woven into daily life, industry and
                cities — shifting each generation's relationship with technology from something
                you operate to something that quietly assists you.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {[
                  { t: "AIoT", d: "AI models embedded directly on-device/edge, enabling local, instant decision-making without constant cloud round-trips." },
                  { t: "5G → 6G", d: "Massive device density and near-zero latency, unlocking real-time industrial control and autonomous systems." },
                  { t: "Digital Twins", d: "Live virtual replicas of physical assets, continuously synced with real-time sensor data for simulation and optimisation." },
                  { t: "Energy Harvesting", d: "Battery-free sensor nodes powered by ambient light, vibration or RF energy — enabling maintenance-free deployments." },
                  { t: "Ambient Intelligence", d: "Computing that fades into the environment — spaces that sense and respond without visible interfaces." },
                  { t: "Sustainability", d: "Smart grids, precision agriculture and smart buildings driving major reductions in resource waste." },
                ].map((f) => (
                  <div key={f.t} className="rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/20 p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{f.t}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">{f.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* IMP POINTS */}
            <section id="imp" className="scroll-mt-24">
              <SectionHeading eyebrow="15 · Exam Focus" title="IMP — Important Points" />
              <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-5">
                <ul className="space-y-2.5">
                  {IMP_POINTS.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                      <span className="font-mono text-amber-600 dark:text-amber-400 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* CHEAT SHEET */}
            <section id="cheatsheet" className="scroll-mt-24">
              <SectionHeading eyebrow="16 · At a Glance" title="One-Page Cheat Sheet" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CheatCard title="Definition" body="Physical objects + sensors + connectivity + data exchange, with minimal human intervention." />
                <CheatCard title="Coined By" body="Kevin Ashton, 1999 (RFID / supply-chain context)." />
                <CheatCard title="4 Layers" body="Perception → Network → Middleware → Application." />
                <CheatCard title="4 Comm. Models" body="D2D · D2C · D2G · Back-End Data Sharing." />
                <CheatCard title="Lightweight Protocol" body="MQTT — publish/subscribe, low power, low bandwidth." />
                <CheatCard title="Long-Range Low-Power" body="LoRaWAN / NB-IoT — LPWAN class." />
                <CheatCard title="Addressing" body="IPv6 → 2¹²⁸ addresses (vs IPv4's 2³²)." />
                <CheatCard title="Sampling Rule" body="Nyquist: fs ≥ 2 × fmax." />
                <CheatCard title="Capacity Formula" body="Shannon: C = B·log₂(1+S/N)." />
                <CheatCard title="Security Triad" body="Confidentiality · Integrity · Availability." />
                <CheatCard title="IIoT" body="Industrial IoT — factories, predictive maintenance." />
                <CheatCard title="AIoT" body="AI + IoT — intelligence embedded at the edge." />
              </div>
            </section>

            {/* DIAGRAMS */}
            <section id="diagrams" className="scroll-mt-24">
              <SectionHeading eyebrow="17 · Visuals" title="Diagrams & Sketches" />
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Layered Architecture Sketch</p>
                  <LayerSketch />
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Smart Home Network Sketch</p>
                  <SmartHomeSketch />
                </div>
              </div>
            </section>

            {/* FOOTER DOWNLOAD CTA */}
            <section className="rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/30 dark:to-transparent p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                Take these notes with you
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
                Download the complete IoT notes — definitions, formulas, cheat sheet and IMP
                points — as a single text file for offline revision.
              </p>
              <button
                onClick={handleDownload}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-900 font-medium px-5 py-2.5 transition-colors"
              >
                <DownloadIcon />
                Download IoT Notes
              </button>
            </section>

            <footer className="text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
              IoT Notes — built for quick revision. Toggle light/dark mode from the header.
            </footer>
          </main>
        </div>

        {/* THANK YOU TOAST */}
        {showThanks && (
          <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 shadow-lg p-4 flex items-start gap-3 animate-[fadeIn_0.2s_ease-out]">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Thank you for downloading!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your IoT notes are saved. Happy studying! 🚀
              </p>
            </div>
            <button
              onClick={() => setShowThanks(false)}
              className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL SUBCOMPONENTS                                                 */
/* ------------------------------------------------------------------ */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-1.5">
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

function CheatCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900/40">
      <p className="text-xs font-mono uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{body}</p>
    </div>
  );
}