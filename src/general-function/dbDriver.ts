import  PouchDB from 'pouchdb'

export default function createDriver(dbName:string){
    const db = new PouchDB(dbName,{revs_limit:1,auto_compaction:true})
    db.put({_id:'2',version:1}).then(_ => db.allDocs()).then(v => console.log(v))
    return function(){

    }
}