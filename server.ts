import http from 'http';
import https from 'https';
import * as fs from "fs";

import {std} from "./index"
import route from './routes/route';

export function log(...args: any[]) {
    std.write(`CONSOLE: ${args.join(" ")}\n`);
}
type IRoute = typeof import("./routes/route");
export default class Dispatch{
    httpServer?: http.Server;
    httpsServer?: https.Server;

    constructor(public httpPort: number,public httpsPort: number){

    }

    public start(){
        if(this.httpServer || this.httpsServer){
            log("already started");
            return;
        }
        this.httpServer = http.createServer(this.handleRequest);

        this.httpsServer = https.createServer({
            key: fs.readFileSync('./src/cert/ys.key'),
            cert: fs.readFileSync('./src/cert/ys.crt')
          }, this.handleRequest);

        this.httpServer.listen(80, '127.0.0.1');
        this.httpsServer.listen(443, '127.0.0.1');

        log(`started on port ${this.httpPort} and ${this.httpsPort}
         
                                ▄█
                               ▄▓▓▌
                              ▓▓▓▓▌
                            ▄▓▓▓▓█▄▒▓▒▒▒░░▒░░░░▀▀▓▒▄
                           ▓▓▓▓▓▓▌▒▒░░░░░░░░░░░░░░░▒▒▒▒▄
                         ▄▓▓▓▓▓▀▀░▒▒░░░░░░░░░░░░░░░░░░▒▒▒▄
                  ▄  ▄  █▓▀░░░▒▒▓▒░░░░░░░░░░░░░░░░░░░░░░▒▒▒▄
                  ▐█▓▓▓▓▒▄▄▒▒▒▒▒░░▒▒▒▒▒▒▒░░░▒▒▒▒▒▒▒░░░░░░░▒▒▓
                   █▒▓▓▒▒██▓▒░░░▒▒▒░░░░░░░░░░░░░░▒▒▒▒░░░░░░▒▒▒
                   ▒▒▒░▒▒▒▓▓▄▄▄▄▄░░░░░░░░░░░░░░░░░░░▒▒░░░░░░▒▒▒▄
                  ▓▒▒▒▒▓▓▓▓▓▓▓█▀░░░░░░░░░░░░░░░░░░░░░░▒░░░░░░▒▒▒▒▄
                  ▓▒▒▓▒▓█████▀░░░░░░░░░░░░░░░░░░░░░▒▒░░▒░░░░░░▒▒▒▒▒▒▄
                  ▐▒▒▒▓▀░░░▒▒▒▒░░░░░░░░░░░░░░░░░▒░▒░▒▒░░▒░░░░░▒▒▒▒▓▒▒▒▒▒▒▓▀
                  ▓▒▓▓▓▒▒▒▒▒▒▒▒▒░░░░░░░▒░░░░░░░░▒▒▒░░▒░▒▒▒▒░░▒▒▒▒▒▓ ▀▀▐▀▀
                ▄▐▓▓▒█▒▒▒▒▒▒▒▒▒▒▒▒░░░░▒▒░░░░▒░░░▒▓▀▀░░▒▒▒▒▒▒▒▒▒▒▒▒▒
              ▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▓█▓▒▒░░▒▒▒▒░░░▒░▒▒▓▒▄▄▄▄▄▌▒▒▒▒▒▒▒▒▒▒▒▓▌
               ▒▒▒▓▓▒▒▒▒▒▒▓▒▒▓▌▓▓▒▒▓▓▒░▒▒░▒▒▒▒▐█▀▒▒▒▒▓▓▒▒▓▒▒▒▒▒▒▒▓▓▒▒░▐
                ▒▒▓▓▒▒▒▒▒▒▓▓▒▒▌░▒░▒▒▓░░░░░░░░░░▓▒▒░▒▓▓▌▒▒▓▒▒▒▒▒▒▓▒▒▒▒▒
                ▒▒▌▓▓▒▒▒▒▒▓▒▒▒▒▒░░░▒░░░░░░░░░░░▐▒░░░░▓▒▒▒▓▒▒▒▒▒▒▒▓▒▒▌| ElysiaPS v1.0.1
               ▐▒▓  ▓▓▒▒▒▒▒▓▒▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▒▓▓▒▒▒▒▒▓▓▀▒▒▌
                ▒▓▌ ▐▓▓▓▓▒▒▒▓▒▒░░░░░░░░░░░░░░░░░░░░░▒▒░▓▒▒▒▒▒▓▒▓ ▐▒▒▌     | Via Matsuko
                ▀▓▓  ▐▓▒▒▒▒▓▓▓▓▓▒░░░░░░░░░░░░░░░░░░░▓▓▓▒▒▓▓▓▒▓▓  ▐▒▒
                  ▓▓▄ ▀▓▓▒▒▒▒▒▒▒▒▓▒▒▓▄▄▒░░░▒▒▄▄▄▓▓▓▒▓▒▒▒▒▒▒▓▓▓  ▄▓▒▀
                     ▀ ▀▓▓▀▓▒▒▒▒▒▒▒▓▓████▓▒▓▓▀▓▓▒▒▒▒▒▒▒▒▒▓▓▓▓ ▄▓▓▀
                           ▄▒▒▒▓▓▒▓▒▒▓▓▒▓▒▓▓▒▒▓▒▓▒▒▒▒▒▓▀ ▀▀
                             ▄▄▓██▓███▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌
                            ▓▓▀██████▒▓▒▒░░░░░░▒▒▌▒▒▒▒▒▀
                          ▄▄███████▌▌▒▓▒▒▓▒▒░░░▒▓▀▄▓▓▀▀▓▄
                       ▄▓▓▓▓█████▓▌▌▒░▐▓▒▒░░░░▒▒▒▒▓▒▒░░░▒▓▄
                      ▐▀▓▓████▀▒▒▓█▒░░▒▓▒▒▒░░░▐▌▒▒▓▓▒▒▒▒▒▓███
                     ▄▒▒▀██▀▒▒▒▓▓▓▒██▒▓▄░▒░░▒░█▄▄▄▄█▓▓▀████▀
                      ▀▒░▒░▒▀▀▀█▓▓▒███▒███████████▓▓▓▓▄ ▀▀▀
                         ▒▒   ▄▀▓▓▓▀▀██████████▀▀▀▒▒░▐▓▄
                            ▄▄▒▓▓▒░░░░░░▀███▀▄▄▓▓██▒▒▒▓▓
                           █████▓▒░░░░░░▒██▓█▀▀░░░░▒▒░▓▓▓
                          ████████▄▄▄▄▄▒▓████▒▒▄██▄▄▓▒▓▓▓▌
                           ▀▀▀   ▐██████▀▀▀▀█▓██████▀█▀▓▓▓
                                  ██████     ▐██████    ▓▓
                                  ▐█████      ██████
                                   █████       █████▌
                                    ██▓█        █████
                                    ▀▀▓▀         ▓▓██
		`);
    }
    public stop(){
        if(!this.httpServer ||!this.httpsServer){
            log("already stopped");
            return;
        }
        this.httpServer.close();
        this.httpsServer.close();
        this.httpServer = undefined;
        this.httpsServer = undefined;
    }


    async handleRequest(req: http.IncomingMessage, res: http.ServerResponse){
        const url: URL = new URL(req.url!, `http://${req.headers.host}`);
        console.log(url.pathname.split('?')[0]);
        const data = {
            path: url.pathname.split('?')[0],
        }
        if(url.pathname.includes(".ico")){
            res.writeHead(200, {
                'Content-Type': 'image/x-icon'
            })
            res.write(fs.readFileSync(`./src/routes/elysia.ico`));
            res.end();
            return;
        }
        try{
            let route = await import(`./routes${data.path}`) as IRoute;
            route.default.get(req, res);

        }catch(e){
            try{
                let rsp = await import(`./routes${data.path}`) as object;
                res.end(JSON.stringify(rsp))
            }catch(e){
                log(e)
                res.end("404");
            }
        }
    }
}
