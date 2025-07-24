# 4setGUI - KeySteps@JC Offline Survey Application

A web-based, offline-first survey application for the KS 4-Set Task, supporting complex survey logic.

## Features

- **Offline-first design** - Works without internet connection
- **Modular architecture** - Clean separation of concerns with ES6 modules
- **Responsive design** - Works on mobile, tablet, and desktop
- **Debug mode** - Password-protected verbose logging for development
- **Auto-save functionality** - Prevents data loss
- **Modal feedback** - User-friendly error handling

## Project Structure

```
4setGUI/
├── assets/               # Survey data and media files
│   ├── *.json           # Survey section definitions
│   ├── audio/           # Audio assets
│   ├── images/          # Image assets
│   └── logos/           # Logo files
├── css/                 # Stylesheets
│   ├── style.css        # Main stylesheet
│   └── modules/         # Modular CSS files
├── js/                  # JavaScript modules
│   ├── script.js        # Main entry point
│   └── modules/         # Core application modules
├── PRDs/                # Project requirements and documentation
├── index.html           # Main HTML file
└── README.md           # This file
```

## Key JavaScript Modules

- **script.js** - Application entry point that initializes modules
- **service-worker.js** - Caches assets to enable offline use
- **sync-manager.js** - Queues data for syncing when back online
- **modules/state.js** - Global state store and debug helpers
- **modules/ui.js** - Rendering of entry form, TOC and survey pages
- **modules/navigation.js** - Section flow and page navigation logic
- **modules/data.js** - Loads survey structure and section JSON files
- **modules/events.js** - Sets up listeners for UI controls
- **modules/question.js** - Creates DOM for each question type
- **modules/autosave.js** - Periodically saves progress locally
- **modules/export.js** - Builds a CSV file of all responses
- **modules/id-mapping.js** - Looks up student and school IDs
- **modules/debug.js** - Optional developer tools for editing questions

## CSS Files

- **style.css** - Central stylesheet that imports the module files
- **modules/base.css** - Base layout and global resets
- **modules/navigation.css** - Styling for the fixed top navigation bar
- **modules/pages.css** - Layout for entry, TOC and survey pages
- **modules/forms.css** - Entry form fields and button styles
- **modules/components.css** - Question display and debug UI elements
- **modules/survey-items.css** - Helpers and highlights used inside questions

## Getting Started

1. **Setup**: No build process required - this is a vanilla JavaScript application
2. **Development**: Use `start-server.ps1` or `start.bat` to run a local development server
3. **Debug Mode**: Click the top-left corner of the page and enter password "ks2.0"

## Survey Flow

1. **Entry Page** - Background information collection
2. **Table of Contents** - Survey section selection
3. **Survey Pages** - Individual question presentation
4. **Modal Feedback** - Guidance for required sections

## Technical Details

- **Framework**: Vanilla JavaScript (ES6 modules)
- **Storage**: LocalStorage for offline data persistence
- **Styling**: Custom CSS with modular architecture
- **Build**: No build step required
- **Browser Support**: Modern browsers supporting ES6 modules

## Development Features

- **Debug Mode**: Verbose console logging when activated
- **Hot Reload**: No compilation step needed for development
- **Modular CSS**: Organized stylesheets for maintainability
- **Universal highlight classes**: Reusable `.highlight-*` CSS helpers for emphasising key text across all survey tasks
- **Error Handling**: Comprehensive error catching and user feedback

## Configuration

Survey structure and content are defined in JSON files within the `assets/` directory:
- `survey-structure.json` - Overall survey organization
- `background.json` - Background information questions
- Individual section files (e.g., `ERV.json`, `SYM.json`, etc.)

## License

Educational use - The Education University of Hong Kong
