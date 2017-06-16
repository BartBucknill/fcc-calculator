'use strict';

const inputCheckModel = {
    
    expression: [],

    expressionString() {
        return this.expression.join('');
    },

    integerReg: /^[-0-9]+$/,

    operatorReg: /^[*/+-]+$/,

    lastItem() { 
        return this.expression[this.expression.length - 1];
    },

    lastIsInteger() {
        return this.integerReg.test(this.lastItem());
    },

    lastIsOperator(from) {
        return this.expression.slice(from).every( (item) => {
            return this.operatorReg.test(item);
        });
    },

    concatLastItem(input) {
        this.expression[this.expression.length - 1] = this.lastItem() + input;
    },

    deleteCharacter() {
        if (this.expression.length >= 1 && this.lastItem().length > 1) {
            this.expression[this.expression.length - 1] = this.lastItem().slice(0,-1);
        }
        else { this.expression.pop(); }
    },

    run(keydownEvent) {
        if (/[0-9]/.test(keydownEvent.key)) { this.digit(keydownEvent.key); }
        else if (/[*/+-]/.test(keydownEvent.key)) { this.operator(keydownEvent.key); }
        else if (/\./.test(keydownEvent.key)) { this.period(keydownEvent.key); }
        else if (keydownEvent.key === 'Backspace') { this.deleteCharacter(); }
        else if (keydownEvent.key === 'Enter' && this.expression.length > 0 && !this.operatorReg.test(this.expression.slice(-1))) { octopus.processInput(this.expression); }
    },
    
    digit(input) {
        if (isFinite(this.lastItem())) {
            this.concatLastItem(input);
        }
        else if (this.expression.length > 0 && this.lastIsOperator(-2) || (this.expression.length == 1 && /[+-]/.test(this.lastItem()))) {
            this.concatLastItem(input);
        } 
        else { this.expression.push(input); }
    },

    operator(input) {
        if (isFinite(this.lastItem())) {
            this.expression.push(input);
        }
        else if (/[+-]/.test(input) && (this.expression.length === 0 || (this.expression.length > 1 && isFinite(this.expression.slice(-2,-1))))) {
            this.expression.push(input);
        } 
    },

    period(input) {
        if (this.lastIsInteger() && !this.operatorReg.test(this.lastItem().slice(-1))) {
           this.concatLastItem(input); 
        }
        if (this.lastIsOperator(-1) || this.expression.length === 0) {
            this.expression.push('0.');
        }
    }

}

const shuntModel = {

    queue: [],

    stack: [],

    run(array) {
        this.parseArray(array);
        this.pushStackToQueue();
        this.stack = [];
    },
    
    parseArray(array) {
        array.forEach(item => {
            if (isFinite(item)) { this.queue.push(parseFloat(item)); }
            else { this.placeOperator(item); }
        })
    },

    pushStackToQueue() {
        while(this.stack.length > 0) {
           this.queue.push(this.stack.pop());
        }
    },

    placeOperator(op) {
        while (this.topOfStackPrecedenceHigherOrEqual(op, this.topOfStack()) && this.stack.length > 0) {
            this.queue.push(this.stack.pop());
        }
        this.stack.push(op);
    },

   topOfStackPrecedenceHigherOrEqual(currentOp, stackTopOp) {
       let plusMinus = /[+-]/;
       let multDiv = /[*\/]/;
       return (multDiv.test(stackTopOp) || plusMinus.test(currentOp));
    },

    topOfStack() { return this.stack[this.stack.length - 1]; }

}

const postfixEvalModel = {

    stack: [],

    result: 'No result yet calculated',

    operators: {
        '*': function([a, b]) { return a * b; },
        '/': function([a, b]) { return a / b; },
        '+': function([a, b]) { return a + b; },
        '-': function([a, b]) { return a - b; }
    },

    run(postfix) {
        for (let item of postfix) { //for... of syntax allows return to break the loop which forEach does not
            if (isFinite(item)) { this.stack.push(item); }
            else { 
                if (this.insufficientOperands()) { return; };
                this.eval(item); 
            }
        };
        this.checkAndAssignResult();
    },

    eval(op) {
        let operands = this.stack.splice(-2);
        this.stack.push(this.operators[op](operands));
    },

    insufficientOperands() {
        if (this.stack.length < 2) { 
            this.result = 'Error: insufficient operands';
            this.stack = [];
            return true;
         }
         return false;
    },

    checkAndAssignResult() {
        if (this.stack.length > 1) {
            this.result = 'Error: too many operands';
        }
        else { 
            this.result = this.stack[0];
         }
        this.stack = [];
    }

}
