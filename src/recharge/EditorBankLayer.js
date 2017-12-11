/**
 * Created by lyf on 2017/7/19.
 * 编辑银行卡、
 */
var G_EDITORBANKLAYER;
var EditorBankLayer = cc.Layer.extend({
    _mobileNumBox:null,
    _passwordBox:null,
    _passwordConfirmBox:null,
    _bankList:null,
    _shijianBg:null,
    _zhongguoBank:null,
    _bankData:null,
    ctor:function (bankData) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var self = this;
        G_EDITORBANKLAYER = this;
        this._bankList = ["中国建设银行", "中国农业银行", "中国银行", "中国工商银行", "兴业银行", "中信银行",
            "招商银行","中国光大银行", "中国邮政储蓄银行", "深圳发展银行", "平安银行", "浦发银行", "华夏银行",
            "中国民生银行", "交通银行", "广发银行|CGB", "上海浦东发展银行", "城市商业银行",
            "农村商业银行", "恒丰银行", "渤海银行"]

        this._bankData = bankData;
        var bankDataArr = String(this._bankData).split("_");

        var bg = new cc.Sprite(res.png_img_rechargeBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var shoukuanren = new cc.LabelTTF("我的银行卡","微软雅黑", 35);
        shoukuanren.setNormalizedPosition(0.5, 0.96);
        bg.addChild(shoukuanren);

        var kfBtn = new ccui.Button(res.png_img_lianxikefuBtn);
        kfBtn.setNormalizedPosition(0.9, 0.96);
        bg.addChild(kfBtn);
        kfBtn.addClickEventListener(function () {
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
        })

        var backBtn = new ccui.Button(res.png_btn_back);
        backBtn.setNormalizedPosition(cc.p(0.1,0.96));
        this.addChild(backBtn);
        backBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.87);
        this.addChild(line1);
        this._mobileNumBox = new cc.LabelTTF(bankDataArr[3]+"","微软雅黑", 30);
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H - 140;
        this.addChild(this._mobileNumBox);
        var nameStr = new cc.LabelTTF("真实姓名:","微软雅黑", 30);
        nameStr.x = GC.W / 2-200;
        nameStr.y = GC.H - 140;
        this.addChild(nameStr);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.78);
        this.addChild(line2);

        this._zhongguoBank = new ccui.Button();
        this._zhongguoBank.setTitleText(bankDataArr[2]+"");
        this._zhongguoBank.setTitleFontSize(30);
        this.addChild(this._zhongguoBank);
        this._zhongguoBank.x = GC.W / 2;
        this._zhongguoBank.y = this._mobileNumBox.y - this._mobileNumBox.height - 80;

        var bettingmingxi = new ccui.Button(res.png_img_bettingmingxi);
        bettingmingxi.x = this._zhongguoBank.x + this._zhongguoBank.width / 2 + 200;
        bettingmingxi.y = this._zhongguoBank.y;
        this.addChild(bettingmingxi);

        var bankStr = new cc.LabelTTF("出款银行:","微软雅黑", 30);
        bankStr.x = GC.W / 2-200;
        bankStr.y = this._mobileNumBox.y - this._mobileNumBox.height - 80;
        this.addChild(bankStr);

        var line3 = new cc.Sprite(res.png_btn_enter_wode);
        line3.setNormalizedPosition(0.5, 0.70);
        this.addChild(line3);
        this._passwordBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordBox.x = GC.W / 2+100;
        this._passwordBox.y = this._zhongguoBank.y - this._zhongguoBank.height - 90;
        this._passwordBox.setPlaceHolder("123456*****789");
        this._passwordBox.setPlaceholderFontSize(30);
        this._passwordBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._passwordBox.setName("passwordBox");
        this._passwordBox.setDelegate(this);
        this._passwordBox.setFontSize(28);
        this._passwordBox.setString(bankDataArr[1]+"");
        this.addChild(this._passwordBox);
        var bankNumStr = new cc.LabelTTF("银行卡号:","微软雅黑", 30);
        bankNumStr.x = GC.W / 2-200;
        bankNumStr.y = this._zhongguoBank.y - this._zhongguoBank.height - 90;
        this.addChild(bankNumStr);

        var line4 = new cc.Sprite(res.png_btn_enter_wode);
        line4.setNormalizedPosition(0.5, 0.62);
        this.addChild(line4);
        this._passwordConfirmBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordConfirmBox.x = GC.W / 2+100;
        this._passwordConfirmBox.y = this._passwordBox.y - this._passwordBox.height - 55;
        this._passwordConfirmBox.setPlaceHolder("支行");
        this._passwordConfirmBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._passwordConfirmBox.setPlaceholderFontSize(30);
        this._passwordConfirmBox.setDelegate(this);
        this._passwordConfirmBox.setName("passwordConfirmBox");
        this._passwordConfirmBox.setFontSize(28);
        this._passwordConfirmBox.setString(bankDataArr[4]+"");
        this.addChild(this._passwordConfirmBox);
        var zhihangStr = new cc.LabelTTF("开户支行:","微软雅黑", 30);
        zhihangStr.x = GC.W / 2-200;
        zhihangStr.y = this._passwordBox.y - this._passwordBox.height - 55;
        this.addChild(zhihangStr);

        var tishi = new cc.LabelTTF("为了保障你的资金安全,请准确填写您的出款银行资料,以免"+"\n"+"提款失败造成出款延误,谢谢!","微软雅黑", 25);
        tishi.x = GC.W / 2;
        tishi.y = this._passwordConfirmBox.y - this._passwordConfirmBox.height - 60;
        tishi.setColor(cc.color(255,255,0,0));
        this.addChild(tishi);

        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.5, 0.42);
        yesBtn.setTitleText("提交");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(G_EDITORBANKLAYER._passwordBox.getString() != "" &&
                G_EDITORBANKLAYER._zhongguoBank.getTitleText() != "" &&
                G_EDITORBANKLAYER._mobileNumBox.getString() != "" &&
                G_EDITORBANKLAYER._passwordConfirmBox.getString() != ""
            )
            {
                var reqUrl = GC.URL + "user/editBankCard?"
                    + "bank_id="+bankDataArr[0]+""
                    + "&account_number="+G_EDITORBANKLAYER._passwordBox.getString()
                    + "&bank_name="+G_EDITORBANKLAYER._zhongguoBank.getTitleText()
                    + "&branch_bank="+G_EDITORBANKLAYER._passwordConfirmBox.getString()
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(encodeURI(reqUrl),function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer("银行卡编辑成功","确定",function(){
                            G_EDITORBANKLAYER.close();
                            var reqUrl = GC.URL + "user/getBankList?"
                                + "&client_id="+GC.CLIENT_ID
                                + "&token="+GC.TOKEN;
                            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                                if(isSuccess && data.code == "200")
                                {
                                    if(G_ADDBANKCARDLAYER)
                                        G_ADDBANKCARDLAYER.removeFromParent();

                                    var addBankCardLayer = new AddBankCardLayer(data);
                                    G_ADDBANKCARDLAYER.addChild(addBankCardLayer);
                                }else
                                {
                                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                                    });
                                    self.addChild(chenggong);
                                }
                            })
                        });
                        G_EDITORBANKLAYER.addChild(chenggong);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        G_EDITORBANKLAYER.addChild(chenggong);
                    }
                })
            }else
            {
                var chenggong=new th.PopupLayer("请填写正确的资料","确定",function(){
                });
                G_EDITORBANKLAYER.addChild(chenggong);
            }
        });
        this.addChild(yesBtn);

        var noBtn = new ccui.Button(res.png_btn_cancel,res.png_btn_cancel);
        noBtn.setNormalizedPosition(0.5, 0.32);
        noBtn.setTitleText("重设");
        noBtn.setTitleColor(cc.color(17,28,67));
        noBtn.setTitleFontSize(30);
        noBtn.setPressedActionEnabled(true);
        noBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            G_EDITORBANKLAYER._mobileNumBox.setString("");
            G_EDITORBANKLAYER._passwordBox.setString("");
            G_EDITORBANKLAYER._passwordConfirmBox.setString("");
        });
        this.addChild(noBtn);

        this._shijianBg = new ccui.Button(res.png_img_bettingSJ_bg);
        this._shijianBg.setPosition(cc.p(GC.W/2,this._mobileNumBox.y - this._mobileNumBox.height - 300));
        this._shijianBg.setPressedActionEnabled(true);
        this._shijianBg.setZoomScale(0);
        this.addChild(this._shijianBg);
        this._shijianBg.visible = false;

        this.initUserListView();
        this._betListTableView.reloadData();

        this._zhongguoBank.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._shijianBg.visible = !self._shijianBg.visible;
        })
        bettingmingxi.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._shijianBg.visible = !self._shijianBg.visible;
        })
        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(380, 430));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(0,0));
        this._shijianBg.addChild(this._betListTableView);
        this._betListTableView.reloadData();
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {
        G_EDITORBANKLAYER._zhongguoBank.setTitleText(cell.getChildByTag(1).getName());
        G_EDITORBANKLAYER._shijianBg.visible = !G_EDITORBANKLAYER._shijianBg.visible;
        // this._callback(cell.getChildByTag(1).getName());
    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(190, 50);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var cell = table.dequeueCell();
        var bianhao;
        if (!cell) {
            cell = new cc.TableViewCell();
            bianhao = new cc.LabelTTF(G_EDITORBANKLAYER._bankList[G_EDITORBANKLAYER._bankList.length - 1- idx]+"","微软雅黑", 30);
            bianhao.setTag(1);
            bianhao.setColor(cc.color(66,66,66,0));
            bianhao.setPosition(cc.p(180,25));
            bianhao.setName(G_EDITORBANKLAYER._bankList[G_EDITORBANKLAYER._bankList.length - 1-idx]+"");
            cell.addChild(bianhao);

            var sp = new cc.Sprite(res.png_img_gengduoBtn);
            sp.setPosition(cc.p(sp.width/2,40));
            cell.addChild(sp);
        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setString(G_EDITORBANKLAYER._bankList[G_EDITORBANKLAYER._bankList.length - 1-idx]+"");
            bianhao.setName(G_EDITORBANKLAYER._bankList[G_EDITORBANKLAYER._bankList.length - 1-idx]+"");
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return G_EDITORBANKLAYER._bankList.length;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EDITORBANKLAYER,res.png_img_tishikuang,"请填写真确姓名");
                    // G_EDITORBANKLAYER._mobileNumBox.setString("");
                }
                break;
            case"passwordBox":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {
                }else
                {
                    var alertStr = new th.AlertLayer(G_EDITORBANKLAYER,res.png_img_tishikuang,"请填写正确卡号");
                    // G_EDITORBANKLAYER._passwordBox.setString("");
                }
                break;
            case"passwordConfirmBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {
                }else
                {
                    var alertStr = new th.AlertLayer(G_EDITORBANKLAYER,res.png_img_tishikuang,"请填写正确的开户支行");
                    // G_EDITORBANKLAYER._passwordConfirmBox.setString("");
                }
                break;
        }
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