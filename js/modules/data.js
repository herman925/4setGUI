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
            
            const loadPromises = state.sectionFiles.map(file =>
                fetch(`assets/${file}`)
                    .then(response => response.json())
                    .then(data => {
                        const sectionId = file.replace('.json', '');
                        state.surveySections[sectionId] = data;
                    })
                    .catch(error => {
                        console.error(`Error loading section data for ${file}:`, error);
                        const sectionId = file.replace('.json', '');
                        state.surveySections[sectionId] = { id: sectionId, title: { en: 'Error', zh: '錯誤' }, questions: [] };
                    })
            );

            return Promise.all(loadPromises);
        });
}

export function loadSectionData(sectionId) {
    if (state.surveySections[sectionId]) {
        return Promise.resolve(state.surveySections[sectionId]);
    }
    const file = `${sectionId}.json`;
    return fetch(`assets/${file}`)
        .then(response => response.json())
        .then(data => {
            state.surveySections[sectionId] = data;
            return data;
        })
        .catch(error => {
            console.error(`Error loading section data for ${file}:`, error);
            const fallback = { id: sectionId, title: { en: 'Error', zh: '錯誤' }, questions: [] };
            state.surveySections[sectionId] = fallback;
            return fallback;
        });
}
