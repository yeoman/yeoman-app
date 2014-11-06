'use strict';

function createForm(_id, questions, callback) {

  currentForm = formElem.id = _id;

  questions.forEach(function (item) {
    formElem.appendChild(
      window.prompts[item.promptType].create(item));
  });

  formElem.getAnswers = function () {
    var result = {};
    var elemsArr = [].slice.call(this.children);

    elemsArr.filter(function (item) {
      return item.promptItem;
    }).forEach(function (item) {
      result[item.questionName] = item.getAnswer();
    });

    return result;
  };

  formElem.onSubmitForm = function (e) {
    e.preventDefault();
    window.classie.removeClass(formElem, 'show');
    window.classie.addClass(formElem, 'hide');
    callback(this);
    return false;
  };

}


