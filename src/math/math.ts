import { run } from "@cycle/rxjs-run";
import { makeDOMDriver } from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";

function main(source:any){
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const vdom$ = matrixCreator.DOM
    matrixCreator.matrix.subscribe(console.log)
    return {
        DOM:vdom$,
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})