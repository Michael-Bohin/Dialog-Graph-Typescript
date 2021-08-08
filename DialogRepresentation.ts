
class Edge {
    readonly name: string;
    readonly to: string;
    
    constructor(to: string, n: string = "NOT SET") {
        this.name = n;
        this.to = to;
    }
}

abstract class Question {
    name: string;
    question: string;
    options: Array<Edge>;

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
    min: number;
    max: number;
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

class DialogGraph {
    b: string = "ahoj svete, model DialogGraph se hlasi do sluzby";
    constructor() {
        console.log(this.b);
    }

    SetAnswer(answer: string): boolean {
        console.log(`Dialog model is setting the answer to: ${answer}`);
        return false;
    }
}

