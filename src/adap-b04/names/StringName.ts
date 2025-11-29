import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";


export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        //delim by super
        super(delimiter);

        //Precondition for source
        IllegalArgumentException.assert(AbstractName.isMasked(source,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "source not masked correct");
          
        //delim by super
        super(delimiter);

        //Action
        this.name = source;
        this.noComponents = source.split(this.delimiter).length;

        //postcondtion
        StringName.assertIsStringName(this, "this not type of StringName");
    }

    /*
    public clone(): Name {
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
        // Precondition
        StringName.assertIsStringName(this);

        // Actions
        const retValue = this.noComponents;

        // Postconditions
        MethodFailedException.assert(retValue >= 0, "getNoComponents did not return a valid number");

        return retValue;
    }

    public getComponent(i: number): string {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i > 0 && i < this.noComponents, "Index out of bounds");

        // Actions
        const retValue = this.name.split(this.delimiter)[i];

        // Postconditions
        MethodFailedException.assert(typeof retValue === "string", "getComponent did not return a string");

        return retValue;
    }

    public setComponent(i: number, c: string) {
       // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        let components = this.name.split(this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);

        // Postconditions
        StringName.assertIsStringName(this);
        MethodFailedException.assert(this.getComponent(i) === c, "setComponent failed to set the component correctly");

    }

    public insert(i: number, c: string) {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const components = this.name.split(this.delimiter);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;

        // Postconditions
        StringName.assertIsStringName(this);
        MethodFailedException.assert(this.getComponent(i) === c, "insert failed to insert the component correctly");
    }

    public append(c: string) {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(AbstractName.isMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        this.name += this.delimiter + c;
        this.noComponents++;

        // Postconditions
        StringName.assertIsStringName(this);
        MethodFailedException.assert(this.getComponent(this.noComponents - 1) === c, "append failed to add the component correctly");
    }

    public remove(i: number) {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");

        const oldLen = this.getNoComponents();
        // Actions
        const components = this.name.split(this.delimiter);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;

        // Postconditions
        StringName.assertIsStringName(this);
        MethodFailedException.assert(this.getNoComponents() === components.length, "remove failed to remove the component correctly");
        MethodFailedException.assert(oldLen-1 == this.getNoComponents(),"remove failed to remove the component correctly");
    }

    public concat(other: Name): void {
        // Precondition
        StringName.assertIsStringName(this);
        StringName.assertIsStringName(other);

        // Actions
        this.name += this.delimiter + (other as StringName).name;
        this.noComponents += (other as StringName).getNoComponents();

        // Postconditions
        StringName.assertIsStringName(this);
        MethodFailedException.assert(this.getNoComponents() >= (other as StringName).getNoComponents(), "concat failed to concatenate components correctly");

    }

    // helper
    
    private static assertIsStringName(input: any,failedMessage:string ="Missing Methods of StringName"){
        InvalidStateException.assert(StringName.isStringName(input), failedMessage );
    }

    private static isStringName(input: any): input is StringName{
        var testing : boolean = super.isAbstractName(input) &&
            "name" in input && typeof input.name === "string" &&
            "noComponents"in input && typeof input.noComponents === "number";
        testing = testing && AbstractName.isMasked(input.name, input.getDelimiterCharacter(), input.ESCAPE_CHARACTER) &&
            input.noComponents == input.split(input.getDelimiterCharacter).length;  

        return testing;
    }

}