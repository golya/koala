'use strict';
var parse = require('co-body');
var messages = [
  { id: 0, message: 'Koa next generation web framework for node.js222' },
  { id: 1, message: 'Koa is a new web framework designed by the team behind Express' }
];


module.exports.list = function *list() {
  this.body = yield messages;
};

module.exports.fetch = function *fetch(id) {
  var message = messages[id];
  if (!message) {
    this.throw(404, 'message with id = ' + id + ' was not found');
  }
  this.body = yield message;
};

module.exports.create = function *create() {
  var message = yield parse(this);
  var id = messages.push(message) - 1;
  message.id = id;
  this.redirect('/');
};