# 開発環境のセットアップ

## 使用環境
* JavaScript (ECMAScript2015, ES6)
* Node.js (10.19.0~)
* Node Package Manager (6.14.8~)
* SugarSketcher (https://gitlab.com/glycoinfo/SugarSketcher_arranged.git)

## Homebrew
macでの開発環境の構築の際、Home brewがあると開発環境の構築がしやすい。

### Homebrewのバージョンを確認する
```
$ brew -v
```

### Homebrew(日本語)のインストール
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## Node.jsとnpm
**Node.js**はJavaScriptをサーバ上で実行させるための言語である。\
本開発ではNode.jsと、Node.jsを利用したJavaScriptのパッケージマネージャーである**npm**を利用している

### Node.jsとnpmの確認
**Node.js**
```
$ node --version
```
**npm**
```
$ npm -v
```

### Node.jsとnpmのインストール
Node.jsをインストールすると、npmも同時にインストールされる。
Homebrewを利用してNode.jsのバージョン管理ツールである
nodebrewをインストールする
```
$ brew install nodebrew
```
インストール後バージョンを確認する
```
$ nodebrew -v
```
nodebrew の環境パスを通す
```
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile
```
インストール可能なNode.jsをバージョンの確認
```
$ nodebrew ls-remote
```
インストールするバージョンを指定していインストールする(DrawRINGHSの開発にはv8.3.0を使用)
```
$ nodebrew install-binary バージョン
```
最新版をインストールする際は
```
$ nodebrew install-binary latest
```
インストール時エラーが出た場合、ディレクトリがないのでディレクトリを作成してもう一度試してみる。
```
$ mkdir -p ~/.nodebrew/src
```
インストールしたバージョンの確認
```
$ nodebrew ls
```
インストール直後は
```
$ current: none
```
になっているため、必要なバージョンを有効化する\
`vX.X.X`は自身のPCにインストールしたバージョンを入力する
```
$ nodebrew use vX.X.X
```

nodeのバージョンを確認する
```
$ node -v
```
上記コマンドの際、パスが繋がっていないとエラーが出た場合
```
$ export PATH=$HOME/.nodebrew/current/bin:$PATH
```
を試してみてください。
nodeのバージョンが確認できたら、npmのバージョンの確認もしてください。
２つともバージョンが表示持されたらインストール完了です。


## npmを使用した開発環境の構築

コマンドはすべてプロジェクト直下で行う。

### 依存ライブラリのインストール
```
$ npm install
```
上記のコマンドで`package.json`に記述されたライブラリ全てインストールする。\
インストールされたパッケージは`node_modules`で管理される。

### 新しい依存関係を追加する
```
$ npm install パッケージ名 --save-dev
```
依存関係をdevDependenciesに追加する場合はオプションに`--save-dev`を併記する。\
オプションを設定しない場合は`dependencies`に追加される。

## プロジェクトの実行
### srcディレクトリ
開発用のファイルを保管するディレクトリ

### distディレクトリ
webpackによって生成された実行ファイルを置くディレクトリ

### 実行ファイルの作成
下記のコマンドを実行することでsrc内のすべてのファイルが`dist`にまとめられる。\
dist内には`app.bundle.js`というソースコードのバンドルファイルと、SugarDrawerの実行用ブラウザである`index.html`が含まれる。\
実行の度にすべてのファイルが削除され、新しいバンドルファイルに置き換えられる。
```
$ npm run build
```

変更部分を動的にバンドルファイルに反映したい場合は以下のコマンドを実行する
```
$ npm run watch
```

ツールを公開する場合は以下のコマンドを実行する
```
$ npm run release
```

上記のコマンドは`package.json`の\"scripts\"オブジェクト内で定義している。

### search機能で参照するAPIを指定する
バンドルファイルを生成する際に環境変数を追加することで`search`機能を実行した際の検索対象となるデータベースの指定が可能となる。\
環境変数の設定は`NODE_ENV=`で行う.

```
$ NODE_ENV=name_of_API npm run build
```

```
$ NODE_ENV=name_of_API npm run release
```
対応している環境変数は以下のものとなる。

|name_of_API|API|
|----|----|
|development|https://test.glycosmos.org/glytoucans/index.json|
|release|https://glycosmos.org/glytoucans/index.json|
|glyconavi|https://glyconavi.org/Glycans/pdb-wurcs.php|

環境変数を指定しない場合、`build`では`development`、`release`では`release`が自動的に割り当てられる。

## 環境設定ファイル

### webpack
webpackはJavaScriptのソースコードを一つにまとめるバンドラであり、srcフォルダのファイル参照時にバージョンをES5に落とす。
webpackを実行するコマンドは`package.json`で設定されており、具体的なコマンドの内訳は以下のファイルで設定されている。

build, watch : `webpack.config.js`\
release : `webpack.release.js`

### Bable
<!--Babelは-->
本ツールのBabelは`.Babelrc`で設定している。

### eslint
<!--eslintは-->
本ツールのeslintは`.eslintrc.json`で設定している。

### flow
<!--flowは-->
本ツールのflowは`.flowconfig`で設定している





