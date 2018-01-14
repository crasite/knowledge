import { Observable as O } from "rxjs";
import { MarkdownIt } from "markdown-it"; 
import createVNode from "../general-function/createVNode";
import isolate from "@cycle/isolate";
import InputField,{ Sources as InputFieldSource, Sinks as InputFieldSink} from "./InputField";
import { VNode,DOMSource,makeDOMDriver, div, button, p, input,span} from "@cycle/DOM";
import dbDriver, {TSource as DBSource,TSink as DBSink} from "../general-function/dbDriver";
import InputArray,{ Sources as InputArraySource} from "./InputArray";
import { Stream } from "xstream";

export interface Sources{
  DOM:DOMSource
  db:DBSource
  questionSet:string
  update:O<number>
}

export interface Sinks{
  DOM:O<VNode>
  db:O<DBSink>
}

export default function main({DOM,db,questionSet,update}:Sources):Sinks{
    const requestForQuestion = update.mapTo({command:'alldocs',collection:questionSet,payload:{},id:'qlist'}) as O<DBSink>
    const md = require('markdown-it')() as MarkdownIt
    md.use(require('markdown-it-texmath').use(require('katex')))

    const checkButtonProps:InputFieldSource['props'] = O.of({name:'checkButton',type:'button',propList:{value:'Check'}})
    const checkButton = isolate(InputField)({DOM,props:checkButtonProps}) as InputFieldSink
    const checkAction = checkButton.value.filter(v => v!= '').map(v => parseInt(v))

    const nextButtonProps:InputFieldSource['props'] = O.of({name:'nextButton',type:'button',propList:{value:'Next'}})
    const nextButton = isolate(InputField)({DOM,props:nextButtonProps}) as InputFieldSink
    const nextAction = nextButton.value.filter(v => v!= '').map(v => parseInt(v)).startWith(1)

    const questions = db.filter(res => res.id == 'qlist').map(res => {
        if (isFindResponse(res.response)) {
            if(res.response.docs.length == 0){
                return {docs:[{question:'Please add question',answers:[]}],arrangement:[0],index:0}
            }
            const arrangement = shuffle(Array.from(Array(res.response.docs.length).keys()))
            return { docs: res.response.docs, arrangement, index: 0 }
        }
    })
    const currentQuestion = questions.combineLatest(nextAction).map(([question, click]) => {
        if (question.index < question.docs.length - 1) {
            question.index += 1
        } else {
            question.index = 0
        }
        return question
    }).map(q => q.docs[q.arrangement[q.index]]).share()

    const answerFields = currentQuestion.map(res => {
        return InputArray({DOM,size:O.of(res.answers.length),type:O.of('text'),className:'answerField'})
    })
    const answerFieldsDOM = answerFields.flatMap(v => v.DOM)
    const answerFieldsValue = answerFields.flatMap(v => v.value)

    const checkAnswer = checkAction.withLatestFrom(answerFieldsValue,currentQuestion).map(([,answer,docs]) => {
        return docs.answers.map((cur,ind) => {
            if(cur == answer[ind]) return "Richtig"
            return cur
        })
    }).map(v => div(v.map(a => span(a)))).startWith(null)

    const resultField = answerFieldsDOM.combineLatest(checkAnswer.merge(nextAction.mapTo(null))).map(v => div('.result',v))

    const view = currentQuestion.map(res => {
            return createVNode(md.render(res.question))
    }).combineLatest(resultField,checkButton.DOM,nextButton.DOM).map(node => div(node))

    return{
        DOM:view,
        db:requestForQuestion
    }
}

function isFindResponse(res:PouchDB.Core.Response | PouchDB.Find.FindResponse<any>):res is PouchDB.Find.FindResponse<{question:string,answers:string[]}>{
    if((res as PouchDB.Find.FindResponse<any>).docs){
        return true
    }
    return false
}

function shuffle<T>(array:T[]) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}