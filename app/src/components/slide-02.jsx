/**
 * @module
 * @name slide-02
 */
import * as React from "react";

class Slide02 extends React.Component {
    static propTypes = {
        name: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.displayName = "";
    }

    render() {
        return <div className="slide-02">
            <h1>{"Slide Two"}</h1>
        </div>;
    }
}

export default Slide02;
