//@flow
/* global describe, it */
import * as assert from "power-assert";
import { Person } from "../js/test/person";

describe("Person クラステスト", () => {
    it("greetingde規定の挨拶を返す。", () => {
        //Arrange
        const expected: string = "Hello, I'm Bob.";

        //Act
        const bob: Person = new Person("Bob", 33);
        const actual: string = bob.greeting();

        //Assert
        assert.ok(actual === expected);
    });

    it("get_ageで年齢を返す。", () => {
        //Arrange
        const expected: number = 33;

        //Act
        const bob: Person = new Person("Bob", 33);
        const actual: number = bob.get_age();

        //Assert
        assert.ok(actual === expected);
    });
});