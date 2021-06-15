const { join } = require('path');
const { createServer } = require('http');
const express = require('express');
const helmet = require('helmet');
const { Server } = require('colyseus');

const port = Number(process.env.PORT) || 9000;
const app = express();
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

// Express middleware
app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' }));
app.use(express.json());
app.use(express.static(join(__dirname, 'client', 'dist')));

// Single Page App routing
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'index.html'));
});

// Colyseus room
const { ZONES } = require('./shared/enum');
const PalletTownRoom = require('./room/pallet-town-room');
const HeroHome1fRoom = require('./room/hero_home_1f-room');
const HeroHome2fRoom = require('./room/hero_home_2f-room');
const RivalHome1fRoom = require('./room/rival_home_1f-room');
const OakLab1fRoom = require('./room/oak_lab_1f-room');
const Route1Room = require('./room/route1-room');

gameServer.define(ZONES.PALLET_TOWN, PalletTownRoom);
gameServer.define(ZONES.HERO_HOME_1F, HeroHome1fRoom);
gameServer.define(ZONES.HERO_HOME_2F, HeroHome2fRoom);
gameServer.define(ZONES.RIVAL_HOME_1F, RivalHome1fRoom);
gameServer.define(ZONES.OAKS_LAB_1F, OakLab1fRoom);
gameServer.define(ZONES.ROUTE1, Route1Room);

// Start
gameServer.listen(port).then(() => {
  console.log(`Game server started, listening on port ${port}`);
});
