import { state, logDebug } from './state.js';
import { renderCurrentQuestion } from './question.js';

export function initializeDebug() {
    const trigger = document.getElementById('debug-trigger');
    const controls = document.getElementById('debug-controls');
    const addBtn = document.getElementById('add-question-btn');

    if (trigger) {
        trigger.addEventListener('click', () => {
            const pwd = prompt('Enter debug password');
            if (pwd === 'ks2.0') {
                state.debugMode = true;
                document.body.classList.add('debug-mode');
                if (controls) controls.classList.remove('hidden');
                logDebug('Debug mode enabled');
            }
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (!state.currentSectionId) return;
            const section = state.surveySections[state.currentSectionId];
            if (!section) return;
            const id = prompt('Question ID?');
            if (!id) return;
            const type = prompt('Question Type (text, radio, image-choice)?', 'text');
            const labelEn = prompt('Label (English)') || '';
            const labelZh = prompt('Label (Chinese)') || '';
            const q = { id, type, label: { en: labelEn, zh: labelZh } };
            if (type === 'radio' || type === 'image-choice') {
                const count = parseInt(prompt('Number of options?'), 10) || 0;
                q.options = [];
                for (let i=0;i<count;i++) {
                    const val = prompt(`Option ${i+1} value`);
                    const optEn = prompt(`Option ${i+1} label (EN)`);
                    const optZh = prompt(`Option ${i+1} label (ZH)`);
                    const opt = { value: val, label: { en: optEn || '', zh: optZh || '' } };
                    if (type === 'image-choice') {
                        const img = prompt(`Option ${i+1} image file name (in assets/images)`);
                        if (img) opt.media = { image: `images/${img}` };
                    }
                    q.options.push(opt);
                }
            }
            section.questions.push(q);
            renderCurrentQuestion();
            logDebug('Question added via debug UI', q);
        });
    }
}
