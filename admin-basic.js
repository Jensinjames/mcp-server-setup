// admin-basic.js
const express = require('express');
const app = express();
const port = 3001;

// Serve static files
app.use(express.static('public'));

// Basic HTML response
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MCP Admin Console</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .card {
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="mb-4">MCP Admin Console</h1>
        
        <div class="alert alert-success">
          <strong>Success!</strong> The basic admin console is running.
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Models</h5>
              </div>
              <div class="card-body">
                <p>Total Models: 3</p>
                <ul>
                  <li>GPT-4 (OpenAI)</li>
                  <li>Claude 3 Opus (Anthropic)</li>
                  <li>Llama 3 70B (Meta)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0">Users</h5>
              </div>
              <div class="card-body">
                <p>Total Users: 2</p>
                <ul>
                  <li>admin (Admin)</li>
                  <li>user (User)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">System</h5>
              </div>
              <div class="card-body">
                <p>Status: Online</p>
                <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
                <p>Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <p>This is a basic version of the MCP Admin Console. For the full version, please fix the TypeScript errors in the main admin console.</p>
        </div>
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Basic MCP Admin Console running at http://localhost:${port}`);
});
