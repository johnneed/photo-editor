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
        var pruned
    }
}