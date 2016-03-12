export default class EditorState{
    constructor(state){
        this.image = state.image;
        this.clipStartX = state.clipStartX || 0;
        this.clipStartY = state.clipStartY || 0;
        this.clipHeight = state.clipHeight || (state.image && state.image.naturalHeight);
        this.clipWidth = state.clipWidth || (state.image && state.image.naturalWidth);
        this.imageStartX = state.imageStartX || 0;
        this.imageStartY = state.imageStartY || 0;
        this.imageWidth =  state.imageWidth || (state.image && state.image.naturalWidth);
        this.imageHeight = state.imageHeight|| (state.image && state.image.naturalHeight);
        this.canvasWidth = state.canvasWidth ||  (state.image && state.image.naturalWidth);
        this.canvasHeight = state.canvasHeight || (state.image && state.image.naturalHeight);
        this.rotation = state.rotation || 0; //Rotation in radians
    }
}