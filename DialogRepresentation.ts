
class Edge {
    readonly name: string;
    readonly to: string;
    
    constructor(n: string, to: string ) {
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
    GetChatHistory(): Array<Answer>;
    IsGraphValid(): boolean;
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

    constructor( inputQuestions: Array<Question>) {
        this.questions = new Map<string, Question>();
        for (let q of inputQuestions)
            this.questions.set(q.name, q);

        this.chatHistory = new Array<Answer>();
        this.questions.set("START", new BoundaryVertex("START", new Array<Edge>( new Edge(inputQuestions[0].name, inputQuestions[0].name) )  ));
        this.questions.set("END", new BoundaryVertex("END") );

        this.currentQuestion = inputQuestions[0];
        
        if (this.GraphIsInvalid())
            throw new CustomDefinedError("Input DialogGraph is not valid.");
    }

    GetQuestion(): Question { return this.currentQuestion; }

    SetAnswer(answer: string): boolean {
        let Q : Question = this.GetQuestion();
        if (/*negace>>*/!/*<<*/ Q.IsAnswerValid(answer))
            return false;

        let a: Answer = new Answer( Q.question, answer, Q.GetType(), Q.name);
        this.chatHistory.push(a);

        this.currentQuestion = this.questions.get( Q.GetNextQuestion(answer) );
        return true;
    }

    Reverse(): void {
        let lastAnswer: Answer = this.chatHistory.pop();
        this.currentQuestion = this.questions.get( lastAnswer.name );
    }

    GetChatHistory(): Array<Answer> { return this.chatHistory; }

    IsGraphValid(): boolean { return !this.GraphIsInvalid(); }

    // Datafields required for Graph validity checks: (foreach question and vertice states of DFS )
    private DFSstates: Map<string, State>;

    private CollectionQ(): Array<Question> { // Javascript doesnt support yield return in the same way C# does
        let result: Array<Question> = new Array<Question>();
        for (let q of this.questions.values())
            result.push(q);
        return result; // solve this in future: 1. How to write generators in js/ts ? 2. How to create copies with new constant instances? 
    }

    GraphIsInvalid():boolean {
        if ( this.NotUniqueNames_ReservedNamesViolation() ) {
            console.log("Critical error, input questions either do not have unique names or they violate reserved 'START' or 'END'. ");
            return true;
        }

        if ( this.EdgesAreInvalid() ) {
            console.log("Critical error, input questions do not contain legit edges.");
            return true;
        }

        if ( this.GraphContainsCycle() ) {
            console.log("Graph contains cycle. :(");
            return true;
        }

        return false;
    }

    private NotUniqueNames_ReservedNamesViolation(): boolean {
        let memory: Set<string> = new Set<string>();
        for (let q of this.CollectionQ()) {
            console.log("Control log " + q);
            if (memory.has(q.name))
                return true; // duplicate names of questions
            // rewrite this logic in future, current architecture disallows checking it here 
            memory.add(q.name);
        }
        return false;
    }

    private EdgesAreInvalid(): boolean {
        if ( this.questions.get("END").options.length != 0 )
            return this.ConsoleTrue("END vertex must not have any out edges!");

        console.log("passed 1");

        for (let e of this.questions.get("START").options)
            if (e.to == "END")
                return this.ConsoleTrue("Question START has edge pointing to END. I believe that will not work as a nonempty dialog. 😞😞");

        console.log("passed 2");
        let endNOTReachable: boolean = true;
        for (let q of this.CollectionQ()) {
            for (let e of q.options) {
                let to: string = e.to;
                if ( !this.questions.has(to) ) 
                    return this.ConsoleTrue(`There is an edge that is pointing to question: ${to}. But guess what. That question does not exist. 😂😂` );

                if (to == "START")
                    return this.ConsoleTrue("Some edge is pointing to 'START' 😜😜");

                if (to == q.name)
                    return this.ConsoleTrue(`Question with the name: '${q.name}' has edge that is pointing to the same question. 🤦🤦`);

                if (to == "END")
                    endNOTReachable = false;
            }
            if (q.name != "END" && q.options.length == 0) 
                return this.ConsoleTrue(`Question ${q.name} has no out edges and thus leads to nowhere! 🤭🤭`);


        }

        console.log("passed 4");
        if (endNOTReachable) 
            return this.ConsoleTrue("I did not find any edges pointing to END. 🤷🤷");

        console.log("passed 5");

        return false;
    }

    private ConsoleTrue(errorMessage: string): boolean {
        console.log(errorMessage);
        return true;
    }

    private GraphContainsCycle(): boolean {
        this.DFSstates = new Map<string, State>();
        for (let q of this.CollectionQ())
            this.DFSstates.set(q.name, State.UNDISCOVERED);

        while (true) {
            let v: string = null;
            for (let q of this.DFSstates.keys()) // this is not right -> making it O(n^2) -> fix it! 
                if (this.DFSstates.get(q) == State.UNDISCOVERED) {
                    v = q;
                    break;
                }
            if (v == null)
                break;

            if (this.DFS(v))
                return this.ConsoleTrue("Graph contains cycle. :(");
        }
        return false; // graph is acyclic :) 
    }

    private DFS(v: string) {
        this.DFSstates.set(v, State.OPENED);
        for (let e of this.questions.get(v).options) {
            let w: string = e.to;
            let stateOfW: State = this.DFSstates.get(w);
            if ( stateOfW == State.OPENED)
                return true; // cycle detected
            if ( stateOfW == State.UNDISCOVERED && this.DFS(w) )
                return true; // je-li vrchol neobjeveny a na nem zavoalan rekurze objevila cyklus, vrat pravda
        }
        this.DFSstates.set(v, State.CLOSED);
        return false; // no cycle detected
    }
}