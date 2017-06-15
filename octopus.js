'use strict';

const octopus = {

    setup() {
        view.addListener();
    },

    inputCheckExpressionUpdate(keydownEvent) {
        inputCheckModel.run(keydownEvent);
        view.renderToInputField(inputCheckModel.expressionString());
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
        shuntModel.queue = [];
        inputCheckModel.expression = [postfixEvalModel.result.toString()];
        view.renderToInputField(postfixEvalModel.result);
    }

}

window.onload = octopus.setup;