/**
 * Created by lyf on 2017/7/6.
 * 充值信息
 */
var G_RECHARGEMESSAGELAYER;
var RechargeMessageLayer = cc.Layer.extend({
    playData:null,
    ctor:function (_playData) {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        // GC.IS_WITHDRAWALS = true;

        this.playData = _playData;
        var self = this;
        G_RECHARGEMESSAGELAYER = this;
        var bg = new cc.Sprite(res.png_img_rechargeBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var backBtn = new ccui.Button(res.png_btn_back);
        backBtn.setNormalizedPosition(cc.p(0.1,0.96));
        this.addChild(backBtn);
        backBtn.addClickEventListener(function () {
            // GC.IS_WITHDRAWALS = false;
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var rechargeMess = new cc.LabelTTF("充值信息","微软雅黑", 35);
        rechargeMess.setNormalizedPosition(0.5, 0.96);
        bg.addChild(rechargeMess);

        for(var i = 0 ; i < this.playData.payTypeList.length; i ++)
        {
            var chongzhiBtn = new ccui.Button(res.png_img_rechargeList);
            switch (this.playData.payTypeList[i].pay_type)
            {
                case "alipay":
                    var img = new cc.Sprite(res.png_img_zhifubaoImg);
                    break;
                case "wechat":
                    var img = new cc.Sprite(res.png_img_weixinImg);
                    break;
                case "bank":
                    var img = new cc.Sprite(res.png_img_yinhangkaImg);
                    break;
            }
            chongzhiBtn.setTitleText(this.playData.payTypeList[i].pay_name+"");
            chongzhiBtn.setNormalizedPosition(0.5, 0.85-(i*0.1));
            chongzhiBtn.setTitleFontSize(30);
            chongzhiBtn.setName(this.playData.payTypeList[i].pay_type);
            if(i == 2)
            {
                chongzhiBtn.setNormalizedPosition(0.5, 0.85-(0*0.1));
                this.addChild(chongzhiBtn);
            }

            img.setNormalizedPosition(0.1, 0.5);
            chongzhiBtn.addChild(img);
            chongzhiBtn.addClickEventListener(function (widget, touchType) {
                cc.audioEngine.playEffect(res.mp3_click);
                switch (widget.name)
                {
                    case "alipay":
                        // var alipayRechargeLayer = new AlipayRechargeLayer(self.playData,"确定");
                        // self.addChild(alipayRechargeLayer);
                        break;
                    case "wechat":
                        // var wechatRechargeLayer = new WechatRechargeLayer(self.playData,"确定");
                        // self.addChild(wechatRechargeLayer);
                        break;
                    case "bank":
                        var rechargeDetailsLayer = new RechargeDetailsLayer(self.playData);
                        self.addChild(rechargeDetailsLayer);
                        break;
                }
            })
        }

        // var zhifubao = new ccui.Button(res.png_img_rechargeList);
        // zhifubao.setNormalizedPosition(0.5, 0.85);
        // zhifubao.setTitleText("支付宝充值");
        // zhifubao.setTitleFontSize(30);
        // this.addChild(zhifubao);
        // zhifubao.addClickEventListener(function () {
        //     var alipayRechargeLayer = new AlipayRechargeLayer("","确定");
        //     self.addChild(alipayRechargeLayer);
        // })
        // var zhifubaoImg = new cc.Sprite(res.png_img_zhifubaoImg);
        // zhifubaoImg.setNormalizedPosition(0.1, 0.5);
        // zhifubao.addChild(zhifubaoImg);
        //
        // var weixin = new ccui.Button(res.png_img_rechargeList);
        // weixin.setNormalizedPosition(0.5, 0.75);
        // weixin.setTitleText("微信充值");
        // weixin.setTitleFontSize(30);
        // this.addChild(weixin);
        // weixin.addClickEventListener(function () {
        //     var wechatRechargeLayer = new WechatRechargeLayer("","确定");
        //     self.addChild(wechatRechargeLayer);
        // })
        // var weixinImg = new cc.Sprite(res.png_img_weixinImg);
        // weixinImg.setNormalizedPosition(0.1, 0.5);
        // weixin.addChild(weixinImg);
        //
        // var yinhangka = new ccui.Button(res.png_img_rechargeList);
        // yinhangka.setNormalizedPosition(0.5, 0.65);
        // yinhangka.setTitleText("线下充值");
        // yinhangka.setTitleFontSize(30);
        // yinhangka.addClickEventListener(function () {
        //     var rechargeDetailsLayer = new RechargeDetailsLayer();
        //     self.addChild(rechargeDetailsLayer);
        // })
        // this.addChild(yinhangka);
        // var yinhangkaImg = new cc.Sprite(res.png_img_yinhangkaImg);
        // yinhangkaImg.setNormalizedPosition(0.1, 0.5);
        // yinhangka.addChild(yinhangkaImg);


        return true;
    },
    onEnter:function(){
        this._super();

        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        //this._layerColor.runAction(cc.fadeOut(0.1));
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});
