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
  const widthAction$ = O.merge(
    DOM.select('.addColumn').events('click').mapTo(1),
    DOM.select('.removeColumn').events('click').mapTo(-1),
  ).startWith(0)
  const heightAction$ = O.merge(
    DOM.select('.addRow').events('click').mapTo(1),
    DOM.select('.removeRow').events('click').mapTo(-1),
  ).startWith(0)
  const widthModel$ = widthAction$.scan((acc,val) => {
    const newAcc = acc+val
    if(newAcc <= 0) return 1
    return newAcc
  },1)
  const heightModel$ = heightAction$.scan((acc,val) => {
    const newAcc = acc+val
    if(newAcc <= 0) return 1
    return newAcc
  },1)

  const arrayCollectionSink$ = ArrayCreator({ DOM, size: widthModel$ })
  const vdom$ = arrayCollectionSink$.DOM.map(view)
  return { DOM: vdom$ }
}

function view(arrayNode:VNode){
  return p([
    button('.addColumn','+'),
    button('.removeColumn','-'),
    button('.addRow','+'),
    button('.removeRow','-'),
    arrayNode
  ])
}