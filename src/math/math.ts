import { gaussJordan , createMatrix } from "./modules/matrix/matrix";
import { Observable as O } from "rxjs";
import { run } from "@cycle/rxjs-run";
import { makeDOMDriver } from "@cycle/DOM";
import isolate from "@cycle/isolate"
import { default as ValueSelector } from "../general-modules/ValueSelector";

let matrix = createMatrix([1,0,0,0,1,0,1,2,0,0,0,1,-1,-1,0],5)
let matrix2 = createMatrix([2,1,-1,-1,3,0,2,-1,0,4,5,3,-1,0,-1],5)
let matrix3 = [[2,1,7.1],[0,2,5],[5,3,0]]
gaussJordan(matrix2).subscribe(console.log)

function main(source:any){
    const child = isolate(ValueSelector,'selector1')({DOM:source.DOM,props:{default:20,min:0,max:100}})
    // const child = ValueSelector({DOM:source.DOM,props:{default:20,min:0,max:100}})
    const vdom$ = child.DOM
    return {
        DOM:vdom$,
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})