/**
 * Created by lyf on 2017/6/24.
 */
var ChipSprite=cc.Sprite.extend({
    ctor:function (i,amt) {

        var chips=[res.png_btn_chips1_s,res.png_btn_chips2_s,res.png_btn_chips3_s,res.png_btn_chips4_s,res.png_btn_chips5_s];
        this._super(chips[i]);
        this.setTag(amt);

        var money=parseInt(amt);
        var text=money+"";
        if(money>=1000&&money<10000){
            text=parseInt(money/1000)+"千"
        }else if(money>=10000){
            text=parseInt(money/10000)+"万"
        }

        var amtLabel = new cc.LabelBMFont(text,res.fnt_chip_num);
        amtLabel.setNormalizedPosition(0.5, 0.52);
        amtLabel.setScale(0.5);
        this.addChild(amtLabel);


    },
    runTo:function(d,t,pos,isRemove){


        this.stopAllActions();

        var moveTo=cc.moveTo(t,pos).easing(cc.easeExponentialOut());
        var actions=cc.sequence(cc.delayTime(d),moveTo,cc.callFunc(function(){
             if(isRemove){
                 this.removeFromParent();
             }
        },this));
        this.runAction(actions);
    }
});


ChipSprite.create=function(i,amt){
    return  new ChipSprite(i,amt);
};


