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
    infoDisplayInterval: null,
    debugMode: false
};

export function logDebug(...args) {
    if (state.debugMode) {
        console.log('[DEBUG]', ...args);
    }
}
