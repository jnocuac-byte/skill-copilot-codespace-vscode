// Create web server

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// Helper function to read comments from file
function readComments() {
    if (!fs.existsSync(COMMENTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(COMMENTS_FILE);
    return JSON.parse(data);
}

// Helper function to write comments to file
function writeComments(comments) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
}

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/comments') {
        const comments = readComments();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
    } else if (req.method === 'POST' && req.url === '/comments') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newComment = JSON.parse(body);
            const comments = readComments();
            comments.push(newComment);
            writeComments(comments);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newComment));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});