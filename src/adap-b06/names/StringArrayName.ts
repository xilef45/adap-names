import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
    
    protected readonly components: string[];

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

        //Action + delim by super
        super(delimiter);
        this.components = [...source];

        //postcondtion
        StringArrayName.assertIsStringArrayName(this, "this not type of StringArrayName");
    }

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

    protected getComponents(): string[] {
        return this.components;
    }

    public setComponent(i: number, c: string): StringArrayName {
        return this.withComponent(i, c);
    }

    protected withComponent(i: number, c: string): StringArrayName {
        // Precondition
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const newComponents = [...this.components];
        newComponents[i] = c;
        const retValue = new StringArrayName(newComponents, this.delimiter);
         // Postconditions
        StringArrayName.assertIsStringArrayName(retValue);
        MethodFailedException.assert(retValue.components[i] === c, "setComponent failed to set the component correctly");
        return retValue;
    }

    public insert(i: number, c: string): StringArrayName {
        return this.withInsertedComponent(i, c);
    }

    public withInsertedComponent(i: number, c: string): StringArrayName {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(i >= 0 && i <= this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        const retValue = new StringArrayName(newComponents, this.delimiter);

         // Postconditions
        StringArrayName.assertIsStringArrayName(retValue);
        MethodFailedException.assert(retValue.components[i] === c, "insert failed to insert the component correctly");
        return retValue;
    }   
    
    public append(c: string): StringArrayName {
        return this.withAppendedComponent(c);
    }

    public withAppendedComponent(c: string): StringArrayName {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c,this.getDelimiterCharacter(),ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const retValue = new StringArrayName([...this.components, c], this.delimiter);

         // Postconditions
        StringArrayName.assertIsStringArrayName(retValue);
        MethodFailedException.assert(retValue.components[retValue.components.length - 1] === c, "append failed to append the component correctly");
        return retValue;
    }

    public remove(i: number): StringArrayName {
        return this.withoutComponent(i);
    }

    public withoutComponent(i: number): StringArrayName {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(i >= 0 && i < this.components.length, "Index out of bounds");

        // Actions
        const newComponents = this.components.filter((_, index) => index !== i);
        const retValue = new StringArrayName(newComponents, this.delimiter);

        // Postconditions
        MethodFailedException.assert(this.getNoComponents()-1 == retValue.getNoComponents(),"remove failed to remove the component correctly");        
        return retValue;
    }

    public concat(other: Name): StringArrayName {
        // Precondition
        StringArrayName.assertIsStringArrayName(this);
        StringArrayName.assertIsStringArrayName(other);

        // Actions
        const newComponents = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            newComponents.push(other.getComponent(i));
        }
        const retValue = new StringArrayName(newComponents, this.delimiter);
    
        // Postconditions
        StringArrayName.assertIsStringArrayName(this);
        MethodFailedException.assert(this.getNoComponents() >= (other as StringArrayName).getNoComponents(), "concat failed to concatenate components correctly");
        return retValue;
    }
    
    public equals(other: Name): boolean {
        if (!(other instanceof StringArrayName)) {
            return false;
        }
        return (
            this.delimiter === other.getDelimiterCharacter() &&
            this.getNoComponents() === other.getNoComponents() &&
            this.components.every((comp, i) => comp === other.getComponent(i))
        );
    }

    // helper

    private static assertIsStringArrayName(input: any, failedMessage: string = "Missing Methods of StringArrayName") {
        InvalidStateException.assert(StringArrayName.isStringArrayName(input), failedMessage);
    }

    private static isStringArrayName(input: any): input is StringArrayName {
        let testing = super.isAbstractName(input) &&
            "components" in input && input.components instanceof Array;
        if (input.components === undefined || input.components === null) {
            return false;
        }
        for (const component of input.components) {
            testing = testing && typeof component === "string";
        }
        return testing;
    }
}