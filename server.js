const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;
  if (queryObject.code) {
    console.log('Authorization Code:', queryObject.code);
    res.end('Authorization Code received. You can close this window.');
  } else {
    res.end('No code found.');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
