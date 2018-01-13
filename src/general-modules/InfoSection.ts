
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import { Stream } from "xstream";
import { MarkdownIt } from "markdown-it"; 
 import createVNode from "../general-function/createVNode";

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
    const vdom = props.flatMap(props => O.ajax({method:'GET',url:props.source,responseType:'text'})).map(v => {
        const md = require('markdown-it')() as MarkdownIt
        md.use(require('markdown-it-texmath').use(require('katex')))
        return view(createVNode(md.render(v.response)))
    })
    return {
        DOM: vdom
    }
}

function view(node:VNode){
    return div('.infoSection',node)
}