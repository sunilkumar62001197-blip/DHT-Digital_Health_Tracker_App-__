// dashboard.js - Dashboard chart rendering and health score calculation
// Manages Chart.js visualizations and health metrics

/**
 * Dashboard Manager
 * Handles dashboard UI, charts, and health score calculation
 */
const DashboardManager = {
  charts: {},
  
  /**
   * Calculate health score (0-100) based on various metrics
   */
  calculateHealthScore(entries, goals) {
    if (!entries || entries.length === 0) return 0;
    
    // Use most recent entry
    const latest = entries[0];
    let score = 0;
    let components = 0;
    
    // Steps score (0-25 points)
    if (latest.steps !== undefined && goals.steps) {
      const stepsScore = Math.min((latest.steps / goals.steps) * 25, 25);
      score += stepsScore;
      components++;
    }
    
    // Sleep score (0-25 points)
    if (latest.sleep !== undefined && goals.sleep) {
      const sleepScore = Math.min((latest.sleep / goals.sleep) * 25, 25);
      score += sleepScore;
      components++;
    }
    
    // Water score (0-20 points)
    if (latest.water !== undefined && goals.water) {
      const waterScore = Math.min((latest.water / goals.water) * 20, 20);
      score += waterScore;
      components++;
    }
    
    // Heart rate score (0-15 points)
    if (latest.heartRate !== undefined && goals.heartRate) {
      const { min, max } = goals.heartRate;
      if (latest.heartRate >= min && latest.heartRate <= max) {
        score += 15;
      } else {
        const deviation = Math.abs(latest.heartRate - (min + max) / 2);
        score += Math.max(15 - deviation / 5, 0);
      }
      components++;
    }
    
    // Calories score (0-15 points)
    if (latest.calories !== undefined && goals.calories) {
      const calorieScore = Math.min((latest.calories / goals.calories) * 15, 15);
      score += calorieScore;
      components++;
    }
    
    return Math.round(score);
  },
  
  /**
   * Calculate statistics from entries
   */
  calculateStats(entries) {
    if (!entries || entries.length === 0) {
      return {
        avgSteps: 0,
        avgHeartRate: 0,
        avgSleep: 0,
        avgWater: 0,
        avgCalories: 0,
        totalEntries: 0
      };
    }
    
    const stats = {
      avgSteps: entries.reduce((sum, e) => sum + (e.steps || 0), 0) / entries.length,
      avgHeartRate: entries.reduce((sum, e) => sum + (e.heartRate || 0), 0) / entries.length,
      avgSleep: entries.reduce((sum, e) => sum + (e.sleep || 0), 0) / entries.length,
      avgWater: entries.reduce((sum, e) => sum + (e.water || 0), 0) / entries.length,
      avgCalories: entries.reduce((sum, e) => sum + (e.calories || 0), 0) / entries.length,
      totalEntries: entries.length
    };
    
    return stats;
  },
  
  /**
   * Detect health flags based on entries
   */
  detectHealthFlags(entries, goals) {
    const flags = [];
    
    if (!entries || entries.length === 0) return flags;
    
    const latest = entries[0];
    
    // Check for concerning patterns
    if (latest.sleep < 6) {
      flags.push({ type: 'danger', message: 'Insufficient sleep detected (<6 hours)', metric: 'sleep' });
    }
    
    if (latest.heartRate > 100) {
      flags.push({ type: 'warning', message: 'Elevated resting heart rate (>100 bpm)', metric: 'heartRate' });
    }
    
    if (latest.water < 3) {
      flags.push({ type: 'warning', message: 'Low water intake (<3 glasses)', metric: 'water' });
    }
    
    if (latest.steps < 2000) {
      flags.push({ type: 'warning', message: 'Very low activity level (<2000 steps)', metric: 'steps' });
    }
    
    // Check for patterns across multiple days
    if (entries.length >= 3) {
      const recentSleep = entries.slice(0, 3).map(e => e.sleep || 0);
      if (recentSleep.every(s => s < 6)) {
        flags.push({ type: 'danger', message: 'Chronic sleep deprivation detected (3+ days)', metric: 'sleep' });
      }
    }
    
    return flags;
  },
  
  /**
   * Create line chart
   */
  createLineChart(ctx, labels, datasets, options = {}) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: options.showLegend !== false,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        ...options
      }
    });
  },
  
  /**
   * Render steps chart
   */
  renderStepsChart(canvasId, entries, goal) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse();
    const data = entries.map(e => e.steps || 0).reverse();
    
    // Destroy existing chart if any
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    
    this.charts[canvasId] = this.createLineChart(ctx, labels, [
      {
        label: 'Steps',
        data,
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Goal',
        data: new Array(data.length).fill(goal),
        borderColor: 'rgb(139, 92, 246)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]);
    
    return this.charts[canvasId];
  },
  
  /**
   * Render heart rate chart
   */
  renderHeartRateChart(canvasId, entries) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse();
    const data = entries.map(e => e.heartRate || 0).reverse();
    
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    
    this.charts[canvasId] = this.createLineChart(ctx, labels, [
      {
        label: 'Heart Rate (bpm)',
        data,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]);
    
    return this.charts[canvasId];
  },
  
  /**
   * Render sleep chart
   */
  renderSleepChart(canvasId, entries, goal) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse();
    const data = entries.map(e => e.sleep || 0).reverse();
    
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sleep (hours)',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 12,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: { display: false }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
    
    return this.charts[canvasId];
  },
  
  /**
   * Render water intake chart
   */
  renderWaterChart(canvasId, entries, goal) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse();
    const data = entries.map(e => e.water || 0).reverse();
    
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    
    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Water (glasses)',
          data,
          backgroundColor: 'rgba(14, 165, 233, 0.7)',
          borderColor: 'rgb(14, 165, 233)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: { display: false }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
    
    return this.charts[canvasId];
  },
  
  /**
   * Render calories chart
   */
  renderCaloriesChart(canvasId, entries, goal) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const labels = entries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse();
    const data = entries.map(e => e.calories || 0).reverse();
    
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }
    
    this.charts[canvasId] = this.createLineChart(ctx, labels, [
      {
        label: 'Calories',
        data,
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Goal',
        data: new Array(data.length).fill(goal),
        borderColor: 'rgb(139, 92, 246)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]);
    
    return this.charts[canvasId];
  },
  
  /**
   * Destroy all charts (cleanup)
   */
  destroyAllCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }
};

// Expose to window
window.DashboardManager = DashboardManager;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DashboardManager;
}
