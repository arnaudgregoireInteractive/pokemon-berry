const ZONES = Object.freeze({
    PALLET_TOWN:'PALLET_TOWN',
    HERO_HOME_1F:'HERO_HOME_1F',
    HERO_HOME_2F:'HERO_HOME_2F',
    RIVAL_HOME_1F: 'RIVAL_HOME_1F',
    OAKS_LAB_1F: 'OAKS_LAB_1F',
    ROUTE1: 'ROUTE1'
});

const TILESET_PIXEL = 16;

const ACTION_TYPE = Object.freeze({
    HARVEST: 'HARVEST'
});

const ORIENTATION = Object.freeze({
    LEFT: "LEFT",
    UP: "UP",
    RIGHT: "RIGHT",
    DOWN: "DOWN"
});

const ORIENTATION_TABLE = {
    'DOWN': 0,
    'LEFT': 2,
    'UP': 4,
    'RIGHT': 2
};

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

const BERRY_TYPE = Object.freeze({
    CHERI_BERRY:'CHERI_BERRY',
    CHESTO_BERRY:'CHESTO_BERRY',
    PECHA_BERRY:'PECHA_BERRY'
});

const BERRY_STATUS = Object.freeze({
    SEED: 'SEED',
    SPROUT: 'SPROUT',
    TALLER: 'TALLER',
    BLOOM: 'BLOOM',
    BERRY: 'BERRY'
});

const BERRY_NAME = Object.freeze({
    CHERI_BERRY: 'Cheri Berry',
    CHESTO_BERRY: 'Chesto Berry',
    PECHA_BERRY: 'Pecha Berry'
});

const ITEM_ACTION = Object.freeze({
    USE: 'USE'
});

module.exports = {ACTION_TYPE, ORIENTATION_TABLE, ITEM_ACTION, ZONES, TILESET_PIXEL, ORIENTATION, STATUS, KEY_STATUS, NPC_ID, NPC_TYPE, BERRY_TYPE, BERRY_NAME, BERRY_STATUS};