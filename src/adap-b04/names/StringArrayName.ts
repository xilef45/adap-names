import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        //Precondition for source
        IllegalArgumentException.assert(
            Array.isArray(source) && source.every(item => typeof item === "string"),
            "Source must be an array of strings"
        );
        IllegalArgumentException.assert(
            source.length > 0,
            "Source array must not be empty"
        );

        //delim by super
        if(delimiter=== undefined)
        {
            delimiter=DEFAULT_DELIMITER;
        }
        super(delimiter);

        //Action
        this.components = source;

        //postcondtion
        StringArrayName.assertIsStringArrayName(this, "this not type of StringArrayName");
    }

    /*public clone(): Name {
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation or deletion");
    }*/

    public getNoComponents(): number {
        //Precondition
        StringArrayName.assertIsStringArrayName(this);   
        
        //Actions
        const retValue = this.components.length;

        //Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(retValue >= 0 , "NoCompents needs to bei in N0")
        
        return retValue;
    }

    public getComponent(i: number): string {
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(i >= 0 && i < this.components.length, "Index out of bounds");

        //Actions
        const retValue = this.components[i];

        //Postconditions
        MethodFailedException.assert(typeof retValue === "string", "getComponent did not return a string");

        return retValue;
    }

    public setComponent(i: number, c: string) {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isMasked(c,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        this.components[i] = c;

        // Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(this.components[i] === c, "setComponent failed to set the component correctly");
    }

    public insert(i: number, c: string) {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(i >= 0 && i <= this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isMasked(c,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        this.components.splice(i, 0, c);

        // Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(this.components[i] === c, "insert failed to insert the component correctly")
    }

    public append(c: string) {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        IllegalArgumentException.assert(AbstractName.isMasked(c,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        this.components.push(c);

        // Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(this.components[this.components.length - 1] === c, "append failed to add the component correctly");
    }

    public remove(i: number) {
         // Precondition
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(i >= 0 && i < this.components.length, "Index out of bounds");

        const oldLen = this.getNoComponents();
        // Actions
        const removed = this.components.splice(i, 1);

        // Postconditions
        MethodFailedException.assert(removed.length === 1, "remove failed to remove the component correctly");
        MethodFailedException.assert(oldLen-1 == this.getNoComponents(),"remove failed to remove the component correctly");
    }

    public concat(other: Name): void {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        StringArrayName.assertIsStringArrayName(other);

        // Actions
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }

        // Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(this.getNoComponents() >= (other as StringArrayName).getNoComponents(), "concat failed to concatenate components correctly");
    }

    // helper

    private static assertIsStringArrayName(input: any,failedMessage:string ="Missing Methods of StringArrayName"){
        InvalidStateException.assert(StringArrayName.isStringArrayName(input), failedMessage );
    }

    private static isStringArrayName(input: any): input is StringArrayName{
        var testing : boolean = super.isAbstractName(input) &&
            "components" in input && input.components instanceof Array;
        for(var component in input.components)
        {
            testing = testing && typeof input.components[component] === "string";
        }
        return testing;
    }
}