(function (window) {

    'use strict';

    var EventEmitter = require('events').EventEmitter;
    var events = new EventEmitter();
    var generatorsData = require('./js/lib/generators-data');
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
        figure.addEventListener('click', function onFigureClick() {
            events.emit('gridElementSelected', this.name);
        }.bind(figure));

    });

    window.officialGeneratorsGrid = {
        events: events
    };

})(window);

