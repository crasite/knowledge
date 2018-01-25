import { run } from "@cycle/rxjs-run";
import { DOMSource,makeDOMDriver, div,p} from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";
import { gaussJordan,matrixDisplayer } from "./modules/matrix/matrix";
import { default as toFraction } from "./modules/numberToFraction";
import { default as InfoSection } from "../general-modules/InfoSection";

interface ISource {
    DOM:DOMSource
}

export default function main(source:ISource){
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const rs = matrixCreator.matrix.concatMap(gaussJordan)
    const vdom$ = matrixCreator.DOM.combineLatest(rs).map(([v,{matrix,index}]) => {
        console.log(matrix)
        return div([v,matrixDisplayer(matrix)])
    })
    return {
        DOM:vdom$,
    }
}