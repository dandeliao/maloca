const express = require("express");
const path = require("path");

const app = express();

app.use("/assets", express.static(path.resolve("frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html"));
});

app.listen(process.env.PORT || 4200, () => console.log("servidor trabalhando..."));