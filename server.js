const express = require("express");
const path = require("path");
const porta = process.env.PORT || 4200;

const app = express();

app.use("/assets", express.static(__dirname + "/app/assets"));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "app", "index.html"));
});

app.listen(porta, () => console.log(`cliente rodando na porta ${porta}...`));