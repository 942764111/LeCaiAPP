/**
 * Created by lyf on 2017/8/14.
 *
 * 当前庄
 */
var BankerUserLayer = cc.Layer.extend({
    _wuzhuangSprite:null,
    _userNameStr:null,
    _bankerMoneyStr:null,
    ctor:function () {
        this._super();
        var self = this;


        // 有庄 则显示
        // 庄图片
        var zhuangImg = new cc.Sprite(res.png_img_wuzhuangImg);
        zhuangImg.setNormalizedPosition(cc.p(0.5,0.8));
        this.addChild(zhuangImg);
        //  当前庄名字
        this._userNameStr = new cc.LabelTTF("--","Arial", 30);
        this._userNameStr.setNormalizedPosition(0.5, 0.758);
        this.addChild(this._userNameStr);

        //  上庄金额
        this._bankerMoneyStr = new cc.LabelTTF("00","Arial", 30);
        this._bankerMoneyStr.setNormalizedPosition(0.5, 0.73);
        this._bankerMoneyStr.setColor(cc.color(255,255,0,0));
        this.addChild(this._bankerMoneyStr);

        this._bankerMoneyStr.setVisible(false);
        return true;
    },
    updateBankInfo:function(name,balance){
        if(name==null||balance==null){
            this._userNameStr.setString("无庄");
            this._bankerMoneyStr.setVisible(false);
        }else{
            this._userNameStr.setString(name);
            this._bankerMoneyStr.setString(formatCurrency(balance));
            this._bankerMoneyStr.setVisible(true);
        }

    }
});