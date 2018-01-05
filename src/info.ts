import { Observable as O } from "rxjs";
import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p} from "@cycle/DOM";
import { default as InfoSection } from "./general-modules/InfoSection";
import { default as InputField } from "./general-modules/InputField";

function main(source:any){
    const infoSection = InfoSection({DOM:source.DOM,props:{source:'../markdowns/sample.md'}})
    const textInput = InputField({DOM:source.DOM,props:O.of({name:'sample',type:'text',})})
    return {
        DOM:textInput.DOM,
    }
}
run(main,{DOM:makeDOMDriver('#main-container')})