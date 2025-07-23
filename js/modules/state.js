export const state = {
    currentLanguage: 'zh', // 'zh' or 'en'
    surveyStructure: null,
    surveySections: {},
    currentPage: 0,
    currentSectionId: null,
    userResponses: {
        'q1_child_name': '',
        'q2_child_age': ''
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
