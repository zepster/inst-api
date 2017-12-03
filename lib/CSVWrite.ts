import * as csvWriter from 'csv-write-stream'
import * as fs from 'fs'

export class FolowerWriter {

    private writer: any;
    private cb: Function;

    constructor (filename: string) {
        this.writer = csvWriter()
        this.writer.pipe(fs.createWriteStream(filename))
    }

    write(data) {
        this.writer.write(data)
    }

    end() {
        this.writer.end()
    }

    job(err: Instagram.CallbackError, medias: Instagram.IFollower[], pagination: Instagram.PaginationCallback<Instagram.IFollower>, cb) {
        this.cb = cb;
        this.save_followers(err, medias, pagination)
    }

    private save_followers(err: Instagram.CallbackError, medias: Instagram.IFollower[], pagination: Instagram.PaginationCallback<Instagram.IFollower>) {
        try {

            if (err) {
                throw new Error(err.error_message);
            }

            for (let follower of medias) {
                this.writer.write({id: follower.id, full_name: follower.full_name});
            }

            if (pagination.next) {
               return pagination.next(this.save_followers);
            }


        } catch (err) {
            console.error('Internal error', err);
        }

        this.writer.end();
        this.writer = null;
        this.cb && this.cb()
    }

}