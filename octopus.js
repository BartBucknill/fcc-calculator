'use strict';

const octopus = {

    setup() {
        view.addListener();
    },

    inputCheckExpressionUpdate(keypressEvent) {
        inputCheckModel.run(keypressEvent);
        view.renderExpression(inputCheckModel.expressionString());
    },

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
    }

}

window.onload = octopus.setup;