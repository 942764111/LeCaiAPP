/**
 * Created by lyf on 2017/7/2.
 * 投注明细
 */
var G_BettingDetailLayer;
var BettingDetailLayer = cc.Layer.extend({
    _betDetailData:null,
    _betListTableView:null,
    _shijian:null,
    ctor:function (betDetailData) {
        this._super();
        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);

        var self = this;
        this._betDetailData = betDetailData;
        G_BettingDetailLayer = this;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_img_betListBg_s);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);
        var bgHeadimg = new cc.Sprite(res.png_img_jiesuanImg_t);
        bgHeadimg.setPosition(cc.p(bgHeadimg.width/2 + 8,bg.height - bgHeadimg.height / 2 - 8));
        bg.addChild(bgHeadimg);

        var bgBottomimg = new cc.Sprite(res.png_img_jiesuanImg_b);
        bgBottomimg.setPosition(cc.p(bgBottomimg.width/2 + 8,bgHeadimg.height / 2));
        bg.addChild(bgBottomimg);

        var userlistLable = new cc.LabelTTF("投注明细","微软雅黑", 35);
        userlistLable.setNormalizedPosition(0.5, 0.93);
        bg.addChild(userlistLable);

        var playerEarnings= new cc.LabelTTF("我的收益","微软雅黑", 30);
        playerEarnings.setNormalizedPosition(0.15, 0.09);
        playerEarnings.setColor(cc.color(179,176,162,0));
        bg.addChild(playerEarnings);

        var playerEarningsNum= new cc.LabelTTF(G_BettingDetailLayer._betDetailData.data.change_balance,"微软雅黑", 30);
        playerEarningsNum.setName("playerEarningsNum");
        playerEarningsNum.setNormalizedPosition(0.8, 0.09);
        playerEarningsNum.setColor(cc.color(236,64,28,0));
        bg.addChild(playerEarningsNum);


        var closeBtn = new ccui.Button(res.png_btn_closeBtn);
        closeBtn.setNormalizedPosition(0.86, 0.85);
        this.addChild(closeBtn);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        this.initUserListView();

        var shijianTable = new TimerSelectLayer(self.upDataTouzhuList);
        shijianTable.setName("shijianTable");
        shijianTable.setPosition(cc.p(40,300));
        self.addChild(shijianTable);
        shijianTable.setVisible(false);

        var mingxiBtn = new ccui.Button(res.png_img_bettingmingxi);
        mingxiBtn.setPosition(cc.p(GC.W / 2+120,670+305));
        this.addChild(mingxiBtn);
        mingxiBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            shijianTable.visible = !shijianTable.visible;
        })

        var dataLable = new Date(new Date().getTime()).format("yyyy-MM-dd");
        this._shijian = new ccui.Button();
        this._shijian.setTitleText(dataLable + "");
        this._shijian.setTitleFontSize(35);
        this._shijian.setPosition(cc.p(GC.W / 2,665+310));
        this._shijian.setColor(cc.color(179,176,162,0));
        this.addChild(this._shijian);
        this._shijian.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            shijianTable.visible = !shijianTable.visible;
        })
        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(680, 560));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(38,380));
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
        return cc.size(340, 310);
    },
    tableCellAtIndex:function (table, idx) {
        var cell = table.dequeueCell();
        var bianhao;
        var nameLabel;
        var resultLabel;
        var zoneLabel;
        var winOrlose;
        var data=this._betDetailData.data.list[this._betDetailData.data.list.length-1-idx];
        //if (!cell) {
            cell = new cc.TableViewCell();

            var bg = new cc.Sprite(res.png_img_bettingSJ);
            bg.setPosition(cc.p(337,150));
            cell.addChild(bg);

            bianhao = new cc.LabelTTF(data.add_time + "参与","Arial", 26);
            bianhao.setTag(1);
            bianhao.setAnchorPoint(cc.p(0,0.5));
            bianhao.setPosition(cc.p(20,280));
            //bianhao.setColor(cc.color(236,64,28,0));
            cell.addChild(bianhao);

            nameLabel = new cc.LabelTTF(data.title,"Arial", 26);
            nameLabel.setTag(2);
            nameLabel.setAnchorPoint(cc.p(0,0.5));
            nameLabel.setPosition(cc.p(20,250));
            //nameLabel.setColor(cc.color(236,64,28,0));
            cell.addChild(nameLabel);

            resultLabel = new cc.LabelTTF("开奖结果："+data.lottery_number,"Arial", 26);
            resultLabel.setTag(3);
            resultLabel.setAnchorPoint(cc.p(0,0.5));
            resultLabel.setPosition(cc.p(20,220));
            //resultLabel.setColor(cc.color(236,64,28,0));
            cell.addChild(resultLabel);


            cc.log(JSON.stringify(data.bet_detail));
            for(var i=0;i<data.bet_detail.length;i++){
                var bet=data.bet_detail[i];
                zoneLabel=new cc.LabelTTF("投注了[第"+bet.zone+"位]"+(bet.balance)+"  "+(bet.win_balance>=0?"赢":"输")+"了"+bet.win_balance+"元宝","Arial", 26);
                zoneLabel.setTag(4+i);
                zoneLabel.setAnchorPoint(cc.p(0,0.5));
                zoneLabel.setPosition(cc.p(20,190-i*35));
                //zoneLabel.setColor(cc.color(236,64,28,0));
                cell.addChild(zoneLabel);
            }

            winOrlose = new cc.LabelTTF("本局收益："+data.profit_balance,"Arial", 26);
            winOrlose.setTag(9);
            winOrlose.setAnchorPoint(cc.p(1,0.5));
            winOrlose.setPosition(cc.p(580,15));
            winOrlose.setColor(cc.color(255,171,13));
            //winOrlose.setColor(cc.color(236,64,28,0));
            cell.addChild(winOrlose);

        /*}else{
            bianhao = cell.getChildByTag(1);
            bianhao.setString(data.add_time + "参与");

            nameLabel = cell.getChildByTag(2);
            nameLabel.setString(data.title);

            resultLabel = cell.getChildByTag(3);
            resultLabel.setString("开奖结果："+data.lottery_number);

            //cc.log(JSON.stringify(data.bet_detail));
            for(var i=0;i<data.bet_detail.length;i++){
                var bet=data.bet_detail[i];
                zoneLabel = cell.getChildByTag(4+i);
                if(!zoneLabel){
                    zoneLabel=new cc.LabelTTF("","Arial", 20);
                    zoneLabel.setTag(4+i);
                    zoneLabel.setAnchorPoint(cc.p(0,0.5));
                    zoneLabel.setPosition(cc.p(20+parseInt(i%2)*300,60-parseInt(i/2)*25));
                    zoneLabel.setColor(cc.color(236,64,28,0));
                }
                zoneLabel=new cc.LabelTTF("投注了[第"+bet.zone+"位]"+(bet.balance)+"  "+(bet.win_balance>=0?"赢":"输")+"了"+bet.win_balance+"元宝","Arial", 26);
            }

            winOrlose = cell.getChildByTag(9);
            winOrlose.setString("本局收益："+data.profit_balance);
        }*/
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return G_BettingDetailLayer._betDetailData.data.list.length;
    },
    upDataTouzhuList:function (dataStr) {
        var shijianList = G_BettingDetailLayer.getChildByName("shijianTable");
        if(shijianList)
        {
            shijianList.setVisible(false);
        }
        G_BettingDetailLayer._shijian.setTitleText(dataStr + "");
        var reqUrl = GC.URL + "room/getUserInfo?"
            + "date=" + dataStr
            + "&client_id="+GC.CLIENT_ID
            + "&token="+GC.TOKEN;
        ;
        //cc.log("请求",reqUrl);
        th.Http.inst().get(reqUrl,function (isSuccess, data) {
            if(isSuccess && data.code == "200")
            {
                //cc.log("******",data);
                G_BettingDetailLayer._betDetailData = data;
                G_BettingDetailLayer._betListTableView.reloadData();
                var dangtian = G_BettingDetailLayer.getChildByName("playerEarningsNum");
                if(dangtian)
                    dangtian.setString(G_BettingDetailLayer._betDetailData.data.change_balance);

            }else
            {
                var chenggong=new th.PopupLayer(data.message,"确定",function(){
                });
                self.addChild(chenggong);
            }
        })
    },
    closeView:function () {
        this.close();
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