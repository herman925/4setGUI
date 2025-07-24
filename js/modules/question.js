import { state } from './state.js';

function formatLabel(label) {
    if (typeof label === 'string') {
        return (label || '').replace(/\n/g, '<br>');
    }

    if (typeof label === 'object' && label !== null) {
        let text = (label.zh || label.en || '').replace(/\n/g, '<br>');
        const mappings = {
            attention: 'highlight-attention',
            instruction: 'highlight-instruction',
            target: 'highlight-target',
            word_compound: 'highlight-word-compound'
        };
        for (const key of Object.keys(mappings)) {
            if (label[key]) {
                const val = label[key];
                const span = `<span class="${mappings[key]}">${val}</span>`;
                // replace first occurrence only
                text = text.replace(val, span);
            }
        }
        return text;
    }
    return '';
}

const questionContainer = document.getElementById('question-container');
const currentSectionDisplay = document.getElementById('current-section-display');
const pageInfo = document.getElementById('page-info');

export function renderCurrentQuestion() {
    const section = state.surveySections[state.currentSectionId];
    if (!section || !section.questions) {
        questionContainer.innerHTML = 'Error: Section or questions not found.';
        return;
    }
    
    const question = section.questions[state.currentPage];
    if (!question) {
        questionContainer.innerHTML = 'Error: Question not found.';
        return;
    }

    if (!state.viewedQuestions) {
        state.viewedQuestions = {};
    }
    state.viewedQuestions[question.id] = true;

    questionContainer.innerHTML = ''; // Clear previous question

    // Update header
    currentSectionDisplay.textContent = section.title;
    pageInfo.textContent = `第 ${state.currentPage + 1} 頁，共 ${section.questions.length} 頁`;

    // Render the question itself
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'question';

    if (question.label) {
        const label = document.createElement('label');
        label.htmlFor = question.id;
        label.classList.add('attention', 'question-label');
        label.innerHTML = formatLabel(question.label);
        questionWrapper.appendChild(label);
    }

    // Render based on question type
    switch (question.type) {
        case 'instruction':
            // Read-only instruction type - no input needed, no additional text
            break;
        case 'text':
            const input = document.createElement('input');
            input.type = question.inputType || 'text';
            input.id = question.id;
            input.name = question.id;
            input.classList.add('answer');
            // Pre-fill with existing response if available
            if (state.userResponses[question.id]) {
                input.value = state.userResponses[question.id];
            }
            questionWrapper.appendChild(input);
            break;
        case 'radio':
            const radioGroup = document.createElement('div');
            question.options.forEach(opt => {
                const labelEl = document.createElement('label');
                labelEl.classList.add('option-label', 'answer');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = question.id;
                radio.value = opt.value;
                if (state.userResponses[question.id] === opt.value) {
                    radio.checked = true;
                }
                const optLabel = document.createElement('span');
                optLabel.classList.add('answer');
                optLabel.innerHTML = formatLabel(opt.label);
                labelEl.appendChild(radio);
                labelEl.appendChild(optLabel);
                radioGroup.appendChild(labelEl);
            });
            questionWrapper.appendChild(radioGroup);
            break;
        case 'image-choice':
            const imgGroup = document.createElement('div');
            imgGroup.classList.add('image-choice-group');
            question.options.forEach(opt => {
                const labelImg = document.createElement('label');
                labelImg.classList.add('option-label', 'answer', 'image-choice-option');
                const radioImg = document.createElement('input');
                radioImg.type = 'radio';
                radioImg.name = question.id;
                radioImg.value = opt.value;
                if (state.userResponses[question.id] === opt.value) {
                    radioImg.checked = true;
                }
                const img = document.createElement('img');
                if (opt.media && opt.media.image) {
                    img.src = `assets/${opt.media.image}`;
                }
                labelImg.appendChild(radioImg);
                labelImg.appendChild(img);
                imgGroup.appendChild(labelImg);
            });
            questionWrapper.appendChild(imgGroup);
            break;
        // Add more cases for 'select', 'radio', 'checkbox', etc. here
        default:
            const notImplemented = document.createElement('p');
            notImplemented.textContent = `Question type "${question.type}" is not yet implemented.`;
            questionWrapper.appendChild(notImplemented);
    }

    questionContainer.appendChild(questionWrapper);
}
