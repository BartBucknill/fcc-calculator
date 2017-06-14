//inputCheckModel Tests

//helper: clear expression
function clearExpression() {
    inputCheckModel.expression = [];
}

QUnit.test('digit, operator, and period functions should accept and append to last item or create new item, or reject, new input as appropriate', function(assert) {
    inputCheckModel.digit('2');
    assert.deepEqual(inputCheckModel.expression, ['2'], 'if array empty, digit should be added as new item');
    inputCheckModel.digit('0');
    assert.deepEqual(inputCheckModel.expression, ['20'], 'if last item is digit, concatenate digit with it');
    inputCheckModel.operator('+');
    inputCheckModel.digit('0');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0'], 'if last item is operator, digit should be added to array as new item');
    inputCheckModel.period('.');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0.'], 'if last item is integer, concatenate period with it');
    inputCheckModel.period('.');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0.'], 'if last item is decimal, reject period');
    inputCheckModel.digit('3');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0.3'], 'if last item is number, concatenate digit with it');
    inputCheckModel.operator('/');
    inputCheckModel.operator('/');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0.3','/'], 'if last item is operator, reject operator');
    inputCheckModel.period('.');
    assert.deepEqual(inputCheckModel.expression, ['20','+','0.3','/','0.'], 'if last item is operator, add period prepended to 0 as new array item');
    clearExpression();
    inputCheckModel.period('.');
    assert.deepEqual(inputCheckModel.expression, ['0.'], 'if array is empty, add period prepended to 0 as new array item');
    clearExpression();
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
    clearStackAndQueue(); 
});

QUnit.test('check if item is a number', function(assert) {
   assert.strictEqual(shuntModel.isNum(10), true, '10 is a number');
   assert.strictEqual(shuntModel.isNum(-99999), true, '-99999 is a number');
   assert.strictEqual(shuntModel.isNum(''), false, 'empty string is not a number');
   assert.strictEqual(shuntModel.isNum('2'), false, 'string "2" is not a number');
});

QUnit.test('if higher precedence operator than current is on stack, it should be moved to queue, when not current should be placed on stack', function(assert) {
    shuntModel.stack.push('*');
    shuntModel.placeOperator('+');
    assert.deepEqual(shuntModel.queue, ['*'], '* > +, so * should be moved from stack to queue');
    assert.deepEqual(shuntModel.stack, ['+'], '+ should have been placed on stack');
    clearStackAndQueue();
});

QUnit.test('if stack contains operators higher than or equal in precedence to the current operator, they should all be moved to queue before current is placed', function(assert) {
    shuntModel.stack.push('+','*');
    shuntModel.placeOperator('-');
    assert.deepEqual(shuntModel.queue, ['*', '+'], 'all higher/equal precedence operators on stack should have been moved to queue');
    assert.deepEqual(shuntModel.stack, ['-'], 'lower precedence operator should remain on stack and current operator should have been placed there');
    clearStackAndQueue();
});

QUnit.test('when an infix expression as an array of operators (as strings) and numbers is passed to shuntModel.run() they should be placed in postfix in queue array', function(assert) {
    shuntModel.run([99,'+',999,'/',8,'+',0,'*',0.5]);
    assert.deepEqual(shuntModel.queue, [99,999,8,'/', '+',0,0.5,'*','+'],'operators and numbers should be in queue in correct order (postfix)');
    assert.deepEqual(shuntModel.stack, [], 'stack should be empty');
    clearStackAndQueue();
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
    clearStackAndResult();
});

QUnit.test('after postfixEvalModel.run() has run, postfixEvalModel.result should contain either the correct result or if postfix expression was incorrect should contain an error', function(assert) {
    postfixEvalModel.run([1,2,'+']);
    assert.deepEqual(postfixEvalModel.result, 3, '1 + 2 = 3');
    clearStackAndResult();
    postfixEvalModel.run([10, 5, '/', 2, 8, '*', '+', 20, '-']); 
    assert.strictEqual(postfixEvalModel.result, -2, '10 / 5 + 2 * 8 - 20 = -2');
    clearStackAndResult();
    postfixEvalModel.run([5,5,5,5,5,5,5,5, '+', '*']);
    assert.strictEqual(postfixEvalModel.result, 'Error: too many operands', 'If postfix is incorrect and has too many operands final stack length is > 1, result should be Error: too many operands');
    clearStackAndResult();
    postfixEvalModel.run([1, 2, '+', '-']);
    assert.strictEqual(postfixEvalModel.result, 'Error: insufficient operands', 'If postfix is incorrect and has too few operands result should be set to Error: insufficient operands');
    clearStackAndResult();

})


//Test shuntModel and postfixEvalModel together

QUnit.test('if octopus.processInput is called with correct infix expression, postfixEvalModel.result should be set to the correct result, if infix expression was incorrect it should be set to an error', function(assert) {
    octopus.processInput([1, '-', 2, '*', 3]);
    assert.strictEqual(postfixEvalModel.result, -5, '1 - 2 * 3 = -5');
    clearStackAndQueue();
    clearStackAndResult();
    octopus.processInput([10, '/', 5, '+', 2, '*', 8, '-', 20]);
    assert.strictEqual(postfixEvalModel.result, -2, '10 / 5 + 2 * 8 - 20 = -2');
    clearStackAndQueue();
    clearStackAndResult();
    octopus.processInput([999, '+', 8, '/', 66, '-', 10, '*', 777, '-', 999]);
    assert.strictEqual(postfixEvalModel.result, -7769.878787878788, '999+8/66-10*777-999 = -7769.878787878788');
    clearStackAndQueue();
    clearStackAndResult();
})