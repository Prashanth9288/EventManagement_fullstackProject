const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('Frontend/src');
console.log('Found ' + files.length + ' files.');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace standard strings: "http://localhost:5000 -> window.API_BASE_URL + "
  // Handling double quotes
  content = content.split('"http://localhost:5000').join('window.API_BASE_URL + "');
  
  // Handling single quotes
  content = content.split("'http://localhost:5000").join("window.API_BASE_URL + '");

  // Handling template literals: `http://localhost:5000 -> `${window.API_BASE_URL}
  content = content.split('`http://localhost:5000').join('`${window.API_BASE_URL}');

  if (content !== original) {
    console.log('Modifying:', file);
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Done.');
