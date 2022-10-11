import { Stack } from "./Stack.js"
import { countDecimals, toNFixed } from "./Decimal.js"


export class Calculator {
    static #computationOrder = [".", "^", ["*", "/"], ["+", "-"]];
    static #errorMargin = 0.00000001

    constructor () {
        this.isResult = false;
        this.expr = [0];
    }

    expressionStr() {
        let s = "";
        for (let i = 0; i < this.expr.length; i++) {
            if (this.expr[i] == ".")
                s = s.substring(0, s.length - 1) + ".";
            else
                s += this.expr[i] + " ";
        }
        return s;
    }
    
    static #isDecimal(n) {
        if (typeof n == "number")
            return Math.floor(n) !== n;
        return false;
    }

    addDigit(digit) {
        if (!(typeof this.expr[this.expr.length - 1] == "string")) {
            if (this.isResult) {
                this.isResult = false;
                this.expr = [digit];
            }
            else
                this.expr[this.expr.length - 1] = this.expr[this.expr.length - 1] * 10 + digit;
        }
        else
            this.expr.push(digit);
    }

    clear() {
        this.expr = [0];
        this.isResult = false;
    }

    delete() {
        let lastChar = this.expr[this.expr.length - 1];
        if (typeof lastChar == "string")
            if (this.expr.length == 1 && lastChar == "(")
                this.expr = [0];
            else
                this.expr.pop();
        else {
            if (Calculator.#isDecimal(lastChar)) {
                if (countDecimals(lastChar) == 1) {
                    this.expr[this.expr.length - 1] = Math.floor(lastChar);
                    this.expr.push(".");
                }
                else
                    this.expr[this.expr.length - 1] = parseFloat(toNFixed(lastChar, countDecimals(lastChar) - 1));
            }
            else
                this.expr[this.expr.length - 1] = Math.floor(lastChar / 10);
            if (this.expr[this.expr.length - 1] == 0 && this.expr.length != 1)
                this.expr.pop();
        }
        this.isResult = false;
    }

    add() {
        if (this.expr[this.expr.length - 1] == ")" || typeof this.expr[this.expr.length - 1] !== "string") {
            this.expr.push("+");
            this.isResult = false;
        }
        else
            this.expr[this.expr.length - 1] = "+";
    }

    subtract() {
        if (this.expr[this.expr.length - 1] == ")" || typeof this.expr[this.expr.length - 1] !== "string") {
            this.expr.push("-");
            this.isResult = false;
        }
        else
            this.expr[this.expr.length - 1] = "-";
    }

    multiply() {
        if (this.expr[this.expr.length - 1] == ")" || typeof this.expr[this.expr.length - 1] !== "string") {
            this.expr.push("*");
            this.isResult = false;
        }
        else
            this.expr[this.expr.length - 1] = "*";
    }

    divide() {
        if (this.expr[this.expr.length - 1] == ")" || typeof this.expr[this.expr.length - 1] !== "string") {
            this.expr.push("/");
            this.isResult = false;
        }
        else
            this.expr[this.expr.length - 1] = "/";
    }

    power() {
        if (this.expr[this.expr.length - 1] == ")" || typeof this.expr[this.expr.length - 1] !== "string") {
            this.expr.push("^");
            this.isResult = false;
        }
        else
            this.expr[this.expr.length - 1] = "^";
    }

    decimal() {
        if (!Calculator.#isDecimal(this.expr[this.expr.length - 1]))
        {
            if (typeof this.expr[this.expr.length - 1] == "string" && this.expr[this.expr.length - 1] !== ".") {
                this.expr.push(0);
                this.expr.push(".");
            }
            else
                if (!(this.expr.length > 1 && this.expr[this.expr.length - 2] == "."))
                    this.expr.push(".");
            this.isResult = false;
        }
    }

    openParenthesis() {
        if (this.expr.length == 1 && this.expr[0] == 0)
            this.expr.pop();
        this.expr.push("(");
        this.isResult = false;
    }

    closeParenthesis() {
        if (typeof this.expr[this.expr.length - 1] !== "string" || this.expr[this.expr.length - 1] == ")")
            this.expr.push(")");
    }

    #validParentheses() {
        let parens = new Stack();

        for (let i in this.expr) {
            if (this.expr[i] == "(")
                parens.push("(");
            else if (this.expr[i] == ")") {
                if (parens.isEmpty())
                    return false;
                else
                    parens.pop();
            }
        }
        return parens.isEmpty();
    }

    #computePartialExpression(opr, n1, n2) {
        if (opr == ".")
            return n1 + (n2 / Math.pow(10, n2.toString().length));
        else if (opr == "+")
            return n1 + n2;
        else if (opr == "-")
            return n1 - n2;
        else if (opr == "*")
            return n1 * n2;
        else if (opr == "/")
            return n1 / n2;
        else if (opr == "^")
            return Math.pow(n1, n2);
    }

    #computeExpressionR(expression) {
        let exp = [...expression];
        let startIndexes = new Stack();
        for (let i = 0; i < exp.length; i++) {
            if (exp[i] == '(') {
                startIndexes.push(i + 1);
            }
            else if (exp[i] == ')') {
                let startIndex = startIndexes.pop();
                let tempExpr = exp.slice(0, startIndex - 1);
                if (startIndex - 2 >= 0 && typeof exp[startIndex - 2] !== "string")
                    tempExpr.push("*");
                tempExpr = tempExpr.concat(this.#computeExpressionR(exp.slice(startIndex, i)));
                if (i + 1 < exp.length)
                    if (typeof exp[i + 1] !== "string" || exp[i + 1] == "(")
                        tempExpr.push("*");
                    tempExpr = tempExpr.concat(exp.slice(i + 1));
                exp = tempExpr
                if (startIndexes.isEmpty())
                    i = startIndex;
                else
                    i = startIndexes.peek();
            }
        }

        for (let i = 0; i < Calculator.#computationOrder.length; i++) {
            for (let j = 0; j < exp.length - 1; j++) {
                if ((typeof Calculator.#computationOrder[i] == "string" && exp[j] == Calculator.#computationOrder[i])
                || (typeof Calculator.#computationOrder[i] == "object" && Calculator.#computationOrder[i].includes(exp[j]))) {
                    let tempExpr = exp.slice(0, j - 1);
                    tempExpr.push(this.#computePartialExpression(exp[j], exp[j - 1], exp[j + 1]));
                    if (j + 2 < exp.length)
                        tempExpr = tempExpr.concat(exp.slice(j + 2));
                    exp = tempExpr;
                    j--;
                }
            }
        }
        return exp;
    }

    computeExpression() {
        // Do format checking here
        if (typeof this.expr[this.expr.length - 1] !== "string" || this.expr[this.expr.length - 1] == ")") {
            if (this.expr.length > 1 && this.#validParentheses()) { 
                this.expr = this.#computeExpressionR(this.expr);
            }
            this.isResult = true;
        }
    }
}