import { run } from "@cycle/rxjs-run";
import { makeDOMDriver } from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";

function main(source:any){
    // const child = isolate(ValueSelector,'selector1')({DOM:source.DOM,props:{default:20,min:0,max:100}})
    // const child = ValueSelector({DOM:source.DOM,props:{default:20,min:0,max:100}})
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const vdom$ = matrixCreator.DOM
    return {
        DOM:vdom$,
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})