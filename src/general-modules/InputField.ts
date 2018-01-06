import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source, textarea} from "@cycle/DOM";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource
  props:O<{
    name:string;
    type:string;
    propList?:{[propName:string]:string};
  }>
  initialValue?:string
}

export interface Sinks{
  DOM:O<VNode>
  value:O<string>
}

export default function main(sources:Sources):Sinks{
  const {props,DOM, initialValue} = sources
  const action$ = props.flatMap<any,any>(p => { 
    if(p.type != 'button') return sources.DOM.select(`.${p.name}`).events("input") 
    return sources.DOM.select(`.${p.name}`).events("click").mapTo({target:{value:'1'}})
  })
  .pluck('target').pluck<any,string>('value').startWith((initialValue)?initialValue:'').share()
  const dom$ = view(sources.props)
  return {
    DOM:dom$,
    value:action$
  }
}

function view(props: Sources['props']) {
  return props.map(({ name, type, propList }) => {
    if (type == 'textarea') {
      return p([
        textarea(`.${name}`, { props: propList }),
      ])
    }
    return p([
      input(`.${name}`, { attrs: { type: type }, props: propList }),
    ])
  })
}