const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT;

// Directory where files are stored
const filesDirectory = path.join(__dirname, 'files');

// Middleware to serve static files (this is optional if you want to serve other static files like CSS/JS)
app.use(express.static('public'));

// Route to show list of files
app.get('/', (req, res) => {
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files!');
        }

        let fileList = '<h2>File List</h2><ul>';
        files.forEach(file => {
            fileList += `<li><a href="/download/${file}">${file}</a></li>`;
        });
        fileList += '</ul>';

        res.send(fileList);
    });
});

// Route to download a file
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(filesDirectory, fileName);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.download(filePath); // This sets headers to force download
    } else {
        res.status(404).send('File not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});