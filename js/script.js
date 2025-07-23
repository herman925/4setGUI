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

    const startSurveyBtn = document.getElementById('start-survey-btn');
    const languageToggle = document.getElementById('language-toggle-checkbox');
    const homeBtn = document.getElementById('home-btn');
    const tocList = document.getElementById('toc-list');
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const debugTrigger = document.getElementById('debug-trigger');

    if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', startSurvey);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigatePage(1));
    }

    if (debugTrigger) {
        debugTrigger.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                state.debugMode = false;
                document.body.classList.remove('debug-mode');
                alert('Debug mode deactivated.');
                logDebug('Debug mode deactivated by Ctrl+Click.');
                return;
            }

            if (!state.debugMode) {
                const password = prompt("Enter debug password:");
                if (password === "ks2.0") {
                    state.debugMode = true;
                    document.body.classList.add('debug-mode');
                    alert(`Debug mode activated.`);
                    logDebug('Debug mode activated.');
                } else if (password !== null) {
                    alert("Incorrect password.");
                }
            }
        });
    }
});
