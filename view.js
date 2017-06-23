'use strict';

const view = {

    inputSelector: document.getElementById('input'),

    buttonsSelector: document.getElementById('buttons'),

    colorPickerSelector: document.getElementsByClassName('jscolor')[0],

    clear() {
        this.inputSelector.value = '';
    },

    digitLimitMet() {
        octopus.resetModels();
        view.inputSelector.value = 'Digit Limit Met';
    },

    addInputFieldListener() {
        this.inputSelector.addEventListener('keydown', (keydownEvent) => {
            keydownEvent.preventDefault();
            octopus.inputCheckExpressionUpdate(keydownEvent.key); 
        })
    },

    addButtonsListener() {
        this.buttonsSelector.addEventListener('click', (clickEvent) => {
            octopus.inputCheckExpressionUpdate(clickEvent.target.id);
        })
    },

    addColorPickerListener() {
        this.colorPickerSelector.addEventListener('click', (clickEvent) => {
            octopus.setWaitingForPick(true);
        })
    },

    getColor() {
        return this.colorPickerSelector.style['background-color'];
    },

    changeColor(id, color) {
        let elem = document.getElementById(id);
        elem.style['background-color'] = color;
    },
    
    renderToInputField(expression) {
        if (expression.length < 14) {
            this.inputSelector.value = expression;
        }
        else { this.digitLimitMet() }
    }

}