'use strict';

var ipc = require('ipc');

var officialGeneratorsGrid;
var promptForm;


function onGridElementSelected(generatorName) {
  requestCwd(generatorName);
}

function requestCwd(generatorName) {
  promptForm.create('cwd-prompt',
    window.helpersPrompts.addHtmlData(
      window.helpersPrompts.getFolderPrompt),
    function onDefineCwd(form) {
      ipc.send('connect', generatorName, form.getAnswers().cwd);
    });
}

function onQuestionPrompt(questions) {
  promptForm.create('question',
    window.helpersPrompts.addHtmlData(questions),
    function onAnswer(form) {
      ipc.send('set-answers', form.getAnswers());
    });
}

function onGeneratorDone() {
  window.grid._hideContent();
}


function start() {
  // get references here to make sure they are already created
  officialGeneratorsGrid = window.officialGeneratorsGrid;
  promptForm = window.promptForm;

  ipc.on('question-prompt', onQuestionPrompt);
  ipc.on('generator-done', onGeneratorDone);

  ipc.on('generators-data', function (officialGenerators) {
    window.officialGeneratorsGrid.start(officialGenerators, onGridElementSelected);
  });
}


module.exports = {
  start: start
};

