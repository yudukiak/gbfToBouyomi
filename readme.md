gbf_bouyomi
=====
グラブルのマイページを開いていると、団のチャット内容を棒読みちゃんが読み上げてくれるツールです。

## 説明
Chromeの拡張「Tampermonkey」とnode.jsのWebサーバを使い、1分ごとに団のチャットを棒読みちゃんが読み上げてくれるツールです。

設定でチャットの内容をJSON・DOMどちらから取得するかを設定できます。（JSONから取得する場合は取得先のURLを指定する必要性があります。あとBANされると思います。）

## 必要なライブラリなど
### サーバ
- [bouyomiConnect](https://github.com/thakyuu/node_bouyomiConnect)

### クライアント
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

## 準備
### 棒読みちゃん
1. 基本設定の「Socket通信」を開く
2. 「01)Socket通信を使う」を「True」に設定する

### サーバ
1. bouyomiConnect.jsをダウンロードする
2. server.jsと同じディレクトリへ入れる

### クライアント
1. ChromeへTampermonkeyをインストール
2. tampermonkey.jsを導入

## 使い方
1. 棒読みちゃんを起動させる
2. `node server.js`でサーバを起動させる
3. Chromeにてグラブルのマイページへ移動する
4. 自動で棒読みちゃんによる読み上げが開始する

## 設定内容
### サーバ
```
// Webサーバで利用するポートを記載
const port  = '51001';
// 棒読みちゃんのIPとポートを記載
const bhost = '127.0.0.1';
const bport = '50001';
```
- `const port  = '51001';`  
  サーバで利用するポートを記載します。競合していた場合、変更してください。
- `const bhost = '127.0.0.1';`  
  棒読みちゃんのIPアドレスです。通常変更する必要性はありません。
- `const bport = '50001';`  
  棒読みちゃんのポートです。変更している場合のみ書き換えてください。

### クライアント
```
// WebサーバのURLとポートを記載
const url  = 'http://localhost';
const port = '51001';
// チャットをJSONで取得する場合は true
// チャットをDOMで取得する場合は false (default)
const used = false;
// trueを選択した場合はJSONのURL '/foo/bar/file.json' を記入
const json = '';
```
- `const url  = 'http://localhost';`  
  サーバのURLを記載します。基本的にはローカル上で動かすと思いますので、弄る必要性はありません。
- `const port = '51001';`  
  サーバのポートを記載します。ポートを変更していない場合は弄る必要性はありません。
- `const used = false;`  
  チャットの内容をJSONから取得するか、DOMから取得するかを選択します。JSONで取得する場合は`true`を、DOMで取得する場合は`false`をお選びください。（デフォルトでは`false`です）
- `const json = '';`  
  チャットの内容をJSONから取得する場合は、JSONのURLを記載ください。

## 注意点
- 初回時は全てのチャットを読むので、棒読みちゃんを停止させておくのがオススメです。
- データの多重送信を防ぐために、マイページでのみ動作します。
- チャットログは全て「chat.log」へ保存されます。（常に上書きされます）
- 間違えて「chat.log」を削除してしまった場合は新たに作成してください。
- 複数アカウントでの動作はサポートおよび検討はいたしません。
- BANされても保証しません。

## ライセンス
このソフトウェアはMITライセンスでリリースされています。「LICENSE」を参照してください。
