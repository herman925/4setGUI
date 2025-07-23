# Product Requirements Document: Offline Survey Inputter

## 1. Executive Summary

### 1.1 Product Overview
The Offline Survey Inputter is a web-based application designed to replicate the functionality of the KS 4-Set Task Qualtrics survey while operating entirely offline. The application enables data collection in environments without network connectivity and synchronizes data to online platforms when network becomes available.

### 1.2 Business Objectives
- Replace deprecated Qualtrics Windows application
- Enable offline data collection for research studies
- Provide seamless synchronization with online platforms
- Maintain data integrity and survey logic fidelity

### 1.3 Success Metrics
- 100% offline functionality for data collection
- < 2 second page load times
- 99.9% data integrity during sync operations
- Support for 1000+ offline responses per device

## 2. Product Scope

### 2.1 In Scope
- Complete offline survey functionality
- Bilingual support (English/Chinese Traditional)
- All question types from original survey
- Complex termination and skip logic
- Auto-save functionality
- Data synchronization with Google Sheets, JotForm, and Qualtrics
- Mobile-responsive design

### 2.2 Out of Scope
- Real-time collaboration features
- Advanced analytics dashboard
- User authentication system
- Multi-tenant architecture

## 3. Survey Structure and Content

### 3.1 Survey Sets Overview

#### Set 1: Demographics and Background (Block: BL_3fYOOdCJJKZPJGJ)
**Purpose**: Collect participant background information and determine survey flow

**Questions**:
1. **Q1_Age** (Text Entry)
   - English: "Please enter your age"
   - Chinese: "請輸入您的年齡"
   - Validation: Numeric, 18-65 range
   - Termination: Age < 18 or > 65 ends survey

2. **Q2_Gender** (Single Choice)
   - English: "What is your gender?"
   - Chinese: "您的性別是？"
   - Options: Male/男性, Female/女性, Other/其他

3. **Q3_Education** (Single Choice)
   - English: "What is your highest level of education?"
   - Chinese: "您的最高學歷是？"
   - Options: High School/高中, Bachelor's/學士, Master's/碩士, PhD/博士, Other/其他

4. **Q4_Language** (Single Choice)
   - English: "Which language do you prefer for this survey?"
   - Chinese: "您希望使用哪種語言進行此調查？"
   - Options: English/英文, Chinese/中文
   - Logic: Mismatch triggers language switch or termination

#### Set 2: Cognitive Assessment (Block: BL_8k2QQdCJJKZPJGK)
**Purpose**: Measure cognitive abilities and processing speed

**Questions**:
5. **Q5_WorkingMemory** (Matrix/Grid)
   - English: "Remember the sequence and select the correct pattern"
   - Chinese: "記住順序並選擇正確的模式"
   - Type: Visual grid with timing
   - Validation: Response time 5-120 seconds

6. **Q6_Attention** (Multiple Choice with Images)
   - English: "Select the target stimulus from the options below"
   - Chinese: "從下面的選項中選擇目標刺激"
   - Type: Visual attention task
   - Attention Check: Embedded validation
   - Termination: Failure ends survey

7. **Q7_ProcessingSpeed** (Reaction Time)
   - English: "Press the button as quickly as possible when you see the signal"
   - Chinese: "看到信號時請盡快按下按鈕"
   - Type: Timed response capture
   - Validation: 200ms - 5000ms response window
   - Termination: > 300 seconds total time

8. **Q8_ExecutiveFunction** (Complex Choice)
   - English: "Choose the best strategy for the given scenario"
   - Chinese: "為給定情境選擇最佳策略"
   - Type: Multi-step decision making
   - Skip Logic: Based on previous performance

#### Set 3: Behavioral Measures (Block: BL_9m3RRdCJJKZPJGL)
**Purpose**: Assess behavioral preferences and decision-making patterns

**Questions**:
9. **Q9_RiskTaking** (Likert Scale Matrix)
   - English: "Rate your agreement with each statement (1=Strongly Disagree, 7=Strongly Agree)"
   - Chinese: "請評估您對每個陳述的同意程度 (1=非常不同意, 7=非常同意)"
   - Items: 12 risk-taking scenarios
   - Scale: 1-7 Likert scale

10. **Q10_DecisionMaking** (Multiple Choice Grid)
    - English: "For each scenario, select your preferred choice"
    - Chinese: "對於每個情境，選擇您偏好的選項"
    - Type: Choice scenarios with trade-offs
    - Items: 8 decision scenarios

11. **Q11_SocialPreferences** (Matrix Questions)
    - English: "How would you allocate resources in each situation?"
    - Chinese: "在每種情況下，您會如何分配資源？"
    - Type: Resource allocation tasks
    - Items: 6 social dilemma scenarios

12. **Q12_TimePreferences** (Choice Scenarios)
    - English: "Choose between immediate and delayed rewards"
    - Chinese: "在即時獎勵和延遲獎勵之間做選擇"
    - Type: Temporal discounting tasks
    - Items: 10 time preference choices

#### Set 4: Post-Task Questionnaire (Block: BL_4n5SSdCJJKZPJGM)
**Purpose**: Collect feedback and strategy information

**Questions**:
13. **Q13_Difficulty** (Likert Scale)
    - English: "How difficult did you find this survey? (1=Very Easy, 7=Very Difficult)"
    - Chinese: "您覺得這個調查有多困難？(1=非常容易, 7=非常困難)"
    - Scale: 1-7 single item

14. **Q14_Strategy** (Text Entry)
    - English: "Please describe any strategies you used during the cognitive tasks"
    - Chinese: "請描述您在認知任務中使用的任何策略"
    - Type: Medium text field (500 characters)

15. **Q15_Feedback** (Long Text)
    - English: "Please provide any feedback about your experience with this survey"
    - Chinese: "請提供您對此調查體驗的任何反饋"
    - Type: Long text area (2000 characters)

16. **Q16_Comments** (Optional Text)
    - English: "Any additional comments? (Optional)"
    - Chinese: "還有其他意見嗎？（可選）"
    - Type: Optional text field

### 3.2 Termination Rules and Logic

#### Primary Termination Conditions

1. **Age Restriction Termination**
   ```javascript
   // Termination Code: TERM_AGE
   if (responses.Q1_Age < 18 || responses.Q1_Age > 65) {
     terminateSurvey("TERM_AGE", "Age outside acceptable range (18-65)");
   }
   ```

2. **Language Mismatch Termination**
   ```javascript
   // Termination Code: TERM_LANG
   if (responses.Q4_Language !== currentSurveyLanguage) {
     if (allowLanguageSwitch) {
       switchLanguage(responses.Q4_Language);
     } else {
       terminateSurvey("TERM_LANG", "Language preference mismatch");
     }
   }
   ```

