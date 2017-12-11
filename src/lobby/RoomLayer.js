/**
 * Created by tanhao on 2017/1/17.
 */
var G_ROOMLAYER;
var RoomLayer = cc.Layer.extend({
    _nameLabel:null,
    _balanceLabel:null,
    _gameMenu:null,
    _typeMenu:null,
    _roomTableView:null,
    _bgTopSprite:null,
    _bgGameSprite:null,
    _bgTypeSprite:null,
    _category:null,
    _groupType:null,
    _gameType:null,
    _gameLimit:null,
    _data:null,
    _callback:null,
    ctor: function (groupType,type,callback) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        this._callback=callback;
        //1 北京赛车,2重庆时时彩,3 幸运飞艇
        this._groupType=groupType;
        //1北京赛车牌九,2北京赛车牛牛,3北京赛车三公,4北京赛车龙虎,
        //5重庆时时彩单张,6重庆时时彩龙虎
        //7北京赛车牌九,8北京赛车牛牛,9北京赛车三公,10北京赛车龙虎,
        this._gameType=groupType==2?5:groupType==3?7:1;
        //1底分10,2底分100,3体验场
        this._gameLimit=1;

        this.initBackground();
        this.initTopBar();
        this.initGameMenu();
        this.initTypeMenu();
        this.initRoomList();

        this.getRoomData(type);

    },
    initBackground:function(){
        var bgSprite=cc.Sprite.create(res.png_bg_lobby);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2-80));
        this.addChild(bgSprite);

        this._bgTopSprite=cc.Sprite.create(res.png_bg_room_top);
        this._bgTopSprite.setPosition(cc.p(GC.W/2,GC.H-65));
        this.addChild(this._bgTopSprite);

        this._bgGameSprite=cc.Sprite.create(res.png_bg_room_game);
        this._bgGameSprite.setPosition(cc.p(GC.W/2,GC.H-130-85));
        this.addChild(this._bgGameSprite);

        this._bgTypeSprite=cc.Sprite.create(res.png_bg_room_type);
        this._bgTypeSprite.setPosition(cc.p(GC.W/2,GC.H-130-180-60));
        this.addChild(this._bgTypeSprite);
    },
    initTopBar:function(){
        var self=this;
        G_ROOMLAYER = this;
        //发送按钮
        var backBtn = new ccui.Button(res.png_btn_back,res.png_btn_back);
        backBtn.setNormalizedPosition(0.1, 0.5);
        backBtn.setPressedActionEnabled(true);
        backBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        });
        this._bgTopSprite.addChild(backBtn);


        //名字
        this._nameLabel=cc.LabelTTF.create("-", "Arial",30);
        this._nameLabel.setAnchorPoint(cc.p(0,0.5));
        this._nameLabel.setNormalizedPosition(0.2, 0.65);
        this._bgTopSprite.addChild(this._nameLabel);

        //余额
        this._balanceLabel=cc.LabelTTF.create("-元宝", "Arial",30);
        this._balanceLabel.setAnchorPoint(cc.p(0,0.5));
        this._balanceLabel.setNormalizedPosition(0.2, 0.35);
        this._bgTopSprite.addChild(this._balanceLabel);

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
        this._bgTopSprite.addChild(tikuanBtn);

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
        this._bgTopSprite.addChild(chongzhiBtn);
    },
    initGameMenu:function(){
        var bgW=this._bgGameSprite.width;
        var bgH=this._bgGameSprite.height-4;

        if(this._groupType==2){
            var danzhangBtn=cc.MenuItemImage.create( res.png_btn_danzhang_n,res.png_btn_danzhang_s,res.png_btn_danzhang_s,function(){
                cc.audioEngine.playEffect(res.mp3_click);
                danzhangBtn.setEnabled(false);
                //longhuBtn.setEnabled(true);
                this._gameType=5;
                this.refreshRoomList();
            },this);
            //danzhangBtn.setNormalizedPosition(cc.p(0.375,0.88));
            //danzhangBtn.setNormalizedPosition(cc.p(0.5,0.88));
            danzhangBtn.setPosition(cc.p(bgW/2,bgH/2));
            danzhangBtn.setEnabled(false);

           /* var longhuBtn=cc.MenuItemImage.create( res.png_btn_longhu_n,res.png_btn_longhu_s,res.png_btn_longhu_s,function(){
                danzhangBtn.setEnabled(true);
                longhuBtn.setEnabled(false);
                this._gameType=6;
                this.refreshRoomList();
            },this);
            longhuBtn.setNormalizedPosition(cc.p(0.625,0.88));*/

            var _gameMenu=cc.Menu.create(danzhangBtn);
            _gameMenu.x=0;
            _gameMenu.y=0;
            this._bgGameSprite.addChild(_gameMenu);
        }else{
            var paijiuBtn=cc.MenuItemImage.create( res.png_btn_paijiu_n,res.png_btn_paijiu_s,res.png_btn_paijiu_s,function(){
                cc.audioEngine.playEffect(res.mp3_click);
                paijiuBtn.setEnabled(false);
                niuniuBtn.setEnabled(true);
                sangongBtn.setEnabled(true);
                //longhuBtn.setEnabled(true);
                this._gameType=1+(this._groupType==3?6:0);
                this.refreshRoomList();
            },this);
            //paijiuBtn.setNormalizedPosition(cc.p(0.125,0.88));
            //paijiuBtn.setNormalizedPosition(cc.p(0.25,0.5));
            paijiuBtn.setPosition(cc.p(bgW/2-192,bgH/2));
            paijiuBtn.setEnabled(false);

            var niuniuBtn=cc.MenuItemImage.create( res.png_btn_niuniu_n,res.png_btn_niuniu_s,res.png_btn_niuniu_s,function(){
                cc.audioEngine.playEffect(res.mp3_click);
                paijiuBtn.setEnabled(true);
                niuniuBtn.setEnabled(false);
                sangongBtn.setEnabled(true);
                //longhuBtn.setEnabled(true);
                this._gameType=2+(this._groupType==3?6:0);
                this.refreshRoomList();
            },this);
            //niuniuBtn.setNormalizedPosition(cc.p(0.375,0.88));
            //niuniuBtn.setNormalizedPosition(cc.p(0.5,0.5));
            niuniuBtn.setPosition(cc.p(bgW/2,bgH/2));

            var sangongBtn=cc.MenuItemImage.create( res.png_btn_sangong_n,res.png_btn_sangong_s,res.png_btn_sangong_s,function(){
                cc.audioEngine.playEffect(res.mp3_click);
                paijiuBtn.setEnabled(true);
                niuniuBtn.setEnabled(true);
                sangongBtn.setEnabled(false);
                //longhuBtn.setEnabled(true);
                this._gameType=3+(this._groupType==3?6:0);
                this.refreshRoomList();
            },this);
            //sangongBtn.setNormalizedPosition(cc.p(0.75,0.5));
            //sangongBtn.setNormalizedPosition(cc.p(0.625,0.88));
            sangongBtn.setPosition(cc.p(bgW/2+192,bgH/2));

           /* var longhuBtn=cc.MenuItemImage.create( res.png_btn_longhu_n,res.png_btn_longhu_s,res.png_btn_longhu_s,function(){
                paijiuBtn.setEnabled(true);
                niuniuBtn.setEnabled(true);
                sangongBtn.setEnabled(true);
                longhuBtn.setEnabled(false);
                this._gameType=4+(this._groupType==3?6:0);
                this.refreshRoomList();
            },this);
            longhuBtn.setNormalizedPosition(cc.p(0.875,0.88));*/

            var _gameMenu=cc.Menu.create(paijiuBtn,niuniuBtn,sangongBtn);
            _gameMenu.x=0;
            _gameMenu.y=0;
            this._bgGameSprite.addChild(_gameMenu);

        }

    },
    initTypeMenu:function(){
        var bgW=this._bgTypeSprite.width;
        var bgH=this._bgTypeSprite.height;


        var tabxuanzeSprite=cc.Sprite.create(res.png_tabxuanze);
        tabxuanzeSprite.setPosition(cc.p(bgW/2-200,bgH/2-40));
        //tabxuanzeSprite.setNormalizedPosition(cc.p(0.25,0.785));
        this._bgTypeSprite.addChild(tabxuanzeSprite);

        var dizu10Btn=cc.MenuItemFont.create("底注10",function(){
            cc.audioEngine.playEffect(res.mp3_click);
            dizu10Btn.setEnabled(false);
            dizu100Btn.setEnabled(true);
            tiyangBtn.setEnabled(true);
            tabxuanzeSprite.runAction(cc.moveTo(0.2,cc.p(bgW/2-200,tabxuanzeSprite.y)).easing(cc.easeExponentialInOut()))
            this._gameLimit=1;
            this.refreshRoomList();
        },this);
        //dizu10Btn.setNormalizedPosition(cc.p(0.25,0.805));
        dizu10Btn.setPosition(cc.p(bgW/2-200,bgH/2));
        dizu10Btn.setFontSize(40);
        dizu10Btn.setDisabledColor(cc.color(42,190,174));
        dizu10Btn.setEnabled(false);

        var dizu100Btn=cc.MenuItemFont.create("底注100",function(){
            cc.audioEngine.playEffect(res.mp3_click);
            dizu10Btn.setEnabled(true);
            dizu100Btn.setEnabled(false);
            tiyangBtn.setEnabled(true);
            tabxuanzeSprite.runAction(cc.moveTo(0.2,cc.p(GC.W/2,tabxuanzeSprite.y)).easing(cc.easeExponentialInOut()));
            this._gameLimit=2;
            this.refreshRoomList();
        },this);
        //dizu100Btn.setNormalizedPosition(cc.p(0.5,0.805));
        dizu100Btn.setPosition(cc.p(bgW/2,bgH/2));
        dizu100Btn.setDisabledColor(cc.color(42,190,174));
        dizu100Btn.setFontSize(40);

        var tiyangBtn=cc.MenuItemFont.create("体验场",function(){
            cc.audioEngine.playEffect(res.mp3_click);
            dizu10Btn.setEnabled(true);
            dizu100Btn.setEnabled(true);
            tiyangBtn.setEnabled(false);
            tabxuanzeSprite.runAction(cc.moveTo(0.2,cc.p(bgW/2+200,tabxuanzeSprite.y)).easing(cc.easeExponentialInOut()));
            this._gameLimit=3;
            this.refreshRoomList();
        },this);
        //tiyangBtn.setNormalizedPosition(cc.p(0.75,0.805));
        tiyangBtn.setPosition(cc.p(bgW/2+200,bgH/2));
        tiyangBtn.setDisabledColor(cc.color(42,190,174));
        tiyangBtn.setFontSize(40);



        var _typeMenu=cc.Menu.create(dizu10Btn,dizu100Btn,tiyangBtn);
        _typeMenu.x=0;
        _typeMenu.y=0;
        this._bgTypeSprite.addChild(_typeMenu);



    },
    initRoomList:function(){
        this._roomTableView = new cc.TableView(this, cc.size(GC.W, GC.H-130-180-120));
        this._roomTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._roomTableView.setDelegate(this);
        this.addChild(this._roomTableView);
        //this._roomTableView.reloadData();
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {
        cc.audioEngine.playEffect(res.mp3_click);
        //cc.log("Cell",cell.getIdx());
        var self=this;
        //var data=self._data.find((v)=>v.game_id==self._gameType+"").levelList.find((v)=>v.site_type==self._gameLimit).roomList[cell.getIdx()];

        var roomId=cell.getChildByTag(2).getName();

        var url=GC.URL+"room/index?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&room_id="+roomId;
        th.Http.inst().get(url,function(success,json){
            if(success&&json.code==200){
                var room=json.data;
                cc.log("=================>>room init:",JSON.stringify(room));
                GC.GROUP_TYPE=self._groupType;
                GC.GAME_TYPE=self._gameType;
                GC.GAME_LIMIT=self._gameLimit;
                GC.ROOM_ID=roomId;

                var cddata=room.countdownInfo;
                GC.GAME_MAP[self._groupType].status=cddata.status;
                GC.GAME_MAP[self._groupType].countdown=cddata.countdown;
                GC.GAME_MAP[self._groupType].fp_countdown=cddata.fp_countdown;
                GC.GAME_MAP[self._groupType].start_countdown=cddata.start_countdown;
                GC.GAME_MAP[self._groupType].start_time=cddata.start_time;
                GC.GAME_MAP[self._groupType].end_time=cddata.end_time;

                cc.director.runScene(new cc.TransitionFade(0.5,new GameScene(self._groupType,self._gameType,self._gameLimit,room)));
            }else{
                cc.log("get room info error");
                var popup=th.PopupLayer.create(json.message,"确定",function(){
                });
                self.addChild(popup);
            }
        });


    },
    tableCellSizeForIndex:function (table, idx) {
        return cc.size(GC.W, 124+10);
    },
    tableCellAtIndex:function (table, idx) {
        var self=this;
        // var roomList=self._data.find((v)=>v.game_id==self._gameType).levelList.find((v)=>v.site_type==self._gameLimit).roomList;
        var roomList;
        for(var aa=0;aa<self._data.length;aa++){
            if(self._data[aa].game_id==self._gameType){
                var levelList=self._data[aa].levelList;
                for(var bb=0;bb<levelList.length;bb++){
                    if(levelList[bb].site_type==self._gameLimit){
                        roomList=levelList[bb].roomList;
                        break;
                    }
                }
            }
        }

        var icon=self._groupType==1?res.png_icon_car:self._groupType==2?res.png_icon_ssc:res.png_icon_boat;
        var name=(self._gameType==1||self._gameType==7)?"牌九":(self._gameType==2||self._gameType==8)?"牛牛":(self._gameType==3||self._gameType==9)?"三公":(self._gameType==4||self._gameType==6||self._gameType==10)?"龙虎":"单张";


        var index=roomList.length-1-idx;

        var cell = table.dequeueCell();
        var iconSprite;
        var nameLabel;
        var gameTypeLabel;
        var renshuLabel;
        var progressBar;
        if (!cell) {
            cell = new cc.TableViewCell();
            var itemSprite = new cc.Sprite(res.png_bg_room_item);
            itemSprite.setPosition(cc.p(GC.W/2,62));
            cell.addChild(itemSprite);

            /*
            var headSprite =new cc.Sprite(res.png_head_img);
            headSprite.setPosition(cc.p(70,62));
            cell.addChild(headSprite);
            */



            nameLabel=new cc.LabelTTF("room", "Arial", 30);
            nameLabel.setAnchorPoint(cc.p(0,0.5));
            nameLabel.setPosition(cc.p(30,62));
            nameLabel.setTag(2);
            nameLabel.setName(roomList[index].room_id);
            cell.addChild(nameLabel);
            nameLabel.setString(roomList[index].site_name);


            iconSprite= new cc.Sprite(res.png_icon_car);
            iconSprite.tag = 1;
            iconSprite.setPosition(cc.p(320,62));
            cell.addChild(iconSprite);
            iconSprite.setTexture(cc.textureCache.addImage(icon));


            gameTypeLabel=new cc.LabelTTF(name, "Arial", 45);
            gameTypeLabel.setColor(cc.color(253,214,36));
            gameTypeLabel.setPosition(cc.p(380,62));
            gameTypeLabel.setTag(5);
            cell.addChild(gameTypeLabel);

            /*
            var renshuSprite= new cc.Sprite(res.png_icon_renshu);
            renshuSprite.setPosition(cc.p(GC.W/2+100,62));
            cell.addChild(renshuSprite);
            */

            renshuLabel=new cc.LabelTTF("0000", "Arial", 30);
            renshuLabel.setColor(cc.color(253,214,36));
            renshuLabel.setPosition(cc.p(GC.W/2+150,62));
            renshuLabel.setTag(3);
            cell.addChild(renshuLabel);
            renshuLabel.setString(roomList[index].online_count);

            var progressBgSprite=cc.Sprite.create(res.png_progress_bg);
            progressBgSprite.setPosition(cc.p(GC.W/2+280,62));
            cell.addChild(progressBgSprite);

            progressBar = new ccui.LoadingBar();
            progressBar.loadTexture(res.png_progress);
            progressBar.setPercent(50);
            progressBar.setPosition(cc.p(GC.W/2+280,62));
            progressBar.setTag(4);
            cell.addChild(progressBar);
            progressBar.setPercent(roomList[index].online_count);
        } else {
            nameLabell = cell.getChildByTag(2);
            nameLabell.setString(roomList[index].site_name);
            nameLabell.setName(roomList[index].room_id);

            iconSprite = cell.getChildByTag(1);
            iconSprite.setTexture(cc.textureCache.addImage(icon));

            gameTypeLabel= cell.getChildByTag(5);
            gameTypeLabel.setString(name);

            renshuLabel = cell.getChildByTag(3);
            renshuLabel.setString(roomList[index].online_count);

            progressBar = cell.getChildByTag(4);
            progressBar.setPercent(roomList[index].online_count);

        }

        return cell;
    },
    numberOfCellsInTableView:function (table) {
        if(this._data==null){
            return 0;
        }
        var self=this;
        //cc.log("cell:",self._gameType,self._data);
        // var num=self._data.find((v)=>v.game_id==self._gameType+"").levelList.find((v)=>v.site_type==self._gameLimit).roomList.length;
        var num;
        for(var aa=0;aa<self._data.length;aa++){
            if(self._data[aa].game_id==self._gameType){
                var levelList=self._data[aa].levelList;
                for(var bb=0;bb<levelList.length;bb++){
                    if(levelList[bb].site_type==self._gameLimit){
                        num=levelList[bb].roomList.length;
                        break;
                    }
                }
            }
        }
        return num;
    },
    onEnter:function(){
        this._super();
        GC.GROUP_TYPE=this._groupType;
        this.setPositionX(-GC.W);
        var moveTo=cc.moveTo(0.25,cc.p(0,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    },
    close:function(){
        var moveTo=cc.moveTo(0.25,cc.p(-GC.W,this.getPositionY()));
        this.runAction(cc.sequence( moveTo.easing(cc.easeExponentialOut()),cc.callFunc(function(event){
           this.removeFromParent();
           this._callback();
        },this)));
    },
    refreshRoomList:function(){
        //cc.log("RefreshRoomList:",this._groupType,this._gameType,this._gameLimit);
        this._roomTableView.reloadData();
    },
    getRoomData:function(type){
        var self=this;
        //cc.log(this._groupType);
        var url=GC.URL+type+"?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&lottery_id="+this._groupType;
        th.Http.inst().get(url,function(success,json){
            cc.log("=================>>room:"+JSON.stringify(json));
            if(success&&json.code==200){
                var data=json.data;
                self._nameLabel.setString(data.nickname);
                self._balanceLabel.setString(formatCurrency(data.balance)+"元宝");
                self._data=data.gameList;
                self._roomTableView.reloadData();
            }else{
                cc.log("get room data error")
            }
        })
    }
});

RoomLayer.create=function(groupType){
    return new RoomLayer(groupType);
};