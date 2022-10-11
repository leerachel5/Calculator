import { Calculator } from "./Calculator.js"


let numEl = document.getElementById("number-el");
let calculator = new Calculator();

window._calculatorFunctions = {enterDigit, clearDisplay, decimal, openParenthesis, closeParenthesis, equals, add, subtract, multiply, divide, deleteDigit, power};
window.calculator = calculator;

window.addEventListener("keydown", eventHandler, false);

function eventHandler(event) {
    if (event.key >= '0' && event.key <= '9')
        enterDigit(parseInt(event.key));
    else if (event.key == "Backspace")
        deleteDigit();
    else if (event.key == "(")
        openParenthesis();
    else if (event.key == ")")
        closeParenthesis();
    else if (event.key == "+")
        add();
    else if (event.key == "-")
        subtract();
    else if (event.key == "*")
        multiply();
    else if (event.key == "/")
        divide();
    else if (event.key == "^")
        power();
    else if (event.key == "Enter")
        equals();
    else if (event.key == ".")
        decimal();
}

function enterDigit(digit) {
    calculator.addDigit(digit);
    numEl.textContent = calculator.expressionStr();
}

function clearDisplay() {
    calculator.clear();
    numEl.textContent = calculator.expressionStr();
}

function deleteDigit() {
    calculator.delete();
    numEl.textContent = calculator.expressionStr();
}

function openParenthesis() {
    calculator.openParenthesis();
    numEl.textContent = calculator.expressionStr();
}

function closeParenthesis() {
    calculator.closeParenthesis();
    numEl.textContent = calculator.expressionStr();
}

function add() {
    calculator.add();
    numEl.textContent = calculator.expressionStr();
}

function subtract() {
    calculator.subtract();
    numEl.textContent = calculator.expressionStr();
}

function multiply() {
    calculator.multiply();
    numEl.textContent = calculator.expressionStr();
}

function divide() {
    calculator.divide();
    numEl.textContent = calculator.expressionStr();
}

function power() {
    calculator.power();
    numEl.textContent = calculator.expressionStr();
}

function equals() {
    calculator.computeExpression();
    numEl.textContent = calculator.expressionStr();
}

function decimal() {
    calculator.decimal();
    numEl.textContent = calculator.expressionStr();
}