/**
 * Created by lyf on 2017/7/2.
 * 结算面板
 */
var SettlementLayer = cc.Layer.extend({
    _userListData:null,
    _settlementData:null,
    ctor:function (settlementData) {
        this._super();
        //this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        //this.addChild(this._layerColor);

        var self = this;

        this._settlementData = settlementData;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_img_jiesuanImg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);
        var bgHeadimg = new cc.Sprite(res.png_img_jiesuanImg_t);
        bgHeadimg.setPosition(cc.p(bgHeadimg.width/2 + 8,bg.height - bgHeadimg.height / 2 - 8));
        bg.addChild(bgHeadimg);

        var bgBottomimg = new cc.Sprite(res.png_img_jiesuanImg_b);
        bgBottomimg.setPosition(cc.p(bgBottomimg.width/2 + 8,bgHeadimg.height / 2));
        bg.addChild(bgBottomimg);

        var closeBtn = new ccui.Button(res.png_btn_closeBtn);
        closeBtn.setNormalizedPosition(0.94, 1.1);
        bg.addChild(closeBtn);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        });

        var userlistLable = new cc.LabelTTF("本局结算","微软雅黑", 35);
        userlistLable.setNormalizedPosition(0.5, 0.93);
        bg.addChild(userlistLable);

        var bankerEarnings= new cc.LabelTTF("庄家收益","微软雅黑", 30);
        bankerEarnings.setNormalizedPosition(0.15, 0.86);
        bankerEarnings.setColor(cc.color(179,176,162,0));
        bg.addChild(bankerEarnings);

        var bankerEarningsNum= new cc.LabelTTF(this._settlementData.host_profit_balance,"微软雅黑", 30);
        bankerEarningsNum.setNormalizedPosition(0.8, 0.86);
        bankerEarningsNum.setColor(cc.color(179,176,162,0));
        bg.addChild(bankerEarningsNum);

        var playerEarningsrank = new cc.LabelTTF("玩家收益排名","微软雅黑", 30);
        playerEarningsrank.setNormalizedPosition(0.15, 0.78);
        playerEarningsrank.setColor(cc.color(179,176,162,0));
        bg.addChild(playerEarningsrank);

        var playerEarnings= new cc.LabelTTF("玩家收益","微软雅黑", 30);
        playerEarnings.setNormalizedPosition(0.15, 0.09);
        playerEarnings.setColor(cc.color(179,176,162,0));
        bg.addChild(playerEarnings);

        var playerEarningsNum= new cc.LabelTTF(this._settlementData.profit_balance,"微软雅黑", 30);
        playerEarningsNum.setNormalizedPosition(0.8, 0.09);
        playerEarningsNum.setColor(cc.color(179,176,162,0));
        bg.addChild(playerEarningsNum);

        this.initUserListView();

        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(680, 430));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(38,435));
        this.addChild(this._betListTableView);
        this._betListTableView.reloadData();
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {

    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(335, 40);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var cell = table.dequeueCell();
        var bianhao;
        var nameTable;
        var winOrlose;
        var index = this._settlementData.rankingList.length-1-idx;
        var col=idx==0?cc.color(225,184,18):idx==1?cc.color(114,190,219):idx==2?cc.color(209,120,59):cc.color(34,96,199,0);

        var data=this._settlementData.rankingList[index];
        if (!cell) {
            cell = new cc.TableViewCell();

            bianhao = new cc.LabelTTF((index+1)+"","微软雅黑", 30);
            bianhao.setTag(1);
            bianhao.setPosition(cc.p(50,10));
            bianhao.setColor(col);
            cell.addChild(bianhao);

            nameTable = new cc.LabelTTF(data.nickname,"微软雅黑", 30);
            nameTable.setTag(2);
            nameTable.setAnchorPoint(cc.p(0,0.5));
            nameTable.setPosition(cc.p(170,10));
            nameTable.setColor(col);
            cell.addChild(nameTable);

            winOrlose = new cc.LabelTTF(data.profit_balance,"微软雅黑", 30);
            winOrlose.setTag(3);
            winOrlose.setAnchorPoint(cc.p(0,0.5));
            winOrlose.setPosition(cc.p(550,10));
            winOrlose.setColor(col);
            cell.addChild(winOrlose);

        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setColor(col);
            bianhao.setString((index+1)+"");

            nameTable = cell.getChildByTag(2);
            nameTable.setString(data.nickname);
            nameTable.setColor(col);

            winOrlose = cell.getChildByTag(3);
            winOrlose.setColor(col);
            winOrlose.setString(data.profit_balance);
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return this._settlementData.rankingList.length;
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