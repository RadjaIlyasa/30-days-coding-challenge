const display = document.getElementById("display");
const angka = document.querySelectorAll(".angka");
const operator = document.querySelectorAll(".operator");
const clear = document.getElementById("clear");
const equal = document.getElementById("equal");
const decimal = document.getElementById("decimal");

let currentInput = "";
let previousInput = "";
let operatorInput = "";
let isResult = false;

angka.forEach(function(button) {
    button.addEventListener("click", function() {

        if (isResult) {
            currentInput = "";
            isResult = false;
        }
        currentInput += button.textContent
        display.textContent = currentInput;
    });
});

operator.forEach(function(button) {
    button.addEventListener("click", function() {
        operatorInput = button.textContent;
        previousInput = currentInput;
        currentInput = "";
        isResult = false;
    });
});

equal.addEventListener("click", function() {
    if (previousInput !== "" && currentInput !== "" && operatorInput !== "") {
        const prev = Number(previousInput);
        const current = Number(currentInput);
        if (operatorInput === "+") {
            currentInput = (prev + current).toString();
        }else if (operatorInput === "-") {
            currentInput = (prev - current).toString();
        }else if (operatorInput === "x") {
            currentInput = (prev * current).toString();
        }else if (operatorInput === "/") {
            if (current === 0) {
                currentInput = "Error";
            }else {
                currentInput = (prev / current).toString();
            }   
        }
    }
    display.textContent = currentInput;
    previousInput = "";
    operatorInput = "";
    isResult = true;
});

clear.addEventListener("click", function() {
    currentInput = "";
    previousInput = "";
    operatorInput = "";
    display.textContent = "0";
    isResult = false;
});

decimal.addEventListener("click", function() {
   if(isResult) {
        currentInput = "";
        isResult = false;
    }else if (!currentInput.includes(".")) {
        currentInput += ".";
    }
    display.textContent = currentInput;
});