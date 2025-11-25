// Advanced Medical AI - Research-Based Health Analysis
// Based on WHO guidelines and medical research papers

class MedicalAI {
  constructor() {
    this.diseaseRiskModel = null;
    this.symptomChecker = null;
    this.treatmentRecommender = null;
  }

  /**
   * Initialize Medical AI Models
   * Based on research: Rajkomar et al. (2018) - Scalable and accurate deep learning
   */
  async init() {
    console.log('[MedicalAI] Initializing medical analysis systems...');
    await this.loadDiseaseRiskModel();
    this.initSymptomChecker();
    this.initTreatmentRecommender();
    return true;
  }

  /**
   * Load disease prediction model
   * Reference: Framingham Heart Study risk assessment
   */
  async loadDiseaseRiskModel() {
    // Cardiovascular disease risk factors (Framingham Study)
    this.diseaseRiskModel = {
      cardiovascular: {
        factors: ['age', 'cholesterol', 'bloodPressure', 'smoking', 'diabetes', 'bmi'],
weightings: { age: 0.2, cholesterol: 0.15, bloodPressure: 0.2, smoking: 0.15, diabetes: 0.15, bmi: 0.15 }
      },
      diabetes: {
        factors: ['age', 'bmi', 'familyHistory', 'physicalActivity', 'bloodGlucose'],
        weightings: { age: 0.15, bmi: 0.25, familyHistory: 0.20, physicalActivity: 0.20, bloodGlucose: 0.20 }
      },
      stroke: {
        factors: ['age', 'bloodPressure', 'heartRate', 'smoking', 'diabetes'],
        weightings: { age: 0.25, bloodPressure: 0.25, heartRate: 0.15, smoking: 0.20, diabetes: 0.15 }
      }
    };
  }

  /**
   * Calculate cardiovascular disease risk
   * Based on: Framingham Risk Score (D'Agostino et al., 2008)
   */
  calculateCardiovascularRisk(healthData) {
    const age = healthData.age || 30;
    const systolic = healthData.systolicBP || 120;
    const cholesterol = healthData.totalCholesterol || 200;
    const hdl = healthData.hdlCholesterol || 50;
    const smoker = healthData.smoker || false;
    const diabetic = healthData.diabetic || false;
    
    let points = 0;
    
    // Age points
    if (age >= 70) points += 10;
    else if (age >= 60) points += 8;
    else if (age >= 50) points += 6;
    else if (age >= 40) points += 4;
    else if (age >= 35) points += 2;
    
    // Blood pressure
    if (systolic >= 160) points += 6;
    else if (systolic >= 140) points += 4;
    else if (systolic >= 130) points += 2;
    else if (systolic >= 120) points += 1;
    
    // Cholesterol
    if (cholesterol >= 280) points += 6;
    else if (cholesterol >= 240) points += 4;
    else if (cholesterol >= 200) points += 2;
    
    // HDL (protective)
    if (hdl < 35) points += 3;
    else if (hdl >= 60) points -= 2;
    
    // Risk factors
    if (smoker) points += 4;
    if (diabetic) points += 3;
    
    // Calculate 10-year risk percentage
    let risk = 0;
    if (points <= 0) risk = 1;
    else if (points <= 4) risk = 2;
    else if (points <= 6) risk = 4;
    else if (points <= 8) risk = 7;
    else if (points <= 10) risk = 11;
    else if (points <= 12) risk = 17;
    else if (points <= 14) risk = 25;
    else if (points <= 16) risk = 35;
    else risk = 50;
    
    return {
      risk: risk,
      category: risk < 10 ? 'Low' : risk < 20 ? 'Moderate' : 'High',
      points: points,
      recommendations: this.getCardioRecommendations(risk, healthData)
    };
  }

