'use strict';

var app = require('app');
var ipc = require('ipc');
var Menu = require('menu');
var path = require('path');
var season = require('season');
var _ = require('underscore-plus');
var EventEmitter = require('events').EventEmitter;

function ApplicationMenu(options) {
  var menuJson = season.resolve(path.join(__dirname, '..', '..', 'menus', process.platform + '.json'));
  var template = season.readFileSync(menuJson);
  this.template = this.translateTemplate(template.menu, options.pkg);
}

_.extend(ApplicationMenu.prototype, EventEmitter.prototype);

ApplicationMenu.prototype.attachToWindow = function(window) {
  this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
  Menu.setApplicationMenu(this.menu);
};

ApplicationMenu.prototype.wireUpMenu = function(menu, command) {
  menu.click = function() {
    this.emit(command);
  }.bind(this);
};

ApplicationMenu.prototype.translateTemplate = function(template, pkgJson) {
  var emitter = this.emit;
  template.forEach(function(item) {
    if (item.metadata == null) {
      item.metadata = {};
    }

    if (item.label) {
      item.label = (_.template(item.label))(pkgJson);
    }

    if (item.command) {
      this.wireUpMenu(item, item.command);
    }

    if (item.submenu) {
      this.translateTemplate(item.submenu, pkgJson);
    }
  }.bind(this));

  return template;
};

ApplicationMenu.prototype.acceleratorForCommand = function(command, keystrokesByCommand) {
  var firstKeystroke = keystrokesByCommand[command];
  firstKeystroke = firstKeystroke != null ? firstKeystroke[0] : void 0;
  if (!firstKeystroke) {
    return null;
  }

  var modifiers = firstKeystroke.split('-');
  var key = modifiers.pop();
  modifiers = modifiers.map(function(modifier) {
    return modifier.replace(/shift/ig, 'Shift').replace(/cmd/ig, 'Command2').replace(/ctrl/ig, 'Ctrl').replace(/alt/ig, 'Alt');
  });

  var keys = modifiers.concat([key.toUpperCase()]);
  return keys.join('+');
};

module.exports = ApplicationMenu;
