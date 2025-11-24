import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

     constructor(source: string[], delimiter?: string) {
            super();
            this.delimiter = delimiter ?? DEFAULT_DELIMITER;
            this.components = other;
        }
    
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
       return this.components.map((comp) => {
                   let element = comp.split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
                   if (this.delimiter !== "") {
                       element = element.split(this.delimiter).join(ESCAPE_CHARACTER + this.delimiter);
                   }
                   return element;
            }).join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

     public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("index out of bounds");
        }
        return this.components[i];
    }

     public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("index out of bounds");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("index out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }
}