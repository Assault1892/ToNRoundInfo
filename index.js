const osc = require("node-osc"); // node-oscをrequire
console.log("starting...");
const server = new osc.Server(9000, "127.0.0.1"); // OSCサーバーを初期化
console.log("server is up, listening on port 9000");

// 様々

var roundType = 0; // ラウンドの種類
var terror1   = 0; // 1体目のテラー
var terror2   = 0; // 2体目のテラー
var terror3   = 0; // 3体目のテラー
var optedin   = false; // ゲームに参加しているかどうか
var saboteur  = false; // サボタージュラウンドにて憑依状態かどうか

// コンソール表示関数

function showData(roundType, terror1, terror2, terror3, optedin, saboteur) {
    console.log(`
        received!
        現在のラウンド: ${roundType}
        1体目のテラー: ${terror1}
        2体目のテラー: ${terror2}
        3体目のテラー: ${terror3}
        参加状態: ${optedin}
        憑依状態: ${saboteur}
    `)
}

// ToNSaveManagerからラウンド情報などを受け取る
// https://github.com/ChrisFeline/ToNSaveManager?tab=readme-ov-file#osc-documentation
server.on("/avatar/parameters/ToN_Terror1", (osc_terror1) => {
    terror1 = osc_terror1;
})

server.on("/avatar/parameters/ToN_Terror2", (osc_terror2) => {
    terror2 = osc_terror2;
})

server.on("/avatar/parameters/ToN_Terror3", (osc_terror3) => {
    terror3 = osc_terror3;
})

server.on("/avatar/parameters/ToN_OptedIn", (osc_optedin) => {
    optedin = osc_optedin;
})

server.on("/avatar/parameters/ToN_Saboteur", (osc_saboteur) => {
    saboteur = osc_saboteur;
})

server.on("/avatar/parameters/ToN_RoundType", (osc_roundType) => {
    roundType = osc_roundType;
    showData(roundType, terror1, terror2, terror3, optedin, saboteur);
})