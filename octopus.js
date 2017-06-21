'use strict';

const octopus = {

    setup() {
        view.addInputFieldListener();
        view.addButtonsListener();
        view.addToggleButtonsListener();
    },

    inputCheckExpressionUpdate(key) {
        checkAndPrepInputModel.run(key);
        view.renderToInputField(checkAndPrepInputModel.expressionString());
        if (postfixEvalModel.error()) {
            this.resetModels();
        }
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
        shuntModel.queue = [];
        checkAndPrepInputModel.expression = [checkAndPrepInputModel.formatResult(postfixEvalModel.result)];
    },

    resetModels() {
        checkAndPrepInputModel.reset();
        shuntModel.reset();
        postfixEvalModel.reset();
    },

    clearAll() {
        this.resetModels();
        view.clear();
    }

}

window.onload = octopus.setup;