'use strict';

const octopus = {

    setup() {
        view.addListener();
    },

    inputCheckExpressionUpdate(keydownEvent) {
        checkAndPrepInputModel.run(keydownEvent);
        view.renderToInputField(checkAndPrepInputModel.expressionString());
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
        shuntModel.queue = [];
        checkAndPrepInputModel.expression = [postfixEvalModel.result.toString()];
        view.renderToInputField(postfixEvalModel.result);
    }

}

window.onload = octopus.setup;