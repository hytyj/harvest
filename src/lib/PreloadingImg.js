/**
 * 预加载图片
 */
define(function(require, exports, module) {
  var $ = require("jquery");

  function perLoadingImg() {
    var path = "imgs/";
    $.ajax({
      type: "GET",
      url: path + "loading.txt",
      contentType: "text/HTML"
    })
      .success(function(data, textStatus, jqXHR) {
        var splitArrays = data.split("\n");
        $.each(splitArrays, function(i, v) {
          if (v) {
            var img = new Image();
            img.src = path + v;
          }
        });
      })
      .error(function() {
        console.log("没有图片");
      });
  }

  return {
    perLoadingImg: perLoadingImg
  };
});
