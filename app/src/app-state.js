import {prune} from "./utilities";


export class AppState {
    mouseStartX;
    mouseStartY;
    mouseEndX;
    mouseEndY;
    offset;
    canvasWidth;
    canvasHeight;
    isCropping;
    isCropMode;
    scale;
    rotation;
    zoom;
    isLastHistory;
    isFirstHistory;
    hasPhoto;
    isDragging;
    spinnerIsVisible;
    isLoading;
    isBusy;
    isSaving;
    activeControlSet;
    isPhotoBig;

    constructor(state = {}) {
        this.mouseStartX = state.mouseStartX || null;
        this.mouseStartY = state.mouseStartY || null;
        this.mouseEndX = state.mouseEndX || null;
        this.mouseEndY = state.mouseEndY || null;
        this.offset = state.offset || null;
        this.canvasWidth = state.canvasWidth || null;
        this.canvasHeight = state.canvasHeight || null;
        this.scale = state.scale || 1;
        this.rotation = state.rotation || 0;
        this.zoom = state.zoom || 100;
        this.isCropping = typeof state.isCropping === "boolean" ? state.isCropping : false;
        this.isCropMode = typeof state.isCropMode === "boolean" ? state.isCropMode : false;
        this.isLastHistory = typeof state.isLastHistory === "boolean" ? state.isLastHistory : true;
        this.isFirstHistory = typeof state.isFirstHistory === "boolean" ? state.isFirstHistory : true;
        this.hasPhoto = typeof state.hasPhoto === "boolean" ? state.hasPhoto : false;
        this.isDragging = typeof state.isDragging === "boolean" ? state.isDragging : false;
        this.spinnerIsVisible = typeof state.spinnerIsVisible === "boolean" ? state.spinnerIsVisible : false;
        this.isBusy = typeof state.isBusy === "boolean" ? state.isBusy : false;
        this.isLoading = typeof state.isLoading === "boolean" ? state.isLoading : false;
        this.isSaving = typeof state.isSaving === "boolean" ? state.isSaving : false;
        this.activeControlSet = state.activeControlSet || null;
        this.isPhotoBig = !!state.isPhotoBig;
    }

    prune() {
        return prune(this);
    }

    static merge(state1, state2) {
        return new AppState(Object.assign(prune(state1), prune(state2)));
    }

    static create(state) {
        return new AppState(state || {});
    }
}

