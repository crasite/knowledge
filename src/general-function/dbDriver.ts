import  PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import {adapt} from '@cycle/run/lib/adapt'
import { Observable as O } from "rxjs";
import xs from "xstream";
PouchDB.plugin(PouchDBFind)

export type Sub<
    O extends string,
    D extends string
    > = {[K in O]: (Record<D, never> & Record<string, K>)[K]}[O]
export type Omit<O, D extends string> = Pick<O, Sub<keyof O, D>>

interface IPut{
    command: 'put' 
    payload:{_id:string,_rev?:string,[others:string]:any}
    collection:string
    id:string
}
interface IGet{
    command: 'get' 
    payload:{_id:string}
    collection:string
    id:string
}
interface IAlldocs{
    command: 'alldocs'
    payload:Omit<PouchDB.Find.FindRequest<{}>,'selector'>
    collection:string
    id:string
}

export type TSink = IPut | IGet | IAlldocs

export type TSource = O<PouchDB.Core.Response | PouchDB.Find.FindResponse<{}>>

export default function createDbDriver(dbname: string) {
    const db = new PouchDB(dbname,{ revs_limit: 1, auto_compaction: true })
    db.createIndex({index:{fields:['collection'],name:'collectionIndex'}}).catch()
    return function dbDriver(sink: xs<TSink>) {
        const source = xs.create({
            start: (listener) => {
                sink.subscribe({
                    next: (sink) => {
                        console.log(sink.command)
                        if (sink.collection == void 0) return
                        if (sink.command == 'put') {
                            if(confirm('Do you want to submit the question?')){
                                db.put({...sink.payload,collection:sink.collection}).then(response => listener.next({ response, id: sink.id })).catch(e => { listener.error({ response: e, id: sink.id }) })
                            }
                        }
                        if (sink.command == 'get') {
                            db.find({selector:{collection:sink.collection,_id:{$eq:sink.payload._id}}}).then(response => listener.next({ response, id: sink.id })).catch(e => { listener.next({ response: e, id: sink.id }) })
                        }
                        if (sink.command == 'alldocs') {
                            db.find({...sink.payload,selector:{collection:sink.collection}}).then(response => listener.next({ response, id: sink.id })).catch(e => { listener.error({ response: e, id: sink.id }) })
                        }
                    },
                    complete: () => { },
                    error: () => { }
                })
            },
            stop: () => { db.close() }
        })
        return adapt(source)
    }
}