  /**
   * Get cardiovascular health recommendations
   * Based on American Heart Association guidelines
   */
  getCardioRecommendations(risk, data) {
    const recommendations = [];
    
    if (risk >= 20) {
      recommendations.push({
        priority: 'High',
        action: 'Consult cardiologist immediately',
        reason: 'High 10-year cardiovascular disease risk detected'
      });
    }
    
    if (data.systolicBP > 140) {
      recommendations.push({
        priority: 'High',
        action: 'Monitor and manage blood pressure',
        reason: 'Hypertension detected (BP > 140/90)'
      });
    }
    
    if (data.totalCholesterol > 240) {
      recommendations.push({
        priority: 'Medium',
        action: 'Reduce dietary cholesterol, consider statins',
        reason: 'High cholesterol levels'
      });
    }
    
    if (data.smoker) {
      recommendations.push({
        priority: 'High',
        action: 'Smoking cessation program',
        reason: 'Smoking significantly increases cardiovascular risk'
      });
    }
    
    // General recommendations
    recommendations.push({
      priority: 'Medium',
      action: '150 minutes of moderate exercise per week',
      reason: 'WHO recommendation for cardiovascular health'
    });
    
    return recommendations;
  }

  /**
   * Calculate diabetes risk
   * Based on: American Diabetes Association risk test
   */
  calculateDiabetesRisk(healthData) {
    const age = healthData.age || 30;
    const bmi = healthData.bmi || 22;
    const waist = healthData.waistCircumference || 80;
    const familyHistory = healthData.diabetesFamilyHistory || false;
    const physicalActivity = healthData.weeklyExerciseHours || 2;
    const bloodGlucose = healthData.fastingGlucose || 90;
    
    let points = 0;
    
    // Age
    if (age >= 65) points += 3;
    else if (age >= 45) points += 2;
    else if (age >= 40) points += 1;
    
    // BMI
    if (bmi >= 35) points += 3;
    else if (bmi >= 30) points += 2;
    else if (bmi >= 25) points += 1;
    
    // Waist circumference (cm)
    if (waist > 102) points += 2; // Male
    else if (waist > 88) points += 2; // Female
    
    // Family history
    if (familyHistory) points += 2;
    
    // Physical activity
    if (physicalActivity < 2) points += 2;
    
    // Blood glucose
    if (bloodGlucose >= 126) points += 4; // Diabetic range
    else if (bloodGlucose >= 100) points += 2; // Pre-diabetic
    
    const risk = points >= 6 ? 'High' : points >= 3 ? 'Moderate' : 'Low';
    
    return {
      risk: risk,
      points: points,
      preDiabetic: bloodGlucose >= 100 && bloodGlucose < 126,
      diabetic: bloodGlucose >= 126,
      recommendations: this.getDiabetesRecommendations(risk, bloodGlucose, bmi)
    };
  }

  /**
   * Get diabetes prevention recommendations
   */
  getDiabetesRecommendations(risk, glucose, bmi) {
    const recommendations = [];
    
    if (glucose >= 126) {
      recommendations.push({
        priority: 'Urgent',
        action: 'Consult endocrinologist immediately',
        reason: 'Fasting glucose in diabetic range (≥126 mg/dL)'
      });
    } else if (glucose >= 100) {
      recommendations.push({
        priority: 'High',
        action: 'Lifestyle modification and glucose monitoring',
        reason: 'Pre-diabetic glucose levels detected'
      });
    }
    
    if (bmi >= 30) {
      recommendations.push({
        priority: 'High',
        action: 'Weight loss program: target 5-10% reduction',
        reason: 'Obesity increases diabetes risk by 80%'
      });
    }
    
    recommendations.push({
      priority: 'Medium',
      action: 'Mediterranean diet with low glycemic index foods',
      reason: 'Proven to reduce diabetes risk by 50% (Salas-Salvadó et al., 2014)'
    });
    
    recommendations.push({
      priority: 'Medium',
      action: '30 minutes daily moderate exercise',
      reason: 'Reduces diabetes risk and improves insulin sensitivity'
    });
    
    return recommendations;
  }

  /**
   * Initialize symptom checker
   * Based on: SymptomChecker.io algorithms
   */
  initSymptomChecker() {
    this.symptomDatabase = {
      'headache_fever_fatigue': {
        possibleConditions: ['Flu', 'COVID-19', 'Meningitis'],
        urgency: 'Medium',
        action: 'Monitor symptoms, consult doctor if persists >3 days'
      },
      'chest_pain_shortness_breath': {
        possibleConditions: ['Heart Attack', 'Angina', 'Pulmonary Embolism'],
        urgency: 'Emergency',
        action: 'Call emergency services immediately'
      },
      'persistent_cough_fever': {
        possibleConditions: ['Pneumonia', 'Bronchitis', 'Tuberculosis'],
        urgency: 'High',
        action: 'Consult doctor within 24 hours'
      },
      'abdominal_pain_nausea': {
        possibleConditions: ['Appendicitis', 'Gastroenteritis', 'Ulcer'],
        urgency: 'Medium',
        action: 'Monitor symptoms, seek care if worsening'
      },
      'frequent_urination_thirst': {
        possibleConditions: ['Diabetes', 'UTI', 'Kidney Disease'],
        urgency: 'Medium',
        action: 'Get blood sugar and urine tests'
      }
    };
  }

