require('./index.less');
import bridge from '@components/bridge/index';

$('#bridge-open').on('click', function() {
  bridge.open(
    {
      uri: 'tm://mine',
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-coin').on('click', function() {
  bridge.coin(
    {
      coin: 90,
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-coinTxt').on('click', function() {
  bridge.coinTxt(
    {
      coin: 90,
      desc: '哈哈',
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-copyTxt').on('click', function() {
  bridge.copyTxt({ txt: 'hehehe' }, function(res) {
    console.log(JSON.parse(res));
  });
});

$('#bridge-share').on('click', function() {
  bridge.share(
    {
      notice: '标题小喇叭',
      field: {
        url: 'http://www.tuipink.com', // url
        title: '一二三四五六七八九', // 标题
        text:
          '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十', // 副标题
        picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
        type: 'SHARE', // SHARE:分享 JUMP: 只跳转
        content: '没有内容的', // 只跳转的复制内容
      },
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-sharePro').on('click', function() {
  bridge.sharePro(
    {
      notice: '标题小喇叭',
      channel: {
        wechatcircle: {
          url: 'http://www.tuipink.com', // url
          title: '官网首页 wechatcircle', // 标题
          text: '官网首页的描述', // 副标题
          picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
        wechatfriend: {
          url: 'http://www.tuipink.com', // url
          title: '官网首页 wechatfriend', // 标题
          text: '官网首页的描述', // 副标题
          picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
        qqfriend: {
          url: 'http://www.tuipink.com', // url
          title: '官网首页 qqfriend', // 标题
          text: '官网首页的描述', // 副标题
          picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
        qqzone: {
          url: 'http://www.tuipink.com', // url
          title: '官网首页 qqzone', // 标题
          text: '官网首页的描述', // 副标题
          picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
        weibo: {
          url: 'http://www.tuipink.com', // url
          title: '官网首页 weibo', // 标题
          text: '官网首页的描述', // 副标题
          picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
        copy: {
          url: 'http://www.tuipink.com', // url
          title: '', // 标题
          text: '', // 副标题
          picUrl: '', // 图片url
          type: 'SHARE', // SHARE:分享 JUMP: 只跳转
          content: '没有内容的', // 只跳转的复制内容
        },
      },
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-h5share').on('click', function() {
  bridge.h5share(
    {
      target: 'wechatfriend',
      config: {
        url: 'http://www.tuipink.com', // url
        title: '分享到微信好友的信息', // 标题
        text: '分享到微信好友的信息分享到微信好友的信息分享到微信好友的信息', // 副标题
        picUrl: 'http://yun.dui88.com/images/201707/n53th459d9.jpg', // 图片url
        type: 'SHARE', // SHARE:分享 JUMP: 只跳转
        content: '没有内容的', // 只跳转的复制内容
      },
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-goDuibaShop').on('click', function() {
  bridge.goDuibaShop();
});

$('#bridge-modalzone').on('click', function() {
  bridge.modalzone(
    {
      userid: 9,
      type: 2,
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-getPushPermission').on('click', function() {
  bridge.getPushPermission(
    {
      type: 'yes',
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-notify').on('click', function() {
  bridge.notify({ type: 'checkin' }, function(res) {
    console.log(JSON.parse(res));
  });
});

$('#bridge-getAppInfo').on('click', function() {
  bridge.getAppInfo({}, function(res) {
    console.log(JSON.parse(res));
  });
});

$('#bridge-rechargeList').on('click', function() {
  bridge.rechargeList(
    {
      money: 10,
      coin: 100,
      type: 1,
      fromPage: 2,
      refer: 8,
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-recharge').on('click', function() {
  bridge.recharge(
    {
      degreeId: 1,
      money: 100,
      coin: 1000,
      type: 1,
      bonusType: 1,
      fromPage: 2,
      notice: '',
      refer: 9,
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-openNobar').on('click', function() {
  bridge.openNobar(
    {
      uri: 'tm://mine',
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-closeWeb').on('click', function() {
  bridge.closeWeb({ type: 'flipcard' }, function(res) {
    console.log(JSON.parse(res));
  });
});

$('#bridge-startMatch').on('click', function() {
  bridge.startMatch(
    {
      name: 'jack',
      age: 18,
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});

$('#bridge-openBroswer').on('click', function() {
  bridge.openBroswer(
    {
      uri: 'http://www.baidu.com',
    },
    function(res) {
      console.log(JSON.parse(res));
    }
  );
});
