// recommendations.js - Health recommendation engine
// Rule-based system for providing health tips and suggestions

/**
 * Recommendation Engine
 * Analyzes health data and provides personalized recommendations
 */
const RecommendationEngine = {
  
  /**
   * Analyze entry and generate recommendations
   */
  analyzeEntry(entry, goals) {
    const recommendations = [];
    
    if (!entry) {
      return [{
        type: 'info',
        category: 'general',
        message: 'Start logging your health data to get personalized recommendations!',
        priority: 'low'
      }];
    }
    
    // Sleep analysis
    if (entry.sleep < 6) {
      recommendations.push({
        type: 'warning',
        category: 'sleep',
        message: 'You\'re getting insufficient sleep. Aim for 7-9 hours per night.',
        tips: [
          'Maintain a consistent sleep schedule',
          'Avoid screens 1 hour before bed',
          'Create a relaxing bedtime routine',
          'Keep your bedroom cool and dark'
        ],
        priority: 'high'
      });
    } else if (entry.sleep < 7) {
      recommendations.push({
        type: 'info',
        category: 'sleep',
        message: 'Your sleep is below optimal. Consider getting more rest.',
        tips: [
          'Try to add 30-60 minutes more sleep',
          'Maintain consistent sleep/wake times'
        ],
        priority: 'medium'
      });
    } else if (entry.sleep >= 8) {
      recommendations.push({
        type: 'success',
        category: 'sleep',
        message: 'Excellent sleep! Keep up the good work!',
        priority: 'low'
      });
    }
    
    // Activity analysis
    if (entry.steps < 2000) {
      recommendations.push({
        type: 'warning',
        category: 'activity',
        message: 'Very low activity detected. Try to move more throughout the day.',
        tips: [
          'Take short walking breaks every hour',
          'Use stairs instead of elevators',
          'Park farther away from destinations',
          'Try a 10-minute morning walk'
        ],
        priority: 'high'
      });
    } else if (entry.steps < (goals?.steps || 10000)) {
      recommendations.push({
        type: 'info',
        category: 'activity',
        message: `You're ${goals.steps - entry.steps} steps away from your goal!`,
        tips: [
          'Take a quick walk before bed',
          'Walk while on phone calls',
          'Do household chores'
        ],
        priority: 'medium'
      });
    } else {
      recommendations.push({
        type: 'success',
        category: 'activity',
        message: 'Great job meeting your step goal!',
        priority: 'low'
      });
    }
    
    // Hydration analysis
    if (entry.water < 3) {
      recommendations.push({
        type: 'warning',
        category: 'hydration',
        message: 'Low water intake. Dehydration can affect your energy and focus.',
        tips: [
          'Keep a water bottle with you',
          'Set hourly reminders to drink water',
          'Drink a glass of water before each meal',
          'Try infusing water with fruits for flavor'
        ],
        priority: 'high'
      });
    } else if (entry.water < (goals?.water || 8)) {
      recommendations.push({
        type: 'info',
        category: 'hydration',
        message: `Drink ${goals.water - entry.water} more glasses to reach your goal.`,
        tips: [
          'Have a glass of water now',
          'Drink water before bed'
        ],
        priority: 'medium'
      });
    } else {
      recommendations.push({
        type: 'success',
        category: 'hydration',
        message: 'Well hydrated! Keep it up!',
        priority: 'low'
      });
    }
    
    // Heart rate analysis
    if (entry.heartRate > 100) {
      recommendations.push({
        type: 'danger',
        category: 'heart',
        message: 'Elevated resting heart rate detected.',
        tips: [
          'Consider stress reduction techniques',
          'Practice deep breathing exercises',
          'Ensure adequate rest and recovery',
          'Consult a doctor if this persists'
        ],
        priority: 'high'
      });
    } else if (entry.heartRate < 60 && entry.heartRate > 0) {
      recommendations.push({
        type: 'info',
        category: 'heart',
        message: 'Low resting heart rate. This can be normal for athletes.',
        tips: [
          'Monitor for any unusual symptoms',
          'Consult a doctor if you feel dizzy or fatigued'
        ],
        priority: 'medium'
      });
    } else if (entry.heartRate >= 60 && entry.heartRate <= 80) {
      recommendations.push({
        type: 'success',
        category: 'heart',
        message: 'Heart rate is in healthy range!',
        priority: 'low'
      });
    }
    
    // Mood-based recommendations
    if (entry.mood === 'tired' || entry.mood === 'exhausted') {
      recommendations.push({
        type: 'info',
        category: 'wellness',
        message: 'Feeling tired? Your body might need rest or exercise.',
        tips: [
          'Get 15 minutes of fresh air and sunlight',
          'Take a power nap (20-30 minutes)',
          'Check your caffeine intake',
          'Ensure you\'re getting quality sleep'
        ],
        priority: 'medium'
      });
    } else if (entry.mood === 'stressed' || entry.mood === 'anxious') {
      recommendations.push({
        type: 'info',
        category: 'wellness',
        message: 'High stress detected. Consider relaxation techniques.',
        tips: [
          'Practice 5 minutes of deep breathing',
          'Try meditation or mindfulness',
          'Take a short walk outdoors',
          'Talk to someone you trust',
          'Reduce caffeine intake'
        ],
        priority: 'high'
      });
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations;
  },
  
  /**
   * Analyze trends over multiple entries
   */
  analyzeTrends(entries) {
    if (!entries || entries.length < 3) {
      return {
        trends: [],
        insights: ['Log more data to see trend analysis']
      };
    }
    
    const trends = [];
    const insights = [];
    
    // Calculate averages
    const avgSteps = entries.reduce((sum, e) => sum + (e.steps || 0), 0) / entries.length;
    const avgSleep = entries.reduce((sum, e) => sum + (e.sleep || 0), 0) / entries.length;
    const avgWater = entries.reduce((sum, e) => sum + (e.water || 0), 0) / entries.length;
    const avgHeartRate = entries.reduce((sum, e) => sum + (e.heartRate || 0), 0) / entries.length;
    
    // Sleep trend
    if (avgSleep < 6.5) {
      trends.push({
        category: 'sleep',
        direction: 'concern',
        message: 'Your average sleep is below recommended levels',
        value: avgSleep.toFixed(1)
      });
      insights.push('Consistent lack of sleep can affect your health, mood, and productivity.');
    } else if (avgSleep >= 7.5) {
      trends.push({
        category: 'sleep',
        direction: 'positive',
        message: 'Great sleep pattern!',
        value: avgSleep.toFixed(1)
      });
    }
    
    // Activity trend
    if (avgSteps < 5000) {
      trends.push({
        category: 'activity',
        direction: 'concern',
        message: 'Your activity level is quite low',
        value: avgSteps.toFixed(0)
      });
      insights.push('Try to gradually increase your daily steps by 500-1000 each week.');
    } else if (avgSteps >= 8000) {
      trends.push({
        category: 'activity',
        direction: 'positive',
        message: 'Excellent activity level!',
        value: avgSteps.toFixed(0)
      });
    }
    
    // Hydration trend
    if (avgWater < 5) {
      trends.push({
        category: 'hydration',
        direction: 'concern',
        message: 'Consistently low water intake',
        value: avgWater.toFixed(1)
      });
      insights.push('Set reminders to drink water throughout the day.');
    }
    
    // Check for improving/declining trends
    if (entries.length >= 5) {
      const recent = entries.slice(0, 3);
      const older = entries.slice(-3);
      
      const recentAvgSteps = recent.reduce((sum, e) => sum + (e.steps || 0), 0) / 3;
      const olderAvgSteps = older.reduce((sum, e) => sum + (e.steps || 0), 0) / 3;
      
      if (recentAvgSteps > olderAvgSteps * 1.2) {
        insights.push('Your activity is trending upward - great progress!');
      } else if (recentAvgSteps < olderAvgSteps * 0.8) {
        insights.push('Your activity has decreased recently. Try to get back on track.');
      }
    }
    
    return { trends, insights };
  },
  
  /**
   * Get daily health tip
   */
  getDailyTip() {
    const tips = [
      { category: 'hydration', tip: 'Start your day with a glass of water to kickstart your metabolism.' },
      { category: 'activity', tip: 'Take the stairs whenever possible - it\'s a simple way to stay active.' },
      { category: 'sleep', tip: 'Keep your bedroom temperature between 60-67°F for optimal sleep.' },
      { category: 'nutrition', tip: 'Eat a rainbow of colorful fruits and vegetables for maximum nutrients.' },
      { category: 'wellness', tip: 'Practice gratitude - write down three things you\'re grateful for today.' },
      { category: 'activity', tip: 'Set a timer to stand and stretch every hour if you sit a lot.' },
      { category: 'sleep', tip: 'Expose yourself to bright light in the morning to regulate your sleep cycle.' },
      { category: 'hydration', tip: 'If plain water is boring, try adding lemon, cucumber, or mint.' },
      { category: 'wellness', tip: 'Take 5 deep breaths when you feel stressed - it really helps!' },
      { category: 'activity', tip: 'Walk while taking phone calls - you\'ll barely notice the extra steps.' }
    ];
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecommendationEngine;
}
