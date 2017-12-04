/// <reference path="./types/index.d.ts" />

import * as bodyParser from "body-parser";
import * as express from "express";
import { AuthRoute } from './routes/instagramAuth'

export class Server {

    protected app: express.Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    public static bootstrap(): Server {
        return new Server();
    }

    routes() {
        this.app.use('/ig', new AuthRoute().getHandlers())
    }

    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.set('views', './views')
        this.app.set('view engine', 'pug')
    }

    start(port: number = 3000) {
        this.app.listen(port, function(){
            console.log('The server is running in port localhost: ', port);
        });
    }

}