'use strict';
//output from prepDataModel to be as the below
let data = [2,'+',2,'*',4,'-',8, '/', 2];

// let prepDataModel = {
//     removeSpaces(string) {
//         return string.replace(/ /g, '');
//     },
//      string.split(/([*/+-/])/g).forEach(item => 
//             item = parseFloat(item) || item;
// }

let shuntModel = {

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
        while (this.topOfStackIsHigherPrecedence(op, this.topOfStack())) {
            this.queue.push(this.stack.pop());
        }
        this.stack.push(op);
    },

    topOfStackIsHigherPrecedence(currentOp, stackTopOp) {
        let reg = /[*\/]/;
        return (reg.test(stackTopOp) && !reg.test(currentOp));
    },

    topOfStack() { return this.stack[this.stack.length - 1]; },

    isNum(item) {
        return typeof(item) === 'number';
    }

}

let postfixEvalModel = {



}
