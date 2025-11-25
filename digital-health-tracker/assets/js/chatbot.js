// Medical AI Chatbot - Intelligent Health Assistant
// Advanced medical knowledge base with Q&A system

class MedicalChatbot {
  constructor() {
    this.conversationHistory = [];
    this.medicalKnowledgeBase = null;
    this.qaDatabase = null;
    this.initialized = false;
  }

  /**
   * Initialize chatbot with medical knowledge
   */
  init() {
    if (this.initialized) return;
    
    this.loadMedicalKnowledge();
    this.loadQADatabase();
    this.initialized = true;
    
    console.log('[MedicalChatbot] Initialized with medical knowledge');
  }

  /**
   * Load medical knowledge base
   * Based on WHO, CDC, and medical research
   */
  loadMedicalKnowledge() {
    this.medicalKnowledgeBase = {
      // Cardiovascular Health
      cardiovascular: {
        normalHeartRate: { rest: '60-100 bpm', exercise: '120-160 bpm' },
        bloodPressure: {
          normal: '< 120/80',
          elevated: '120-129/<80',
          stage1: '130-139/80-89',
          stage2: '≥140/≥90',
          crisis: '>180/>120'
        },
        cholesterol: {
          total: { optimal: '<200 mg/dL', borderline: '200-239', high: '≥240' },
          ldl: { optimal: '<100', near: '100-129', borderline: '130-159', high: '≥160' },
          hdl: { low: '<40', high: '≥60' }
        },
        symptoms: {
          heartAttack: ['Chest pain', 'Shortness of breath', 'Nausea', 'Cold sweat', 'Arm pain'],
          stroke: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Time to call emergency']
        }
      },

      // Diabetes
      diabetes: {
        bloodGlucose: {
          normal: { fasting: '<100 mg/dL', random: '<140' },
          prediabetes: { fasting: '100-125', random: '140-199' },
          diabetes: { fasting: '≥126', random: '≥200' }
        },
        hba1c: {
          normal: '<5.7%',
          prediabetes: '5.7-6.4%',
          diabetes: '≥6.5%'
        },
        symptoms: ['Increased thirst', 'Frequent urination', 'Extreme hunger', 'Unexplained weight loss', 'Fatigue', 'Blurred vision'],
        complications: ['Neuropathy', 'Retinopathy', 'Nephropathy', 'Cardiovascular disease']
      },

      // Nutrition
      nutrition: {
        macronutrients: {
          carbohydrates: '45-65% of daily calories',
          protein: '10-35% of daily calories (0.8g/kg body weight)',
          fats: '20-35% of daily calories'
        },
        vitamins: {
          vitaminA: { rda: '900mcg men, 700mcg women', sources: ['Carrots', 'Sweet potatoes', 'Spinach'] },
          vitaminC: { rda: '90mg men, 75mg women', sources: ['Citrus fruits', 'Strawberries', 'Bell peppers'] },
          vitaminD: { rda: '600-800 IU', sources: ['Sunlight', 'Fatty fish', 'Fortified milk'] },
          vitaminB12: { rda: '2.4mcg', sources: ['Meat', 'Fish', 'Dairy', 'Fortified cereals'] }
        },
        minerals: {
          iron: { rda: '8mg men, 18mg women', sources: ['Red meat', 'Spinach', 'Legumes'] },
          calcium: { rda: '1000mg', sources: ['Dairy', 'Leafy greens', 'Almonds'] },
          magnesium: { rda: '400mg men, 310mg women', sources: ['Nuts', 'Whole grains', 'Dark chocolate'] }
        },
        water: '2.7L women, 3.7L men per day'
      },

      // Mental Health
      mentalHealth: {
        depression: {
          symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep changes', 'Appetite changes', 'Fatigue', 'Difficulty concentrating'],
          screening: 'PHQ-9 questionnaire',
          treatment: ['Therapy (CBT, IPT)', 'Medication (SSRIs)', 'Lifestyle changes', 'Support groups']
        },
        anxiety: {
          symptoms: ['Excessive worry', 'Restlessness', 'Fatigue', 'Difficulty concentrating', 'Muscle tension', 'Sleep disturbance'],
          types: ['Generalized', 'Social', 'Panic', 'Phobias'],
          treatment: ['CBT', 'Medication', 'Relaxation techniques', 'Mindfulness']
        },
        stress: {
          acute: 'Short-term response to immediate threat',
          chronic: 'Long-term exposure to stressors',
          management: ['Exercise', 'Meditation', 'Deep breathing', 'Time management', 'Social support']
        }
      },

      // Sleep
      sleep: {
        recommended: {
          adults: '7-9 hours',
          teenagers: '8-10 hours',
          children: '9-12 hours'
        },
        stages: ['NREM Stage 1', 'NREM Stage 2', 'NREM Stage 3 (Deep)', 'REM'],
        disorders: {
          insomnia: 'Difficulty falling or staying asleep',
          sleepApnea: 'Breathing interruptions during sleep',
          narcolepsy: 'Excessive daytime sleepiness',
          restlessLegs: 'Uncomfortable sensations in legs'
        },
        hygiene: ['Consistent schedule', 'Dark quiet room', 'Avoid caffeine 6h before', 'No screens 1h before', 'Cool temperature']
      },

      // Exercise
      exercise: {
        recommended: '150 min moderate OR 75 min vigorous per week',
        types: {
          aerobic: ['Walking', 'Running', 'Swimming', 'Cycling'],
          strength: ['Weight lifting', 'Resistance bands', 'Body weight exercises'],
          flexibility: ['Yoga', 'Stretching', 'Pilates'],
          balance: ['Tai chi', 'Standing on one leg']
        },
        benefits: ['Cardiovascular health', 'Weight management', 'Mental health', 'Bone strength', 'Immunity']
      },

      // First Aid
      firstAid: {
        cpr: {
          steps: ['Check responsiveness', 'Call emergency', '30 compressions (2 inches deep)', '2 rescue breaths', 'Repeat'],
          rate: '100-120 compressions per minute'
        },
        choking: {
          conscious: '5 back blows, 5 abdominal thrusts (Heimlich)',
          unconscious: 'CPR'
        },
        bleeding: {
          minor: 'Clean, apply pressure, bandage',
          severe: 'Apply direct pressure, elevate, call emergency'
        },
        burns: {
          minor: 'Cool water 10-20 mins, cover with sterile gauze',
          severe: 'Call emergency, do not remove clothing, cover with clean cloth'
        }
      },

      // Medications
      medications: {
        commonPain: {
          acetaminophen: { dosage: '500-1000mg every 4-6h, max 4000mg/day', uses: 'Pain, fever' },
          ibuprofen: { dosage: '200-400mg every 4-6h, max 1200mg/day OTC', uses: 'Pain, inflammation, fever' },
          aspirin: { dosage: '81-325mg daily for heart, 325-650mg for pain', uses: 'Pain, heart disease prevention' }
        },
        antibiotics: {
          penicillin: 'Bacterial infections, allergies common',
          amoxicillin: 'Broad-spectrum bacterial infections',
          azithromycin: 'Respiratory, skin infections'
        },
        vaccinations: {
          covid19: 'Primary series + boosters',
          flu: 'Annual',
          tetanus: 'Every 10 years',
          hepatitisB: '3-dose series'
        }
      }
    };
  }

