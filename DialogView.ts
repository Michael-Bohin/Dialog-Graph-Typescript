class DialogView {
    dialogGraph: DialogGraph;
    constructor(dg: DialogGraph) {
        this.dialogGraph = dg;
    }

    SetAnswer(answer: string): boolean {
        this.dialogGraph.SetAnswer(answer);
        return true;
    }

    StartPage(): void {
        getEl("emailBox").style.display = "none";
        getEl("intBox").style.display = "none";
       // getEl("otazka").style.columnSpan = "2";
    }
}