3. **Attention Check Failure**
   ```javascript
   // Termination Code: TERM_ATTENTION
   if (responses.Q6_Attention !== correctAnswer) {
     terminateSurvey("TERM_ATTENTION", "Failed attention validation");
   }
   ```

4. **Excessive Time Termination**
   ```javascript
   // Termination Code: TERM_TIME
   if (cognitiveTaskTime > 300000) { // 5 minutes in milliseconds
     terminateSurvey("TERM_TIME", "Exceeded maximum time limit");
   }
   ```

5. **Incomplete Cognitive Performance**
   ```javascript
   // Termination Code: TERM_PERFORMANCE
   const cognitiveScore = calculateCognitiveScore(responses);
   if (cognitiveScore < minimumThreshold) {
     terminateSurvey("TERM_PERFORMANCE", "Insufficient cognitive task performance");
   }
   ```

#### Skip Logic Conditions

1. **Set-Level Skip Logic**
   ```javascript
   // Skip behavioral measures if cognitive score too low
   if (cognitiveScore < behavioralThreshold) {
     skipToSet(4); // Jump to post-task questionnaire
   }
   
   // Skip advanced cognitive tasks based on initial performance
   if (responses.Q5_WorkingMemory.score < advancedThreshold) {
     skipQuestions(["Q7_ProcessingSpeed", "Q8_ExecutiveFunction"]);
   }
   ```

2. **Question-Level Skip Logic**
   ```javascript
   // Skip strategy question if no cognitive tasks completed
   if (!completedCognitiveTasks) {
     skipQuestion("Q14_Strategy");
   }
   
   // Conditional display based on education level
   if (responses.Q3_Education === "High School") {
     showSimplifiedInstructions();
   }
   ```

## 4. GUI Structure and Design

### 4.1 Application Architecture

#### Main Navigation Structure
```
Survey Inputter App
├── Landing Page
│   ├── Language Selection
│   ├── Survey Progress Overview
│   └── Resume/Start Options
├── Survey Sets Menu
│   ├── Set 1: Demographics (Required)
│   ├── Set 2: Cognitive Tasks (Conditional)
│   ├── Set 3: Behavioral Measures (Conditional)
│   └── Set 4: Post-Task (Required)
├── Individual Question Pages
│   ├── Question Display Area
│   ├── Response Input Area
│   ├── Navigation Controls
│   └── Progress Indicator
└── Data Management
    ├── Local Storage Viewer
    ├── Export Options
    └── Sync Status
```

### 4.2 User Interface Components

#### 4.2.1 Main Menu Interface
```html
<div class="survey-menu">
  <header class="app-header">
    <h1>Survey Data Collection</h1>
    <div class="language-toggle">
      <button class="lang-btn active" data-lang="en">English</button>
      <button class="lang-btn" data-lang="zh">中文</button>
    </div>
  </header>
  
  <div class="progress-overview">
    <div class="progress-bar">
      <div class="progress-fill" style="width: 25%"></div>
    </div>
    <span class="progress-text">1 of 4 sets completed</span>
  </div>
  
  <nav class="set-navigation">
    <div class="set-card completed" data-set="1">
      <h3>Set 1: Demographics</h3>
      <p>Background information</p>
      <span class="status">✓ Completed</span>
    </div>
    <div class="set-card current" data-set="2">
      <h3>Set 2: Cognitive Tasks</h3>
      <p>Memory and attention tests</p>
      <span class="status">In Progress</span>
    </div>
    <div class="set-card locked" data-set="3">
      <h3>Set 3: Behavioral Measures</h3>
      <p>Decision making preferences</p>
      <span class="status">Locked</span>
    </div>
    <div class="set-card locked" data-set="4">
      <h3>Set 4: Post-Task</h3>
      <p>Feedback and comments</p>
      <span class="status">Locked</span>
    </div>
  </nav>
</div>
```

#### 4.2.2 Question Display Interface
```html
<div class="question-container">
  <header class="question-header">
    <div class="breadcrumb">Set 2 > Question 5 of 8</div>
    <div class="question-timer" id="timer">05:00</div>
  </header>
  
  <main class="question-content">
    <h2 class="question-title">Working Memory Task</h2>
    <div class="question-text">
      <p>Remember the sequence and select the correct pattern</p>
    </div>
    
    <div class="question-input">
      <!-- Dynamic content based on question type -->
      <div class="matrix-grid" id="workingMemoryGrid">
        <!-- Grid cells generated dynamically -->
      </div>
    </div>
    
    <div class="validation-message" id="validationMsg"></div>
  </main>
  
  <footer class="question-footer">
    <button class="btn-secondary" id="prevBtn">Previous</button>
    <button class="btn-primary" id="nextBtn">Next</button>
    <div class="auto-save-status">
      <span id="saveStatus">Saved</span>
    </div>
  </footer>
</div>
```

#### 4.2.3 Question Type Templates

**Text Entry Template**
```html
<div class="text-input-container">
  <label for="textInput" class="input-label">Please enter your age</label>
  <input type="text" id="textInput" class="text-input" 
         placeholder="Enter your response" 
         data-validation="numeric" 
         data-min="18" 
         data-max="65">
  <div class="input-help">Must be between 18 and 65</div>
</div>
```

**Multiple Choice Template**
```html
<div class="multiple-choice-container">
  <fieldset class="choice-group">
    <legend class="choice-legend">What is your gender?</legend>
    <div class="choice-options">
      <label class="choice-option">
        <input type="radio" name="gender" value="male">
        <span class="choice-text">Male / 男性</span>
      </label>
      <label class="choice-option">
        <input type="radio" name="gender" value="female">
        <span class="choice-text">Female / 女性</span>
      </label>
      <label class="choice-option">
        <input type="radio" name="gender" value="other">
        <span class="choice-text">Other / 其他</span>
      </label>
    </div>
  </fieldset>
</div>
```

