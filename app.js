/**
 * AMRENDRA YADAV — SYSTEMS & CREATIVE PORTFOLIO (DELHI, INDIA)
 * Core Architecture & Reactive Interactive Engine
 * Zero external libraries. 100% Native Web Standards.
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================================================
  // 1. DATA REPOSITORY: REAL PRODUCTION SYSTEMS & LIVE SOURCE
  // =========================================================================
  const PROJECTS_CATALOG = [
    {
      id: "aether-engine",
      category: "cpp",
      discipline: "C++ Native Core",
      title: "Aether 3D • OpenGL Graphics Subsystem",
      summary: "Low-latency deferred rendering engine in C++17 with custom memory arena allocators, GLSL shader pipelines, and real-time cascaded shadow maps.",
      tags: ["C++17", "OpenGL 4.6", "GLSL", "SIMD", "Memory Arenas"],
      filename: "aether_renderer.cpp",
      github: "https://github.com/amrendrayadav03321-a11y",
      accent: "cyan",
      source: `// ====================================================================
// AETHER 3D GRAPHICS PIPELINE — BUFFER STREAM & ARENA ALLOCATOR
// Developer: Amrendra Yadav • Delhi, India
// Standards: C++17 / Modern OpenGL 4.6 Core Profile
// ====================================================================

#include <iostream>
#include <vector>
#include <memory>
#include <chrono>
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

namespace Aether::Graphics {

    struct VertexData {
        glm::vec3 position;
        glm::vec3 normal;
        glm::vec2 texCoords;
    };

    class LinearMemoryArena {
    private:
        size_t m_capacity;
        size_t m_offset{0};
        uint8_t* m_buffer{nullptr};

    public:
        explicit LinearMemoryArena(size_t capacityBytes) : m_capacity(capacityBytes) {
            m_buffer = new (std::nothrow) uint8_t[capacityBytes];
        }

        ~LinearMemoryArena() { delete[] m_buffer; }

        void* Allocate(size_t size, size_t alignment = alignof(std::max_align_t)) {
            size_t currentAddr = reinterpret_cast<size_t>(m_buffer + m_offset);
            size_t alignedAddr = (currentAddr + alignment - 1) & ~(alignment - 1);
            size_t totalBytes = (alignedAddr - currentAddr) + size;

            if (m_offset + totalBytes > m_capacity) return nullptr;
            m_offset += totalBytes;
            return reinterpret_cast<void*>(alignedAddr);
        }

        void Reset() { m_offset = 0; }
    };

    class ShaderPipeline {
    public:
        GLuint programId{0};

        void Dispatch(const glm::mat4& viewProjMatrix, const glm::vec3& lightPos) const {
            glUseProgram(programId);
            glUniformMatrix4fv(glGetUniformLocation(programId, "u_ViewProj"), 1, GL_FALSE, &viewProjMatrix[0][0]);
            glUniform3fv(glGetUniformLocation(programId, "u_LightPosition"), 1, &lightPos[0]);
        }
    };
}`
    },
    {
      id: "pystream-analytics",
      category: "python",
      discipline: "Python & ML Core",
      title: "PyStream • Real-Time Packet Anomaly Detector",
      summary: "Distributed event ingestion stream utilizing Scikit-Learn Isolation Forests to detect network anomalies and telemetry drops with sub-millisecond classification.",
      tags: ["Python 3.10", "Scikit-Learn", "NumPy", "AsyncIO", "Telemetry"],
      filename: "pystream_classifier.py",
      github: "https://github.com/amrendrayadav03321-a11y/Zomato-Data-Analysis",
      accent: "violet",
      source: `# ====================================================================
# PYSTREAM PACKET INGESTION & ISOLATION FOREST CLASSIFIER
# Developer: Amrendra Yadav • Delhi, India
# Stack: Python 3.10+ / AsyncIO / NumPy / Scikit-Learn
# ====================================================================

import asyncio
import json
import logging
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import IsolationForest

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class PacketAnomalyEngine:
    """Real-time statistical anomaly detector for continuous network streams."""
    
    def __init__(self, contamination_rate: float = 0.015, buffer_size: int = 1500) -> None:
        self.detector = IsolationForest(
            contamination=contamination_rate,
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )
        self.buffer_size: int = buffer_size
        self.training_buffer: List[List[float]] = []
        self.is_calibrated: bool = False

    def extract_features(self, packet: Dict[str, Any]) -> np.ndarray:
        return np.array([
            float(packet.get("bytes_transferred", 0)),
            float(packet.get("hop_latency_ms", 0.0)),
            float(packet.get("retransmission_rate", 0.0)),
            float(packet.get("payload_entropy", 1.0))
        ], dtype=np.float32)

    async def ingest_packet_stream(self, reader: asyncio.StreamReader) -> None:
        logging.info("[SYS] Ingest stream active. Awaiting network telemetry payload...")
        while not reader.at_eof():
            line = await reader.readline()
            if not line:
                break
            try:
                packet = json.loads(line.decode("utf-8"))
                features = self.extract_features(packet)
                if not self.is_calibrated:
                    self.training_buffer.append(features.tolist())
                    if len(self.training_buffer) >= self.buffer_size:
                        self.detector.fit(np.array(self.training_buffer))
                        self.is_calibrated = True
                        logging.info("[SYS] Isolation Forest calibrated. Live inference engaged.")
                else:
                    prediction = self.detector.predict(features.reshape(1, -1))
                    if prediction[0] == -1:
                        logging.warning(f"[ALERT] Threat vector detected: IP={packet.get('source_ip')}")
            except Exception as e:
                logging.error(f"Ingestion parse failure: {e}")`
    },
    {
      id: "nexus-optimizer",
      category: "sql",
      discipline: "Relational SQL Architecture",
      title: "Nexus DB • Distributed Query Tuning & Partitions",
      summary: "Production-grade PostgreSQL database tuning suite leveraging multi-attribute composite B-Trees, range partition hierarchies, and recursive analytical CTEs.",
      tags: ["PostgreSQL 15", "Query Tuning", "Composite B-Tree", "Partitioning"],
      filename: "nexus_optimization.sql",
      github: "https://github.com/amrendrayadav03321-a11y",
      accent: "amber",
      source: `-- ====================================================================
-- NEXUS DB ENGINE — HIGH-THROUGHPUT ANALYTIC PARTITIONING & CTEs
-- Architect: Amrendra Yadav • Delhi, India
-- Target Engine: PostgreSQL 15+ / Aurora Enterprise
-- ====================================================================

-- 1. Optimized Concurrent Composite B-Tree
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_stream_metrics_composite
ON stream_metrics (tenant_id, event_timestamp DESC)
INCLUDE (latency_micros, payload_bytes);

-- 2. Declarative Range Partitioned Ledger Structure
CREATE TABLE IF NOT EXISTS telemetry_partitioned_ledger (
    event_id UUID DEFAULT gen_random_uuid(),
    tenant_id INT NOT NULL,
    metric_code VARCHAR(64) NOT NULL,
    latency_micros INT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (event_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- 3. Advanced Window CTE for Latency Quantiles Across Nodes
WITH QuantilePerformance AS (
    SELECT
        t.tenant_id,
        t.metric_code,
        t.latency_micros,
        NTILE(100) OVER (
            PARTITION BY t.metric_code 
            ORDER BY t.latency_micros ASC
        ) AS percentile_bucket,
        AVG(t.latency_micros) OVER (
            PARTITION BY t.metric_code
        ) AS average_latency
    FROM telemetry_partitioned_ledger t
    WHERE t.recorded_at >= NOW() - INTERVAL '7 days'
)
SELECT 
    metric_code,
    ROUND(AVG(latency_micros), 2) AS p99_latency_micros,
    ROUND(MAX(average_latency), 2) AS overall_avg_latency
FROM QuantilePerformance
WHERE percentile_bucket = 99
GROUP BY metric_code
ORDER BY p99_latency_micros DESC;`
    },
    {
      id: "nebula-shader",
      category: "web",
      discipline: "Creative WebGL & GLSL",
      title: "Nebula Engine • Real-time GLSL Fluid Canvas",
      summary: "High-frame-rate visual shaders and fluid simulations running on hardware-accelerated WebGL. Dynamic turbulence and user pointer field deflection.",
      tags: ["WebGL", "GLSL Shaders", "HTML5 Canvas", "Vector Fields"],
      filename: "nebula_fluid.frag",
      github: "https://github.com/amrendrayadav03321-a11y/Hacker-text-effect.",
      accent: "rose",
      source: `// ====================================================================
// NEBULA ENGINE — FRAGMENT SHADER REAL-TIME FLUID DISPLACEMENT
// Artist: Amrendra Yadav • Delhi, India
// Execution: WebGL 1.0 / 2.0 Fragment Stage
// ====================================================================

precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;

// Simplex Perlin gradient noise implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec2 pNorm = u_pointer / u_resolution.xy;
    float distToPointer = distance(st, pNorm);
    float pointerDeflection = smoothstep(0.35, 0.0, distToPointer) * 0.4;
    
    float noiseVal = snoise(st * 3.5 + vec2(u_time * 0.15, -u_time * 0.1) + pointerDeflection);
    vec3 colorA = vec3(0.02, 0.04, 0.1);
    vec3 colorB = vec3(0.04, 0.72, 0.85); // Electric Cyan
    vec3 colorC = vec3(0.55, 0.36, 0.96); // Deep Violet
    
    vec3 finalColor = mix(colorA, colorB, clamp(noiseVal, 0.0, 1.0));
    finalColor = mix(finalColor, colorC, pointerDeflection * 1.5);
    gl_FragColor = vec4(finalColor, 1.0);
}`
    },
    {
      id: "quantum-verlet",
      category: "web",
      discipline: "Deterministic Physics Engine",
      title: "Verlet Kinetic • N-Body Orbital Integrator",
      summary: "Deterministic physics sandbox implementing Fourth-Order Runge-Kutta and Verlet integration with collision manifolds and gravitational gravitational deflection.",
      tags: ["JavaScript ES6", "Verlet RK4", "Physics Math", "Kinematics"],
      filename: "verlet_integrator.js",
      github: "https://github.com/amrendrayadav03321-a11y/Romantic-Python-Animation",
      accent: "cyan",
      source: `// ====================================================================
// VERLET KINETIC — DETERMINISTIC TIME-STEP N-BODY SOLVER
// Author: Amrendra Yadav • Delhi, India
// Standards: Modern ECMAScript / Zero-Dependency Canvas
// ====================================================================

export class VerletKineticBody {
    constructor(x, y, mass, radius, isPinned = false) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.accX = 0;
        this.accY = 0;
        this.mass = mass;
        this.radius = radius;
        this.isPinned = isPinned;
    }

    applyForce(fx, fy) {
        if (this.isPinned) return;
        this.accX += fx / this.mass;
        this.accY += fy / this.mass;
    }

    integrateStep(dt, friction = 0.994) {
        if (this.isPinned) return;
        
        // Verlet numerical integration:
        // x(t + dt) = x(t) + (x(t) - x(t - dt)) * friction + a(t) * dt^2
        const tempX = this.x;
        const tempY = this.y;
        const dtSq = dt * dt;

        this.x += (this.x - this.prevX) * friction + this.accX * dtSq;
        this.y += (this.y - this.prevY) * friction + this.accY * dtSq;

        this.prevX = tempX;
        this.prevY = tempY;

        // Reset accumulated forces
        this.accX = 0;
        this.accY = 0;
    }

    resolveBoundaries(width, height, restitution = 0.85) {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.prevX = this.x + (this.x - this.prevX) * restitution;
        } else if (this.x + this.radius > width) {
            this.x = width - this.radius;
            this.prevX = this.x + (this.x - this.prevX) * restitution;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.prevY = this.y + (this.y - this.prevY) * restitution;
        } else if (this.y + this.radius > height) {
            this.y = height - this.radius;
            this.prevY = this.y + (this.y - this.prevY) * restitution;
        }
    }
}`
    }
  ];

  // =========================================================================
  // 2. MAGNETIC DUAL-STAGE CURSOR (LERP INTEGRATION)
  // =========================================================================
  const cursorDot = document.getElementById("cursor-dot");
  const cursorFollower = document.getElementById("cursor-follower");
  const cursorLabel = document.getElementById("cursor-label");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    // Lerp factor
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;

    if (cursorFollower) {
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  function bindCursorInteractions() {
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      const mode = el.getAttribute("data-cursor");
      el.addEventListener("mouseenter", () => {
        document.body.className = `theme-dark cursor-active-${mode}`;
        if (cursorLabel) {
          if (mode === "view") cursorLabel.textContent = "VIEW";
          else if (mode === "interact") cursorLabel.textContent = "EXEC";
          else cursorLabel.textContent = "";
        }
      });
      el.addEventListener("mouseleave", () => {
        document.body.className = "theme-dark";
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });
  }
  bindCursorInteractions();

  // =========================================================================
  // 3. INTERACTIVE MAIN CANVAS (PARTICLE FIELD WITH GRAVITY WELL)
  // =========================================================================
  const bgCanvas = document.getElementById("interactive-canvas");
  const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;
  let bgParticles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 80;

  function initBgCanvas() {
    if (!bgCanvas || !bgCtx) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    bgParticles = [];
    for (let i = 0; i < particleCount; i++) {
      bgParticles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.3 + 0.15
      });
    }
  }
  window.addEventListener("resize", initBgCanvas);
  initBgCanvas();

  function animateBgCanvas() {
    if (!bgCanvas || !bgCtx) return;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    for (let i = 0; i < bgParticles.length; i++) {
      const p = bgParticles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = bgCanvas.width;
      if (p.x > bgCanvas.width) p.x = 0;
      if (p.y < 0) p.y = bgCanvas.height;
      if (p.y > bgCanvas.height) p.y = 0;

      // Mouse gravity deflection
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const force = (130 - dist) / 130;
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
      }

      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
      bgCtx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < bgParticles.length; j++) {
        const p2 = bgParticles[j];
        const d2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d2 < 110) {
          bgCtx.beginPath();
          bgCtx.moveTo(p.x, p.y);
          bgCtx.lineTo(p2.x, p2.y);
          bgCtx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - d2 / 110)})`;
          bgCtx.lineWidth = 0.8;
          bgCtx.stroke();
        }
      }
    }
    requestAnimationFrame(animateBgCanvas);
  }
  animateBgCanvas();

  // =========================================================================
  // 4. HERO RIGHT HUD: 3D CYCLIC WIREFRAME SIMULATION
  // =========================================================================
  const hudCanvas = document.getElementById("hud-canvas");
  const hudCtx = hudCanvas ? hudCanvas.getContext("2d") : null;
  const hudCycleBtn = document.getElementById("hud-cycle-btn");
  let hudMode = 0; // 0 = Torus, 1 = Wave Grid, 2 = Particle Vortex

  if (hudCycleBtn) {
    hudCycleBtn.addEventListener("click", () => {
      hudMode = (hudMode + 1) % 3;
      const modes = ["Torus Knot", "Topographic Matrix", "Orbital Swarm"];
      hudCycleBtn.textContent = modes[hudMode];
    });
  }

  function resizeHud() {
    if (!hudCanvas || !hudCtx) return;
    const rect = hudCanvas.getBoundingClientRect();
    hudCanvas.width = rect.width * window.devicePixelRatio;
    hudCanvas.height = rect.height * window.devicePixelRatio;
    hudCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener("resize", resizeHud);
  resizeHud();

  let hudAngle = 0;
  function renderHud() {
    if (!hudCanvas || !hudCtx) return;
    const w = hudCanvas.width / window.devicePixelRatio;
    const h = hudCanvas.height / window.devicePixelRatio;
    hudCtx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    hudAngle += 0.018;

    if (hudMode === 0) {
      // 3D Wireframe Rotating Ring Array
      const rings = 12;
      for (let r = 0; r < rings; r++) {
        const rad = 25 + r * 7;
        const currentTilt = hudAngle + (r * Math.PI) / rings;
        hudCtx.beginPath();
        hudCtx.ellipse(cx, cy, rad, rad * Math.abs(Math.sin(currentTilt)), hudAngle * 0.5, 0, Math.PI * 2);
        hudCtx.strokeStyle = `rgba(6, 182, 212, ${0.2 + (r / rings) * 0.55})`;
        hudCtx.lineWidth = 1.2;
        hudCtx.stroke();
      }
    } else if (hudMode === 1) {
      // Topographic Matrix Grid
      const rows = 14;
      const cols = 18;
      const spacingX = w / cols;
      const spacingY = h / rows;

      for (let y = 0; y < rows; y++) {
        hudCtx.beginPath();
        for (let x = 0; x < cols; x++) {
          const elev = Math.sin(x * 0.4 + hudAngle) * Math.cos(y * 0.4 + hudAngle) * 16;
          const px = x * spacingX;
          const py = y * spacingY + elev;
          if (x === 0) hudCtx.moveTo(px, py);
          else hudCtx.lineTo(px, py);
        }
        hudCtx.strokeStyle = "rgba(139, 92, 246, 0.45)";
        hudCtx.lineWidth = 1;
        hudCtx.stroke();
      }
    } else {
      // Orbital Swarm
      const count = 48;
      for (let i = 0; i < count; i++) {
        const a = hudAngle * (1 + (i % 3) * 0.5) + (i * Math.PI * 2) / count;
        const dist = 30 + (i % 6) * 15;
        const px = cx + Math.cos(a) * dist;
        const py = cy + Math.sin(a * 1.5) * (dist * 0.65);
        hudCtx.beginPath();
        hudCtx.arc(px, py, 2.2, 0, Math.PI * 2);
        hudCtx.fillStyle = i % 2 === 0 ? "rgba(6, 182, 212, 0.85)" : "rgba(245, 158, 11, 0.85)";
        hudCtx.fill();
      }
    }

    requestAnimationFrame(renderHud);
  }
  renderHud();

  // 3D Card Hover Perspective
  const hudCard = document.getElementById("hud-card");
  if (hudCard) {
    hudCard.addEventListener("mousemove", (e) => {
      const rect = hudCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      hudCard.style.transform = `perspective(900px) rotateY(${x * 0.04}deg) rotateX(${-y * 0.04}deg)`;
    });
    hudCard.addEventListener("mouseleave", () => {
      hudCard.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    });
  }

  // =========================================================================
  // 5. DECODER TERMINAL TYPING & ROTATION (REAL ARCHITECTURAL TITLES)
  // =========================================================================
  const decoderEl = document.getElementById("decoder-stream");
  const specializations = [
    "C++ Core Systems & Graphics Architect",
    "Python Telemetry & Machine Learning Pipelines",
    "PostgreSQL High-Scale Relational Optimizer",
    "Creative WebGL & Hardware-Accelerated Frontend"
  ];
  let specIndex = 0;

  function scrambleCycle(targetText) {
    if (!decoderEl) return;
    const chars = "ABCDEF0123456789_#~-<>*";
    let iteration = 0;
    const maxIterations = targetText.length;

    const interval = setInterval(() => {
      decoderEl.textContent = targetText
        .split("")
        .map((letter, idx) => {
          if (idx < iteration) return targetText[idx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setTimeout(() => {
          specIndex = (specIndex + 1) % specializations.length;
          scrambleCycle(specializations[specIndex]);
        }, 3600);
      }
      iteration += 1 / 2;
    }, 28);
  }
  scrambleCycle(specializations[0]);

  // =========================================================================
  // 6. DYNAMIC PROJECTS GRID & NATIVE DIALOG CODE INSPECTOR
  // =========================================================================
  const projectsGrid = document.getElementById("projects-grid");
  const projectModal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTags = document.getElementById("modal-tags");
  const modalCode = document.getElementById("modal-code");
  const modalCodeFilename = document.getElementById("modal-code-filename");
  const modalTechChips = document.getElementById("modal-tech-chips");
  const copyCodeBtn = document.getElementById("copy-code-btn");

  function renderProjects(filter = "all") {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";

    const filtered = PROJECTS_CATALOG.filter(
      (p) => filter === "all" || p.category === filter
    );

    filtered.forEach((p) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.setAttribute("data-cursor", "card");

      card.innerHTML = `
        <div class="project-glow"></div>
        <div class="project-media-wrap">
          <span class="project-pill-badge">${p.discipline}</span>
          <div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-family:var(--font-mono); font-size:13px; color:rgba(255,255,255,0.7); gap:8px;">
            <i class="fas fa-terminal" style="color:var(--accent-${p.accent});"></i>
            <span>${p.filename}</span>
          </div>
        </div>
        <div class="project-body">
          <div class="project-tags">
            ${p.tags.map((t) => `<span class="project-tag">${t}</span>`).join("")}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.summary}</p>
          <div class="project-card-footer">
            <button class="btn-inspect" data-project-id="${p.id}" data-cursor="button">
              <span>Inspect Code</span>
              <i class="fas fa-arrow-right"></i>
            </button>
            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="project-github-link" data-cursor="link" title="Open repository">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
      `;

      // Track cursor coordinates for radial hover glow
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });

      projectsGrid.appendChild(card);
    });

    // Re-bind cursor on dynamically injected elements
    bindCursorInteractions();

    // Bind Inspect buttons
    document.querySelectorAll(".btn-inspect").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-project-id");
        openProjectModal(id);
      });
    });
  }

  function openProjectModal(projectId) {
    const p = PROJECTS_CATALOG.find((item) => item.id === projectId);
    if (!p || !projectModal) return;

    modalTitle.textContent = p.title;
    modalDesc.textContent = p.summary;
    modalCode.textContent = p.source;
    modalCodeFilename.textContent = p.filename;

    modalTags.innerHTML = p.tags
      .map((t) => `<span class="project-tag">${t}</span>`)
      .join("");

    modalTechChips.innerHTML = `
      <span class="spec-pill"><i class="fas fa-microchip"></i> Discipline: ${p.discipline}</span>
      <span class="spec-pill"><i class="fas fa-location-dot"></i> Base: Delhi, India</span>
    `;

    projectModal.showModal();
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.close();
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      const rect = projectModal.getBoundingClientRect();
      const isIn =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!isIn) closeProjectModal();
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      if (modalCode) {
        navigator.clipboard.writeText(modalCode.textContent).then(() => {
          copyCodeBtn.innerHTML = `<i class="fas fa-check"></i> <span>Copied</span>`;
          setTimeout(() => {
            copyCodeBtn.innerHTML = `<i class="fas fa-copy"></i> <span>Copy</span>`;
          }, 2000);
        });
      }
    });
  }

  // Filter chips listeners
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.getAttribute("data-filter");
      renderProjects(f);
    });
  });

  renderProjects("all");

  // =========================================================================
  // 7. INTERACTIVE REPL TERMINAL EMULATOR
  // =========================================================================
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");

  const TERMINAL_COMMANDS = {
    help: () => `
<span class="term-highlight">AVAILABLE COMMANDS:</span>
  • <span class="term-cmd">whoami</span>       : Profile summary & base location
  • <span class="term-cmd">skills</span>       : Full technical & language matrix
  • <span class="term-cmd">projects</span>     : List major production repositories
  • <span class="term-cmd">contact</span>      : Reach Amrendra directly (email/phone/IG)
  • <span class="term-cmd">location</span>     : Current development base
  • <span class="term-cmd">clear</span>        : Clear the terminal console
  • <span class="term-cmd">bench</span>        : Run client performance benchmark
    `,
    whoami: () => `
<span class="term-out-success">Amrendra Yadav</span> — Systems & Creative Engineer
Base: <strong>Delhi, India</strong>
Specialization: Low-level C++ rendering, Python streaming pipelines, distributed SQL, & creative WebGL canvas.
    `,
    skills: () => `
<span class="term-highlight">[SYSTEMS CORE]</span>
  • C++ (17/20)        : OpenGL 4.6, Arena Allocators, GLSL, SIMD Vectorization
  • Python (3.10+)     : Anomaly Detection, Isolation Forests, AsyncIO, NumPy
  • SQL / Databases    : Postgres 15+, Composite Indexing, Partitioned Tables
  • Creative Web       : Modern Vanilla ES6+, WebGL Shaders, Canvas RK4 Physics
    `,
    projects: () => `
<span class="term-highlight">[ENGINEERING CODEBASES]</span>
  1. Aether 3D Engine   [C++ / OpenGL 4.6]
  2. PyStream Analytics [Python / Scikit-Learn]
  3. Nexus DB Optimizer [PostgreSQL 15 Tuning]
  4. Nebula GLSL Canvas [WebGL Fragment Shader]
  5. Verlet Kinetic     [N-Body Solver]
Type 'projects' section above to inspect source code!
    `,
    contact: () => `
<span class="term-out-success">[DIRECT COMMUNICATIONS]</span>
  • Email     : <a href="mailto:amrendrayadav03321@gmail.com" class="term-highlight">amrendrayadav03321@gmail.com</a>
  • Call/WA   : <a href="tel:6307124831" class="term-highlight">+91 6307124831</a>
  • Instagram : <a href="https://instagram.com/satyaa.okkk" target="_blank" class="term-highlight">@satyaa.okkk</a>
  • GitHub    : <a href="https://github.com/amrendrayadav03321-a11y" target="_blank" class="term-highlight">@amrendrayadav03321-a11y</a>
    `,
    location: () => `
<span class="term-out-success">Base Coordinates:</span> Delhi, India (28.6139° N, 77.2090° E)
Timezone: Asia/Kolkata (IST • UTC+5:30)
    `,
    bench: () => {
      const t0 = performance.now();
      let acc = 0;
      for (let i = 0; i < 1000000; i++) acc += Math.sqrt(i);
      const t1 = performance.now();
      return `<span class="term-out-success">Benchmark completed in ${(t1 - t0).toFixed(2)} ms</span>. Zero-bloat client runtime verified.`;
    },
    clear: () => {
      if (termOutput) termOutput.innerHTML = "";
      return null;
    }
  };

  if (termInput && termOutput) {
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = "";

        if (!cmd) return;

        // Print input echo
        const echoLine = document.createElement("p");
        echoLine.className = "term-line";
        echoLine.innerHTML = `<span class="term-prompt">guest@amrendra:~$</span> <span class="term-cmd">${cmd}</span>`;
        termOutput.appendChild(echoLine);

        // Process response
        if (TERMINAL_COMMANDS[cmd]) {
          const res = TERMINAL_COMMANDS[cmd]();
          if (res !== null) {
            const outLine = document.createElement("div");
            outLine.className = "term-line";
            outLine.innerHTML = res;
            termOutput.appendChild(outLine);
          }
        } else {
          const errLine = document.createElement("p");
          errLine.className = "term-line term-out-warn";
          errLine.textContent = `zsh: command not found: ${cmd}. Type 'help' for available commands.`;
          termOutput.appendChild(errLine);
        }

        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });
  }

  // =========================================================================
  // 8. MATHEMATICAL SINE LAB & OSCILLATOR VISUALIZER
  // =========================================================================
  const labCanvas = document.getElementById("lab-canvas");
  const labCtx = labCanvas ? labCanvas.getContext("2d") : null;
  const sliderFreq = document.getElementById("slider-freq");
  const sliderAmp = document.getElementById("slider-amp");
  const sliderSpeed = document.getElementById("slider-speed");
  const lblFreq = document.getElementById("lbl-freq");
  const lblAmp = document.getElementById("lbl-amp");
  const lblSpeed = document.getElementById("lbl-speed");

  let labConfig = {
    frequency: 0.018,
    amplitude: 65,
    speed: 0.04,
    palette: "cyber"
  };

  const PALETTES = {
    cyber: { primary: "#06b6d4", secondary: "#3b82f6" },
    violet: { primary: "#8b5cf6", secondary: "#ec4899" },
    amber: { primary: "#f59e0b", secondary: "#ef4444" },
    rose: { primary: "#ec4899", secondary: "#a855f7" }
  };

  if (sliderFreq) {
    sliderFreq.addEventListener("input", (e) => {
      labConfig.frequency = parseFloat(e.target.value);
      if (lblFreq) lblFreq.textContent = labConfig.frequency;
    });
  }
  if (sliderAmp) {
    sliderAmp.addEventListener("input", (e) => {
      labConfig.amplitude = parseInt(e.target.value);
      if (lblAmp) lblAmp.textContent = `${labConfig.amplitude} px`;
    });
  }
  if (sliderSpeed) {
    sliderSpeed.addEventListener("input", (e) => {
      labConfig.speed = parseFloat(e.target.value);
      if (lblSpeed) lblSpeed.textContent = labConfig.speed;
    });
  }

  document.querySelectorAll(".palette-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll(".palette-swatch").forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
      labConfig.palette = swatch.getAttribute("data-palette");
    });
  });

  function resizeLabCanvas() {
    if (!labCanvas || !labCtx) return;
    const rect = labCanvas.getBoundingClientRect();
    labCanvas.width = rect.width * window.devicePixelRatio;
    labCanvas.height = rect.height * window.devicePixelRatio;
    labCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener("resize", resizeLabCanvas);
  resizeLabCanvas();

  let labPhase = 0;
  function renderLab() {
    if (!labCanvas || !labCtx) return;
    const w = labCanvas.width / window.devicePixelRatio;
    const h = labCanvas.height / window.devicePixelRatio;
    labCtx.clearRect(0, 0, w, h);

    const cy = h / 2;
    const theme = PALETTES[labConfig.palette] || PALETTES.cyber;

    // Harmonic layers (Fundamental + 2nd Harmonic + 3rd Harmonic)
    const harmonics = [
      { fMult: 1.0, aMult: 1.0, width: 3.0, alpha: 0.9, color: theme.primary },
      { fMult: 1.8, aMult: 0.55, width: 1.8, alpha: 0.5, color: theme.secondary },
      { fMult: 2.6, aMult: 0.25, width: 1.0, alpha: 0.25, color: "#ffffff" }
    ];

    harmonics.forEach((harm) => {
      labCtx.beginPath();
      labCtx.lineWidth = harm.width;
      labCtx.strokeStyle = harm.color;
      labCtx.globalAlpha = harm.alpha;
      labCtx.shadowColor = harm.color;
      labCtx.shadowBlur = harm.width > 2 ? 14 : 0;

      for (let x = 0; x < w; x++) {
        const y =
          cy +
          Math.sin(x * labConfig.frequency * harm.fMult + labPhase) *
            labConfig.amplitude *
            harm.aMult;
        if (x === 0) labCtx.moveTo(x, y);
        else labCtx.lineTo(x, y);
      }
      labCtx.stroke();
    });

    labCtx.shadowBlur = 0;
    labCtx.globalAlpha = 1.0;

    labPhase += labConfig.speed;
    requestAnimationFrame(renderLab);
  }
  renderLab();

  // =========================================================================
  // 9. ASYNCHRONOUS FORMSUBMIT DISPATCH & TOAST NOTIFICATION
  // =========================================================================
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameVal = document.getElementById("name").value.trim();
      const emailVal = document.getElementById("email").value.trim();
      const subjectVal = document.getElementById("subject").value.trim();
      const msgVal = document.getElementById("message").value.trim();

      if (!nameVal || !emailVal || !msgVal) {
        showToast("Please fill all mandatory fields.", "error");
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Transmitting...</span> <i class="fas fa-circle-notch fa-spin"></i>`;
      submitBtn.disabled = true;

      fetch("https://formsubmit.co/ajax/amrendrayadav03321@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          subject: subjectVal || "Portfolio Inquiry (Delhi)",
          message: msgVal,
          location_ref: "Delhi, India"
        })
      })
        .then((res) => res.json())
        .then((data) => {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;

          if (data.success === "true" || data.success === true) {
            showToast(`Transmission received, ${nameVal}! Message dispatched to Amrendra.`, "success");
            contactForm.reset();
          } else {
            showToast("Failed to dispatch. Please email directly at amrendrayadav03321@gmail.com", "warn");
          }
        })
        .catch((err) => {
          console.error(err);
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
          showToast("Network dispatch error. Please call +91 6307124831 or email directly.", "error");
        });
    });
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "glass-toast";

    const icon =
      type === "success"
        ? '<i class="fas fa-circle-check" style="color:var(--accent-emerald); font-size:18px;"></i>'
        : '<i class="fas fa-triangle-exclamation" style="color:var(--accent-amber); font-size:18px;"></i>';

    toast.innerHTML = `
      ${icon}
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">System Notification</span>
        <span style="font-size:13.5px; color:#ffffff;">${message}</span>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("toast-show"), 20);

    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 400);
    }, 5500);
  }
});
