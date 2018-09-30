define(function(require, exports, module) {
  // 统一在最前面定义依赖
  let $ = require("jquery");
  let _ = require("underscore");
  let Backbone = require("backbone");

  require("touch");
  require("jquery-weui");

  // 加载模版通过text插件的方式将文本作为模块
  let template = require("text!view/tpl/demo.html");

  let View = Backbone.View.extend({
    el: "body",
    template: template,
    events: {

    },
    data: {
      default: {
        isDemo: true
      }
    },
    initialize() {
      console.log("===========initialize==============");
      this.$el.empty().append(this.template);
    },
    render() {
      return this;
    },
    afterRender() {
      //页面渲染完成后
    },
    destroy() {
      //页面销毁
    },
    backbutton() {
      //页面回退
    }
  });

  return View;
});
