/**
 * Created by lyf on 2017/6/27.
 * 筹码按钮
 */
var Chiputton=ccui.Button.extend({
    _chipLabel:null,
    ctor:function (img,amt) {
        this._super(img);

        var money=parseInt(amt);
        var text=money+"";
        if(money>=1000&&money<10000){
            text=parseInt(money/1000)+"千"
        }else if(money>=10000){
            text=parseInt(money/10000)+"万"
        }

        this._chipLabel =new cc.LabelBMFont(text, res.fnt_chip_num);
        this._chipLabel.setNormalizedPosition(0.5,0.52);
        this.addChild(this._chipLabel);

        this.setPressedActionEnabled(true);
        return true;

    },
    _onPressStateChangedToPressed:function(){
        if (this._pressedTextureLoaded) {
            this._chipLabel.stopAllActions();
            this._chipLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));
        }else{
            this._chipLabel.stopAllActions();
            this._chipLabel.setScale(1 + this._zoomScale);
        }
        this._super();
    },
    _onPressStateChangedToNormal:function(){
        if(this._chipLabel){
            this._chipLabel.stopAllActions();
            this._chipLabel.setScale(1);
        }
        this._super();
    }

});



