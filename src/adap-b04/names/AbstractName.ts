import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        //Precondition
        IllegalArgumentException.assert(delimiter != null, "delimiter null is not allowed");
        IllegalArgumentException.assert(delimiter != undefined , "delimiter undefined is not allowed");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a char");

        // Actions
        if(delimiter=== undefined)
        {
            delimiter=DEFAULT_DELIMITER;
        }
        this.delimiter = delimiter;

        //Postcondition
        AbstractName.assertIsAbstractName(this);
    }

    public clone(): Name {
        //Precondition
        AbstractName.assertIsAbstractName(this);

        // Actions
        const cloned = Object.create(this);

        // Postcondition
        AbstractName.assertIsAbstractName(cloned, "cloned not type of AbstractName");

        return cloned;
    }

    public asString(delimiter: string = this.delimiter): string {
        //Precondition
        AbstractName.assertIsAbstractName(this); 
        IllegalArgumentException.assert(delimiter !== null, "delimiter null is not allowed");
        IllegalArgumentException.assert(delimiter !== "undefined" , "delimiter undefined is not allowed");

        //Actions
        let returnStringArray: string[]= [];
        for(let i=0;i < this.getNoComponents();i++){
            let component = this.getComponent(i);
            returnStringArray.push(component);
        }
        const returnValue = returnStringArray.join(delimiter);

        //Postconditions
        MethodFailedException.assert(returnValue !== "undefined", "resulting String can't be null" )
        MethodFailedException.assert(returnValue !== null, "resulting String can't be null" )

        return returnValue;
    }

    public toString(): string {
        //Precondition
        AbstractName.assertIsAbstractName(this); 
        
        //Actions
        const returnValue = this.asDataString();

        //Postconditions
        MethodFailedException.assert(returnValue !== "undefined", "resulting String can't be null" )
        MethodFailedException.assert(returnValue !== null, "resulting String can't be null" )

        return returnValue;
    }

    public asDataString(): string {
        //Precondition
        AbstractName.assertIsAbstractName(this); 

        //Actions
        let returnStringArray: string[]= [];
        for(let i=0;i < this.getNoComponents();i++){
            let component = this.getComponent(i)
            .split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            if (this.delimiter !== "") {
                       component = component.split(this.delimiter).join(ESCAPE_CHARACTER + this.delimiter);
            }
            returnStringArray.push(component);
        }
        const returnValue = returnStringArray.join(this.delimiter);

        //Postconditions
        MethodFailedException.assert(returnValue !== "undefined", "resulting String can't be null" );
        MethodFailedException.assert(returnValue !== null, "resulting String can't be null" );

        return returnValue;
    }

    public isEqual(other: Name): boolean {
        //Precondition
        AbstractName.assertIsAbstractName(this); 
        IllegalArgumentException.assert(AbstractName.isName(other), "other not Instance of Name");

        //Actions
        const returnValue = this.getHashCode() === other.getHashCode();

        //Postconditions
        MethodFailedException.assert(typeof returnValue === "boolean", "Method produced non boolean result" );

        return returnValue;
    }

    public getHashCode(): number {
        //Precondition
        AbstractName.assertIsAbstractName(this); 

        //Actions
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = Math.imul(31, hash) + char | 0;
        }
        const returnValue = hash;

        //Postconditions
        MethodFailedException.assert(typeof returnValue === "number", "Method produced non number result" );

        return returnValue;
    }

    public isEmpty(): boolean {
        //Precondition
        AbstractName.assertIsAbstractName(this); 

        //Actions
        const returnValue = this.getNoComponents() === 0;

        //Postconditions
        MethodFailedException.assert(typeof returnValue === "boolean", "Method produced non boolean result" );

        return returnValue;
    }

    public getDelimiterCharacter(): string {
        //Precondition
        AbstractName.assertIsAbstractName(this); 

        //Actions
        const returnValue = this.delimiter;

        //Postconditions
        MethodFailedException.assert(typeof returnValue === "string", "Method produced non string result" );
        MethodFailedException.assert(returnValue != null, "delimiter null is not allowed");
        MethodFailedException.assert(returnValue != undefined , "delimiter undefined is not allowed");
        MethodFailedException.assert(returnValue.length === 1, "delimiter must be a char");

        return returnValue;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        //Precondition
        AbstractName.assertIsAbstractName(this);
        IllegalArgumentException.assert(AbstractName.isName(other), "other not Instance of Name");

        //Actions
        for(let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i))
        }

        //Postconditions
        AbstractName.assertIsAbstractName(this);
    }


    //Helper
    protected static isAbstractName(input: any): input is AbstractName {
        return AbstractName.isName(input) && "delimiter" in input &&
            typeof input.delimiter === "string" && input.delimiter.length === 1;
    }

    protected static isName(input: any): input is Name {
        return "isEmpty" in input && typeof input.isEmpty === "function" &&
            "getNoComponents" in input && typeof input.getNoComponents === "function" &&
            "getComponent" in input && typeof input.getComponent === "function" &&
            "setComponent" in input && typeof input.setComponent === "function" &&
            "insert" in input && typeof input.insert === "function" &&
            "append" in input && typeof input.append === "function" &&
            "remove" in input && typeof input.remove === "function" &&
            "concat" in input && typeof input.concat === "function" &&
            "clone" in input && typeof input.clone === "function" &&
            "asString" in input && typeof input.asString === "function" &&
            "asDataString" in input && typeof input.asDataString === "function" &&
            "getDelimiterCharacter" in input && typeof input.getDelimiterCharacter === "function" &&
            "isEqual" in input && typeof input.isEqual === "function" &&
            "getHashCode" in input && typeof input.getHashCode === "function";
    }

    protected static assertIsAbstractName(input:any, failedMessage:string ="Missing Methods of AbstractName"): void {
        MethodFailedException.assert(AbstractName.isAbstractName(input), failedMessage); 
    }

    protected static isCorrectlyMasked(inputString: string, delimiter: string, escape_char: string): boolean {
    // Preconditions
    IllegalArgumentException.assert(typeof inputString === "string", "Input must be a string");
    IllegalArgumentException.assert(typeof delimiter === "string" && delimiter.length === 1, "Delimiter must be a single character");

    if (inputString.length === 0) {
        return true; 
    }

    // Checks
    let isMasked = true;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        if (char === delimiter) {
            // Check if the delimiter is escaped
            if (i === 0 || inputString[i - 1] !== escape_char) {
                isMasked = false; // Not properly escaped
                break;
            }
        }

        // Handle escaped escape characters (e.g., \\)
        if (char === escape_char && i > 0 && inputString[i - 1] === escape_char) {
            continue; // Skip double escape characters
        }
    }

    // Postconditions
    MethodFailedException.assert(typeof isMasked === "boolean", "isCorrectlyMasked did not return a boolean");

    return isMasked;
}

}