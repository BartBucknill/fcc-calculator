'use strict';

const view = {

    inputSelector: document.getElementById('input'),

    addListener() {
        this.inputSelector.addEventListener('keydown', function(keydownEvent) {
            keydownEvent.preventDefault();
            octopus.inputCheckExpressionUpdate(keydownEvent);
        })
    },

    renderToInputField(expression) {
        this.inputSelector.value = expression;
    }

}