var th = th || {};

th.AlertLayer = cc.Layer.extend({
    _bgSprite:null,
    _msgLabel:null,
    _target:null,
    ctor: function (target,backgroundImage,message) {
        this._super();

        this._target=target;

        this._msgLabel = cc.LabelTTF.create(message, "Arial",30);
        this._msgLabel.setNormalizedPosition(cc.p(0.5,0.5));

        this._bgSprite=cc.Scale9Sprite.create(backgroundImage);
        this._bgSprite.width=Math.max(this._bgSprite.width,this._msgLabel.width+80);
        this._bgSprite.height=this._msgLabel.height+40;
        this._bgSprite.x = cc.winSize.width / 2;
        this._bgSprite.y = cc.winSize.height / 2;
        this.addChild(this._bgSprite);
        this._bgSprite.addChild(this._msgLabel);
        this._target.addChild(this,9999);
        return true;
    },
    onEnter:function(){
        this._super();
        //this.setPositionY(cc.winSize.height / 2 *-1-this._bgSprite.getBoundingBox().height);
        this.setPositionY(cc.winSize.height / 2 *+this._bgSprite.getBoundingBox().height);
        //var moveTo = cc.moveTo(1.0, cc.p(0, cc.winSize.height / 2*-1+200));
        var moveTo = cc.moveTo(1.0, cc.p(0, 400));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
        this.scheduleOnce(this.close,3.0);
    },
    close:function(){
        //var moveTo = cc.moveTo(0.8, cc.p(0, cc.winSize.height / 2 *-1-this._bgSprite.getBoundingBox().height));
        var moveTo = cc.moveTo(0.8, cc.p(0, cc.winSize.height / 2 +this._bgSprite.getBoundingBox().height));
        this.runAction(cc.sequence(moveTo.easing(cc.easeExponentialOut()), cc.callFunc(function (event) {
            this.removeFromParent();
        }, this)));
    }

});

th.AlertLayer.create=function (target,backgroundImage,message) {
    return new th.AlertLayer(target,backgroundImage,message);
};
