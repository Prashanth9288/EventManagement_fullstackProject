const fs = require('fs');
const path = require('path');

try {
    function walk(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            const stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(file));
            } else {
                if (file.endsWith('.jsx') || file.endsWith('.js')) {
                    results.push(file);
                }
            }
        });
        return results;
    }

    // Use absolute path to avoid ambiguity
    const rootDir = path.resolve('Frontend/src');
    console.log('Scanning:', rootDir);
    const files = walk(rootDir);
    console.log('Found ' + files.length + ' files.');

    let modifiedCount = 0;
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Replace
        content = content.split('"http://localhost:5000').join('window.API_BASE_URL + "');
        content = content.split("'http://localhost:5000").join("window.API_BASE_URL + '");
        content = content.split('`http://localhost:5000').join('`${window.API_BASE_URL}');

        if (content !== original) {
            console.log('Fixed:', path.basename(file));
            fs.writeFileSync(file, content, 'utf8');
            modifiedCount++;
        }
    });
    console.log('Total files modified:', modifiedCount);

} catch (e) {
    console.error('Error:', e);
}
