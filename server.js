const express = require("express");

const path = require("path");


let initialPath = path.join(__dirname, "public");

let app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(initialPath, "index.html"));

})
app.get("/Tvshows", function (req, res) {
    res.sendFile(path.join(initialPath, "tvshows.html"));
})
app.get("/home", function (req, res) {
    res.sendFile(path.join(initialPath, "home.html"));
})
app.get("/User", function (req, res) {
    res.sendFile(path.join(initialPath, "user.html"));
})

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
})
