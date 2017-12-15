import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource;
  size:O<number>
}

export interface Sinks{
  DOM:O<VNode>;
  value:O<number[]>
}

export default function main({ DOM, size }: Sources): Sinks {
  const action$ = DOM.select('input').events('input').map(v => {
    const index = parseInt((v.currentTarget as HTMLElement).className)
    const value = parseInt((v.currentTarget as HTMLInputElement).value)
    if(!value) return {index,value:0}
    return {index,value}
  }).startWith({index:0,value:0})
  const value$ = O.combineLatest(size,action$).scan((acc:number[],[size,{index,value}]) => {
    while(acc.length<size){
      acc.push(0)
    }
    if (acc.length > size){
      acc.pop()
    } else {
      acc[index] = value
    }
    return acc
  },[])
  const vdom$ = size.map(view)

  return { DOM: vdom$,value:value$ }
}

function view(size:number){
    let childs:VNode[] = []
    for(let i = 0;i<size;i++){
        childs.push(input(`.${i}`,{attrs:{type:'number'},props:{value:0}}))
    }
    return div(childs)
}
