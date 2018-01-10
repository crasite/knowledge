import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p, object} from "@cycle/DOM";
import { isolateSource } from "@cycle/DOM/lib/cjs/isolate";
import Questioner from "./general-modules/Questioner";
import { DOMSource } from "@cycle/DOM/lib/cjs/DOMSource";
import dbDriver, {TSource as DBSource,TSink as DBSink} from "./general-function/dbDriver";
import { Driver } from "@cycle/run/lib/cjs/types";
import { Observable as O } from "rxjs";
import { VNode } from "snabbdom/vnode";

interface Source{
    DOM: DOMSource
    db: DBSource
}

interface ISink{
    DOM:O<VNode>
    db:O<DBSink>
}

function main({DOM,db}:Source):ISink{
    const questioner = Questioner({DOM})
    db.subscribe({next:console.log,error:(e) => console.log('err',e)})
    const re$ = O.of<DBSink>({command:'get',payload:{_id:'sth'},collection:'test',id:'main'})
    return {
        DOM:questioner.DOM,
        db: re$
    }
}
run(main,{DOM:makeDOMDriver('#main-container'),db:dbDriver('main')})