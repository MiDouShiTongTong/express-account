const express = require('express');
const md5 = require('blueimp-md5');
const User = require('../model/user');
const upload = require('../src/upload');

// 创建路由容器
let router = express.Router();

// 注册的页面
router.get('/account/signUp', (request, response) => {
    response.render('account/sign-up');
});

// 处理注册逻辑
router.post('/account/signUp', async (request, response) => {
    try {
        // 1.获取提交数据
        let postData = request.body;

        // 2.操作数据库
        if (await User.findOne({email: postData.email})) {
            return response.status(200).json({
                errorCode: '1',
                errorMessage: '邮箱已存在'
            });
        }
        if (await User.findOne({nickname: postData.nickname})) {
            return response.status(200).json({
                errorCode: '2',
                errorMessage: '昵称已存在'
            });
        }

        // 加密
        postData.password = md5(md5(postData.password + 'yyccyy'));
        let user = await User.create(postData);

        // 保存登陆状态
        request.session.user = user;

        // 3.响应
        return response.status(200).json({
            errorCode: '0',
            errorMessage: '注册成功'
        });
    } catch (exception) {
        return response.status(500).json({
            errorCode: '500',
            errorMessage: '服务器正忙'
        });
    }
});

// 登陆的页面
router.get('/account/signIn', (request, response) => {
    response.render('account/sign-in');
});

// 处理登陆逻辑
router.post('/account/signIn', async (request, response) => {
    try {
        // 1.获取提交数据
        let postData = request.body;
        // 2.操作数据库
        let user = await User.findOne({
            email: postData.email,
            password: md5(md5(postData.password + 'yyccyy'))
        });
        if (user) {
            // 保存登陆状态
            request.session.user = user;
            // 3.响应
            return response.status(200).json({
                errorCode: '0',
                errorMessage: '登陆成功'
            });
        } else {
            return response.status(200).json({
                errorCode: '3',
                errorMessage: '用户名或密码错误'
            });
        }
    } catch (exception) {
        return response.status(500).json({
            errorCode: '500',
            errorMessage: '服务器正忙'
        });
    }
});

// 退出登陆
router.get('/account/signOut', (request, response) => {
    request.session.user = null;
    // 重定向
    response.redirect('/');
});

// 个人信息修改页面
router.get('/account/setting/profile', async (request, response) => {
    // 验证登陆状态
    if (!request.session.user) {
        response.redirect('/account/signIn');
    }

    response.render('account/profile', {
        user: await User.findOne({_id: request.session.user._id})
    });
});

// 个人信息修改逻辑
router.post('/account/setting/profile', upload.single('avatar'), async (request, response) => {
    try {
        // 1.获取提交数据
        let postData = request.body;

        // 是否修改头像
        if (request.file !== undefined) {
            postData.avatar = request.file.filename;
        }

        // 2.操作数据库
        await User.updateOne({
            _id: request.session.user._id
        }, postData);

        // 3.响应
        response.status(200).json({
            'errorCode': '0',
            'errorMessage': '保存成功'
        });
    } catch (exception) {
        response.status(500).json({
            'errorCode': '500',
            'errorMessage': '服务器正忙'
        });
    }
});

// 导出路由容器
module.exports = router;