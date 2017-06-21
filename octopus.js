'use strict';

const octopus = {

    setup() {
        view.addListener();
    },

    inputCheckExpressionUpdate(keydownEvent) {
        checkAndPrepInputModel.run(keydownEvent);
        view.renderToInputField(checkAndPrepInputModel.expressionString());
        if (postfixEvalModel.error()) {
            this.resetModels();
        }
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
        shuntModel.queue = [];
        checkAndPrepInputModel.expression = [postfixEvalModel.result.toString()];
    },

    resetModels() {
        checkAndPrepInputModel.reset();
        shuntModel.reset();
        postfixEvalModel.reset();
    }

}

window.onload = octopus.setup;