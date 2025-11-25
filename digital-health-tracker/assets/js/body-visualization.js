// Advanced Health Visualizations - Body Animation System
// Shows internal body workings with animations

class BodyVisualization {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.heartRate = 75;
    this.neurons = [];
  }

  /**
   * Initialize the body visualization canvas
   */
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('[BodyViz] Canvas not found');
      return false;
    }

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.initParticles();
    this.initNeurons();
    this.startAnimation();
    
    return true;
  }

  /**
   * Resize canvas to container
   */
  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * Initialize health particles (blood cells, oxygen, etc.)
   */
  initParticles() {
    this.particles = [];
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: this.getParticleColor(),
        type: Math.random() > 0.5 ? 'blood' : 'oxygen'
      });
    }
  }

  /**
   * Get particle color based on type
   */
  getParticleColor() {
    const colors = [
      'rgba(239, 68, 68, 0.8)',   // Red - blood
      'rgba(52, 211, 153, 0.8)',  // Green - oxygen
      'rgba(96, 165, 250, 0.8)',  // Blue - water
      'rgba(251, 146, 60, 0.8)'   // Orange - energy
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Initialize neuron network
   */
  initNeurons() {
    this.neurons = [];
    const count = 20;
    
    for (let i = 0; i < count; i++) {
      this.neurons.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        connections: [],
        active: false,
        activationTime: 0
      });
    }

    // Create connections between nearby neurons
    for (let i = 0; i < this.neurons.length; i++) {
      for (let j = i + 1; j < this.neurons.length; j++) {
        const dx = this.neurons[i].x - this.neurons[j].x;
        const dy = this.neurons[i].y - this.neurons[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.neurons[i].connections.push(j);
        }
      }
    }
  }

  /**
   * Draw animated beating heart
   */
  drawHeartbeat(x, y, size, beat) {
    const ctx = this.ctx;
    const scale = 1 + Math.sin(beat) * 0.1;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // Heart shape
    ctx.beginPath();
    ctx.fillStyle = `rgba(239, 68, 68, ${0.8 + Math.sin(beat) * 0.2})`;
    
    // Draw heart using bezier curves
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size/2, -size/2, -size, 0, 0, size);
    ctx.bezierCurveTo(size, 0, size/2, -size/2, 0, 0);
    ctx.fill();
    
    // Heart glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.fill();
    
    ctx.restore();
    
    // Heart rate text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.heartRate} BPM`, x, y + size + 30);
  }

  /**
   * Draw brain neuron activity
   */
  drawNeurons() {
    const ctx = this.ctx;
    const time = Date.now();
    
    // Randomly activate neurons
    if (Math.random() > 0.95) {
      const neuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
      neuron.active = true;
      neuron.activationTime = time;
    }
    
    // Draw connections
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 1;
    
    for (const neuron of this.neurons) {
      for (const connIdx of neuron.connections) {
        const conn = this.neurons[connIdx];
        
        ctx.beginPath();
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(conn.x, conn.y);
        ctx.stroke();
      }
    }
    
    // Draw neurons
    for (const neuron of this.neurons) {
      const age = time - neuron.activationTime;
      const active = neuron.active && age < 500;
      
      if (active) {
        const alpha = 1 - (age / 500);
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
      } else {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.shadowBlur = 0;
      }
      
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, active ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
      
      if (age > 500) {
        neuron.active = false;
      }
    }
  }

  /**
   * Draw health particles flowing through body
   */
  drawParticles() {
    const ctx = this.ctx;
    
    for (const particle of this.particles) {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Draw particle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Particle trail
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
      ctx.stroke();
    }
  }

  /**
   * Draw body outline with organs
   */
  drawBodyOutline() {
    const ctx = this.ctx;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Body silhouette
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Head
    ctx.beginPath();
    ctx.arc(centerX, centerY - 150, 40, 0, Math.PI * 2);
    ctx.stroke();
    
    // Torso
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 60, 120, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }

  /**
   * Draw vital signs overlay
   */
  drawVitalSigns(x, y, stats) {
    const ctx = this.ctx;
    const time = Date.now() * 0.001;
    
    // Heart rate wave
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < 100; i++) {
      const px = x + i * 2;
      const py = y + Math.sin(i * 0.2 + time * 5) * 10 + 
                 (i % 20 === 0 ? -20 : 0); // ECG spike
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
    
    // Blood pressure wave
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < 100; i++) {
      const px = x + i * 2;
      const py = y + 40 + Math.sin(i * 0.3 + time * 3) * 8;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  /**
   * Main animation loop
   */
  animate() {
    const ctx = this.ctx;
    const time = Date.now() * 0.001;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, 'rgba(20, 184, 166, 0.05)');
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw components
    this.drawParticles();
    this.drawBodyOutline();
    this.drawNeurons();
    
    // Draw beating heart
    const heartX = this.canvas.width / 2;
    const heartY = this.canvas.height / 2 - 20;
    this.drawHeartbeat(heartX, heartY, 30, time * 2);
    
    // Draw vital signs
    this.drawVitalSigns(50, this.canvas.height - 100, {});
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animate();
  }

  /**
   * Stop animation
   */
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Update heart rate
   */
  updateHeartRate(bpm) {
    this.heartRate = bpm;
  }

  /**
   * Trigger neuron activity
   */
  triggerNeuronActivity() {
    const count = Math.floor(Math.random() * 5) + 3;
    const time = Date.now();
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const neuron = this.neurons[Math.floor(Math.random() * this.neurons.length)];
        neuron.active = true;
        neuron.activationTime = Date.now();
      }, i * 100);
    }
  }
}

// Export for use in other modules
window.BodyVisualization = BodyVisualization;
