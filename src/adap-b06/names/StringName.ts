import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";


export class StringName extends AbstractName {
    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter?: string) {

        super(delimiter);

        //Precondition for source
        AbstractName.isCorrectlyMasked(source, this.getDelimiterCharacter(), ESCAPE_CHARACTER);
        
        //Action
        this.name = source;
        this.noComponents = source.split(this.delimiter).length;

        //postcondtion
        StringName.assertIsStringName(this, "this not type of StringName");
    }

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
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");

        // Actions
        const retValue = this.name.split(this.delimiter)[i];
        // Postconditions
        MethodFailedException.assert(typeof retValue === "string", "getComponent did not return a string");
        
        return retValue;
    }

    protected getComponents(): string[] {
        return this.name.split(this.delimiter);
    }

    public setComponent(i: number, c: string): StringName {
        return this.withComponent(i, c);
    }

    public withComponent(i: number, c: string): StringName {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const components = this.name.split(this.delimiter);
        components[i] = c;
        const retValue = new StringName(components.join(this.delimiter), this.delimiter);
        // Postconditions
        StringName.assertIsStringName(retValue);
        MethodFailedException.assert(retValue.getComponent(i) === c, "setComponent failed to set the component correctly");
    
        return retValue;
    }

    public insert(i: number, c: string): StringName {
        return this.withInsertedComponent(i, c);
    }

    public withInsertedComponent(i: number, c: string): StringName {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Index out of bounds");
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");
        
        // Actions
        const components = this.name.split(this.delimiter);
        components.splice(i, 0, c);
        const retValue = new StringName(components.join(this.delimiter), this.delimiter);
        
        // Postconditions
        StringName.assertIsStringName(retValue);
        MethodFailedException.assert(retValue.getComponent(i) === c, "insert failed to insert the component correctly");

        return retValue;
    }

    public withAppendedComponent(c: string): StringName {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(c, this.getDelimiterCharacter(), ESCAPE_CHARACTER), "Component is not masked correctly");

        // Actions
        const retValue = new StringName(this.name + this.delimiter + c, this.delimiter);
        
        // Postconditions
        StringName.assertIsStringName(retValue);
        MethodFailedException.assert(retValue.getComponent(retValue.getNoComponents() - 1) === c, "withAppendedComponent failed to append the component correctly");

        return retValue;
    }

    public append(c: string): StringName {
        return this.withAppendedComponent(c);
    }

    public remove(i: number): StringName {
        return this.withoutComponent(i);
    }

    public withoutComponent(i: number): StringName {
        // Precondition
        StringName.assertIsStringName(this);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of bounds");
        
        //Actions
        const components = this.name.split(this.delimiter);
        components.splice(i, 1);
        const retValue = new StringName(components.join(this.delimiter), this.delimiter);

        // Postconditions
        StringName.assertIsStringName(retValue);
        MethodFailedException.assert(retValue.getNoComponents() === components.length, "remove failed to remove the component correctly");
        MethodFailedException.assert(this.getNoComponents()-1 == retValue.getNoComponents(),"remove failed to remove the component correctly");
        
        return retValue;
    }

    public concat(other: Name): StringName {
        // Precondition
        StringName.assertIsStringName(this);
        StringName.assertIsStringName(other);

        // Actions
        const otherComponents = Array.from({ length: other.getNoComponents() }, (_, i) => other.getComponent(i));
        const retValue = new StringName(this.name + this.delimiter + otherComponents.join(this.delimiter), this.delimiter);
        
        // Postconditions
        StringName.assertIsStringName(retValue);
        MethodFailedException.assert(retValue.getNoComponents() >= (other as StringName).getNoComponents(), "concat failed to concatenate components correctly");
        return retValue;
    }

    public equals(other: Name): boolean {
        if (!(other instanceof StringName)) {
            return false;
        }
        return (
            this.delimiter === other.getDelimiterCharacter() &&
            this.name === other.name
        );
    }

    private static assertIsStringName(input: any, failedMessage: string = "Missing Methods of StringName") {
        InvalidStateException.assert(StringName.isStringName(input), failedMessage);
    }

    private static isStringName(input: any): input is StringName {
        return (
            super.isAbstractName(input) &&
            "name" in input && typeof input.name === "string" &&
            "noComponents" in input && typeof input.noComponents === "number" &&
            input.noComponents === input.name.split(input.getDelimiterCharacter()).length
        );
    }
}