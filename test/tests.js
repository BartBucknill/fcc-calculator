// QUNIT TESTS

// QUnit.test('remove spaces from string', function(assert) {
//     assert.strictEqual(modelShunt.removeSpaces('a b c'), 'abc', '"a b c" should become "abc"');
//     assert.strictEqual(modelShunt.removeSpaces(' 1+ 2 /8  8* 9  '), '1+2/88*9', '" 1+ 2 /8  8* 9  " should become "1+2/88*9"');
// });


//SHUNTMODEL TESTS 

//helper: reset stack and queue after tests
function clearStackAndQueue() { 
    shuntModel.stack = []; 
    shuntModel.queue = [];
}


QUnit.test('check if operator on top of stack is of higher precedence than current operator', function(assert) {
    assert.strictEqual(shuntModel.topOfStackIsHigherPrecedence('-', '*'), true, '* > -, should return true');
    assert.strictEqual(shuntModel.topOfStackIsHigherPrecedence('/', '+'), false, '+ < /, should return false');
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

QUnit.test('if multiple higher precedence operators are on stack, they should be all be popped and moved to queue, only then should current be placed on stack', function(assert) {
    shuntModel.stack.push('+','*', '/', '*');
    shuntModel.placeOperator('-');
    assert.deepEqual(shuntModel.queue, ['*', '/', '*'], 'all higher precedence operators on stack should have been moved to queue');
    assert.deepEqual(shuntModel.stack, ['+','-'], 'lower precedence operator should remain on stack and current operator should have been placed there');
    clearStackAndQueue();
});

QUnit.test('when an infix expression as an array of operators (as strings) and numbers is passed to shuntModel.run() they should be placed in postfix in queue array', function(assert) {
    shuntModel.run([99,'+',-999,'/',8,'+',0,'*',0.5]);
    assert.deepEqual(shuntModel.queue, [99,-999,8,'/',0,0.5,'*','+','+'],'operators and numbers should be in queue in correct order (postfix)');
    assert.deepEqual(shuntModel.stack, [], 'stack should be empty');
    clearStackAndQueue();
});

//POSTFIXEVALMODEL TESTS

