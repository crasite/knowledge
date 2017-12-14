import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";
import ArrayCreator from "./ArrayCreator";

export interface Sources{
  DOM:DOMSource
}

export interface Sinks{
  DOM:O<VNode>
}

export default function main({ DOM }: Sources): Sinks {
  const action$ = O.merge(
    DOM.select('.add').events('click').mapTo(1),
    DOM.select('.remove').events('click').mapTo(-1),
  ).startWith(0)
  const model$ = action$.scan((acc,val) => {
    const newAcc = acc+val
    if(newAcc <= 0) return 1
    return newAcc
  },1)
  const arrayCollectionDom$ = ArrayCreator({ DOM, size: model$ }).DOM
  const vdom$ = arrayCollectionDom$.map(view)
  return { DOM: vdom$ }
}

function view(arrayNode:VNode){
  return p([
    button('.add','+'),
    button('.remove','-'),
    arrayNode
  ])
}