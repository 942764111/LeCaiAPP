/**
 * Created by lyf on 2017/6/27.
 * 三公
 */
var SanGongLayer=GameBaseLayer.extend({
    _bettingBtn1:null,
    _bettingBtn2:null,
    _bettingBtn3:null,
    _bettingBtn4:null,
    _bettingBtn5:null,
    ctor:function (groupType,gameType,gameLimit,roomData) {
        this._super(groupType,gameType,gameLimit,roomData);

        //下注点
        this._bettingBtn1 = new BettingButton(1,res.png_btn_bettingone,res.png_btn_dodge_s,this.showZoneDetail,2);
        this._bettingBtn1.setPosition(375, 685-30);
        this._bettingBtn1.addClickEventListener(this.bet);
        this._bettingBtn1.setTag(1);
        this.addChild(this._bettingBtn1);

        this._bettingBtn2 = new BettingButton(2,res.png_btn_bettingtwo,res.png_btn_dodge_s,this.showZoneDetail,5);
        this._bettingBtn2.setPosition(600+30, 585-30);
        this._bettingBtn2.addClickEventListener(this.bet);
        this._bettingBtn2.setTag(2);
        this.addChild(this._bettingBtn2);

        this._bettingBtn3 = new BettingButton(3,res.png_btn_bettingthree,res.png_btn_dodge_s,this.showZoneDetail,6);
        this._bettingBtn3.setPosition(490+15, 345-30);
        this._bettingBtn3.addClickEventListener(this.bet);
        this._bettingBtn3.setTag(3);
        this.addChild(this._bettingBtn3);

        this._bettingBtn4 = new BettingButton(4,res.png_btn_bettingfour,res.png_btn_dodge_s,this.showZoneDetail,8);
        this._bettingBtn4.setPosition(260-15, 345-30);
        this._bettingBtn4.addClickEventListener(this.bet);
        this._bettingBtn4.setTag(4);
        this.addChild(this._bettingBtn4);


        this._bettingBtn5 = new BettingButton(5,res.png_btn_bettingfive,res.png_btn_dodge_s,this.showZoneDetail,5);
        this._bettingBtn5.setPosition(150-30, 585-30);
        this._bettingBtn5.addClickEventListener(this.bet);
        this._bettingBtn5.setTag(5);
        this.addChild(this._bettingBtn5);

        this._zoneBtns[1]=this._bettingBtn1;
        this._zoneBtns[2]=this._bettingBtn2;
        this._zoneBtns[3]=this._bettingBtn3;
        this._zoneBtns[4]=this._bettingBtn4;
        this._zoneBtns[5]=this._bettingBtn5;

       /* var arr = "1,2,3,4,5,6,7,8,9,10";
        var pokerAnimationLayer = new PokerAnimationLayer();
        this.addChild(pokerAnimationLayer,999);
        pokerAnimationLayer.starAction(arr,this._gameType,[,3,5,8,6,1]);*/

        return true;
    }
});