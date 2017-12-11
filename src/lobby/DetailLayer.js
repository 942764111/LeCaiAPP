/**
 * Created by tanhao on 2017/1/17.
 */

var DetailLayer = cc.Layer.extend({
    _accountIdLabel:null,
    _nicknameLabel:null,
    _balanceLabel:null,
    _ingotLabel:null,
    _posX:null,
    _endPosX:null,
    _offsetX:null,
    _listener:null,
    _beginPoint:null,
    _betListData:null,
    ctor: function () {
        this._super();

        this._betListData=[];
        this.initMyDetail();
        this.initBetDetail();
        this.initWinlose();


        this._listener= cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        this._listener.retain();
        //cc.eventManager.addListener(this._listener, this);

        return true;
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {

    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(300, 310);
    },
    numberOfCellsInTableView:function (table) {
        return this._betListData.length;
    },
    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var bianhao;
        var nameLabel;
        var resultLabel;
        var zoneLabel;
        var winOrlose;
        var data=this._betListData[this._betListData.length-1-idx];
        if (!cell) {
            cell = new cc.TableViewCell();

            var bg = new cc.Sprite(res.png_img_bettingSJ);
            bg.setPosition(cc.p(337,150));
            cell.addChild(bg);

            bianhao = new cc.LabelTTF(data.add_time + "参与","Arial", 26);
            bianhao.setTag(1);
            bianhao.setAnchorPoint(cc.p(0,0.5));
            bianhao.setPosition(cc.p(20,280));
            //bianhao.setColor(cc.color(236,64,28,0));
            cell.addChild(bianhao);

            nameLabel = new cc.LabelTTF(data.title,"Arial", 26);
            nameLabel.setTag(2);
            nameLabel.setAnchorPoint(cc.p(0,0.5));
            nameLabel.setPosition(cc.p(20,250));
            //nameLabel.setColor(cc.color(236,64,28,0));
            cell.addChild(nameLabel);

            resultLabel = new cc.LabelTTF("开奖结果："+data.lottery_number,"Arial", 26);
            resultLabel.setTag(3);
            resultLabel.setAnchorPoint(cc.p(0,0.5));
            resultLabel.setPosition(cc.p(20,220));
            //resultLabel.setColor(cc.color(236,64,28,0));
            cell.addChild(resultLabel);


            //cc.log(JSON.stringify(data.bet_detail));
            for(var i=0;i<data.bet_detail.length;i++){
                var bet=data.bet_detail[i];
                zoneLabel=new cc.LabelTTF("投注了[第"+bet.zone+"位]"+(bet.balance)+"  "+(bet.win_balance>=0?"赢":"输")+"了"+bet.win_balance+"元宝","Arial", 26);
                zoneLabel.setTag(4+i);
                zoneLabel.setAnchorPoint(cc.p(0,0.5));
                zoneLabel.setPosition(cc.p(20,190-i*35));
                //zoneLabel.setColor(cc.color(236,64,28,0));
                cell.addChild(zoneLabel);
            }

            winOrlose = new cc.LabelTTF("本局收益："+data.profit_balance,"Arial", 26);
            winOrlose.setTag(9);
            winOrlose.setAnchorPoint(cc.p(1,0.5));
            winOrlose.setPosition(cc.p(580,15));
            winOrlose.setColor(cc.color(255,171,13));
            //winOrlose.setColor(cc.color(236,64,28,0));
            cell.addChild(winOrlose);

        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setString(data.add_time + "参与");

            nameLabel = cell.getChildByTag(2);
            nameLabel.setString(data.title);

            resultLabel = cell.getChildByTag(3);
            resultLabel.setString("开奖结果："+data.lottery_number);

            //cc.log(JSON.stringify(data.bet_detail));
            for(var i=0;i<data.bet_detail.length;i++){
                var bet=data.bet_detail[i];
                zoneLabel = cell.getChildByTag(4+i);
                if(!zoneLabel){
                    zoneLabel=new cc.LabelTTF("","Arial", 20);
                    zoneLabel.setTag(4+i);
                    zoneLabel.setAnchorPoint(cc.p(0,0.5));
                    zoneLabel.setPosition(cc.p(20+parseInt(i%2)*300,60-parseInt(i/2)*25));
                    zoneLabel.setColor(cc.color(236,64,28,0));
                }
                zoneLabel=new cc.LabelTTF("投注了[第"+bet.zone+"位]"+(bet.balance)+"  "+(bet.win_balance>=0?"赢":"输")+"了"+bet.win_balance+"元宝","Arial", 26);
            }

            winOrlose = cell.getChildByTag(9);
            winOrlose.setString("本局收益："+data.profit_balance);
        }
        return cell;
    },
    initBetList:function(bgSprite){
        this._betListTableView = new cc.TableView(this, cc.size(600, 650));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(55,380));
        bgSprite.addChild(this._betListTableView);
        //this._betListTableView.reloadData();
    },
    initWinlose:function(){
        var self=this;
        var winloseSprite=cc.Sprite.create(res.png_bg_wode);
        winloseSprite.setPosition(cc.p(GC.W /2+133, GC.H / 4-80));
        this.addChild(winloseSprite);

        var winloseText = cc.LabelTTF.create("当日盈亏：", "Arial", 30);
        winloseText.setAnchorPoint(cc.p(0,0.5));
        winloseText.setNormalizedPosition(0.05, 0.5);
        winloseSprite.addChild(winloseText);


        this._ingotLabel = cc.LabelTTF.create("0元宝", "Arial", 30);
        this._ingotLabel.setColor(cc.color(255,171,13));
        this._ingotLabel.setAnchorPoint(cc.p(0,0.5));
        this._ingotLabel.setNormalizedPosition(0.28, 0.5);
        winloseSprite.addChild(this._ingotLabel);

        var contactBtn = new ccui.Button(res.png_bg_detail_logout);
        contactBtn.setTitleText("联系客服  >>                               ");
        contactBtn.setTitleFontSize(30);
        contactBtn.setZoomScale(-0.01);
        contactBtn.setTitleColor(cc.color(42,190,174));
        contactBtn.setNormalizedPosition(0.62, 0.11);
        contactBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var reqUrl = GC.URL + "user/getCSContact?"
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            th.Http.inst().get(encodeURI(reqUrl),function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {
                    var popup=th.PopupLayer.create(data.data.text,"确定",function(){

                    });
                    self.addChild(popup);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.addChild(chenggong);
                }
            })
        });
        this.addChild(contactBtn);


        var lineSprite=cc.Sprite.create(res.png_btn_enter_wode);
        lineSprite.setNormalizedPosition(0.60, 0.073);
        this.addChild(lineSprite);


        var logoutBtn = new ccui.Button(res.png_bg_detail_logout);
        logoutBtn.setTitleText("退出登录  >>                               ");
        logoutBtn.setTitleFontSize(30);
        logoutBtn.setZoomScale(-0.01);
        logoutBtn.setTitleColor(cc.color(42,190,174));
        logoutBtn.setNormalizedPosition(0.62, 0.04);
        logoutBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var popup=th.ConfirmLayer.create("你确定要返回登录?","确定",function(){
                var url=GC.URL+"user/logout?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
                th.Http.inst().get(url,function(success,json){
                    if(success&&json.code==200){
                        cc.log("logout:",json);
                        GC.LOGIN_NAME=null;
                        GC.PASSWORD=null;
                        cc.sys.localStorage.removeItem("LOGIN_NAME");
                        cc.sys.localStorage.removeItem("PASSWORD");
                        cc.director.runScene(new LoginScene());
                    }else{
                        cc.log("get user info error")
                    }
                })
            });
            self.addChild(popup);
        });
        this.addChild(logoutBtn);
    },
    initBetDetail:function(){
        var bgBetDetailSprite=cc.Sprite.create(res.png_bg_wode);
        bgBetDetailSprite.setPosition(cc.p(GC.W / 2 + 133, GC.H *2/ 3+140));
        this.addChild(bgBetDetailSprite);

        var betDetailsText = cc.LabelTTF.create("投注明细（每日更新）", "Arial", 30);
        betDetailsText.setAnchorPoint(cc.p(0,0.5));
        betDetailsText.setNormalizedPosition(0.05, 0.5);
        bgBetDetailSprite.addChild(betDetailsText);

        //更多
        var moreDetailBtn = new ccui.Button();
        moreDetailBtn.setTitleText("更多>>");
        moreDetailBtn.setTitleFontSize(30);
        moreDetailBtn.setTitleColor(cc.color(42,190,174));
        moreDetailBtn.setNormalizedPosition(0.7, 0.5);
        moreDetailBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var self = this;
            var dataTimer = new Date().format("yyyy-MM-dd");
            var reqUrl = GC.URL + "room/getUserInfo?"
                + "date=" + dataTimer
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {

                    var bettingDetailLayer = new BettingDetailLayer(data);
                    self.getParent().getParent().addChild(bettingDetailLayer);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.addChild(chenggong);
                }
            })
        });
        bgBetDetailSprite.addChild(moreDetailBtn);
    },
    initMyDetail:function(){
        var self = this;
        var bgSprite = cc.Sprite.create(res.png_bg_chat);
        bgSprite.setPosition(cc.p(GC.W / 2 + 80, GC.H / 2));
        this.addChild(bgSprite);


        var accountIdText = cc.LabelTTF.create("账号：", "Arial", 30);
        accountIdText.setNormalizedPosition(0.2, 0.92);
        bgSprite.addChild(accountIdText);

        var nicknameText = cc.LabelTTF.create("呢称：", "Arial", 30);
        nicknameText.setNormalizedPosition(0.2, 0.87);
        bgSprite.addChild(nicknameText);

        var editNicknameBtn = new ccui.Button(res.png_btn_my,res.png_btn_my);
        editNicknameBtn.setNormalizedPosition(0.8, 0.87);
        editNicknameBtn.setTitleText("修改");
        editNicknameBtn.setTitleColor(cc.color(17,28,67));
        editNicknameBtn.setTitleFontSize(30);
        editNicknameBtn.setPressedActionEnabled(true);
        editNicknameBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var changeName = new ChangeNameLayer(true,function(name){
                self._nicknameLabel.setString(name);
                if(GC.ACTIVE_POS=="GAME"||GC.ACTIVE_POS=="LOBBY") {
                    GC.ACTIVE_LAVYER.setNickname(name);
                }
            });
            self.addChild(changeName);
        });
        bgSprite.addChild(editNicknameBtn);
        editNicknameBtn.setVisible(!GC.LOGIN_NAME);
        editNicknameBtn.setVisible(false);


        var balanceText = cc.LabelTTF.create("金额：", "Arial", 30);
        balanceText.setNormalizedPosition(0.2, 0.82);
        bgSprite.addChild(balanceText);

        //账号ID
        this._accountIdLabel = cc.LabelTTF.create("0", "Arial", 30);
        this._accountIdLabel.setColor(cc.color(255,171,13));
        this._accountIdLabel.setAnchorPoint(cc.p(0, 0.5));
        this._accountIdLabel.setNormalizedPosition(0.25, 0.92);
        bgSprite.addChild(this._accountIdLabel);
        //呢称
        this._nicknameLabel = cc.LabelTTF.create("-", "Arial", 30);
        this._nicknameLabel.setColor(cc.color(255,171,13));
        this._nicknameLabel.setAnchorPoint(cc.p(0, 0.5));
        this._nicknameLabel.setNormalizedPosition(0.25, 0.87);
        bgSprite.addChild(this._nicknameLabel);

        //金额
        this._balanceLabel = cc.LabelTTF.create("0", "Arial", 30);
        this._balanceLabel.setColor(cc.color(255,171,13));
        this._balanceLabel.setAnchorPoint(cc.p(0, 0.5));
        this._balanceLabel.setNormalizedPosition(0.25, 0.82);
        bgSprite.addChild(this._balanceLabel);

        this.initBetList(bgSprite);
    },
    onEnter:function () {
        this._super();
        this._posX=this.getPositionX();
    },
    onExit:function(){
        this._listener.release();
        this._super();
    },
    setOffsetPositionX:function(x){
        if(Math.abs(x)<this._posX){
            this._offsetX=x;
            this.setPositionX(this._posX+x);
        }
    },
    touchDown:function(x){
        var self=this;
        if(Math.abs(x)>this._posX/3){
            var moveToAction = cc.moveTo(0.20,cc.p(0,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();
            },this)));
            cc.eventManager.addListener(this._listener, this);

            var url=GC.URL+"room/getUserInfo?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&date="+new Date().format("yyyy-MM-dd");
            th.Http.inst().get(url,function(success,json){
                if(success&&json.code==200){
                    var data=json.data;
                    cc.log("User:"+JSON.stringify(data));
                    self.setDetail(data.user_name,data.nickname,formatCurrency(data.balance),data.change_balance);
                    self._betListData=data.list;
                    self._betListTableView.reloadData();
                }else{
                    cc.log("get user info error")
                }
            });
        }else{
            var moveToAction = cc.moveTo(0.20,cc.p(this._posX,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();
            },this)));
        }

    },
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        target._beginPoint=touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event){
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset>0){
            target.x=target._endPosX+offset;
        }else{
            target._beginPoint=touch.getLocation();
        }
    },
    onTouchEnded:function(touch, event){
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset!=0){
            if(Math.abs(offset)>target._posX/3){
                var moveToAction = cc.moveTo(0.20,cc.p(target._posX,target.getPositionY()));
                target.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                    target._endPosX=target.getPositionX();
                    cc.eventManager.removeListener(target._listener);
                },this)));
            }else{
                var moveToAction = cc.moveTo(0.20,cc.p(0,target.getPositionY()));
                target.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                    target._endPosX=target.getPositionX();
                },this)));
            }
        }

    },
    setDetail:function(loginName,nickName,balance,todayWinlose){
        this._accountIdLabel.setString(loginName);
        this._nicknameLabel.setString(nickName);
        this._balanceLabel.setString(balance+"");
        this._ingotLabel.setString(todayWinlose+"元宝");
    },
    setBalance:function(balance){
        this._balanceLabel.setString(balance+"");
    }

});

DetailLayer.create=function(){
    return new DetailLayer();
};