document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. Text Scrambler / Typing VFX Effect
  // ==========================================
  class TextScrambler {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#______';
      this.update = this.update.bind(this);
    }
    
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color: var(--accent-primary); opacity: 0.85;">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Active Scrambler phrases
  const phrases = [
    "C++ Graphics Architect",
    "Python Automation Expert",
    "SQL Database Engineer",
    "Creative Web UI Artist"
  ];
  
  const el = document.getElementById('scramble-target');
  if (el) {
    const fx = new TextScrambler(el);
    let counter = 0;
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 3200);
      });
      counter = (counter + 1) % phrases.length;
    };
    next();
  }


  // ==========================================
  // 2. Custom Mouse Cursor Followers
  // ==========================================
  const cursorDot = document.getElementById("cursor-dot");
  const cursorAura = document.getElementById("cursor-aura");
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = window.innerWidth / 2;
  let auraY = window.innerHeight / 2;
  
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    const lerpFactor = 0.14;
    auraX += (mouseX - auraX) * lerpFactor;
    auraY += (mouseY - auraY) * lerpFactor;
    
    cursorAura.style.left = `${auraX}px`;
    cursorAura.style.top = `${auraY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function setupCursorHoverListeners() {
    const hoverElements = document.querySelectorAll("[data-cursor-hover]");
    hoverElements.forEach(elem => {
      elem.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      elem.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    const viewElements = document.querySelectorAll("[data-cursor-view]");
    viewElements.forEach(elem => {
      elem.addEventListener("mouseenter", () => document.body.classList.add("cursor-view-mode"));
      elem.addEventListener("mouseleave", () => document.body.classList.remove("cursor-view-mode"));
    });
  }
  setupCursorHoverListeners();


  // ==========================================
  // 3. Card Hover Glowing Borders Tracker
  // ==========================================
  const projectCardsList = document.querySelectorAll(".project-card");
  projectCardsList.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });


  // ==========================================
  // 4. Interactive Canvas Background (With Click Shockwaves)
  // ==========================================
  const canvasBg = document.getElementById("canvas-bg");
  const ctxBg = canvasBg.getContext("2d");
  
  let particles = [];
  let particleCount = 65;
  let mouse = { x: null, y: null, radius: 140 };
  let shockwaves = [];

  if (window.innerWidth < 768) {
    particleCount = 30;
  }

  function resizeCanvas() {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y) {
      this.x = x || Math.random() * canvasBg.width;
      this.y = y || Math.random() * canvasBg.height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseAlpha = Math.random() * 0.28 + 0.1;
      this.alpha = this.baseAlpha;
      this.friction = 0.98;
    }

    draw() {
      ctxBg.beginPath();
      ctxBg.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctxBg.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
      ctxBg.fill();
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.vx += (Math.random() - 0.5) * 0.02;
      this.vy += (Math.random() - 0.5) * 0.02;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = canvasBg.width;
      if (this.x > canvasBg.width) this.x = 0;
      if (this.y < 0) this.y = canvasBg.height;
      if (this.y > canvasBg.height) this.y = 0;

      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx * force * 0.035;
          this.y -= dy * force * 0.035;
          this.alpha = Math.min(this.baseAlpha * 2.2, 0.75);
        } else {
          if (this.alpha > this.baseAlpha) {
            this.alpha -= 0.015;
          }
        }
      }

      shockwaves.forEach(wave => {
        let dx = this.x - wave.x;
        let dy = this.y - wave.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let tolerance = 25;

        if (Math.abs(dist - wave.currentRadius) < tolerance) {
          let force = (tolerance - Math.abs(dist - wave.currentRadius)) / tolerance;
          let pushAmount = force * wave.intensity * 4;
          this.x += (dx / (dist || 1)) * pushAmount;
          this.y += (dy / (dist || 1)) * pushAmount;
          this.alpha = 0.9;
        }
      });
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    let maxDistance = 115;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          let lineAlpha = (1 - dist / maxDistance) * 0.12;
          ctxBg.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
          ctxBg.lineWidth = 1;
          ctxBg.beginPath();
          ctxBg.moveTo(particles[a].x, particles[a].y);
          ctxBg.lineTo(particles[b].x, particles[b].y);
          ctxBg.stroke();
        }
      }
    }
  }

  class Shockwave {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.maxRadius = 180;
      this.currentRadius = 0;
      this.speed = 4.5;
      this.intensity = 1.0;
      this.active = true;
    }

    update() {
      this.currentRadius += this.speed;
      this.intensity = 1.0 - (this.currentRadius / this.maxRadius);
      if (this.currentRadius >= this.maxRadius) {
        this.active = false;
      }
    }

    draw() {
      ctxBg.beginPath();
      ctxBg.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      ctxBg.strokeStyle = `rgba(6, 182, 212, ${this.intensity * 0.25})`;
      ctxBg.lineWidth = 2;
      ctxBg.stroke();
    }
  }

  window.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A" && !e.target.closest("button") && !e.target.closest("a")) {
      shockwaves.push(new Shockwave(e.clientX, e.clientY));
      for (let i = 0; i < 6; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
        if (particles.length > particleCount + 20) {
          particles.shift();
        }
      }
    }
  });

  function animateParticles() {
    ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
    shockwaves = shockwaves.filter(w => w.active);
    shockwaves.forEach(wave => {
      wave.update();
      wave.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();


  // ==========================================
  // 5. Scroll Trigger - Skills
  // ==========================================
  const skillsSection = document.getElementById("about");
  const progressBars = document.querySelectorAll(".skill-progress");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const val = bar.getAttribute("data-skill-val");
          bar.style.width = val;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }


  // ==========================================
  // 6. Project Filter Tabs
  // ==========================================
  const filterTabs = document.querySelectorAll(".filter-tab");
  const projectCards = document.querySelectorAll(".project-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filterVal = tab.getAttribute("data-filter");

      projectCards.forEach(card => {
        const cardCat = card.getAttribute("data-category");
        if (filterVal === "all" || cardCat === filterVal) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px) scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // 7. Modal Project Details & Real Source Codes
  // ==========================================
  const projectModal = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  const projectDetailsBtn = document.querySelectorAll(".project-link, .project-card");
  
  const projectsDetailsDB = {
    "1": {
      title: "Aether 3D Engine",
      tags: ["C++", "OpenGL 4.6", "GLSL Shaders", "Engine Physics"],
      desc: "Aether 3D Engine is a hardware-accelerated rendering engine developed natively in C++. It incorporates real-time shadow mapping, deferred lighting passes, dynamic camera collision grids, and skeletal mesh calculations. Engine memory footprint is optimized via custom block allocators, ensuring efficient thread dispatch and zero CPU-side allocations inside the rendering loop.",
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #3b0764 100%)",
      vectorContent: `<i class="fas fa-cubes" style="font-size: 80px; color: var(--accent-primary); filter: drop-shadow(0 0 20px var(--accent-primary));"></i>`,
      sourceCode: `// ========================================================
