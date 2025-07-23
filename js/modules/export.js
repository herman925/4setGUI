import { state } from './state.js';

export function exportResponsesToCsv() {
    const combined = { ...state.userResponses };
    for (const section in state.completionTimes) {
        combined[`completed_${section}`] = state.completionTimes[section];
    }
    const headers = Object.keys(combined);
    const rows = [headers, headers.map(h => combined[h] ?? '')];
    const csvContent = rows
        .map(row => row.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'responses.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
