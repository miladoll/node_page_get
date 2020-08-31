# node_page_get

題名からはピンとこないけど、指定したURLに指定した回数ヘッドレスブラウザでアクセスして、だいたい描画完了までどれくらい時間かかるかを平均／中央値出すNodeJSスクリプト

## Usage

Windowsの場合、

```
$ run $target_url [ number_of_trials ]
```

実際には `node index.js $target_url [ number_of_trials ]` で呼ばれるのを期待しているため、引数の順番を間違えると動きません。


## ToDo

エラー対応とかなんにもしてないよ。急場しのぎ用
