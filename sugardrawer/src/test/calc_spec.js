/* global describe, it*/
"use strict";

import * as assert from "power-assert";
import { add, substract } from "../js/test/calc";

describe("add関数テスト", () => {
    it("1 + 2は3である", () => {
        assert.ok(add(1, 2) === 3);
    });

    //下はエラーが起きる
    /*
    it("1 + 2は4である", () => {
        assert.ok(add(1, 2) === 4);
    });
    */
});

describe("substract関数テスト", () => {
    it("3 - 1は2である", () => {
        assert.ok(substract(3, 1) === 2);
    });

    //下はエラーが起きる

    // it("4 - 3は2である", () => {
    //     assert.ok(substract(4, 3) === 2);
    // });

});
