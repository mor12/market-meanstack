const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const jwt = require('express-jwt');
require('./server/utils/passport');
// API file for interacting with MongoDB
const api = require("./server/routes/routes");
const public = require('./server/routes/public.routes');
const auth = require('./server/routes/auth.routes');
const key = require('./server/utils/api.conf').tokenKey;
const multipart = require('connect-multiparty');

//connection for the DB
var mongoose = require("mongoose");

if (process.env.PROD) {
    mongoose.connect("mongodb://127.0.0.1:27017/red5gmarket", {
        auth: {
            authSource: "admin"
        },
        user: "jescobar",
        pass: "Red4g@2018.",
        useNewUrlParser: true
    });
} else {
    mongoose.connect("mongodb://127.0.0.1:27017/red5gmarket", { useNewUrlParser: true });
}



mongoose.set('useCreateIndex', true);

app.use(multipart());
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, "dist")));

// API location
app.use("/api", jwt({
    secret: key
}), api);
app.use('/public', public);
app.use('/auth', auth);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') return res.status(400).send({
        error: 'Llave de acceso no permitida.',
        code: 'Inicio de sesión requerido'
    });
});

app.get('/file/:type/:name', (req, res) => {
    const url = '/server/disk';
    let pre = "images";
    switch(req.params.type){
        case 'img:i': {
            pre = "images/installations";
            break;
        }
        case 'img:p': {
            pre = "images/products";
            break;
        }
        case 'img:e': {
            pre = "images/employees";
            break;
        }
        case 'img:d': {
            pre = "images/devices";
            break;
        }
        case 'doc': {
            pre = "documents";
            break;
        }
        case 'invoice': {
            pre = "";
            break;
        }
        default: {
            pre = "images/profiles";
            break;
        }
    }
    res.sendFile(path.join(__dirname, `${url}/${pre}`, req.params.name));
});

// Send all other requests to the Angular app
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"));
});

//Set Port
const port = process.env.PORT || "8080";
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
