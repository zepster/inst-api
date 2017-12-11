"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csvWriter = require("csv-write-stream");
const fs = require("fs");
class FolowerWriter {
    constructor(filename) {
        this.writer = csvWriter();
        this.writer.pipe(fs.createWriteStream(filename));
    }
    write(data) {
        this.writer.write(data);
    }
    end() {
        this.writer.end();
    }
    job(err, medias, pagination, cb) {
        this.cb = cb;
        this.save_followers(err, medias, pagination);
    }
    save_followers(err, medias, pagination) {
        try {
            if (err) {
                throw new Error(err.error_message);
            }
            for (let follower of medias) {
                this.writer.write({ id: follower.id, full_name: follower.full_name });
            }
            if (pagination.next) {
                return pagination.next(this.save_followers);
            }
        }
        catch (err) {
            console.error('Internal error', err);
        }
        this.writer.end();
        this.writer = null;
        this.cb && this.cb();
    }
}
exports.FolowerWriter = FolowerWriter;
//# sourceMappingURL=CSVWrite.js.map