// AETHER 3D GRAPHICS ENGINE - OPENGL CORE RENDER LOOP
// Language: C++17 (Systems Engine Code)
// ========================================================

#include <iostream>
#include <vector>
#include <memory>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

class Shader {
public:
    unsigned int ID;
    Shader(const char* vertexPath, const char* fragmentPath);
    void Use() { glUseProgram(ID); }
    void SetMat4(const std::string &name, const glm::mat4 &mat) const {
        glUniformMatrix4fv(glGetUniformLocation(ID, name.c_str()), 1, GL_FALSE, &mat[0][0]);
    }
};

class MeshRenderer {
private:
    unsigned int VAO, VBO, EBO;
    std::vector<float> vertices;
    std::vector<unsigned int> indices;
public:
    MeshRenderer(std::vector<float> verts, std::vector<unsigned int> inds) 
        : vertices(verts), indices(inds) {
        setupBuffers();
    }
    void setupBuffers() {
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glGenBuffers(1, &EBO);
        
        glBindVertexArray(VAO);
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(float), &vertices[0], GL_STATIC_DRAW);
        
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), &indices[0], GL_STATIC_DRAW);
        
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)0);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*)(3 * sizeof(float)));
        glEnableVertexAttribArray(1);
    }
    void Render() {
        glBindVertexArray(VAO);
        glDrawElements(GL_TRIANGLES, indices.size(), GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
    }
};`
    },
    "2": {
      title: "PyStream Analytics Pipeline",
      tags: ["Python", "Pandas", "Scikit-Learn", "Data Streaming"],
      desc: "PyStream Analytics implements a robust Python data automation network. It parses, cleans, and extracts key features from network logs and big-data flow packets in real time. Model algorithms run regression and clustering calculations using Scikit-Learn to detect network security anomalies, dispatching visual feedback diagnostics to dynamic dashboards.",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      vectorContent: `<i class="fab fa-python" style="font-size: 80px; color: #3b82f6; filter: drop-shadow(0 0 20px #3b82f6);"></i>`,
      sourceCode: `# ========================================================
