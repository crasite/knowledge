import './style.styl'
import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver,h,nav, p, h1, header, div, a, span, section} from "@cycle/DOM";
import { run } from "@cycle/rxjs-run";
import { Stream } from "xstream";
import { AjaxResponse } from "rxjs/observable/dom/AjaxObservable";
import dbDriver, {TSink as DBSink,TSource as DBSource} from "./general-function/dbDriver";
import InfoSection from "./general-modules/InfoSection";
import Questioner from "./general-modules/Questioner";
import Tester from "./general-modules/tester";
import isolate from '@cycle/isolate';

export interface Sources{
  DOM:DOMSource;
  db:DBSource;
}
export interface Sinks{
  DOM:O<VNode>;
  db:O<DBSink>;
}
interface ICategoryList{
    [dic:string]:string[]
}

export default function main({ DOM,db }: Sources): Sinks {
    const sectionSelection = O.merge(DOM.select("nav p#content").events("click").mapTo('content'),
        DOM.select("nav p#question").events("click").mapTo('question'),
        DOM.select("nav p#tester").events("click").mapTo('tester')).startWith('content')

    const navigationElement = O.ajax("./file").map<AjaxResponse,string[]>(v => v.response.files).map(fileList => {
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
    const markdownSelection = DOM.select('a').events("click").map(event => event.target as HTMLAnchorElement).map(element => ({source:element.dataset.source})).startWith({source:'/markdowns/sample.md'})

    const infoSectionProp = O.from(markdownSelection).combineLatest(sectionSelection).flatMap(([markdownSelection,sectionSelection]) => (sectionSelection == 'content')?O.of(markdownSelection):O.empty())
    const infoSection = isolate(InfoSection)({DOM,props:infoSectionProp})
    const questionerDB = O.from(markdownSelection.map(link => /\/([A-z-]+?).md$/.exec(link.source)[1]))
    const questioner = Questioner({DOM,db,id:'q1',collectionName:questionerDB})

    const mainContent = O.combineLatest(sectionSelection,infoSection.DOM,questioner.DOM).map(([section,infoSection,questioner]) => {
        if(section == 'content') return infoSection
        else return questioner
    }).map(infoSection => {
        return h("main",[
            nav([p("#content","Content"),p("#question","Question"),p("#tester","Tester")]),
            infoSection
        ])
    }).startWith(p("Loading"))

    const view = navigationElement.combineLatest(mainContent).map(([navElement,mainContent]) => 
        div("#main-container",[header(h1("Header")),navElement,mainContent])
    )
    db.subscribe(console.log)
    return {
        DOM:view,
        db:questioner.db
    }
}

run(main,{DOM:makeDOMDriver('#main-container'),db:dbDriver('main')})