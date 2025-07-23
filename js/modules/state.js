export const state = {
    currentLanguage: 'zh', // 'zh' or 'en'
    surveyStructure: null,
    surveySections: {},
    currentPage: 0,
    currentSectionId: null,
    userResponses: {
        'child-name': '',
        'gender': '',
        'student-id': '',
        'school-id': '',
        'school-name': ''
    },
    completionTimes: {},
    startDate: null,
    endDate: null,
    viewedQuestions: {},
    completed: false,
    infoDisplayInterval: null,
    debugMode: false
};

export function formatTimestamp(date) {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function logDebug(...args) {
    if (state.debugMode) {
        console.log('[DEBUG]', ...args);
    }
}
