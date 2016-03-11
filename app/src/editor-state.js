export default class EditorState{
    constructor(state){
        this.image = state.image;
        this.clipStartX = state.clipStartX || 0;
        this.clipStartY = state.clipStartY || 0;
        this.clipHeight = state.clipHeight;
        this.clipWidth = state.clipWidth;
        this.imageStartX = state.imageStartX;
        this.imageStartY = state.imageStartY;
        this.imageWidth =  state.imageWidth;
        this.imageHeight = state.imageHeight;
        this.canvasWidth = state.canvasWidth || state.clipWidth;
        this.canvasHeight = state.canvasHeight || state.clipHeight;
        this.rotation = state.rotation || 0; //Rotation in radians
    }
}