import { test } from "ava";
import { relationBetweenLine } from "./relation";

test('identity line',t => {
    const result = relationBetweenLine([[14,-1,15],[-6,4.5,-9]],[[12,0.5,12],[-4,3,-6]]).toPromise()
    const expect = 'identisch'
    return result.then(v => {
        t.deepEqual(v,expect)
    })
})

test('windschief line',t => {
    const result = relationBetweenLine([[1,1,1],[+1,3,-6]],[[4,1,0],[0,0,1]]).toPromise()
    const expect = 'windschief'
    return result.then(v => {
        t.deepEqual(v,expect)
    })
})

test('Intersect line',t => {
    const result = relationBetweenLine([[10,1,8],[4,0,5]],[[0,1,12],[2,0,-3]]).toPromise()
    const expect = [-1,3]
    return result.then(v => {
        t.deepEqual(v,expect)
    })
})