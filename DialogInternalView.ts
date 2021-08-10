interface IInternalView extends IPublicView {
    /*SetAnswer(answer: string, id: string) : void; // all except email and telephone (gets individual validation)
    Reverse(): void;
    UpdateEmailValidation(): void;
    UpdateTelValidation(): void;
    SetEmailAndTelephone(email:string, number:string): void;*/
    // inherited ^^
    // extending with: 
    // 1. redraw always rerenders entire history with options to change 
    // 2:
    ChangeBtn(answer: string, questionName: string): void;
    // returns true if questionName exists and answer is valid, otherwise returns false 

}

class DialogInternalView extends DialogPublicView implements IInternalView {
    private initiated: boolean = false;
    constructor(dg: DialogGraph) {
        super(dg);
        this.ViewHistory();
        this.initiated = true;
    }

    private ViewHistory(): void {
        getEl("tableHistoryBody").innerHTML = ""; // erase all
        for (let q of this.dialogGraph.GetAllQuestions())
            if (this.dialogGraph.ChatHistoryContains(q.name)) {
                this.CreateAnswerRow(q);
                getEl(q.name).style.display = "table-row";
                getEl(`odpoved-${q.name}`).innerText = this.dialogGraph.ChatHistoryAnswer(q.name);
            }
    }

    private CreateAnswerRow(question: Question) {
        // create elements 
        // add ids, inner texts, types and classes
        // join tree
        // append to DOM

        let tableRow: HTMLElement = document.createElement("tr");
        let leftTableData: HTMLElement = document.createElement("td");
        let centerTableData: HTMLElement = document.createElement("td");
        let rightTableData: HTMLElement = document.createElement("td");
        let changeBtn: HTMLButtonElement = document.createElement("button");

        tableRow.id = question.name;
        leftTableData.innerText = question.question;
        centerTableData.id = `odpoved-${question.name}`;
        changeBtn.id = `changeBtn-${question.name}`;
        changeBtn.type = "button";
        changeBtn.innerText = "Zmenit";
        changeBtn.classList.add("btn", "yellow");
        

        rightTableData.appendChild(changeBtn);
        tableRow.appendChild(leftTableData);
        tableRow.appendChild(centerTableData);
        tableRow.appendChild(rightTableData);

        // finnish the task, append to DOM:
        getEl("tableHistoryBody").appendChild(tableRow);
        getEl("changeBtn-" + question.name).addEventListener("click", () => { this.ChangeBtn(question.name); });
    }

    Redraw() {
        super.Redraw();
        if (this.initiated)
            this.ViewHistory();
    }

    changeLock: string = "";
    public ChangeBtn(questionName:string): void {
        console.log("DialogInternalView.ChangeBtn reporting for duty with parameter: " + questionName);
        let result: string = window.prompt("What change to the answer would you like to save?");

        console.log("User would to commit following change: " + result);
        if (this.dialogGraph.ValidInput(result, questionName)) {
            console.log("Change is valid and saved.");
            this.dialogGraph.UnsafeChangeAnswer(result, questionName);
            this.Redraw();
        } else {
            console.log("Change was declined becuase the value is not valid.");
            getEl("changeBtn-" + questionName).classList.add("red");
            setTimeout(() => { getEl("changeBtn-" + questionName).classList.remove("red");}, 2500);
        }
    }

    protected DisplaySummary(): void {
        super.DisplaySummary();
        getEl("tableHistoryBody").innerHTML = ""; // erase all
        for (let q of this.dialogGraph.GetAllQuestions())
            if (this.dialogGraph.ChatHistoryContains(q.name)) {
                this.CreateAnswerRow(q);
                getEl(q.name).style.display = "table-row";
                getEl(`odpoved-${q.name}`).innerText = this.dialogGraph.ChatHistoryAnswer(q.name);
                console.log("Display summary: ", getEl("changeBtn-" + q.name));
                getEl("changeBtn-" + q.name).style.visibility = "hidden";
            }
    }
}