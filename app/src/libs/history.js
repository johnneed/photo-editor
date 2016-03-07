/**
 * @module
 * @name History
 * @description Exports a singleton  ofthe react-router history object
 */
import {createHistory, useBasename} from "history";

const history = useBasename(createHistory)({
    basename: "/#"
});

export default history;
