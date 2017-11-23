// Webサーバで利用するポートを記載
const port  = '51001';
// 棒読みちゃんのIPとポートを記載
const bhost = '127.0.0.1';
const bport = '50001';

var util = require ('util'),
    url = require('url'),
    http = require('http'),
    qs = require('querystring'),
    fs = require('fs'),
    lodash = require('lodash'),
    bouyomiConnect = require('./bouyomiConnect.js'),
    bouyomiServer = {};
    bouyomiServer.host = bhost;
    bouyomiServer.port = bport;
http.createServer(function(req, res){
    res.writeHead(200,{"Content-Type": "text/plain"});
    res.write('Server in action.');
    res.end();
    if(req.method=='GET'){
        chat(req);
   }
}).listen(port);
function diffArray(arr1, arr2){
    var newArr = [];
    for(var a=0; a<arr1.length; a++){
        if(arr2.indexOf(arr1[a]) === -1){
            newArr.push(arr1[a]);
        }
    }
    for(var b=0; b<arr2.length; b++){
        if(arr1.indexOf(arr2[b]) === -1){
           newArr.push(arr2[b]);
        }
    }
    return newArr;
}
function chat(req){
    var dd   = new Date(),
        hour = dd.getHours(),
        min  = dd.getMinutes(),
        sec  = dd.getSeconds(),
        nowt = `${hour}時${min}分${sec}秒`,
        url_parts = url.parse(req.url,true),
        newChat = url_parts.query.text,
        newChatStr = decodeURIComponent(newChat),
        newChatAry = newChatStr.split(','),
        logName = 'chat.log',
        odlChat = fs.readFileSync(logName, 'utf-8'),
        odlChatAry = odlChat.split(','),
        diffChatAry = lodash.difference(newChatAry, odlChatAry);
    fs.writeFile(logName, newChatStr, (error) => {
        console.log('[注意] ログの保存ができませんでした。\n${logName}を開いている場合は閉じてください。\n${logName}がない場合は作成してください。');
    });
    diffChatAry.reverse();
    var diffChatStr = diffChatAry.join(','),
        diffChatStr_r = diffChatStr.replace(/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}\s/g, '');
    bouyomiConnect.sendBouyomi(bouyomiServer, diffChatStr_r);
    console.log(`--- 棒読みちゃん (${nowt}) ---`);
    console.log(diffChatStr_r);
}