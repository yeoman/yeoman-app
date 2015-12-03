var Logger = require("filelogger");
var path = require('path');

logger = new Logger("debug", "debug", path.join(__dirname, '../../console.log'));

module.exports = logger
