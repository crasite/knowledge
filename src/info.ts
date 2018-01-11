import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p, object} from "@cycle/DOM";
import { isolateSource } from "@cycle/DOM/lib/cjs/isolate";
import Questioner from "./general-modules/Questioner";
import { DOMSource } from "@cycle/DOM/lib/cjs/DOMSource";
import dbDriver, {TSource as DBSource,TSink as DBSink} from "./general-function/dbDriver";
import { Driver } from "@cycle/run/lib/cjs/types";
import { Observable as O } from "rxjs";
import { VNode } from "snabbdom/vnode";
import { default as Tester } from "./general-modules/Tester";

interface Source{
    DOM: DOMSource
    db: DBSource
}

interface ISink{
    DOM:O<VNode>
    db:O<DBSink>
}

function main({DOM,db}:Source):ISink{
    db.subscribe()
    const questioner = Questioner({DOM,db,id:'q1',collectionName:'math'})
    const tester = Tester({DOM,db,questionSet:'math',update:questioner.db.mapTo(1).startWith(1)})
    return {
        DOM:O.combineLatest(questioner.DOM,tester.DOM).map(v => div(v)),
        db:tester.db.merge(questioner.db)
    }
}
run(main,{DOM:makeDOMDriver('#main-container'),db:dbDriver('main')})