  /**
   * Analyze symptoms
   */
  analyzeSymptoms(symptoms) {
    const symptomKey = symptoms.sort().join('_').toLowerCase();
    const match = this.symptomDatabase[symptomKey];
    
    if (match) {
      return match;
    }
    
    // Fuzzy matching for partial symptom overlap
    for (const [key, value] of Object.entries(this.symptomDatabase)) {
      const keySymptoms = key.split('_');
      const overlap = symptoms.filter(s => keySymptoms.includes(s.toLowerCase())).length;
      
      if (overlap >= 2) {
        return {
          ...value,
          confidence: (overlap / keySymptoms.length) * 100
        };
      }
    }
    
    return {
      possibleConditions: ['Consult healthcare provider for proper diagnosis'],
      urgency: 'Low',
      action: 'Monitor symptoms and seek medical advice if concerned'
    };
  }

  /**
   * Initialize treatment recommender
   * Based on WHO treatment guidelines
   */
  initTreatmentRecommender() {
    this.treatmentGuidelines = {
      hypertension: {
        lifestyle: [
          'Reduce sodium intake to <2g/day',
          'DASH diet (Dietary Approaches to Stop Hypertension)',
          '150 min/week moderate aerobic exercise',
          'Limit alcohol consumption',
          'Maintain healthy weight (BMI 18.5-24.9)'
        ],
        medication: {
          stage1: 'ACE inhibitors or ARBs (first-line)',
          stage2: 'Combination therapy: ACE inhibitor + Calcium channel blocker'
        }
      },
      diabetes: {
        lifestyle: [
          'Carbohydrate counting and glycemic index awareness',
          'Regular blood glucose monitoring',
          '150 min/week moderate exercise',
          'Weight management',
          'Regular foot care and eye exams'
        ],
        medication: {
          type2: 'Metformin (first-line), then add SGLT2 inhibitors or GLP-1 agonists',
          type1: 'Insulin therapy (basal-bolus regimen)'
        }
      },
      obesity: {
        lifestyle: [
          'Caloric deficit: 500-1000 kcal/day reduction',
          'Balanced macronutrients: 45-65% carbs, 10-35% protein, 20-35% fat',
          '300 min/week moderate exercise for weight loss',
          'Behavioral therapy and support groups',
          'Sleep 7-9 hours (sleep deprivation increases obesity risk)'
        ],
        medication: {
          bmi_30plus: 'Orlistat, Liraglutide, or Phentermine-topiramate',
          bmi_40plus: 'Consider bariatric surgery'
        }
      }
    };
  }

  /**
   * Get personalized treatment plan
   */
  getTreatmentPlan(condition, patientData) {
    const guideline = this.treatmentGuidelines[condition.toLowerCase()];
    
    if (!guideline) {
      return {
        message: 'Please consult healthcare provider for treatment plan',
        general: ['Follow prescribed medication', 'Regular checkups', 'Healthy lifestyle']
      };
    }
    
    return {
      lifestyle: guideline.lifestyle,
      medication: guideline.medication,
      followUp: 'Monitor progress every 2-4 weeks',
      emergencySigns: this.getEmergencySigns(condition)
    };
  }

  /**
   * Emergency warning signs for conditions
   */
  getEmergencySigns(condition) {
    const signs = {
      hypertension: ['Severe headache', 'Chest pain', 'Vision problems', 'Difficulty breathing'],
      diabetes: ['Blood sugar >400 mg/dL', 'Loss of consciousness', 'Severe dehydration'],
      obesity: ['Chest pain', 'Severe shortness of breath', 'Swelling in legs']
    };
    
    return signs[condition.toLowerCase()] || ['Severe symptoms', 'Loss of consciousness', 'Chest pain'];
  }

