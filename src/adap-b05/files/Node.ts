import { ServiceFailureException } from "../common/ServiceFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Exception } from "../common/Exception";
import { Name } from "../names/Name";
import { Directory } from "./Directory";


export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(typeof(bn) === "string")
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        this.isValidNode()
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to.isDirectory())
        this.isValidNode()
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        this.isValidNode()
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        this.isValidNode()
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        this.isValidNode()
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== '')
        this.isValidNode()
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        IllegalArgumentException.assert(bn !== '')
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        this.isValidNode()
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        throw new Error("Method not implemented.");
    }

    protected isDirectory() {
        return 'getChildNodes' in this && typeof (this as any).getChildNodes === 'function'
    }

    // Helper
    protected isValidNode () {
        InvalidStateException.assert(
            ( this.parentNode as Node === this ) ||
            this.baseName !== "")
        InvalidStateException.assert(this.parentNode.isDirectory())
    }
}
