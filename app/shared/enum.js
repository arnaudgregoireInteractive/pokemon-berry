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

const NPC_ID = Object.freeze({
    BOY_0: 'BOY_0',
    BOY_1: 'BOY_1',
    BOY_2: 'BOY_2',
    BOY_3: 'BOY_3',
    GIRL_0: 'GIRL_0',
    GIRL_1: 'GIRL_1',
    GIRL_2: 'GIRL_2',
    GIRL_3: 'GIRL_3',
    PROFESSOR: 'PROFESSOR',
    SCIENTIST: 'SCIENTIST',
    KID_0: 'KID_0',
    KID_1: 'KID_1',
    KID_2: 'KID_2',
    KID_3: 'KID_3'
});

const NPC_TYPE = Object.freeze({
    DIALOG: 'DIALOG'
});


module.exports = {ZONES, TILESET_PIXEL, ORIENTATION, STATUS, KEY_STATUS, NPC_ID, NPC_TYPE};