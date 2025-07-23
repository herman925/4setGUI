export const idMapping = {
    students: {},
    schools: {}
};

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h.trim()] = (values[idx] || '').trim();
        });
        return obj;
    });
}

export function loadIdMappings() {
    const studentPromise = fetch('assets/id_mapping/coreid.csv')
        .then(res => res.text())
        .then(txt => {
            const rows = parseCSV(txt);
            rows.forEach(r => {
                const sid = (r['Student ID Copy'] || '').replace(/^[^0-9]*/, '');
                idMapping.students[sid] = {
                    name: r['Student Name'] || '',
                    schoolId: r['School ID'] || '',
                    gender: r['Gender'] || ''
                };
            });
        });

    const schoolPromise = fetch('assets/id_mapping/schoolid.csv')
        .then(res => res.text())
        .then(txt => {
            const rows = parseCSV(txt);
            rows.forEach(r => {
                idMapping.schools[r['School ID']] = {
                    name: r['School Name (Chinese)'] || ''
                };
            });
        });

    return Promise.all([studentPromise, schoolPromise]);
}

export function findStudent(studentId, schoolId) {
    const sid = String(studentId).replace(/^[^0-9]*/, '');
    const student = idMapping.students[sid];
    if (student && (!schoolId || student.schoolId === schoolId)) {
        return student;
    }
    return null;
}

export function findSchool(schoolId) {
    return idMapping.schools[schoolId] || null;
}
