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
const requiredModal = document.getElementById('required-section-modal');

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
            formGroup.appendChild(input);
        } else if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.id;
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label[state.currentLanguage];
                select.appendChild(opt);
            });
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

    logDebug(`renderToc: state.backgroundCompleted is ${state.backgroundCompleted}`);

    const createTocItem = (section, isEnabled) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item';
        if (!isEnabled) {
            tocItem.classList.add('disabled');
        }
        tocItem.dataset.section = section.id;
        tocItem.innerHTML = `
            <div class="toc-item-title">${section.title[state.currentLanguage] || section.title.en || section.id}</div>
            <div class="toc-item-arrow">→</div>
        `;
        if (isEnabled) {
            tocItem.addEventListener('click', () => {
                logDebug('TOC item clicked:', section.id);
                navigateToSection(section.id);
            });
        } else {
            tocItem.addEventListener('click', () => {
                logDebug('Disabled TOC item clicked, showing modal');
                showRequiredModal();
            });
        }
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
                const isEnabled = set.order === 1 || state.backgroundCompleted;
                logDebug(`renderToc:   - Section: ${sectionId}, Enabled: ${isEnabled}`);
                const tocItem = createTocItem(section, isEnabled);
                setContainer.appendChild(tocItem);
            } else {
                logDebug(`renderToc:   - Section data for ${sectionId} not found in state.surveySections.`);
            }
        });
        tocList.appendChild(setContainer);
    });
    logDebug('renderToc: Finished rendering TOC.');
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

export function showRequiredModal() {
    if (requiredModal) {
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        if (state.currentLanguage === 'zh') {
            modalTitle.textContent = '必須完成的部分';
            modalText.textContent = '請先完成背景問卷部分。';
            modalCloseBtn.textContent = '明白';
        } else {
            modalTitle.textContent = 'Required Section';
            modalText.textContent = 'Please complete the background section first.';
            modalCloseBtn.textContent = 'I Understand';
        }

        requiredModal.classList.remove('hidden');
    }
}

export function hideRequiredModal() {
    if (requiredModal) {
        requiredModal.classList.add('hidden');
    }
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
