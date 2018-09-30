require([
  "jquery",
  "underscore",
  "backbone",
  "fastclick",
  "router",
  "phonegaputil",
  "PreloadingImg",
  "flexible",
  "jquery-weui"
], function($, _, Backbone, FastClick, AppRouter, Phonegaputil, PreloadingImg) {
  var appRouter = new AppRouter();
  Backbone.history.start();

  /**
   * cordova 启动完毕
   */
  function deviceReady() {
    console.log("deviceReady");

    //预加载所有图片
    PreloadingImg.perLoadingImg();
    //启用fastclick
    FastClick.attach(document.body);

    //启用ios active
    document.body.addEventListener("touchstart", () => {}, { passive: false });

    // 禁止选择
    // document.oncontextmenu = () => {
    //   return false;
    // };

    //获取原始高度
    // window.orginWindowHeight = $(window).height();

    //注册安卓事件
    $(window).on("resize", onResize);
    $(document).on("pause", onPause);
    $(document).on("resume", onResume);
    $(document).on("backbutton", onBackKeyDown);
    $(document).on("menubutton", onMenuKeyDown);

    //进入首页
    if (window.cordova) {
      // 进入第一个登录页面
      Backbone.history.navigate("demo", {
        trigger: true
      });
    } else {
      Backbone.history.navigate("demo", {
        trigger: true
      });
    }
  }

  /**
   * 注册事件
   */
  function onResize() {
    setTimeout(function() {
      appRouter.resize();
    }, 0);
  }

  function onPause() {
    setTimeout(function() {
      appRouter.pause();
    }, 0);
  }

  function onResume() {
    setTimeout(function() {
      appRouter.resume();
    }, 0);
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    appRouter.backButton();
    e.stopPropagation();
  }

  function onMenuKeyDown(e) {
    e.preventDefault();
    appRouter.menuButton();
    e.stopPropagation();
  }

  if (/(Android|android|iPhone|iPod|iPad)/.test(navigator.userAgent)) {
    console.log("android or ios");
    if (window.cordova) {
      document.addEventListener("deviceready", deviceReady, false);
    } else {
      $(function() {
        deviceReady();

        //模拟安卓手机回退事件
        document.addEventListener("keydown", event => {
          if (event.keyCode === 27) {
            appRouter.backButton();
          }
        });
      });
    }
  } else {
    $(function() {
      deviceReady();

      //模拟安卓手机回退事件
      document.addEventListener("keydown", event => {
        if (event.keyCode === 27) {
          appRouter.backButton();
        }
      });
    });
  }
});
