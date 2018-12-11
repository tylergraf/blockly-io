// var core = require('./game-core');
// var consts = require('./game-consts');
export {initPlayer, updateFrame} from './game-core.mjs';
export {Color} from './color.mjs';
export {Grid} from './grid.mjs';
export {Player} from './player.mjs';

// export * from './grid';
// export * from './player';
// exports.Color = require('./color');
// exports.Grid = require('./grid');
// exports.Player = require('./player');

// export const initPlayer = core.initPlayer;
// export const updateFrame = core.updateFrame;

export const GRID_SIZE = 80;
export const CELL_WIDTH = 40;
export const SPEED = 5;
export const BORDER_WIDTH = 20;
export const MAX_PLAYERS = 81;
