import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p} from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";
import { gaussJordan,matrixDisplayer } from "./modules/matrix/matrix";
import { default as toFraction } from "./modules/numberToFraction";

function main(source:any){
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const rs = matrixCreator.matrix.concatMap(gaussJordan)
    const vdom$ = matrixCreator.DOM.combineLatest(rs).map(([v,{matrix,index}]) => {
        return div([v,matrixDisplayer(matrix)])
    })
    return {
        DOM:vdom$,
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})