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

## Key Modules

- **state.js** - Global application state management
- **ui.js** - DOM manipulation and rendering
- **navigation.js** - Page flow and survey navigation
- **data.js** - JSON data loading and processing
- **events.js** - Event listener management
- **question.js** - Individual question rendering

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
- **Error Handling**: Comprehensive error catching and user feedback

## Configuration

Survey structure and content are defined in JSON files within the `assets/` directory:
- `survey-structure.json` - Overall survey organization
- `background.json` - Background information questions
- Individual section files (e.g., `ERV.json`, `SYM.json`, etc.)

## License

Educational use - The Education University of Hong Kong
