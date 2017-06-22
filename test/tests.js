//input verification and expression update Tests (view, octopus, inputOutputModel).

//helper
function simulateKeyboardEvent(keyValue, whichValue = undefined) {
    let event = new KeyboardEvent('keydown', { key: keyValue, which: whichValue });
    view.inputSelector.dispatchEvent(event);
}
//helper
function clearExpression() {
    inputOutputModel.expression = [];
}

QUnit.test('permitted characters only input should be placed in expression and displayed in input field', function(assert) {
    simulateKeyboardEvent('9');
    assert.deepEqual(inputOutputModel.expression, ['9'], 'input of 9 should be placed in expression array');
    assert.strictEqual(view.inputSelector.value, '9', 'permitted input should be displayed as string in input field');
    simulateKeyboardEvent('.');
    assert.deepEqual(inputOutputModel.expression, ['9.'], 'input of "." after number should be concatenated with previous number in expression array');
    assert.deepEqual(view.inputSelector.value, '9.', 'permitted input should be displayed as string in input field');
    simulateKeyboardEvent('*');
    assert.deepEqual(inputOutputModel.expression, ['9.','*'], 'input of * should be inserted into array as new item');
    assert.strictEqual(view.inputSelector.value, '9.*', 'permitted input should be displayed as string in input field');
    simulateKeyboardEvent('.');
    assert.deepEqual(inputOutputModel.expression, ['9.','*','0.'], 'input of "." after operator should be inserted into array as new item prepended with 0');
    assert.strictEqual(view.inputSelector.value, '9.*0.', 'permitted input should be displayed as string in input field');
    clearExpression();
})

QUnit.test('backspace should remove last character, either an array item or last character of last item, value of input field should be updated', function(assert) {
    simulateKeyboardEvent('1');
    simulateKeyboardEvent('+');
    simulateKeyboardEvent('Backspace');
    assert.deepEqual(inputOutputModel.expression, ['1'], 'last item should have been deleted');
    assert.strictEqual(view.inputSelector.value, '1', 'input field value should have been updated to 1');
    simulateKeyboardEvent('2');
    simulateKeyboardEvent('Backspace');
    assert.deepEqual(inputOutputModel.expression, ['1'], 'last character of number 12 should have been deleted leaving 1');
    assert.strictEqual(view.inputSelector.value, '1', 'input field value should have been updated to 1');
    clearExpression();
})

QUnit.test('on enter expression should be evaluated, the result should be in postfixEvalModel.result and should be displayed in the input field', function(assert) {
    simulateKeyboardEvent('1');
    simulateKeyboardEvent('+');
    simulateKeyboardEvent('2');
    simulateKeyboardEvent('Enter');
    assert.strictEqual(postfixEvalModel.result, 3, 'input 1 + 2 enter, should make postfixEvalModel.result = 3');
    assert.strictEqual(view.inputSelector.value, '3', 'input 1 + 2 enter, should make input field value = 3');
    octopus.resetModels();
    simulateKeyboardEvent('1');
    simulateKeyboardEvent('-');
    simulateKeyboardEvent('-');
    simulateKeyboardEvent('2');
    simulateKeyboardEvent('Enter');
    assert.strictEqual(postfixEvalModel.result, 3, 'input 1 - - 2 enter, should make postfixEvalModel.result = 3');
    assert.strictEqual(view.inputSelector.value, '3', 'input 1 - - 2 enter, should make input field value = 3');
    octopus.resetModels();
    simulateKeyboardEvent('-');
    simulateKeyboardEvent('10');
    simulateKeyboardEvent('+');
    simulateKeyboardEvent('-');
    simulateKeyboardEvent('2');
    simulateKeyboardEvent('Enter');
    assert.strictEqual(postfixEvalModel.result, -12, 'input - 10 + - 2 enter, should make postfixEvalModel.result = -12');
    assert.strictEqual(view.inputSelector.value, '-12', 'input - 10 + - 2 enter, should make input field value = -12');
    octopus.resetModels();
})

//inputOutputModel Tests

QUnit.test('isOperator method should return true if all items are of set +-*/ and false otherwise', function(assert) {
    inputOutputModel.expression = ['+', '-'];
    assert.strictEqual(inputOutputModel.isOperator(-2), true, 'if passed -2 and last 2 items are operators method should return true');
    inputOutputModel.expression = ['12'];
    assert.strictEqual(inputOutputModel.isOperator(-1), false, 'if passed -1 and last item !operator method should return false');
    inputOutputModel.expression = ['1'];
    assert.strictEqual(inputOutputModel.isOperator(-2), false, 'if passed -2 and expression.length = 1 and item is not operator should return false');
    clearExpression();
})

