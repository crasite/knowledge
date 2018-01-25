
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import { Stream, MemoryStream } from "xstream";
import { MarkdownIt } from "markdown-it"; 
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";
const md = require('markdown-it')() as MarkdownIt
md.use(require('markdown-it-texmath').use(require('katex')))

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
    const element = props.flatMap(v => DOM.select('.info').elements().filter(e => e.length > 0).take(1) as MemoryStream<Element[]>)
    const vdom = props.switchMap(props => O.ajax({method:'GET',url:props.source,responseType:'text'}).startWith<AjaxResponse|any>({response:"loading"}).catch(e => O.of({response:'Error'}))).map(v => {
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