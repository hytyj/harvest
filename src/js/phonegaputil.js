define(function(require, exports, module) {
  var $ = require("jquery");

  /**
   * 存储
   * @param {*} key
   * @param {*} value
   * @param {*} onSuccess
   * @param {*} onFail
   */
  function setConfig(key, value, onSuccess, onFail) {
    $.jStorage.set(key, value);
    onSuccess();
  }

  function getConfig(key, onSuccess, onFail) {
    var data = $.jStorage.get(key);
    onSuccess(data);
  }

  function deleteConfig(key, onSuccess) {
    $.jStorage.deleteKey(key);
    onSuccess();
  }

  function flushConfig(onSuccess) {
    $.jStorage.flush();
    onSuccess();
  }

  function getDevicePlatform() {
    if (window.cordova) {
      return window.device.platform.toLocaleLowerCase();
    } else {
      return "web";
    }
  }

  return {
    setConfig: setConfig,
    getConfig: getConfig,
    deleteConfig: deleteConfig,
    flushConfig: flushConfig,
    getDevicePlatform: getDevicePlatform
  };
});
