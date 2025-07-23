import { startSurvey, showToc, toggleLanguage, navigatePage } from './navigation.js';
import { exportResponsesToCsv } from './export.js';
import { findStudent } from './id-mapping.js';
import { state } from './state.js';

export function initializeEventListeners() {
    document.getElementById('start-survey-btn').addEventListener('click', startSurvey);
    document.getElementById('home-btn').addEventListener('click', showToc);
    document.getElementById('language-toggle-checkbox').addEventListener('change', toggleLanguage);
    document.getElementById('next-btn').addEventListener('click', () => navigatePage(1));
    document.getElementById('back-btn').addEventListener('click', () => navigatePage(-1));
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportResponsesToCsv);
    }
    attachEntryFormListeners();
}

export function attachEntryFormListeners() {
    const sid = document.getElementById('student-id');
    const sch = document.getElementById('school-id');
    if (!sid || !sch) return;

    const handle = () => {
        const student = findStudent(sid.value.trim(), sch.value.trim());
        if (student) {
            const genderEl = document.getElementById('gender');
            if (genderEl) {
                genderEl.value = student.gender.toLowerCase() === 'm' ? 'male' : 'female';
                state.userResponses['gender'] = genderEl.value;
            }
            const nameEl = document.getElementById('child-name');
            if (nameEl) {
                nameEl.value = student.name;
                state.userResponses['child-name'] = student.name;
            }
        }
    };

    sid.addEventListener('blur', handle);
    sch.addEventListener('blur', handle);
}
