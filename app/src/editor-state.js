/*
* Remove undefined keys and return a POJO;
*/
function _prune(obj){
    obj = (typeof obj === "object")? obj : {};
    return  Object.keys(obj).reduce((pojo,key) => {
        if (typeof this[key] !== 'undefined') {
            pojo[key] = this[key];
        }
        return pojo;
    },{});
}


export class EditorState {
    constructor(state) {
        state = state || {};
        this.image = state.image;
        this.zoom = state.zoom;
        this.rotation = state.rotation;
        this.scale = state.scale;
        this.description = state.description;
        this.fileName = state.fileName;
    }

    prune(){
     return  _prune(this);
    }

    merge(state){
        return Object.assign(this,_prune(state));
    }
    fill (state){
        Object.keys(this).forEach((key) => {
            this[key] = (typeof this[key] === "undefined") ? state[key] : this[key];
        });
        return this;
    }
    combine(state){
        this.image = state.image || this.image;
    }
    static create(state)  {
        var instance = new EditorState(state || {});
        return instance;
    }
}

