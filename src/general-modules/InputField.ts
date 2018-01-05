import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource
  props:O<{
    name:string;
    type:string;
    propList?:{[propName:string]:string}
  }>
}

export interface Sinks{
  DOM:O<VNode>
  value:O<string>
}

export default function main(sources:Sources):Sinks{
  const {props,DOM} = sources
  const action$ = props.flatMap(p => sources.DOM.select(`.${p.name}`).events("input"))
    .pluck('target').pluck<{},string>('value').startWith(undefined)
  const dom$ = view(sources.props)
  return {
    DOM:dom$,
    value:action$
  }
}

function view(props:Sources['props']){
  return props.map(({name,type,propList}) => {
    return p([
      input(`.${name}`,{attrs:{type:type},props:propList}),
    ])
  })
}