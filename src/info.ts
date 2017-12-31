import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, div,p} from "@cycle/DOM";
import { default as InfoSection } from "./general-modules/InfoSection";

function main(source:any){
    const infoSection = InfoSection({DOM:source.DOM,props:{source:'../markdowns/sample.md'}})
    return {
        DOM:infoSection.DOM,
    }
}
run(main,{DOM:makeDOMDriver('#main-container')})