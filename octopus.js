'use strict';

const octopus = {

    processInput(infixArray) {
        shuntModel.run(infixArray);
        postfixEvalModel.run(shuntModel.queue);
    }
}