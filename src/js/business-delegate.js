define(function(require, exports, module) {
  let $ = require("jquery");
  let constant = require("constant");
  require("md5");

  let processAjaxMap = {}; //接口执行中队列
  let requestUrl = constant.getRemoteRoot();
  let defaultOutTime = constant.getOutTime();
  let defaultCacheTime = constant.getCacheTime();

  /**
   *
   * @param {*} param
   *
   */
  function requestApi(param) {
    let api = $.extend({}, param.api);
    let apiId = api.api; //api唯一标识
    let ttl = api.ttl || defaultCacheTime; //api缓存时间

    let mockData = api.local || []; //mock数据地址，类型为数组，可填写多个地址
    let mockIndex = param.mockIndex || 0; //当前接口mockIndex
    let isDefined = param.isDefined || false; //是否自定义返回参数处理

    let body = param.body || {}; //提交参数
    let apiMode = param.apiMode || "remote"; //remote远程地址 local模拟数据
    let outTime = param.outTime || defaultOutTime; //超时时间
    let callback = param.callback || $.noop; //成功回调
    let errCallback = param.errCallback || $.noop;

    //启用缓存，基础缓存1s
    let _id = CryptoJS.MD5(JSON.stringify(body) + apiId).toString(); // 计算查询条件MD5 ID标示

    //大于或等于默认缓存时间时获取缓存数据
    if (ttl >= defaultCacheTime) {
      let cacheData = $.jStorage.get(_id);
      if (cacheData) {
        console.log("读取本地数据", cacheData);
        if (cacheData.code === 0) {
          callback(cacheData);
        } else {
          errCallback(cacheData);
        }
        return _id;
      }
    }

    /**
     * 模拟数据获取
     */
    if (apiMode === "local") {
      //模拟数据
      console.log("返回mock数据");
      let time = 1000; //延迟时间
      setTimeout(function() {
        $.getJSON(mockData[mockIndex], function(data, textStatus, jqXHR) {
          if (textStatus == "success") {
            console.log("读取模拟数据", data);

            if (data.code === 0) {
              callback(data);
            } else {
              errCallback(data);
            }
          } else {
            let errMsg = {};
            errMsg.code = 10000;
            errMsg.desc = "模拟数据失败";
            errCallback(errMsg);
          }
        }).error(function() {
          let errMsg = {};
          errMsg.code = 10000;
          errMsg.desc = "模拟数据失败";
          errCallback(errMsg);
        });
      }, time);
      return;
    }

    /**
     * 远程地址调用接口
     */
    let url = requestUrl + api[apiMode];
    let encryptBody = encryptSendData(body);

    console.log("访问接口地址：", url);
    console.log("提交的参数：", body);

    /**
     * 加入队列
     * 同一时间只允许存在一个接口
     */
    if (processAjaxMap[apiId]) {
      console.log("正在取消ajax api=" + apiId);
      processAjaxMap[apiId].abort();
      processAjaxMap[apiId] = null;
    }

    processAjaxMap[apiId] = $.ajax({
      type: "post",
      url: url,
      data: encryptBody,
      cache: false,
      Accept: "application/json; charset=utf-8",
      timeout: outTime
    })
      .success(function(data, textStatus, jqXHR) {
        if (textStatus == "success") {
          /**
           * 请求成功
           */
          if (typeof data == "string") {
            data = JSON.parse(data);
          }

          console.log("接口【" + apiId + "】调用成功:", data);

          //自定义接口返回处理
          if (isDefined) {
            callback(data);
            return;
          }

          /**
           * 统一接口返回处理
           *
           * code为0则调用成功
           * code不为0则调用失败
           */
          if (data.code === 0) {
            callback(data);

            /**
             * 接口调用成功缓存信息
             */
            if (ttl == Infinity) {
              // 永久缓存
              $.jStorage.set(_id, data);
            }

            //当设置值大于或等于默认缓存时间时，缓存信息
            if (ttl >= defaultCacheTime) {
              $.jStorage.set(_id, data, {
                TTL: ttl
              });
            }
          } else {
            errCallback(data);
          }
        } else {
          /**
           * 请求失败
           */
          errCallback(data);
        }

        //请求完成，清空当前api接口队列值
        if (processAjaxMap[apiId]) {
          processAjaxMap[apiId] = null;
        }
      })
      .error(function(jqXHR, textStatus, errorThrown) {
        console.log("error:", textStatus);
        /**
         * 超时或无网络状况
         * 调用统一错误回调方法
         */
        if (textStatus === "timeout" || textStatus === "error") {
          let errMsg = {};
          errMsg.code = 10001;
          errMsg.desc = "连接超时";
          errCallback(errMsg);
        }

        //请求失败，清空当前api接口队列值
        if (processAjaxMap[apiId]) {
          processAjaxMap[apiId] = null;
        }
      });

    return _id;
  }

  //取消执行接口
  function abortApi(api) {
    console.log("abort:" + api);
    if (processAjaxMap[api]) {
      processAjaxMap[api].abort();
      processAjaxMap[api] = null;
    }
  }

  //清除全部缓存
  function flushCache() {
    $.jStorage.flush();
  }

  //刷新指定api缓存
  function flushCacheById(_id) {
    $.jStorage.set(_id, null, {
      TTL: 0
    });
  }

  function encryptSendData(data) {
    /**
     * 在此加入加密方法
     */

    return data;
  }

  return {
    getApi: constant.getApi,
    flushCache: flushCache,
    flushCacheById: flushCacheById,
    requestApi: requestApi,
    abortApi: abortApi
  };
});
