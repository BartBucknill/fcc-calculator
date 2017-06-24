'use strict';

const view = {

    buttonsSelector: document.getElementById('buttons'),

    colorPickerSelector: document.getElementsByClassName('jscolor')[0],

    screenSelector: document.getElementById('screen'),

    clear() {
        this.screenSelector.innerHTML = '';
    },

    focusScreen() {
        this.screenSelector.focus();
    },

    digitLimitMet() {
        octopus.resetModels();
        this.renderToScreen('Digit Limit Met');
    },

    addScreenListener() {
        this.screenSelector.addEventListener('keydown', (keydownEvent) => {
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
    
    renderToScreen(htmlString) {
        this.screenSelector.innerHTML = htmlString;
    }

}