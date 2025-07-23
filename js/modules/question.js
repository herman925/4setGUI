import { state } from './state.js';

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

    questionContainer.innerHTML = ''; // Clear previous question

    // Update header
    currentSectionDisplay.textContent = section.title[state.currentLanguage] || section.title.en;
    pageInfo.textContent = `Page ${state.currentPage + 1} of ${section.questions.length}`;

    // Render the question itself
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'question';

    if (question.label) {
        const label = document.createElement('label');
        label.htmlFor = question.id;
        label.textContent = question.label[state.currentLanguage] || question.label.en;
        questionWrapper.appendChild(label);
    }

    // Render based on question type
    switch (question.type) {
        case 'text':
            const input = document.createElement('input');
            input.type = question.inputType || 'text';
            input.id = question.id;
            input.name = question.id;
            // Pre-fill with existing response if available
            if (state.userResponses[question.id]) {
                input.value = state.userResponses[question.id];
            }
            questionWrapper.appendChild(input);
            break;
        // Add more cases for 'select', 'radio', 'checkbox', etc. here
        default:
            const notImplemented = document.createElement('p');
            notImplemented.textContent = `Question type "${question.type}" is not yet implemented.`;
            questionWrapper.appendChild(notImplemented);
    }

    questionContainer.appendChild(questionWrapper);
}
