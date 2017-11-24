// Webサーバで利用するポートを記載
const port  = '51001';
// 棒読みちゃんのIPとポートを記載
const bhost = '127.0.0.1';
const bport = '50001';
// その他
const logName = 'chat.log';

var util = require ('util'),
    url = require('url'),
    http = require('http'),
    qs = require('querystring'),
    fs = require('fs'),
    lodash = require('lodash'),
    stamp = fs.readFileSync('stamp.json', 'utf-8'),
    stampAry = JSON.parse(stamp),
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
function chat(req){
    try {
        odlChat = fs.readFileSync(logName, 'utf-8');
    } catch (error) {
        errorHandling(error);
        return;
    }
    var dd   = new Date(),
        hour = dd.getHours(),
        min  = dd.getMinutes(),
        sec  = dd.getSeconds(),
        nowt = `${hour}時${min}分${sec}秒`,
        url_parts = url.parse(req.url,true),
        newChat = url_parts.query.text,
        newChatStr = decodeURIComponent(newChat),
        newChatAry = newChatStr.split(','),
        //odlChat = fs.readFileSync(logName, 'utf-8'),
        odlChatAry = odlChat.split(','),
        diffChatAry = lodash.difference(newChatAry, odlChatAry);
    console.log(`--- 棒読みちゃん (${nowt}) ---`);
    fs.writeFile(logName, newChatStr, (error) => {
        if(error){
            errorHandling(error);
            return;
        } else {
            diffChatAry.reverse();
            var replaceChatAry = [];
            for(var i=0,j=diffChatAry.length;i<j;i++){
                var targetText  = diffChatAry[i];
                var replaceChat = replaceText(targetText);
                replaceChatAry.push(replaceChat);
            }
            var replaceChatStr = replaceChatAry.join(','),
                replaceChatStr_r = replaceChatStr.replace(/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}\s/g, '');
            console.log(replaceChatStr_r);
            bouyomiConnect.sendBouyomi(bouyomiServer, replaceChatStr_r);
        }
    });
}
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
function replaceText(a){
    var b = a.match(/full\/([\s\S]*?)\.png/);
    if(b){
        var c=b[1], d=stampAry[c];
        return d;
    }else{
        return a;
    }
}
function errorHandling(error){
    var errorCode = error.code,
        errorMess = (function(){
        if(errorCode.match(/ENOENT/)) return `${logName}がない場合は作成してください。`;
        if(errorCode.match(/EPERM|EBUSY/)) return `${logName}を開いている場合は閉じてください。`;
    })();
    var errorText = `[注意] ログの保存ができませんでした。${errorMess}`;
    console.log(errorText);
    bouyomiConnect.sendBouyomi(bouyomiServer, errorText);
}