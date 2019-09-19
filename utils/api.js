/**
 * 借口DOMAIN
 */
const baseUrl = 'http://172.16.6.133:8080';
// const baseUrl = 'https://testdatacenter.aiwanshu.com';

/**
 * 获取七牛上传token
 */
const getUploadToken = '/resServer/common/getUploadToken';



/**
 * 获取图片库链接域名
 * 入参：暂无
 */
const getImgDomain = '/resServer/common/getImgDomain';

/**
 *用户登录
 *入参: code  用户登录凭证
 * 出参：
        status	int	状态码，0为成功
        data.SESSION_ID	String	会话id，需要在之后的请求中携带上
        data.USER_STATE	int	0 未注册，1 正常， -1 禁用(待确定)
 */
const login = '/resServer/bookLending/login';

/**
 *发送邮箱验证码
 *入参: mailbox  邮箱
 */
const mailboxCapture = '/resServer/bookLending/mailboxCapture';

/**
 *绑定邮箱
 *入参: mailbox	邮箱
 *      mailCode 邮箱验证码
 */
const bindMail = '/resServer/bookLending/bindMail';

/**
 *上传图书
 *入参:
 bookName	String	是	图书名
 bookImgKey	String	是	图书封面Key
 bookIntroduce	String	否	图书简介
 bookTags	String	否	图书标签
 bookAuthor	String	否	图书作者
 bookType	String	否	图书类型
 bookTotal	int	是	图书数量
 */
const uploadBook = '/resServer/bookLending/uploadBook';

/**
 *识别图书
 *入参: imgKey	String	是	图片Key
 */
const bookSearch = '/resServer/bookLending/bookSearch';

/**
 *借阅图书
 *入参: bookId	int	是	图书id
 */
const lendBook = '/resServer/bookLending/lendBook';

/**
 *上传参照物
 *入参:
 referenceName	String	是	参照物名
 referenceImgKey	String	是	参照物封面Key
 referenceRemark	String	否	参照物备注
 */
const uploadReference = '/resServer/bookLending/uploadReference';

/**
 *我的在借图书
 *入参: code  用户登录凭证
 */
const myLendingBook = '/resServer/bookLending/myLendingBook';

/**
 *随机获取一个参照物
 *入参:
 */
const findReference = '/resServer/bookLending/findReference';

/**
 *归还图书
 *入参:
 imgKey	String	是	图片Key
 referenceId	int	是	参照物id
 lendingId	int	是	借阅id
 */
const returnBook  = '/resServer/bookLending/returnBook';

/**
 *图书列表
 *入参:
 pageNum	int	否	页码，默认1
 pageSize	int	否	页大小，默认10
 */
const bookList = '/resServer/bookLending/bookList';


module.exports = {
    baseUrl,
    getUploadToken,
    getImgDomain,
    login,
    mailboxCapture,
    bindMail,
    uploadBook,
    bookSearch,
    lendBook,
    uploadReference,
    myLendingBook,
    findReference,
    returnBook,
    bookList


};







