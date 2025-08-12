const http = require('http');
const app = require('../backend/app');
const port = process.env.PORT || 4000;
const { initializeSocket } = require('./socket');

//creating the server using http module and express app
const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