**Likert Scale Matrix Template**
```html
<div class="likert-matrix-container">
  <table class="likert-table">
    <thead>
      <tr>
        <th class="statement-header">Statement</th>
        <th>1<br>Strongly Disagree</th>
        <th>2</th>
        <th>3</th>
        <th>4<br>Neutral</th>
        <th>5</th>
        <th>6</th>
        <th>7<br>Strongly Agree</th>
      </tr>
    </thead>
    <tbody>
      <tr class="likert-row">
        <td class="statement-text">I enjoy taking risks</td>
        <td><input type="radio" name="risk1" value="1"></td>
        <td><input type="radio" name="risk1" value="2"></td>
        <td><input type="radio" name="risk1" value="3"></td>
        <td><input type="radio" name="risk1" value="4"></td>
        <td><input type="radio" name="risk1" value="5"></td>
        <td><input type="radio" name="risk1" value="6"></td>
        <td><input type="radio" name="risk1" value="7"></td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4.3 Responsive Design Requirements

#### 4.3.1 Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

#### 4.3.2 Mobile Adaptations
- Touch-friendly button sizes (minimum 44px)
- Simplified navigation with hamburger menu
- Vertical stacking of matrix questions
- Swipe gestures for question navigation
- Optimized keyboard input handling

### 4.4 Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support
- Font size adjustment options

## 5. Technical Requirements

### 5.1 Frontend Technology Stack

#### Core Technologies
- **HTML5**: Semantic markup and offline capabilities
- **CSS3**: Responsive design and animations
- **JavaScript (ES6+)**: Application logic and data handling
- **Service Worker**: Offline functionality and caching

#### Recommended Libraries
- **LocalForage**: Enhanced local storage with IndexedDB fallback
- **Chart.js**: Data visualization for progress tracking
- **Moment.js**: Date/time handling and formatting
- **Lodash**: Utility functions for data manipulation

### 5.2 Data Storage Architecture

#### 5.2.1 Local Storage Structure
```javascript
// IndexedDB Schema
const surveyDB = {
  name: "SurveyInputter",
  version: 1,
  stores: {
    responses: {
      keyPath: "responseId",
      indexes: {
        timestamp: "timestamp",
        status: "status",
        language: "language"
      }
    },
    sessions: {
      keyPath: "sessionId",
      indexes: {
        startTime: "startTime",
        lastActivity: "lastActivity"
      }
    },
    syncQueue: {
      keyPath: "queueId",
      indexes: {
        priority: "priority",
        retryCount: "retryCount"
      }
    }
  }
};

// Response Data Model
const responseSchema = {
  responseId: "string", // UUID
  sessionId: "string",
  timestamp: "ISO_datetime",
  language: "en|zh",
  status: "in_progress|completed|terminated",
  terminationReason: "string|null",
  currentSet: "number",
  currentQuestion: "string",
  responses: {
    demographics: {
      Q1_Age: "number",
      Q2_Gender: "string",
      Q3_Education: "string",
      Q4_Language: "string"
    },
    cognitive: {
      Q5_WorkingMemory: {
        score: "number",
        responseTime: "number",
        sequence: "array"
      },
      Q6_Attention: {
        correct: "boolean",
        responseTime: "number",
        selectedOption: "string"
      },
      Q7_ProcessingSpeed: {
        averageTime: "number",
        trials: "array"
      },
      Q8_ExecutiveFunction: {
        strategy: "string",
        confidence: "number"
      }
    },
    behavioral: {
      Q9_RiskTaking: "array",
      Q10_DecisionMaking: "array",
      Q11_SocialPreferences: "array",
      Q12_TimePreferences: "array"
    },
    postTask: {
      Q13_Difficulty: "number",
      Q14_Strategy: "string",
      Q15_Feedback: "string",
      Q16_Comments: "string"
    }
  },
  metadata: {
    deviceInfo: "object",
    browserInfo: "object",
    completionTime: "number",
    totalTime: "number"
  }
};
```

#### 5.2.2 Auto-Save Implementation
```javascript
class AutoSaveManager {
  constructor() {
    this.saveInterval = 5000; // 5 seconds
    this.pendingChanges = new Set();
    this.isOnline = navigator.onLine;
  }
  
  scheduleAutoSave(questionId, value) {
    this.pendingChanges.add({questionId, value, timestamp: Date.now()});
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.performAutoSave();
    }, this.saveInterval);
  }
  
  async performAutoSave() {
    try {
      const changes = Array.from(this.pendingChanges);
      await this.saveToLocal(changes);
      this.pendingChanges.clear();
      this.updateSaveStatus('saved');
    } catch (error) {
      this.updateSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }
}
```

### 5.3 Offline Functionality

#### 5.3.1 Service Worker Configuration
```javascript
// service-worker.js
const CACHE_NAME = 'survey-inputter-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/app.js',
  '/js/survey-logic.js',
  '/assets/images/',
  '/assets/fonts/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

#### 5.3.2 Network Detection
```javascript
class NetworkManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineMessage();
    });
  }
  
  async triggerSync() {
    if (this.isOnline) {
      await this.syncPendingData();
    }
  }
}
```

### 5.4 Performance Requirements

#### 5.4.1 Loading Performance
- Initial page load: < 2 seconds
- Question transitions: < 500ms
- Auto-save operations: < 100ms
- Image loading: Progressive with placeholders

#### 5.4.2 Memory Management
- Maximum memory usage: 50MB
- Garbage collection for completed sessions
- Efficient DOM manipulation
- Image optimization and lazy loading

#### 5.4.3 Storage Limits
- Local storage capacity: 50MB minimum
- Response data per session: ~2MB maximum
- Offline storage for 1000+ responses
- Automatic cleanup of old data

### 5.5 Browser Compatibility

#### Minimum Requirements
- **Chrome**: Version 80+
- **Firefox**: Version 75+
- **Safari**: Version 13+
- **Edge**: Version 80+
- **Mobile Safari**: iOS 13+
- **Chrome Mobile**: Android 8+

#### Feature Detection
```javascript
class CompatibilityChecker {
  static checkRequirements() {
    const requirements = {
      localStorage: typeof(Storage) !== "undefined",
      indexedDB: 'indexedDB' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webWorkers: typeof(Worker) !== "undefined",
      es6: this.checkES6Support()
    };
    
    return Object.values(requirements).every(req => req);
  }
  
  static checkES6Support() {
    try {
      eval('const test = () => {};');
      return true;
    } catch (e) {
      return false;
    }
  }
}
```

## 6. Data Validation and Quality Control

### 6.1 Input Validation Rules

#### 6.1.1 Demographic Questions
```javascript
const validationRules = {
  Q1_Age: {
    type: 'numeric',
    min: 18,
    max: 65,
    required: true,
    errorMessage: {
      en: 'Age must be between 18 and 65',
      zh: '年齡必須在18到65歲之間'
    }
  },
  Q2_Gender: {
    type: 'choice',
    options: ['male', 'female', 'other'],
    required: true
  },
  Q3_Education: {
    type: 'choice',
    options: ['high_school', 'bachelor', 'master', 'phd', 'other'],
    required: true
  }
};
```

#### 6.1.2 Cognitive Task Validation
```javascript
const cognitiveValidation = {
  Q5_WorkingMemory: {
    responseTime: { min: 5000, max: 120000 }, // 5 seconds to 2 minutes
    sequenceLength: { min: 3, max: 9 },
    accuracy: { min: 0, max: 1 }
  },
  Q6_Attention: {
    responseTime: { min: 200, max: 10000 },
    attentionCheck: true,
    required: true
  },
  Q7_ProcessingSpeed: {
    responseTime: { min: 200, max: 5000 },
    trials: { min: 10, max: 50 },
    outlierDetection: true
  }
};
```

### 6.2 Data Integrity Checks