# PYSTREAM SECURITY ANOMALY PIPELINE
# Language: Python 3.10 (Data Engine Code)
# ========================================================

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import socket
import json
import threading

class NetworkLogAnalyzer:
    def __init__(self, port=9000):
        self.port = port
        # Load IsolationForest classifier for anomaly tracking
        self.model = IsolationForest(contamination=0.02, random_state=42)
        self.training_buffer = []
        self.is_trained = False
        
    def clean_packet(self, raw_data):
        """Cleans incoming logs, mapping to numerical structures"""
        payload = json.loads(raw_data)
        df_row = pd.DataFrame([{
            'bytes_sent': payload.get('bytes_sent', 0),
            'packet_count': payload.get('packet_count', 0),
            'duration_ms': payload.get('duration_ms', 0),
            'error_flags': float(payload.get('error_flags', False))
        }])
        return df_row

    def stream_listener(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.bind(("0.0.0.0", self.port))
        print(f"[*] Python Pipeline Active on UDP Port {self.port}")
        
        while True:
            data, addr = s.recvfrom(4096)
            cleaned = self.clean_packet(data)
            
            if not self.is_trained:
                self.training_buffer.append(cleaned.values[0])
                if len(self.training_buffer) >= 1000:
                    self.model.fit(np.array(self.training_buffer))
                    self.is_trained = True
            else:
                score = self.model.predict(cleaned.values)
                if score[0] == -1:
                    print(f"[!] Warning: Anomaly detected from host {addr}")`
    },
    "3": {
      title: "Nexus DB Optimizer",
      tags: ["SQL", "PostgreSQL", "Database Tuning", "Analytics Query"],
      desc: "Nexus DB Optimizer provides database execution index queries and tuning. It constructs custom GIN/B-Tree query index pathways, materialized transaction views, and horizontal partition structures built to process huge data sets while shrinking latency speeds under heavy load.",
      gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
      vectorContent: `<i class="fas fa-database" style="font-size: 80px; color: var(--accent-tertiary); filter: drop-shadow(0 0 20px var(--accent-tertiary));"></i>`,
      sourceCode: `-- ========================================================
-- NEXUS DB OPTIMIZER - PERFORMANCE QUERY INDEXING SCRIPT
-- Dialect: PostgreSQL (Database Tuning Code)
-- ========================================================

-- 1. Create B-Tree indexes on search keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_user_date 
ON transactions(user_id, transaction_date DESC);

-- 2. Partitioning huge transaction logs by range
CREATE TABLE transaction_logs (
    log_id UUID DEFAULT gen_random_uuid(),
    user_id INT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 3. Advanced Analytical CTE querying top transactions per region
WITH RegionalSales AS (
    SELECT 
        u.region,
        t.category,
        SUM(t.amount) AS total_revenue,
        ROW_NUMBER() OVER(PARTITION BY u.region ORDER BY SUM(t.amount) DESC) as rank
    FROM transactions t
    INNER JOIN users u ON t.user_id = u.id
    WHERE t.transaction_date >= NOW() - INTERVAL '30 days'
    GROUP BY u.region, t.category
)
SELECT 
    region,
    category,
    total_revenue
FROM RegionalSales
WHERE rank <= 3
ORDER BY region, total_revenue DESC;

-- Verify query execution cost parameters
EXPLAIN ANALYZE SELECT region, category, total_revenue FROM RegionalSales;`
    },
    "4": {
      title: "Nebula VFX Framework",
      tags: ["HTML5", "WebGL", "GLSL Shaders", "Canvas Particle VFX"],
      desc: "Nebula is a specialized web VFX engine designed to render interactive visual fluids and particle cascades at 60FPS. Leveraging WebGL vertex and fragment shaders, users can interact with custom noise grids, generating dynamic fluid turbulence maps, stellar flares, and gravity vortex ripples that follow coordinates in real-time.",
      gradient: "linear-gradient(135deg, #134e5e 0%, #2f80ed 100%)",
      vectorContent: `<i class="fas fa-code" style="font-size: 80px; color: var(--accent-secondary); filter: drop-shadow(0 0 20px var(--accent-secondary));"></i>`,
      sourceCode: `<!-- ========================================================
     NEBULA VFX ENGINE - WEBGL SHADER INITIALIZATION
     Language: HTML5 / GLSL Shaders (Creative Web Art)
     ======================================================== -->

<canvas id="webgl-canvas"></canvas>

<script type="text/javascript">
  const canvas = document.getElementById("webgl-canvas");
  const gl = canvas.getContext("webgl");
  
  // Fragment Shader calculating dynamic glow noise map
  const fsSource = \`
    precision mediump float;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float d = distance(gl_FragCoord.xy, u_mouse.xy);
        
        // Dynamic ripple factor
        float wave = sin(d * 0.05 - u_time * 5.0) * 0.5 + 0.5;
        vec3 color = vec3(st.x * wave, 0.2, 0.9 * (1.0 - d / u_resolution.x));
        gl_FragColor = vec4(color, 1.0);
    }
  \`;

  const vsSource = \`
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
  \`;

  function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("Shader Compile Error: " + gl.getShaderInfoLog(shader));
      }
      return shader;
  }
</script>`
    },
    "5": {
      title: "Quantum Physics Sandbox",
      tags: ["HTML5 Canvas", "Physics Vector Math", "JavaScript Logic"],
      desc: "Quantum is a gravitational simulator and mechanical sandbox. It computes multi-body physics equations on the client-side to map gravity vectors, orbits, and collision recoil grids. Interactive widgets allow developers to change collision friction coefficients, gravity strength, and coordinate masses to study system dynamics live.",
      gradient: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)",
      vectorContent: `<i class="fas fa-atom" style="font-size: 80px; color: #f43f5e; filter: drop-shadow(0 0 20px #f43f5e); animation: spinAtom 4s linear infinite;"></i>`,
      sourceCode: `// ========================================================
// QUANTUM PHYSICS ENGINE - VERLET INTERPRETATION
// Language: JavaScript / ES6 (Mathematical Logic)
// ========================================================

class PhysicsBody {
    constructor(x, y, mass, radius) {
        this.x = x;
        this.y = y;
        this.px = x; // previous X for Verlet integration
        this.py = y; // previous Y for Verlet integration
        this.mass = mass;
        this.radius = radius;
        this.ax = 0;
        this.ay = 0;
    }
    
    applyForce(fx, fy) {
        // Acceleration = Force / Mass
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }
    
    Update(dt, friction = 0.99) {
        const tempX = this.x;
        const tempY = this.y;
        
        // Verlet Integration equation:
        // pos = pos + (pos - prevPos) + acc * dt * dt
        this.x = this.x + (this.x - this.px) * friction + this.ax * dt * dt;
        this.y = this.y + (this.y - this.py) * friction + this.ay * dt * dt;
        
        this.px = tempX;
        this.py = tempY;
        
        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }
}`
    }
  };

  function openProjectModal(id) {
    const data = projectsDetailsDB[id];
    if (!data) return;

    document.getElementById("modal-project-title").innerText = data.title;
    document.getElementById("modal-project-description").innerText = data.desc;
    
    const bgContainer = document.getElementById("modal-project-bg");
    bgContainer.style.background = data.gradient;
    
    document.getElementById("modal-media-vector").innerHTML = data.vectorContent;

    const codeContainer = document.getElementById("modal-project-code");
    codeContainer.textContent = data.sourceCode;
    
    const detailsWrapper = document.getElementById("modal-code-details-wrapper");
    if (detailsWrapper) {
      detailsWrapper.removeAttribute("open");
    }

    const tagsWrapper = document.getElementById("modal-project-tags");
    tagsWrapper.innerHTML = "";
    data.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "project-tag";
      span.innerText = tag;
      tagsWrapper.appendChild(span);
    });

    projectModal.showModal();
    document.body.style.overflow = "hidden";
  }

  function closeProjectModal() {
    projectModal.close();
    document.body.style.overflow = "";
  }

  projectDetailsBtn.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      const card = trigger.closest(".project-card");
      if (card) {
        const link = card.querySelector(".project-link");
        const id = link.getAttribute("data-project-id");
        e.preventDefault();
        openProjectModal(id);
      }
    });
  });

  modalClose.addEventListener("click", closeProjectModal);
  
  projectModal.addEventListener("click", (e) => {
    const rect = projectModal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeProjectModal();
    }
  });


  // ==========================================
  // 8. Sine Wave Generator Playground
  // ==========================================
  const sineCanvas = document.getElementById("sine-wave-canvas");
  const ctxSine = sineCanvas.getContext("2d");

  let waveConfig = {
    frequency: 0.015,
    amplitude: 60,
    velocity: 0.05,
    colorTheme: "cyan"
  };

  const themeColors = {
    cyan: { main: "#06b6d4", shadow: "rgba(6, 182, 212, 0.4)" },
    purple: { main: "#8b5cf6", shadow: "rgba(139, 92, 246, 0.4)" },
    gold: { main: "#f59e0b", shadow: "rgba(245, 158, 11, 0.4)" },
    rose: { main: "#ec4899", shadow: "rgba(236, 72, 153, 0.4)" }
  };

  let sinePhase = 0;

  function resizeSineCanvas() {
    if (!sineCanvas || !sineCanvas.parentElement) return;
    const rect = sineCanvas.parentElement.getBoundingClientRect();
    sineCanvas.width = rect.width;
    sineCanvas.height = rect.height;
  }
  
  window.addEventListener("resize", () => {
    resizeSineCanvas();
  });

  const freqControl = document.getElementById("control-freq");
  const ampControl = document.getElementById("control-amp");
  const speedControl = document.getElementById("control-speed");
  const colorOptions = document.querySelectorAll(".color-option");

  if (freqControl) {
    freqControl.addEventListener("input", (e) => {
      waveConfig.frequency = parseFloat(e.target.value);
      document.getElementById("label-freq").innerText = e.target.value;
    });
  }

  if (ampControl) {
    ampControl.addEventListener("input", (e) => {
      waveConfig.amplitude = parseInt(e.target.value);
      document.getElementById("label-amp").innerText = `${e.target.value}px`;
    });
  }

  if (speedControl) {
    speedControl.addEventListener("input", (e) => {
      waveConfig.velocity = parseFloat(e.target.value);
      document.getElementById("label-speed").innerText = e.target.value;
    });
  }

  colorOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      colorOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      waveConfig.colorTheme = opt.getAttribute("data-color");
    });
  });

  function drawSineWave() {
    if (!sineCanvas) return;
    
    ctxSine.clearRect(0, 0, sineCanvas.width, sineCanvas.height);
    
    const centerY = sineCanvas.height / 2;
    const theme = themeColors[waveConfig.colorTheme] || themeColors.cyan;
    
    const layers = [
      { ampMultiplier: 1.0, freqMultiplier: 1.0, opacity: 0.8, lineWidth: 3, phaseOffset: 0 },
      { ampMultiplier: 0.6, freqMultiplier: 1.5, opacity: 0.35, lineWidth: 2, phaseOffset: Math.PI / 3 },
      { ampMultiplier: 0.3, freqMultiplier: 2.0, opacity: 0.15, lineWidth: 1, phaseOffset: Math.PI / 1.5 }
    ];

    layers.forEach(layer => {
      ctxSine.beginPath();
      ctxSine.lineWidth = layer.lineWidth;
      ctxSine.strokeStyle = theme.main;
      ctxSine.shadowColor = theme.main;
      ctxSine.shadowBlur = layer.lineWidth > 1 ? 15 : 0;
      ctxSine.globalAlpha = layer.opacity;

      for (let x = 0; x < sineCanvas.width; x++) {
        const y = centerY + Math.sin(x * waveConfig.frequency * layer.freqMultiplier + sinePhase + layer.phaseOffset) * waveConfig.amplitude * layer.ampMultiplier;
        
        if (x === 0) {
          ctxSine.moveTo(x, y);
        } else {
          ctxSine.lineTo(x, y);
        }
      }
      ctxSine.stroke();
    });

    ctxSine.shadowBlur = 0;
    ctxSine.globalAlpha = 1.0;

    sinePhase += waveConfig.velocity;
    requestAnimationFrame(drawSineWave);
  }

  if (sineCanvas) {
    resizeSineCanvas();
    drawSineWave();
  }


  // ==========================================
  // 9. Contact Form Handling (Asynchronous email transmission)
  // ==========================================
  const contactForm = document.getElementById("portfolio-contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById("name").value.trim();
      const emailVal = document.getElementById("email").value.trim();
      const msgVal = document.getElementById("message").value.trim();

      if (!nameVal || !emailVal || !msgVal) {
        alert("Please fill in all form inputs correctly.");
        return;
      }

      // Submit form asynchronously to FormSubmit ajax endpoint
      const submitUrl = "https://formsubmit.co/ajax/amrendrayadav03321@gmail.com";
      const submitBtn = contactForm.querySelector(".form-submit-btn");
      
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `Sending... <i class="fas fa-spinner fa-spin"></i>`;
      submitBtn.disabled = true;

      fetch(submitUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: msgVal,
          _subject: "New message from Amrendra Yadav Portfolio!"
        })
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        if (data.success === "true" || data.success === true) {
          showToastNotification(`Thanks ${nameVal}! Your message has been sent successfully. Please check your email inbox to activate FormSubmit!`);
          contactForm.reset();
        } else {
          showToastNotification("Something went wrong. Please check your inputs and try again.");
        }
      })
      .catch(err => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        console.error("Form submit error:", err);
        showToastNotification("Connection error. Please check your internet connection.");
      });
    });
  }

  function showToastNotification(message) {
    const toast = document.createElement("div");
    toast.className = "glass-card";
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.padding = "20px 30px";
    toast.style.zIndex = "99999";
    toast.style.maxWidth = "400px";
    toast.style.border = "1px solid var(--accent-secondary)";
    toast.style.boxShadow = "0 10px 30px rgba(6, 182, 212, 0.35)";
    toast.style.background = "rgba(10, 8, 17, 0.92)";
    toast.style.borderRadius = "15px";
    toast.style.backdropFilter = "blur(12px)";
    toast.style.display = "flex";
    toast.style.flexDirection = "column";
    toast.style.gap = "10px";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.4s var(--spring-easing)";

    toast.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:var(--accent-secondary);"><i class="fas fa-check-circle"></i> Success</span>
        <button id="toast-close" style="background:none; border:none; color:#fff; cursor:pointer;"><i class="fas fa-times"></i></button>
      </div>
      <p style="font-size:14px; line-height:1.6; color:var(--text-main);">${message}</p>
    `;

    document.body.appendChild(toast);

    const closeBtn = toast.querySelector("#toast-close");
    closeBtn.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    closeBtn.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    closeBtn.addEventListener("click", () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 400);
    });

    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 50);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 400);
      }
    }, 6000);
  }

});
