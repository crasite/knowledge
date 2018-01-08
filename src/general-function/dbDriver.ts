import  PouchDB from 'pouchdb'
import {adapt} from '@cycle/run/lib/adapt'
import { Observable as O } from "rxjs";
import xs from "xstream";

interface IPut{
    command: 'put' 
    payload:{_id:string,_rev?:string,[others:string]:any}
    db:string
    id:string
}
interface IGet{
    command: 'get' 
    payload:{_id:string}
    db:string
    id:string
}
interface IAlldocs{
    command: 'alldocs'
    payload:PouchDB.Core.AllDocsOptions
    db:string
    id:string
}

export type TSink = IPut | IGet | IAlldocs

export type TSource = O<PouchDB.Core.Response>

export default function dbDriver(sink:xs<TSink>){
    const source =  xs.create({
        start: (listener) => {
            sink.subscribe({
                next: (sink) => {
                    if(sink.db == void 0) return
                    const db = new PouchDB(sink.db, { revs_limit: 1, auto_compaction: true })
                    if (sink.command == 'put') {
                        if (confirm('Add Document?' + JSON.stringify(sink.payload))) {
                            db.put(sink.payload).then(response => listener.next({ response, id: sink.id })).then(() => db.close()).catch(e => { listener.error({ response: e, id: sink.id }) })
                        }
                    }
                    if (sink.command == 'get') {
                        db.get(sink.payload._id).then(response => listener.next({response,id:sink.id})).then(() => db.close()).catch(e => {listener.error({response:e,id:sink.id})})
                    }
                    if (sink.command == 'alldocs') {
                        db.allDocs(sink.payload).then(response => listener.next({response,id:sink.id})).then(() => db.close()).catch(e => {listener.error({response:e,id:sink.id})})
                    }
                },
                complete: () => { },
                error: () => { }
            })
        },
        stop: () => { }
    })
    return adapt(source)
}