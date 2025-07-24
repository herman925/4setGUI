import { state } from './state.js';
import { evaluateTermination, terminationRules, calculateScore } from './terminations.js';

const debugInfoEl = document.getElementById('debug-info');

function updateDebugInfo(questionId) {
    if (!debugInfoEl) return;

    const sectionId = state.currentSectionId;
    if (!state.debugMode || (sectionId !== 'erv' && sectionId !== 'cm' && sectionId !== 'finemotor')) {
        debugInfoEl.textContent = '';
        return;
    }

    const rules = terminationRules[sectionId];
    const section = state.surveySections[sectionId];
    if (!rules || !section) {
        debugInfoEl.textContent = '';
        return;
    }

    const idx = section.questions.findIndex(q => q.id === questionId);
    if (idx === -1) {
        debugInfoEl.textContent = '';
        return;
    }

    let currentRule = null;
    for (const rule of rules) {
        const startIdx = section.questions.findIndex(q => q.id === rule.startId);
        const endIdx = section.questions.findIndex(q => q.id === rule.endId);
        const termIdx = section.questions.findIndex(q => q.id === rule.terminationId);
        if ((idx >= startIdx && idx <= endIdx) || idx === termIdx) {
            currentRule = rule;
            break;
        }
    }

    if (!currentRule) {
        debugInfoEl.textContent = '';
        return;
    }

    const score = calculateScore(sectionId, currentRule.startId, currentRule.endId);
    const needed = currentRule.minScore - score;
    const message = needed > 0 ? `還需要 ${needed} 分` : '已達標';
    
    if (sectionId === 'cm') {
        const partMatch = /CM_(?:Ter|S)(\d+)/i.exec(currentRule.terminationId);
        const part = partMatch ? partMatch[1] : '';
        debugInfoEl.textContent = `CM 第 ${part} 部分分數：${score} / ${currentRule.minScore}，${message}`;
    } else {
        const label = sectionId === 'erv' ? 'ERV' : sectionId === 'finemotor' ? 'FM' : sectionId;
        debugInfoEl.textContent = `${label} 分數：${score} / ${currentRule.minScore}，${message}`;
    }
}

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
            emphasize: 'emphasize',
            word_compound: 'highlight-word-compound',
            blue: 'highlight-blue',
            orange: 'highlight-orange',
            blue_text: 'text-blue',
            orange_text: 'text-orange'
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
const questionIdDisplay = document.getElementById('question-id-display');

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

    const terminationInfo = evaluateTermination(section.id, question.id);
    if (terminationInfo) {
        state.pendingTermination = terminationInfo;
    } else {
        state.pendingTermination = null;
    }

    const labelText = terminationInfo ? terminationInfo.message : question.label;

    if (!state.viewedQuestions) {
        state.viewedQuestions = {};
    }
    state.viewedQuestions[question.id] = true;

    questionContainer.innerHTML = ''; // Clear previous question

    // Update header
    currentSectionDisplay.textContent = section.title;
    pageInfo.textContent = `第 ${state.currentPage + 1} 頁，共 ${section.questions.length} 頁`;
    if (questionIdDisplay) {
        questionIdDisplay.textContent = question.id;
    }

    // Render the question itself
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'question';
    // expose section id as data attribute for styling hooks
    if (section && section.id) {
        questionWrapper.dataset.sectionId = section.id;
    }

    if (labelText) {
        const label = document.createElement('label');
        label.htmlFor = question.id;
        label.classList.add('attention', 'question-label');
        label.innerHTML = formatLabel(labelText);
        questionWrapper.appendChild(label);
    }

    if (question.media && question.media.audio) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = `assets/${question.media.audio}`;
        audio.classList.add('question-audio');
        questionWrapper.appendChild(audio);
    }

    if (question.media && question.media.image) {
        const img = document.createElement('img');
        img.src = `assets/${question.media.image}`;
        img.classList.add('question-image');
        questionWrapper.appendChild(img);
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
            radioGroup.classList.add('radio-group');
            question.options.forEach(opt => {
                const labelEl = document.createElement('label');
                labelEl.classList.add('option-label', 'answer');
                if (state.debugMode && question.scoring && question.scoring.correctAnswer === opt.value) {
                    labelEl.classList.add('correct-option');
                }
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
                if (state.debugMode && question.scoring && question.scoring.correctAnswer === opt.value) {
                    labelImg.classList.add('correct-option');
                }
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
    updateDebugInfo(question.id);
}