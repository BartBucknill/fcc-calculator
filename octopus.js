'use strict';

const octopus = {

    setup() {
        view.addInputFieldListener();
        view.addButtonsListener();
        view.addToggleButtonsListener();
    },

    inputCheckExpressionUpdate(key) {
        inputOutputModel.run(key);
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