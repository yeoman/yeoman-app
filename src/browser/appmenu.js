var Menu = require('electron').Menu;
var path = require('path');
var season = require('season');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore-plus');

function ApplicationMenu(options) {
  var menuJson = season.resolve(path.join(__dirname, '..', '..', 'menus', process.platform + '.json'));
  var template = season.readFileSync(menuJson);
  this.template = this.translateTemplate(template.menu, options.pkg);
}

_.extend(ApplicationMenu.prototype, EventEmitter.prototype);

ApplicationMenu.prototype.attachToWindow = function () {
  this.menu = Menu.buildFromTemplate(_.deepClone(this.template));
  Menu.setApplicationMenu(this.menu);
};

ApplicationMenu.prototype.wireUpMenu = function (menu, command) {
  menu.click = function () {
    this.emit(command);
  }.bind(this);
};

ApplicationMenu.prototype.translateTemplate = function (template, pkgJson) {
  template.forEach(function (item) {
    if (!item.metadata) {
      item.metadata = {};
    }
    if (item.label) {
      item.label = _.template(item.label)(pkgJson);
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

ApplicationMenu.prototype.acceleratorForCommand = function (command, keystrokesByCommand) {
  var firstKeystroke = keystrokesByCommand[command];
  firstKeystroke = firstKeystroke && firstKeystroke.length ? firstKeystroke[0] : null;
  if (!firstKeystroke) {
    return null;
  }

  var modifiers = firstKeystroke.split('-');
  var key = modifiers.pop();
  modifiers = modifiers.map(function (modifier) {
    return modifier.replace(/shift/ig, 'Shift').replace(/cmd/ig, 'Command2').replace(/ctrl/ig, 'Ctrl').replace(/alt/ig, 'Alt');
  });

  var keys = modifiers.concat([key.toUpperCase()]);
  return keys.join('+');
};

module.exports = ApplicationMenu;
