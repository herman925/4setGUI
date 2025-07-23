import { state, logDebug } from './state.js';
import { renderCurrentQuestion } from './question.js';
import { loadSectionData } from './data.js';
import { showPage, renderToc, updateInfoDisplay, renderEntryForm, renderSectionJumper, clearErrors, displayError, showRequiredModal } from './ui.js';

const entryPage = document.getElementById('entry-page');
const tocPage = document.getElementById('toc-page');
const surveyPage = document.getElementById('survey-page');

export function navigateToSection(sectionId) {
    logDebug('Navigating to section:', sectionId);
    state.currentSectionId = sectionId;
    state.currentPage = 0;
    loadSectionData(sectionId).then(() => {
        const navBar = document.getElementById('top-nav');
        navBar.classList.remove('hidden');
        navBar.classList.add('visible');
        document.body.classList.add('nav-visible');
        showPage(surveyPage);
        renderCurrentQuestion();

        if (!state.infoDisplayInterval) {
            updateInfoDisplay();
            state.infoDisplayInterval = setInterval(updateInfoDisplay, 60000);
        }
    });
}

export function navigatePage(direction) {
    logDebug('Navigating page by direction:', direction);
    const section = state.surveySections[state.currentSectionId];
    if (!section) return;

    const newPage = state.currentPage + direction;

    // Save response before navigating
    const question = section.questions[state.currentPage];
    let value;
    if (question.type === 'radio' || question.type === 'image-choice') {
        const selected = document.querySelector(`input[name="${question.id}"]:checked`);
        if (selected) value = selected.value;
    } else {
        const inputElement = document.getElementById(question.id);
        if (inputElement) value = inputElement.value;
    }
    if (value !== undefined) {
        state.userResponses[question.id] = value;
        logDebug('Saved response:', question.id, '=', value);
        if (question.id === 'q1_child_name' || question.id === 'q2_child_age') {
            updateInfoDisplay();
        }
    }

    if (newPage >= 0 && newPage < section.questions.length) {
        state.currentPage = newPage;
        renderCurrentQuestion();
    } else if (newPage >= section.questions.length) {
        logDebug(`navigatePage: End of section ${state.currentSectionId} reached.`);
        if (state.currentSectionId === 'background') {
            state.backgroundCompleted = true;
            logDebug('navigatePage: Background section completed, setting state.backgroundCompleted to true');
        }
        showToc();
    }
}

export function showToc() {
    renderToc();
    const navBar = document.getElementById('top-nav');
    navBar.classList.remove('visible');
    navBar.classList.add('hidden');
    document.body.classList.remove('nav-visible');
    if (state.infoDisplayInterval) {
        clearInterval(state.infoDisplayInterval);
        state.infoDisplayInterval = null;
    }
    showPage(tocPage);
}

export function startSurvey() {
    clearErrors();
    let isValid = true;
    const backgroundSection = state.surveySections['background'];
    if (!backgroundSection || !backgroundSection.entryForm) return;

    backgroundSection.entryForm.forEach(field => {
        const inputElement = document.getElementById(field.id);
        if (!inputElement) return;
        const value = inputElement.value.trim();
        state.userResponses[field.id] = value; // Save entry form data to state

        if (field.required && !value) {
            displayError(`${field.id}-error`, 'This field is required.');
            isValid = false;
        }

        if (field.validation && value) {
            if (field.validation.regex) {
                const regex = new RegExp(field.validation.regex);
                if (!regex.test(value)) {
                    displayError(`${field.id}-error`, field.validation.errorMessage[state.currentLanguage]);
                    isValid = false;
                }
            }
            if (field.validation.min && field.validation.max) {
                const numValue = parseInt(value, 10);
                if (isNaN(numValue) || numValue < field.validation.min || numValue > field.validation.max) {
                    displayError(`${field.id}-error`, field.validation.errorMessage[state.currentLanguage]);
                    isValid = false;
                }
            }
        }
    });

    if (isValid) {
        showToc();
    }
}

export function toggleLanguage(event) {
    state.currentLanguage = event.target.checked ? 'en' : 'zh';
    const tocTitle = document.getElementById('toc-title');
    if (tocTitle) {
        tocTitle.textContent = tocTitle.dataset[`lang-${state.currentLanguage}`];
    }
    renderEntryForm();
    renderToc();
    renderSectionJumper();
    if (state.currentSectionId) {
        renderCurrentQuestion();
    }
}