QUnit.test('it should be possible to enter +- to denote positive or negative numbers', function(assert) {
    simulateKeyboardEvent('-');
    assert.deepEqual(inputOutputModel.expression, ['-'], 'input "-" when input field empty should be placed in expression as first item');
    assert.strictEqual(view.inputSelector.value, '-', 'input "-" when input field is empty should set input field value to -');
    simulateKeyboardEvent('-');
    assert.deepEqual(inputOutputModel.expression, ['-'], 'should not be possible to input two - at beginning of expression');
    assert.strictEqual(view.inputSelector.value, '-', 'input second - should not be possible, input field value should remain -');
    simulateKeyboardEvent('2');
    assert.deepEqual(inputOutputModel.expression, ['-2'], '2 after - as first item should be concatenated forming -2');
    assert.strictEqual(view.inputSelector.value, '-2', '2 after - as first item should change input field value to -2');
    simulateKeyboardEvent('+');
    simulateKeyboardEvent('2');
    simulateKeyboardEvent('+');
    simulateKeyboardEvent('-');
    simulateKeyboardEvent('6');
    assert.deepEqual(inputOutputModel.expression, ['-2', '+', '2','+','-6'], '- should be treated as denoting a negative number when following another operator');
    assert.strictEqual(view.inputSelector.value, '-2+2+-6', '- should be treated as denoting a negative number when following another operator');
    octopus.resetModels();
})

QUnit.test('digit, operator, and period functions should accept and append to last item or create new item, or reject, new input as appropriate', function(assert) {
    inputOutputModel.digit('2');
    assert.deepEqual(inputOutputModel.expression, ['2'], 'if array empty, digit should be added as new item');
    inputOutputModel.digit('0');
    assert.deepEqual(inputOutputModel.expression, ['20'], 'if last item is digit, concatenate digit with it');
    inputOutputModel.operator('+');
    inputOutputModel.digit('0');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0'], 'if last item is operator, digit should be added to array as new item');
    inputOutputModel.period('.');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0.'], 'if last item is integer, concatenate period with it');
    inputOutputModel.period('.');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0.'], 'if last item is decimal, reject period');
    inputOutputModel.digit('3');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0.3'], 'if last item is number, concatenate digit with it');
    inputOutputModel.operator('/');
    inputOutputModel.operator('/');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0.3','/'], 'if last item is operator, reject operator');
    inputOutputModel.period('.');
    assert.deepEqual(inputOutputModel.expression, ['20','+','0.3','/','0.'], 'if last item is operator, add period prepended to 0 as new array item');
    octopus.resetModels();
    inputOutputModel.period('.');
    assert.deepEqual(inputOutputModel.expression, ['0.'], 'if array is empty, add period prepended to 0 as new array item');
    octopus.resetModels();
})

//shuntModel Tests 

//helper: reset stack and queue after tests
function clearStackAndQueue() { 
    shuntModel.stack = []; 
    shuntModel.queue = [];
}

QUnit.test('check if operator on top of stack is of higher than or equal precedence to current operator', function(assert) {
    assert.strictEqual(shuntModel.topOfStackPrecedenceHigherOrEqual('-', '*'), true, '* > -, should return true');
    assert.strictEqual(shuntModel.topOfStackPrecedenceHigherOrEqual('*','/'), true, '* = /, should return true');
    assert.strictEqual(shuntModel.topOfStackPrecedenceHigherOrEqual('-','-'), true, '- = -, should return true');
    assert.strictEqual(shuntModel.topOfStackPrecedenceHigherOrEqual('/', '+'), false, '+ < /, should return false');
});

QUnit.test('return operator on top of stack', function(assert) {
    shuntModel.stack.push('+');
    assert.strictEqual(shuntModel.topOfStack(), '+', 'should return +');
    octopus.resetModels();
});

QUnit.test('if higher precedence operator than current is on stack, it should be moved to queue, when not current should be placed on stack', function(assert) {
    shuntModel.stack.push('*');
    shuntModel.placeOperator('+');
    assert.deepEqual(shuntModel.queue, ['*'], '* > +, so * should be moved from stack to queue');
    assert.deepEqual(shuntModel.stack, ['+'], '+ should have been placed on stack');
    octopus.resetModels();
});

QUnit.test('if stack contains operators higher than or equal in precedence to the current operator, they should all be moved to queue before current is placed', function(assert) {
    shuntModel.stack.push('+','*');
    shuntModel.placeOperator('-');
    assert.deepEqual(shuntModel.queue, ['*', '+'], 'all higher/equal precedence operators on stack should have been moved to queue');
    assert.deepEqual(shuntModel.stack, ['-'], 'lower precedence operator should remain on stack and current operator should have been placed there');
    octopus.resetModels();
});