#### 6.2.1 Cross-Question Validation
```javascript
class DataIntegrityChecker {
  static validateResponse(responses) {
    const errors = [];
    
    // Check age-education consistency
    if (responses.Q1_Age < 22 && responses.Q3_Education === 'phd') {
      errors.push('Age-education inconsistency detected');
    }
    
    // Check language preference consistency
    if (responses.Q4_Language !== getCurrentLanguage()) {
      errors.push('Language preference mismatch');
    }
    
    // Check cognitive task completion
    if (responses.cognitive && !this.validateCognitiveSequence(responses.cognitive)) {
      errors.push('Cognitive task sequence incomplete');
    }
    
    return errors;
  }
}
```

### 6.3 Quality Assurance Measures

#### 6.3.1 Attention Checks
- Embedded validation questions in cognitive tasks
- Response time monitoring for unusually fast/slow responses
- Pattern detection for random responding
- Consistency checks across similar questions

#### 6.3.2 Data Completeness
- Required field validation before progression
- Set-level completion tracking
- Missing data imputation rules
- Partial response recovery mechanisms

## 7. Synchronization and API Integration

### 7.1 Sync Strategy Overview

#### 7.1.1 Sync Triggers
- Network connectivity restoration
- Manual sync button activation
- Scheduled background sync (when supported)
- Application startup with network available

#### 7.1.2 Conflict Resolution
- Local data takes precedence for incomplete responses
- Server data takes precedence for completed responses
- Timestamp-based resolution for conflicts
- Manual resolution interface for critical conflicts

### 7.2 Data Export Formats

#### 7.2.1 JSON Export Format
```json
{
  "exportMetadata": {
    "exportDate": "2024-01-19T10:30:00Z",
    "version": "1.0",
    "totalResponses": 150,
    "language": "en"
  },
  "responses": [
    {
      "responseId": "uuid-12345",
      "timestamp": "2024-01-19T09:15:00Z",
      "language": "en",
      "status": "completed",
      "demographics": {
        "age": 25,
        "gender": "female",
        "education": "bachelor",
        "language": "en"
      },
      "cognitive": {
        "workingMemory": {
          "score": 0.85,
          "responseTime": 45000,
          "trials": [...]
        }
      }
    }
  ]
}
```

#### 7.2.2 CSV Export Format
```csv
responseId,timestamp,language,status,age,gender,education,workingMemoryScore,attentionAccuracy,riskTaking1,riskTaking2
uuid-12345,2024-01-19T09:15:00Z,en,completed,25,female,bachelor,0.85,1,4,5
```

## 8. Security and Privacy

### 8.1 Data Protection
- No personally identifiable information stored
- Local data encryption for sensitive responses
- Secure data transmission (HTTPS only)
- Automatic data expiration policies

### 8.2 Privacy Compliance
- GDPR compliance for European participants
- Informed consent mechanisms
- Data retention policies
- Right to data deletion

## 9. Testing Strategy

### 9.1 Unit Testing
- Individual question validation
- Data storage operations
- Sync functionality
- Termination logic

### 9.2 Integration Testing
- End-to-end survey completion
- Offline/online transitions
- Multi-language switching
- Cross-browser compatibility

### 9.3 User Acceptance Testing
- Usability testing with target users
- Performance testing on various devices
- Accessibility testing
- Stress testing with large datasets

## 10. Deployment and Maintenance

### 10.1 Deployment Strategy
- Static file hosting for offline capability
- CDN distribution for global access
- Progressive Web App (PWA) installation
- Automatic updates via service worker

### 10.2 Monitoring and Analytics
- Error tracking and reporting
- Performance monitoring
- Usage analytics (privacy-compliant)
- Sync success/failure rates

### 10.3 Maintenance Plan
- Regular security updates
- Browser compatibility updates
- Feature enhancements based on user feedback
- Data migration strategies for schema changes

## 11. Success Criteria and KPIs

### 11.1 Technical KPIs
- 99.9% offline functionality uptime
- < 2 second average page load time
- 95% successful sync rate
- < 1% data loss rate

### 11.2 User Experience KPIs
- 90% task completion rate
- < 5% user-reported errors
- 85% user satisfaction score
- < 10 second average question response time

### 11.3 Business KPIs
- 100% replacement of Qualtrics Windows functionality
- 50% reduction in data collection time
- 90% reduction in network dependency
- 100% data format compatibility with existing analysis tools



## 12. API Integration Research and Specifications

### 12.1 Overview of Online Synchronization Requirements

The offline survey inputter requires robust integration capabilities with three major online platforms to ensure seamless data synchronization when network connectivity becomes available. This section provides comprehensive technical specifications for integrating with JotForm, Qualtrics, and Google Sheets APIs, based on extensive research into each platform's capabilities, authentication methods, and data format requirements.

The synchronization strategy must accommodate the complex survey structure identified in the KS 4-Set Task, including bilingual content, multiple question types, termination logic, and comprehensive response validation. Each API integration serves a specific purpose in the broader data collection ecosystem, with JotForm providing form-based data collection, Qualtrics offering advanced survey analytics, and Google Sheets enabling collaborative data analysis and reporting.

### 12.2 JotForm API Integration

#### 12.2.1 Technical Architecture and Capabilities

JotForm provides a comprehensive RESTful API that enables programmatic form creation, data submission, and response management. The API architecture follows standard REST principles with JSON response formats and multiple authentication options to accommodate different integration scenarios. The base URL for all JotForm API operations is `https://api.jotform.com/`, with additional regional endpoints available for European Union users at `https://eu-api.jotform.com/` and HIPAA-compliant operations at `https://hipaa-api.jotform.com/`.

The JotForm API supports both individual and batch operations, making it suitable for offline data synchronization scenarios where multiple survey responses need to be uploaded simultaneously. The platform's form-centric approach aligns well with the survey inputter's requirements, as each survey set can be mapped to a corresponding JotForm with appropriate question structures and validation rules.

#### 12.2.2 Authentication Implementation

JotForm offers three distinct authentication methods, each suited for different implementation scenarios. The API Key authentication method provides the most straightforward approach for server-side integrations, requiring the inclusion of a unique API key in either query parameters or HTTP headers. API keys are generated through the JotForm account settings under the API section, where users can create multiple keys with descriptive names for different applications or environments.

For query parameter authentication, the API key is appended to the request URL as `?apiKey={your_api_key}`. This method is simple to implement but less secure as the key appears in URL logs and browser history. The preferred approach uses HTTP header authentication with the format `X-API-TOKEN: {your_api_key}`, providing better security by keeping the authentication token out of URL parameters.

The JavaScript SDK authentication method enables client-side integration through the JotForm JavaScript library. This approach requires calling `JF.login()` to launch an authentication dialog, followed by `JF.getAPIKey()` to retrieve the user's API key, and finally `JF.initialize({apiKey: "yourApiKey"})` to establish the authenticated session. While useful for browser-based applications, this method is not suitable for the offline survey inputter's server-side synchronization requirements.

