/**
 * Created by lyf on 2017/6/24.
 * 跑道
 */
var GameBaseLayer=cc.Layer.extend({
    _headLayer:null,
    _animateLayer:null,
    _nameLabel:null,
    _totalChipsLabel:null,
    _balanceLabel:null,
    _cdFengpanSprite:null,
    _cdBetBgSprite:null,
    _cdStartBgSprite:null,
    _shangzhuangBtn:null,
    _wanjiaListBtn:null,
    _xiazhuangBtn:null,
    _baseLayer:null,
    _resultAnimationLayer:null,  //结果动画
    _bankerListLayer:null,//庄家列表
    _bankerUserLayer:null,//当前庄信息
    _tableSprite:null, //桌面
    _chipImgs:null,//筹码图片集合
    _chipCoins:null, //筹码上面的金额
    _chipBtns:null,    //筹码按钮
    _chips:null,   //二维数据每个区的筹码
    _chipi:null,  //选中筹码编号
    _zoneBtns:null,    //所有的下注按钮集合，从1开始
    _amt:null,   //选中筹码金额
    _iskaijing:null, //是否在执行开奖动画
    _cancelBtn:null, //取消下注按钮
    _resultLayer:null,//结算Layer
    _diceAnimateLayer:null,//骰子动画层
    _isShowBetInfo:null,//是否显示下注提示

    _rankImgs:null,
    _groupType:null,
    _gameType:null,
    _gameLimit:null,
    _roomData:null,
    ctor:function (groupType,gameType,gameLimit,roomData) {
        this._super();

        var self=this;
        this._iskaijing=false;
        this._isShowBetInfo=false;
        this._chipBtns=[];
        this._zoneBtns=[];
        this._chips=[[],[],[],[],[],[]];

        this._rankImgs=[,res.png_rank_one,res.png_rank_two,res.png_rank_three,res.png_rank_four,res.png_rank_five];
        this._chipImgs = [res.png_btn_chips1,res.png_btn_chips2,res.png_btn_chips3,res.png_btn_chips4,res.png_btn_chips5];
        this._chipCoins=roomData.coinList;
        this._groupType = groupType;
        this._gameType = gameType;
        this._gameLimit = gameLimit;
        this._roomData = roomData;


        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);


        this.initCountdown();

        //桌面
        this._tableSprite = new cc.Sprite(res.png_img_zhuomian);
        this._tableSprite.setPosition(cc.p(GC.W/2,this._tableSprite.height / 2+25));
        this.addChild(this._tableSprite);

        //头部
        this._headLayer = new HeadLayer(this._gameType);
        this.addChild(this._headLayer);

        //开奖效果
        if(groupType==1||groupType==3){
            this._animateLayer=new TrackLayer(groupType,(function(self){
                return function (result) {
                    self._headLayer.setResult(result);
                }
            })(this));
        }else{
            this._animateLayer=new SlotLayer();
        }
        this.addChild(this._animateLayer,1);

        // 当前庄用户
        this._bankerUserLayer = new BankerUserLayer();
        this._bankerUserLayer.setVisible(false);
        this.addChild(this._bankerUserLayer,1);

        //this._bankerInfoLayer.updateBankInfo("abc",2342);

        //庄家列表
        this._bankerListLayer=new BankerListLayer();
        this.addChild(this._bankerListLayer,1);
        if(this._groupType==3){
            this._bankerListLayer.setPositionY(20);
            //this._bankerInfoLayer.setPositionY(20);
        }

        //上庄按钮
        this._shangzhuangBtn = new ccui.Button(res.png_btn_shangzhuang);
        this._shangzhuangBtn.setNormalizedPosition(0.162, 0.667);
        this.addChild(this._shangzhuangBtn,1);
        this._shangzhuangBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(Number(GC.BALANCE) >= Number(self._roomData.less_host_banlance) )
            {
                var onvillage = new OnVillageLayer(self._roomData.less_host_banlance,self._roomData.max_host_banlance);
                self.getParent().addChild(onvillage);
            }else
            {
                var YB_buzhu=new th.PopupLayer("最少需要"+self._roomData.less_host_banlance+"元宝，元宝不足","确定",function(){

                });
                self.addChild(YB_buzhu,999);
            }
        });
        //下庄按钮
        this._xiazhuangBtn=new ccui.Button(res.png_img_btn_xiazhuang);
        this._xiazhuangBtn.setNormalizedPosition(0.162, 0.667);
        this._xiazhuangBtn.setVisible(false);
        this.addChild(this._xiazhuangBtn,1);
        this._xiazhuangBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var url=GC.URL+"room/downHost?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
            th.Http.inst().get(url,function(success,json){
                cc.log("down banker:"+JSON.stringify(json));
                if(success&&json.code==200){

                }else{
                    var popup=new th.PopupLayer(json.message,"确定",function(){

                    });
                    self.addChild(popup,999);
                }
            })
        });

        //切换按钮
        var qiehuanBtn = new ccui.Button(res.png_btn_qiehuan);
        qiehuanBtn.setNormalizedPosition(0.95, 0.57);
        qiehuanBtn.addClickEventListener(function () {

            cc.audioEngine.playEffect(res.mp3_click);
            var car=parseInt((GC.GAME_MAP["1"].lobbyEndTime-new Date().getTime())/1000);
            var ssc=parseInt((GC.GAME_MAP["2"].lobbyEndTime-new Date().getTime())/1000);
            var boat=parseInt((GC.GAME_MAP["3"].lobbyEndTime-new Date().getTime())/1000);
            //cc.log(car,ssc,boat);
            var switchSprite=new SwitchSprite(car,ssc,boat);
            self.addChild(switchSprite,999);

            //var i=parseInt(Math.random()*5)+1;
            //self._diceAnimateLayer.runTo(i);
        });
        this.addChild(qiehuanBtn);



        //总下注筹码
        var totalChipsBg = new cc.Sprite(res.png_btn_totalchipsnum);
        totalChipsBg.setNormalizedPosition(0.5, 0.6);
        this.addChild(totalChipsBg,1);

        var chipsIconSprite= new cc.Sprite(res.png_btn_totalchipsimg);
        chipsIconSprite.setNormalizedPosition(0.1, 0.5);
        totalChipsBg.addChild(chipsIconSprite);

        this._totalChipsLabel = new cc.LabelTTF("总额0","Arial", 26);
        this._totalChipsLabel.setNormalizedPosition(0.5, 0.5);
        totalChipsBg.addChild(this._totalChipsLabel);

        //取消下注按钮
        this._cancelBtn = new CancelBetButton(function(){
            self._cdBetBgSprite.isCountdown();
        });
        this._cancelBtn.setNormalizedPosition(cc.p(0.5,0.12));
        this._cancelBtn.setVisible(false);
        this._cancelBtn.addClickEventListener(this.cancalBet);
        this.addChild(this._cancelBtn,1);



        // 充值按钮
        var chongzhiBtn = new ccui.Button(res.png_btn_choumaImg);
        chongzhiBtn.setNormalizedPosition(0.9, 0.055);
        chongzhiBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            // cc.log("充值按钮!");
            // var rechargeMessageLayer = new RechargeMessageLayer();
            // self.addChild(rechargeMessageLayer,999);
            if(!!GC.LOGIN_NAME)
            {
                var reqUrl = GC.URL + "pay/getPayTypeList?"
                    + "client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var rechargeMessageLayer = new RechargeMessageLayer(data.data);
                        self.addChild(rechargeMessageLayer,9999);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong,9999);
                    }
                })
            }else {
                var chenggong=new th.PopupLayer("请先登录","确定",function(){
                });
                self.addChild(chenggong);
            }

        });
        this.addChild(chongzhiBtn,1);
        var chongzhiText = new cc.LabelTTF("充值","Arial", 26);
        chongzhiText.setNormalizedPosition(0.5, -0.02);
        chongzhiBtn.addChild(chongzhiText,0);
        // 帮助按钮
        var helpBtn = new ccui.Button(res.png_btn_help);
        helpBtn.setNormalizedPosition(0.85, 0.12);
        helpBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            helpBtn.setTouchEnabled(false);
            var reqUrl = GC.URL + "room/getRoomHelp?"
                + "client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                helpBtn.setTouchEnabled(true);
                if(isSuccess && data.code == "200")
                {
                    var betlistview = new BetListLayer(data,self._gameType,3);
                    self.getParent().addChild(betlistview,99);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.addChild(chenggong);
                }
            })
        });
        this.addChild(helpBtn,1);
        //玩家列表按钮
        this._wanjiaListBtn = new ccui.Button(res.png_btn_wanjia);
        this._wanjiaListBtn.setNormalizedPosition(0.95, 0.12);
        this._wanjiaListBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._wanjiaListBtn.setTouchEnabled(false);
            var reqUrl = GC.URL + "room/getRoomUsers?"
                + "&page_start=1"
                + "&page_size=10000"
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {
                    var userlist = new OnlineUsersListLayer(data);
                    self.getParent().addChild(userlist,99);
                    self._wanjiaListBtn.setTouchEnabled(true);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.getParent().getParent().addChild(chenggong);
                }
            })
        });
        this.addChild(this._wanjiaListBtn,1);

        //名字
        this._nameLabel = new cc.LabelTTF("--","Arial", 30);
        this._nameLabel.setNormalizedPosition(0.03, 0.14);
        this._nameLabel.setAnchorPoint(cc.p(0,0.5));
        this.addChild(this._nameLabel );


        //余额
        var bgBalanceSprite = cc.Sprite.create(res.png_btn_money);
        bgBalanceSprite.setNormalizedPosition(0.16, 0.108);
        this.addChild(bgBalanceSprite,1);

        var icon_money = new cc.Sprite(res.png_icon_money);
        icon_money.setNormalizedPosition(0.12, 0.48);
        bgBalanceSprite.addChild(icon_money);


        this._balanceLabel=cc.LabelTTF.create("0", "Arial",26);
        this._balanceLabel.setNormalizedPosition(0.59, 0.5);
        this._balanceLabel.setColor(cc.color(31,128,133));
        bgBalanceSprite.addChild(this._balanceLabel);

        //筹码背景
        var chipBg = new cc.Sprite(res.png_btn_choumaBg);
        chipBg.setNormalizedPosition(0.5, 0.03);
        this.addChild(chipBg,1);

        //筹码
        //cc.log("chip:",roomData.coinList);

        for(var i = roomData.coinList.length-1; i>=0 ; i--) {

            var chipHalo = new cc.Sprite(res.png_btn_chouma_s);
            chipHalo.setNormalizedPosition(0.09 + ( i * 0.15), 0.0415);
            chipHalo.setName("chipHalo" + i);
            chipHalo.setVisible(i==0?true:false);
            this.addChild(chipHalo,1);


            /*var chipBtn = new ccui.Button(this._chipImgs[i]);
            chipBtn.setNormalizedPosition(0.09 + ( i * 0.15), 0.04);
            //chipBtn.setTitleText(roomData.coinList[i]+"");
            //chipBtn.setTitleColor(cc.color(255,255,255,255));
            //chipBtn.setTitleFontSize(28);
            chipBtn.setActionTag(roomData.coinList[i]);
            chipBtn.setTag(i);
            chipBtn.addClickEventListener(this.chipBtnCallback);
            this.addChild(chipBtn,1);

            var chipLabel =new cc.LabelBMFont(roomData.coinList[i]+"", res.fnt_chip_num);
            chipLabel.setNormalizedPosition(0.52,0.5);
            chipBtn.addChild(chipLabel);*/

            var chipBtn=new Chiputton(this._chipImgs[i],roomData.coinList[i]);
            chipBtn.setNormalizedPosition(0.09 + ( i * 0.15), 0.04);
            chipBtn.setActionTag(roomData.coinList[i]);
            chipBtn.setTag(i);
            chipBtn.addClickEventListener(this.chipBtnCallback);
            this.addChild(chipBtn,1);

            this._chipBtns[i]=chipBtn;
        }

        this._amt=this._chipBtns[0].getActionTag();
        this._chipi=this._chipBtns[0].getTag();

        //骰子动画
        this._diceAnimateLayer=new DiceAnimateLayer(this._gameType);
        this.addChild(this._diceAnimateLayer,5);


        //赋值
        this._headLayer.setRoomName(roomData.title);
        this._headLayer.setResult(roomData.lottery_number);
        this._nameLabel.setString(roomData.nickname);



        this.initBaseLayer();
        return true;
    },
    isShowBankerList:function(isShow){
        this._bankerListLayer.setVisible(isShow);
        if(isShow){
            this._shangzhuangBtn.setNormalizedPosition(0.162, 0.667);
            this._xiazhuangBtn.setNormalizedPosition(0.162, 0.667);
        }else{
            this._shangzhuangBtn.setNormalizedPosition(0.198, 0.58);
            this._xiazhuangBtn.setNormalizedPosition(0.198, 0.58);
        }
    },
    initCountdown:function(){
        var self=this;
        //下局开始倒计时
        this._cdStartBgSprite=CDStartSprite.create(function(){
            cc.log("=====>>"+new Date().format("yyyy-MM-dd hh:mm:ss")+" 下局开始倒计时完成==>>开始下注倒计时:",GC.GAME_MAP[self._groupType].countdown);
            //显示庄家列表
            self.reset();
            self.isShowBankerList(true);
            self._cdBetBgSprite.setVisible(true);
            self._cdFengpanSprite.setVisible(false);
            self._cdStartBgSprite.setVisible(false);
            self._cdBetBgSprite.setCountdown(GC.GAME_MAP[self._groupType].countdown);
            //更新庄家列表
            self.updateBankerList(GC.BANKER_DATA);
            self.showBankUser(true);



        });
        //this._cdStartBgSprite.setNormalizedPosition(cc.p(0.843,0.680));
        this._cdStartBgSprite.setNormalizedPosition(cc.p(0.5,0.362));
        this._cdStartBgSprite.setVisible(false);
        this.addChild(this._cdStartBgSprite,4);
        /*if(this._groupType==2){
            this._cdStartBgSprite.setNormalizedPosition(cc.p(0.843,0.6655));
        }*/

        //封盘倒计时
        this._cdFengpanSprite=CDFengpanSprite.create(function(){
            cc.log("=====>>"+new Date().format("yyyy-MM-dd hh:mm:ss")+" 封盘倒计时完成==>>执行动画");
            //隐藏庄家列表
            self.isShowBankerList(false);
            self._animateLayer.startRun();
            self._cdBetBgSprite.setVisible(false);
            self._cdFengpanSprite.setVisible(false);
            self._cdStartBgSprite.setVisible(false);
        });
        this._cdFengpanSprite.setNormalizedPosition(cc.p(0.5,0.362));
        this._cdFengpanSprite.setVisible(false);
        this.addChild(this._cdFengpanSprite,4);

        //投注剩余时间
        this._cdBetBgSprite=CDBetSprite.create(function(){
            cc.log("=====>>"+new Date().format("yyyy-MM-dd hh:mm:ss")+" 下注剩余时间完成==>>开始封盘倒计时:",GC.GAME_MAP,self._groupType,GC.GAME_MAP[self._groupType].fp_countdown);
            self._cdBetBgSprite.setVisible(false);
            self._cdFengpanSprite.setVisible(true);
            self._cdStartBgSprite.setVisible(false);
            self._cdFengpanSprite.setCountdown(GC.GAME_MAP[self._groupType].fp_countdown);
            self.showBankUser(false);
        },this._gameType);
        this._cdBetBgSprite.setNormalizedPosition(cc.p(0.5,0.12));
        this._cdBetBgSprite.setVisible(false);
        this.addChild(this._cdBetBgSprite,4);
    },
    initBaseLayer:function(){
        this._baseLayer=new BaseLayer();
        this.addChild(this._baseLayer,10);
    },
    chipBtnCallback:function(target){
        cc.audioEngine.playEffect(res.mp3_chip_click);
        var self=target.getParent();

        for(var i=0;i<self._chipBtns.length;i++){
            self.getChildByName("chipHalo"+i).setVisible(target.getTag()==i);
        }
        self._amt=target.getActionTag();
        self._chipi=target.getTag();
        //cc.log(tag);
    },
    setNickname:function(name){
        this._nameLabel.setString(name);
    },
    setRoomName:function(name){
        this._headLayer.setRoomName(name);
    },
    setMarquee:function(text){
        this._headLayer.setMarquee(text);
    },
    setBalance:function(balance){
        //cc.log("更新游戏中余额",balance);
        //this._baseLayer.setBalance(balance+"");
        this._balanceLabel.setString(formatCurrency(balance));
    },
    setCountdown:function(lotteryId,status,countdown,startCountdown,fpCountdown){
        if(lotteryId==this._groupType){
            if(status==1){
                //1-下注状态
                this._cdBetBgSprite.setCountdown(countdown);
                this._cdBetBgSprite.setVisible(true);
                this._cdFengpanSprite.setVisible(false);
                this._cdStartBgSprite.setVisible(false);

                this.showBankUser(true);
            }else if(status==2){
                //封盘状态
                this._cdBetBgSprite.setVisible(false);
                this._cdFengpanSprite.setVisible(true);
                this._cdStartBgSprite.setVisible(false);
                this._cdFengpanSprite.setCountdown(fpCountdown);
            }else if(status==3){
                //等待开始状态
                this._cdStartBgSprite.setCountdown(startCountdown);
                this._cdBetBgSprite.setVisible(false);
                this._cdFengpanSprite.setVisible(false);
                this._cdStartBgSprite.setVisible(true&&!this._iskaijing);
            }else if(status==4){
               /* //休市
                var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){
                    cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                });
                this.addChild(popup,999);*/
            }
        }
    },
    setLotteryResult:function(data){
         this._iskaijing=true;
         this._cdStartBgSprite.setVisible(false);
         //this._bankerListLayer.setVisible(true);

         GC.BANKER_DATA=data.hostInfo;

        //开奖结果
         var self=this;
         this._headLayer.setRoomName(data.title);
         if(this._groupType==2){
             this._headLayer.setResult(data.lottery_number);
         }
         this._animateLayer.stopRun(data.is_catch==1?data.lottery_number:"1,2,3,4,5,6,7,8,9,10");

         //取到排名
         var points=[];
         for(var i=0;i<data.zoneOpenDetail.length;i++){
             points[i+1]=data.zoneOpenDetail[i].point;
         }

         //动画停止后显示开奖效果
         this.scheduleOnce(function(){

             //如果没抓到结果
             if(data.is_catch==0){
                 self._headLayer.setResult(data.lottery_number);
             }

             //显示点数动画
             self._resultAnimationLayer = new PokerAnimationLayer();
             this.addChild(self._resultAnimationLayer,6);
             self._resultAnimationLayer.starAction(data.lottery_number,this._gameType,points,(function(data,self){
                 return function(){
                     //车停止显示庄家列表
                     self.isShowBankerList(true);
                     //更新区结果
                     for(var i=0;i<data.zoneOpenDetail.length;i++){
                         var zoneDetail=data.zoneOpenDetail[i];
                         var zone=zoneDetail.zone;
                         var rank=zoneDetail.rank;
                         var isWin=zoneDetail.cal_balance>zoneDetail.balance;

                         var zoneBtn=self._zoneBtns[zone];
                         zoneBtn.isWin(isWin);

                         if(self._gameType!=2&&self._gameType!=8){
                             zoneBtn.setWinTexture(cc.textureCache.addImage(self._rankImgs[rank]),true);
                         }else{
                             zoneBtn.setWinTexture(cc.textureCache.addImage(res.png_win_icon),isWin);
                         }

                     }


                     var offsetTime=0;
                     //筹码根据消息飞筹码效果
                     for(var i=0;i<data.flyBalance.length;i++){
                         var obj=data.flyBalance[i];
                         if(!obj){return};

                         offsetTime=offsetTime+(obj.fly_balance>0?1.2:0);

                         self.scheduleOnce((function(self,beginZone,endZone,flyBalance){
                             return function(){


                                 var startZoneBtn=self._zoneBtns[beginZone];  //开始区域按钮
                                 //var beginZoneData=GC.BET_DATA.zoneDetail.find(n=>n.zone==beginZone);
                                 var beginZoneData;
                                 for(var j=0;j<GC.BET_DATA.zoneDetail.length;j++){
                                     if(GC.BET_DATA.zoneDetail[j].zone==beginZone){
                                         beginZoneData=GC.BET_DATA.zoneDetail[j];
                                         break;
                                     }
                                 }
                                 var flyChips=[];  //要飞的筹码
                                 var laveChips=[]; //剩余筹码
                                 var flyAmtTotal=0;  //要飞的总金额
                                 var laveBalance=0;  //剩余的总金额

                                 //如果开始区域筹码要全部飞完
                                 if(flyBalance==beginZoneData.all_balance){
                                     cc.log("ALL begin:",beginZone,"end:",endZone,"flyBalance:",flyBalance);
                                     //取到成要飞的筹码
                                     var startZoneChips=self._chips[beginZone];
                                     for(var j=startZoneChips.length-1;j>=0;j--){
                                         var chip=startZoneChips[j];
                                         flyAmtTotal=flyAmtTotal+chip.getTag();
                                         flyChips[j]=chip;
                                         startZoneChips.splice(j,1);
                                     }

                                     laveBalance=beginZoneData.all_balance-flyAmtTotal;
                                 }else{
                                     //最小筹码面额
                                     var minChipAmt=self._chipCoins[0];
                                     //生成要飞的筹码
                                     cc.log("Some begin:",beginZone,"end:",endZone,"flyBalance:",flyBalance);
                                     var i=0;
                                     do{
                                         //要飞的金额剩下的金额小与最小筹码（有小数的情况）
                                         if(flyBalance-flyAmtTotal<minChipAmt){
                                             var chipSprite=new ChipSprite(0,flyBalance-flyAmtTotal);
                                             flyChips[i]=chipSprite;
                                             flyAmtTotal=flyBalance;
                                             break;
                                         }

                                         var amt=self._chipCoins[Math.floor(Math.random()*5)];
                                         if(flyAmtTotal+amt>flyBalance){
                                             continue;
                                         }
                                         // var imgi=self._chipCoins.findIndex(n=>n==amt);
                                         var imgi;
                                         for(var aa = 0; aa < self._chipCoins.length; aa ++)
                                         {
                                             if(self._chipCoins[aa] == amt)
                                             {
                                                 imgi = aa;
                                                 break;
                                             }
                                         }
                                         var chipSprite=new ChipSprite(imgi,amt);
                                         flyChips[i]=chipSprite;
                                         flyAmtTotal=flyAmtTotal+amt;

                                         //cc.log("生成要飞的筹码,flyBalance:",flyBalance,"flyAmtTotal:",flyAmtTotal,"amt",amt);
                                         i++;
                                     }while(flyAmtTotal<flyBalance);

                                     //如果有剩余就生成剩余筹码
                                     laveBalance=beginZoneData.all_balance-flyAmtTotal;
                                     if(laveBalance>0){
                                         //有剩余
                                         var laveAmtTotal=0;  //剩余总金额
                                         var i=0;
                                         do{
                                             //如果留下的金额剩下的小与最小筹码（有小数的情况）
                                             if(laveBalance-laveAmtTotal<minChipAmt){
                                                 var chipSprite=new ChipSprite(0,laveBalance-laveAmtTotal);
                                                 laveChips[i]=chipSprite;
                                                 flyAmtTotal=laveBalance;
                                                 break;
                                             }

                                             var amt=self._chipCoins[Math.floor(Math.random()*5)];
                                             if(laveAmtTotal+amt>laveBalance){
                                                 continue;
                                             }
                                             // var imgi=self._chipCoins.findIndex(n=>n==amt);
                                             var imgi;
                                             for(var aa = 0; aa < self._chipCoins.length; aa ++)
                                             {
                                                 if(self._chipCoins[aa] == amt)
                                                 {
                                                     imgi =aa;
                                                     break;
                                                 }
                                             }
                                             var chipSprite=new ChipSprite(imgi,amt);
                                             laveChips[i]=chipSprite;
                                             laveAmtTotal=laveAmtTotal+amt;
                                             //cc.log("有剩余就生成剩余筹码,laveBalance:",laveBalance,"laveAmtTotal:",laveAmtTotal,"amt",amt);
                                             i++;
                                         }while(laveAmtTotal<laveBalance);
                                     }

                                     //删除开始区域全部筹码
                                     var startZoneChips=self._chips[beginZone];
                                     for(var j=startZoneChips.length-1;j>=0;j--){
                                         var chip=startZoneChips[j];
                                         chip.removeFromParent();
                                         startZoneChips.splice(j,1);
                                     }
                                     //添加开始区域剩余筹码
                                     for(var i=0;i<laveChips.length;i++){
                                         var chip=laveChips[i];
                                         chip.setPosition(self.getPosByZoneBtn(startZoneBtn));
                                         self.addChild(chip,3);
                                         startZoneChips[i]=chip;
                                     }
                                     //添加开始区域将要飞筹码
                                     for(var i=0;i<flyChips.length;i++){
                                         var chip=flyChips[i];
                                         chip.setPosition(self.getPosByZoneBtn(startZoneBtn));
                                         self.addChild(chip,3);
                                     }
                                 }


                                 //设置开始区域剩余金额
                                 beginZoneData.all_balance=laveBalance;
                                 startZoneBtn.setBetAmount(beginZoneData.all_balance,null);

                                 cc.audioEngine.playEffect(res.mp3_chip_fly);
                                 //设置结束区域金额
                                 if(endZone!=-1&&endZone!=-2){
                                     //飞向其他区域
                                     // var endZoneData=GC.BET_DATA.zoneDetail.find(n=>n.zone==endZone);

                                     var endZoneData;
                                     for(var aa = 0; aa < GC.BET_DATA.zoneDetail.length; aa ++)
                                     {
                                         if(GC.BET_DATA.zoneDetail[aa].zone == endZone)
                                         {
                                             endZoneData = GC.BET_DATA.zoneDetail[aa];
                                             break;
                                         }
                                     }
                                     endZoneData.all_balance=endZoneData.all_balance+flyAmtTotal;
                                     var endZoneBtn = self._zoneBtns[endZone];
                                     endZoneBtn.setBetAmount(endZoneData.all_balance,null);

                                     var endZoneChips=self._chips[endZone];
                                     for(var i=0;i<flyChips.length;i++){
                                         var chip=flyChips[i];
                                         chip.runTo(0,1.0,self.getPosByZoneBtn(endZoneBtn),false);
                                         endZoneChips.push(chip);
                                     }
                                 }else{
                                     //飞向庄或者用户组
                                     for(var i=0;i<flyChips.length;i++){
                                         var chip=flyChips[i];
                                         chip.runTo(0,1.0,endZone==-1?cc.p(712,160):cc.p(100,1100),true);
                                     }
                                 }
                             }
                         })(self,obj.begin_zone,obj.end_zone,obj.fly_balance),i*1.2);

                     }


                    /* var totalZone=0;
                     self.scheduleOnce(function(){
                         //剩下的筹码飞效果
                         for(var i=1;i<self._chips.length;i++){
                             if(self._chips[i].length>0){
                                 totalZone=totalZone+1;
                             }
                             for(var j=0;j<self._chips[i].length;j++){
                                 var chip=self._chips[i][j];
                                 chip.runTo(i*1.0,1.25,cc.p(712,160),true);
                             }

                             if(self._chips[i].length>0){
                                 self.scheduleOnce((function(self,beginZone){
                                     return function(){
                                         cc.log("BeginZone:",beginZone);
                                         var startZoneBet=GC.BET_DATA.zoneDetail.find(n=>n.zone==beginZone);
                                         startZoneBet.all_balance=0;
                                         //startZoneBet.coinDetail.push(flySum);
                                         var startZoneBtn=self._zoneBtns[beginZone];
                                         startZoneBtn.setBetAmount(startZoneBet.all_balance);
                                     }
                                 })(self,i),i*1.0);
                             }

                         }
                         self._chips=[[],[],[],[],[],[]];
                     },offsetTime);*/

                     //玩家输赢动画
                     var wl=data.profit_balance;
                     if(wl!=0){
                         var winloseLabel=new cc.LabelBMFont(wl>0?("+"+wl):(wl+""),wl>=0?res.fnt_win_num:res.fnt_lose_num);
                         winloseLabel.setPosition(cc.p(130,140));
                         this.addChild(winloseLabel,5);

                         var moveTo=cc.moveTo(1.0,cc.p(130,250));
                         var sequence= cc.sequence(moveTo,cc.fadeOut(0.2),cc.callFunc(function(event){
                             winloseLabel.removeFromParent();
                         }));
                         winloseLabel.runAction(sequence);
                     }

                     //显示输赢列表
                     self.scheduleOnce(function(){
                         //显示输赢列表
                        if (cc.sys.isObjectValid(self._resultLayer)) {//对象有效
                             self._resultLayer.removeFromParent();
                             self._resultLayer=null;
                        }

                        if(GC.GAME_MAP[self._groupType].status==4){
                             var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){
                                 cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                             });
                            self.addChild(popup,998);
                        }

                        self._resultLayer=new SettlementLayer(data);
                        self.addChild(self._resultLayer,999);
                        //离下局开到倒计时
                        self._cdStartBgSprite.isCountdown();
                        self._iskaijing=false;

                     },offsetTime+3);


                 }
             })(data,this));
         },3);



    },
    showZoneDetail:function(zone){
        var self = this;
        var reqUrl = GC.URL + "room/getOneZoneBetDetail?"
            + "zone=" + zone
            + "&client_id="+GC.CLIENT_ID
            + "&token="+GC.TOKEN;
        ;
        th.Http.inst().get(reqUrl,function (isSuccess, data) {
            if(isSuccess && data.code == "200")
            {
                var examinebet = new ExamineBettingLayer(data)
                self.getParent().getParent().addChild(examinebet);
            }else
            {
                var chenggong=new th.PopupLayer(data.message,"确定",function(){
                });
                self.getParent().getParent().addChild(chenggong);
            }
        })

    },
    cancalBet:function(target){
        cc.audioEngine.playEffect(res.mp3_click);
        var self=target.getParent();
        var url=GC.URL+"room/cancelBet?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
        th.Http.inst().get(url,function(success,json){
            cc.log("cancalBet:"+JSON.stringify(json));
            if(success&&json.code==200){
                var data=json.data;
                self._cancelBtn.setVisible(data.cancel_button==1);
                self._cancelBtn.setCountdown(data.cancel_countdown);
                self._cdBetBgSprite.setVisible(data.cancel_button!=1);
            }else{
                var popup=th.PopupLayer.create(json.message,"确定",function(){});
                self.addChild(popup,999);
            }
        })
    },
    bet:function(target){


        // cc.audioEngine.playEffect(res.mp3_click);
        var self=target.getParent();
        var chipi=self._chipi;   //选中筹码的编号
        var amt=self._amt;       //选中筹码的金额
        var zone=target.getTag();   //下注那一区
        var pos=target.getPosition();   //下注区的中心位置

        if(self._isShowBetInfo){
            return;
        }
        self._isShowBetInfo=true;

        /*
        var startPos=self._chipBtns[chipi].getPosition();
        var offsetX=((target.width-60)/2-Math.random()*(target.width-60));
        var offsetY=((target.height-60)/2-Math.random()*(target.height-60));
        var endPos=cc.p(pos.x+offsetX,pos.y+offsetY);

        var chipSprite=new ChipSprite(chipi,amt);
        chipSprite.setPosition(startPos);
        self.addChild(chipSprite,3);
        chipSprite.runAction(cc.moveTo(0.25,endPos));
        */

        var url=GC.URL+"room/onBet?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&zone="+zone+"&bet_balance="+amt;
        th.Http.inst().get(url,function(success,json){
            cc.log("bet:"+JSON.stringify(json));
            self._isShowBetInfo=false;
            if(success&&json.code==200){

                var data=json.data;

                self._cancelBtn.setVisible(data.cancel_button==1);
                self._cancelBtn.setCountdown(data.cancel_countdown);
                self._cdBetBgSprite.setVisible(data.cancel_button!=1);

                /*
                var chipSprite=new ChipSprite(chipi,amt);
                chipSprite.setPosition(startPos);
                self.addChild(chipSprite,3);
                chipSprite.runAction(cc.moveTo(0.25,endPos));
                */

            }else{
                //self._isShowBetInfo=true;
                var popup=th.PopupLayer.create(json.message,"确定",function(){
                    //self._isShowBetInfo=false;
                });
                self.addChild(popup,999);
            }

        })


    },
    updateBetZone:function(data) {
        /*for (var i = 0; i < data.zoneDetail.length; i++) {
            var obj = data.zoneDetail[i];

            var zoneBtn = this._zoneBtns[obj.zone];
            zoneBtn.setBetAmount(obj.all_balance);

        }*/
        cc.audioEngine.playEffect(res.mp3_chip_bet);
        var isMe=data.is_me==1?true:false;
        for (var i = 0; i < data.coinList.length; i++) {
            var betData=data.coinList[i];
            var zone=betData.zone;
            var amt=betData.balance;

            // var zoneBet=GC.BET_DATA.zoneDetail.find(n=>n.zone==zone);
            var zoneBet;
            for(var aa = 0; aa < GC.BET_DATA.zoneDetail.length; aa ++)
            {
                if(GC.BET_DATA.zoneDetail[aa].zone == zone)
                {
                    zoneBet = GC.BET_DATA.zoneDetail[aa];
                    break;
                }
            }

            zoneBet.all_balance=zoneBet.all_balance+amt;
            zoneBet.single_balance=zoneBet.single_balance+(isMe?amt:0);

            var zoneBtn = this._zoneBtns[zone];
            zoneBtn.setBetAmount(zoneBet.all_balance,zoneBet.single_balance);

            GC.BET_TOTAL=GC.BET_TOTAL+amt;

            if(amt>0){
                //下注
                // var imgi=this._chipCoins.findIndex(n=>n==amt);
                var imgi;
                for(var aa = 0; aa < this._chipCoins.length; aa ++)
                {
                    if(this._chipCoins[aa] == amt)
                    {
                        imgi = aa;
                        break;
                    }
                }
                var startPos= isMe?this._chipBtns[imgi].getPosition():this._wanjiaListBtn.getPosition();
                var chipSprite=new ChipSprite(imgi,amt);
                chipSprite.setPosition(startPos);
                this.addChild(chipSprite,3);
                chipSprite.runTo(0,0.75,this.getPosByZoneBtn(zoneBtn),false);
                this._chips[zone][this._chips[zone].length]=chipSprite;
            }else{
                //取消下注
                var chips=this._chips[zone];
                for(var j=0;j<chips.length;j++){
                    var chip=chips[j];
                    var chipAmt=parseInt(chip.getTag());
                    if(Math.abs(amt)==chipAmt){
                        // var imgi=this._chipCoins.findIndex(n=>n==Math.abs(amt));

                        var imgi;
                        for(var x = 0; x < this._chipCoins.length; x ++)
                        {
                            if(this._chipCoins[x] == Math.abs(amt))
                            {
                                imgi = x;
                                break;
                            }
                        }
                        var endPos= isMe?this._chipBtns[imgi].getPosition():this._wanjiaListBtn.getPosition();
                        chip.runTo(0,0.75,endPos,true);
                        this._chips[zone].splice(j,1);
                        break;
                    }
                }
            }

        }
        this._totalChipsLabel.setString("总额"+GC.BET_TOTAL);

    },
    getPosByZoneBtn:function(zoneBtn){
        var pos=zoneBtn.getPosition();
        var offsetX=((zoneBtn.width-60)/2-Math.random()*(zoneBtn.width-60));
        var offsetY=((zoneBtn.height-60)/2-Math.random()*(zoneBtn.height-60));
        var endPos=cc.p(pos.x+offsetX,pos.y+offsetY);
        return endPos;
    },
    onEnter:function(){
        this._super();
        //初始化房间状态
        var cd=this._roomData.countdownInfo;
        this.setCountdown(this._groupType,cd.status,cd.countdown,cd.start_countdown,cd.fp_countdown);
        //this.setCountdown()
        /*this.setCountdown(this._groupType,
            GC.GAME_MAP[this._groupType].status,
            GC.GAME_MAP[this._groupType].countdown,
            GC.GAME_MAP[this._groupType].start_countdown,
            GC.GAME_MAP[this._groupType].fp_countdown
        );*/

        this.setBalance(GC.BALANCE);

        //初始化已经下注信息
        this.initBetChip(GC.BET_DATA);
        //更新庄家列表
        this.updateBankerList(GC.BANKER_DATA);
        //this.updateBankInfo(GC.BANKER_DATA);
        //取消下注按钮
        var cancelInfo=this._roomData.cancelInfo;

        if(cancelInfo.cancel_button==1){
            this._cancelBtn.setVisible(true);
            this._cancelBtn.setCountdown(cancelInfo.cancel_countdown);
            this._cdBetBgSprite.setVisible(false);
        }

        if(cd.status==2&&cd.fp_countdown==0){
            this._animateLayer.startRun();
            this._cdStartBgSprite.setVisible(false);
            this.isShowBankerList(false);
        }


    },
    initBetChip:function(data){
        GC.BET_TOTAL=0;
        if(!data.zoneDetail){
            return;
        }
        for (var i = 0; i < data.zoneDetail.length; i++) {
            var obj = data.zoneDetail[i];

            var zoneBtn = this._zoneBtns[obj.zone];
            zoneBtn.setBetAmount(obj.all_balance,obj.single_balance);

            for(var j=0;j<obj.coinDetail.length;j++){
                var amt=obj.coinDetail[j];
                // var imgi=this._chipCoins.findIndex(n=>n==amt);

                var imgi;
                for(var aa = 0; aa < this._chipCoins.length; aa ++)
                {
                    if(this._chipCoins[aa] == amt)
                    {
                        imgi = aa;
                        break;
                    }
                }

                var chipSprite=new ChipSprite(imgi,amt);
                chipSprite.setPosition(this.getPosByZoneBtn(zoneBtn));
                this.addChild(chipSprite,3);

                this._chips[obj.zone][j]=chipSprite;

                GC.BET_TOTAL=GC.BET_TOTAL+amt;
            }

        }

        this._totalChipsLabel.setString("总额"+GC.BET_TOTAL);
    },
    updateBankerList:function(data){
        var self=this;

        this._shangzhuangBtn.setVisible(data.host_button==1);
        this._xiazhuangBtn.setVisible(data.host_button==2);
        this._bankerListLayer.updateBankerList(data);

        //如果有人上庄
        if(data.current_host!=null){
            var bank=data.current_host;
            var bankZone=bank.host_zone;

            this._diceAnimateLayer.runTo(bankZone);
            this.scheduleOnce(function(){
                for(var i=1;i<self._zoneBtns.length;i++){
                    var zoneBtn=self._zoneBtns[i];
                    var zone=zoneBtn.getTag();
                    zoneBtn.hasBanker(bankZone==zone);
                }
            },2);
        }else{
            for(var i=1;i<this._zoneBtns.length;i++){
                var zoneBtn=this._zoneBtns[i];
                zoneBtn.hasBanker(false);
            }
        }
    },
    showBankUser:function(show){
        var data=GC.BANKER_DATA;
        if(data&&data.current_host){
            this._bankerUserLayer.setVisible(show);
            this._bankerUserLayer.updateBankInfo(data.current_host.nickname,data.current_host.host_balance)
        }else{
            this._bankerUserLayer.setVisible(false);
        }
    },
    reset:function(){
        if (cc.sys.isObjectValid(this._resultAnimationLayer)) {//对象有效
            this._resultAnimationLayer.removeFromParent();
            this._resultAnimationLayer=null;
        }
        GC.BET_TOTAL=0;
        //下注总额重置
        for(var i=0;i<GC.BET_DATA.zoneDetail.length;i++){
            var zoneDetail=GC.BET_DATA.zoneDetail[i];
            zoneDetail.all_balance=0;
            zoneDetail.single_balance=0;
            zoneDetail.coinDetail=[];
        }
        //总额
        this._totalChipsLabel.setString("总额0");
        //动画重置
        this._animateLayer.reset();
        //按钮重置
        for(var i=1;i<this._zoneBtns.length;i++){
            var zoneBtn=this._zoneBtns[i];
            zoneBtn.reset();
        }
        //删除所有筹码
        for(var i=0;i<this._chips.length;i++){
            for(var j=0;j<this._chips[i].length;j++){
                this._chips[i][j].removeFromParent();
            }
        }
        this._chips=[[],[],[],[],[],[]];

    }



});

