import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p} from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";
import { gaussJordan } from "./modules/matrix/matrix";

function main(source:any){
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const rs = matrixCreator.matrix.switchMap(gaussJordan)
    const vdom$ = matrixCreator.DOM.combineLatest(rs).map(([v,{matrix,index}]) => {
        return div([v,p(`${matrix}`)])
    })
    matrixCreator.matrix.subscribe(console.log)
    return {
        DOM:vdom$,
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})