/**
 * Created by tanhao on 2017/1/17.
 */

var LobbyLayer = cc.Layer.extend({
    _nameLabel:null,
    _balanceLabel:null,
    _onlineLabel:null,
    _marqueeText:null,
    _gameBtnMap:null,
    _baseLayer:null,
    ctor: function () {
        this._super();
        this._gameBtnMap=null;
        var bgSprite=cc.Sprite.create(res.png_bg_lobby);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2-50));
        this.addChild(bgSprite);


        this.initMarquee();
        this.initTopInfo();
        this.initGameBtn();

        //var chatLayer=new ChatLayer();
        //this.addChild(chatLayer);

        //var detailLayer=new DetailLayer();
        //this.addChild(detailLayer);

        this._baseLayer=new BaseLayer();
        this.addChild(this._baseLayer);

        //var roomLayer=new RoomLayer();
        //this.addChild(roomLayer);

        //var headLayer=new HeadLayer();
        //this.addChild(headLayer);


        //var trackLayer =new TrackLayer(0);
        //this.addChild(trackLayer);

        //var slotLayer =new SlotLayer(0);
        //this.addChild(slotLayer);


        /*
        var shui=cc.Sprite.create(res.png_beijinghai);

        var nodeGrid = new cc.NodeGrid();
        //nodeGrid.setPosition(cc.p(GC.W/2,GC.H/2));
        nodeGrid.addChild(shui);
        this.addChild(nodeGrid);

        var shaky = cc.shaky3D(5, cc.size(50,50), 5, false);
        nodeGrid.runAction(shaky.repeatForever());
        */


        return true;
    },
    initTopInfo:function(){
        var self=this;
        var bgTopSprite=cc.Sprite.create(res.png_bg_room_top);
        bgTopSprite.setPosition(cc.p(GC.W/2,GC.H-70));
        this.addChild(bgTopSprite);

        //money
        var bgMoneySprite=cc.Sprite.create(res.png_bg_money);
        //bgMoneySprite.setPosition(cc.p(GC.W/2,GC.H/2));
        bgMoneySprite.setNormalizedPosition(0.55, 0.7);
        bgTopSprite.addChild(bgMoneySprite);

        var moneyIcon=cc.Sprite.create(res.png_icon_money);
        moneyIcon.setScale(0.9);
        moneyIcon.setNormalizedPosition(0.11, 0.48);
        bgMoneySprite.addChild(moneyIcon);

        this._balanceLabel=cc.LabelTTF.create("0", "Arial",26);
        this._balanceLabel.setNormalizedPosition(0.6, 0.5);
        this._balanceLabel.setColor(cc.color(31,128,133));
        bgMoneySprite.addChild(this._balanceLabel);


        //个人信息按钮  去掉  改成充值和提现2017.08.09
        // var myInfoBtn = new ccui.Button(res.png_btn_my,res.png_btn_my);
        // myInfoBtn.setNormalizedPosition(0.92, 0.5);
        // myInfoBtn.setTitleText("我的");
        // myInfoBtn.setTitleColor(cc.color(17,28,67));
        // myInfoBtn.setTitleFontSize(30);
        // myInfoBtn.setPressedActionEnabled(true);
        // myInfoBtn.addClickEventListener(function () {
        //     self._baseLayer._rightLayer.touchDown(400);
        // });
        // bgTopSprite.addChild(myInfoBtn);

        //提款
        var tikuanBtn = new ccui.Button(res.png_btn_tikuan,res.png_btn_tikuan);
        tikuanBtn.setNormalizedPosition(0.77, 0.5);
        tikuanBtn.setPressedActionEnabled(true);
        tikuanBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var reqUrl = GC.URL + "user/getBankList?"
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {
                    var addBankCardLayer = new AddBankCardLayer(data);
                    self.addChild(addBankCardLayer);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.addChild(chenggong);
                }
            })
        });
        bgTopSprite.addChild(tikuanBtn);

        //充值
        var chongzhiBtn = new ccui.Button(res.png_btn_chongzhi,res.png_btn_chongzhi);
        chongzhiBtn.setNormalizedPosition(0.9, 0.5);
        chongzhiBtn.setPressedActionEnabled(true);
        chongzhiBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(!!GC.LOGIN_NAME)
            {

                var reqUrl = GC.URL + "pay/getPayTypeList?"
                    + "client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var rechargeMessageLayer = new RechargeMessageLayer(data.data);
                        self.addChild(rechargeMessageLayer);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })

            }else {
                var chenggong=new th.PopupLayer("请先登录","确定",function(){
                });
                self.addChild(chenggong);
            }
        });
        bgTopSprite.addChild(chongzhiBtn);

        //名字
        this._nameLabel=cc.LabelTTF.create("-", "Arial",30);
        this._nameLabel.setAnchorPoint(cc.p(0,0.5));
        this._nameLabel.setNormalizedPosition(0.05, 0.7);
        bgTopSprite.addChild(this._nameLabel);


        //注册人数
        var text1Lable=cc.LabelTTF.create("注册人数", "Arial",30);
        text1Lable.setAnchorPoint(cc.p(0,0.5));
        text1Lable.setNormalizedPosition(0.05, 0.3);
        bgTopSprite.addChild(text1Lable);

        //var ox=text1Lable.getBoundingBox().width+text1Lable.getPositionX();
        //var oy=text1Lable.getPositionY();

        this._onlineLabel=cc.LabelTTF.create("0", "Arial",30);
        this._onlineLabel.setColor(cc.color.YELLOW);
        //this._onlineLabel.setAnchorPoint(cc.p(0,0.5));
        this._onlineLabel.setNormalizedPosition(0.28, 0.3);
        bgTopSprite.addChild(this._onlineLabel);

        var text2Lable=cc.LabelTTF.create("人", "Arial",30);
        text2Lable.setAnchorPoint(cc.p(0,0.5));
        text2Lable.setNormalizedPosition(0.35, 0.3);

        //text2Lable.setPosition(this._onlineLabel.getBoundingBox().width+this._onlineLabel.getPositionX(),this._onlineLabel.getPositionY());
        bgTopSprite.addChild(text2Lable);

    },
    initGameBtn:function(){
        var self =this;

        var   beijingcarBtn=GameButton.create(res.png_btn_beijingcar,"0000","0000000000",123,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            if(GC.LOBBY_BUTTON_TOUCH){
                if(GC.GAME_MAP["1"].status!=4){
                    var roomLayer=new RoomLayer(1,"index/roomList",function(){
                        GC.GROUP_TYPE=null;
                    });
                    self.addChild(roomLayer);
                }else{
                    var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){

                    });
                    self.addChild(popup);
                }
            }
        });
        beijingcarBtn.setNormalizedPosition(0.5, 0.72);
        this.addChild(beijingcarBtn);


        var   chongxingcaiBtn=GameButton.create(res.png_btn_chongxingcai,"0000","0000000000",123,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            if(GC.LOBBY_BUTTON_TOUCH) {
                if(GC.GAME_MAP["2"].status!=4) {
                    var roomLayer = new RoomLayer(2,"index/roomList",function(){
                        GC.GROUP_TYPE=null;
                    });
                    self.addChild(roomLayer);
                }else{
                    var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){

                    });
                    self.addChild(popup);
                }
            }

        });
        chongxingcaiBtn.setNormalizedPosition(0.5, 0.45);
        this.addChild(chongxingcaiBtn);


        var   luckboatBtn=GameButton.create(res.png_btn_luckboat,"0000","0000000000",123,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            if(GC.LOBBY_BUTTON_TOUCH) {
                if(GC.GAME_MAP["3"].status!=4) {
                    var roomLayer = new RoomLayer(3,"index/roomList",function(){
                        GC.GROUP_TYPE=null;
                    });
                    self.addChild(roomLayer);
                }else{
                    var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){

                    });
                    self.addChild(popup,999);
                }
            }
        });
        luckboatBtn.setNormalizedPosition(0.5, 0.18);
        this.addChild(luckboatBtn);

        this._gameBtnMap={
            "1":beijingcarBtn,
            "2":chongxingcaiBtn,
            "3":luckboatBtn
        }
    },
    initMarquee:function(){
        var marqueeBgSprite=cc.Sprite.create(res.png_bg_marquee);
        marqueeBgSprite.setNormalizedPosition(0.5, 0.88);
        this.addChild(marqueeBgSprite);

        this._marqueeText = cc.LabelTTF.create(GC.MARQUEE_TEXT, "Arial",30);
        this._marqueeText.setPositionX(marqueeBgSprite.width/2+this._marqueeText.width/2);

        var stencil =cc.Sprite.create(res.png_bg_marquee);
        stencil.setColor(cc.color(0,0,0));
        var clip=new cc.ClippingNode(stencil);
        clip.setNormalizedPosition(0.5, 0.6);
        clip.setInverted(false);
        clip.setAlphaThreshold(0);
        clip.addChild(this._marqueeText);
        marqueeBgSprite.addChild(clip);

        this.marqueeRun();

    },
    marqueeRun:function(){
        this._marqueeText.setPositionX(GC.W/2+this._marqueeText.width/2);
        this._marqueeText.runAction(cc.sequence(cc.moveTo(10, cc.p(-GC.W/2-this._marqueeText.width/2, 0)),cc.callFunc(function (event) {
            this.marqueeRun();
        }, this)));
    },
    setNickname:function(name){
        this._nameLabel.setString(name);
    },
    setMarquee:function(text){
        this._marqueeText.setString(text);
    },
    setCountdown:function(lotteryId,status,countdown,startTime,endTime){
        var game=this._gameBtnMap[lotteryId];
        game.setCountdown(countdown);
        game.setStatus(status);
        game.setStartTime(startTime,endTime);
    },
    setBalance:function(balance){
        this._balanceLabel.setString(balance+"");
        this._baseLayer.setBalance(balance+"");
    },
    onEnter:function(){
        this._super();
        this.getLobbyData();
    },
    getLobbyData:function(){
        var self=this;
        //获取大厅信息
        var url=GC.URL+"index/index?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
        th.Http.inst().get(url,function(success,json){
            if(success&&json.code==200){
                var data=json.data;
                cc.log("=================>>lobby:"+JSON.stringify(data));
                self._nameLabel.setString(data.nickname);
                self._onlineLabel.setString(data.register_count);
                self._balanceLabel.setString(formatCurrency(data.balance));

                for(var i=0;i<data.lotteryList.length;i++){
                    var obj=data.lotteryList[i];
                    var game=self._gameBtnMap[obj.lottery_id];
                    game.setGameNo(obj.issue);
                    game.setResult(obj.lottery_number);
                    game.setCountdown(obj.countdown);
                    game.setStatus(obj.status);
                    game.setStartTime(obj.start_time,obj.end_time);

                    GC.GAME_MAP[obj.lottery_id]=obj;
                    GC.GAME_MAP[obj.lottery_id].lobbyEndTime=new Date().getTime()+obj.countdown*1000;
                }

                if(GC.GROUP_TYPE!=null){
                    var roomLayer=new RoomLayer(GC.GROUP_TYPE,"index/roomList",function(){
                        GC.GROUP_TYPE=null;
                    });
                    self.addChild(roomLayer);
                }
                if(GC.IS_RECHARGE)
                {
                    var recharge = new RechargeLayer(GC.RECHARGE,GC.RECHARGE_DATA._RECHARGENum);
                    self.addChild(recharge);
                }
            }else{
                cc.log("get lobby data error")
            }
        });

        //取用户信息

        var url=GC.URL+"room/getUserInfo?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&date="+new Date().format("yyyy-MM-dd");
        th.Http.inst().get(url,function(success,json){
            if(success&&json.code==200){
                var data=json.data;
                cc.log("User:"+JSON.stringify(data));
                if(data.nickname == "")
                {
                    var changeName = new ChangeNameLayer(false,function(name){
                        self._nameLabel.setString(name);
                    });
                    self.addChild(changeName);
                }
                self._baseLayer.setDetail(data.user_name,data.nickname,formatCurrency(data.balance),data.change_balance);
            }else{
                cc.log("get user info error")
            }
        })
    },
    setLotteryResult:function(lotteryId,gameNo,result){
        var game=this._gameBtnMap[lotteryId];
        game.setGameNo(gameNo);
        game.setResult(result)
    }
});

LobbyLayer.create=function(){
    return new LobbyLayer();
};