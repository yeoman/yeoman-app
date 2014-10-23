(function (window) {

    'use strict';

    var generatorsData = require('./js/lib/generators-data');
    var document = window.document;

    // Build home grid displaying official generators
    generatorsData.getOfficialGenerators().forEach(function (item) {

        var figure = document.createElement('figure');
        var img = document.createElement('img');

        console.log(item.name);
        img.src = 'img/' + item.name + '.png';

        figure.appendChild(img);
        document.getElementById('generators-grid').appendChild(figure);

    });

})(window);

