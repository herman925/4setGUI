# Task: Develop Offline Survey Inputter

## 1. Objective

To create a web-based, offline-first survey application that replicates the functionality of the KS 4-Set Task Qualtrics survey. The application must support bilingual content (English/Chinese), complex survey logic, and data synchronization with JotForm, Qualtrics, and Google Sheets.

## 2. Core Tasks

### 2.1. Frontend Development

- **Task:** Implement the GUI based on the provided wireframes and design specifications.
  - **Sub-tasks:**
    - Create the main navigation structure (landing page, survey menu, question pages).
    - Implement responsive design for mobile, tablet, and desktop breakpoints.
    - Ensure all UI components are touch-friendly and meet accessibility standards (WCAG 2.1 AA).
    - Implement the language selection and switching mechanism.
  - **Success Criteria:**
    - The application is responsive and works on mobile, tablet, and desktop devices.
    - All UI components (main menu, question pages, etc.) are implemented as specified.
    - The application is accessible (WCAG 2.1 AA compliant).

- **Task:** Develop the survey rendering engine to dynamically display questions from a JSON definition file.
  - **Sub-tasks:**
    - Create a JSON schema for the survey definition file.
    - Implement rendering for all question types (text, single choice, multiple choice, matrix, Likert, etc.).
    - Implement bilingual support for all question text, options, and messages.
    - Implement validation for all question types based on the JSON schema.
  - **Success Criteria:**
    - All question types (text, multiple choice, matrix, etc.) are supported.
    - The application correctly handles bilingual content.
    - The rendering engine is performant and loads questions quickly.

### 2.2. Offline Functionality

- **Task:** Implement offline data storage using IndexedDB.
  - **Sub-tasks:**
    - Design the IndexedDB schema for responses, sessions, and the sync queue.
    - Implement functions to create, read, update, and delete data in IndexedDB.
    - Ensure data is stored securely and can be retrieved after the application is closed and reopened.
  - **Success Criteria:**
    - Survey responses are saved locally on the device.
    - The application can handle a large number of offline responses (1000+).
    - Data is stored securely and is not lost when the application is closed.

- **Task:** Implement an auto-save feature to prevent data loss.
  - **Sub-tasks:**
    - Create an `AutoSaveManager` to handle the auto-save logic.
    - Implement a timer to trigger auto-save every 5 seconds.
    - Provide visual feedback to the user on the auto-save status.
  - **Success Criteria:**
    - Changes are saved automatically every 5 seconds.
    - The user is notified of the save status.

### 2.3. Developer Tools

- **Task:** Implement a password-protected Debug Mode.
  - **Sub-tasks:**
    - Create a hidden mechanism (e.g., a specific click pattern or invisible button) to trigger a password prompt.
    - The password should be hardcoded as `ks2.0` for now.
    - When debug mode is active, the application should output verbose logs to the console for key user actions (e.g., clicks, inputs, state changes) to facilitate troubleshooting.
    - Provide a visual indicator that debug mode is active.
  - **Success Criteria:**
    - Debug mode can be successfully toggled using the password.
    - Console logs provide meaningful, verbose information about application state and user interactions.
    - The debug mode is not intrusive to the standard user experience.

### 2.4. Survey Logic

- **Task:** Implement the survey's termination and skip logic.
  - **Sub-tasks:**
    - Implement the primary termination conditions (age restriction, language mismatch, etc.).
    - Implement the set-level and question-level skip logic.
    - Ensure the logic is driven by the `survey-definition.json` file.
  - **Success Criteria:**
    - The application correctly terminates the survey based on the defined rules (e.g., age restrictions).
    - The application correctly skips questions or sections based on the user's responses.

### 2.5. Data Synchronization

- **Task:** Implement data synchronization with JotForm, Qualtrics, and Google Sheets.
  - **Sub-tasks:**
    - Implement a unified synchronization framework with a queue-based architecture.
    - Create platform-specific adapters for JotForm, Qualtrics, and Google Sheets.
    - Implement data transformation and validation pipelines for each platform.
    - Implement robust error handling and retry logic.
  - **Success Criteria:**
    - Data is successfully synchronized with all three platforms when an internet connection is available.
    - The application handles synchronization errors gracefully and retries when possible.
    - Data is correctly formatted for each platform.

## 3. Non-Functional Requirements

- **Performance:**
  - Page load times should be under 2 seconds.
  - Question transitions should be under 500ms.
- **Security:**
  - All data should be transmitted over HTTPS.
  - Sensitive data should be encrypted at rest.
- **Browser Compatibility:**
  - The application must work on the latest versions of Chrome, Firefox, Safari, and Edge.

## 4. Milestones

1.  **Milestone 1:** Basic UI and survey rendering engine complete.
2.  **Milestone 2:** Offline storage, auto-save, and debug mode functionality implemented.
3.  **Milestone 3:** Survey logic (termination and skip) implemented.
4.  **Milestone 4:** Data synchronization with all three platforms complete.
5.  **Milestone 5:** Final testing and deployment.