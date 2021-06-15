const ZONES = Object.freeze({
    PALLET_TOWN:'PALLET_TOWN',
    HERO_HOME_1F:'HERO_HOME_1F',
    HERO_HOME_2F:'HERO_HOME_2F',
    RIVAL_HOME_1F: 'RIVAL_HOME_1F',
    OAKS_LAB_1F: 'OAKS_LAB_1F',
    ROUTE1: 'ROUTE1'
});

const TILESET_PIXEL = 16;

const ORIENTATION = Object.freeze({
    LEFT: "LEFT",
    UP: "UP",
    RIGHT: "RIGHT",
    DOWN: "DOWN"
});

const STATUS = Object.freeze({
    IDLE: "IDLE",
    MOVING: "MOVING",
    SURFING: "SURFING"
});

const KEY_STATUS = Object.freeze({
    DOWN: "DOWN",
    UP: "UP"
});

module.exports = {ZONES, TILESET_PIXEL, ORIENTATION, STATUS, KEY_STATUS};