interface IPublicView {
    SetAnswer(answer: string, id: string) : void; // all except email and telephone (gets individual validation)
    Reverse(): void;
    UpdateEmailValidation(): void;
    UpdateTelValidation(): void;
    SetEmailAndTelephone(email:string, number:string): void;
}

class DialogPublicView implements IPublicView {
    dialogGraph: DialogGraph;
    constructor(dg: DialogGraph) {
        this.dialogGraph = dg;
        this.Redraw();
    }

    public SetAnswer(answer: string, id: string): void {
        if (this.dialogGraph.SetAnswer(answer)) {
            this.Redraw(); // answer was correct, current question has been updated as well as chatHistory -> redraw page
        } else {
            this.Warning(id);
        }
    }

    private Redraw(): void {
        // implement drawing of all UI components:
        // check what type of question is currently active, depending on that display none the other controls, set inline to the one active.
        // for string options question, set correct inner text of buttons
        // update value of input fields int and mail to contain value "" in order for placeholder to be vissible 
        let currentQuestion: Question = this.dialogGraph.GetQuestion();
        // console.log("Drawing current question: ", currentQuestion );
        let type: string = currentQuestion.GetType();
        this.HideNotActiveControls(type);

        if (type == "Options question") { // this now assumes string options will always have two options -> fix this in future to be general
            getEl("moznostA").innerText = currentQuestion.options[0].name;
            getEl("moznostB").innerText = currentQuestion.options[1].name;
        } else if (type == "Integer question") {
            let el: HTMLInputElement = <HTMLInputElement>getEl("int");
            el.value = "";
        } else if (type == "Email question") {
            let el: HTMLInputElement = <HTMLInputElement>getEl("email");
            el.value = "";
        }

        getEl("otazka").innerText = currentQuestion.question;
        if (currentQuestion.question == "END")
            this.DisplaySummary();

        if (currentQuestion.name == "web shop" || currentQuestion.name == "END") {
            getEl("reverseAnswer").style.display = "none";
        } else {
            getEl("reverseAnswer").style.display = "inline";
        }
    }
    // stringBoxA
    // stringBoxB
    // intBox
    // emailBox

    private HideNotActiveControls(type: string) {
        //this.hideAll(["stringBoxA", "stringBoxB", "intBox", "emailBox"]);
        if (type == "Options question") {
            getEl("stringBoxA").style.display = "table-cell";
            getEl("stringBoxB").style.display = "table-cell";
            getEl("intBox").style.display = "none";
            getEl("emailBox").style.display = "none";
        } else if (type == "Integer question") {
            getEl("stringBoxA").style.display = "none";
            getEl("stringBoxB").style.display = "none";
            getEl("intBox").style.display = "table-cell";
            getEl("emailBox").style.display = "none";
        } else if (type == "Email question") {
            getEl("stringBoxA").style.display = "none";
            getEl("stringBoxB").style.display = "none";
            getEl("intBox").style.display = "none";
            getEl("emailBox").style.display = "table-cell";
        } else if (type == "Boundary vertex question") {
            console.log("Nothing to show as boundary vertex is active.");
        } else {
            throw new CustomDefinedError("Redraw method recieved question with unknown type!");
        }
    }

    private DisplaySummary() : void {
        console.log("Displaying summary: ");
        getEl("nadpis").innerText = "Dekujeme za zajem. Na Vasi poptavku se podivame a napiseme Vam email s nabidkou.";
        getEl("tableBody").innerText = "";
        getEl("otazka").innerText = "Souhrn Vasi poptavky:";
        for (let answer of this.dialogGraph.GetChatHistory())
            this.AddAnswerToTable(answer);
    }

    private AddAnswerToTable( answer : Answer): void {
        let tableRow: HTMLElement = document.createElement("tr");
        let leftTableData: HTMLElement = document.createElement("td");
        let rightTableData: HTMLElement = document.createElement("td");
        leftTableData.innerText = answer.question;
        rightTableData.innerText = answer.answer;
        tableRow.appendChild(leftTableData);
        tableRow.appendChild(rightTableData);
        getEl("tableBody").appendChild(tableRow);
    }

    public Reverse(): void {
        // napis obecnou logiku pro libovolny graf (model se vyjadri jestli muze couvat nebo ne)
        this.dialogGraph.Reverse();
        this.Redraw();
    }

    public UpdateEmailValidation(): void {
        let val:string = (<HTMLInputElement>getEl("email")).value;

        if ( this.dialogGraph.ValidInput(val, "DejMiEmail") ) {
            getEl("markEmail").classList.remove("invisible");
        } else {
            getEl("markEmail").classList.add("invisible");
        }
    }

    public UpdateTelValidation(): void {
        let val: string = (<HTMLInputElement>getEl("tel")).value;

        if (this.dialogGraph.ValidInput(val, "DejMiTel")) {
            getEl("markTel").classList.remove("invisible");
        } else {
            getEl("markTel").classList.add("invisible");
        }
    }

    public SetEmailAndTelephone(email: string, number: string):void {
        let legitEmail: boolean = this.dialogGraph.ValidInput(email, "DejMiEmail");
        let legitNumber: boolean = this.dialogGraph.ValidInput(number, "DejMiTel");

        if (legitEmail && legitNumber) {
            console.log("Everythin is alrgiht!");
            this.dialogGraph.SetAnswer(email); 
            this.dialogGraph.SetAnswer(number);
            this.Redraw();
        } else if (legitEmail) {
            console.log("Number is not legit!");
            this.Warning("tel");
        } else if (legitNumber) {
            console.log("Email is not legit!");
            this.Warning("email");
        } else {
            console.log("Neither email or number are legit!");
            this.Warning("email");
            this.Warning("tel");
        }
    }

    private Warning(id: string): void {
        getEl(id).style.backgroundColor = "rgb(160, 30, 30)";
        setTimeout(() => {
            getEl(id).style.backgroundColor = "rgb(255, 255, 255)";
        }, 3000 ); // wait 3000 milisecond before executing
    }
}