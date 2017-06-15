'use strict';

const view = {

    inputSelector: document.getElementById('input'),

    addListener() {
        this.inputSelector.addEventListener('keydown', function(keypressEvent) {
            keypressEvent.preventDefault();
            octopus.inputCheckExpressionUpdate(keypressEvent);
        })
    },

    renderExpression(expression) {
        this.inputSelector.value = expression;
    }

}