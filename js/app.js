var codeMirror;
window.onload = function() {
    codeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
        value: "function myScript(){return 100;}\n",
        mode: "javascript"
    });
};