import './style.styl'
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver,h,nav, p, h1, header, div, a, span} from "@cycle/DOM";
import { run } from "@cycle/rxjs-run";
import { Stream } from "xstream";
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";
import InfoSection from "./general-modules/InfoSection";
import isolate from '@cycle/isolate';

export interface Sources{
  DOM:DOMSource;
}
export interface Sinks{
  DOM:O<VNode>;
}
interface ICategoryList{
    [dic:string]:string[]
}

export default function main({ DOM }: Sources): Sinks {
    const navigation = O.ajax("./file").map<AjaxResponse,string[]>(v => v.response.files).map(fileList => {
            const obj:ICategoryList = {}
            const splittedParts = fileList.map(fileName => fileName.split("-",2)).filter(SplitedPart => SplitedPart.length > 1)
            splittedParts.map(splittedPart => {
                obj[splittedPart[0]] = (obj[splittedPart[0]])? [...obj[splittedPart[0]],splittedPart[1]]: [splittedPart[1]]
            })
            return obj // return {math:['file1'.md,'file2'.md],physics:['file3'.md,'file4'.md]}
        }).map(obj => {
            // Create Nav Elements
            function toLink(key:string,fileName:string){
                const displayName = fileName.match(/[A-Z][a-z]+/g).reduce((acc,val) => acc+" "+val)
                return a({dataset:{source:`/markdowns/${key}-${fileName}`}},displayName)
            }
            return Object.keys(obj).map(keys => {
                const childs = obj[keys].map(fileName => toLink(keys,fileName))
                return div([span(keys),div(childs)])
            })
    }).map(elements => nav(elements))
    const SSelection = DOM.select('a').events("click").map(event => event.target as HTMLAnchorElement).map(element => ({source:element.dataset.source})).startWith({source:'/markdowns/sample.md'})

    const infoSection = isolate(InfoSection)({DOM,props:O.from(SSelection)})
    const mainContent = h("main",[p("main")])
    const view = navigation.combineLatest(infoSection.DOM).map(([navElement,infoSection]) => 
        div("#main-container",[header(h1("Header")),navElement,infoSection])
    )
    return {
        DOM:view
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})