  /**
   * Load Q&A database
   */
  loadQADatabase() {
    this.qaDatabase = [
      {
        question: 'What is normal blood pressure?',
        answer: 'Normal blood pressure is less than 120/80 mmHg. Elevated is 120-129/<80, Stage 1 hypertension is 130-139/80-89, and Stage 2 is ≥140/≥90. If you consistently have high readings, consult a doctor.',
        category: 'cardiovascular',
        keywords: ['blood pressure', 'hypertension', 'bp']
      },
      {
        question: 'How much water should I drink daily?',
        answer: 'The recommended daily water intake is about 2.7 liters (11 cups) for women and 3.7 liters (15 cups) for men. This includes all fluids from foods and beverages. Individual needs vary based on activity level, climate, and health status.',
        category: 'nutrition',
        keywords: ['water', 'hydration', 'fluids']
      },
      {
        question: 'What are symptoms of diabetes?',
        answer: 'Common diabetes symptoms include: increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, blurred vision, slow-healing sores, and frequent infections. If you experience these, consult a doctor for blood glucose testing.',
        category: 'diabetes',
        keywords: ['diabetes', 'symptoms', 'blood sugar']
      },
      {
        question: 'How much sleep do I need?',
        answer: 'Adults need 7-9 hours of sleep per night. Teenagers need 8-10 hours, and children 9-12 hours. Quality sleep is essential for physical health, mental well-being, and cognitive function. Maintain a consistent sleep schedule for best results.',
        category: 'sleep',
        keywords: ['sleep', 'rest', 'insomnia']
      },
      {
        question: 'What is a healthy BMI?',
        answer: 'A healthy BMI (Body Mass Index) is 18.5-24.9. Under 18.5 is underweight, 25-29.9 is overweight, 30-34.9 is obese class I, 35-39.9 is obese class II, and 40+ is obese class III. BMI is a screening tool but doesn\'t measure body fat directly.',
        category: 'nutrition',
        keywords: ['bmi', 'weight', 'obesity']
      },
      {
        question: 'How often should I exercise?',
        answer: 'Adults should aim for 150 minutes of moderate aerobic activity OR 75 minutes of vigorous activity per week, plus muscle-strengthening activities 2+ days per week. This can be broken into 30-minute sessions, 5 days a week.',
        category: 'exercise',
        keywords: ['exercise', 'workout', 'fitness']
      },
      {
        question: 'What are signs of a heart attack?',
        answer: 'Heart attack warning signs include: chest pain or discomfort, shortness of breath, pain in arms/back/neck/jaw, cold sweat, nausea, and lightheadedness. Call emergency services immediately (911) if you experience these symptoms. Time is critical!',
        category: 'cardiovascular',
        keywords: ['heart attack', 'chest pain', 'emergency']
      },
      {
        question: 'How can I reduce stress?',
        answer: 'Effective stress management techniques include: regular exercise, meditation/mindfulness, deep breathing exercises, adequate sleep, healthy eating, social connections, time management, and hobbies. If stress is severe or persistent, consider professional counseling.',
        category: 'mentalHealth',
        keywords: ['stress', 'anxiety', 'mental health']
      },
      {
        question: 'What are good sources of protein?',
        answer: 'Excellent protein sources include: lean meats (chicken, turkey), fish, eggs, dairy (milk, yogurt, cheese), legumes (beans, lentils), nuts, seeds, and whole grains. Adults need about 0.8g protein per kg body weight daily.',
        category: 'nutrition',
        keywords: ['protein', 'diet', 'nutrition']
      },
      {
        question: 'What is normal blood sugar?',
        answer: 'Normal fasting blood glucose is <100 mg/dL. Prediabetes is 100-125 mg/dL, and diabetes is ≥126 mg/dL. Random blood sugar <140 is normal, 140-199 is prediabetes, ≥200 is diabetes. HbA1c <5.7% is normal, 5.7-6.4% is prediabetes, ≥6.5% is diabetes.',
        category: 'diabetes',
        keywords: ['blood sugar', 'glucose', 'diabetes']
      }
    ];
  }

