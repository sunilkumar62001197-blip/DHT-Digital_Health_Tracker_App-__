// Advanced 3D Visualization with Three.js
// 3D Brain, Neurons, Human Body, DNA Helix

class Advanced3DVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.brain = null;
    this.neurons = [];
    this.synapses = [];
    this.animationId = null;
  }

  /**
   * Initialize 3D scene
   */
  init() {
    if (!this.container) {
      console.error('[3DVisualizer] Container not found');
      return false;
    }

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Create camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 15;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Add lights
    this.addLights();
    
    // Handle resize
    window.addEventListener('resize', () => this.onResize());
    
    console.log('[3DVisualizer] Initialized');
    return true;
  }

  /**
   * Add lighting to scene
   */
  addLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040, 2);
    this.scene.add(ambient);
    
    // Directional light
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    this.scene.add(directional);
    
    // Point lights for glowing effect
    const colors = [0x14b8a6, 0x3b82f6, 0x8b5cf6, 0xef4444];
    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(colors[i], 1, 50);
      light.position.set(
        Math.cos(i * Math.PI / 2) * 10,
        Math.sin(i * Math.PI / 2) * 10,
        5
      );
      this.scene.add(light);
    }
  }

  /**
   * Create 3D brain model
   */
  createBrain() {
    // Brain sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.6,
      shininess: 100,
      wireframe: false
    });
    
    this.brain = new THREE.Mesh(geometry, material);
    this.scene.add(this.brain);
    
    // Add brain texture/bumps
    const bumpGeometry = new THREE.SphereGeometry(5.1, 32, 32);
    const bumpMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4d88,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const bumpMesh = new THREE.Mesh(bumpGeometry, bumpMaterial);
    this.brain.add(bumpMesh);
    
    // Create neurons
    this.createNeurons(50);
    
    // Create synapses
    this.createSynapses();
  }

  /**
   * Create neuron network
   */
  createNeurons(count) {
    this.neurons = [];
    
    for (let i = 0; i < count; i++) {
      // Random position on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5.5;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Create neuron
      const geometry = new THREE.SphereGeometry(0.15, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      
      const neuron = new THREE.Mesh(geometry, material);
      neuron.position.set(x, y, z);
      
      // Add glow
      const glowGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      neuron.add(glow);
      
      this.neurons.push({
        mesh: neuron,
        active: false,
        connections: []
      });
      
      this.scene.add(neuron);
    }
  }

  /**
   * Create synaptic connections
   */
  createSynapses() {
    this.synapses = [];
    
    // Connect nearby neurons
    for (let i = 0; i < this.neurons.length; i++) {
      for (let j = i + 1; j < this.neurons.length; j++) {
        const n1 = this.neurons[i].mesh.position;
        const n2 = this.neurons[j].mesh.position;
        const distance = n1.distanceTo(n2);
        
        if (distance < 4 && Math.random() > 0.7) {
          const points = [n1, n2];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.2
          });
          
          const line = new THREE.Line(geometry, material);
          this.synapses.push({
            line: line,
            from: i,
            to: j,
            active: false
          });
          
          this.scene.add(line);
          
          // Store connections
          this.neurons[i].connections.push(j);
          this.neurons[j].connections.push(i);
        }
      }
    }
  }

  /**
   * Trigger neuron firing animation
   */
  fireNeuron(index) {
    if (index >= this.neurons.length) return;
    
    const neuron = this.neurons[index];
    neuron.active = true;
    neuron.mesh.material.emissive = new THREE.Color(0x8b5cf6);
    neuron.mesh.material.emissiveIntensity = 2;
    
    // Activate connected neurons
    setTimeout(() => {
      neuron.connections.forEach(connIdx => {
        if (Math.random() > 0.5) {
          this.fireNeuron(connIdx);
        }
      });
      
      // Deactivate after delay
      setTimeout(() => {
        neuron.active = false;
        neuron.mesh.material.emissive = new THREE.Color(0x000000);
      }, 500);
    }, 100);
  }

  /**
   * Create DNA helix
   */
  createDNAHelix() {
    const helixGroup = new THREE.Group();
    const turns = 10;
    const radius = 2;
    const height = 15;
    
    for (let i = 0; i < turns * 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const y = (i / 20 / turns) * height - height / 2;
      
      // First strand
      const geo1 = new THREE.SphereGeometry(0.2, 8, 8);
      const mat1 = new THREE.MeshPhongMaterial({ color: 0x14b8a6 });
      const sphere1 = new THREE.Mesh(geo1, mat1);
      sphere1.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );
      helixGroup.add(sphere1);
      
      // Second strand (opposite)
      const sphere2 = sphere1.clone();
      sphere2.position.set(
        -Math.cos(angle) * radius,
        y,
        -Math.sin(angle) * radius
      );
      helixGroup.add(sphere2);
      
      // Connecting rung every few bases
      if (i % 5 === 0) {
        const points = [sphere1.position, sphere2.position];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6 });
        const line = new THREE.Line(lineGeo, lineMat);
        helixGroup.add(line);
      }
    }
    
    helixGroup.position.x = 10;
    this.scene.add(helixGroup);
    return helixGroup;
  }

  /**
   * Create particle system for blood cells
   */
  createBloodCells(count = 200) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      // Red blood cells
      colors.push(0.9, 0.2, 0.2);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    return particles;
  }

  /**
   * Animation loop
   */
  animate() {
    // Rotate brain
    if (this.brain) {
      this.brain.rotation.y += 0.005;
      this.brain.rotation.x += 0.002;
    }
    
    // Random neuron firing
    if (Math.random() > 0.98 && this.neurons.length > 0) {
      const randomIdx = Math.floor(Math.random() * this.neurons.length);
      this.fireNeuron(randomIdx);
    }
    
    // Update synapse opacity based on activity
    this.synapses.forEach(synapse => {
      const fromActive = this.neurons[synapse.from].active;
      const toActive = this.neurons[synapse.to].active;
      
      if (fromActive || toActive) {
        synapse.line.material.opacity = Math.min(0.8, synapse.line.material.opacity + 0.1);
      } else {
        synapse.line.material.opacity = Math.max(0.2, synapse.line.material.opacity - 0.05);
      }
    });
    
    // Render
    this.renderer.render(this.scene, this.camera);
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start animation
   */
  start() {
    if (this.animationId) return;
    this.animate();
  }

  /**
   * Stop animation
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Handle window resize
   */
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Cleanup
   */
  dispose() {
    this.stop();
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

// Export
window.Advanced3DVisualizer = Advanced3DVisualizer;
