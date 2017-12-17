import { test } from "ava";
import { transpose } from "./matrix";

test('transpose', t => {
    const result1 = transpose([[1,2,3],[4,5,6]])
    const expect1 = [[1,4],[2,5],[3,6]]
    const result2 = transpose(expect1)
    const expect2 = [[1,2,3],[4,5,6]]
    t.deepEqual(result1,expect1)
    t.deepEqual(result2,expect2)
})