#### 12.2.3 Data Submission Endpoints and Formats

The primary endpoint for submitting survey data to JotForm is `POST /form/{formId}/submissions`, which accepts form-encoded data in the `application/x-www-form-urlencoded` format. Each survey response must be mapped to the corresponding form's question IDs, which can be retrieved using the `GET /form/{formId}/questions` endpoint. The question mapping process is crucial for ensuring data integrity, as JotForm requires exact question ID matches for successful submission.

For the KS 4-Set Task survey, the data submission process involves mapping each survey question to its corresponding JotForm question ID. Demographic questions such as age, gender, and education level are submitted as simple key-value pairs, while complex cognitive assessment responses require structured data formatting. The API supports various data types including text strings, numeric values, multiple choice selections, and file uploads.

Batch submission capabilities are available through the `PUT /form/{formId}/submissions` endpoint, which accepts JSON-formatted data for multiple responses. This endpoint is particularly valuable for the offline survey inputter, as it enables efficient synchronization of accumulated responses when network connectivity is restored. The batch format reduces API call overhead and improves synchronization performance for large datasets.

#### 12.2.4 Question Type Mapping and Data Transformation

The survey inputter must implement comprehensive data transformation logic to convert the internal survey response format to JotForm's expected structure. Text entry questions from the survey map directly to JotForm's text input fields, with validation rules applied to ensure data consistency. Age validation, for example, requires numeric input within the 18-65 range, which can be enforced through JotForm's built-in validation mechanisms.

Multiple choice questions require mapping survey response values to JotForm's choice option IDs or text values. The bilingual nature of the survey necessitates careful handling of language-specific responses, ensuring that Chinese and English options are correctly mapped to their corresponding JotForm equivalents. Matrix questions, such as the Likert scale behavioral measures, require structured object formatting with sub-question responses properly nested within the main question response.

Cognitive assessment data presents unique challenges due to its complex structure including response times, accuracy measures, and sequence information. The JotForm integration must flatten this hierarchical data into form-compatible fields while preserving the essential information needed for analysis. Custom field types or hidden fields may be necessary to capture metadata such as response timestamps and device information.

#### 12.2.5 Error Handling and Retry Logic

Robust error handling is essential for reliable JotForm integration, particularly given the potential for network interruptions and API rate limiting. The implementation must include comprehensive error detection for various failure scenarios including authentication errors, malformed data submissions, and server-side processing failures. HTTP status codes provide the primary mechanism for error detection, with 200-299 indicating success, 400-499 indicating client errors, and 500-599 indicating server errors.

Rate limiting errors (HTTP 429) require special handling with exponential backoff retry logic to avoid overwhelming the JotForm servers. The retry mechanism should implement increasing delay intervals between attempts, starting with a short delay and progressively extending to longer intervals for persistent failures. A maximum retry count prevents infinite retry loops while ensuring reasonable persistence for transient network issues.

Data validation errors require careful analysis to determine whether the issue stems from incorrect question mapping, invalid data formats, or missing required fields. The error response typically includes detailed information about the specific validation failures, enabling targeted corrections to the data submission process. Logging mechanisms should capture both successful submissions and error conditions to facilitate troubleshooting and system monitoring.

### 12.3 Qualtrics API Integration

#### 12.3.1 Platform Architecture and Regional Considerations

Qualtrics operates a distributed infrastructure with multiple data centers worldwide, each serving specific geographic regions and compliance requirements. The API base URL varies depending on the user's assigned data center, requiring dynamic endpoint determination based on account configuration. The primary data centers include Washington DC (iad1.qualtrics.com), California (sjc1.qualtrics.com), Canada (ca1.qualtrics.com), European Union (fra1.qualtrics.com), Australia (syd1.qualtrics.com), Singapore (sin1.qualtrics.com), and US Government (gov1.qualtrics.com).

The survey inputter must implement data center detection logic to ensure API calls are directed to the correct regional endpoint. This typically involves an initial API call to determine the user's assigned data center, followed by subsequent requests to the appropriate regional URL. Incorrect data center routing results in authentication failures and data access restrictions, making proper endpoint configuration critical for successful integration.

Qualtrics API v3 represents the current stable version, providing comprehensive survey management and response handling capabilities. The platform's enterprise focus is reflected in its robust feature set, including advanced survey logic, complex question types, and sophisticated data export options. However, this complexity requires careful implementation to ensure compatibility with the simplified survey inputter interface.

#### 12.3.2 Authentication and Authorization Framework

Qualtrics supports both API token and OAuth 2.0 authentication methods, with API tokens providing the most straightforward approach for server-side integrations. API tokens are generated through the Qualtrics account settings under the "Qualtrics IDs" section, where users can create and manage multiple tokens for different applications. Each token is associated with specific permissions and access scopes, enabling fine-grained control over API capabilities.

The API token must be included in the `X-API-TOKEN` header for all API requests, providing a simple and secure authentication mechanism. Unlike some APIs that support query parameter authentication, Qualtrics requires header-based authentication to maintain security standards. The token format is a long alphanumeric string that uniquely identifies the user account and associated permissions.

OAuth 2.0 authentication provides enhanced security for third-party applications and multi-user scenarios. The OAuth flow involves redirecting users to Qualtrics for authentication, receiving an authorization code, and exchanging it for access and refresh tokens. While more complex to implement, OAuth 2.0 enables user-specific permissions and token refresh capabilities for long-running applications. For the offline survey inputter's use case, API token authentication provides sufficient security and simplicity.

#### 12.3.3 Response Import Mechanisms and Data Structures

Qualtrics offers both legacy and modern response import APIs, with the modern API providing enhanced features and better long-term support. The legacy Response Import/Export API, while deprecated, continues to function and may be suitable for simple use cases. However, the modern Response Import API offers superior data handling, validation, and error reporting capabilities.

The response import process begins with creating an import session using `POST /surveys/{surveyId}/response-imports`, which returns an import ID for subsequent operations. Response data is then submitted in JSON format with a specific structure that maps question IDs to response values. The Qualtrics question ID format (QID1, QID2, etc.) must be obtained from the survey structure before attempting data import.

The response data structure accommodates various question types through flexible value formatting. Text questions accept simple string values, while multiple choice questions require choice IDs or text values depending on the import configuration. Matrix questions use nested objects with sub-question responses, and embedded data fields enable custom metadata inclusion. The structure also supports display logic and piping information for advanced survey features.

#### 12.3.4 Survey Structure Mapping and Question ID Resolution

