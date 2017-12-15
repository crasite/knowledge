import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";
import isolate from "@cycle/isolate";
import ArrayCreator, {Sinks as ACSink} from "./ArrayCreator";

export interface Sources{
  DOM:DOMSource
}

export interface Sinks{
  DOM:O<VNode>
  matrix:O<number[][]>
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
  const widthModel$ = Stream.fromObservable(widthAction$.scan((acc,val) => {
    const newAcc = acc+val
    if(newAcc <= 0) return 1
    return newAcc
  },1)).remember()
  const heightModel$ = heightAction$.scan((acc,val) => {
    const newAcc = acc+val
    if(newAcc <= 0) return 1
    return newAcc
  },1)
  const arrayCollectionSink$ = heightModel$.scan((acc:ACSink[],val) => {
    if(acc.length < val){
      const component:ACSink = isolate(ArrayCreator,val)({ DOM, size: widthModel$ })
      return [...acc,component]
    } else {
      return acc.slice(0,val)
    }
  },[])
  const vdom$ = arrayCollectionSink$.switchMap(sinks => O.combineLatest(sinks.map(sink => sink.DOM))).map(view)
  const result = arrayCollectionSink$.switchMap(sinks => O.combineLatest(sinks.map(sink => sink.value)))
  return { DOM: vdom$, matrix:result }
}

function view(arrayNode:VNode[]){
  return p([
    button('.addColumn','+'),
    button('.removeColumn','-'),
    button('.addRow','+'),
    button('.removeRow','-'),
    ...arrayNode
  ])
}