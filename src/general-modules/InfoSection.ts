
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import { Stream } from "xstream";
import { MarkdownIt } from "markdown-it";

export interface Sources{
  DOM:DOMSource
  props:{
      source: string
  }
}

export interface Sinks{
  DOM:O<VNode>
}

export default function main(sources:Sources):Sinks{
    O.ajax({method:'GET',url:sources.props.source,responseType:'text'}).map(v => {
        const md = require('markdown-it')() as MarkdownIt
        return md.render(v.response)
    }).subscribe(console.log)
    return {
        DOM: O.of(div())
    }
}