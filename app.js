//app.js
const ajax = require('./utils/request.js');
const _api = require('./utils/api.js');

App({

    onLaunch: function () {

        //获取qiniuDomain
        wx.request({
            url: `${_api.baseUrl}${_api.getImgDomain}`,
            success: res => {
                console.log('获取七牛Domain成功：', res);
                if (res.data.status === 0) {
                    wx.setStorageSync('qiniuDomain', res.data.data);
                }
            },
            fial: err => {
                wx.showToast({
                    title: 'getQniuDomain失败',
                    image: './static/img/warn.svg',
                    icon: 'none'
                })
            }
        });

        //获取七牛上传token
        wx.request({
            url: `${_api.baseUrl}${_api.getUploadToken}`,
            success: res => {
                console.log('获取七牛Token成功：', res);
                if (res.data.status === 0) {
                    wx.setStorageSync('qiniuToken', res.data.data);
                }
            },
            fial: err => {
                wx.showToast({
                    title: 'getQiniuToken fail'
                })
            }
        })


        // // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        //
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
        //
        // // 登录
        // wx.login({
        //   success: res => {
        //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //   }
        // })
        // // 获取用户信息
        // wx.getSetting({
        //   success: res => {
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           this.globalData.userInfo = res.userInfo
        //
        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
    },
    globalData: {
        userInfo: null,
        host: _api.baseUrl,
        api: _api
    }
});

