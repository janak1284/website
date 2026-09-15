# Resonance 2026 - Technical Architecture & Documentation

This repository contains the source code for the Resonance 2026 Landing Page. The application utilizes a layered rendering architecture, decoupling the 2D DOM UI from a fixed WebGL background canvas, and linking their states exclusively via scroll progression to achieve high-performance 60FPS animations.

## 🏗️ Architecture Overview

The application is built on React 18, utilizing Vite for HMR and optimized production bundling. The rendering pipeline is split into two distinct layers:

1.  **WebGL Layer (Background)**: Powered by `three.js` and `@react-three/fiber`. It handles raw vertex calculations and WebGL rendering for 10,000 particles. It sits entirely independently in a fixed `<Canvas>` element at `z-index: 0`.
2.  **DOM UI Layer (Foreground)**: A standard React tree managing HTML/CSS components. It utilizes `framer-motion` to map the browser's native scroll events into interpolatable float values (`0.0` to `1.0`), driving UI element transforms.

---

## 🧬 WebGL Particle Engine (`ParticleScene.jsx`)

The core of the visual experience is a custom 3D particle engine. 

### Data Structure & Memory Management
To maintain 60FPS while animating 10,000 particles, we bypass standard React state for vertex positions. 
- During initialization (`useMemo`), we allocate flat, fixed-length `Float32Array` buffers (length: `30000` for `[x, y, z]` coordinates).
- We pre-compute 4 distinct target mathematical formations:
    1.  **Resonance Torus**: Parametric equations mapping coordinates to a dense, hollow ring.
    2.  **Domain Clusters**: Volumetric noise-based clustering around fixed nodes.
    3.  **Thick Double Helix**: Parametric intertwined cylinders with volume/radius offsets.
    4.  **Data Grid**: A flattened 2D plane with localized Z-axis noise.

### The Render Loop (`useFrame`)
The core animation runs inside R3F's `useFrame` hook, firing on every requestAnimationFrame:

-   **Scroll-Driven Interpolation**: The `App.jsx` passes down `scrollYProgress` (a framer-motion `MotionValue`). Inside the render loop, we determine the current "active" segment (out of 10 total DOM sections). We calculate a localized `t` value mapping the scroll distance between the previous and next shape. We pass `t` through a `smoothstep` function and manually interpolate the `currentPositions` array between the two target `Float32Array` buffers.
-   **Idle Physics**: A high-frequency sine-wave function (`Math.sin(clock.elapsedTime + seed)`) is applied additively to the interpolated `currentPositions` to create breathing/rippling effects without modifying the target matrices.
-   **Cursor Repulsion Engine**: 
    - The engine tracks the normalized device coordinates (NDC) of the cursor.
    - We use `camera.unproject()` to convert the 2D mouse position into a 3D intersection point on the Z-plane of the particles.
    - For each vertex, we calculate the Euclidean distance to the unprojected cursor. If `distance < threshold`, we calculate a normalized repulsion vector and apply an exponential falloff force.
    - Particle restitution (snapping back to formation) is handled via `THREE.MathUtils.damp()` to simulate spring physics.

### Performance Optimizations
- **Buffer Geometry updates**: The `pointsRef.current.geometry.attributes.position.needsUpdate` flag is only set to `true` at the end of the loop, executing a single batch update to the GPU.
- **Reduced Motion**: The engine respects CSS media queries (`useReducedMotion`). If true, the idle breathing physics are disabled and cursor repulsion radii are minimized to prevent nausea.

---

## 🎛️ DOM UI Engine & Scroll Mapping

The foreground UI strictly avoids React state (`useState`) for scroll animations to prevent React reconciliation thrashing on every scroll event.

- **`framer-motion` Integration**: We utilize `useScroll()` combined with `useTransform()`. This extracts scroll events off the main React thread and applies them directly to the CSSOM via CSS variables and hardware-accelerated transforms (`translate3d`, `opacity`).
- **Composition Layers**: Glassmorphic cards (`backdrop-blur`) and animated typography elements are promoted to their own compositor layers.
- **Example Mapping (`Schedule.jsx`)**: The central glowing timeline utilizes `useTransform(scrollYProgress, [start, end], ["0%", "100%"])` mapped to the `height` style. As the browser scrolls, the height is interpolated continuously, exactly tracking the scroll wheel's physical momentum.

