import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource;
  size:O<number>;
  type:O<string>;
  className?:string;
}

export interface Sinks{
  DOM:O<VNode>;
  value:O<string[]>
}

export default function main({ DOM, size, type, className }: Sources): Sinks {
  const action$ = DOM.select('input').events('input').map(v => {
    const index = parseInt((v.currentTarget as HTMLElement).id)
    const value = (v.currentTarget as HTMLInputElement).value
    if(!value) return {index,value:''}
    return {index,value}
  }).startWith(undefined)
  const value$ = O.combineLatest(size,action$).scan((acc:string[],[size,v]) => {
    let value:string,index:number = undefined
    if(v){
      value = v.value
      index = v.index
    }
    while(acc.length<size){
      acc.push('')
    }
    if (acc.length > size){
      acc.pop()
    } else {
      if(index != undefined){
        acc[index] = value
      }
    }
    return acc
  },[])
  const vdom$ = size.combineLatest(type).map(([size,type]) => view(size,type,className))

  return { DOM: vdom$,value:value$ }
}

function view(size:number,type:string,className:string){
    let childs:VNode[] = []
    for(let i = 0;i<size;i++){
        childs.push(input(`#${i}${className?'.'+className:''}`,{attrs:{type}}))
    }
    return div(childs)
}
