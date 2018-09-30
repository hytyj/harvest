define(function(require, exports, module) {
  /**
   * 捕捉错误
   */
  function catchError(e) {
    /*
      EvalError: raised when an error occurs executing code in eval()
      RangeError: raised when a numeric variable or parameter is outside of its valid range
      ReferenceError: raised when de-referencing an invalid reference
      SyntaxError: raised when a syntax error occurs while parsing code in eval()
      TypeError: raised when a variable or parameter is not a valid type
      URIError: raised when encodeURI() or decodeURI() are passed invalid parameters
    */

    let str = "【页面发生错误】" + e.name + ": " + e.message;

    console.log(str);
    if (e instanceof EvalError) {
      console.log("raised when an error occurs executing code in eval()");
    } else if (e instanceof RangeError) {
      console.log(
        "raised when a numeric variable or parameter is outside of its valid range"
      );
    } else if (e instanceof ReferenceError) {
      console.log("raised when de-referencing an invalid reference");
    } else if (e instanceof SyntaxError) {
      console.log(
        "raised when a syntax error occurs while parsing code in eval()"
      );
    } else if (e instanceof TypeError) {
      console.log("raised when a variable or parameter is not a valid type");
    } else if (e instanceof URIError) {
      console.log(
        "raised when encodeURI() or decodeURI() are passed invalid parameters"
      );
    } else {
      console.log("Error");
    }

    return str;
  }

  /**
   * 获取浏览器地址
   */
  function getLocationSearch() {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
      let str = url.substr(1);
      strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }

  //计算中英文字符串长度
  function caculateString(str) {
    let result = str.replace(/[^\x00-\xff]/g, "**");
    return result.length;
  }

  //获取元素的纵坐标（相对于窗口）
  function getTop(e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
  }

  //获取元素的横坐标（相对于窗口）
  function getLeft(e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    return offset;
  }

  return {
    catchError: catchError,
    getLocationSearch: getLocationSearch,
    caculateString: caculateString,
    getTop: getTop,
    getLeft: getLeft
  };
});
