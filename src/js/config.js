require.config({
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "jquery-weui": {
      deps: ["jquery", "underscore"]
    },
    jstorage: {
      deps: ["jquery"]
    }
  },
  paths: {
    // 公共模块在此注册
    flexible: "../lib/flexible",
    jquery: "../lib/jquery-2.1.4",
    underscore: "../lib/underscore-1.8.3.min",
    backbone: "../lib/backbone-1.3.3.min",
    "jquery-weui": "../lib/jquery-weui",
    touch: "../lib/touch",
    fastclick: "../lib/fastclick",
    text: "../lib/text",
    jstorage: "../lib/jstorage",
    md5: "../lib/md5",
    PreloadingImg: "../lib/PreloadingImg"
  }
});
