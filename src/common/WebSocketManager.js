/**
 * Created by Administrator on 2017/6/30.
 */
var WebScoketManager=cc.Class.extend({
    _socket:null,
    ctor:function () {

    },
    openConnect:function(){
        var self=this;

        if(cc.sys.isObjectValid(this._socket)){
            this._socket.close();
        }

        // ------------------------------------------------------------------------------------------


        GC.SERVICE_IP="114.112.240.48";
        GC.URL="http://114.112.240.48/api/";
        GC.SOCKET_URL="ws://114.112.240.48:8282";
        GC.GET_TOKEN_URL = "http://114.112.240.48/Api/Public/getToken?client_id="+GC.CLIENT_ID;


        self._socket = null;
        self._socket= new WebSocket(GC.SOCKET_URL);
        self._socket.onopen=self.onOpen;
        self._socket.onmessage=self.onMessage;
        self._socket.onerror=self.onError;
        self._socket.onclose=self.onClose;
        // ------------------------------------------------------------------------------------------


        // th.Http.inst().get(GC.GET_IP_URL,function (isSuccess, data) {
        //     if(isSuccess){
        //
        //         cc.log("Get server IP:",data.ip);
        //
        //         GC.SERVICE_IP=data.ip;
        //         GC.URL="http://"+data.ip+"/api/";
        //         GC.SOCKET_URL="ws://"+data.ip+":8282";
        //         GC.GET_TOKEN_URL = "http://"+data.ip+"/Api/Public/getToken?client_id="+GC.CLIENT_ID;
        //
        //         self._socket = null;
        //         self._socket= new WebSocket(GC.SOCKET_URL);
        //         self._socket.onopen=self.onOpen;
        //         self._socket.onmessage=self.onMessage;
        //         self._socket.onerror=self.onError;
        //         self._socket.onclose=self.onClose;
        //
        //     }else{
        //         var breakPopupLayer=th.PopupLayer.create("获取服务器IP失败!!!","重新获取",function(){
        //             GC.SOCKET.openConnect()
        //         });
        //         GC.ACTIVE_LAVYER.addChild(breakPopupLayer,999);
        //     }
        // });


    },
    //关闭连接
    closeConnect:function () {
        cc.log("WebSocket closeing.");
        if(cc.sys.isObjectValid(this._socket)){
            this._socket.close();
        }
    },
    onOpen:function(evt){
        cc.log("WebSocket was opened.",GC.IS_RESTORE);
        //GC.IS_RESTORE=false;
    },
    onMessage:function(evt){
        //cc.log("Receive:",evt.data);
        var inJson=JSON.parse(evt.data);
        var data=inJson.data;
        var code=inJson.code;
        var msg=inJson.message;
        if(code!=10000){
            cc.log("=====>>"+new Date().format("yyyy-MM-dd hh:mm:ss")+"<<===="+code+":"+JSON.stringify(data));
        }
        switch (code){
            case 9001:
                //多点登录
                var popup=th.PopupLayer.create("你的账号在其它设备登录.","确定",(function(self){
                    return  function(){
                        GC.ACTIVE_POS="LOGIN";
                        GC.LOGIN_NAME=null;
                        GC.PASSWORD=null;
                        GC.IS_RESTORE=true;
                        GC.SOCKET.openConnect();
                    }
                })(this));
                if(GC.ACTIVE_LAVYER!=null){
                    GC.ACTIVE_LAVYER.addChild(popup,999);
                }
                break;
            case 9002:
                //取ClientId
                cc.log("ClientId:",data.client_id);
                GC.CLIENT_ID=data.client_id;
                GC.SOCKET.getToken();
                break;
            case 9003:
                //用户剩余余额
                GC.BALANCE=data.balance;
                if(GC.ACTIVE_POS=="GAME"||GC.ACTIVE_POS=="LOBBY") {
                    GC.ACTIVE_LAVYER.setBalance(data.balance);
                }
                break;
            case 9004:
                //开奖结果
                if(GC.ACTIVE_POS=="GAME") {
                    GC.ACTIVE_LAVYER.setLotteryResult(data);
                }
                break;
            case 9005:
                //更新倒计时
                GC.GAME_MAP[data.lottery_id].status=data.status;
                GC.GAME_MAP[data.lottery_id].countdown=data.countdown;
                GC.GAME_MAP[data.lottery_id].fp_countdown=data.fp_countdown;
                GC.GAME_MAP[data.lottery_id].start_countdown=data.start_countdown;
                GC.GAME_MAP[data.lottery_id].start_time=data.start_time;
                GC.GAME_MAP[data.lottery_id].end_time=data.end_time;

                /*
                var nowTime=new Date().getTime();
                //根据状态倒计时算出
                if(data.status==1){
                    //下注状态
                    GC.GAME_MAP[data.lottery_id].betBeginTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].fpBeginTime=nowTime+(data.countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].startBeginTime=nowTime+(data.countdown+data.fp_countdown)*1000;

                    GC.GAME_MAP[data.lottery_id].betEndTime=nowTime+(data.countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].fpEndTime=nowTime+(data.countdown+data.fp_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].startEndTime=nowTime+(data.countdown+data.fp_countdown+data.start_countdown)*1000;
                }else if(data.status==2){
                    //封盘状态
                    GC.GAME_MAP[data.lottery_id].fpBeginTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].startBeginTime=nowTime+(data.fp_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].betBeginTime=nowTime+(data.fp_countdown+data.start_countdown)*1000;

                    GC.GAME_MAP[data.lottery_id].fpEndTime=nowTime+(data.fp_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].startEndTime=nowTime+(data.fp_countdown+data.start_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].betEndTime=nowTime+(data.fp_countdown+data.start_countdown+data.countdown)*1000;
                }else if(data.status==3){
                    //等待开始状态
                    GC.GAME_MAP[data.lottery_id].startBeginTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].betBeginTime=nowTime+(data.start_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].fpBeginTime=nowTime+(data.start_countdown+data.countdown)*1000;

                    GC.GAME_MAP[data.lottery_id].startEndTime=nowTime+(data.start_countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].betEndTime=nowTime+(data.start_countdown+data.countdown)*1000;
                    GC.GAME_MAP[data.lottery_id].fpEndTime=nowTime+(data.start_countdown+data.countdown+data.fp_countdown)*1000;
                }else{
                    GC.GAME_MAP[data.lottery_id].betBeginTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].fpBeginTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].startBeginTime=nowTime;

                    GC.GAME_MAP[data.lottery_id].betEndTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].fpEndTime=nowTime;
                    GC.GAME_MAP[data.lottery_id].startEndTime=nowTime;
                }
                */

                //切换游戏倒计时
                var lobbyEndTime=data.status==1?data.countdown:data.status==3?(data.start_countdown+data.countdown):0;
                GC.GAME_MAP[data.lottery_id].lobbyEndTime=new Date().getTime()+lobbyEndTime*1000;

                cc.log("GC.GAME_MAP:"+JSON.stringify(GC.GAME_MAP));
                if(GC.ACTIVE_POS=="LOBBY"){
                    GC.ACTIVE_LAVYER.setCountdown(data.lottery_id,data.status,lobbyEndTime,data.start_time,data.end_time);
                }else if(GC.ACTIVE_POS=="GAME"){
                    GC.ACTIVE_LAVYER.setCountdown(data.lottery_id,data.status,data.countdown,data.start_countdown,data.fp_countdown);
                    //GC.ACTIVE_LAVYER.setCountdown(data.lottery_id);
                }
                break;
            case 9006:
                //房间庄家信息变动
                GC.BANKER_DATA=data;
                if(GC.ACTIVE_POS=="GAME") {
                    GC.ACTIVE_LAVYER.updateBankerList(data);
                }
                break;
            case 9007:
                //初始化下注数据
                GC.BET_DATA=data;
                /*if(GC.ACTIVE_LAVYER!=null&&GC.ACTIVE_POS=="GAME"){
                    GC.ACTIVE_LAVYER.updateBetZone(data);
                }*/
                break;
            case 9009:
                //推送开奖号码
                GC.GAME_MAP[data.lottery_id].issue=data.issue;
                GC.GAME_MAP[data.lottery_id].lottery_number=data.lottery_number;
                if(GC.ACTIVE_POS=="LOBBY"){
                    GC.ACTIVE_LAVYER.setLotteryResult(data.lottery_id,data.issue,data.lottery_number);
                }
                break;
            case 9010:
                //推送站内消息
                GC.MARQUEE_TEXT=data.notice;
                if(GC.ACTIVE_POS=="GAME"||GC.ACTIVE_POS=="LOBBY") {
                    GC.ACTIVE_LAVYER.setMarquee(data.notice);
                }
                break;
            case 9011:
                //推送下注变化
                if(GC.ACTIVE_POS=="GAME"){
                    GC.ACTIVE_LAVYER.updateBetZone(data);
                }
                break;
            case 9012:
                //系统维护
                if(GC.ACTIVE_POS=="GAME"||GC.ACTIVE_POS=="LOBBY") {
                    var popup=th.PopupLayer.create(data.announcement,"确定",function(){
                        cc.director.runScene(new cc.TransitionFade(0.5,new LoginScene()));
                    });
                    GC.ACTIVE_LAVYER.addChild(popup,999);
                }
                break;
            case 10000:
                //心跳包
                //cc.log("HeartBeat",data);

                GC.HEART_BEAT=new Date().getTime();
                GC.SOCKET.sendMsg("ping");
                break;
        }
    },
    onError:function(evt){
        cc.log("WebSocket Error was fired.",evt);
    },
    onClose:function(evt){
        cc.log("WebSocket instance closed.",GC.IS_RESTORE);
        if(!GC.IS_RESTORE){
            var breakPopupLayer=th.PopupLayer.create("链接服务器失败!!!","重连",function(){
                GC.SOCKET.openConnect();
            });
            GC.ACTIVE_LAVYER.addChild(breakPopupLayer,999);
        }
        GC.IS_RESTORE=false;
    },
    sendMsg:function(data){
        if(this._socket&&this._socket.readyState==1){
            this._socket.send(data);
        }
    },

    getToken:function(){
        th.Http.inst().get(GC.GET_TOKEN_URL,function (isSuccess, data) {
            if(isSuccess && data.code == "200"){
                cc.log("Token:",data.token);
                GC.IS_RESTORE=false;
                GC.TOKEN = data.token;
                GC.SOCKET.resetGame();
            }else{
                //cc.log(MessageCod[data.code]);
                var popup=th.PopupLayer.create("获取Token失败.","重新获取",function(){
                    GC.SOCKET.getToken();
                });
                GC.ACTIVE_LAVYER.addChild(popup,999);
            }
        });
    },
    resetGame:function(){
        if(GC.LOGIN_NAME&&GC.PASSWORD){
            //不是游客登录就用用户名重新登录
            var reqUrl = GC.URL + "user/login?"
                + "user_name=" + GC.LOGIN_NAME
                + "&password="+GC.PASSWORD
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;

            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200"){
                     GC.SOCKET.restoreGame();
                }else{
                    var chenggong=new th.PopupLayer(data.message,"重新登录",function(){
                        cc.director.runScene(new LoginScene());
                    });
                    GC.ACTIVE_LAVYER.addChild(chenggong);
                }
            });
        }else{
            //游客不用登陆直接还原游戏
            GC.SOCKET.restoreGame();
        }


    },
    restoreGame:function(){
        //登录成功
        if(GC.ACTIVE_POS=="LOGIN"){
            cc.log("restore to login");
            //cc.director.runScene(new LoginScene());
        }else if(GC.ACTIVE_POS=="LOBBY"){
            cc.log("restore to lobby");
            cc.director.runScene(new LobbyScene());
        }else if(GC.ACTIVE_POS=="GAME") {
            cc.log("restore to game");
            var url=GC.URL+"index/index?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
            th.Http.inst().get(url,function(success,json){
                if(success&&json.code==200){
                    //cc.log("get_lobby_info=====>>>>>>>>>>>>:"+url);
                    //cc.log("====================>>>get_lobby_info:"+JSON.stringify(json.data));
                    var data=json.data;
                    for(var i=0;i<data.lotteryList.length;i++){
                        var obj=data.lotteryList[i];

                        GC.GAME_MAP[obj.lottery_id]=obj;
                        GC.GAME_MAP[obj.lottery_id].lobbyEndTime=new Date().getTime()+obj.countdown*1000;
                    }
                    //如果在休市就返回大厅
                    if(GC.GAME_MAP[GC.GROUP_TYPE].status==4){
                        cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                    }

                    var url=GC.URL+"room/index?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&room_id="+GC.ROOM_ID;
                    th.Http.inst().get(url,function(success,json){

                        if(success&&json.code==200){
                            //cc.log("=====>>>>>>>>>>>>:"+url);
                            //cc.log("get_room_info====================>>>get_room_info:"+JSON.stringify(json.data));
                            var room=json.data;
                            //cc.director.runScene(new cc.TransitionFade(0.5,new GameScene(GC.GROUP_TYPE,GC.GAME_TYPE,GC.GAME_LIMIT,room)));
                            //cc.log("Restore To Game",GC.GROUP_TYPE,GC.GAME_TYPE,GC.GAME_LIMIT);

                            var cdi=room.countdownInfo;

                            GC.GAME_MAP[room.lottery_id].status=cdi.status;
                            GC.GAME_MAP[room.lottery_id].countdown=cdi.countdown;
                            GC.GAME_MAP[room.lottery_id].fp_countdown=cdi.fp_countdown;
                            GC.GAME_MAP[room.lottery_id].start_countdown=cdi.start_countdown;
                            GC.GAME_MAP[room.lottery_id].start_time=cdi.start_time;
                            GC.GAME_MAP[room.lottery_id].end_time=cdi.end_time;


                            cc.director.runScene(new GameScene(GC.GROUP_TYPE,GC.GAME_TYPE,GC.GAME_LIMIT,room));
                        }else{
                            cc.log("get room info error");
                            var popup=th.PopupLayer.create("进入房间失败。","返回大厅",function(){
                                //cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                                cc.director.runScene(new LobbyScene());
                            });
                            GC.ACTIVE_LAVYER.addChild(popup);
                        }
                    });

                }else{
                    cc.log("get lobby data error")
                }
            });
        }
    }
});