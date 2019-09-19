const qiniuUploader = require("../../static/js/qiniuUploader.js");
const ajax = require('../../utils/request.js');

let _app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        tempFilePaths: '',
        qiniuToken: '',
        qiniuDomain: '',
        formData: {
            bookName: '',
            bookImgKey: '',
            bookTotal: 999,
            bookTags: ''
            // bookIntroduce: '',
            // bookTags: '',
            // bookAuthor: '',
            // bookType: '',
            // bookTotal: ''
        },
        btnLoading: false,
        labelList: [
            {name: '语言类', checked: false},
            {name: '数学类', checked: false},
            {name: '百科类', checked: false},
            {name: '工艺书', checked: false},
            {name: '立体书', checked: false},
            {name: '玩书类', checked: false},
            {name: '工具书', checked: false}]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            qiniuDomain: wx.getStorageSync('qiniuDomain'),
            qiniuToken: wx.getStorageSync('qiniuToken')

        })
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
    change() {
        this.setData({
            show: !this.data.show
        })
    },
    setBookTotal(e) {
        let val = e.detail.value;

        // if (!/^-?[1-9]\d*$/.test(val)) {
        //     console.log(`${val}不是是整数`)
        //     wx.showToast({
        //         title: '请输入整数哦~',
        //         icon: 'none'
        //     })
        // }

        val = val.replace(/\D/g, '');
        val = val.length === 0 ? 0 : parseInt(val);
        console.log(val)

        this.setData({
            'formData.bookTotal': val
        })
    },
    setBookName(e) {
        this.setData({
            'formData.bookName': e.detail.value
        })
    },

    radioChange: function (e) {
        let labelListTemp = JSON.parse(JSON.stringify(this.data.labelList));
        let temp = e.currentTarget.dataset.bookTag;

        labelListTemp = labelListTemp.map((item) => {

            if (item.name === temp) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });

        this.setData({
            'formData.bookTags': temp,
            labelList: labelListTemp
        })


    },
    openCamera: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],// ['original', 'compressed'] 原片、压缩
            sourceType: ['camera'],//['album', 'camera'] 相册、相机
            success: res => {
                console.log(res);
                // this.setData({
                //     tempFilePaths: res.tempFilePaths[0],
                // });
                let tempFilePaths = res.tempFilePaths[0];
                this.uploadQiniu(tempFilePaths);
            },

        });
    },
    uploadQiniu(tempFilePath) {
        let _that = this;

        wx.showLoading({
            title: '上传中,请稍等~',
        });

        qiniuUploader.upload(tempFilePath, (res) => {
            wx.hideLoading();
            console.log('上传成功', res);
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            _that.setData({
                tempFilePaths: `${res.imageURL}?imageView2/0/q/30`,
                'formData.bookImgKey': res.key
            });
        }, (error) => {
            console.log('error:', error);
        }, {
            uploadURL: 'https://up.qiniup.com',
            domain: _that.data.qiniuDomain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            key: `mini-borrowbook-${new Date().getTime()}.${tempFilePath.split('.')[tempFilePath.split('.').length - 1]}`, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
            uptoken: _that.data.qiniuToken, // 由其他程序生成七牛 uptoken
            // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
            // uptokenFunc: function () {
            //     return '[yourTokenString]';
            // }
        }, (res) => {
            console.log('上传进度', res.progress)
            console.log('已经上传的数据长度', res.totalBytesSent)
            console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        }, () => {
            // 取消上传
        }, () => {
            // `before` 上传前执行的操作
        }, (err) => {
            // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
        });
    },
    uploadBook() {
        if (this.data.formData.bookImgKey === '') {
            wx.showToast({
                title: '请上传图片',
                icon: 'none'
            });
            return false;
        }
        if (this.data.formData.bookName === '') {
            wx.showToast({
                title: '请填写书籍名称',
                icon: 'none'
            });
            return false;
        }
        if (this.data.formData.bookTotal === '') {
            wx.showToast({
                title: '请输入书本数量',
                icon: 'none'
            });
            return false;
        }
        if (this.data.formData.bookTags === '') {
            wx.showToast({
                title: '请选择书籍标签',
                icon: 'none'
            });
            return false;
        }

        this.setData({
            btnLoading: true
        });
        wx.showLoading({
            title: '正在上传',
        });
        ajax.myRequest({
            // url: "http://172.16.6.133:8080/resServer/bookLending/uploadBook",
            url: `${_app.globalData.host}${_app.globalData.api.uploadBook}`,

            data: {
                bookName: this.data.formData.bookName,
                bookImgKey: this.data.formData.bookImgKey,
                bookTotal: 999,
                bookTags: this.data.formData.bookTags
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                if (res.data.status === 0) {
                    wx.showModal({
                        title: '成功',
                        content: '返回首页',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                wx.reLaunch({
                                    url: '../home/home'
                                })
                            }
                        }
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
                this.setData({
                    btnLoading: false
                });
            },
            fial: err => {
                wx.showToast({
                    title: '上传失败'
                })
            }
        })
    }
})
