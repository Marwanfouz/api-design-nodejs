const http = require('http');

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    const clientIp = req.socket.remoteAddress; // Get client IP
    console.log(`Client IP: ${clientIp}`);
    res.end();
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});