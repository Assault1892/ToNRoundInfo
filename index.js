const osc = require("node-osc"); // OSCモジュール node-oscをrequire
console.log("loaded: node-osc");
const models = require("./models.json"); // テラー情報などをrequire
console.log("loaded: models")
const chokidar = require("chokidar"); // ファイル監視 chokidarをrequire
const path = require("path"); // パス取得 pathをrequire
console.log("loaded: chokidar, path")
const server = new osc.Server(9000, "127.0.0.1"); // OSCサーバーを初期化
console.log("server is up, listening on port 9000");

// 様々

var roundType = 0; // ラウンドの種類
var terror    = 0; // テラー名
var optedin   = false; // ゲームに参加しているかどうか
var saboteur  = false; // サボタージュラウンドにて憑依状態かどうか

// コンソール表示関数

function showData(roundType, terror, optedin, saboteur) {
    console.log(`
        received!
        現在のラウンド: ${roundType}
        テラー: ${terror}
        参加状態: ${optedin}
        憑依状態: ${saboteur}
    `)
}

// ログファイルを監視
// テラー名を取得する

// ログファイルまでのパスを取得
home_dir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
log_dir = path.join(logdir, "AppData/LocalLow/VRChat/VRChat");

// ToNSaveManagerからラウンド情報などを受け取る
// https://github.com/ChrisFeline/ToNSaveManager?tab=readme-ov-file#osc-documentation

server.on("/avatar/parameters/ToN_OptedIn", (osc_optedin) => {
    optedin = osc_optedin;
})

server.on("/avatar/parameters/ToN_Saboteur", (osc_saboteur) => {
    saboteur = osc_saboteur;
})

server.on("/avatar/parameters/ToN_RoundType", (osc_roundType) => {
    osc_roundType = osc_roundType.toString();
    roundType = models["roundType"][osc_roundType.substring(osc_roundType.indexOf(",") + 1)];
    showData(roundType, terror, optedin, saboteur);
})