
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import { Stream, MemoryStream } from "xstream";
import { MarkdownIt } from "markdown-it"; 
 import createVNode from "../general-function/createVNode";
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";

export interface Sources{
  DOM:DOMSource
  props:O<{
      source: string
  }>
}

export interface Sinks{
  DOM:O<VNode>
}

export default function main({DOM,props}:Sources):Sinks{
    const element = O.of(1).flatMap(v => DOM.select('.info').elements() as MemoryStream<Element[]>).take(1)
    const vdom = props.flatMap(props => O.ajax({method:'GET',url:props.source,responseType:'text'}).startWith<AjaxResponse|any>({response:"loading"})).map(v => {
        const md = require('markdown-it')() as MarkdownIt
        md.use(require('markdown-it-texmath').use(require('katex')))
        return md.render(v.response)
    }).combineLatest(element).subscribe(([html,element]) => {element[0].innerHTML = html})
    const Sview = O.of(div(".info"))
    return {
        DOM: Sview
    }
}

function view(node:VNode){
    return div('.infoSection',node)
}