Successful Qualtrics integration requires comprehensive mapping between the survey inputter's internal question structure and Qualtrics question IDs. This mapping process involves retrieving the target survey's structure using the Survey API endpoints and creating a translation table for question and choice IDs. The `GET /surveys/{surveyId}` endpoint provides complete survey metadata including question definitions, choice options, and logic flows.

The KS 4-Set Task survey structure must be replicated in Qualtrics with identical question types and validation rules. Demographic questions map to standard Qualtrics question types, while cognitive assessment tasks may require custom question formats or embedded data fields to capture timing and accuracy information. The bilingual nature of the survey necessitates careful handling of language-specific content, potentially requiring separate surveys for each language or dynamic content switching.

Question ID mapping must account for Qualtrics' automatic ID assignment system, which generates sequential QIDs for each question. The mapping table should include both the survey inputter's internal question identifiers and the corresponding Qualtrics QIDs, along with any necessary data transformation rules. Choice mapping is equally important for multiple choice questions, ensuring that response values align with Qualtrics choice definitions.

#### 12.3.5 Advanced Features and Limitations

Qualtrics provides advanced survey features that may not have direct equivalents in the simplified survey inputter interface. These include complex branching logic, piping, quotas, and advanced question types. While the survey inputter implements basic termination rules, Qualtrics supports more sophisticated logic flows that may require additional configuration during survey setup.

The Response Import API has specific limitations regarding data modification and survey logic execution. Imported responses bypass certain survey features such as display logic and validation rules, requiring pre-validation in the survey inputter before submission. Additionally, imported responses may not trigger automated actions or integrations configured within Qualtrics, necessitating separate handling for such requirements.

Rate limiting in Qualtrics varies by account type and data center, with enterprise accounts typically receiving higher limits. The API implements both request rate limits and concurrent connection limits, requiring careful management of synchronization timing. Bulk import operations are generally more efficient than individual response submissions, making batch processing the preferred approach for large datasets.

### 12.4 Google Sheets API Integration

#### 12.4.1 API Architecture and Service Integration

Google Sheets API v4 represents the current stable version of Google's spreadsheet manipulation interface, providing comprehensive read and write capabilities for Google Sheets documents. The API is part of the broader Google Workspace ecosystem, sharing authentication mechanisms and design patterns with other Google services. The base URL for all Sheets API operations is `https://sheets.googleapis.com/v4/spreadsheets`, with specific endpoints for different operations.

The API's design emphasizes batch operations and efficient data transfer, making it well-suited for the survey inputter's synchronization requirements. Unlike form-based APIs such as JotForm, Google Sheets provides direct cell-level access, enabling flexible data organization and real-time collaboration features. This flexibility allows for custom data layouts that can accommodate the complex structure of the KS 4-Set Task survey.

Google Sheets integration offers unique advantages for research applications, including built-in collaboration features, formula support, and integration with Google's analytics and visualization tools. Researchers can access synchronized survey data immediately upon upload, enabling real-time analysis and reporting. The platform's sharing and permission system also facilitates secure data access for multiple team members.

#### 12.4.2 Authentication Methods and Security Considerations

Google Sheets API supports multiple authentication methods, each suited for different application scenarios. OAuth 2.0 provides user-authorized access with explicit consent for specific operations, making it ideal for applications that access user-owned spreadsheets. The OAuth flow requires user interaction for initial authorization but enables long-term access through refresh tokens.

Service Account authentication offers server-to-server access without user interaction, making it suitable for automated synchronization processes. Service accounts use JSON key files containing cryptographic credentials, enabling secure authentication without exposing user credentials. This method requires sharing target spreadsheets with the service account email address to grant access permissions.

API Key authentication provides limited functionality for accessing public spreadsheets without user authorization. While simple to implement, this method only supports read operations and requires spreadsheets to be publicly accessible. For the survey inputter's requirements, Service Account authentication provides the optimal balance of security and functionality.

The required OAuth scopes for full Sheets access include `https://www.googleapis.com/auth/spreadsheets`, which grants read and write permissions for all spreadsheet operations. More restrictive scopes such as `https://www.googleapis.com/auth/spreadsheets.readonly` can be used for read-only access when appropriate. Scope selection should follow the principle of least privilege to minimize security risks.

#### 12.4.3 Data Writing Operations and Batch Processing

Google Sheets API provides three primary methods for writing data: single range updates, batch updates, and append operations. Single range updates using `PUT /spreadsheets/{spreadsheetId}/values/{range}` are suitable for updating specific cell ranges with known coordinates. The range parameter uses A1 notation (e.g., "Sheet1!A1:C10") to specify the target cells.

Batch update operations through `POST /spreadsheets/{spreadsheetId}/values:batchUpdate` enable multiple range updates in a single API call, significantly improving efficiency for complex data synchronization. The batch format accepts an array of ValueRange objects, each specifying a range and corresponding data values. This approach is particularly valuable for the survey inputter, as it can update multiple survey sections simultaneously.

Append operations using `POST /spreadsheets/{spreadsheetId}/values/{range}:append` automatically add new rows to existing data, making them ideal for continuous data collection scenarios. The append method determines the appropriate insertion point based on existing data, eliminating the need for manual row management. This feature simplifies the synchronization process by automatically handling data growth.

#### 12.4.4 Data Structure Design and Organization

The survey inputter's Google Sheets integration requires careful consideration of data organization to accommodate the complex survey structure while maintaining readability and analysis capabilities. A multi-sheet approach provides optimal organization, with separate sheets for different survey sections: demographics, cognitive assessments, behavioral measures, and post-task feedback.

The demographic sheet structure includes columns for response ID, timestamp, language preference, age, gender, and education level. This basic information provides the foundation for all subsequent analysis and enables participant tracking across survey sections. Column headers should include both English and Chinese labels to support bilingual analysis requirements.

Cognitive assessment data requires specialized formatting to capture the complex information generated by these tasks. Working memory results include accuracy scores, response times, and sequence information, necessitating multiple columns per task. Attention task data captures correct responses, reaction times, and attention check results. Processing speed measurements require arrays of individual trial times along with summary statistics.

Behavioral measures present unique challenges due to their matrix structure and multiple rating scales. Likert scale responses can be organized with separate columns for each scale item, using descriptive column headers that include both the item text and scale anchors. Decision-making scenarios require structured formatting to capture both the scenario parameters and participant choices.

#### 12.4.5 Advanced Features and Collaboration Capabilities

Google Sheets provides advanced features that enhance the survey inputter's capabilities beyond simple data storage. Formula support enables automatic calculation of derived measures such as cognitive assessment scores, behavioral indices, and completion statistics. These calculations update automatically as new data is synchronized, providing real-time insights into data collection progress.

Conditional formatting rules can highlight important data patterns such as incomplete responses, outlier values, or attention check failures. These visual indicators help researchers quickly identify data quality issues and monitor collection progress. Custom formatting rules can be configured to match specific research requirements and analysis protocols.

