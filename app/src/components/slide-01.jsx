import * as React from "react";

class Slide01 extends React.Component {
    static propTypes = {
        name: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.displayName = "Slide01";
    }

    render() {
        return <div className="slide-01">
                <table>
                    <thead>
                    <tr>
                        <th>{""}</th>
                        <th colSpan="5">{"Internet Explorer"}</th>
                        <th>{"Firefox"}</th>
                        <th>{"Chrome"}</th>
                        <th>{"Safari"}</th>
                        <th>{"Opera"}</th>
                    </tr>
                    <tr>
                        <th>{""}</th>
                        <th>{"IE8"}</th>
                        <th>{"IE9"}</th>
                        <th>{"IE10"}</th>
                        <th>{"IE11"}</th>
                        <th>{"Edge"}</th>
                        <th>{"FF"}</th>
                        <th>{"Cr"}</th>
                        <th>{"SF"}</th>
                        <th>{"Op"}</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th>{""}</th>
                    </tr>
                    </tfoot>
                    <tbody>
                    <tr>
                        <td>{"Angular 1.2"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>

                    </tr>
                    <tr>
                        <td>{"Angular 1.5 (beta)"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Angular 2 (beta)"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Ember 1"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Ember 2"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"React 0.14/Flux"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"React 1/Flux"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Knockout"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Aurelia"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Meteor"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Mithiril"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    <tr>
                        <td>{"Backbone/Something Else"}</td>
                        <td>{"IE8"}</td>
                        <td>{"IE9"}</td>
                        <td>{"IE10"}</td>
                        <td>{"IE11"}</td>
                        <td>{"Edge"}</td>
                        <td>{"FF"}</td>
                        <td>{"Cr"}</td>
                        <td>{"SF"}</td>
                        <td>{"Op"}</td>
                    </tr>
                    </tbody>
                </table>
            </div>;
    }
}

export default Slide01;
