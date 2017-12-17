import { test } from "ava";
import { crossProduct, dotProduct } from "./vector";

test('Vector cross product',t => {
    const result1 = crossProduct([1,2,3],[4,5,6])
    const result2 = crossProduct([3,2,1],[0,0,0])
    const expect1 = [-3,6,-3]
    const expect2 = [0,0,0]
    t.deepEqual(result1,expect1)
    t.deepEqual(result2,expect2)
})

test('Vector cross product with falsy value',t => {
    const result1 = crossProduct([1],[1])
    const expect1 = null
    t.deepEqual(result1,expect1)
})

test('Dot Product',t => {
    const result1 = dotProduct([1,2,3],[4,5,6])
    const result2 = dotProduct([1,2,5],[4,5,6])
    const result3 = dotProduct([1,2],[3,4])
    const expect1 = 4+10+18
    const expect3 = 11
    t.deepEqual(result1,expect1)
    t.notDeepEqual(result2,expect1)
    t.deepEqual(result3,expect3)
})

test('Dot Product with falsy input',t => {
    const result1 = dotProduct([1,2,3],[4,5])
    t.is(result1,null)
})