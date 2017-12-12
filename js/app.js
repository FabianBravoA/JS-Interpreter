var codeMirror;
var internalProperties = ["NaN", "Infinity", "undefined", "window", "this", "self", "Function", "Object", "constructor", "Array", "String", "Boolean", "Number", "Date", "RegExp", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "Math", "JSON", "eval", "parseInt", "parseFloat", "isNaN", "isFinite", "alert"];
window.onload = function() {
    codeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
        value: "function myScript(){return 100;}\n",
        mode: "javascript"
    });
};

// Depending on the URL argument, test the compressed or uncompressed version.
var compressed = (document.location.search == '?compressed');
var previousMark;
if (compressed) {
    document.write('<scr' + 'ipt src="acorn_interpreter.js"></scr' + 'ipt>');
} else {
    document.write('<scr' + 'ipt src="acorn.js"></scr' + 'ipt>');
    document.write('<scr' + 'ipt src="interpreter.js"></scr' + 'ipt>');
}

var myInterpreter;

function initAlert(interpreter, scope) {
    var wrapper = function(text) {
        return alert(arguments.length ? text : '');
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(wrapper));
};

function parseButton() {
    var code = codeMirror.doc.getValue();
    myInterpreter = new Interpreter(code, initAlert);
    disable('');
    $("#dataSection").html("<h5>Datos</h5>");
};

function stepButton() {
    if (myInterpreter.stateStack.length) {
        var node = myInterpreter.stateStack[myInterpreter.stateStack.length - 1].node;
        var scope = myInterpreter.stateStack[myInterpreter.stateStack.length - 1].scope;

        for (var propertyKey in scope.properties) {
            if (internalProperties.indexOf(propertyKey) < 0) {
                addVarCard(scope.properties[propertyKey], propertyKey);
            }
        }

        var start = node.start;
        var end = node.end;
    } else {
        var start = 0;
        var end = 0;
    }
    createSelection(start, end);
    try {
        var ok = myInterpreter.step();
    } finally {
        if (!ok) {
            disable('disabled');
        }
    }
};

function addVarCard(newVar, newVarKey) {
    console.log("Bleh > " + $("dataSection > " + newVarKey).html());
    if ($("#dataSection > #" + newVarKey).html()) {
        $("#" + newVarKey + " p").text("" + newVar);
    } else {
        console.log("Inyectando...")
        $("#dataSection").append("<div id='" + newVarKey + "' class='row'>" +
            "<div class='col s12'>" +
            "<div class='card blue-grey darken-1'>" +
            "<div class='card-content white-text'>" +
            "<span class='card-title'>" + newVarKey + "</span>" +
            "<p>" + newVar + "</p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>");
    }
}

function addFunctionCard(newFunction, newFunctionKey) {

}

function runButton() {
    disable('disabled');
    myInterpreter.run();
};

function disable(disabled) {
    document.getElementById('stepButton').disabled = disabled;
    document.getElementById('runButton').disabled = disabled;
};

function getLine(text, start) {
    return text.substring(0, start).split("\n").length - 1;
};

function getCharNumberInLine(text, absNumber) {
    let lines = text.substring(0, absNumber).split("\n");
    return lines[lines.length - 1].length;
};

function createSelection(start, end) {
    var code = codeMirror.doc.getValue();

    if (previousMark) {
        previousMark.clear();
    }

    previousMark = codeMirror.doc.markText({
        line: getLine(code, start),
        ch: getCharNumberInLine(code, start)
    }, {
        line: getLine(code, start),
        ch: getCharNumberInLine(code, end)
    }, {
        className: "selectedCode"
    });
};