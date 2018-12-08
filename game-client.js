/* global $ */
var client = require("./client");
var io = require('socket.io-client');

client.allowAnimation = false;
client.renderer = require("./client-modes/user-mode");

window.CLIENT = client;
window.io = io;
