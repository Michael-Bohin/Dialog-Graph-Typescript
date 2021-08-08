"use strict";
function getEl(id) { return document.getElementById(id); }
class Edge {
    constructor(to, n = "NOT SET") {
        this.name = n;
        this.to = to;
    }
}
class Question {
    constructor(n, q, o) {
        this.name = n;
        this.question = q;
        this.options = o;
    }
    ToString() { return this.question; }
}
class OptionsQ extends Question {
    constructor(n, q, o) {
        super(n, q, o);
    }
    IsAnswerValid(answer) {
        for (let e of this.options)
            if (answer == e.name)
                return true;
        return false;
    }
    GetNextQuestion(answer) {
        for (let e of this.options)
            if (answer == e.name)
                return e.to;
        return "Corresponding option not found!";
    }
    GetType() { return "Options question"; }
}
class DialogGraph {
    constructor() {
        this.b = "ahoj svete, model DialogGraph se hlasi do sluzby";
        console.log(this.b);
    }
    SetAnswer(answer) {
        console.log(`Dialog model is setting the answer to: ${answer}`);
        return false;
    }
}
class DialogView {
    constructor(dg) {
        this.dialogGraph = dg;
    }
    SetAnswer(answer) {
        this.dialogGraph.SetAnswer(answer);
        return true;
    }
    StartPage() {
        getEl("emailBox").style.display = "none";
        getEl("intBox").style.display = "none";
    }
}
window.addEventListener('DOMContentLoaded', (ev) => {
    let names = new Array("Mary", "Tom", "Jack", "Jill");
    let model = new DialogGraph();
    let view = new DialogView(model);
    placeEventListeners(view);
    view.StartPage();
});
function placeEventListeners(view) {
    getEl("moznostA").addEventListener("click", function () {
        let answer = getEl("moznostA").innerText;
        view.SetAnswer(answer);
    });
    getEl("moznostB").addEventListener("click", function () {
        let answer = getEl("moznostB").innerText;
        view.SetAnswer(answer);
    });
    getEl("enterInt").addEventListener("click", function () {
        const inputElement = getEl("int");
        let answer = inputElement.value;
        view.SetAnswer(answer);
    });
    getEl("enterEmail").addEventListener("click", function () {
        const inputElement = getEl("email");
        let answer = inputElement.value;
        view.SetAnswer(answer);
    });
}
