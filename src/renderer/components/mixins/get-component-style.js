export default {
  getComponentStyle(isActive) {
    return (defaultStyle, activeStyle) => {
      return isActive ?
        Object.assign({}, defaultStyle, activeStyle) :
        defaultStyle;
    };
  }
};