  /**
   * Calculate BMI and health category
   * WHO classification
   */
  calculateBMI(weight, height) {
    const heightM = height / 100; // cm to m
    const bmi = weight / (heightM * heightM);
    
    let category, risk;
    if (bmi < 18.5) {
      category = 'Underweight';
      risk = 'Malnutrition, osteoporosis risk';
    } else if (bmi < 25) {
      category = 'Normal';
      risk = 'Low health risk';
    } else if (bmi < 30) {
      category = 'Overweight';
      risk = 'Moderate risk for cardiovascular disease';
    } else if (bmi < 35) {
      category = 'Obese Class I';
      risk = 'High risk for diabetes, hypertension';
    } else if (bmi < 40) {
      category = 'Obese Class II';
      risk = 'Very high risk for chronic diseases';
    } else {
      category = 'Obese Class III';
      risk = 'Extremely high risk, consider bariatric surgery';
    }
    
    return { bmi: bmi.toFixed(1), category, risk };
  }

  /**
   * Mental health screening (PHQ-9 Depression Scale)
   * Based on: Kroenke et al. (2001)
   */
  screenDepression(responses) {
    // PHQ-9 score: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe
    const score = responses.reduce((sum, val) => sum + val, 0);
    
    let severity, recommendation;
    if (score <= 4) {
      severity = 'Minimal';
      recommendation = 'No treatment needed, monitor symptoms';
    } else if (score <= 9) {
      severity = 'Mild';
      recommendation = 'Watchful waiting, consider counseling';
    } else if (score <= 14) {
      severity = 'Moderate';
      recommendation = 'Treatment plan: therapy and/or medication';
    } else if (score <= 19) {
      severity = 'Moderately Severe';
      recommendation = 'Active treatment: medication + therapy strongly recommended';
    } else {
      severity = 'Severe';
      recommendation = 'Immediate treatment: medication + intensive therapy, safety assessment';
    }
    
    return { score, severity, recommendation };
  }

  /**
   * Sleep quality analysis
   * Based on: Pittsburgh Sleep Quality Index (PSQI)
   */
  analyzeSleepQuality(sleepData) {
    const duration = sleepData.averageHours || 7;
    const latency = sleepData.timeToFallAsleep || 15; // minutes
    const efficiency = sleepData.timeAsleep / sleepData.timeInBed * 100;
    const disturbances = sleepData.nightlyWakings || 0;
    
    let quality = 'Good';
    const issues = [];
    
    if (duration < 6) {
      quality = 'Poor';
      issues.push('Insufficient sleep (<6 hours)');
    } else if (duration > 9) {
      quality = 'Concerning';
      issues.push('Excessive sleep (>9 hours) may indicate underlying condition');
    }
    
    if (latency > 30) {
      quality = 'Poor';
      issues.push('Prolonged sleep onset (insomnia)');
    }
    
    if (efficiency < 85) {
      quality = 'Poor';
      issues.push('Low sleep efficiency (<85%)');
    }
    
    if (disturbances > 2) {
      issues.push('Frequent night wakings (sleep fragmentation)');
    }
    
    return {
      quality,
      efficiency: efficiency.toFixed(1) + '%',
      issues,
      recommendations: this.getSleepRecommendations(issues)
    };
  }

  /**
   * Sleep hygiene recommendations
   */
  getSleepRecommendations(issues) {
    const recommendations = [
      'Maintain consistent sleep schedule (same bedtime/wake time)',
      'Avoid caffeine 6 hours before bed',
      'Exercise regularly (but not within 3 hours of bedtime)',
      'Create dark, quiet, cool bedroom environment',
      'Limit screen time 1 hour before bed (blue light exposure)'
    ];
    
    if (issues.includes('Prolonged sleep onset (insomnia)')) {
      recommendations.push('Consider Cognitive Behavioral Therapy for Insomnia (CBT-I)');
    }
    
    if (issues.some(i => i.includes('Excessive sleep'))) {
      recommendations.push('Screen for depression, sleep apnea, or thyroid disorders');
    }
    
    return recommendations;
  }
}

// Export
window.MedicalAI = MedicalAI;
