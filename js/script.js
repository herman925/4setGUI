import { state, logDebug } from './modules/state.js';
import { fetchSurveyData } from './modules/data.js';
import { renderEntryForm, renderToc, renderSectionJumper } from './modules/ui.js';
import { initializeEventListeners } from './modules/events.js';
import { startSurvey, toggleLanguage, navigateToSection, navigatePage } from './modules/navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('top-nav').classList.add('hidden');

    fetchSurveyData()
        .then(() => {
            renderEntryForm();
            renderToc();
            renderSectionJumper();
            initializeEventListeners();
        })
        .catch(error => console.error('Error initializing survey:', error));

    
});
