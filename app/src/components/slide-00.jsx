
import * as React from 'react';
import {Link} from "react-router";



class Slide00 extends React.Component{
    static propTypes = {
        name: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.displayName = "Slide00";

    }

    render() {
        return <div className="slide-00">
                <h1>{"Web Architecture"}</h1>
                <Link to={`/slide01`}>{`slide1`}</Link>
                <Link to={`/slide02`}>{`slide2`}</Link>
            </div>;
    }
}

export default Slide00;
