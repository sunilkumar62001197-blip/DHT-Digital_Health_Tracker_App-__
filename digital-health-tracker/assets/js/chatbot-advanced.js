// Advanced AI Chatbot - ChatGPT/Gemini Style
// Conversational AI with context awareness and medical reasoning

class AdvancedMedicalChatbot {
  constructor() {
    this.conversationContext = [];
    this.userProfile = null;
    this.currentTopic = null;
    this.medicalKnowledge = null;
    this.conversationMode = 'general'; // general, diagnostic, advice, emergency
  }

  /**
   * Initialize advanced chatbot
   */
  async init() {
    console.log('[AdvancedChatbot] Initializing...');
    
    await this.loadMedicalKnowledge();
    await this.loadConversationalPatterns();
    this.loadUserProfile();
    
    console.log('[AdvancedChatbot] Ready for conversation');
    return true;
  }

  /**
   * Load comprehensive medical knowledge
   */
  async loadMedicalKnowledge() {
    this.medicalKnowledge = {
      // Expanded medical database with detailed information
      conditions: {
        diabetes: {
          description: "A metabolic disorder where the body cannot properly process glucose",
          types: ["Type 1 (autoimmune)", "Type 2 (insulin resistance)", "Gestational"],
          symptoms: [
            "Increased thirst and urination",
            "Unexplained weight loss",
            "Extreme fatigue",
            "Blurred vision",
            "Slow-healing wounds",
            "Frequent infections"
          ],
          causes: ["Genetics", "Obesity", "Sedentary lifestyle", "Age", "Family history"],
          diagnosis: ["Fasting blood glucose test", "HbA1c test", "Oral glucose tolerance test"],
          treatment: [
            "Blood sugar monitoring",
            "Insulin therapy (Type 1)",
            "Oral medications (Type 2)",
            "Diet modification",
            "Regular exercise",
            "Weight management"
          ],
          prevention: [
            "Maintain healthy weight",
            "Regular physical activity",
            "Healthy diet",
            "Limit sugar and refined carbs",
            "Regular screening if at risk"
          ],
          complications: ["Neuropathy", "Retinopathy", "Kidney disease", "Cardiovascular disease"],
          emergency: "Blood sugar <70 or >300 mg/dL requires immediate attention"
        },
        hypertension: {
          description: "A chronic condition where blood pressure is consistently elevated",
          categories: {
            normal: "<120/80 mmHg",
            elevated: "120-129/<80 mmHg",
            stage1: "130-139/80-89 mmHg",
            stage2: "≥140/≥90 mmHg",
            crisis: ">180/>120 mmHg"
          },
          symptoms: ["Often no symptoms (silent killer)", "Headaches", "Dizziness", "Vision problems", "Chest pain"],
          causes: [
            "Obesity",
            "High salt intake",
            "Stress",
            "Lack of exercise",
            "Genetics",
            "Smoking",
            "Excessive alcohol"
          ],
          treatment: [
            "Lifestyle modifications",
            "DASH diet",
            "Regular exercise",
            "Weight loss",
            "ACE inhibitors",
            "Beta blockers",
            "Diuretics"
          ],
          monitoring: "Home blood pressure monitoring recommended",
          target: "Generally <130/80 mmHg for most adults"
        },
        depression: {
          description: "A mental health disorder characterized by persistent sadness and loss of interest",
          symptoms: [
            "Persistent sad, anxious mood",
            "Loss of interest in activities",
            "Sleep disturbances",
            "Appetite changes",
            "Fatigue",
            "Difficulty concentrating",
            "Feelings of worthlessness",
            "Thoughts of death/suicide"
          ],
          types: ["Major depressive disorder", "Persistent depressive disorder", "Seasonal affective disorder"],
          screening: "PHQ-9 questionnaire (score 0-27)",
          treatment: [
            "Psychotherapy (CBT, IPT)",
            "Antidepressants (SSRIs, SNRIs)",
            "Exercise",
            "Light therapy (for seasonal)",
            "Support groups",
            "Mindfulness/meditation"
          ],
          emergency: "Call suicide prevention hotline if having thoughts of self-harm: 988 (US)"
        }
      },
      
      // Conversational responses database
      responses: {
        greeting: [
          "Hello! I'm your AI Medical Assistant. How can I help you today?",
          "Hi there! I'm here to help with your health questions. What would you like to know?",
          "Welcome! I can provide medical information and health guidance. What's on your mind?"
        ],
        acknowledgment: [
          "I understand. Let me help you with that.",
          "Got it. Here's what I can tell you about that.",
          "That's a great question. Let me provide some information."
        ],
        clarification: [
          "Could you provide more details about your symptoms?",
          "To give you the best answer, could you tell me more?",
          "I want to make sure I understand correctly. Can you elaborate?"
        ],
        followUp: [
          "Is there anything else you'd like to know about this?",
          "Do you have any other questions?",
          "Would you like me to explain anything further?"
        ],
        emergency: [
          "⚠️ This sounds urgent. Please call emergency services (911) immediately or go to the nearest emergency room.",
          "🚨 EMERGENCY: Please seek immediate medical attention. Call 911 or go to the ER now.",
          "⚠️ WARNING: This requires immediate professional medical care. Do not delay - call emergency services."
        ]
      },
      
      // Medical guidelines and recommendations
      guidelines: {
        bloodPressure: {
          frequency: "Check at least annually; more often if elevated",
          preparation: "Sit quietly for 5 minutes before measurement",
          technique: "Use proper cuff size, arm at heart level, feet flat on floor"
        },
        bloodSugar: {
          fasting: "Test after 8-12 hours without food",
          postprandial: "Test 2 hours after eating",
          frequency: "Daily for diabetics, annually for screening"
        },
        exercise: {
          aerobic: "150 min moderate or 75 min vigorous per week",
          strength: "2+ days per week, all major muscle groups",
          flexibility: "2-3 times per week",
          balance: "For older adults, include balance exercises"
        }
      }
    };
  }

