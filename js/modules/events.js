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
    document.addEventListener('keydown', handleArrowNavigation);
    attachEntryFormListeners();
}

function handleArrowNavigation(e) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
    }
    if (e.key === 'ArrowLeft') {
        navigatePage(-1);
    } else if (e.key === 'ArrowRight') {
        navigatePage(1);
    }
}

let isLoadingData = false; // Flag to prevent multiple simultaneous loads

export function attachEntryFormListeners() {
    const sid = document.getElementById('student-id');
    const sch = document.getElementById('school-id');
    const loadBtn = document.getElementById('load-session-btn');
    if (!sid || !sch) return;

    const handle = () => {
        console.log('DEBUG: handle() function called - blur event triggered');
        console.log('DEBUG: Student ID value:', sid.value.trim());
        console.log('DEBUG: School ID value:', sch.value.trim());
        
        const student = findStudent(sid.value.trim(), sch.value.trim());
        if (student) {
            console.log('DEBUG: Student found:', student);
            const genderEl = document.getElementById('gender');
            if (genderEl) {
                genderEl.value = student.gender.toLowerCase() === 'm' ? 'male' : 'female';
                state.userResponses['gender'] = genderEl.value;
                console.log('DEBUG: Set gender to:', genderEl.value);
            }
            const nameEl = document.getElementById('child-name');
            if (nameEl) {
                nameEl.value = student.name;
                state.userResponses['child-name'] = student.name;
                console.log('DEBUG: Set name to:', student.name);
            }
        } else {
            console.log('DEBUG: No student found for the given IDs');
        }
        const school = findSchool(sch.value.trim());
        if (school) {
            console.log('DEBUG: School found:', school);
            const schoolNameEl = document.getElementById('school-name');
            if (schoolNameEl) {
                schoolNameEl.value = school.name;
                state.userResponses['school-name'] = school.name;
                console.log('DEBUG: Set school name to:', school.name);
            }
        } else {
            console.log('DEBUG: No school found for the given ID');
        }
    };

    // Remove existing event listeners first to prevent duplicates
    sid.removeEventListener('blur', handle);
    sch.removeEventListener('blur', handle);
    
    // Add event listeners
    sid.addEventListener('blur', handle);
    sch.addEventListener('blur', handle);

    if (loadBtn) {
        // Create a named function for the load button handler
        const loadButtonHandler = () => {
            console.log('DEBUG: Load button clicked, isLoadingData:', isLoadingData);
            
            // Prevent multiple simultaneous loads
            if (isLoadingData) {
                console.log('DEBUG: Already loading data, ignoring click');
                return;
            }
            
            isLoadingData = true;
            console.log('DEBUG: Setting isLoadingData to true');
            
            const studentId = sid.value.trim();
            if (!studentId) {
                console.log('DEBUG: No student ID provided');
                isLoadingData = false;
                alert('請先輸入學生編號。');
                return;
            }
            console.log('DEBUG: Loading autosave for student ID:', studentId);
            loadAutosave(studentId).then(saved => {
                if (saved) {
                    console.log('DEBUG: Autosave data found:', saved);
                    // Load ALL data from local storage FIRST
                    Object.assign(state.userResponses, saved.responses || {});
                    Object.assign(state.completionTimes, saved.completionTimes || {});
                    state.sectionTimestamps = saved.sectionTimestamps || {};
                    state.startDate = saved.startDate || state.startDate;
                    state.endDate = saved.endDate || state.endDate;
                    state.viewedQuestions = saved.viewedQuestions || {};
                    state.completed = saved.completed || false;
                    console.log('DEBUG: State updated with loaded data');
                    
                    // Temporarily remove event listeners to prevent interference
                    console.log('DEBUG: Removing blur event listeners');
                    sid.removeEventListener('blur', handle);
                    sch.removeEventListener('blur', handle);
                    
                    // THEN populate form fields
                    console.log('DEBUG: Starting form field population');
                    const bg = state.surveySections['background'];
                    if (bg && bg.entryForm) {
                        bg.entryForm.forEach(field => {
                            const el = document.getElementById(field.id);
                            if (el && state.userResponses[field.id]) {
                                console.log(`DEBUG: Populating field ${field.id} with value:`, state.userResponses[field.id]);
                                el.value = state.userResponses[field.id];
                            }
                        });
                    }
                    console.log('DEBUG: Form field population completed');
                    
                    // Re-attach event listeners after a short delay
                    setTimeout(() => {
                        console.log('DEBUG: Re-attaching blur event listeners');
                        sid.addEventListener('blur', handle);
                        sch.addEventListener('blur', handle);
                    }, 100);
                    
                    console.log('DEBUG: About to show success alert');
                    alert('已載入上次的資料。');
                    console.log('DEBUG: Success alert shown');
                } else {
                    console.log('DEBUG: No autosave data found for student ID:', studentId);
                    alert('未找到此學生編號的存檔。');
                }
                
                // Reset the flag
                isLoadingData = false;
                console.log('DEBUG: Setting isLoadingData to false');
            }).catch(err => {
                console.error('DEBUG: Error loading session:', err);
                // Reset the flag on error too
                isLoadingData = false;
                console.log('DEBUG: Setting isLoadingData to false due to error');
                console.error('Error loading session:', err);
            });
        };
        
        // Store the handler reference on the button to allow proper removal
        if (loadBtn._loadHandler) {
            loadBtn.removeEventListener('click', loadBtn._loadHandler);
        }
        loadBtn._loadHandler = loadButtonHandler;
        loadBtn.addEventListener('click', loadButtonHandler);
    }
}
