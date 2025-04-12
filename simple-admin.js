// simple-admin.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3003; // Use a different port

// Serve static files
app.use(express.static('public'));

// Serve the admin.html file at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Simple MCP Admin Console running at http://localhost:${port}`);
});
