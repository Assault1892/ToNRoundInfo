const osc = require("node-osc"); // OSCモジュール
console.log("loaded: node-osc");
const models = require("./models.json"); // テラー情報
console.log("loaded: models")
const chokidar = require("chokidar"); // ファイル監視
console.log("loaded: chokidar")
const path = require("path"); // パス取得
console.log("loaded: path")
const fs = require("fs"); // ファイル操作
console.log("loaded: fs")
const server = new osc.Server(9000, "127.0.0.1"); // OSCサーバーを初期化
console.log("server is up, listening on port 9000");

// 様々

var roundType = 0; // ラウンドの種類
var terror    = null; // テラー名
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
log_dir = path.join(home_dir, "AppData/LocalLow/VRChat/VRChat/");

// 最新のファイルを取得
// VRChatディレクトリ直下のファイル ディレクトリを取得してソート
const logdir_list = fs.readdirSync(log_dir).map(filename => {
    return {
        filename: filename,
        mtime: fs.statSync(log_dir + filename).mtime
    }
})
logdir_list.sort((a,b) => a.mtime - b.mtime );
// output_log_*.txtでソート
const filter_logfile = logdir_list.filter(logs => logs.filename.startsWith("output_log_") && logs.filename.endsWith(".txt"));
// 最新のmtimeを持つオブジェクトのfilenameを抽出
const latest_logfile = filter_logfile.reduce((a, b) => {
    return new Date(a.mtime > b.mtime) ? b : a;
})["filename"] // この書き方ええんか？
console.log(`found latest logfile: ${latest_logfile}`)

const log_filepath = path.join(log_dir, latest_logfile);
console.log(`watching logfile path: ${log_filepath}`)

// chokidarを初期化

const watcher = chokidar.watch(log_filepath);
console.log("logwatcher initialized")


// ToNSaveManagerからラウンド情報などを受け取る
// https://github.com/ChrisFeline/ToNSaveManager?tab=readme-ov-file#osc-documentation

server.on("/avatar/parameters/ToN_OptedIn", (osc_optedin) => {
    osc_optedin = osc_optedin.toString()
    optedin = osc_optedin.substring(osc_optedin.indexOf(",")+1);
})

server.on("/avatar/parameters/ToN_Saboteur", (osc_saboteur) => {
    osc_saboteur = osc_saboteur.toString();
    saboteur = osc_saboteur.substring(osc_saboteur.indexOf(",")+1);
})

server.on("/avatar/parameters/ToN_RoundType", (osc_roundType) => {
    osc_roundType = osc_roundType.toString();
    roundType = models["roundType"][osc_roundType.substring(osc_roundType.indexOf(",") + 1)];
    showData(roundType, terror, optedin, saboteur);
})