import { state, logDebug } from './modules/state.js';
import { fetchSurveyData } from './modules/data.js';
import { renderEntryForm, renderToc, renderSectionJumper } from './modules/ui.js';
import { initializeEventListeners } from './modules/events.js';
import { startSurvey, toggleLanguage, navigateToSection, navigatePage } from './modules/navigation.js';
import { initializeDebug } from './modules/debug.js';

document.addEventListener('DOMContentLoaded', () => {
    const navBar = document.getElementById('top-nav');
    navBar.classList.add('hidden');
    navBar.classList.remove('visible');

    fetchSurveyData()
        .then(() => {
            renderEntryForm();
            renderToc();
            renderSectionJumper();
            initializeEventListeners();
            initializeDebug();
        })
        .catch(error => console.error('Error initializing survey:', error));

    
});
