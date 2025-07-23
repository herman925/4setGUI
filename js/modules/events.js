import { startSurvey, showToc, toggleLanguage, navigatePage } from './navigation.js';
import { hideRequiredModal } from './ui.js';
import { exportResponsesToCsv } from './export.js';

export function initializeEventListeners() {
    document.getElementById('start-survey-btn').addEventListener('click', startSurvey);
    document.getElementById('home-btn').addEventListener('click', showToc);
    document.getElementById('language-toggle-checkbox').addEventListener('change', toggleLanguage);
    document.getElementById('next-btn').addEventListener('click', () => navigatePage(1));
    document.getElementById('back-btn').addEventListener('click', () => navigatePage(-1));
    document.getElementById('modal-close-btn').addEventListener('click', hideRequiredModal);
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportResponsesToCsv);
    }
}
