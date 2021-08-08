window.addEventListener('DOMContentLoaded', (ev) => {
    let names: string[] = new Array("Mary", "Tom", "Jack", "Jill");
    let model : DialogGraph = new DialogGraph();
    let view : DialogView = new DialogView(model);
    placeEventListeners(view);

    view.StartPage();
});

function placeEventListeners( view : DialogView) {
    getEl("moznostA").addEventListener("click", function () {
        let answer: string = getEl("moznostA").innerText;
        view.SetAnswer(answer);
    });

    getEl("moznostB").addEventListener("click", function () {
        let answer: string = getEl("moznostB").innerText;
        view.SetAnswer(answer);
    });

    getEl("enterInt").addEventListener("click", function () {
        const inputElement = <HTMLInputElement> getEl("int");
        let answer: string = inputElement.value;
        view.SetAnswer( answer );
    });

    getEl("enterEmail").addEventListener("click", function () {
        const inputElement = <HTMLInputElement>getEl("email");
        let answer: string = inputElement.value;
        view.SetAnswer(answer);
    });
}