QUnit.test('when an infix expression as an array of string operators and numbers is passed to shuntModel.run() they should be placed in postfix in queue array and string numbers should be converted to numbers', function(assert) {
    shuntModel.run(['99','+','999','/','8','+','0','*','0.5']);
    assert.deepEqual(shuntModel.queue, [99,999,8,'/', '+',0,0.5,'*','+'],'operators and numbers should be in queue in correct order (postfix)');
    assert.deepEqual(shuntModel.stack, [], 'stack should be empty');
    octopus.resetModels();
});


//postfixEvalModel Tests

//helper
function clearStackAndResult() {
    postfixEvalModel.stack = [];
    postfixEvalModel.result = 'No result yet calculated';
}

QUnit.test('when eval() is called with given operator and 2 or more operands on the stack it should remove the operands from the array push the result into the array', function(assert) {
    postfixEvalModel.stack = [8,4];
    postfixEvalModel.eval('*');
    assert.deepEqual(postfixEvalModel.stack, [32], 'result of 8 * 4 should be stack of 32');
    postfixEvalModel.stack.push(2);
    postfixEvalModel.eval('/');
    assert.deepEqual(postfixEvalModel.stack, [16], 'result of 32 / 2 should be stack of 16');
    postfixEvalModel.stack.push(4);
    postfixEvalModel.eval('+');
    assert.deepEqual(postfixEvalModel.stack, [20], 'result of 16 + 4 should be stack of 20');
    postfixEvalModel.stack.push(12);
    postfixEvalModel.eval('-');
    assert.deepEqual(postfixEvalModel.stack, [8], 'result of 20 - 12 should be stack of 8');
    octopus.resetModels();
});

QUnit.test('after postfixEvalModel.run() has run, postfixEvalModel.result should contain either the correct result or if postfix expression was incorrect should contain an error', function(assert) {
    postfixEvalModel.run([1,2,'+']);
    assert.deepEqual(postfixEvalModel.result, 3, '1 + 2 = 3');
    octopus.resetModels();
    postfixEvalModel.run([10, 5, '/', 2, 8, '*', '+', 20, '-']); 
    assert.strictEqual(postfixEvalModel.result, -2, '10 / 5 + 2 * 8 - 20 = -2');
    octopus.resetModels();
    postfixEvalModel.run([5,5,5,5,5,5,5,5, '+', '*']);
    assert.strictEqual(postfixEvalModel.result, 'Error: too many operands', 'If postfix is incorrect and has too many operands final stack length is > 1, result should be Error: too many operands');
    octopus.resetModels();
    postfixEvalModel.run([1, 2, '+', '-']);
    assert.strictEqual(postfixEvalModel.result, 'Error: insufficient operands', 'If postfix is incorrect and has too few operands result should be set to Error: insufficient operands');
    octopus.resetModels();
})


//Test shuntModel and postfixEvalModel together

QUnit.test('if octopus.processInput is called with correct infix expression, postfixEvalModel.result should be set to the correct result, if infix expression was incorrect it should be set to an error', function(assert) {
    octopus.processInput(['1', '-', '2', '*', '3']);
    assert.strictEqual(postfixEvalModel.result, -5, '1 - 2 * 3 = -5');
    octopus.resetModels();
    octopus.processInput(['10', '/', '5', '+', '2', '*', '8', '-', '20']);
    assert.strictEqual(postfixEvalModel.result, -2, '10 / 5 + 2 * 8 - 20 = -2');
    octopus.resetModels();
    octopus.processInput(['999', '+', '8', '/', '66', '-', '10', '*', '777', '-', '999']);
    assert.strictEqual(postfixEvalModel.result, -7769.878787878788, '999+8/66-10*777-999 = -7769.878787878788');
    octopus.resetModels();
    octopus.processInput(['9', '-', '-9']);
    assert.strictEqual(postfixEvalModel.result, 18, '9 - -9 = 18');
    octopus.resetModels();
    octopus.processInput(['-200', '*', '-9']);
    assert.strictEqual(postfixEvalModel.result, 1800, '-200 * -9 = 1800');
    octopus.resetModels();
    view.inputSelector.value = '';
})

// View Tests

QUnit.test('If input or output exceeds digit limit, error should be displayed', function(assert) {
    for (let i = 0; i < 18; i++) {
        simulateKeyboardEvent(9);
    }
    assert.strictEqual(view.inputSelector.value, 'Digit Limit Met', 'when input exceeds 17 characters, Digit Limit Met should be displayed');
})