import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver,h,nav, p, h1, header, div} from "@cycle/DOM";
import { run } from "@cycle/rxjs-run";
import { Stream } from "xstream";
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";

export interface Sources{
  DOM:DOMSource;
}

export interface Sinks{
  DOM:O<VNode>;
}

export default function main({ DOM }: Sources): Sinks {
    O.ajax("./file").map<AjaxResponse,string[]>(v => v.response.files).subscribe(console.log)

    const navigation = nav([div('Math'),div('Physics')])
    const mainContent = h("main",[p("main")])
    const view = div("#main-container",
        [header(h1("Header")), navigation, mainContent]
    )
    return {
        DOM:O.of(view)
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})