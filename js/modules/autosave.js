import { state } from './state.js';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds
let autosaveTimer = null;

export function startAutosave() {
    if (autosaveTimer) return;
    autosaveTimer = setInterval(saveToLocal, AUTOSAVE_INTERVAL);
}

export function saveToLocal() {
    const studentId = state.userResponses['student-id'];
    if (!studentId) return;
    const data = {
        responses: state.userResponses,
        completionTimes: state.completionTimes
    };
    localforage.setItem(`autosave_${studentId}`, data).catch(console.error);
}

export function loadAutosave(studentId) {
    return localforage.getItem(`autosave_${studentId}`);
}
