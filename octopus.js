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
        //digitlimit met test must be inserted here
        //line below must change to call colorPicker.model prepColorString, and pass result to view for rendering
        let expressionString = inputOutputModel.expressionString();
        if (inputOutputModel.expressionLengthOk(expressionString)) {
            view.renderToScreen(colorPickerModel.prepColorString(expressionString));
        }
        else { view.digitLimitMet(); }
        //view.renderToInputField(inputOutputModel.expressionString());
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