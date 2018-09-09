const express = require('express');

// 创建路由容器
let router = express.Router();

router.get('/', (request, response) => {
    response.render('index', {
        user: request.session.user
    });
});

// 导出路由容器
module.exports = router;