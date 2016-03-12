export default class EditorState {
    constructor(state) {
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
}