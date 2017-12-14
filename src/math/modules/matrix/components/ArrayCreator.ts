import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource;
  size:O<number>
}

export interface Sinks{
  DOM:O<VNode>
}

export default function main({DOM,size}:Sources):Sinks{
   let vdom$ = size.map(view) 
   return {DOM:vdom$}
}

function view(size:number){
    let childs:VNode[] = []
    for(let i = 0;i<size;i++){
        childs.push(input(`.${i}`,{attrs:{type:'number'}}))
    }
    return div(childs)
}
