'use strict';

const octopus = {

    setup() {
        view.addInputFieldListener();
        view.addButtonsListener();
        view.addColorPickerListener();
    },

    inputCheckExpressionUpdate(key) {
        inputOutputModel.run(key);
        //digitlimit met test must be inserted here
        //line below must change to call colorPicker.model prepColorString, and pass result to view for rendering
        view.renderToScreen(colorPickerModel.prepColorString(inputOutputModel.expressionString()));
        view.renderToInputField(inputOutputModel.expressionString());
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