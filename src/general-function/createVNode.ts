import { toVNode } from "snabbdom/tovnode";

export default function createVNode(node: string, mainContainer: string = "DIV") {
    const el = document.createElement(mainContainer)
    el.innerHTML = node
    return toVNode(el)
}