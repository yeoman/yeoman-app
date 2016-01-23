const width = 300;
const height = 329;
const imgHeight = 265;
const h3Height = '64px'; // px unit needed for lineHeight

export default {
  gridItem: {
    width: width,
    height: height,
    minHeight: height,
    marginBottom: 50,
    position: 'relative',
    cursor: 'pointer'
  },
  gridItemActive: {
    width: '100%',
    height: 2000,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  img: {
    width: width,
    height: imgHeight,
    margin: 0,
    padding: 0,
    backgroundPosition: 'center',
    zIndex: 1,
    position: 'absolute',
    opacity: 1
  },
  imgActive: {
    opacity: 0
  },
  bg: {
    position: 'absolute',
    width: width,
    height: imgHeight,
    backgroundImage: 'url(img/grid-item-bg.png)'
  },
  bgActive: {
    width: '100%',
    height: '100%',
    backgroundImage: 'none'
  },
  h3: {
    fontWeight: 'normal',
    backgroundColor: '#EEE',
    textAlign: 'center',
    margin: 0,
    padding: 0,
    position: 'absolute',
    width: width,
    height: h3Height,
    top: imgHeight,
    lineHeight: h3Height,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 1
  },
  h3Active: {
    opacity: 0
  }
};

