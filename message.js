const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      fs.writeFile('message.txt', message, err => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html');
          res.write('<html>');
          res.write('<head><title>Error</title></head>');
          res.write('<body><h1>Could not save the message</h1></body>');
          res.write('</html>');
          return res.end();
        }

        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  if (url === '/display') {
    fs.readFile('message.txt', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Error</title></head>');
        res.write('<body><h1>Could not read the message</h1></body>');
        res.write('</html>');
        return res.end();
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>Display Message</title></head>');
      res.write(`<body><h1>Message: ${data}</h1></body>`);
      res.write('</html>');
      return res.end();
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body>');
  res.write('<h1>Hello from my Node.js Server!</h1>');
  res.write('<a href="/display">Display Message</a>');
  res.write('</body>');
  res.write('</html>');
  res.end();
});

server.listen(3000);
