
class Edge {
    readonly name: string;
    readonly to: string;
    
    constructor(to: string, n: string = "NOT SET") {
        this.name = n;
        this.to = to;
    }
}

abstract class Question {
    readonly name: string;
    readonly question: string;
    readonly options: Array<Edge>;

    constructor(n: string, q: string, o: Array<Edge>) {
        this.name = n;
        this.question = q;
        this.options = o;
    }

    abstract IsAnswerValid(answer: string): boolean;
    abstract GetNextQuestion(answer: string): string;
    abstract GetType(): string;
    ToString(): string { return this.question; }
}

class OptionsQ extends Question {
    constructor(n: string, q: string, o: Array<Edge>) {
        super(n, q, o);
    }

    IsAnswerValid(answer: string): boolean {
        for (let e of this.options)
            if (answer == e.name)
                return true;
        return false;
    }

    GetNextQuestion(answer: string): string {
        for (let e of this.options)
            if (answer == e.name)
                return e.to;
        
        return "Corresponding option not found!";
    }

    GetType(): string { return "Options question";}
}

class IntQ extends Question {
    readonly min: number;
    readonly max: number;
    constructor(n: string, q: string, o: Array<Edge>, min:number, max:number) {
        super(n, q, o);
        this.min = min;
        this.max = max;
    }

    IsAnswerValid(answer: string): boolean {
        let num: number = parseInt(answer);
        if (num == NaN)
            return false;
        return (this.min <= num && num <= this.max);
    }

    GetNextQuestion(answer: string): string {
        // assumes next question is at index 0 of options
        // int future implement int question ahving multiple options 
        return this.options[0].to;
    }

    GetType(): string { return "Integer question"; }
}

class EmailQ extends Question {
    constructor(n: string, q: string, o: Array<Edge>) {
        super(n, q, o);
    }

    IsAnswerValid(answer: string): boolean {
        return true;
    }

    GetNextQuestion(answer: string): string {
        return this.options[0].to;
    }

    GetType(): string { return "Email question"; }
}

class BoundaryVertex extends Question {
    constructor(n:string, o:Array<Edge> = []) {
        super(n, n, o );
    }

    IsAnswerValid(answer: string): boolean {
        return (this.name == "START");
    }

    GetNextQuestion(): string {
        if (this.name == "START") 
            return this.options[0].to;
        return "Critical error, END may not continue anywhere.";
    }

    GetType(): string {
        return "Boundary vertex question";
    }
}

class Answer {
    readonly question: string;
    readonly answer: string;
    readonly type: string;
    readonly name: string;
    constructor(q: string, a: string, t: string, n: string) {
        this.question = q; this.answer = a; this.type = t; this.name = n;
    }

    ToString(): string { return `${this.question} ${this.answer}`;}
}

enum State { UNDISCOVERED, OPENED, CLOSED };

interface IDialog {
    GetQuestion(): Question;
    SetAnswer(answer: string): boolean;
    Reverse(): void;
    IsGraphValid(): boolean;
    GetChatHistory(): Array<Answer>;
}

class CustomDefinedError extends Error {
    constructor(error: string) {
        super(error);
    }
}

class DialogGraph implements IDialog {
    private questions: Map<string, Question>;
    private chatHistory: Array<Answer>;
    private currentQuestion: Question;

    private DFSstates: Map<string, State>;
    private CollectionQ: Array<Question>;

    constructor( inputQuestions: Array<Question>) {
        this.questions = new Map<string, Question>();
        for (let q of inputQuestions)
            this.questions.set(q.name, q);

        this.chatHistory = new Array<Answer>();
        this.questions.set("START", new BoundaryVertex("START",  ));

    }

    SetAnswer(answer: string): boolean {
        console.log(`Dialog model is setting the answer to: ${answer}`);
        return false;
    }

   

}

