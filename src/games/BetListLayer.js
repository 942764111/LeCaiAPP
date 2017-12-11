/**
 * Created by lyf on 2017/7/1.
 * 历史记录
 */
var G_BetListLayer;
var BetListLayer=cc.Layer.extend({
    _kaijiangTableView:null,
    _guanfangTableView:null,
    _ruleTableView:null,
    _betListData:null,
    _gameType:null,
    _type:null,
    _cell:null,
    _menimg:null,
    _qianhouImg:null,

    ctor:function (betListData,gameType,type) {
        this._super();
        var self=this;
        G_BetListLayer = this;

        this._gameType = gameType;
        this._type=type;
        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);

        this._betListData = betListData;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_img_betListBg_s);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var closeBtn = new ccui.Button(res.png_btn_closeBtn);
        closeBtn.setNormalizedPosition(0.94, 1.1);
        bg.addChild(closeBtn);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            G_BetListLayer.close();
        })

        if(this._gameType == 2 || this._gameType == 8)
        {
            this._qianhouImg = new cc.Sprite(res.png_img_qianhouquImg);
            this._qianhouImg.setNormalizedPosition(0.5, 0.83);
            bg.addChild(this._qianhouImg);
        }else
        {
            this._menimg = new cc.Sprite(res.png_img_menImg);
            this._menimg.setNormalizedPosition(0.5, 0.83);
            bg.addChild(this._menimg);
        }

        this.initGameMenu();
        this.initTableView();

        this._kaijiangTableView.reloadData();
        this._guanfangTableView.reloadData();
        this._ruleTableView.reloadData();

        this._guanfangTableView.setVisible(false);
        this._ruleTableView.setVisible(false);

        return true;
    },
    initTableView:function () {
        this._kaijiangTableView = new cc.TableView(this, cc.size(670, 650));
        this._kaijiangTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._kaijiangTableView.setDelegate(this);
        this._kaijiangTableView.setPosition(cc.p(38,260));
        this.addChild(this._kaijiangTableView);

        this._guanfangTableView = new cc.TableView(this, cc.size(670, 730));
        this._guanfangTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._guanfangTableView.setDelegate(this);
        this._guanfangTableView.setPosition(cc.p(38,260));
        this.addChild(this._guanfangTableView);

        this._ruleTableView = new cc.TableView(this, cc.size(670, 730));
        this._ruleTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._ruleTableView.setDelegate(this);
        this._ruleTableView.setPosition(cc.p(38,260));
        this.addChild(this._ruleTableView);

    },
    initGameMenu:function(){
        var kjResult=cc.MenuItemImage.create( res.png_btn_betlistbtn,res.png_btn_betlistbtn_s,res.png_btn_betlistbtn_s,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            kjResult.setName("kjResult");
            kjResult.setEnabled(false);
            gfResult.setEnabled(true);
            gameRules.setEnabled(true);

            if(this._menimg)
                this._menimg.setVisible(true);
            if(this._qianhouImg)
                this._qianhouImg.setVisible(true);
            this._kaijiangTableView.setVisible(true);
            this._guanfangTableView.setVisible(false);
            this._ruleTableView.setVisible(false);
            this._type=1;
            this._cell=null;
            this._kaijiangTableView.reloadData();
        },this);
        kjResult.setNormalizedPosition(cc.p(0.167,0.78));
        kjResult.setEnabled(false);

        var gfResult=cc.MenuItemImage.create( res.png_btn_betlistbtn,res.png_btn_betlistbtn_s,res.png_btn_betlistbtn_s,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            gfResult.setName("gfResult");
            kjResult.setEnabled(true);
            gfResult.setEnabled(false);
            gameRules.setEnabled(true);

            if(this._menimg)
                this._menimg.setVisible(false);
            if(this._qianhouImg)
                this._qianhouImg.setVisible(false);
            this._kaijiangTableView.setVisible(false);
            this._guanfangTableView.setVisible(true);
            this._ruleTableView.setVisible(false);
            this._type=2;
            this._cell=null;
            this._guanfangTableView.reloadData();
        },this);
        gfResult.setNormalizedPosition(cc.p(0.393,0.78));

        var gameRules=cc.MenuItemImage.create( res.png_btn_betlistbtn,res.png_btn_betlistbtn_s,res.png_btn_betlistbtn_s,function(){
            cc.audioEngine.playEffect(res.mp3_click);
            gameRules.setName("gameRules");
            kjResult.setEnabled(true);
            gfResult.setEnabled(true);
            gameRules.setEnabled(false);

            if(this._menimg)
                this._menimg.setVisible(false);
            if(this._qianhouImg)
                this._qianhouImg.setVisible(false);
            this._kaijiangTableView.setVisible(false);
            this._guanfangTableView.setVisible(false);
            this._ruleTableView.setVisible(true);
            this._type=3;
            this._cell=null;
            this._ruleTableView.reloadData();
        },this);
        gameRules.setNormalizedPosition(cc.p(0.619,0.78));

        var danshuangText = new cc.LabelTTF("开奖结果","微软雅黑", 30);
        danshuangText.setNormalizedPosition(0.5, 0.5);
        kjResult.addChild(danshuangText);

        var daxiaoText = new cc.LabelTTF("官方结果","微软雅黑", 30);
        daxiaoText.setNormalizedPosition(0.5, 0.5);
        gfResult.addChild(daxiaoText);

        var longhuText = new cc.LabelTTF("游戏规则","微软雅黑", 30);
        longhuText.setNormalizedPosition(0.5, 0.5);
        gameRules.addChild(longhuText);

        var _gameMenu=cc.Menu.create(kjResult,gfResult,gameRules);
        _gameMenu.x=0;
        _gameMenu.y=0;
        G_BetListLayer.addChild(_gameMenu);

        if(this._type == 3)
        {
            kjResult.setEnabled(true);
            gfResult.setEnabled(true);
            gameRules.setEnabled(false);
        }
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {
       cc.log("touche");
    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        if(this._type==3){
            if(this._gameType == 1 || this._gameType == 7)// 牌九
            {
                return cc.size(335, 1181);
            }else if(this._gameType == 2 || this._gameType == 8)// 牛牛
            {
                return cc.size(335, 807);
            }else if(this._gameType == 3 || this._gameType == 9)// 三公
            {
                return cc.size(335, 1213);
            }else if(this._gameType == 5)// 单张
            {
                return cc.size(335, 1213);
            }

        }else{
            return cc.size(335, 156);
        }
    },
    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        if(this._type==1){
            var qihao;
            var shijian;
            var jieguo;
            var mingci;
            var openResultData = this._betListData.data.openResult;
            this._cell=1;
            var index = this._betListData.data.openResult.length - 1 - idx;
            cell = new cc.TableViewCell();
            var itemSprite = new cc.Sprite(res.png_btn_tankuang_s);
            itemSprite.setPosition(cc.p(670/2, 62));
            cell.addChild(itemSprite);

            qihao = new cc.LabelTTF(openResultData[index].issue + "期","微软雅黑", 25);
            qihao.setTag(1);
            qihao.setColor(cc.color(34,144,144,0));
            qihao.setPosition(cc.p(180,110));
            cell.addChild(qihao);

            shijian = new cc.LabelTTF(openResultData[index].add_time,"微软雅黑", 25);
            shijian.setTag(2);
            shijian.setColor(cc.color(34,144,144,0));
            shijian.setPosition(cc.p(500,110));
            cell.addChild(shijian);

            for(var i = 0 ; i < openResultData[index].zone_detail.length; i ++)
            {
                if(G_BetListLayer._gameType == 2 || G_BetListLayer._gameType == 8)
                {
                    jieguo = new cc.Sprite("#niu"+openResultData[index].zone_detail[i].point+".png");//new cc.LabelTTF(openResultData[index].zone_detail[i].point+"","微软雅黑", 40);
                    jieguo.setPosition(cc.p(180+(i*315),63));
                    jieguo.setTag(100 + i);
                    cell.addChild(jieguo);

                    if(openResultData[index].zone_detail[i].rank == 1)
                    {
                        mingci = new cc.Sprite(res.png_win_icon);
                        mingci.setPosition(cc.p(180+(i*315),15));
                        mingci.setTag(10000 + i);
                        cell.addChild(mingci);
                    }

                }else
                {
                    jieguo = new cc.LabelTTF(openResultData[index].zone_detail[i].point+"","微软雅黑", 40);
                    jieguo.setPosition(cc.p(70+(i*130),63));
                    jieguo.setTag(100 + i);
                    cell.addChild(jieguo);

                    if(openResultData[index].zone_detail[i].rank == 1)
                    {
                        mingci = new cc.Sprite(res.png_img_betlistOneImg);
                    }else if(openResultData[index].zone_detail[i].rank == 2)
                    {
                        mingci = new cc.Sprite(res.png_img_betlistTwoImg);
                    }else if(openResultData[index].zone_detail[i].rank == 3)
                    {
                        mingci = new cc.Sprite(res.png_img_betlistThreeImg);
                    }else if(openResultData[index].zone_detail[i].rank == 4)
                    {
                        mingci = new cc.Sprite(res.png_img_betlistFourImg);
                    }else
                    {
                        mingci = new cc.Sprite(res.png_img_betlistFiveImg);
                    }
                    mingci.setPosition(cc.p(70+(i*130),15));
                    mingci.setTag(10000 + i);
                    cell.addChild(mingci);
                }
            }
            return cell;
        }else if(this._type==2){
            var qihao;
            var shijian;
            var resultLabel;
            var openResultData = this._betListData.data.openResult;
            var officialResultData = this._betListData.data.officialResult;
            this._cell=2;
            var index = this._betListData.data.officialResult.length - 1 - idx;
            cell = new cc.TableViewCell();
            var itemSprite = new cc.Sprite(res.png_btn_tankuang_s);
            itemSprite.setPosition(cc.p(670/2, 62));
            cell.addChild(itemSprite);

            qihao = new cc.LabelTTF(openResultData[index].issue + "期","微软雅黑", 30);
            qihao.setTag(7);
            qihao.setPosition(cc.p(130,95));
            cell.addChild(qihao);

            shijian = new cc.LabelTTF(openResultData[index].add_time,"微软雅黑", 30);
            shijian.setTag(8);
            shijian.setPosition(cc.p(510,95));
            cell.addChild(shijian);

            resultLabel =new cc.LabelBMFont(officialResultData[index].lottery_number.replace("10","A").split(",").join(""), res.fnt_no_num_middle);
            resultLabel.setTag(9);
            resultLabel.setPosition(cc.p(20,35));
            resultLabel.setAnchorPoint(cc.p(0,0.5));
            cell.addChild(resultLabel);
            return cell;
        }else if(this._type==3){
            var itemSprite;
                this._cell=3;
                cell = new cc.TableViewCell();
                if(G_BetListLayer._gameType == 1 || G_BetListLayer._gameType == 7)// 牌九
                {
                    itemSprite = new cc.Sprite(res.png_img_paijiuRules);
                    itemSprite.setPosition(cc.p(600/2 + 20, 1181/2));
                }else if(G_BetListLayer._gameType == 2 || G_BetListLayer._gameType == 8)// 牛牛
                {
                    itemSprite = new cc.Sprite(res.png_img_niuniuRules);
                    itemSprite.setPosition(cc.p(600/2 + 20, 807/2));
                }else if(G_BetListLayer._gameType == 3 || G_BetListLayer._gameType == 9)// 三公
                {
                    itemSprite = new cc.Sprite(res.png_img_sangongRules);
                    itemSprite.setPosition(cc.p(600/2 + 20, 1213/2));
                }else if(G_BetListLayer._gameType == 5)// 单张
                {
                    itemSprite = new cc.Sprite(res.png_img_danzhangRules);
                    itemSprite.setPosition(cc.p(600/2 + 20, 1213/2));
                }
                itemSprite.setTag(4);
                cell.addChild(itemSprite);

            return cell;
        }
    },
    numberOfCellsInTableView:function (table) {
        if(this._type==1){
            return this._betListData.data.openResult.length;
        }else if(this._type==2){
            return this._betListData.data.officialResult.length;
        }else if(this._type==3){
            return 1;
        }else{
            return 0;
        }
    },
    onEnter:function(){
        this._super();

        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});