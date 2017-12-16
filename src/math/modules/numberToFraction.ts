export default function toFraction(decimalNumber:number){
    const regex = /(-?\d+)\.(\d+?)(\d+)\3+\d?$/
    const regResult = regex.exec(decimalNumber.toString())
    if(!regResult) return decimalNumber
    const fraction = createFraction(regResult[2],regResult[3])
    return beautify(regResult[1],fraction[0],fraction[1])
}

function createFraction(nonRepeat:string,repeat:string){
    const nine = parseInt("9".repeat(repeat.length))
    const top = parseInt(nonRepeat)*nine+parseInt(repeat)
    const denom = nine*Math.pow(10,nonRepeat.length)
    const GCD = findGCD(top,denom)
    return[top/GCD,denom/GCD]
}

function findGCD(num1: number, num2: number):number {
    if (!num2) {
        return num1;
    }
    return findGCD(num2, num1 % num2);
};

function beautify(main:string,top:number,denom:number){
    let front = ''
    if (/-0/.test(main)) {
        return `-${top}/${denom}`
    } else if(!/^0/.test(main)){
        front = main
        return `${front}+${top}/${denom}`
    }
    return `${top}/${denom}`
}