  /**
   * Get chatbot response
   */
  async getResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      message: userMessage,
      timestamp: Date.now()
    });
    
    let response = '';
    let confidence = 0;
    
    // Try to match Q&A database
    const qaMatch = this.findBestQAMatch(message);
    if (qaMatch && qaMatch.confidence > 0.6) {
      response = qaMatch.answer;
      confidence = qaMatch.confidence;
    }
    
    // Try keyword-based knowledge base search
    if (!response || confidence < 0.8) {
      const kbResponse = this.searchKnowledgeBase(message);
      if (kbResponse && kbResponse.confidence > confidence) {
        response = kbResponse.answer;
        confidence = kbResponse.confidence;
      }
    }
    
    // Fallback general responses
    if (!response || confidence < 0.5) {
      response = this.getGeneralResponse(message);
    }
    
    // Add disclaimer for medical advice
    if (this.isMedicalQuestion(message)) {
      response += '\n\n⚠️ Note: This is general information only. For specific health concerns, please consult a healthcare professional.';
    }
    
    // Add to conversation history
    const botResponse = {
      role: 'assistant',
      message: response,
      timestamp: Date.now(),
      confidence: confidence
    };
    
    this.conversationHistory.push(botResponse);
    
    return botResponse;
  }

  /**
   * Find best matching Q&A
   */
  findBestQAMatch(message) {
    let bestMatch = null;
    let highestScore = 0;
    
    for (const qa of this.qaDatabase) {
      let score = 0;
      
      // Check keywords
      for (const keyword of qa.keywords) {
        if (message.includes(keyword)) {
          score += 0.3;
        }
      }
      
      // Check question similarity
      const questionWords = qa.question.toLowerCase().split(' ');
      const messageWords = message.split(' ');
      
      for (const word of questionWords) {
        if (messageWords.includes(word) && word.length > 3) {
          score += 0.1;
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { ...qa, confidence: Math.min(score, 1) };
      }
    }
    
    return bestMatch;
  }

  /**
   * Search knowledge base
   */
  searchKnowledgeBase(message) {
    // Check for specific health topics
    if (message.includes('heart') || message.includes('cardiovascular')) {
      return {
        answer: this.formatCardiovascularInfo(),
        confidence: 0.7
      };
    }
    
    if (message.includes('diabetes') || message.includes('blood sugar')) {
      return {
        answer: this.formatDiabetesInfo(),
        confidence: 0.7
      };
    }
    
    if (message.includes('nutrition') || message.includes('diet')) {
      return {
        answer: this.formatNutritionInfo(),
        confidence: 0.7
      };
    }
    
    return null;
  }

  /**
   * Format cardiovascular information
   */
  formatCardiovascularInfo() {
    const cv = this.medicalKnowledgeBase.cardiovascular;
    return `**Cardiovascular Health Information:**\n\n` +
           `**Normal Heart Rate:** ${cv.normalHeartRate.rest} at rest, ${cv.normalHeartRate.exercise} during exercise\n\n` +
           `**Blood Pressure Categories:**\n` +
           `- Normal: ${cv.bloodPressure.normal}\n` +
           `- Elevated: ${cv.bloodPressure.elevated}\n` +
           `- Stage 1 Hypertension: ${cv.bloodPressure.stage1}\n` +
           `- Stage 2 Hypertension: ${cv.bloodPressure.stage2}\n` +
           `- Hypertensive Crisis: ${cv.bloodPressure.crisis} (Emergency!)`;
  }

  /**
   * Format diabetes information
   */
  formatDiabetesInfo() {
    const db = this.medicalKnowledgeBase.diabetes;
    return `**Diabetes Information:**\n\n` +
           `**Common Symptoms:** ${db.symptoms.join(', ')}\n\n` +
           `**Blood Glucose Levels:**\n` +
           `- Normal Fasting: ${db.bloodGlucose.normal.fasting}\n` +
           `- Prediabetes: ${db.bloodGlucose.prediabetes.fasting}\n` +
           `- Diabetes: ${db.bloodGlucose.diabetes.fasting}\n\n` +
           `**HbA1c Levels:**\n` +
           `- Normal: ${db.hba1c.normal}\n` +
           `- Prediabetes: ${db.hba1c.prediabetes}\n` +
           `- Diabetes: ${db.hba1c.diabetes}`;
  }

  /**
   * Format nutrition information
   */
  formatNutritionInfo() {
    const nutrition = this.medicalKnowledgeBase.nutrition;
    return `**Nutrition Guidelines:**\n\n` +
           `**Macronutrients:**\n` +
           `- Carbohydrates: ${nutrition.macronutrients.carbohydrates}\n` +
           `- Protein: ${nutrition.macronutrients.protein}\n` +
           `- Fats: ${nutrition.macronutrients.fats}\n\n` +
           `**Daily Water Intake:** ${nutrition.water}`;
  }

  /**
   * General fallback responses
   */
  getGeneralResponse(message) {
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! I\'m your Medical AI Assistant. I can help you with health information, symptoms, nutrition, exercise, and general wellness questions. What would you like to know?';
    }
    
    if (message.includes('help')) {
      return 'I can assist you with:\n\n' +
             '- Health conditions (diabetes, heart disease, etc.)\n' +
             '- Nutrition and diet information\n' +
             '- Exercise recommendations\n' +
             '- Symptoms and first aid\n' +
             '- Mental health support\n' +
             '- Sleep and wellness tips\n\n' +
             'What specific topic interests you?';
    }
    
    return 'I\'m not sure I understand. Could you rephrase your question? I can help with topics like:\n' +
           '- Blood pressure and heart health\n' +
           '- Diabetes and blood sugar\n' +
           '- Nutrition and diet\n' +
           '- Exercise and fitness\n' +
           '- Sleep and mental health';
  }

  /**
   * Check if message is medical question
   */
  isMedicalQuestion(message) {
    const medicalKeywords = ['symptom', 'disease', 'pain', 'treatment', 'medicine', 'cure', 'diagnosis'];
    return medicalKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear conversation
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get suggested questions
   */
  getSuggestedQuestions() {
    return [
      'What is normal blood pressure?',
      'How much water should I drink?',
      'What are symptoms of diabetes?',
      'How much sleep do I need?',
      'What is a healthy BMI?',
      'How often should I exercise?',
      'What are signs of a heart attack?',
      'How can I reduce stress?'
    ];
  }
}

// Global instance
window.MedicalChatbot = new MedicalChatbot();
