(function (window) {

  'use strict';

  var document = window.document;
  var elemSelectCallback;


  // Build home grid displaying official generators
  function start(officialGenerators, elemSelectedCallback) {
    officialGenerators.forEach(function (item) {

      var figure = document.createElement('figure');
      var img = document.createElement('img');

      img.src = 'img/' + item.name + '.png';

      figure.appendChild(img);
      document.getElementById('generators-grid').appendChild(figure);

      // Adds event handler for capturing click on element and calling yo
      figure.name = item.name;
      figure.addEventListener('click', function onFigureClick() {
        elemSelectedCallback(this.name);
      }.bind(figure));

    });

    // Starts the grid3d effect
    window.grid = new grid3D(document.getElementById('grid3d'));
  }


  window.officialGeneratorsGrid = {
    start: start
  };

})(window);

