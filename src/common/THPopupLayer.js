var th = th || {};

th.PopupLayer = cc.Layer.extend({
    ctor: function (msg,btnText,callback) {
        this._super();
        var self=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);


        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);

        var bgImg=cc.Sprite.create(res.png_bg_popup);
        bgImg.x=GC.W/2;
        bgImg.y=GC.H/2;
        this.addChild(bgImg);

        var contentLabel = cc.LabelTTF.create(msg, "Arial",36,cc.size(bgImg.width-50,bgImg.height-100));
        contentLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;// 居中
        contentLabel.setNormalizedPosition(0.5, 0.48);
        this.addChild(contentLabel);

        var yesBtn = new ccui.Button(res.png_btn_yes,res.png_btn_yes);
        yesBtn.setNormalizedPosition(0.5, 0.42);
        yesBtn.setTitleText(btnText);
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
            callback();
        });
        this.addChild(yesBtn);


        return true;
    },
    onEnter:function(){
        this._super();
       /*
        this.setPositionY(GC.h);
        var moveTo=cc.moveTo(0.25,cc.p(0,0));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
        */
        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
       /*
        var moveTo=cc.moveTo(0.25,cc.p(0,GC.h));
        this.runAction(cc.sequence( moveTo.easing(cc.easeExponentialOut()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
        */

        //this._layerColor.removeFromParent();

        this._layerColor.runAction(cc.fadeOut(0.1));
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }

});

th.PopupLayer.create=function (msg,btnText,callback) {
    return new th.PopupLayer(msg,btnText,callback);
};
