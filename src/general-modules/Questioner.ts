import { Observable as O } from "rxjs";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input, source} from "@cycle/DOM";
import isolate from "@cycle/isolate";
import { Stream } from "xstream";
import InputField,{ Sources as InputFieldSource, Sinks as InputFieldSink} from "./InputField";
import InputArray,{ Sources as InputArraySource} from "./InputArray";
import dbDriver, {TSource as DBSource,TSink as DBSink} from "../general-function/dbDriver";

export interface Sources{
  DOM:DOMSource
  db:DBSource
  id:string
  collectionName:O<string>
}

export interface Sinks{
  DOM:O<VNode>
  db:O<DBSink>
}

export default function main(sources: Sources): Sinks {
    const { DOM,db,id, collectionName } = sources

    const questionFieldProps:InputFieldSource['props'] = O.of({name:'questionField',type:'textarea',propList:{style:'width:500px;'}})
    const questionField = isolate(InputField)({DOM,props:questionFieldProps}) as InputFieldSink
    const questionFieldValue = questionField.value

    const addFieldProps:InputFieldSource['props'] = O.of({name:'addField',type:'button',propList:{value:'Add'}})
    const addField = isolate(InputField)({DOM,props:addFieldProps}) as InputFieldSink
    const addAction = addField.value.filter(v => v!= '').map(v => parseInt(v))

    const removeFieldProps:InputFieldSource['props'] = O.of({name:'removeField',type:'button',propList:{value:'Remove'}})
    const removeField = isolate(InputField)({DOM,props:removeFieldProps}) as InputFieldSink
    const removeAction = removeField.value.filter(v => v!= '').map(v => parseInt(v)*-1)

    const submitProps:InputFieldSource['props'] = O.of({name:'submitField',type:'button',propList:{value:'Submit'}})
    const submitField = isolate(InputField)({DOM,props:submitProps}) as InputFieldSink
    const submitFieldAction = submitField.value.filter(v => v!='')

    const fieldSizeAction = O.merge(addAction,removeAction).scan((acc,val) => {
        return (acc+val > 0)? acc+val: 0
    },1).startWith(1)
    const answerField = InputArray({DOM,size:fieldSizeAction,type:O.of('text'),className:'inputField'})
    const result$ = submitFieldAction.withLatestFrom(O.combineLatest(questionFieldValue,answerField.value)).map(([,v]) => ({_id:Date.now().toString(),question:v[0],answers:v[1]}))
    const DBRequest = result$.withLatestFrom(collectionName).map<any,DBSink>(( [payload,collectionName] ) => ({command:'put',collection:collectionName,id,payload}))
    const view$ = O.combineLatest(questionField.DOM,answerField.DOM,addField.DOM,removeField.DOM,submitField.DOM).map(doms => p(doms))
    return {
        DOM: view$,
        db:DBRequest
    }
}

