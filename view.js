'use strict';

const view = {

    inputSelector: document.getElementById('input'),

    clear() {
        this.inputSelector.value = '';
    },

    digitLimitMet() {
        octopus.resetModels();
        view.inputSelector.value = 'Digit Limit Met';
    },

    addListener() {
        this.inputSelector.addEventListener('keydown', function(keydownEvent) {
            keydownEvent.preventDefault();
            octopus.inputCheckExpressionUpdate(keydownEvent); 
        })
    },

    renderToInputField(expression) {
        if (expression.length < 21) {
            this.inputSelector.value = expression;
        }
        else { this.digitLimitMet() }
    }

}