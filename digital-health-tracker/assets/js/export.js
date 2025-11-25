// export.js - Data export functionality (CSV, PDF)
// Handles exporting health data in various formats

/**
 * Export Manager
 * Provides methods to export data as CSV and PDF
 */
const ExportManager = {
  
  /**
   * Export entries as CSV
   */
  exportCSV(entries) {
    if (!entries || entries.length === 0) {
      console.warn('[Export] No entries to export');
      return null;
    }
    
    // CSV headers
    const headers = ['Date', 'Steps', 'Heart Rate (bpm)', 'Sleep (hours)', 'Water (glasses)', 'Calories', 'Mood', 'Notes'];
    
    // Convert entries to CSV rows
    const rows = entries.map(entry => [
      entry.date,
      entry.steps || 0,
      entry.heartRate || 0,
      entry.sleep || 0,
      entry.water || 0,
      entry.calories || 0,
      entry.mood || '',
      entry.notes || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
  },
  
  /**
   * Download CSV file
   */
  downloadCSV(entries, filename = 'health-data.csv') {
    const csvContent = this.exportCSV(entries);
    if (!csvContent) return false;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  },
  
  /**
   * Export data as JSON
   */
  downloadJSON(data, filename = 'health-data.json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  },
  
  /**
   * Generate PDF report (using jsPDF)
   * This requires jsPDF to be loaded via CDN
   */
  async generatePDF(userData, entries, stats) {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
      console.error('[Export] jsPDF library not loaded');
      return false;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(20, 184, 166);
    doc.text('Digital Health Tracker Report', 20, 20);
    
    // Subtitle - Date Range
    doc.setFontSize(10);
    doc.setTextColor(100);
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 20, 28);
    
    // User Info Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Patient Information', 20, 40);
    doc.setFontSize(10);
    doc.text(`Name: ${userData.name || 'N/A'}`, 20, 48);
    doc.text(`Age: ${userData.age || 'N/A'}`, 20, 54);
    doc.text(`Height: ${userData.height || 'N/A'} cm`, 20, 60);
    doc.text(`Weight: ${userData.weight || 'N/A'} kg`, 20, 66);
    
    // Health Score
    if (stats && stats.healthScore !== undefined) {
      doc.setFontSize(14);
      doc.text('Overall Health Score', 20, 80);
      doc.setFontSize(24);
      doc.setTextColor(20, 184, 166);
      doc.text(`${stats.healthScore}/100`, 20, 92);
      doc.setTextColor(0);
    }
    
    // Summary Statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics (Last 7 Days)', 20, 110);
    doc.setFontSize(10);
    
    if (stats) {
      let yPos = 118;
      doc.text(`Average Steps: ${stats.avgSteps?.toFixed(0) || 'N/A'}`, 20, yPos);
      yPos += 6;
      doc.text(`Average Heart Rate: ${stats.avgHeartRate?.toFixed(0) || 'N/A'} bpm`, 20, yPos);
      yPos += 6;
      doc.text(`Average Sleep: ${stats.avgSleep?.toFixed(1) || 'N/A'} hours`, 20, yPos);
      yPos += 6;
      doc.text(`Average Water: ${stats.avgWater?.toFixed(1) || 'N/A'} glasses`, 20, yPos);
      yPos += 6;
      doc.text(`Average Calories: ${stats.avgCalories?.toFixed(0) || 'N/A'}`, 20, yPos);
    }
    
    // Health Flags/Alerts
    if (stats && stats.flags && stats.flags.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(239, 68, 68);
      doc.text('Health Alerts', 20, 160);
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      let yPos = 168;
      stats.flags.forEach((flag, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`⚠ ${flag}`, 20, yPos);
        yPos += 6;
      });
    }
    
    // Recent Entries Table
    if (entries && entries.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Recent Health Entries', 20, 20);
      
      // Table headers
      doc.setFontSize(8);
      doc.text('Date', 20, 30);
      doc.text('Steps', 50, 30);
      doc.text('HR', 75, 30);
      doc.text('Sleep', 95, 30);
      doc.text('Water', 120, 30);
      doc.text('Calories', 145, 30);
      doc.text('Mood', 175, 30);
      
      // Table rows (limit to last 20 entries)
      let yPos = 38;
      entries.slice(0, 20).forEach(entry => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(entry.date || '', 20, yPos);
        doc.text((entry.steps || 0).toString(), 50, yPos);
        doc.text((entry.heartRate || 0).toString(), 75, yPos);
        doc.text((entry.sleep || 0).toString(), 95, yPos);
        doc.text((entry.water || 0).toString(), 120, yPos);
        doc.text((entry.calories || 0).toString(), 145, yPos);
        doc.text(entry.mood || '', 175, yPos);
        yPos += 6;
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Digital Health Tracker - Confidential Medical Report', 20, 290);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
    
    return doc;
  },
  
  /**
   * Download PDF Report
   */
  async downloadPDF(userData, entries, stats, filename = 'health-report.pdf') {
    try {
      const doc = await this.generatePDF(userData, entries, stats);
      if (!doc) return false;
      
      doc.save(filename);
      return true;
    } catch (error) {
      console.error('[Export] PDF generation failed:', error);
      return false;
    }
  },
  
  /**
   * Create shareable data blob URL for doctor
   */
  createShareableLink(data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportManager;
}
