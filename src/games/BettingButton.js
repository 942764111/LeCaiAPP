/**
 * Created by lyf on 2017/6/27.
 * 下注按钮
 */
var BettingButton=ccui.Button.extend({
    //_totalBetLabel:null,
    //_mineBetLabel:null,
    _mineItem:null,
    _totalItem:null,
    _btnchoumaBg:null,
    _winSprite:null,
    _zone:null,
    _betPos:null,
    _callback:null,
    ctor:function (zone,img,winImg,callback,betPos) {
        this._super(img);
        var self=this;
        this._zone=zone;
        this._callback=callback;
        this._betPos=betPos;

        this._winSprite=cc.Sprite.create(winImg);
        this._winSprite.setNormalizedPosition(0.5, 0.5);
        this._winSprite.setVisible(false);// 默认不显示
        this.addChild(this._winSprite);
        this.setZoomScale(0);


        var pos=this.getPosByZone(betPos);


        //查看自己投注按钮
        this._mineItem = new cc.MenuItemLabel(new cc.LabelBMFont("0",res.fnt_yellow_num), function(){
            self._callback(self._zone);
        }, this);
        this._mineItem.setAnchorPoint(this.getAnchorByZone(betPos));
        this._mineItem.setPosition(cc.p(pos));

        //查看总投注按钮
        this._totalItem = new cc.MenuItemLabel(new cc.LabelBMFont("0",res.fnt_white_num), function(){
            self._callback(self._zone);
        }, this);
        this._totalItem.setAnchorPoint(this.getAnchorByZone(betPos));
        this._totalItem .setPosition(cc.p(pos.x,pos.y-30));

        var menu = new cc.Menu(this._mineItem,this._totalItem );
        menu.setPosition(cc.p(0,0));
        this.addChild(menu);


        this._winIconSprite=cc.Sprite.create(res.png_win_icon);
        this._winIconSprite.setNormalizedPosition(cc.p(1.0,1.0));
        this._winIconSprite.setPosition(cc.p(this.width-35,this.height-22));
        this.addChild(this._winIconSprite);
        this._winIconSprite.setVisible(false);// 默认不显示

        this._bankSprite=new cc.Sprite(res.png_icon_bank2);
        this._bankSprite.setNormalizedPosition(0.5,0.5);
        this.addChild(this._bankSprite);
        this._bankSprite.setVisible(false);// 默认不显示

        return true;
    },
    getAnchorByZone:function(betPos){
        switch (betPos){
            case 1: return cc.p(0.5,0);   break;
            case 2: return cc.p(0,1); break;
            case 5: return cc.p(0.5,0);   break;
            case 6: return cc.p(0,0.5); break;
            case 8: return cc.p(1,0.5); break;

        }
    },
    getPosByZone:function(betPos){
        var W=this.width;
        var H=this.height;
        switch (betPos){
            case 1: return cc.p(+30,H+20);  break;
            case 2: return cc.p(W+5,H+30);  break;
            case 5: return cc.p(W/2,H+30);  break;
            case 6: return cc.p(W+5,H/2+15);  break;
            case 8: return cc.p(0-5,H/2+15); break;
        }
    },
    setBetAmount:function (totalBet,mineBet) { // 刷新当前下注值
        this._totalItem.setString(totalBet);
        var isShow=parseInt(totalBet)>0?true:false;
        this._totalItem.setVisible(isShow);

        if(mineBet!=null){
            this._mineItem.setString(mineBet);
            isShow=parseInt(mineBet)>0?true:false;
            this._mineItem.setVisible(isShow);
        }
    },
    isWin:function(isWin){
        if(isWin){
            this._winSprite.setVisible(true);
            this._winSprite.runAction(cc.sequence(cc.fadeOut(1),cc.fadeIn(1)).repeatForever());
        }else{
            this._winSprite.stopAllActions();
            this._winSprite.setVisible(false);
        }
    },
    setWinTexture:function(texture,isShow){
        this._winIconSprite.setVisible(isShow);
        this._winIconSprite.setTexture(texture);
    },
    hasBanker:function(has){
        if(has){
            this.setColor(cc.color(190,190,190));
            //this.setColor(cc.color.GRAY);
            this._bankSprite.setVisible(true);
            this.setEnabled(false);
        }else{
            this.setColor(cc.color.WHITE);
            this._bankSprite.setVisible(false);
            this.setEnabled(true);
        }
    },
    reset:function(){
        this.isWin(false);
        this._winIconSprite.setVisible(false);
        this.setBetAmount(0,0);
    }

});



