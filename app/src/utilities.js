/**
 * Gets the offset in a canvas
 * @param {object} elem the canvas element
 * @returns {{left: number, top: number}}
 */
function getOffset(elem) {
    var offsetLeft = elem.offsetLeft;
    var offsetTop = elem.offsetTop;

    if(elem.offsetParent){
        let offset = getOffset(elem.offsetParent);
        offsetLeft = offset.left;
        offsetTop = offset.top;
    }
 
    return {
      left: offsetLeft,
      top: offsetTop
    };
  }



/**
 * Remove undefined keys and return a POJO;
 * @param {object} obj - the object to prune
 * @returns {object} the pruned object
 **/
function prune(obj = {}) {
    var newObj = typeof obj === "object" ? obj : {};
    return Object.keys(newObj).reduce((pojo, key) => {
        if (typeof newObj[key] !== "undefined") {
            pojo[key] = newObj[key];
        }
        return pojo;
    }, {});
}

export {getOffset, prune};

