'use strict';

const octopus = {

    setup() {
        view.focusScreen();
        view.addScreenListener();
        view.addButtonsListener();
        view.addColorPickerListener();
    },

    inputCheckExpressionUpdate(key) {
        inputOutputModel.run(key);
        let expressionString = inputOutputModel.expressionString();
        if (inputOutputModel.expressionLengthOk(expressionString)) {
            view.renderToScreen(colorPickerModel.prepColorString(expressionString));
        }
        else { view.digitLimitMet(); }
        // TODO: check the below - does it make sense?
        if (postfixEvalModel.error()) {
            this.resetModels();
        }
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
        shuntModel.reset();
        inputOutputModel.expression = [inputOutputModel.formatResult(postfixEvalModel.result)];
    },

    setWaitingForPick(bool) {
        colorPickerModel.waitingForPick = bool;
    },

    isWaitingForPick() {
        return colorPickerModel.waitingForPick;
    },

    pickColor(key) {
        let color = view.getColor();
        view.changeColor(key, color);
        colorPickerModel.setColor(key, color);
        this.setWaitingForPick(false);
    },

    resetModels() {
        inputOutputModel.reset();
        shuntModel.reset();
        postfixEvalModel.reset();
    },

    clearAll() {
        this.resetModels();
        view.clear();
    }

}

window.onload = octopus.setup;