# Product Requirements Document (PRD)
## JSON-Based Survey Definition System

### 1. Objective

To create a flexible, scalable, and maintainable JSON-based format (`survey-definition.json`) that fully defines the structure, content, and logic of the KS 4-Set Task survey. The system must allow non-technical users to modify survey items without touching application code, while supporting multilingual content, complex logic, scoring, and autosave.

---

### 2. Core Requirements

#### 2.1 JSON File Purpose
- Acts as the **single source of truth** for all survey content and logic
- Controls how the frontend renders questions, validates responses, applies logic, and stores data

#### 2.2 Functional Requirements

| Feature | Description |
|--------|-------------|
| Multilingual support | Each string (title, question, option, error) must support at least English and Traditional Chinese |
| Section-based structure | Survey is organized into multiple named sections/blocks |
| Question typing | Supports `text`, `single-choice`, `multi-choice`, `likert-matrix`, `image-choice`, `audio-choice`, `timed`, `reaction-time`, `grid`, etc. |
| Metadata per question | Must include `required`, `validation`, `media`, `scoring`, `showIf`, and `terminateIf` where applicable |
| Termination logic | JSON should express termination triggers declaratively (e.g. `"terminateIf": {"scoreBelow": 60}`) |
| Skip logic | Question-level and section-level conditional navigation rules supported via `showIf` or `skipIf` |
| Preload assets | Each section can declare preload audio/image assets |
| Timer configuration | Support per-question timers and limits for reaction-time or cognitive tasks |
| Autosave identifier | Each question must include a stable `id` for tracking and storage |
| Version control | Survey JSON must include a `schemaVersion` to ensure backward compatibility during updates |

---

### 3. Optional / Advanced Requirements

| Feature | Description |
|--------|-------------|
| Dynamic rendering hints | Optional flags like `randomizeOptions`, `imageLayout`, `playAudioOnce`, etc. |
| Score evaluation | Per-question scoring rules using a `correctAnswer`, `weight`, or custom evaluation function |
| Display logic | Allow conditional visibility of questions or blocks (e.g., `"showIf": {"Q2_Gender": "male"}`) |
| Nested/matrix support | Matrix questions should allow nested item arrays and scale definitions |
| Bilingual fallback | If `zh` string is missing, default to `en` automatically |
| Developer preview mode | Ability to flag questions or blocks as `testOnly: true` for development QA purposes |
| Custom grouping | Group related Likert or grid items with `groupId` for UI display and scoring aggregation |

---

### 4. JSON Structural Guidelines

#### 4.1 Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `schemaVersion` | `string` | Version of the schema (e.g. `"1.1.0"`) |
| `languageSupport` | `array` | Supported languages (e.g. `["en", "zh"]`) |
| `surveyTitle` | `object` | Localized survey title |
| `sections` | `array` | List of survey blocks/sections |

#### 4.2 Section Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique section ID |
| `title` | `object` | Localized section name |
| `description` | `object` | Localized introduction text |
| `preloadAssets` | `array` | List of image/audio to preload |
| `questions` | `array` | List of question objects in order |

#### 4.3 Question Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique question ID (for autosave, response mapping) |
| `type` | `string` | Type of question (`text`, `single-choice`, `likert-matrix`, etc.) |
| `label` | `object` | Localized question text |
| `inputType` | `string` | Optional (e.g. `text`, `number`, `date`) |
| `required` | `boolean` | Whether question is required |
| `options` | `array` | For choice questions: array of `{ value, label }` |
| `validation` | `object` | Input constraints (e.g. `min`, `max`, regex) |
| `media` | `object` | Audio/image paths for stimuli |
| `scoring` | `object` | Optional scoring rules (`correctAnswer`, `weight`, `evaluationFn`) |
| `showIf` | `object` | Conditional visibility (e.g. `{ "Q1_Age": { "gte": 18 } }`) |
| `terminateIf` | `object` | Triggers immediate termination if met |
| `timer` | `object` | Optional: `{ "limit": 60000, "startOn": "load" }` |
| `groupId` | `string` | For grouping items within Likert or matrix blocks |

---

### 5. Non-Functional Requirements

- **Editable by Non-Devs**: Structure should be easy to edit by coordinators using tools like JSON editors
- **Validatable**: Schema should be enforceable via JSON Schema (e.g. for CI validation)
- **Human-readable**: Field names and structures should be intuitively understood
- **Load Performance**: File should be modularizable if large (one file per block, merged at runtime)

---

### 6. JSON Integrity & Error Handling

- App must validate the entire JSON structure before rendering
- Provide graceful fallback for:
  - Missing translation in current language
  - Malformed questions (log and skip)
  - Unsupported types (log warning and skip)
- Display debug UI in dev mode (e.g., show `questionId`, `type`, any hidden logic)

---

### 7. Future Extensions

- Support for **markdown-based content** for instructions
- Support for **multimedia interactions** (e.g. video responses)
- In-app **JSON schema preview** or editing mode
- **Import/export** of JSON via drag-and-drop interface