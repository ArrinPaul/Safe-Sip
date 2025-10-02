// Ultra-basic server test
const http = require('http');

console.log('Creating basic HTTP server...');

const server = http.createServer((req, res) => {
    console.log('Request received:', req.method, req.url);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        message: 'Basic server working!',
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
    }));
});

const PORT = 5001;

server.listen(PORT, (err) => {
    if (err) {
        console.error('Server failed to start:', err);
        process.exit(1);
    }
    console.log(`✅ Basic server running on port ${PORT}`);
    console.log(`🌐 Test at: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});