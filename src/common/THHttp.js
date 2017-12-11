var th = th || {};

th.Http =  cc.Class.extend({
    m_inst : null, //实例
    url : "http://127.0.0.1:8080/request",

    ctor : function(){
    },

      /*
     * 网络请求之GET
     * url 请求的网络地址
     * callback 回调参数
     * */
    get : function(url,callback){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET",url,true);
        xhr["onloadend"] = function () {
            var success=false;
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                success = true;
            }
            var json = JSON.parse(xhr.responseText);
            callback(success,json);
        };
        xhr.send();
    },
 
    /*
     * 网络请求之POST
     * url 请求的网络地址
     * params  请求参数  ("id=1&id=2&id=3")
     * callback 回调参数
    ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout']
    * */
    post : function(url, params, callback){

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        xhr["onloadend"] = function(){

            var success=false;
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                success=true;
            }
            var json = JSON.parse(xhr.responseText);
            callback(success,json);

        }
       xhr.send(params);
    }
});

//获取实例
th.Http.inst = function() {
    if (th.Http.m_inst == null) {
        th.Http.m_inst = new th.Http();
    }
    return th.Http.m_inst;
};
