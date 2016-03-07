/* global jest:true, describe:true, expect:true, it:true */
jest.dontMock("../../app/src/components/CheckboxWithLabel");

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";

const CheckboxWithLabel = require("../../app/src/components/CheckboxWithLabel");

describe("CheckboxWithLabel", () => {

    it("changes the text after click", () => {

        // Render a checkbox with label in the document
        let checkbox = TestUtils.renderIntoDocument(
            <CheckboxWithLabel labelOn={"On"} labelOff={"Off"} />
        );

        let checkboxNode = ReactDOM.findDOMNode(checkbox);

        // Verify that it's Off by default
        expect(checkboxNode.textContent).toEqual("Off");

        // Simulate a click and verify that it is now On
        TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(checkbox, "input"));
        expect(checkboxNode.textContent).toEqual('On');
    });

});
