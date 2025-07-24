export const terminationRules = {
    erv: [
        {
            terminationId: 'ERV_Ter1',
            startId: 'ERV_1',
            endId: 'ERV_12',
            minScore: 5
        },
        {
            terminationId: 'ERV_Ter2',
            startId: 'ERV_13',
            endId: 'ERV_24',
            minScore: 5
        },
        {
            terminationId: 'ERV_Ter3',
            startId: 'ERV_25',
            endId: 'ERV_36',
            minScore: 5
        }
    ],
    cm: [
        {
            terminationId: 'CM_Ter1',
            startId: 'CM_1',
            endId: 'CM_7',
            minScore: 4
        },
        {
            terminationId: 'CM_Ter2',
            startId: 'CM_8',
            endId: 'CM_12',
            minScore: 4
        },
        {
            terminationId: 'CM_Ter3',
            startId: 'CM_13',
            endId: 'CM_17',
            minScore: 4
        },
        {
            terminationId: 'CM_Ter4',
            startId: 'CM_18',
            endId: 'CM_22',
            minScore: 4
        },
        {
            terminationId: 'CM_S5',
            startId: 'CM_23',
            endId: 'CM_27',
            minScore: 0
        }
    ]
};

import { state } from './state.js';

export function calculateScore(sectionId, startId, endId) {
    const section = state.surveySections[sectionId];
    if (!section || !section.questions) return 0;
    const startIndex = section.questions.findIndex(q => q.id === startId);
    const endIndex = section.questions.findIndex(q => q.id === endId);
    if (startIndex === -1 || endIndex === -1) return 0;
    let score = 0;
    for (let i = startIndex; i <= endIndex; i++) {
        const q = section.questions[i];
        if (!q || !q.scoring) continue;
        const resp = state.userResponses[q.id];
        if (resp !== undefined && resp === q.scoring.correctAnswer) {
            score += 1;
        }
    }
    return score;
}

export function evaluateTermination(sectionId, questionId) {
    const rules = terminationRules[sectionId];
    if (!rules) return null;
    const rule = rules.find(r => r.terminationId === questionId);
    if (!rule) return null;
    const total = calculateScore(sectionId, rule.startId, rule.endId);
    const allowNext = total >= rule.minScore;
    let message;
    if (sectionId === 'cm') {
        const partMatch = /CM_(?:Ter|S)(\d+)/i.exec(rule.terminationId);
        const part = partMatch ? partMatch[1] : '';
        if (rule.terminationId === 'CM_S5') {
            message = `Part ${part} 得分：${total}`;
        } else if (allowNext) {
            message = `Part ${part} 得分：${total}\n再按右下方箭頭（➜）進入下一環節。`;
        } else {
            message = `Part ${part} 得分：${total}\n該測試已完成，按此結束該測試。`;
        }
>>>>>>> master
    } else {
        message = allowNext
            ? '該部分得分多於 4 分，請按此繼續測試。'
            : '該部分得分少於 5 分，該測試已完成，按此結束該測試。';
    }
    return { id: questionId, allowNext, message };
}
