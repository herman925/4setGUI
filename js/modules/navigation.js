import { state, logDebug, formatTimestamp } from './state.js';
import { renderCurrentQuestion } from './question.js';
import { startTimer, stopTimer } from './timer.js';
import { startAutosave, loadAutosave, saveToLocal } from './autosave.js';
import { loadSectionData } from './data.js';
import { showPage, renderToc, updateInfoDisplay, renderEntryForm, clearErrors, displayError } from './ui.js';

const entryPage = document.getElementById('entry-page');
const tocPage = document.getElementById('toc-page');
const surveyPage = document.getElementById('survey-page');
const topNav = document.getElementById('top-nav');

export function navigateToSection(sectionId) {
    logDebug('Navigating to section:', sectionId);
    stopTimer();
    state.autoNext = false;
    state.currentSectionId = sectionId;
    state.currentPage = 0;
    const now = formatTimestamp(new Date());
    if (!state.sectionTimestamps[sectionId]) {
        state.sectionTimestamps[sectionId] = { start: now, lastUsed: now };
    } else {
        state.sectionTimestamps[sectionId].lastUsed = now;
    }
    saveToLocal();
    loadSectionData(sectionId).then(() => {
        topNav.classList.remove('hidden');
        topNav.classList.add('visible');
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
    const prevQuestion = section.questions[state.currentPage];

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
        saveToLocal();
        if (question.id === 'child-name') {
            updateInfoDisplay();
        }
    }

    if (direction > 0) {
        if (section.id === 'sym' && prevQuestion && prevQuestion.id === 'SYM_ins2') {
            state.timerSection = 'sym';
            state.autoNext = true;
            startTimer(120, () => {
                const idx = section.questions.findIndex(q => q.id === 'SYM_timeout');
                if (idx !== -1) {
                    state.currentPage = idx;
                    renderCurrentQuestion();
                }
            });
        } else if (section.id === 'nonsym' && prevQuestion && prevQuestion.id === 'NONSYM_ins2') {
            state.timerSection = 'nonsym';
            state.autoNext = true;
            startTimer(120, () => {
                const idx = section.questions.findIndex(q => q.id === 'NONSYM_timeout');
                if (idx !== -1) {
                    state.currentPage = idx;
                    renderCurrentQuestion();
                }
            });
        }
    }

    if (direction > 0 && state.pendingTermination && state.pendingTermination.id === question.id) {
        if (!state.pendingTermination.allowNext) {
            state.completionTimes[state.currentSectionId] = new Date().toISOString();
            saveToLocal();
            showToc();
            state.pendingTermination = null;
            return;
        }
        state.pendingTermination = null;
    }

    if (newPage < 0) {
        showToc();
    } else if (newPage >= 0 && newPage < section.questions.length) {
        const nextQuestion = section.questions[newPage];
        if (nextQuestion && (nextQuestion.id === 'SYM_timeout' || nextQuestion.id === 'NONSYM_timeout')) {
            stopTimer();
            state.autoNext = false;
        }
        state.currentPage = newPage;
        renderCurrentQuestion();
    } else if (newPage >= section.questions.length) {
        logDebug(`navigatePage: End of section ${state.currentSectionId} reached.`);
        stopTimer();
        state.autoNext = false;
        state.completionTimes[state.currentSectionId] = new Date().toISOString();
        saveToLocal();
        if (checkSurveyCompletion()) {
            state.completed = true;
        }
        saveToLocal();
        showToc();
    }
}

export function showToc() {
    stopTimer();
    state.autoNext = false;
    if (state.currentSectionId) {
        const now = formatTimestamp(new Date());
        const ts = state.sectionTimestamps[state.currentSectionId] || {};
        ts.lastUsed = now;
        state.sectionTimestamps[state.currentSectionId] = ts;
        saveToLocal();
    }
    renderToc();
    topNav.classList.remove('hidden');
    topNav.classList.add('visible');
    document.body.classList.add('nav-visible');
    updateInfoDisplay();
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
                    displayError(`${field.id}-error`, field.validation.errorMessage);
                    isValid = false;
                }
            }
            if (field.validation.min && field.validation.max) {
                const numValue = parseInt(value, 10);
                if (isNaN(numValue) || numValue < field.validation.min || numValue > field.validation.max) {
                    displayError(`${field.id}-error`, field.validation.errorMessage);
                    isValid = false;
                }
            }
        }
    });

    if (isValid) {
        const genderText = state.userResponses['gender'] === 'male' ? '男' : state.userResponses['gender'] === 'female' ? '女' : state.userResponses['gender'];
        const summary = `學生編號: ${state.userResponses['student-id']}\n` +
                        `學校編號: ${state.userResponses['school-id']}\n` +
                        `學校名稱: ${state.userResponses['school-name']}\n` +
                        `姓名: ${state.userResponses['child-name']}\n` +
                        `性別: ${genderText}`;
        if (!confirm(summary)) return;

        loadAutosave(state.userResponses['student-id']).then(saved => {
            if (saved) {
                Object.assign(state.userResponses, saved.responses || {});
                Object.assign(state.completionTimes, saved.completionTimes || {});
                state.sectionTimestamps = saved.sectionTimestamps || {};
                state.startDate = saved.startDate || formatTimestamp(new Date());
                state.endDate = saved.endDate || state.startDate;
                state.viewedQuestions = saved.viewedQuestions || {};
                state.completed = saved.completed || false;
            } else {
                const now = new Date();
                state.startDate = formatTimestamp(now);
                state.endDate = formatTimestamp(now);
                state.viewedQuestions = {};
                state.completed = false;
            }
            saveToLocal();
            startAutosave();
            showToc();
        });
    }
}


function checkSurveyCompletion() {
    const sectionIds = Object.keys(state.surveySections).filter(id => id !== 'background');
    return sectionIds.every(id => state.completionTimes[id]);
}
