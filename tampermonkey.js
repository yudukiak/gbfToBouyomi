// ==UserScript==
// @name		[GBF] 棒読みちゃん連携
// @version		1.0
// @description	棒読みちゃんでチャットを読ませるツールです。
// @author		micelle
// @namespace	http://game.granbluefantasy.jp/
// @match		http://game.granbluefantasy.jp/*
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==
$(function(){
    // WebサーバのURLとポートを記載
    const url  = 'http://localhost';
    const port = '51001';
    // チャットをJSONで取得する場合は true
    // チャットをDOMで取得する場合は false (default)
    const used = false;
    // trueを選択した場合はJSONのURL '/foo/bar/file.json' を記入
    const json = '';

    if(document.URL.match('#mypage')){
        setTimeout(getChat, 1000);
        setInterval(getChat, 1000*60);
        //$(document).on('click','.txt-log',function(){getChat();});
    }
    function getChat(){
        if(used){
          $.getJSON(json, getJson);
        } else {
          getDom();
        }
    }
    function getJson(data){
        var chatArr = [],
            dataList = data.list;
        for (var key in dataList){
            var time = dataList[key].chat_time,
                name = dataList[key].user_name,
                comm = dataList[key].user_comment.text,
                str = `${time} ${name} ${comm}`;
            chatArr.push(str);
        }
        getServer(chatArr);
    }
    function getDom(){
        var chatArr = [];
        $('#submenu-general-chat .guild .lis-log').each(function(i, elem){
            var time = $(elem).find('.txt-time').text(),
                name = $(elem).find('.txt-name').text(),
                comm = $(elem).find('.prt-comment').html().replace(/\r\n|\n|\r|\t/g, ''),
                str = `${time} ${name} ${comm}`;
            chatArr.push(str);
        });
        getServer(chatArr);
    }
    function getServer(chatArr){
        var chatStr = chatArr.join(','),
            chatStr_e = encodeURIComponent(chatStr),
            dd   = new Date(),
            hour = dd.getHours(),
            min  = dd.getMinutes(),
            sec  = dd.getSeconds(),
            nowt = `${hour}時${min}分${sec}秒`;
        $.ajax({
            contentType: 'Content-Type: application/json; charset=UTF-8',
            type: 'GET',
            dataType : 'jsonp',
            url: `${url}:${port}`,
            data: {'text':chatStr_e}
        }).always(function(data){
            console.log(`${nowt} 通信完了`);
        });
    }
});