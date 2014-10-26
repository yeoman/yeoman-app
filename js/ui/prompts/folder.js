(function (window) {

    'use strict';

    if (!window.prompts) {
        throw { name: 'MISSING_MODULE', message: 'window.prompts module was not found' };
    }


    function create(question) {
        var p = window.prompts.input.create(question);
        var input = p.querySelector('input');

        input.nwdirectory = true;

        return p;
    }


    window.prompts.folder = {
        create: create
    };

})(window);