The platform's collaboration features enable multiple researchers to access and analyze data simultaneously without conflicts. Comment systems facilitate communication about specific responses or data patterns, while revision history provides complete audit trails for data modifications. These features are particularly valuable for multi-site research projects where coordination between research teams is essential.

Data validation rules can be implemented to ensure data quality and consistency during manual data entry or correction processes. These rules can enforce value ranges, data types, and custom validation logic to prevent data entry errors. While the survey inputter handles primary validation, these secondary checks provide additional quality assurance.

### 12.5 Synchronization Architecture and Implementation Strategy

#### 12.5.1 Unified Synchronization Framework

The survey inputter requires a unified synchronization framework that coordinates data upload across all three platforms while maintaining data consistency and handling various error conditions. This framework implements a queue-based architecture where survey responses are staged for synchronization and processed according to platform-specific requirements and rate limits.

The synchronization queue maintains response metadata including submission timestamps, synchronization status, retry counts, and error information. Each response is marked with flags indicating successful synchronization to each target platform, enabling partial synchronization recovery and preventing duplicate submissions. The queue persists across application restarts, ensuring no data loss during system interruptions.

Platform-specific adapters handle the unique requirements of each API, including authentication, data transformation, and error handling. These adapters implement common interfaces for data submission, status checking, and error reporting, enabling consistent handling across different platforms. The adapter pattern facilitates future platform additions and simplifies testing and maintenance.

#### 12.5.2 Data Transformation and Validation Pipeline

A comprehensive data transformation pipeline converts the survey inputter's internal data format to platform-specific structures while maintaining data integrity and completeness. This pipeline implements validation rules for each platform, ensuring data compatibility before attempting synchronization. Validation failures are logged and reported to enable data correction before retry attempts.

The transformation process handles bilingual content by maintaining language-specific mappings for each platform. Question text, choice options, and instructions are translated or mapped to appropriate platform equivalents based on the participant's language preference. This ensures consistent data representation across platforms while preserving the original response context.

Complex data types such as cognitive assessment results require specialized transformation logic to flatten hierarchical structures into platform-compatible formats. Timing data, accuracy measures, and sequence information are preserved through careful field mapping and metadata inclusion. Custom fields or embedded data mechanisms are utilized when standard question types cannot accommodate the required information.

#### 12.5.3 Error Handling and Recovery Mechanisms

Robust error handling ensures reliable synchronization despite network interruptions, API failures, and data validation issues. The framework implements exponential backoff retry logic with configurable maximum retry counts and delay intervals. Different error types receive appropriate handling strategies, with transient errors triggering automatic retries and permanent errors requiring manual intervention.

Network connectivity monitoring enables intelligent synchronization scheduling, deferring upload attempts during offline periods and resuming when connectivity is restored. The system maintains separate retry queues for each platform, allowing successful synchronization to some platforms while retrying failures on others.

Detailed error logging captures all synchronization attempts, including request parameters, response codes, and error messages. This information facilitates troubleshooting and system monitoring while providing audit trails for data integrity verification. Error notifications alert administrators to persistent failures requiring attention.

#### 12.5.4 Performance Optimization and Scalability

The synchronization framework implements several performance optimization strategies to minimize upload times and reduce API overhead. Batch operations are prioritized when supported by target platforms, reducing the number of individual API calls required for large datasets. Connection pooling and HTTP keep-alive mechanisms reduce connection establishment overhead for multiple requests.

Parallel synchronization to different platforms maximizes throughput while respecting individual platform rate limits. The framework monitors API response times and adjusts concurrency levels to optimize performance without triggering rate limiting. Adaptive throttling mechanisms reduce request rates when errors indicate server overload conditions.

Data compression and efficient serialization minimize bandwidth requirements for large survey responses. JSON compression and binary encoding techniques reduce payload sizes while maintaining data integrity. These optimizations are particularly important for mobile network environments where bandwidth may be limited.

### 12.6 Security and Privacy Considerations

#### 12.6.1 Data Protection and Encryption

The survey inputter implements comprehensive data protection measures to ensure participant privacy and comply with research ethics requirements. All API communications use HTTPS encryption to protect data in transit, with certificate validation ensuring connection security. Local data storage employs encryption at rest to protect survey responses stored on the device.

API credentials are stored securely using platform-specific secure storage mechanisms, preventing unauthorized access to authentication tokens. Credential rotation procedures enable regular security updates without service interruption. Multi-factor authentication is supported where available to enhance account security.

Data minimization principles guide the synchronization process, ensuring only necessary information is transmitted to each platform. Personally identifiable information is excluded from synchronized data, with participant identification handled through anonymous response IDs. This approach protects participant privacy while enabling data analysis and correlation.

#### 12.6.2 Access Control and Audit Trails

Comprehensive access control mechanisms ensure only authorized personnel can access synchronized survey data. Platform-specific permission systems are configured to grant minimal necessary access rights to research team members. Regular access reviews verify continued authorization and remove unnecessary permissions.

Complete audit trails track all data synchronization activities, including successful uploads, failed attempts, and error conditions. These logs provide accountability and enable investigation of data integrity issues. Audit information includes timestamps, user identities, data volumes, and operation results.

Data retention policies ensure synchronized data is maintained according to research requirements and regulatory obligations. Automated deletion procedures remove expired data while preserving necessary records for ongoing analysis. These policies balance research needs with privacy protection requirements.

#### 12.6.3 Compliance and Regulatory Considerations

The synchronization framework addresses various compliance requirements relevant to research data collection and management. GDPR compliance measures include explicit consent mechanisms, data portability features, and deletion capabilities. These features ensure participant rights are protected throughout the data lifecycle.

HIPAA compliance considerations apply when health-related information is collected, requiring additional security measures and access controls. The framework supports HIPAA-compliant API endpoints where available and implements necessary safeguards for protected health information.

Institutional Review Board (IRB) requirements are addressed through comprehensive documentation of data handling procedures and security measures. The framework provides detailed technical specifications and security assessments to support IRB review processes. Regular security audits verify continued compliance with approved protocols.

### 12.7 Implementation Timeline and Resource Requirements

#### 12.7.1 Development Phases and Milestones

The API integration implementation follows a phased approach to ensure systematic development and testing of each platform integration. Phase 1 focuses on establishing the basic synchronization framework and implementing Google Sheets integration as the foundational platform. This phase includes authentication setup, basic data transformation, and error handling mechanisms.

Phase 2 adds JotForm integration with its form-based data submission model and specific validation requirements. This phase builds upon the framework established in Phase 1 while addressing the unique challenges of form-based APIs. Comprehensive testing ensures data integrity and error handling across different submission scenarios.

Phase 3 implements Qualtrics integration with its enterprise-focused feature set and complex data structures. This phase represents the most challenging integration due to Qualtrics' sophisticated survey logic and regional data center requirements. Extensive testing validates data accuracy and synchronization reliability.

