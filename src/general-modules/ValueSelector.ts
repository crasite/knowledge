import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource
  props:{
    min:number;
    max:number;
    default:number;
  }
}

export interface Sinks{
  DOM:O<VNode>
}

export default function main(sources:Sources):Sinks{
  const action$ = O.merge(
    sources.DOM.select('.slider').events("change"),
    sources.DOM.select('.textbox').events("input"))
    .pluck('target').pluck<{},number>('value').startWith(undefined)
  const model$ = action$.map(value => {
    if(value != undefined){
      if(value>sources.props.max) return {...sources.props,default:sources.props.max}
      if(value<sources.props.min) return {...sources.props,default:sources.props.min}
      if(!value) return {...sources.props,default:0}
      return {...sources.props,default:value}
    } 
    return sources.props
  })
  const view$ = model$.map(view)
  return {
    DOM:view$
  }
}

function view(props:Sources['props']){
  const {min,default:begin,max} = props
  return p([
    input('.slider',{attrs:{type:'range',min,max},props:{value:begin}}),
    input('.textbox',{attrs:{type:'number'},props:{value:begin}}),
  ])
}