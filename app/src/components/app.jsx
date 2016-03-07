/**
 * @module
 * @name App
 * @description Entry point for demo web app
 */
import * as React from 'react';
import * as ReactDOM from "react-dom";
import history from "../libs/history";
import {Router, Route, Link} from "react-router";
import Slide00 from "./slide-00";
import Slide01 from "./slide-01";
import Slide02 from "./slide-02";


class App extends React.Component  {

    static propTypes = {
        children: React.PropTypes.object,
        history: React.PropTypes.object,
        slideCount: React.PropTypes.number
    };

    static contextTypes = {
        history: React.PropTypes.object,
        location: React.PropTypes.object
    };

    static defaultProps = {
        slideCount: 2
    };

    constructor(props) {
        super(props);
        this.displayName = "App";
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this.homeSlide = this.homeSlide.bind(this);
    }

    state = {
        slideIndex: 0
    };

    displayName:string;

    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
    }


    homeSlide() {
        const slideString = `slide00`;
        this.setState({slideIndex: 0});
        this.history.replaceState(null, slideString);
    }

    previousSlide() {
        const myNextSlide = this.state.slideIndex <= 0 ? 0 : this.state.slideIndex - 1;
        const slideString = `slide0${myNextSlide}`;
        this.setState({slideIndex: myNextSlide}, () => {
            history.pushState(null, slideString);
        });
    }

    nextSlide() {
        const myNextSlide = this.state.slideIndex >= this.props.slideCount ? this.props.slideCount : this.state.slideIndex + 1;
        const slideString = `slide0${myNextSlide}`;
        this.setState({slideIndex: myNextSlide}, () => {
            this.props.history.pushState(null, slideString);
        });
    }


    handleKeyDown(event) {
        const leftArrowKey = 37;
        const rightArrowKey = 39;
        const homeKey = 36;

        switch (event.keyCode) {
            case homeKey:
                this.homeSlide();
                break;
            case leftArrowKey:
                this.previousSlide();
                break;
            case rightArrowKey :
                this.nextSlide();
                break;
            default:
            // Do nada
        }
    }

    render() {
        return <div>
            <ul>
                <li><Link activeClassName="active" to="/slide00">{"Slide00"}</Link></li>
                <li><Link activeClassName="active" to="/slide01">{"Slide01"}</Link></li>
                <li><Link activeClassName="active" to="/slide02">{"Slide02"}</Link></li>
            </ul>
            {this.props.children}
        </div>;
    }
}

ReactDOM.render(
    <Router history={history}>
        <Route component={App}>
            <Route component={Slide01} path="slide01"/>
            <Route component={Slide02} path="slide02"/>
            <Route component={Slide00} path="/"/>
            <Route component={Slide00} path="*"/>
        </Route>
    </Router>, document.getElementById("app"));
