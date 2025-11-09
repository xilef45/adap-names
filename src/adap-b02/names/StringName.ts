import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.name = source;
        this.noComponents = source.split(this.delimiter).length;
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

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        return this.name.split(this.delimiter)[x];
    }

    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components.splice(n, 0, c);
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

    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("index out of bounds");
        }
        let components = this.name.split(this.delimiter);
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents -= 1;
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        this.noComponents += other.getNoComponents();
    }

}