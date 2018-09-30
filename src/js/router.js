define(function(require, exports, module) {
  let $ = require("jquery");
  let _ = require("underscore");
  let Backbone = require("backbone");

  window.requestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame;

  //测试
  let demoView = require("view/demo");

  let AppRouter = Backbone.Router.extend({
    routes: {
      demo: "demoView"
    },
    //跳转
    initialize() {
      console.log("AppRouter initialize");
      this.currentPage = null;
    },
    changePage(page) {
      //销毁事件
      if (this.currentPage) {
        this.currentPage.undelegateEvents();
        if (this.currentPage.destroy) {
          this.currentPage.destroy();
        }
      }

      page.render();

      if (page.afterRender) {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            page.afterRender();
          });
        } else {
          setTimeout(() => {
            page.afterRender();
          }, 30);
        }
      }

      this.currentPage = page;
    },
    resize() {
      if (this.currentPage && this.currentPage.resize) {
        this.currentPage.resize();
      }
    },
    resume() {
      if (this.currentPage && this.currentPage.resume) {
        this.currentPage.resume();
      }
    },
    pause() {
      if (this.currentPage && this.currentPage.pause) {
        this.currentPage.pause();
      }
    },
    backButton() {
      let $dialog = $(".weui-dialog");

      /**
       * 存在weui对话框
       */
      if ($dialog.length > 0) {
        return;
      }

      if (
        this.currentPage &&
        this.currentPage.backbutton &&
        this.currentPage.canBack !== false
      ) {
        this.currentPage.backbutton();
      }
    },
    menuButton() {},
    demoView() {
      let view = new demoView();
      this.changePage(view);
    }
  });

  return AppRouter;
});
