import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return this;
    }

    public asString(delimiter: string = this.delimiter): string {
        let returnStringArray: string[]= [];
        for(let i=0;i < this.getNoComponents();i++){
            let component = this.getComponent(i);
            returnStringArray.push(component);
        }
        return returnStringArray.join(delimiter);
    }

    public toString(): string {
        return this.asDataString(); 
    }

    public asDataString(): string {

        let returnStringArray: string[]= [];
        for(let i=0;i < this.getNoComponents();i++){
            let component = this.getComponent(i)
            .split(ESCAPE_CHARACTER).join(ESCAPE_CHARACTER + ESCAPE_CHARACTER);
            if (this.delimiter !== "") {
                       component = component.split(this.delimiter).join(ESCAPE_CHARACTER + this.delimiter);
            }
            returnStringArray.push(component);
        }
        return returnStringArray.join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = Math.imul(31, hash) + char | 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for(let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i))
        }
    }

}