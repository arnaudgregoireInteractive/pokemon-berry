const { join } = require('path');
const { createServer } = require('http');
const express = require('express');
const helmet = require('helmet');
const { Server } = require('colyseus');

const port = Number(process.env.PORT) || 9000;
const app = express();
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

//console.log(process.env);
// Express middleware
//app.use(helmet({ contentSecurityPolicy: false })); // process.env.NODE_ENV === 'production'
app.use(express.json());
app.use(express.static(join(__dirname, 'client', 'dist')));

// Single Page App routing
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'index.html'));
});

// Colyseus room
const { ZONES } = require('./shared/enum');
const GameRoom = require('./room/game-room');

Object.keys(ZONES).forEach(zone => {
  maclass = class extends GameRoom{
    constructor(){
        super(zone);
    }
  }
  gameServer.define(zone, maclass);
});

// Start
gameServer.listen(port).then(() => {
  console.log(`Game server started, listening on port ${port}`);
});
