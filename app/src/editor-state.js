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


export default class EditorState {
    constructor(state) {
        state = state || {};
        this.image = state.image; //pixels
        this.clipStartX = state.clipStartX;  //pixels
        this.clipStartY = state.clipStartY; //pixels
        this.clipHeight = state.clipHeight; //pixels
        this.clipWidth = state.clipWidth; //pixels
        this.imageStartX = state.imageStartX; //pixels
        this.imageStartY = state.imageStartY; //pixels
        this.imageWidth = state.imageWidth; //pixels
        this.imageHeight = state.imageHeight; //pixels
        this.canvasWidth = state.canvasWidth; //pixels
        this.canvasHeight = state.canvasHeight; //pixels
        this.rotation = state.rotation; //radians
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
        this.clipStartX = (this.clipStartX || 0) + (state.clipStartX || 0);
        this.clipStartY = (this.clipStartY || 0) + (state.clipStartY || 0);
        this.clipHeight = (this.clipHeight || 0) + (state.clipHeight || 0);
        this.clipWidth = (this.clipWidth || 0) + (state.clipWidth || 0);
        this.imageStartX = (this.imageStartX || 0) + (state.imageStartX || 0);
        this.imageStartY = (this.imageStartY || 0) + (state.imageStartY|| 0);
        this.imageWidth = (this.imageWidth || 0) + (state.imageWidth || 0);
        this.imageHeight = (this.imageHeight || 0) + (state.imageHeight || 0);
        this.canvasWidth = (this.canvasWidth || 0) + (state.canvasWidth || 0);
        this.canvasHeight = (this.canvasHeight || 0) + (state.canvasHeight || 0);
        this.rotation = (this.rotation || 0) + (state.rotation || 0);
    }
}