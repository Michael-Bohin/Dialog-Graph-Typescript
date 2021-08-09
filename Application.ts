window.addEventListener('DOMContentLoaded', (ev) => {
    let questions: Array<Question> = new Array<Question> (
        new OptionsQ("web shop", "Chces stranku nebo eshop?",       new Array<Edge> ( new Edge("Eshop", "Kolik produktu"),  new Edge("Web", "Velky") )),
        new IntQ("Kolik produktu", "Kolik prodktu v eshopu chces?", new Array<Edge> ( new Edge("Velky") )       , 1, 1_000_000),
        new OptionsQ("Velky", "Chces to velky?",                    new Array<Edge> ( new Edge("Ano", "SEO"),               new Edge("Ne", "Fotky")  )),
        new OptionsQ("SEO", "Chces SEO?",                           new Array<Edge> ( new Edge("Ano", "KolikSEA"),          new Edge("Ne", "Fotky")  )),
        new IntQ("KolikSEA", "Kolike SEA chces?",                   new Array<Edge> ( new Edge("Fotky") )       , 1, 1_000_000),
        new OptionsQ("Fotky", "Chces fotky?",                       new Array<Edge> ( new Edge("Ano", "KolikFotek"),        new Edge("Ne", "DejMiEmail") )),
        new IntQ("KolikFotek", "Kolik fotek na web pridame?",       new Array<Edge> ( new Edge("DejMiEmail") )  , 1, 1_000_000),
        new EmailQ("DejMiEmail", "Jaky je tvuj email?",             new Array<Edge> ( new Edge("END") ))
    );
    let model: DialogGraph = new DialogGraph(questions);
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
