import { isDef } from './utils'
import {
  insertBefore,
  parentNode,
  removeChild,
  appendChild,
  createElement
} from './nodeopt'

// 相同节点 此处应该做key的判断
export function sameVnode(o, n) {
  return o.key === o.key && o.val === n.val
}

// 遍历找到相同节点index
export function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}


export function removeNode(el) {
  const parent = parentNode(el)
  // element may have already been removed due to v-html / v-text
  if (isDef(parent)) {
    removeChild(parent, el)
  }
}

export function removeVnodes(vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      removeNode(ch.elm)
    }
  }
}

export function addVnodes(
  parentElm,
  refElm,
  vnodes,
  startIdx,
  endIdx,
  insertedVnodeQueue
) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(
      vnodes[startIdx],
      insertedVnodeQueue,
      parentElm,
      refElm,
      false,
      vnodes,
      startIdx
    )
  }
}

export function insert(parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (parentNode(ref) === parent) {
        insertBefore(parent, elm, ref)
      }
    } else {
      appendChild(parent, elm)
    }
  }
}

export function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  vnode.elm = createElement('div', vnode)
  insert(parentElm, vnode.elm, refElm)
}