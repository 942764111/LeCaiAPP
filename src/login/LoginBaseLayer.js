/**
 * Created by lyf on 2017/6/28.
 */
var LoginBaseLayer = cc.Layer.extend({
    _listener:null,
    ctor: function (user_name,verify_code) {
        this._super();
        this._listener= cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(){return true},
        });
        cc.eventManager.addListener(this._listener,this);
        return true;
    },
    onEnter:function(){
        this._super();

        this.setPositionX(-GC.W);
        var moveTo=cc.moveTo(0.25,cc.p(0,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    },
    onExit:function(){
        this._super();
    },
    onQuit:function () {
        var self=this;
        var moveTo=cc.moveTo(0.25,cc.p(-GC.W,this.getPositionY()));
        this.runAction(cc.sequence(moveTo.easing(cc.easeExponentialOut()),cc.callFunc(function(){
            self.removeFromParent();
        },this)));
    }
});
