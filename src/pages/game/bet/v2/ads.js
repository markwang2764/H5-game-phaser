function Ads () {
  // console.log("ok");
}

Ads.prototype = {
  getAds: (callback) => {
    var timer = Date.now();
    
    $.ajax({
      url: '/advert/getAdvert',
      type: 'GET',
      data: {
        dsm: window.store.dsm,
        dcm: window.store.dcm,
        dpm: window.store.dpm,
        gameId: window.store.gameId,
        sessionKey: window.store.sessionKey
      },
      timeout: 2400,
      dataType: 'json',
      success: function (res) {
        var data = res.data.advertEmbedBase;
        for (var i in data) {
          window.CFG.embed[i] = data[i];
        }
        callback && callback(res.data);
      },
      error: function (xhr) {
        // console.log(xhr);
        callback && callback({});
      }
    });
  },
    
  expAds: () => {
    $.get('/third/V1/showLog', {
      consumerId: CFG.userId,
      param: CFG.param,
      materialId: adsData && adsData.materialId,
      advertId: adsData && adsData.advertId,
      orderId: adsData && adsData.orderId
    }, function () {
            
    });
  },

  append: function(obj){
    for (var i in obj) {
      if (obj[i]) {
        window.CFG.embed[i] = obj[i];
      }
    }
    console.warn("append");
  },
    
  getToken: (userId, timer) => {
    var token = hex_md5(userId + timer + 'vicky');
    return token;
  },
    
  showLog: () => {
    $.get('/third/V1/commonLog', {
      type: 6,
      log: JSON.stringify({
        consumerId: CFG.userId,
        param: CFG.param,
        action: '',
        wanzhu_type: Date.now()
      })
    }, function () {
            
    });
  },

  embedClick: (item) => {
    if(typeof item === 'string'){
      item = JSON.parse(item);
    }
    item.round = window.roundId;
    item = JSON.stringify(item);
    window.DB.exposure.singleClk({data: item});
  },
    
  embedExport: (item) => {
    if(typeof item === 'string'){
      item = JSON.parse(item);
    }
    item.round = window.roundId;
    item = JSON.stringify(item);
    window.DB.exposure.singleExp(item);
  },

  catExport: (n) => {
    if (n === 1) {
      ads.numClick('1.3');
    } else if (n === 2) {
      ads.numClick('1.3');
    } else if (n === 3) {
      ads.numClick('1.3');
    } else if (n === 4) {
      ads.numClick('1.3');
    } else if (n === 5) {
      ads.numClick('1.3');
    } else if (n === 6) {
      ads.numClick('1.3');
    } else if (n === 7) {
      ads.numClick('1.3');
    } else if (n === 8) {
      ads.numClick('1.3');
    } else if (n === 9) {
      ads.numClick('1.3');
    } else if (n === 10) {
      ads.numClick('1.3');
    } else if (n === 11) {
      ads.numClick('1.3');
    } else if (n === 12) {
      ads.numClick('1.3');
    } else if (n === 13) {
      ads.numClick('1.2');
    } else if (n === 14) {
      ads.numClick('1.2');
    } else if (n === 15) {
      ads.numClick('1.2');
    } else if (n === 16) {
      ads.numClick('1.2');
    } else if (n === 17) {
      ads.numClick('1.1');
    } else if (n === 18) {
      ads.numClick('1.1');
    }
  },
    
  /**
  * 根据编号发送点击埋点
  * @param {埋点编号} dpm 后两位
  * @param {埋点编号} dcm 后两位
  */
  numClick: (dpm, dcm)=> {
    var data = window.CFG.embed;
    var dpmReg = new RegExp("\\." + dpm.split(".").join("\\.") + "$");
    var dcmReg = dcm ? new RegExp("\\." + dpm.split(".").join("\\.") + "$") : null;
    for (var i in data) {
      var d = data[i];

      if (dpmReg.test(d.dpm)) {
        var aim = false;
        if (dcmReg) {
          if (dcmReg.test(d.dcm)) {
            aim = true;
          }
        } else {
          aim = true;
        }
        if (aim) {
          if (i.indexOf("click") !== -1) {
            ads.embedClick(d);
            break;
          }
        }
      }
    }
  },

/**
* 根据编号发送曝光埋点
* @param {埋点编号} dpm 后两位
* @param {埋点编号} dcm 后两位
*/
  numExport: (dpm, dcm)=> {
    var data = window.CFG.embed;
    var dpmReg = new RegExp("\\." + dpm + "$");
    var dcmReg = dcm ? new RegExp("\\." + dcm + "$") : null;
    for (var i in data) {
      var d = data[i];

      if (dpmReg.test(d.dpm)) {
        var aim = false;
        if (dcmReg) {
          if (dcmReg.test(d.dcm)) {
            aim = true;
          }
        } else {
          aim = true;
        }
        if (aim) {
          if (i.indexOf("exposure") !== -1) {
            ads.embedExport(d);
            break;
          }
        }
      }
    }
  }
};
var ads = new Ads();
export default ads;
