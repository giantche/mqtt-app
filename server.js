const express = require("express");
const app = express();
const port = 3000;

// 提供 public 資料夾內的靜態檔案
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`伺服器運行中：http://localhost:${port}`);
});
