import * as express from "express";
import { parseRequest } from '../lib/gitApi';

export class GitRepo {

    router: express.Router;

    constructor() {
        this.router = express.Router();
        this.init()
    }

    getHandlers() {
        return this.router
    }

    init() {
        this.router.get('/', this.repo.bind(this))
    }

    repo(req: express.Request, res: express.Response, next: express.NextFunction) {
        let loadData = parseRequest(req)
        loadData()
            .then(repos => {
                res.send(repos)
            })
            .catch(err => {
                res.send({message: err.message})
            })
    }

}