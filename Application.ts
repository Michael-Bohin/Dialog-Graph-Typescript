window.addEventListener('DOMContentLoaded', (ev) => {
    let questions: Array<Question> = new Array<Question> (
        new OptionsQ("web shop", "Chces stranku nebo eshop?",               new Array<Edge> ( new Edge("Eshop", "Kolik produktu"),  new Edge("Web", "Velky") )),
        new IntQ("Kolik produktu", "Kolik produktu v eshopu chces?",        new Array<Edge> ( new Edge("Velky", "Velky") )       , 1, 1_000_000),
        new OptionsQ("Velky", "Chces to velky?",                            new Array<Edge> ( new Edge("Ano", "SEO"),               new Edge("Ne", "SEO")  )),
        new OptionsQ("SEO", "Chces SEO?",                                   new Array<Edge> ( new Edge("Ano", "KolikSEA"),          new Edge("Ne", "Fotky")  )),
        new IntQ("KolikSEA", "Kolike SEA chces?",                           new Array<Edge> ( new Edge("Fotky", "Fotky") )       , 1, 1_000_000),
        new OptionsQ("Fotky", "Chces fotky?",                               new Array<Edge> ( new Edge("Ano", "KolikFotek"),        new Edge("Ne", "DejMiEmail") )),
        new IntQ("KolikFotek", "Kolik fotek na web pridame?",               new Array<Edge> ( new Edge("DejMiEmail", "DejMiEmail") )  , 1, 1_000_000),
        new EmailQ("DejMiEmail", "Jaky je tvuj email a telefonni cislo?",   new Array<Edge> ( new Edge("DejMiTel", "DejMiTel") ) ),
        new TelephoneQ("DejMiTel", "Jaky je tvuj email a telefoni cislo?",  new Array<Edge> ( new Edge("END", "END")))
    );
    console.log(questions);
    let model: DialogGraph = new DialogGraph(questions);
    let view : DialogPublicView = new DialogPublicView(model);

    placeEventListeners(view);
});

function placeEventListeners( view : DialogPublicView) {
    getEl("moznostA").addEventListener("click", () => {
        let answer: string = getEl("moznostA").innerText;
        view.SetAnswer(answer, "moznostA");
    });

    getEl("moznostB").addEventListener("click", () => {
        let answer: string = getEl("moznostB").innerText;
        view.SetAnswer(answer, "moznostB");
    });

    getEl("enterInt").addEventListener("click", () => {
        let answer: string = (<HTMLInputElement>getEl("int")).value;
        view.SetAnswer( answer, "int" );
    });

    getEl("enterEmail").addEventListener("click", () => {
        const email: string = (<HTMLInputElement>getEl("email")).value;
        const number: string = (<HTMLInputElement>getEl("tel")).value;
        view.SetEmailAndTelephone( email, number );
    });

    getEl("reverseAnswer").addEventListener("click", () => { view.Reverse(); });

    getEl("email").addEventListener("input", () => { view.UpdateEmailValidation(); } );

    getEl("tel").addEventListener("input", () => { view.UpdateTelValidation(); } );
}
