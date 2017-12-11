/**
 * Created by lyf on 2017/7/16.
 *  银联充值
 */
var G_RECHARGELAYER;
var RechargeLayer = cc.Layer.extend({
    _rechargeData:null,
    _money:null,
    _bank:null,
    _bank_n_box:null,
    _bank_k_box:null,
    _bankList:null,
    _shijianBg:null,
    _zhongguoBank:null,
    ctor:function (rechargeData,money) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        GC.IS_RECHARGE = true;

        var self = this;
        G_RECHARGELAYER = this;
        this._rechargeData = rechargeData;
        this._money = money;

        this._bankList = ["中国建设银行", "中国农业银行", "中国银行", "中国工商银行", "兴业银行", "中信银行",
            "招商银行","中国光大银行", "中国邮政储蓄银行", "深圳发展银行", "平安银行", "浦发银行", "华夏银行",
            "中国民生银行", "交通银行", "广发银行|CGB", "上海浦东发展银行", "城市商业银行",
            "农村商业银行", "恒丰银行", "渤海银行"];

        var bg = new cc.Sprite(res.png_img_rechargeBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var shoukuanren = new cc.LabelTTF("充值","微软雅黑", 35);
        shoukuanren.setNormalizedPosition(0.5, 0.96);
        bg.addChild(shoukuanren);

        var backBtn = new ccui.Button(res.png_btn_back);
        backBtn.setNormalizedPosition(cc.p(0.1,0.96));
        this.addChild(backBtn);
        backBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var shoukuanren = new cc.LabelTTF("收款人信息:","微软雅黑", 30);
        shoukuanren.setNormalizedPosition(0.15, 0.9);
        bg.addChild(shoukuanren);

        // var bank_name = new cc.LabelTTF(this._rechargeData.data.bank_name+"","微软雅黑", 30);
        // bank_name.setNormalizedPosition(0.05, 0.86);
        // bank_name.setAnchorPoint(cc.p(0,0.5));
        // bg.addChild(bank_name);

        var bank_name = new cc.EditBox(cc.size(200, 50), new cc.Scale9Sprite(res.png_bg_input));
        bank_name.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        bank_name.setPlaceholderFontSize(30);
        bank_name.setDelegate(this);
        bank_name.setFontSize(30);
        bank_name.setString(this._rechargeData.data.bank_name+"");
        bank_name.x = 140;
        bank_name.y = GC.H - 185;
        this.addChild(bank_name);

        // var real_name = new cc.LabelTTF(this._rechargeData.data.real_name+"","微软雅黑", 30);
        // real_name.setNormalizedPosition(0.4, 0.86);
        // real_name.setAnchorPoint(cc.p(0,0.5));
        // bg.addChild(real_name);

        var real_name = new cc.EditBox(cc.size(200, 50), new cc.Scale9Sprite(res.png_bg_input));
        real_name.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        real_name.setPlaceholderFontSize(30);
        real_name.setDelegate(this);
        real_name.setFontSize(30);
        real_name.setString(this._rechargeData.data.real_name+"");
        real_name.x = 540;
        real_name.y = GC.H - 185;
        this.addChild(real_name);

        // var account_number = new cc.LabelTTF(this._rechargeData.data.account_number+"","微软雅黑", 30);
        // account_number.setNormalizedPosition(0.05, 0.82);
        // account_number.setAnchorPoint(cc.p(0,0.5));
        // bg.addChild(account_number);

        var account_number = new cc.EditBox(cc.size(400, 50), new cc.Scale9Sprite(res.png_bg_input));
        account_number.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        account_number.setPlaceholderFontSize(30);
        account_number.setDelegate(this);
        account_number.setFontSize(30);
        account_number.setString(this._rechargeData.data.account_number+"");
        account_number.x = 245;
        account_number.y = GC.H - 245;
        this.addChild(account_number);

        // var branch_bank = new cc.LabelTTF(this._rechargeData.data.branch_bank+"","微软雅黑", 30);
        // branch_bank.setNormalizedPosition(0.05, 0.78);
        // branch_bank.setAnchorPoint(cc.p(0,0.5));
        // bg.addChild(branch_bank);

        var branch_bank = new cc.EditBox(cc.size(400, 50), new cc.Scale9Sprite(res.png_bg_input));
        branch_bank.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        branch_bank.setPlaceholderFontSize(30);
        branch_bank.setDelegate(this);
        branch_bank.setFontSize(30);
        branch_bank.setString(this._rechargeData.data.branch_bank+"");
        branch_bank.x = 245;
        branch_bank.y = GC.H - 300;
        this.addChild(branch_bank);

        var branch_bank = new cc.LabelTTF("注意:提交以下完整存款人信息后，需要到网银"+"\n"+"或手机银行转账相同金额到此号完成充值!","微软雅黑", 35);
        branch_bank.setNormalizedPosition(0.03, 0.7);
        branch_bank.setAnchorPoint(cc.p(0,0.5));
        branch_bank.setFontFillColor(cc.color(255,255,0,0))
        bg.addChild(branch_bank);

        var zhongjian = new cc.Sprite(res.png_img_chongzhizhongjian);
        zhongjian.setNormalizedPosition(0.5, 0.6);
        bg.addChild(zhongjian);

        var cunkuanren = new cc.LabelTTF("存款人信息:","微软雅黑", 30);
        cunkuanren.setNormalizedPosition(0.05, 0.5);
        cunkuanren.setAnchorPoint(cc.p(0,0.5));
        zhongjian.addChild(cunkuanren);

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.5);
        this.addChild(line1);
        var bank_s = new cc.LabelTTF("所属银行:","微软雅黑", 30);
        bank_s.setNormalizedPosition(0.12, 0.52);
        bank_s.setAnchorPoint(cc.p(0,0.5));
        this.addChild(bank_s);

        // this._bank = new cc.EditBox(cc.size(400, 50), new cc.Scale9Sprite(res.png_bg_input));
        // this._bank.x = GC.W / 2+80;
        // this._bank.y = GC.H / 2 + 30;
        // this._bank.setName("bank");
        // this._bank.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        // this._bank.setPlaceHolder("所属银行");
        // this._bank.setPlaceholderFontSize(30);
        // this._bank.setDelegate(this);
        // this._bank.setFontSize(30);
        // this.addChild(this._bank);
        // this._bank.visible = false;

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.41);
        this.addChild(line2);
        var bank_n = new cc.LabelTTF("银行户名:","微软雅黑", 30);
        bank_n.setNormalizedPosition(0.12, 0.43);
        bank_n.setAnchorPoint(cc.p(0,0.5));
        this.addChild(bank_n);
        this._bank_n_box = new cc.EditBox(cc.size(400, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._bank_n_box.x = GC.W / 2+80;
        this._bank_n_box.y = GC.H / 2 + 30 - 125;
        if(this._rechargeData.data.my_bank_name != "")
        {
            // this._bank_n_box.setPlaceHolder(this._rechargeData.data.my_bank_name + "");
            this._bank_n_box.setString(this._rechargeData.data.my_bank_name + "");
        }else
        {
            this._bank_n_box.setPlaceHolder("银行户名");
        }
        this._bank_n_box.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._bank_n_box.setName("bank_n_box");
        this._bank_n_box.setPlaceholderFontSize(30);
        this._bank_n_box.setDelegate(this);
        this._bank_n_box.setFontSize(30);

        this.addChild(this._bank_n_box);

        var line3 = new cc.Sprite(res.png_btn_enter_wode);
        line3.setNormalizedPosition(0.5, 0.32);
        this.addChild(line3);
        var bank_k = new cc.LabelTTF("银行卡号:","微软雅黑", 30);
        bank_k.setNormalizedPosition(0.12, 0.34);
        bank_k.setAnchorPoint(cc.p(0,0.5));
        this.addChild(bank_k);
        this._bank_k_box = new cc.EditBox(cc.size(400, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._bank_k_box.x = GC.W / 2+80;
        this._bank_k_box.y = GC.H / 2 + 30 - (120*2);
        if(this._rechargeData.data.my_account_number != "")
        {
            // this._bank_k_box.setPlaceHolder(this._rechargeData.data.my_account_number +"");
            this._bank_k_box.setString(this._rechargeData.data.my_account_number +"");
        }else
        {
            this._bank_k_box.setPlaceHolder("银行卡号");
        }
        this._bank_k_box.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._bank_k_box.setName("bank_k_box");
        this._bank_k_box.setPlaceholderFontSize(30);
        this._bank_k_box.setDelegate(this);
        this._bank_k_box.setFontSize(30);
        this.addChild(this._bank_k_box);

        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.5, 0.1);
        yesBtn.setTitleText("确定");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
            var patrn1=/^[0-9]+$/;
            if((self._zhongguoBank.getTitleText() != "")&&
                (self._bank_n_box.getString() != "")&&
                (self._bank_k_box.getString() != "")
                ){
                var reqUrl = GC.URL + "user/recharge?"
                    + "recharge_cash="+self._money
                    + "&account_number="+self._bank_k_box.getString()
                    + "&bank_name="+self._zhongguoBank.getTitleText()
                    + "&real_name="+self._bank_n_box.getString()
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(encodeURI(reqUrl),function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                            self.close();
                            if(G_RECHARGEMESSAGELAYER)
                                G_RECHARGEMESSAGELAYER.removeFromParent();
                        });
                        self.addChild(chenggong);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            }else
            {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请填写正确充值信息");
            }
        });
        this.addChild(yesBtn);

        this._zhongguoBank = new ccui.Button();
        if(this._rechargeData.data.my_bank_name != "")
        {
            this._zhongguoBank.setTitleText(this._rechargeData.data.my_bank_name+"");
            this._zhongguoBank.setTitleText(this._rechargeData.data.my_bank_name+"");
        }else
        {
            this._zhongguoBank.setTitleText("中国银行");
        }
        this._zhongguoBank.setTitleFontSize(30);
        this.addChild(this._zhongguoBank);
        this._zhongguoBank.x = GC.W / 2-30;
        this._zhongguoBank.y = GC.H / 2 + 30;

        this._shijianBg = new ccui.Button(res.png_img_bettingSJ_bg);
        this._shijianBg.setPosition(cc.p(GC.W / 2,GC.H / 3));
        this._shijianBg.setPressedActionEnabled(true);
        this._shijianBg.setZoomScale(0);
        this.addChild(this._shijianBg);
        this._shijianBg.visible = false;

        this.initUserListView();
        this._betListTableView.reloadData();

        var bettingmingxi = new ccui.Button(res.png_img_bettingmingxi);
        bettingmingxi.x = GC.W / 2+150;
        bettingmingxi.y = GC.H / 2 + 30;
        this.addChild(bettingmingxi);

        this._zhongguoBank.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._shijianBg.visible = !self._shijianBg.visible;
        })
        bettingmingxi.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._shijianBg.visible = !self._shijianBg.visible;
        })

        var tips = new cc.LabelTTF(this._rechargeData.data.tip+"","微软雅黑", 30);
        tips.setNormalizedPosition(0.5, 0.25);
        tips.setFontFillColor(cc.color(255,255,0,0));
        this.addChild(tips);

        // GC.RECHARGE_DATA._BANK_NAME = G_RECHARGELAYER._zhongguoBank.getTitleText();
        // GC.RECHARGE_DATA._BANK_USERNAME = G_RECHARGELAYER._bank_n_box.getString();
        // GC.RECHARGE_DATA._BANK_NUMBER = G_RECHARGELAYER._bank_k_box.getString();
        // cc.log("*******555555555555****",GC.RECHARGE_DATA);
        if(GC.RECHARGE_DATA._BANK_NAME)
        {
            this._zhongguoBank.setTitleText(GC.RECHARGE_DATA._BANK_NAME+"");
        }
        if(GC.RECHARGE_DATA._BANK_USERNAME)
        {
            this._bank_n_box.setString(GC.RECHARGE_DATA._BANK_USERNAME+"");
        }
        if(GC.RECHARGE_DATA._BANK_NUMBER)
        {
            this._bank_k_box.setString(GC.RECHARGE_DATA._BANK_NUMBER+"");
        }

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
        G_RECHARGELAYER._zhongguoBank.setTitleText(cell.getChildByTag(1).getName());
        G_RECHARGELAYER._shijianBg.visible = !G_RECHARGELAYER._shijianBg.visible;
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
            bianhao = new cc.LabelTTF(G_RECHARGELAYER._bankList[G_RECHARGELAYER._bankList.length - 1- idx]+"","微软雅黑", 30);
            bianhao.setTag(1);
            bianhao.setColor(cc.color(66,66,66,0));
            bianhao.setPosition(cc.p(180,25));
            bianhao.setName(G_RECHARGELAYER._bankList[G_RECHARGELAYER._bankList.length - 1-idx]+"");
            cell.addChild(bianhao);

            var sp = new cc.Sprite(res.png_img_gengduoBtn);
            sp.setPosition(cc.p(sp.width/2,40));
            cell.addChild(sp);
        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setString(G_RECHARGELAYER._bankList[G_RECHARGELAYER._bankList.length - 1-idx]+"");
            bianhao.setName(G_RECHARGELAYER._bankList[G_RECHARGELAYER._bankList.length - 1-idx]+"");
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return G_RECHARGELAYER._bankList.length;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"bank":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                    GC.RECHARGE_DATA._BANK_NAME = G_RECHARGELAYER._zhongguoBank.getTitleText();

                }else
                {
                    var alertStr = new th.AlertLayer(G_RECHARGELAYER,res.png_img_tishikuang,"请输入正确所属银行");
                    // G_RECHARGELAYER._bank.setString("");
                }
                break;
            case"bank_n_box":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {
                    GC.RECHARGE_DATA._BANK_USERNAME = G_RECHARGELAYER._bank_n_box.getString();

                }else
                {
                    var alertStr = new th.AlertLayer(G_RECHARGELAYER,res.png_img_tishikuang,"请输入正确银行户名");
                    // G_RECHARGELAYER._bank_n_box.setString("");
                }
                break;
            case"bank_k_box":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()))
                {
                    GC.RECHARGE_DATA._BANK_NUMBER = G_RECHARGELAYER._bank_k_box.getString();
                }else
                {
                    var alertStr = new th.AlertLayer(G_RECHARGELAYER,res.png_img_tishikuang,"请输入正确银行卡号");
                    // G_RECHARGELAYER._bank_k_box.setString("");
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
        GC.IS_RECHARGE = false;
        GC.RECHARGE_DATA = {};
        GC.RECHARGE = null;
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});
