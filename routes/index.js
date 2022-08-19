var express = require('express');
var router = express.Router();
var email = require('./email');
var sendMail = email.sendMail;
var config = require('./config');
var log = require('./mylog');
var multer  = require('multer')
var ip2loc = require("ip2location-nodejs");
var path = require('path');

var ipFilePath = path.join(__dirname, config.ipFile)
ip2loc.IP2Location_init(ipFilePath);
var uploadFolder = path.resolve(__dirname, config.upload.path);
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage }).single('file')

function getReviewIdHandler(req, res, next) {
    reviewId = req.query.id
    res.set({'Content-Type': 'text/html',})
    res.render('review', {'reviewId':reviewId});
};

function fileUploadHandler(req, res, next) {
    log.info('req headers:', req.headers);
    upload(req, res, function(err) {
        log.info('uploadFolder:', uploadFolder);
        if (err instanceof multer.MulterError) {
            log.error(err);
            res.json({
                msg: 'err'
            })
        } else if (err) {
            log.error(err);
            res.json({
                msg: 'err'
            })
        } else {
            log.info('req body:', req.body);
            log.info('req file:', req.file);
            res.json({
                msg: 'success'
            })
        }
    })
}

function contactHandler(req, res, next) {
    log.debug('req headers:', req.headers);
    var ip = '?';
    var country = '?';
    var region = '?';
    var city = '?';
    var ips = req.headers['x-forwarded-for'];
    if (ips=='' || ips==undefined) {
        log.error('fail to find user ip');
    } else {
        var ipArr = ips.split(', ');
        ip = ipArr[0];
        var ipRet = ip2loc.IP2Location_get_all(ip);
        country = ipRet['country_long'];
        region = ipRet['region'];
        city = ipRet['city'];
    }
    var body = req.body;
    log.debug('req body:', body);
    if (body.name=="" || body.name==undefined) {
        var errMsg = "fail to find name";
        log.error('fail to send contact, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.email=="" || body.email==undefined) {
        var errMsg = 'fail to find email';
        log.error('fail to send contact, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.message=="" || body.message==undefined) {
        var errMsg = 'fail to find message';
        log.error('fail to send contact, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    var name = body.name;
    var email = body.email;
    var message = body.message;
    log.debug('name:', name);
    log.debug('ip:', ip);
    log.debug('country:', country);
    log.debug('region:', region);
    log.debug('city:', city);
    log.debug('email:', email);
    log.debug('message:', message);
    var html = '<p>Name: ' + name + '</p>' +
               '<p>Country: ' + country + '</p>' +
               '<p>Region: ' + region + '</p>' +
               '<p>City: ' + city + '</p>' +
               '<p>Email: ' + email + '</p>' +
               '<p>Message: ' + message + '</p>';
    sendMail(config.email.toUser, config.email.subject.contact, html)
    .then((data)=>{
        log.debug('send contact succeed:', data);
        res.json({
            msg:'success'
        });
    }).catch((err)=>{
        log.error('fail to send contact, err:', err);
        res.json({
            msg: err
        })
    });
};

function reviewHandler(req, res, next) {
    log.debug('req headers:', req.headers);
    var ip = '?';
    var country = '?';
    var region = '?';
    var city = '?';
    var ips = req.headers['x-forwarded-for'];
    if (ips=='' || ips==undefined) {
        log.error('fail to find user ip');
    } else {
        var ipArr = ips.split(', ');
        ip = ipArr[0];
        var ipRet = ip2loc.IP2Location_get_all(ip);
        country = ipRet['country_long'];
        region = ipRet['region'];
        city = ipRet['city'];
    }
    var body = req.body;
    log.debug('req body:', body);
    if (body.model=="" || body.model==undefined) {
        var errMsg = "fail to find model";
        log.error('fail to send review, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.rating=="" || body.rating==undefined) {
        var errMsg = "fail to find rating";
        log.error('fail to send review, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.name=="" || body.name==undefined) {
        var errMsg = "fail to find name";
        log.error('fail to send review, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.email=="" || body.email==undefined) {
        var errMsg = 'fail to find email';
        log.error('fail to send review, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    if (body.message=="" || body.message==undefined) {
        var errMsg = 'fail to find message';
        log.error('fail to send review, err:', errMsg);
        res.json({
            msg: errMsg
        });
        return;
    }
    var model = body.model;
    var rating = body.rating;
    var name = body.name;
    var email = body.email;
    var message = body.message;
    log.debug('model:', model);
    log.debug('rating:', rating);
    log.debug('name:', name);
    log.debug('ip:', ip);
    log.debug('country:', country);
    log.debug('region:', region);
    log.debug('city:', city);
    log.debug('email:', email);
    log.debug('message:', message);
    var html = '<p>Model: ' + model + '</p>' +
               '<p>Rating: ' + rating + '</p>' +
               '<p>Name: ' + name + '</p>' +
               '<p>Country: ' + country + '</p>' +
               '<p>Region: ' + region + '</p>' +
               '<p>City: ' + city + '</p>' +
               '<p>Email: ' + email + '</p>' +
               '<p>Review: ' + message + '</p>';
    sendMail(config.email.toUser, config.email.subject.review, html)
    .then((data)=>{
        log.debug('send review succeed:', data);
        res.json({
            msg:'success'
        });
    }).catch((err)=>{
        log.error('fail to send review, err:', err);
        res.json({
            msg: err
        })
    });
};

router.get('/review/:id?', (req, res, next) => {
    getReviewIdHandler(req, res, next);
})

router.post('/file/upload', (req, res, next) => {
    fileUploadHandler(req, res, next);
})

router.post('/email/contact', (req, res, next) => {
    contactHandler(req, res, next);
})

router.post('/email/review', (req, res, next) => {
    reviewHandler(req, res, next);
})

module.exports = router;