---

## ⚡ Performance & Scale: Handling 700+ Concurrent Users

To support a massive influx of concurrent interactions during the hackathon (live judging, real-time leaderboard updates, and heavy visual rendering), the stack was deeply optimized across both the frontend and backend:

### 1. High-Concurrency Backend (FastAPI + AsyncPG)
- **Asynchronous Architecture:** The backend relies entirely on **FastAPI** leveraging Python's `asyncio` for non-blocking IO. This allows a single Python process to handle hundreds of concurrent requests efficiently.
- **Optimized Database Connections:** We utilize **PostgreSQL** with the **`asyncpg`** driver and SQLAlchemy 2.0 asynchronous sessions. Connection pooling ensures that even with 700+ concurrent database operations, connections are reused and never bottlenecked, preventing connection exhaustion under heavy load.
- **Stateless Authentication:** Stateless JWT-based authentication removes the need for database lookups on every secure request, drastically reducing database read pressure during peak traffic.

### 2. Frontend Rendering & Memory Optimizations
- **Bypassing React Reconciliation:** For the 10,000+ interactive particles, React state is strictly bypassed. Computations are sent directly to the GPU via fixed `Float32Array` buffers and batched buffer geometry updates.
- **Off-Main-Thread UI Animations:** All major DOM animations use `framer-motion`'s `useScroll` combined with `useTransform`, mapping scroll momentum directly to the CSSOM (hardware-accelerated `translate3d`), freeing up the main thread and guaranteeing a buttery-smooth 60FPS even under heavy processing load.
- **Compositor Layering:** Glassmorphic elements and high-repaint components are isolated into their own CSS compositor layers to avoid painting thrashing across the entire DOM tree.

## 📂 Project Structure

```text
├── backend/
│   ├── routers/                # API Endpoints (admin, judging, users, etc.)
│   ├── main.py                 # FastAPI Application Entrypoint
│   ├── models.py               # Database Models (SQLAlchemy)
│   ├── database.py             # DB Connection & Session Management
│   ├── auth.py                 # Core Authentication Logic (JWT)
│   ├── auth_judging.py         # Judging-Specific Auth Middleware
│   ├── Dockerfile              # Containerization
│   └── requirements.txt        # Python Dependencies
├── frontend/
│   ├── public/                 # Static Assets (Brochures, videos, raw SVGs)
│   ├── src/
│   │   ├── components/         # React Components (Hero, About, ParticleScene, ui/, etc.)
│   │   ├── pages/              # Route Pages (Dashboard, Home, JudgingConsole, etc.)
│   │   ├── App.jsx             # Root Layout & Routing
│   │   ├── main.jsx            # React DOM Binding
│   │   └── index.css           # Tailwind Directives & Global Styles
│   ├── package.json            # Node Dependencies
│   └── vite.config.js          # Bundler configuration
└── README.md
```

## 🛠️ Setup & Local Development

### 1. Environment Variables Setup

Ensure you have a `.env` file in the root of your project directory. It should contain the following variables:

```env
# Backend Database Configuration (PostgreSQL with asyncpg driver)
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_string

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 2. Backend Setup (FastAPI)

1. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate # Windows
   source venv/bin/activate # macOS/Linux
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize the Database**:
   ```bash
   python -c "import asyncio; from database import init_db; asyncio.run(init_db())"
   ```

4. **Run the FastAPI Development Server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The API will be available at `http://localhost:8000` and docs at `http://localhost:8000/docs`.

### 3. Frontend Setup (React + Vite)

1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Run the Vite Development Server**:
   ```bash
   npm run dev
   ```
   The frontend development server will start, typically available at `http://localhost:5173`.

## 🚀 Building for Production

**Frontend**:
```bash
npm run build
```
This will generate optimized static files in the `dist` folder.

**Backend**:
Run the Uvicorn server without the `--reload` flag and consider using Gunicorn with Uvicorn workers for better performance.
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
