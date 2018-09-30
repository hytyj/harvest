define(function(require, exports, module) {
  //获取远程地址
  function getRemoteRoot() {
    var remoteRoot = "";
    //服务器地址
    return remoteRoot;
  }

  //是否是开发环境
  function isDeveloper() {
    if (location.hostname == "localhost") {
      return true;
    }
    return false;
  }

  function getOutTime() {
    var outTime = 20000;
    return outTime;
  }

  function getCacheTime() {
    var cacheTime = 1000;
    return cacheTime;
  }

  var apiMap = {
    demo: {
      api: "demo",
      remote: "/demo.do",
      local: ["data/demo.json"]
    }
  };

  function getApi(prop) {
    return apiMap[prop];
  }

  return {
    getRemoteRoot: getRemoteRoot,
    isDeveloper: isDeveloper,
    getOutTime: getOutTime,
    getCacheTime: getCacheTime,
    getApi: getApi
  };
});
