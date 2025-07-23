import { state, logDebug } from './modules/state.js';
import { fetchSurveyData } from './modules/data.js';
import { renderEntryForm, renderToc } from './modules/ui.js';
import { initializeEventListeners } from './modules/events.js';
import { startSurvey, navigateToSection, navigatePage } from './modules/navigation.js';
import { initializeDebug } from './modules/debug.js';
import { loadIdMappings } from './modules/id-mapping.js';

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('top-nav');
    nav.classList.add('hidden');
    nav.classList.remove('visible');

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
