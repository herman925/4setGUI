import { state } from './state.js';

export function fetchSurveyData() {
    return fetch('assets/survey-structure.json')
        .then(response => response.json())
        .then(structure => {
            state.surveyStructure = structure;
            state.surveyStructure.sets.sort((a, b) => a.order - b.order);
            
            state.sectionFiles = [];
            structure.sets.forEach(set => {
                set.sections.sort((a, b) => a.order - b.order);
                const setFiles = set.sections.map(section => section.file);
                state.sectionFiles = state.sectionFiles.concat(setFiles);
            });

            // Always include background.json so the entry form is loaded
            if (!state.sectionFiles.includes('background.json')) {
                state.sectionFiles.unshift('background.json');
            }
            
            const loadPromises = state.sectionFiles.map(file =>
                fetch(`assets/tasks/${file}`)
                    .then(response => response.json())
                    .then(data => {
                        const sectionId = file.replace('.json', '');
                        state.surveySections[sectionId] = data;
                    })
                    .catch(error => {
                        console.error(`Error loading section data for ${file}:`, error);
                        const sectionId = file.replace('.json', '');
                        state.surveySections[sectionId] = { id: sectionId, title: '錯誤', questions: [] };
                    })
            );

            return Promise.all(loadPromises).then(() => {
                return fetch('assets/tasks/NONSYM.json')
                    .then(resp => resp.json())
                    .then(nonsym => {
                        if (state.surveySections['sym']) {
                            state.surveySections['sym'].questions = state.surveySections['sym'].questions.concat(nonsym.questions);
                        }
                        state.surveySections['nonsym'] = nonsym;
                    });
            });
        });
}

export function loadSectionData(sectionId) {
    if (state.surveySections[sectionId]) {
        return Promise.resolve(state.surveySections[sectionId]);
    }
    const file = `${sectionId}.json`;
    return fetch(`assets/tasks/${file}`)
        .then(response => response.json())
        .then(data => {
            state.surveySections[sectionId] = data;
            return data;
        })
        .catch(error => {
            console.error(`Error loading section data for ${file}:`, error);
            const fallback = { id: sectionId, title: '錯誤', questions: [] };
            state.surveySections[sectionId] = fallback;
            return fallback;
        });
}
