import { startSurvey, showToc, toggleLanguage, navigatePage } from './navigation.js';
import { exportResponsesToCsv } from './export.js';
import { findStudent, findSchool } from './id-mapping.js';
import { loadAutosave } from './autosave.js';
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
    const loadBtn = document.getElementById('load-session-btn');
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
        const school = findSchool(sch.value.trim());
        if (school) {
            const schoolNameEl = document.getElementById('school-name');
            if (schoolNameEl) {
                schoolNameEl.value = school.name;
                state.userResponses['school-name'] = school.name;
            }
        }
    };

    sid.addEventListener('blur', handle);
    sch.addEventListener('blur', handle);

    if (loadBtn) {
        loadBtn.addEventListener('click', () => {
            const studentId = sid.value.trim();
            if (!studentId) {
                alert('Please enter Student ID first.');
                return;
            }
            loadAutosave(studentId).then(saved => {
                if (saved) {
                    Object.assign(state.userResponses, saved.responses || {});
                    Object.assign(state.completionTimes, saved.completionTimes || {});
                    const bg = state.surveySections['background'];
                    if (bg && bg.entryForm) {
                        bg.entryForm.forEach(field => {
                            const el = document.getElementById(field.id);
                            if (el && state.userResponses[field.id]) {
                                el.value = state.userResponses[field.id];
                            }
                        });
                    }
                    alert('Previous session loaded.');
                } else {
                    alert('No saved session found for this Student ID.');
                }
            }).catch(err => console.error('Error loading session:', err));
        });
    }
}