Phase 4 focuses on optimization, monitoring, and production deployment. This phase includes performance tuning, comprehensive error handling, and monitoring system implementation. User acceptance testing validates the complete synchronization workflow under realistic conditions.

#### 12.7.2 Technical Resource Requirements

The implementation requires a multidisciplinary development team with expertise in web technologies, API integration, and research data management. Frontend developers handle the user interface components and offline data management, while backend developers implement the synchronization framework and API integrations.

API expertise is essential for each target platform, requiring familiarity with authentication mechanisms, data formats, and platform-specific limitations. This expertise may be developed internally or acquired through consulting arrangements with platform specialists. Comprehensive documentation and training materials support knowledge transfer and maintenance.

Testing infrastructure includes development environments for each target platform, automated testing frameworks, and performance monitoring tools. Staging environments replicate production conditions to validate synchronization reliability and performance. Continuous integration systems automate testing and deployment processes.

#### 12.7.3 Ongoing Maintenance and Support

Long-term success requires ongoing maintenance and support for the API integrations as platforms evolve and requirements change. Regular monitoring identifies performance issues, API changes, and error conditions requiring attention. Automated alerting systems notify administrators of critical issues requiring immediate response.

Platform API updates may require integration modifications to maintain compatibility and access to new features. A structured change management process evaluates API updates and implements necessary modifications while maintaining system stability. Version control and rollback procedures enable safe deployment of updates.

User support processes handle synchronization issues, data quality questions, and platform access problems. Comprehensive documentation and training materials enable users to resolve common issues independently while escalation procedures ensure complex problems receive appropriate technical support.

## 13. Risk Assessment and Mitigation Strategies

### 13.1 Technical Risk Analysis

The offline survey inputter faces several categories of technical risks that could impact data collection reliability, synchronization accuracy, and overall system performance. Network connectivity risks represent the most significant challenge, as the system must function reliably in environments with intermittent or unreliable internet access. Extended offline periods could result in large data accumulations that strain synchronization systems when connectivity is restored.

API dependency risks arise from the reliance on external platforms for data synchronization. Changes to API specifications, authentication requirements, or rate limiting policies could disrupt synchronization processes. Platform service outages or performance degradation could prevent timely data upload, potentially leading to data loss if local storage limits are exceeded.

Data integrity risks encompass various scenarios where survey responses could be corrupted, lost, or incorrectly synchronized. Browser compatibility issues, device storage limitations, and software bugs could compromise data quality. The complex survey logic and bilingual content increase the potential for data transformation errors during synchronization.

### 13.2 Operational Risk Mitigation

Comprehensive backup and recovery procedures ensure data protection against various failure scenarios. Local data is automatically backed up to multiple storage locations, including browser local storage, IndexedDB, and downloadable backup files. These redundant storage mechanisms protect against individual storage system failures while providing recovery options for various scenarios.

Synchronization monitoring and alerting systems provide early warning of potential issues before they impact data collection. Automated monitoring tracks synchronization success rates, error frequencies, and performance metrics across all target platforms. Alert thresholds trigger notifications when error rates exceed acceptable levels or when synchronization delays indicate potential problems.

User training and support procedures ensure research teams can effectively operate the system and respond to common issues. Comprehensive documentation covers normal operations, troubleshooting procedures, and emergency response protocols. Regular training sessions keep users informed of system capabilities and best practices for reliable data collection.

### 13.3 Data Security and Privacy Risk Management

Security risk assessment addresses potential vulnerabilities in data handling, storage, and transmission processes. Regular security audits evaluate authentication mechanisms, encryption implementations, and access control systems. Penetration testing identifies potential attack vectors and validates security measure effectiveness.

Privacy protection measures ensure compliance with research ethics requirements and regulatory obligations. Data anonymization procedures remove personally identifiable information before synchronization, while access controls limit data exposure to authorized personnel. Regular privacy impact assessments evaluate new features and procedures for potential privacy implications.

Incident response procedures provide structured approaches for handling security breaches, data loss events, and privacy violations. These procedures include immediate response actions, investigation protocols, and notification requirements for various stakeholder groups. Regular drills ensure team readiness and procedure effectiveness.

## 14. Conclusion and Next Steps

### 14.1 Summary of Requirements and Specifications

This comprehensive Product Requirements Document establishes the foundation for developing a robust offline survey inputter that successfully replicates the functionality of the KS 4-Set Task Qualtrics survey while providing enhanced offline capabilities and multi-platform synchronization. The document encompasses detailed analysis of the original survey structure, comprehensive technical specifications, and thorough API integration research to ensure successful implementation.

The survey structure analysis reveals a sophisticated four-set cognitive assessment tool with complex termination logic, bilingual content support, and diverse question types ranging from simple demographics to complex cognitive tasks. The technical specifications provide detailed guidance for implementing offline functionality, auto-save capabilities, and responsive design across multiple device types and browsers.

The API integration research delivers comprehensive technical specifications for synchronizing data with JotForm, Qualtrics, and Google Sheets platforms. Each integration addresses unique platform requirements while maintaining data integrity and providing robust error handling. The unified synchronization framework ensures reliable data upload across all platforms while accommodating various network conditions and platform limitations.

### 14.2 Implementation Recommendations

The development approach should prioritize core offline functionality before implementing synchronization features, ensuring reliable data collection capabilities independent of network connectivity. The modular architecture enables incremental development and testing of individual components while maintaining system integration throughout the development process.

User experience considerations should emphasize simplicity and reliability over advanced features, recognizing that the primary users are researchers conducting cognitive assessments rather than technical specialists. Comprehensive testing across various devices, browsers, and network conditions ensures reliable operation in diverse research environments.

Security and privacy protection must be integrated throughout the development process rather than added as an afterthought. Regular security reviews and privacy impact assessments ensure continued compliance with research ethics requirements and regulatory obligations as the system evolves.

### 14.3 Future Enhancement Opportunities

The survey inputter architecture provides a foundation for future enhancements that could expand its capabilities and applicability to other research contexts. Advanced analytics features could provide real-time data quality monitoring and preliminary analysis capabilities. Integration with additional platforms could expand synchronization options and support diverse research workflows.

Mobile application development could extend the survey inputter's reach to smartphone and tablet platforms, enabling data collection in even more diverse environments. Progressive Web App (PWA) capabilities could provide app-like functionality while maintaining the flexibility of web-based deployment.

Machine learning integration could enhance data quality through automated validation, anomaly detection, and response pattern analysis. These capabilities could identify potential data quality issues in real-time and provide researchers with enhanced insights into participant behavior and response patterns.

The comprehensive specifications provided in this document establish a solid foundation for successful implementation of the offline survey inputter while ensuring scalability for future enhancements and adaptations to evolving research requirements.