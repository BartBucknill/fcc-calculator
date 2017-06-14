'use strict';


const octopus = {

    processInput(preppedInfix) {
        shuntModel.run(preppedInfix);
        postfixEvalModel.run(shuntModel.queue);
    }
}

const model = {

    isNum(item) {
        return typeof(item) === 'number';
    }

}

const inputCheckModel = {
    
    expression: [],

    integerReg: /^[0-9]+$/,

    operatorReg: /^[*/+-]+$/,

    lastItem() { 
        return this.expression[this.expression.length - 1];
    },

    lastIsInteger() {
        return this.integerReg.test(this.lastItem());
    },

    lastIsOperator() {
        return this.operatorReg.test(this.lastItem());
    },

    concatLastItem(input) {
        this.expression[this.expression.length - 1] = this.lastItem() + input;
    },
    
    digit(input) {
        if (isFinite(this.lastItem())) {
            this.concatLastItem(input);
        }
        else { this.expression.push(input); }
    },

    operator(input) {
        if (isFinite(this.lastItem())) {
            this.expression.push(input);
        }
    },

    period(input) {
        if (this.lastIsInteger()) {
           this.concatLastItem(input); 
        }
        if (this.lastIsOperator() || this.expression.length === 0) {
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
    },
    
    parseArray(array) {
        array.forEach(item => {
            if (this.isNum(item)) { this.queue.push(item); }
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

Object.setPrototypeOf(shuntModel, model);

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
            if (this.isNum(item)) { this.stack.push(item); }
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
            return true;
         }
         return false;
    },

    checkAndAssignResult() {
        if (this.stack.length > 1) {
            this.result = 'Error: too many operands';
        }
        else { this.result = this.stack[0]; }
    }

}

Object.setPrototypeOf(postfixEvalModel, model);