  /**
   * Load conversational patterns for natural dialogue
   */
  async loadConversationalPatterns() {
    this.patterns = {
      symptomChecking: /(?:i have|i'm experiencing|i feel|symptom|pain|ache|hurt)/i,
      diagnosis: /(?:do i have|am i|could it be|is this|what is|diagnosis)/i,
      treatment: /(?:how to treat|treatment|cure|medicine|medication|what should i)/i,
      prevention: /(?:how to prevent|avoid|prevention|reduce risk)/i,
      emergency: /(?:emergency|urgent|severe|can't breathe|chest pain|unconscious|bleeding heavily)/i,
      measurement: /(?:normal|range|should be|healthy|ideal)/i,
      lifestyle: /(?:diet|exercise|sleep|stress|lifestyle|habit)/i
    };
  }

  /**
   * Load user profile for personalized responses
   */
  loadUserProfile() {
    if (typeof AuthSystem !== 'undefined' && AuthSystem.isAuthenticated()) {
      this.userProfile = AuthSystem.getCurrentUser();
    }
  }

  /**
   * Main chat function - process user message and generate response
   */
  async chat(userMessage) {
    // Add to conversation context
    this.conversationContext.push({
      role: 'user',
      message: userMessage,
      timestamp: Date.now()
    });
    
    // Analyze message intent
    const intent = this.analyzeIntent(userMessage);
    
    // Check for emergency
    if (intent.isEmergency) {
      return this.handleEmergency(userMessage);
    }
    
    // Generate contextual response
    const response = await this.generateResponse(userMessage, intent);
    
    // Add to context
    this.conversationContext.push({
      role: 'assistant',
      message: response.text,
      timestamp: Date.now(),
      intent: intent.primary,
      confidence: response.confidence
    });
    
    // Keep only last 10 messages for context
    if (this.conversationContext.length > 20) {
      this.conversationContext = this.conversationContext.slice(-20);
    }
    
    return response;
  }

  /**
   * Analyze user message intent using NLP patterns
   */
  analyzeIntent(message) {
    const lowercaseMsg = message.toLowerCase();
    const intent = {
      primary: 'general',
      secondary: [],
      isEmergency: false,
      confidence: 0
    };
    
    // Check for emergency keywords
    if (this.patterns.emergency.test(lowercaseMsg)) {
      intent.isEmergency = true;
      intent.primary = 'emergency';
      intent.confidence = 1.0;
      return intent;
    }
    
    // Check other intents
    const intentScores = {};
    
    for (const [intentName, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(lowercaseMsg)) {
        intentScores[intentName] = (intentScores[intentName] || 0) + 1;
      }
    }
    
    // Find primary intent
    let maxScore = 0;
    for (const [intentName, score] of Object.entries(intentScores)) {
      if (score > maxScore) {
        maxScore = score;
        intent.primary = intentName;
      } else if (score > 0) {
        intent.secondary.push(intentName);
      }
    }
    
    intent.confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3;
    
    return intent;
  }

  /**
   * Generate intelligent, contextual response
   */
  async generateResponse(message, intent) {
    let responseText = '';
    let confidence = intent.confidence;
    
    // Handle based on intent
    switch (intent.primary) {
      case 'symptomChecking':
        responseText = this.handleSymptomInquiry(message);
        break;
        
      case 'diagnosis':
        responseText = this.handleDiagnosisQuestion(message);
        break;
        
      case 'treatment':
        responseText = this.handleTreatmentQuestion(message);
        break;
        
      case 'prevention':
        responseText = this.handlePreventionQuestion(message);
        break;
        
      case 'measurement':
        responseText = this.handleMeasurementQuestion(message);
        break;
        
      case 'lifestyle':
        responseText = this.handleLifestyleQuestion(message);
        break;
        
      default:
        responseText = this.handleGeneralQuestion(message);
        confidence = 0.5;
    }
    
    // Add personalization if user profile available
    if (this.userProfile && Math.random() > 0.5) {
      responseText += this.addPersonalizedSuggestion();
    }
    
    // Add follow-up question
    responseText += '\n\n' + this.getRandomResponse('followUp');
    
    // Add disclaimer for medical topics
    responseText += '\n\n💡 *Note: This is general medical information. For specific health concerns, please consult a licensed healthcare professional.*';
    
    return {
      text: responseText,
      confidence: confidence,
      intent: intent.primary,
      timestamp: Date.now()
    };
  }

  /**
   * Handle emergency situations
   */
  handleEmergency(message) {
    return {
      text: this.getRandomResponse('emergency') + 
            '\n\n**Emergency Services:**\n' +
            '- US: 911\n' +
            '- India: 112\n' +
            '- UK: 999\n\n' +
            'Do not wait for a chatbot response in emergencies!',
      confidence: 1.0,
      intent: 'emergency',
      timestamp: Date.now(),
      isUrgent: true
    };
  }

  /**
   * Handle symptom-related inquiries
   */
  handleSymptomInquiry(message) {
    const symptoms = this.extractSymptoms(message);
    
    let response = this.getRandomResponse('acknowledgment') + '\n\n';
    
    if (symptoms.length > 0) {
      response += `Based on the symptoms you mentioned (${symptoms.join(', ')}), here's what I can tell you:\n\n`;
      
      // Find potential conditions
      const conditions = this.matchSymptomsToConditions(symptoms);
      
      if (conditions.length > 0) {
        response += '**Possible Related Conditions:**\n';
        conditions.forEach(condition => {
          response += `- ${condition.name}: ${condition.description}\n`;
        });
        
        response += '\n**Recommendations:**\n';
        response += '- Monitor your symptoms\n';
        response += '- Keep a log of when symptoms occur\n';
        response += '- Note any triggers\n';
        response += '- Consult a doctor if symptoms persist or worsen\n';
      }
    } else {
      response += 'I notice you\'re experiencing some symptoms. ';
      response += this.getRandomResponse('clarification');
      response += ' This will help me provide better information.';
    }
    
    return response;
  }

  /**
   * Handle diagnosis-related questions
   */
  handleDiagnosisQuestion(message) {
    let response = '**Medical Diagnosis:**\n\n';
    response += 'I cannot provide a medical diagnosis, as that requires professional medical examination. However, I can share information about conditions you're asking about.\n\n';
    
    // Extract condition name from question
    const conditions = this.extractConditionNames(message);
    
    if (conditions.length > 0) {
      const condition = conditions[0];
      const info = this.medicalKnowledge.conditions[condition];
      
      if (info) {
        response += `**${condition.charAt(0).toUpperCase() + condition.slice(1)}:**\n\n`;
        response += `${info.description}\n\n`;
        response += `**Common Symptoms:**\n${info.symptoms.map(s => '- ' + s).join('\n')}\n\n`;
        response += `**Diagnosis Methods:**\n${info.diagnosis.map(d => '- ' + d).join('\n')}`;
      }
    } else {
      response += 'Could you specify which condition you\'d like to learn about?';
    }
    
    return response;
  }

  /**
   * Handle treatment-related questions
   */
  handleTreatmentQuestion(message) {
    const conditions = this.extractConditionNames(message);
    
    let response = '**Treatment Information:**\n\n';
    
    if (conditions.length > 0) {
      const condition = conditions[0];
      const info = this.medicalKnowledge.conditions[condition];
      
      if (info && info.treatment) {
        response += `**Treatment for ${condition.charAt(0).toUpperCase() + condition.slice(1)}:**\n\n`;
        response += info.treatment.map(t => '• ' + t).join('\n');
        response += '\n\n⚠️ **Important:** Treatment plans should be prescribed by a healthcare provider based on individual assessment.';
      }
    } else {
      response += 'I can provide treatment information for various conditions. Which condition are you interested in learning about?';
    }
    
    return response;
  }

  /**
   * Handle prevention-related questions
   */
  handlePreventionQuestion(message) {
    const conditions = this.extractConditionNames(message);
    
    let response = '**Prevention Strategies:**\n\n';
    
    if (conditions.length > 0 && this.medicalKnowledge.conditions[conditions[0]]?.prevention) {
      const prevention = this.medicalKnowledge.conditions[conditions[0]].prevention;
      response += prevention.map(p => '✓ ' + p).join('\n');
    } else {
      response += '**General Health Prevention:**\n';
      response += '✓ Maintain healthy weight\n';
      response += '✓ Regular exercise (150 min/week)\n';
      response += '✓ Balanced diet\n';
      response += '✓ Adequate sleep (7-9 hours)\n';
      response += '✓ Stress management\n';
      response += '✓ Regular health screenings\n';
      response += '✓ Avoid smoking and excessive alcohol';
    }
    
    return response;
  }

  /**
   * Handle measurement/normal range questions
   */
  handleMeasurementQuestion(message) {
    let response = '**Normal Health Measurements:**\n\n';
    
    if (message.toLowerCase().includes('blood pressure') || message.toLowerCase().includes('bp')) {
      response += '**Blood Pressure:**\n';
      response += '- Normal: <120/80 mmHg\n';
      response += '- Elevated: 120-129/<80 mmHg\n';
      response += '- Stage 1 Hypertension: 130-139/80-89 mmHg\n';
      response += '- Stage 2 Hypertension: ≥140/≥90 mmHg\n';
    } else if (message.toLowerCase().includes('blood sugar') || message.toLowerCase().includes('glucose')) {
      response += '**Blood Glucose:**\n';
      response += '- Normal Fasting: <100 mg/dL\n';
      response += '- Prediabetes: 100-125 mg/dL\n';
      response += '- Diabetes: ≥126 mg/dL\n';
      response += '- HbA1c Normal: <5.7%\n';
    } else {
      response += '**Common Measurements:**\n';
      response += '- Blood Pressure: <120/80 mmHg\n';
      response += '- Heart Rate: 60-100 bpm (rest)\n';
      response += '- Blood Glucose: <100 mg/dL (fasting)\n';
      response += '- BMI: 18.5-24.9 kg/m²\n';
      response += '- Cholesterol: <200 mg/dL\n';
    }
    
    return response;
  }

  /**
   * Handle lifestyle-related questions
   */
  handleLifestyleQuestion(message) {
    let response = '**Healthy Lifestyle Recommendations:**\n\n';
    
    if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('nutrition')) {
      response += '**Nutrition:**\n';
      response += '- Eat variety of fruits and vegetables (5+ servings/day)\n';
      response += '- Choose whole grains over refined\n';
      response += '- Include lean proteins\n';
      response += '- Limit saturated fats and trans fats\n';
      response += '- Reduce sodium intake (<2,300mg/day)\n';
      response += '- Stay hydrated (8-10 glasses water/day)\n';
    } else if (message.toLowerCase().includes('exercise') || message.toLowerCase().includes('workout')) {
      response += this.medicalKnowledge.guidelines.exercise.aerobic + '\n';
      response += '**Types of Exercise:**\n';
      response += '- Aerobic: Walking, jogging, swimming, cycling\n';
      response += '- Strength: Weight training, resistance bands\n';
      response += '- Flexibility: Yoga, stretching\n';
      response += '- Balance: Tai chi (especially for older adults)\n';
    } else if (message.toLowerCase().includes('sleep')) {
      response += '**Sleep Hygiene:**\n';
      response += '- Get 7-9 hours of sleep\n';
      response += '- Maintain consistent sleep schedule\n';
      response += '- Create dark, quiet, cool bedroom\n';
      response += '- Avoid screens 1 hour before bed\n';
      response += '- Limit caffeine after 2 PM\n';
    } else {
      response += '**General Wellness Tips:**\n';
      response += '- Regular exercise\n';
      response += '- Balanced nutrition\n';
      response += '- Adequate sleep\n';
      response += '- Stress management\n';
      response += '- Social connections\n';
      response += '- Regular health check-ups\n';
    }
    
    return response;
  }

  /**
   * Handle general questions
   */
  handleGeneralQuestion(message) {
    // Try to find relevant keywords
    const keywords = this.extractMedicalKeywords(message);
    
    if (keywords.length === 0) {
      return this.getRandomResponse('greeting') + '\n\nI can help you with:\n' +
             '- Symptoms and conditions\n' +
             '- Treatment information\n' +
             '- Prevention strategies\n' +
             '- Normal health measurements\n' +
             '- Lifestyle and wellness advice\n\n' +
             'What would you like to know about?';
    }
    
    return `I understand you're asking about ${keywords.join(', ')}. ` +
           this.getRandomResponse('clarification');
  }

  /**
   * Extract symptoms from user message
   */
  extractSymptoms(message) {
    const symptomKeywords = [
      'pain', 'ache', 'fever', 'cough', 'headache', 'nausea', 'fatigue',
      'dizziness', 'shortness of breath', 'chest pain', 'abdominal pain'
    ];
    
    return symptomKeywords.filter(symptom => 
      message.toLowerCase().includes(symptom)
    );
  }

  /**
   * Extract condition names from message
   */
  extractConditionNames(message) {
    const lowerMsg = message.toLowerCase();
    return Object.keys(this.medicalKnowledge.conditions).filter(condition =>
      lowerMsg.includes(condition)
    );
  }

  /**
   * Extract medical keywords
   */
  extractMedicalKeywords(message) {
    const medicalKeywords = [
      'health', 'medical', 'doctor', 'hospital', 'medicine', 'treatment',
      'diagnosis', 'symptom', 'disease', 'condition', 'wellness'
    ];
    
    return medicalKeywords.filter(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Match symptoms to potential conditions
   */
  matchSymptomsToConditions(symptoms) {
    const matches = [];
    
    for (const [name, info] of Object.entries(this.medicalKnowledge.conditions)) {
      let matchCount = 0;
      for (const symptom of symptoms) {
        if (info.symptoms.some(s => s.toLowerCase().includes(symptom))) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        matches.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description: info.description,
          matchScore: matchCount
        });
      }
    }
    
    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  /**
   * Add personalized suggestion based on user profile
   */
  addPersonalizedSuggestion() {
    if (!this.userProfile || !this.userProfile.healthData) return '';
    
    const suggestions = [];
    const health = this.userProfile.healthData;
    
    if (health.bmi && health.bmi > 25) {
      suggestions.push('\n\n💪 **Personal Tip:** Based on your BMI, consider increasing physical activity to 300+ min/week for weight management.');
    }
    
    if (health.smoker) {
      suggestions.push('\n\n🚭 **Personal Tip:** Quitting smoking can significantly reduce your health risks. Consider a smoking cessation program.');
    }
    
    return suggestions[Math.floor(Math.random() * suggestions.length)] || '';
  }

  /**
   * Get random response from category
   */
  getRandomResponse(category) {
    const responses = this.medicalKnowledge.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationContext;
  }

  /**
   * Clear conversation
   */
  clearConversation() {
    this.conversationContext = [];
    this.currentTopic = null;
  }

  /**
   * Get suggested questions based on conversation
   */
  getSuggestedQuestions() {
    if (this.currentTopic) {
      return [
        `Tell me more about ${this.currentTopic}`,
        `How to prevent ${this.currentTopic}?`,
        `What are treatment options for ${this.currentTopic}?`
      ];
    }
    
    return [
      'What is normal blood pressure?',
      'How can I improve my sleep?',
      'What are symptoms of diabetes?',
      'How much exercise do I need?',
      'What is a healthy diet?',
      'How to reduce stress?'
    ];
  }
}

// Global instance
window.AdvancedMedicalChatbot = new AdvancedMedicalChatbot();
