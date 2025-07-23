import { state, formatTimestamp } from './state.js';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
const END_UPDATE_INTERVAL = 60000; // 60 seconds
let autosaveTimer = null;
let endDateTimer = null;

export function startAutosave() {
    if (autosaveTimer) return;
    autosaveTimer = setInterval(saveToLocal, AUTOSAVE_INTERVAL);
    endDateTimer = setInterval(updateEndDate, END_UPDATE_INTERVAL);
}

export function stopAutosave() {
    if (autosaveTimer) {
        clearInterval(autosaveTimer);
        autosaveTimer = null;
    }
    if (endDateTimer) {
        clearInterval(endDateTimer);
        endDateTimer = null;
    }
}

function updateEndDate() {
    if (state.completed) return;
    state.endDate = formatTimestamp(new Date());
    saveToLocal();
}

export function saveToLocal() {
    const studentId = state.userResponses['student-id'];
    if (!studentId) return;
    const data = {
        responses: state.userResponses,
        completionTimes: state.completionTimes,
        startDate: state.startDate,
        endDate: state.endDate,
        viewedQuestions: state.viewedQuestions,
        completed: state.completed
    };
    localforage.setItem(`autosave_${studentId}`, data).catch(console.error);
}

export function loadAutosave(studentId) {
    return localforage.getItem(`autosave_${studentId}`);
}
