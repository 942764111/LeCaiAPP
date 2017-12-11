/**
 * Created by lyf on 2017/7/19.
 * 添加银行卡
 */
var G_ADDBANKCARDLAYER;
var AddBankCardLayer = cc.Layer.extend({
    _bankerList:null,
    _bankNumberArr:null,// 所有银行卡集合
    ctor:function (bankerList) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        // GC.IS_RECHARGE = true;

        G_ADDBANKCARDLAYER = this;
        var self = this;
        this._bankNumberArr = [];
        this._bankerList = bankerList;

        var bg = new cc.Sprite(res.png_img_rechargeBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var shoukuanren = new cc.LabelTTF("提现信息","微软雅黑", 35);
        shoukuanren.setNormalizedPosition(0.5, 0.96);
        bg.addChild(shoukuanren);

        var backBtn = new ccui.Button(res.png_btn_back);
        backBtn.setNormalizedPosition(cc.p(0.1,0.96));
        this.addChild(backBtn);
        backBtn.addClickEventListener(function () {
            // GC.IS_RECHARGE = false;
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var xuanzeArr = [];
        for(var i = 0 ; i < this._bankerList.data.bankList.length; i ++)
        {
            var bankImg = new ccui.Button(res.png_img_rechargeList);
            bankImg.setName("xuanzeBtn"+i);
            this.addChild(bankImg);
            bankImg.x = GC.W / 2;
            bankImg.y = 1150-(i*(120));
            var nhLogo = new cc.Sprite(res.png_img_nhLogo);
            nhLogo.setNormalizedPosition(0.16, 0.5);
            bankImg.addChild(nhLogo);

            var yh = new cc.LabelTTF(this._bankerList.data.bankList[i].bank_name+"","微软雅黑", 35);
            yh.setNormalizedPosition(0.28, 0.7);
            yh.setAnchorPoint(cc.p(0,0.5));
            bankImg.addChild(yh);
            var kh = new cc.LabelTTF(this._bankerList.data.bankList[i].account_number+"","微软雅黑", 35);
            kh.setNormalizedPosition(0.28, 0.3);
            kh.setAnchorPoint(cc.p(0,0.5));
            bankImg.addChild(kh);
            this._bankNumberArr.push(this._bankerList.data.bankList[i].bank_id);

            if(this._bankerList.data.bankList[i].is_default == 1)
            {
                var xuanze = new cc.Sprite(res.png_img_xuanhzongImg);
            }else
            {
                var xuanze = new cc.Sprite(res.png_img_xuanzhongNoImg);
                var deleteBtn = new ccui.Button(res.png_img_deleteBtn);
                deleteBtn.setNormalizedPosition(0.85, 0.25);
                deleteBtn.setName("deleteBtn"+this._bankerList.data.bankList[i].bank_id);
                deleteBtn.setScale(1.4);
                bankImg.addChild(deleteBtn);
                deleteBtn.addClickEventListener(function (widget, touchType) {
                    cc.audioEngine.playEffect(res.mp3_click);
                    var popup=th.ConfirmLayer.create("你确定要删除此银行卡?","确定",function(){
                        var bank_id = String(widget.name).substr(9,widget.name.length);
                        var reqUrl = GC.URL + "user/delBankCard?"
                            + "bank_id=" + bank_id
                            + "&client_id="+GC.CLIENT_ID
                            + "&token="+GC.TOKEN;
                        th.Http.inst().get(reqUrl,function (isSuccess, data) {
                            if(isSuccess && data.code == "200")
                            {
                                var chenggong=new th.PopupLayer(data.message,"确定",function(){
                                    self.close();
                                });
                                self.addChild(chenggong);
                            }else
                            {
                                // cc.log(MessageCod[data.code]);
                                var chenggong=new th.PopupLayer(data.message,"确定",function(){
                                });
                                self.addChild(chenggong);
                            }
                        })
                    });
                    self.addChild(popup);
                })

                var bianjiBtn = new ccui.Button(res.png_img_bianjiBtn);
                bianjiBtn.setNormalizedPosition(0.85, 0.75);
                bianjiBtn.setName(
                    this._bankerList.data.bankList[i].bank_id+"_"+
                    this._bankerList.data.bankList[i].account_number+"_"+
                    this._bankerList.data.bankList[i].bank_name+"_"+
                    this._bankerList.data.bankList[i].real_name+"_"+
                    this._bankerList.data.bankList[i].branch_bank
                );
                bianjiBtn.setScale(1.4);
                bankImg.addChild(bianjiBtn);
                bianjiBtn.addClickEventListener(function (widget, touchType) {
                    cc.audioEngine.playEffect(res.mp3_click);
                    var editorBankLayer = new EditorBankLayer(widget.name);
                    self.addChild(editorBankLayer);
                })
            }
            xuanze.setNormalizedPosition(0.05, 0.5);
            xuanze.setName("xuanze"+i);
            bankImg.addChild(xuanze);
            xuanzeArr[i] = xuanze;

            bankImg.addClickEventListener(function (widget, touchType) {
                cc.audioEngine.playEffect(res.mp3_click);
                var bankStr="";
                var str = String(widget.name).substr(9,widget.name.length);
                for(var c = 0 ; c < xuanzeArr.length; c ++)
                {
                    if(str == c)
                    {
                        xuanzeArr[c].setTexture(res.png_img_xuanhzongImg);
                        bankStr = self._bankNumberArr[c];
                    }else
                    {
                        xuanzeArr[c].setTexture(res.png_img_xuanzhongNoImg);
                    }
                }

                var reqUrl = GC.URL + "user/applyCashInfo?"
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                ;
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var withDrawalsLayer = new WithDrawalsLayer(data,bankStr);
                        self.addChild(withDrawalsLayer);
                    }else if(isSuccess && data.code == "3021")
                    {
                        var setPassWordLayer = new SetPassWordLayer();
                        self.addChild(setPassWordLayer);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            })
        }
        var tianjia = new ccui.Button(res.png_img_rechargeList);
        tianjia.x = GC.W / 2;
        tianjia.y = 1150-(this._bankerList.data.bankList.length * 120);
        tianjia.setTitleText("添加银行卡");
        tianjia.setTitleFontSize(35);
        this.addChild(tianjia);
        tianjia.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._bankerList.data.bankList.length <= 0)
            {
                var chenggong=new th.PopupLayer("首次绑定的银行卡以后不能修改。","确定",function(){
                    var selfBankLayer = new SelfBankLayer();
                    self.addChild(selfBankLayer);
                });
                self.addChild(chenggong);
            }else
            {
                var selfBankLayer = new SelfBankLayer();
                self.addChild(selfBankLayer);
            }

        })

        var tianjiaImg = new cc.Sprite(res.png_img_tianjiabankimg);
        tianjiaImg.setNormalizedPosition(cc.p(0.3,0.5));
        tianjia.addChild(tianjiaImg);

        return true;
    },
    onEnter:function(){
        this._super();
        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});