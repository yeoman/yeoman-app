(function (window) {

    'use strict';

    var yo = require('./js/lib/yo-connector');

    var officialGeneratorsGrid;
    var promptForm;


    function onGridElementSelected(generatorName) {
        requestCwd(generatorName);
    }

    function requestCwd(generatorName) {
        promptForm.create('cwd-prompt', [
            {
                message: 'Please specify a folder to be used to generate the project',
                name: 'cwd',
                type: 'file',
                extraAttrs: [
                    { 'nwdirectory': true }
                ]
            }
        ], function onDefineCwd(form) {
            yo.connect(generatorName, form.getElemValue('cwd'), onQuestionPrompt);
            yo.run();
        });
    }

    function onQuestionPrompt(questions) {
        promptForm.create('question', questions,
            function onAnswer(form) {
                yo.setAnswers(form.getAnswers());
            });
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

