import { startSurvey, showToc, navigatePage } from './navigation.js';
import { exportResponsesToCsv } from './export.js';
import { findStudent, findSchool } from './id-mapping.js';
import { loadAutosave } from './autosave.js';
import { state } from './state.js';

export function initializeEventListeners() {
    document.getElementById('start-survey-btn').addEventListener('click', startSurvey);
    document.getElementById('home-btn').addEventListener('click', showToc);
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
                alert('請先輸入學生編號。');
                return;
            }
            loadAutosave(studentId).then(saved => {
                if (saved) {
                    // Load ALL data from local storage FIRST
                    Object.assign(state.userResponses, saved.responses || {});
                    Object.assign(state.completionTimes, saved.completionTimes || {});
                    state.sectionTimestamps = saved.sectionTimestamps || {};
                    state.startDate = saved.startDate || state.startDate;
                    state.endDate = saved.endDate || state.endDate;
                    state.viewedQuestions = saved.viewedQuestions || {};
                    state.completed = saved.completed || false;
                    
                    // THEN populate form fields
                    const bg = state.surveySections['background'];
                    if (bg && bg.entryForm) {
                        bg.entryForm.forEach(field => {
                            const el = document.getElementById(field.id);
                            if (el && state.userResponses[field.id]) {
                                el.value = state.userResponses[field.id];
                            }
                        });
                    }
                    alert('已載入上次的資料。');
                } else {
                    alert('未找到此學生編號的存檔。');
                }
            }).catch(err => console.error('Error loading session:', err));
        });
    }
}
