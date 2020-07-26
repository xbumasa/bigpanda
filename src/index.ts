import express, { Application, Response, Request } from 'express';
import { readFileSync } from "fs";
import { spawn } from 'child_process';
import { BehaviorSubject } from "rxjs";
import CalculateItems from "./CalculateItems";

const app: Application = express ();

let events = new CalculateItems();
let words = new CalculateItems();

let events_cache = new BehaviorSubject(events.getItemsJSON());
let words_cache = new BehaviorSubject(words.getItemsJSON());

(async () => {
    //execute generator
    const incoming = spawn('./generator/generator-linux-amd64')

    incoming.stdout.on('data', (data) => {
        data.toString().split('\n').map((row: string) => {
            try{
                const jrow = JSON.parse(row)

                events.Calculate(jrow['event_type'])
                events_cache.next(events.getItemsJSON())

                words.Calculate(jrow['data'])
                words_cache.next(words.getItemsJSON())
            }
            catch(e){
            }
        });
    });

    incoming.stderr.on('data', (e) => {
        throw e;
    })
})();

///index (/)
const index = readFileSync('./index.html', 'utf8');
app.get('/', (req, res) => res.send(index));

///events
app.get('/events', (req:Request, res:Response) => {
    try{
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });

        res.flushHeaders();
        res.write('retry: 10000\n\n');

        events_cache.subscribe((value) => {
            res.write(`data: events:${value}\n\n`)
        })

        words_cache.subscribe((value) => {
            res.write(`data: words:${value}\n\n`)
        })
    }
    catch(e){
        console.log(e.message)
    }
});

app.listen(3003, () => { });

process.on('uncaughtException', e => {
    console.log(e.message)
    process.exit(1)
})

