/**
 * Created by lyf on 2017/6/27.
 * 牛牛  公共
 */
var NiuNiuLayer=GameBaseLayer.extend({
    _qianquBtn:null, // 前区
    _houquBtn:null, // 后区
    ctor:function (groupType,gameType,gameLimit,roomData) {
        this._super(groupType,gameType,gameLimit,roomData);


        this._qianquBtn = new BettingButton(1,res.png_btn_qianqu,res.png_niuniu_win,this.showZoneDetail,1);
        this._qianquBtn.setPosition(375, 560);
        this._qianquBtn.addClickEventListener(this.bet);
        this._qianquBtn.setTag(1);
        this.addChild(this._qianquBtn);


        this._houquBtn = new BettingButton(2,res.png_btn_houqu,res.png_niuniu_win,this.showZoneDetail,1);
        this._houquBtn.setPosition(375, 345);
        this._houquBtn.addClickEventListener(this.bet);
        this._houquBtn.setTag(2);
        this.addChild(this._houquBtn);

        this._zoneBtns[1]=this._qianquBtn;
        this._zoneBtns[2]=this._houquBtn;

      /*  var arr = "1,2,3,4,5,6,7,8,9,10";
        var pokerAnimationLayer = new PokerAnimationLayer();
        this.addChild(pokerAnimationLayer,999);
        pokerAnimationLayer.starAction(arr,this._gameType,[,3,5]);*/

        return true;
    }

});



