(function (window) {

    'use strict';

    var generatorsData = require('./js/lib/generators-data');
    var yo = require('./js/lib/yo-connector');
    var document = window.document;

    // Build home grid displaying official generators
    generatorsData.getOfficialGenerators().forEach(function (item) {

        var figure = document.createElement('figure');
        var img = document.createElement('img');

        img.src = 'img/' + item.name + '.png';

        figure.appendChild(img);
        document.getElementById('generators-grid').appendChild(figure);

        // Adds event handler for capturing click on element and calling yo
        figure.name = item.name;
        figure.addEventListener('click', function() {
            yo.connect(this.name);
        }.bind(figure));

    });

})(window);

