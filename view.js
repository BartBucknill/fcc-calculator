'use strict';

const view = {

    inputSelector: document.getElementById('input'),

    buttonsSelector: document.getElementById('buttons'),

    toggleButtonsSelector: document.getElementById('toggle-buttons'),

    clear() {
        this.inputSelector.value = '';
    },

    digitLimitMet() {
        octopus.resetModels();
        view.inputSelector.value = 'Digit Limit Met';
    },

    addInputFieldListener() {
        this.inputSelector.addEventListener('keydown', function(keydownEvent) {
            keydownEvent.preventDefault();
            octopus.inputCheckExpressionUpdate(keydownEvent.key); 
        })
    },

    addButtonsListener() {
        this.buttonsSelector.addEventListener('click', function(clickEvent) {
            octopus.inputCheckExpressionUpdate(clickEvent.target.id);
        })
    },
    
    renderToInputField(expression) {
        if (expression.length < 14) {
            this.inputSelector.value = expression;
        }
        else { this.digitLimitMet() }
    }

}