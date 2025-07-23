import { state, logDebug } from './modules/state.js';
import { fetchSurveyData } from './modules/data.js';
import { renderEntryForm, renderToc } from './modules/ui.js';
import { initializeEventListeners } from './modules/events.js';
import { startSurvey, toggleLanguage, navigateToSection, navigatePage } from './modules/navigation.js';
import { initializeDebug } from './modules/debug.js';
import { loadIdMappings } from './modules/id-mapping.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('top-nav').classList.add('hidden');

    loadIdMappings()
        .then(fetchSurveyData)
        .then(() => {
            renderEntryForm();
            renderToc();
            initializeEventListeners();
            initializeDebug();
        })
        .catch(error => console.error('Error initializing survey:', error));

    
});
