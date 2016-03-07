/* global jest:true, require:true, describe:true, it:true, expect:true */
jest.dontMock("../../app/src/libs/sum");

const sum = require("../../app/src/libs/sum").default;
//import sum from "../../app/src/libs/sum";

describe("sum", () => {
    it("adds correctly", () => {
        // Verify that it's Off by default
        expect(sum(1, 2)).toEqual(3);
    });
});
