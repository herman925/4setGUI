import { state, logDebug } from './state.js';
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
        label.textContent = field.label[state.currentLanguage];
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
            input.placeholder = field.placeholder[state.currentLanguage];
            if (state.userResponses[field.id]) {
                input.value = state.userResponses[field.id];
            }
            formGroup.appendChild(input);
            if (field.id === 'student-id') {
                const loadBtn = document.createElement('button');
                loadBtn.type = 'button';
                loadBtn.id = 'load-session-btn';
                loadBtn.textContent = state.currentLanguage === 'en' ? 'Load Previous Session' : '載入上次資料';
                formGroup.appendChild(loadBtn);
            }
        } else if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.id;
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label[state.currentLanguage];
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
        tocItem.innerHTML = `
            <div class="toc-item-title">${section.title[state.currentLanguage] || section.title.en || section.id}</div>
            <div class="toc-item-progress">${answered}/${total}</div>
            <div class="toc-item-arrow">→</div>
        `;
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
        if (set.name && typeof set.name === 'object') {
            setTitle.textContent = set.name[state.currentLanguage] || set.name.en;
        } else {
            setTitle.textContent = set.id || 'Unnamed Set';
            console.warn("A set in survey-structure.json is missing a 'name' object:", set);
        }
        setContainer.appendChild(setTitle);

        set.sections.forEach(sectionInfo => {
            const sectionId = sectionInfo.file.replace('.json', '');
            if (sectionId === 'background') return; // skip background section in TOC
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
        setLink.textContent = set.name[state.currentLanguage] || set.name.en;
        setLink.addEventListener('click', (e) => e.preventDefault());
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';

        set.sections.forEach(sectionObj => {
            const sectionId = sectionObj.file.replace('.json', '').toLowerCase();
            const section = state.surveySections[sectionId];
            if (section) {
                const dropdownItem = document.createElement('a');
                dropdownItem.href = '#';
                dropdownItem.className = 'dropdown-item';
                dropdownItem.textContent = section.title[state.currentLanguage] || section.title.en;
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
    
    const studentName = state.userResponses['child-name'] || 'N/A';
    const studentInfo = `Name: ${studentName}`;
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
        startEl.textContent = `Started: ${state.startDate || '-'}`;
    }
    if (endEl) {
        endEl.textContent = `Last Used: ${state.endDate || '-'}`;
    }
}
