const osc = require("node-osc"); // node-oscをrequire
console.log("starting...");
const server = new osc.Server(9000, "127.0.0.1"); // OSCサーバーを初期化
console.log("server is up, listening on port 9000");

// ToNSaveManagerからラウンド情報などを受け取る
// https://github.com/ChrisFeline/ToNSaveManager?tab=readme-ov-file#osc-documentation
server.on("/avatar/parameters/ToN_RoundType", (roundType) => {
    console.log("received, round type: " + roundType);
})