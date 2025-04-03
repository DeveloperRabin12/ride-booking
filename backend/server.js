const http = require('http');
const app = require('../backend/app');
const port = process.env.PORT || 3000;

//creating the server using http module and express app
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
