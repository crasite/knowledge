import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p} from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";
import MatrixCreator from "./modules/matrix/components/MatrixCreator";
import { gaussJordan,matrixDisplayer } from "./modules/matrix/matrix";
import { default as toFraction } from "./modules/numberToFraction";
import { default as InfoSection } from "../general-modules/InfoSection";

function main(source:any){
    const matrixCreator = MatrixCreator({DOM:source.DOM})
    const rs = matrixCreator.matrix.concatMap(gaussJordan)
    const infoSection = InfoSection({DOM:source.DOM,props:{source:'../markdowns/sample.md'}})
    const vdom$ = matrixCreator.DOM.combineLatest(rs,infoSection.DOM).map(([v,{matrix,index},inf]) => {
        return div([v,matrixDisplayer(matrix),inf])
    })
    return {
        DOM:vdom$,
    }
}
run(main,{DOM:makeDOMDriver('#main-container')})