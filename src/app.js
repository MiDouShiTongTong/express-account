const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// 创建服务端
let app = express();

// 静态资源
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/upload/', express.static(path.join(__dirname, './upload/')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));

// POST处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

// 模版引擎
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));

// 指定视图目录
app.set('views', path.join(__dirname, './views/'));

// session
app.use(session({
    secret: 'yyccyy',                       // 加密session的key
    name: 'session_id',                     // cookie名称, 默认connect.sid
    resave: false,                          // 强制保存session
    saveUninitialized: true,                // 强制将未初始化的session存储
    cookie: {
        maxAge: 1000 * 60 * 60,             // 过期时间1小时
        // secure:true                         // https这样的情况才可以访问cookie

    },
    rolling: true,                          // 每次请求重置cookie过期时间
    store: new MongoStore({
        url: 'mongodb://127.0.0.1/new',     // 数据库的地址
        touchAfter: 24 * 3600               // 您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
    })
}));

// 路由
app.use(require('../routes/index'));
app.use(require('../routes/account'));

// 启动服务端
app.listen(3000, () => {
    console.log('服务端启动');
});