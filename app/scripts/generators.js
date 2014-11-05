'use strict';


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

