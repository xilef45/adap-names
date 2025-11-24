import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = source.split(this.delimiter).length;
    }

    /*
    public clone(): Name {
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name.replace(this.delimiter, delimiter);
    }

    public asDataString(): string {
        let components = this.name.split(this.delimiter);
        let escapedComponents = components.map((comp) => {
            let element = comp.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            if (this.delimiter !== "") {
                element = element.split(this.delimiter).join(ESCAPE_CHARACTER + this.delimiter);
            }
            return element;
        });
        return escapedComponents.join(this.delimiter);
    }

        public isEqual(other: Name): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {
        throw new Error("needs implementation or deletion");
    }
    
    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }*/

    

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        
        if (i < 0 || i >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        return this.name.split(this.delimiter)[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);

        this.noComponents += 1;    
    }

    public append(c: string): void {
        if (this.name.length === 0) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
            this.noComponents += 1;
        }
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents -= 1;
    }

    /*public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        this.noComponents += other.getNoComponents();
    }
    */
}