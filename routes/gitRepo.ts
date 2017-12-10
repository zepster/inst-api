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
        let loadData = parseRequest(req);
        loadData()
            .then(repos => {
                repos.data = repos.data.map(r => ({
                    id: r.id,
                    owner: r.owner,
                    full_name: r.full_name,
                    stargazers_count: r.stargazers_count
                }))
                res.send(repos)
            })
            .catch(err => {
                res.status(500).send({message: err.message})
            })
    }

}