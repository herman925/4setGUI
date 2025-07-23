## GUI SPECIFICATION

This section defines the graphical user interface (GUI) specifications for the offline survey inputter, including layout, branding, visual consistency, and technical implementation guidelines.

---

### 1. Visual Design & Branding

#### 1.1 Colour Palette (based on official PANTONE swatches)

| Purpose             | HEX      | Description         |
|---------------------|----------|---------------------|
| Primary (Accent)    | `#2b3990` | PANTONE 2764C – deep blue |
| Secondary 1         | `#f99d33` | PANTONE 7409C – orange    |
| Secondary 2         | `#f04e69` | PANTONE 2046C – pink      |
| Secondary 3         | `#8dbe50` | PANTONE 2300C – green     |
| Secondary 4         | `#f4d036` | PANTONE 7404C – yellow    |

- Use **#2b3990** for navigation bar backgrounds and primary buttons.
- Use **#f99d33**, **#f04e69**, **#8dbe50**, **#f4d036** for icons, badges, and section headers.
- Text colour: default to dark grey (`#333`) for high readability; never pure black.

#### 1.2 Logo Usage

- Embed the official **KeySteps@JC** logo (horizontal version with tagline) in the top-left corner of the app.
- Follow **minimum sizing** rules:  
  - 250px wide for horizontal logos on screen  
  - 157px wide for vertical logos if used in mobile views
- Tagline must remain legible; do not crop or isolate the logomark.
- Maintain white space of at least `10px` around all logo instances.

---

### 2. Layout & Components

#### 2.1 Entry Page
- Displays a clean dashboard with:
  - Logo
  - Project Title
  - Survey Menu listing 5 core blocks
  - Text input for "Student ID", dropdown for "Survey Language"
  - Continue button (`#2b3990` with white text, hover to `#1e2a70`)

#### 2.2 Menu Panel (left sidebar, collapsible)
- Sticky left-side navigation (width: 220px)
- Lists the blocks:
  - 🧒 Background 2
  - 🇬🇧 English Vocabulary
  - 🔤 Symbolic Relations
  - 🧠 Theory of Mind
  - 🇨🇳 Chinese Word Recognition
- Current section should highlight in **#f99d33** with bold text

#### 2.3 Survey Page
- Main content centered with max-width of 800px
- Sticky top bar with:
  - Child ID
  - Current Section
  - Page X of Y
  - Autosave status indicator (dot + “Last saved 12:03 PM”)
- Question box with:
  - Audio player (auto-play once only)
  - Image options (grid layout, max 4 per row)
  - Large buttons with **rounded corners** and **hover outlines**
- Navigation buttons:
  - Back / Next: pill-shaped, primary button uses **#2b3990**
  - Disable “Next” unless a response is selected

#### 2.4 End of Section / Completion Screen
- Show section score if applicable
- Completion message with yellow highlight box (`#f4d036`)
- Option to return to menu or export results

---

### 3. Typography

- Font: Use **Noto Sans TC** or **Roboto** (with Traditional Chinese support)
- Font Sizes:
  - Headings: 24px (bold)
  - Body text: 16px
  - Buttons: 18px, bold, all caps
- Line-height: 1.5em for all body copy

---

### 4. Responsiveness & Accessibility

- Tablet-first design (landscape mode)
- All interactive elements must be:
  - Keyboard-navigable
  - Labeled for screen readers
- Minimum touch target size: 48x48px

---

### 5. Technical Implementation Notes

- Assets stored locally in `/assets/`:
  - `/audio/`, `/images/`, `/logos/`, `survey-definition.json`
- CSS structure:
  - Use SCSS or CSS variables for colour themes (`--primary-color: #2b3990;`)
- Autosave and online sync feedback:
  - Use a non-intrusive toast-style notification in bottom-right (e.g., ✅ “Saved”)