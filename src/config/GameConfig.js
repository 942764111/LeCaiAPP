/**
 * Created by tanhao on 2017/1/17.
 */
var GC=GC||{};
//游戏屏幕宽高
GC.W=750;
GC.H=1334;


GC.LOBBY_BUTTON_TOUCH=true;
GC.ACTIVE_LAVYER=null;   //当前Layer
GC.ACTIVE_POS="LOGIN";   //当前位置

GC.GET_IP_URL="http://ip.kdp9.net/8899.php";


//用来还原游戏的
GC.LOGIN_NAME=null;
GC.PASSWORD=null;
GC.GROUP_TYPE=null;
GC.GAME_TYPE=null;
GC.GAME_LIMIT=null;
GC.ROOM_ID=null;
//用户ID
GC.CLIENT_ID="tanhao";
//Token
GC.TOKEN=null;
//Api 地址
GC.SERVICE_IP="";
GC.URL="http://47.94.225.252/api/";
GC.SOCKET=null;           //SOKCET
GC.SOCKET_URL="ws://47.94.225.252:8282";
//用户余额
GC.BALANCE="0";
//跑马灯信息
GC.MARQUEE_TEXT="欢迎光临晶彩游戏";
//取Token地址
GC.GET_TOKEN_URL = "http://47.94.225.252/Api/Public/getToken?client_id="+GC.CLIENT_ID;
//房间庄家列表 (9006)
GC.BANKER_DATA={};
//房间下注情况 (9007)
GC.BET_DATA={};
//总下注额
GC.BET_TOTAL=0;
//是否是从后台切回来
GC.IS_RESTORE=false;
// 是否在充值界面
GC.IS_RECHARGE = false;
// 用来处理还原充值
GC.RECHARGE_DATA = {};
//存储充值请求返回数据
GC.RECHARGE = null;
// 是否在提款界面
GC.IS_WITHDRAWALS = false;


//存放大厅游戏信息
GC.GAME_MAP={
    "1":{},
    "2":{},
    "3":{}
};

GC.DEFAULT_ZONE_POS={
    "1":{x:100,y:100},
    "2":{x:100,y:100},
    "3":{x:100,y:100},
    "4":{x:100,y:100},
    "5":{x:100,y:100},
}
GC.NIUNIU_ZONE_POS = {
    "1":{x:100,y:100},
    "2":{x:100,y:100},
}

GC.BET_ZONE = {
    "1":{// 初始化移动坐标  x y 入区坐标  pos需要取的结果值 len几个下注点 w每张牌之间的间隔  s间隔时间
        "5":{init_x:280,x:90-40,y:545-50,pos:[8,9],len:5,w:60,s:800},
        "1":{init_x:280,x:315-10,y:645-50,pos:[0,1],len:5,w:60,s:800},
        "2":{init_x:280,x:540+20,y:545-50,pos:[2,3],len:5,w:60,s:800},
        "4":{init_x:280,x:200-25,y:305-50,pos:[6,7],len:5,w:60,s:800},
        "3":{init_x:280,x:430+5,y:305-50,pos:[4,5],len:5,w:60,s:800},
    },
    "2":{
        "1":{init_x:80,x:250,y:690,pos:[0,1,2,3,4],len:2,w:65,s:2000},
        "2":{init_x:80,x:250,y:220,pos:[5,6,7,8,9],len:2,w:65,s:2000}
    },
    "3":{
        "5":{init_x:210,x:90-40,y:545-50,pos:[8,9,0],len:5,w:30,s:1200},
        "1":{init_x:210,x:315-10,y:645-50,pos:[0,1,2],len:5,w:30,s:1200},
        "2":{init_x:210,x:540+20,y:545-50,pos:[2,3,4],len:5,w:30,s:1200},
        "4":{init_x:210,x:200-25,y:305-50,pos:[6,7,8],len:5,w:30,s:1200},
        "3":{init_x:210,x:430+5,y:305-50,pos:[4,5,6],len:5,w:30,s:1200},
    },
    "4":{
        // "1":{x:100,y:100},
        // "2":{x:100,y:100},
        // "3":{x:100,y:100},
        // "4":{x:100,y:100},
        // "5":{x:100,y:100},
    },
    "5":{//单张
        "5":{init_x:400,x:90-40,y:545-50,pos:[4],len:5,w:30,s:500},
        "1":{init_x:400,x:315-10,y:645-50,pos:[0],len:5,w:30,s:500},
        "2":{init_x:400,x:540+20,y:545-50,pos:[1],len:5,w:30,s:500},
        "4":{init_x:400,x:200-25,y:305-50,pos:[3],len:5,w:30,s:500},
        "3":{init_x:400,x:430+5,y:305-50,pos:[2],len:5,w:30,s:500},
    },
    "6":{
        // "1":{x:100,y:100},
        // "2":{x:100,y:100},
        // "3":{x:100,y:100},
        // "4":{x:100,y:100},
        // "5":{x:100,y:100},
    },
    "7":{
        "5":{init_x:280,x:90-40,y:545-50,pos:[8,9],len:5,w:60,s:800},
        "1":{init_x:280,x:315-10,y:645-50,pos:[0,1],len:5,w:60,s:800},
        "2":{init_x:280,x:540+20,y:545-50,pos:[2,3],len:5,w:60,s:800},
        "4":{init_x:280,x:200-25,y:305-50,pos:[6,7],len:5,w:60,s:800},
        "3":{init_x:280,x:430+5,y:305-50,pos:[4,5],len:5,w:60,s:800},
    },
    "8":{
        "1":{init_x:80,x:250,y:690,pos:[0,1,2,3,4],len:2,w:65,s:2000},
        "2":{init_x:80,x:250,y:220,pos:[5,6,7,8,9],len:2,w:65,s:2000}
    },
    "9":{
        "5":{init_x:210,x:90-40,y:545-50,pos:[8,9,0],len:5,w:30,s:1200},
        "1":{init_x:210,x:315-10,y:645-50,pos:[0,1,2],len:5,w:30,s:1200},
        "2":{init_x:210,x:540+20,y:545-50,pos:[2,3,4],len:5,w:30,s:1200},
        "4":{init_x:210,x:200-25,y:305-50,pos:[6,7,8],len:5,w:30,s:1200},
        "3":{init_x:210,x:430+5,y:305-50,pos:[4,5,6],len:5,w:30,s:1200},
    }
};



Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

// 将货币保留两位 并且每三位加分隔符
var formatCurrency=function(num) {
    if(num==null || num == undefined){
        return "0.00";
    }
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
            num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}