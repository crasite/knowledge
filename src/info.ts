import { Observable as O } from "rxjs";
import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p, object} from "@cycle/DOM";
import isolate from "@cycle/isolate";
import xs from 'xstream'
import { adapt } from "@cycle/run/lib/adapt";
import { isolateSource } from "@cycle/DOM/lib/cjs/isolate";
import Questioner from "./general-modules/Questioner";
import { DOMSource } from "@cycle/DOM/lib/cjs/DOMSource";

interface Source{
    DOM: DOMSource
}

function main({DOM}:Source){
    const questioner = Questioner({DOM})
    return {
        DOM:questioner.DOM,
    }
}
run(main,{DOM:makeDOMDriver('#main-container')})
