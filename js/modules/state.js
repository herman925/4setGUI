export const state = {
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
    sectionTimestamps: {},
    startDate: null,
    endDate: null,
    viewedQuestions: {},
    completed: false,
    infoDisplayInterval: null,
    debugMode: false,
    pendingTermination: null,
    timerSection: null,
    autoNext: false
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

export const labelTranslations = {
    started: '開始',
    lastUsed: '最後使用'
};
