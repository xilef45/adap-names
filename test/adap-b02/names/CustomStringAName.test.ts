import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b02/names/Name";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

describe("CustomStringArrayName Tests", () => {
  it("constructor example1",() => {
    let n:Name = new StringArrayName(["oss", "cs", "fau", "de"],'.');
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("constructor example2",() => {
    let n:Name = new StringArrayName(["", "", "", ""],'/');
    expect(n.asString()).toBe("///");
  });

  it("constructor example3",() => {
    let n:Name = new StringArrayName(["Oh\.\.\."],'.');
    expect(n.asString()).toBe("Oh\.\.\.");
  });


  it("getComponent and setComponent", () => {
    let n: Name = new StringArrayName(["a", "b", "c"]);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(2)).toBe("c");
    n.setComponent(1, "B");
    expect(n.getComponent(1)).toBe("B");
  });

  it("getNoComponents, append and remove", () => {
    let n: Name = new StringArrayName(["x"]);
    expect(n.getNoComponents()).toBe(1);
    n.append("");
    expect(n.getNoComponents()).toBe(2);
    expect(n.asString()).toBe("x.");
    n.remove(1);
    expect(n.getNoComponents()).toBe(1);
  });

  it("insert at boundaries and middle", () => {
    let n: Name = new StringArrayName(["one", "three"]);
    n.insert(1, "two");
    expect(n.asString()).toBe("one.two.three");
    n.insert(0, "zero");
    expect(n.asString()).toBe("zero.one.two.three");
    n.insert(n.getNoComponents(), "end");
    expect(n.asString()).toBe("zero.one.two.three.end");
  });

  it("delimiter variations", () => {
    let n: Name = new StringArrayName(["a", "b"], '/');
    expect(n.asString()).toBe("a/b");
    n.insert(1, "middle");
    expect(n.asString('/')).toBe("a/middle/b");
  });

  it("index out of bounds errors", () => {
    let n: Name = new StringArrayName(["only"]);
    expect(() => n.getComponent(-1)).toThrow();
    expect(() => n.getComponent(1)).toThrow();
    expect(() => n.setComponent(1, "x")).toThrow();
    expect(() => n.remove(1)).toThrow();
    expect(() => n.insert(3, "x")).toThrow();
  });

  it("asDataString escapes default delimiter and escape chars", () => {
    let n: Name = new StringArrayName(["part\\.one", "two\\three"]);
    expect(n.asString()).toBe("part\\.one.two\\three");
    const data = n.asDataString();
    expect(data).toBe("part\\\\\\.one.two\\\\three");
  });

  it("asString with custom delimiter leaves components verbatim", () => {
    let n: Name = new StringArrayName(["a.b", "c\\d"], '#');
    expect(n.asString()).toBe("a.b#c\\d");
    expect(n.asString('#')).toBe("a.b#c\\d");
  });
});