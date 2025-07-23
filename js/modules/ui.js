import { state, logDebug, labelTranslations } from './state.js';
import { navigateToSection } from './navigation.js';

const entryPage = document.getElementById('entry-page');
const tocPage = document.getElementById('toc-page');
const surveyPage = document.getElementById('survey-page');
const entryFormContainer = document.getElementById('entry-form-container');
const tocList = document.getElementById('toc-list');
const sectionJumper = document.getElementById('section-jumper');
const questionContainer = document.getElementById('question-container');
const currentSectionDisplay = document.getElementById('current-section-display');
const pageInfo = document.getElementById('page-info');

function sectionVisible(sectionInfo) {
    if (!sectionInfo || !sectionInfo.showIf) return true;
    const conditions = sectionInfo.showIf;
    return Object.keys(conditions).every(key => state.userResponses[key] === conditions[key]);
}

export function renderEntryForm() {
    const backgroundSection = state.surveySections['background'];
    if (!backgroundSection || !backgroundSection.entryForm) {
        setTimeout(renderEntryForm, 100);
        return;
    }

    entryFormContainer.innerHTML = '';
    backgroundSection.entryForm.forEach(field => {
        const formGroup = document.createElement('div');
        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = field.label;
        if (field.required) {
            const asterisk = document.createElement('span');
            asterisk.className = 'required-asterisk';
            asterisk.textContent = '*';
            label.appendChild(asterisk);
        }
        formGroup.appendChild(label);

        if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = field.id;
            input.placeholder = field.placeholder;
            if (state.userResponses[field.id]) {
                input.value = state.userResponses[field.id];
            }
            formGroup.appendChild(input);
            if (field.id === 'student-id') {
                const loadBtn = document.createElement('button');
                loadBtn.type = 'button';
                loadBtn.id = 'load-session-btn';
                loadBtn.textContent = '載入上次資料';
                formGroup.appendChild(loadBtn);
            }
        } else if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.id;
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                select.appendChild(opt);
            });
            if (state.userResponses[field.id]) {
                select.value = state.userResponses[field.id];
            }
            formGroup.appendChild(select);
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${field.id}-error`;
        formGroup.appendChild(errorDiv);
        entryFormContainer.appendChild(formGroup);
    });
    import('./events.js').then(m => m.attachEntryFormListeners());
}

export function renderToc() {
    logDebug('renderToc: Starting function');
    if (!tocList) {
        logDebug('renderToc: tocList element not found. Aborting.');
        return;
    }
    tocList.innerHTML = '';

    if (!state.surveyStructure || !state.surveyStructure.sets) {
        logDebug('renderToc: surveyStructure or sets not found in state. Aborting.');
        logDebug('renderToc: state.surveyStructure:', state.surveyStructure);
        return;
    }

    const createTocItem = (section) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        tocItem.dataset.section = section.id;

        const answered = section.questions.filter(q => state.userResponses[q.id]).length;
        const total = section.questions.length;
        const timestamps = state.sectionTimestamps[section.id] || {};

        const info = document.createElement('div');
        info.className = 'toc-item-info';

        const title = document.createElement('div');
        title.className = 'toc-item-title';
        title.textContent = section.title || section.id;
        info.appendChild(title);

        const times = document.createElement('div');
        times.className = 'toc-item-times';
        const startedLabel = labelTranslations.started;
        const lastLabel = labelTranslations.lastUsed;
        const startSpan = document.createElement('span');
        startSpan.textContent = `${startedLabel}: ${timestamps.start || '-'}`;
        const lastSpan = document.createElement('span');
        lastSpan.textContent = `${lastLabel}: ${timestamps.lastUsed || '-'}`;
        times.appendChild(startSpan);
        times.appendChild(lastSpan);
        info.appendChild(times);

        const progress = document.createElement('div');
        progress.className = 'toc-item-progress';
        progress.textContent = `${answered}/${total}`;

        tocItem.appendChild(info);
        tocItem.appendChild(progress);

        tocItem.addEventListener('click', () => {
            logDebug('TOC item clicked:', section.id);
            navigateToSection(section.id);
        });
        return tocItem;
    };

    const sortedSets = [...state.surveyStructure.sets].sort((a, b) => a.order - b.order);
    logDebug('renderToc: Rendering', sortedSets.length, 'sets.');

    sortedSets.forEach(set => {
        logDebug('renderToc: Processing set:', set.id);
        const setContainer = document.createElement('div');
        setContainer.className = 'toc-set';

        const setTitle = document.createElement('h3');
        setTitle.className = 'toc-set-title';
        setTitle.textContent = set.name || set.id;
        setContainer.appendChild(setTitle);

        set.sections.forEach(sectionInfo => {
            const sectionId = sectionInfo.file.replace('.json', '');
            if (sectionId === 'background') return; // skip background section in TOC
            if (!sectionVisible(sectionInfo)) return; // hide by condition
            const section = state.surveySections[sectionId];
            if (section) {
                logDebug(`renderToc:   - Section: ${sectionId}`);
                const tocItem = createTocItem(section);
                setContainer.appendChild(tocItem);
            } else {
                logDebug(`renderToc:   - Section data for ${sectionId} not found in state.surveySections.`);
            }
        });
        tocList.appendChild(setContainer);
    });
    logDebug('renderToc: Finished rendering TOC.');
    updateSurveyTimestamps();
}

export function renderSectionJumper() {
    sectionJumper.innerHTML = '';
    if (!state.surveyStructure || !state.surveyStructure.sets) return;

    state.surveyStructure.sets.forEach(set => {
        if (set.sections.some(s => s.file === 'background.json')) return;

        const li = document.createElement('li');
        li.className = 'nav-item';
        const setLink = document.createElement('a');
        setLink.href = '#';
        setLink.textContent = set.name;
        setLink.addEventListener('click', (e) => e.preventDefault());
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';

        set.sections.forEach(sectionObj => {
            const sectionId = sectionObj.file.replace('.json', '').toLowerCase();
            if (!sectionVisible(sectionObj)) return;
            const section = state.surveySections[sectionId];
            if (section) {
                const dropdownItem = document.createElement('a');
                dropdownItem.href = '#';
                dropdownItem.className = 'dropdown-item';
                dropdownItem.textContent = section.title;
                dropdownItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToSection(section.id);
                });
                dropdown.appendChild(dropdownItem);
            }
        });
        li.appendChild(setLink);
        li.appendChild(dropdown);
        sectionJumper.appendChild(li);
    });
}

import { renderCurrentQuestion } from './question.js';

export function renderQuestion() {
    renderCurrentQuestion();
}


export function showPage(pageToShow) {
    [entryPage, tocPage, surveyPage].forEach(page => {
        page.classList.remove('active');
    });
    pageToShow.classList.add('active');
}

export function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

export function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

export function updateInfoDisplay() {
    const studentInfoEl = document.getElementById('nav-student-info');
    const datetimeEl = document.getElementById('nav-datetime');
    
    const studentName = state.userResponses['child-name'] || '-';
    const studentInfo = `姓名: ${studentName}`;
    studentInfoEl.textContent = studentInfo;
    studentInfoEl.title = studentInfo;
    
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const datetimeString = `${dateString} ${timeString}`;
    datetimeEl.textContent = datetimeString;
    datetimeEl.title = datetimeString;
}

export function updateSurveyTimestamps() {
    const startEl = document.getElementById('toc-start-date');
    const endEl = document.getElementById('toc-end-date');
    if (startEl) {
        const startedLabel = labelTranslations.started;
        startEl.textContent = `${startedLabel}: ${state.startDate || '-'}`;
    }
    if (endEl) {
        const lastLabel = labelTranslations.lastUsed;
        endEl.textContent = `${lastLabel}: ${state.endDate || '-'}`;
    }
}
