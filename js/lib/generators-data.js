'use strict';

var OFFICIAL_OWNER_WEBSITE = 'https://github.com/yeoman';

// TODO: Create request and store an update version of generator list
// data/yeoman-generator-list should be used when no stored version is found
function getAllGenerators() {
    return require('../../data/yeoman-generator-list');
}

function getOfficialGenerators() {
    return getAllGenerators().filter(function (item) {
        return item.ownerWebsite === OFFICIAL_OWNER_WEBSITE;
    });
}

module.exports = {
    getAllGenerators: getAllGenerators,
    getOfficialGenerators: getOfficialGenerators
};

