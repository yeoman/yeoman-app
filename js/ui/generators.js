(function (window) {

    'use strict';

    var questionsHelper = require('./js/lib/helpers/questions');
    var yo = require('./js/lib/yo-connector');

    var officialGeneratorsGrid;
    var promptForm;


    function onGridElementSelected(generatorName) {
        requestCwd(generatorName);
    }

    function requestCwd(generatorName) {
        promptForm.create('cwd-prompt',
            questionsHelper.convertToHtml(questionsHelper.getFolderPrompt),
            function onDefineCwd(form) {
                yo.connect(
                    generatorName,
                    form.getAnswers().cwd,
                    onQuestionPrompt,
                    onGeneratorDone
                );
            });
    }

    function onQuestionPrompt(questions) {
        promptForm.create('question',
            questionsHelper.convertToHtml(questions),
            function onAnswer(form) {
                yo.setAnswers(form.getAnswers());
            });
    }

    function onGeneratorDone() {
        window.grid._hideContent();
    }


    function start() {
        // get references here to make sure they are already created
        officialGeneratorsGrid = window.officialGeneratorsGrid;
        promptForm = window.promptForm;

        officialGeneratorsGrid.events.on('gridElementSelected', onGridElementSelected);
    }


    window.generators = {
        start: start
    };

})(window);

