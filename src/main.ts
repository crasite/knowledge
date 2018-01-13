import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver,h,nav, p, h1, header, div, a} from "@cycle/DOM";
import { run } from "@cycle/rxjs-run";
import { Stream } from "xstream";
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";

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
            return a({attrs:{href:`/markdowns/${key}-${fileName}`}},displayName)
        }
        return Object.keys(obj).map(keys => {
            const childs = obj[keys].map(fileName => toLink(keys,fileName))
            console.log(childs)
            return div([keys,div(childs)])
        })
    }).map(elements => nav(elements))

    const mainContent = h("main",[p("main")])
    const view = navigation.map(navElement => 
        div("#main-container",[header(h1("Header")),navElement,h("main",[p("main")])])
    )
    return {
        DOM:view
    }
}

run(main,{DOM:makeDOMDriver('#main-container')})