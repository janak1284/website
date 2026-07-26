# Resonance Hackathon 2026 - Landing Page

Welcome to the official landing page repository for **Resonance 2026**, a 48-hour national level hackathon hosted at VIT Chennai. This website is designed to be highly immersive, cinematic, and technically impressive, leveraging cutting-edge web technologies to create a memorable first impression.

## 🚀 Tech Stack

- **Framework**: React (Bootstrapped with Vite for instant server start and lightning-fast HMR).
- **Styling**: Tailwind CSS (Utility-first CSS framework for rapid UI development and glassmorphism effects).
- **2D Animations**: Framer Motion (Used extensively for scroll-driven animations and layout transitions).
- **3D Rendering**: React Three Fiber (`@react-three/fiber`) & Three.js (Used to power the complex, interactive 3D particle background).
- **Icons**: Lucide React.

## 🎨 Design & Color Theme

The website utilizes a deep, futuristic, "cyber-space" aesthetic intended to resonate with developers and designers.

- **Background Space**: Extremely deep violet/black (`#0a0a0a` to `#130d26`).
- **Primary Highlights**: Vibrant Purple (`#8B5CF6`) and Bright Magenta (`#C026D3`).
- **Typography**: **Orbitron** is used for all major headings and stylistic text to give a structured, sci-fi feel, complemented by highly legible sans-serif body text (white with varying opacities `white/60`, `white/80` for hierarchy).
- **UI Elements**: Glassmorphism. Components sit on frosted glass cards (`bg-[#130d26]/40` with `backdrop-blur` and `border-white/5` borders) to allow the 3D particles in the background to shine through.
- **Prize Podium**: Uses specific metallic hex codes (Gold `#FFD700`, Silver `#C0C0C0`, Bronze `#CD7F32`) combined with glow filters.

## 🧩 Website Structure & Components

The application is structured sequentially. The 3D canvas sits fixed in the background while the 2D React components scroll over it.

### `App.jsx`
The root component. It handles the rendering of the fixed `<Canvas>` for the 3D particles, and sequentially lazy-loads all the foreground UI components to ensure the initial paint (the Hero section) is lightning fast.

### Main Foreground Components:
1. **`Hero.jsx`**: The initial viewport. Features the massive "RESONANCE" title, the event dates, and the primary "Register Now" Call to Action.
2. **`About.jsx`**: Introduces the hackathon. Uses a split layout featuring the core text alongside the official **Vision** and **Mission** of the event on frosted cards.
3. **`ProblemStatements.jsx`**: Displays the 6 core domains of the hackathon (Computer Science, AI & ML, Data Science, Cyber Security, Software Engineering, IoT) in a responsive bento-grid layout.
4. **`Prizes.jsx`**: A visual podium displaying the ₹20,000+ prize pool. Also contains a numerical statistics grid highlighting event scale (300+ expected students, 48 hours non-stop).
5. **`Schedule.jsx`**: A vertical timeline of the 48-hour event. 
6. **`Contact.jsx`**: The final section containing the Frequently Asked Questions (FAQ) and the primary points of contact (Nerolena & Devika).

*(Note: There are also scaffolding components like `Qualification.jsx`, `Speakers.jsx`, `Sponsors.jsx`, and `Venue.jsx` ready for future content).*

## ✨ Key Features & How They Work

### 1. Scroll-Coupled 2D UI Animations
Instead of relying on time-based animations or simple intersection observers (where elements just "pop in" when scrolled to), almost all components use **Framer Motion's `useScroll` and `useTransform` hooks**.
- **How it works**: The animation progress is physically tied to the user's scroll wheel. If a user scrolls halfway down a section, an element might only be 50% faded in and halfway slid up from the bottom. This creates a highly fluid, cinematic feeling.
- **Example**: In `Schedule.jsx`, a glowing vertical line physically "draws" itself down the screen exactly matching your scroll position, highlighting timeline nodes only when the line touches them.

### 2. The 3D Morphing Particle Engine
The background is entirely rendered in WebGL using `ParticleScene.jsx`. It manages 10,000 individual vertices (particles) dynamically.
- **Morphing Structures**: The 10,000 particles smoothly interpolate between **4 distinct mathematical shapes** depending on which section the user is currently looking at:
  1. **Resonance Ring**: A massive, undulating hollow torus (Hero & Contact).
  2. **Domain Clusters**: Tight network hubs mapping to the problem statements (About & Domains).
  3. **Thick Double Helix**: Two massive intertwined pillars with calculated volume (Prizes, Qualification, Schedule).
  4. **Data Grid**: A flat, wavy landscape plane (Speakers, Sponsors, Venue).
- **Interpolation Logic**: As the user scrolls, `scrollYProgress` is calculated. The engine determines exactly which two shapes the user is between, and calculates a floating-point interpolation factor (`t`). This `t` value is run through a smoothstep curve, resulting in the mesmerizing, slow-motion fluid deformation seen on screen.
- **Interactive Cursor Physics**: Using a raycaster and unprojected 3D coordinates, the 10,000 particles constantly calculate their distance to the user's mouse. When the mouse gets close, a repulsion vector pushes the particles away. They then use spring-physics (`THREE.MathUtils.damp`) to snap back to their mathematical formation when the mouse leaves.

## 🛠️ Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
