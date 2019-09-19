const ajax = require('../../utils/request.js');
let _app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mailPrifix: '',
        mailCode: '',
        sendEmailBtn: '发送邮箱验证码',
        sendEmailBtnDisabled: false,
        submitBtnDisabled: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    setMailPrifix(e) {
        this.data.mailPrifix = e.detail.value;
    },
    mailboxCapture() {

        if (this.data.mailPrifix === '') {
            wx.showToast({
                title: '邮箱不可为空',
                image: '../../static/img/warn.svg',
                icon: 'none'
            });
            return false;
        }

        wx.showLoading({
            title: '正在发送'
        });
        ajax.myRequest({
            // url: 'http://172.16.6.133:8080/resServer/bookLending/mailboxCapture',
            url: `${_app.globalData.host}${_app.globalData.api.mailboxCapture}`,
            data: {
                mailbox: `${this.data.mailPrifix}@aerogia.com`
            },
            success: (res) => {
                wx.hideLoading();
                console.log('mailboxCapture', res);
                if (res.data.status === 0) {
                    this.setData({
                        sendEmailBtnDisabled: true,
                        sendEmailBtn: '60S 后可重发'
                    });

                    let count = 59;
                    let interval = setInterval(() => {
                        this.setData({
                            sendEmailBtn: `${count}S 后可重发`
                        });
                        count--;
                        if (count < 0) {
                            clearInterval(interval);
                            this.setData({
                                sendEmailBtn: '发送邮箱验证码',
                                sendEmailBtnDisabled: false
                            })
                        }
                    }, 1000);

                } else {
                    wx.showToast({
                        title: `${res.data.msg}`,
                        icon: 'none'
                    })
                }
            },
            fail(err) {
                wx.hideLoading();
                wx.showToast({
                    title: '发送失败',
                    icon: 'none'
                })
            }
        });
    },
    setMailCode(e) {
        this.data.mailCode = e.detail.value;
    },
    bindMail() {

        if (this.data.mailPrifix === '') {
            wx.showToast({
                title: '邮箱不可为空',
                image: '../../static/img/warn.svg',
                icon: 'none'
            });
            return false;
        }

        if (this.data.mailCode === '') {
            wx.showToast({
                title: '验证码不可为空',
                image: '../../static/img/warn.svg',
                icon: 'none'
            });
            return false;
        }

        this.setData({
            submitBtnDisabled: true
        });

        wx.showLoading({
            title: '正在注册'
        });
        ajax.myRequest({
            // url: 'http://172.16.6.133:8080/resServer/bookLending/mailboxCapture',
            url: `${_app.globalData.host}${_app.globalData.api.bindMail}`,
            data: {
                mailbox: `${this.data.mailPrifix}@aerogia.com`,
                mailCode: this.data.mailCode
            },
            success: (res) => {
                wx.hideLoading();

                this.setData({
                    submitBtnDisabled: false
                });

                if (res.data.status === 0) {
                    wx.reLaunch({
                        url: '../home/home'
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    });
                }

            },
            fail(err) {
                wx.hideLoading();
                wx.showToast({
                    title: '发送失败',
                    icon: 'none'
                })
            }
        });
    }


});
