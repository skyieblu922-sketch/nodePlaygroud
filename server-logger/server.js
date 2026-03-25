const http = require('http');
const fs = require('fs');
const path = require('path');
const { memoryUsage } = require('process');
const os = require('os');

const server = http.createServer(async(req, res) => {
    //Logic server
});

server.listen(3000, () => {
     console.log('Server running on port 3000');
});

async function logRequest(req) {
    const timestamp = new Date().toISOString();
    const logData = `[${timestamp}] ${req.method} ${req.url} FROM ${req.socket.remoteAddress}\n`;
    
    const logPath = path.join(__dirname, 'requests.log');
    
    try {
      await fs.appendFile(logPath, logData, (err) => {
        if (err) throw err;
        console.log('File has been append');
      });
    } catch (error) {
      console.error('Logging error:', error);
    }
  }

const monitor = require('./monitor.js')

server.on('request', async(req, res) => {
    logRequest(req);

    if (req.url === '/'){
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        res.end('Home Page');
    }
    if (req.url === "/health"){
        const memmory = {
            total: monitor.formatBytes(os.totalmem()),
            used: monitor.formatBytes(os.totalmem() - os.freemem()),
            free: monitor.formatBytes(os.freemem())
        };

        res.writeHead(200, {'Content-Type' : 'application/json'});
        return res.end(JSON.stringify(memmory));
    }
    else {
        res.writeHead(404);
        res.end('Page Not Found');
    }
});
