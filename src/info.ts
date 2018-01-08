import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p, object} from "@cycle/DOM";
import { isolateSource } from "@cycle/DOM/lib/cjs/isolate";
import Questioner from "./general-modules/Questioner";
import { DOMSource } from "@cycle/DOM/lib/cjs/DOMSource";
import makeDbDriver from "./general-function/dbDriver";
import { Driver } from "@cycle/run/lib/cjs/types";

interface Source{
    DOM: DOMSource
    db:Driver<any,any>
}

function main({DOM}:Source){
    const questioner = Questioner({DOM})
    return {
        DOM:questioner.DOM,
    }
}
run(main,{DOM:makeDOMDriver('#main-container'),db:makeDbDriver('main.db')})