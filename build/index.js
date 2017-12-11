"use strict";
/// <reference path="./types/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const gitRepo_1 = require("./routes/gitRepo");
const cors = require("cors");
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    static bootstrap() {
        return new Server();
    }
    routes() {
        // this.app.use('/ig', new AuthRoute().getHandlers())
        this.app.use('/find', new gitRepo_1.GitRepo().getHandlers());
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.set('views', './views');
        this.app.set('view engine', 'pug');
        this.app.use(cors());
    }
    start(port = 3000) {
        this.app.listen(port, function () {
            console.log('The server is running in port localhost: ', port);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map