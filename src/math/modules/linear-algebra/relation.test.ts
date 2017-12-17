import { test } from "ava";
import { relationBetweenLine, relationBetweenLineAndPlane, toNormal, relationBetweenPlane } from "./relation";

//Line Relation
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

test('Real Parallel line',t => {
    const result = relationBetweenLine([[14,-3,1],[-6,4.5,-9]],[[13,0.5,12],[-4,3,-6]]).toPromise()
    const expect = 'echte Parallel'
    return result.then(v => {
        t.deepEqual(v,expect)
    })
})

//Line - Plane relation
test('Line Cut Plane',t => {
    const line = [[3,2,4],[1,1,-3]]
    const plane = [[2,-2,-10],[-2,5,1],[6,-3,-2]]
    const result = relationBetweenLineAndPlane(line,plane)
    const expect = 5
    t.deepEqual(result,expect)
})

test('Line is on Plane',t => {
    const line = [[5,3,7],[0,1,3]]
    const plane = [13,-6,2,61]
    const result = relationBetweenLineAndPlane(line,plane)
    const expect = "liegt im"
    t.deepEqual(result,expect)
})

test('Line is parallel to Plane',t => {
    const line = [[5,3,7],[0,1,3]]
    const plane = [13,-6,2,2]
    const result = relationBetweenLineAndPlane(line,plane)
    const expect = "echte Parallel"
    t.deepEqual(result,expect)
})

test('to Normal', t => {
    const plane = [[2,-2,-10],[-2,5,1],[6,-3,-2]]
    const result = toNormal(plane)
    const expect = [-7,2,-24,222]
    t.deepEqual(result,expect)
})

//Plane Relation

test('Plane echte Parallel',t => {
    const plane1 = [2,1,-4,6]
    const plane2 = [[0,1,0],[3,2,2],[-1,2,0]]
    const result = relationBetweenPlane(plane1,plane2).toPromise()
    const expect = "echte Parallel"
    return result.then(v => t.deepEqual(v,expect))
})
test('Plane identisch',t => {
    const plane1 = [3,2,9,3]
    const plane2 = [3,2,9,3]
    const result = relationBetweenPlane(plane1,plane2).toPromise()
    const expect = 'identisch'
    return result.then(v => t.deepEqual(v,expect))
})
test('Plane pass through',t => {
    const plane1 = [[2,2,2],[2,0,5],[1,2,3]]
    const plane2 = [[5,6,1],[1,1,1],[1,0,0]]
    const result = relationBetweenPlane(plane1,plane2).toPromise()
    const expect = [[1,0,-0.3,0.9],[0,1,-1,5]]
    return result.then(v => t.deepEqual((v as number[][]).map(v => v.map(v => Math.round(v*100)/100)),expect))
})