import css from './css/index.css';
import { insertBefore, nextSibling } from './lib/nodeopt'
import {
  sameVnode,
  findIdxInOld,
  removeVnodes,
  addVnodes,
  createElm,
} from './lib/vnodeopt'

import { isUndef, $, lis, getVnode, renderDom, log } from './lib/utils'

let up
let lock = false

// 更新孩子
function* updateChildren(
  parentElm,
  oldCh,
  newCh,
  insertedVnodeQueue,
  removeOnly
) {
  console.log(oldCh, newCh)
  yield ['log', '开始']
  let oldStartIdx = 0
  yield ['oldStartIdx', oldStartIdx]
  let newStartIdx = 0
  yield ['newStartIdx', newStartIdx]
  let oldEndIdx = oldCh.length - 1
  yield ['oldEndIdx', oldEndIdx]
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  yield ['newEndIdx', newEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly
  yield ['log', '开始循环']
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    yield [
      'log',
      '游标比较oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx',
    ]
    if (isUndef(oldStartVnode)) {
      yield ['log', '老的开始节点不存在']
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      yield ['log', '老的开始游标右滑']
      yield ['oldStartIdx', oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      yield ['log', '老的结束节点不存在']
      oldEndVnode = oldCh[--oldEndIdx]
      yield ['log', '老的结束游标左滑']
      yield ['oldEndIdx', oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      yield ['log', '老的开始节点和新的开始节点一样']
      yield ['log', '节点相同进行patchVnode']
      // patchVnode(
      //   oldStartVnode,
      //   newStartVnode,
      //   insertedVnodeQueue,
      //   newCh,
      //   newStartIdx
      // )
      oldStartVnode = oldCh[++oldStartIdx]
      yield ['log', '老的开始游标右滑']
      yield ['oldStartIdx', oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      yield ['log', '新的开始游标右滑']
      yield ['newStartIdx', newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      yield ['log', '老的结束节点和新的结束节点一样']
      yield ['log', '节点相同进行patchVnode']
      // patchVnode(
      //   oldEndVnode,
      //   newEndVnode,
      //   insertedVnodeQueue,
      //   newCh,
      //   newEndIdx
      // )
      oldEndVnode = oldCh[--oldEndIdx]
      yield ['log', '老的结束游标左滑']
      yield ['oldEndIdx', oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      yield ['log', '新的结束游标左滑']
      yield ['newEndIdx', newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      yield ['log', '老的开始节点和新的结束节点一样']
      // Vnode moved right
      // patchVnode(
      //   oldStartVnode,
      //   newEndVnode,
      //   insertedVnodeQueue,
      //   newCh,
      //   newEndIdx
      // )
      yield ['log', '移动节点']
      canMove &&
        insertBefore(parentElm, oldStartVnode.elm, nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      yield ['log', '老的开始游标右滑']
      yield ['oldStartIdx', oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      yield ['log', '新的结束游标左滑']
      yield ['newEndIdx', newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      yield ['log', '老的结束节点和新的开始节点一样']
      // Vnode moved left
      // patchVnode(
      //   oldEndVnode,
      //   newStartVnode,
      //   insertedVnodeQueue,
      //   newCh,
      //   newStartIdx
      // )
      yield ['log', '移动节点']
      canMove && insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      yield ['log', '老的结束游标左滑']
      yield ['oldEndIdx', oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
      yield ['log', '新的开始游标右滑']
      yield ['newStartIdx', newStartIdx]
    } else {
      yield ['log', '开头结尾四次的判断未命中']
      yield ['log', '此处做了优化createKeyToOldIdx，演示跳过']

      idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      yield ['log', '老的孩子（idxInOld）遍历找到相同节点index：' + idxInOld]

      if (isUndef(idxInOld)) {
        yield ['log', '老的孩子没有找到，需要创建新的']
        // New element
        createElm(
          newStartVnode,
          insertedVnodeQueue,
          parentElm,
          oldStartVnode.elm,
          false,
          newCh,
          newStartIdx
        )
      } else {
        yield ['log', '老的孩子里找到了']
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          yield ['log', '找到的节点和新的开始节点相同，进行patchVnode']
          // patchVnode(
          //   vnodeToMove,
          //   newStartVnode,
          //   insertedVnodeQueue,
          //   newCh,
          //   newStartIdx
          // )
          oldCh[idxInOld] = undefined
          yield ['log', '清空旧的节点']
          yield ['clearOld', idxInOld]
          yield ['log', '移动这个节点']
          canMove && insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          yield ['log', '节点不相同，直接创建']
          // same key but different element. treat as new element
          createElm(
            newStartVnode,
            insertedVnodeQueue,
            parentElm,
            oldStartVnode.elm,
            false,
            newCh,
            newStartIdx
          )
        }
      }
      newStartVnode = newCh[++newStartIdx]
      yield ['log', '新的开始游标右滑']
      yield ['newStartIdx', newStartIdx]
    }
  }
  yield ['log', '循环结束']
  if (oldStartIdx > oldEndIdx) {
    yield ['log', '老的开始游标大于老的结束游标，表示节点还有剩余 需要添加']
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(
      parentElm,
      refElm,
      newCh,
      newStartIdx,
      newEndIdx,
      insertedVnodeQueue
    )
    yield ['log', '将剩余的添加']
  } else if (newStartIdx > newEndIdx) {
    yield ['log', '新的开始游标大于新的结束游标，表示节点多余 需要删掉']
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    yield ['log', '删掉所有多余的']
  }
}

// 初始化dom
function init(oldVal, newVal) {
  const oldCh = getVnode(oldVal)
  const newCh = getVnode(newVal)

  renderDom($('.old'), oldCh)
  renderDom($('.new'), newCh)
  const parentElm = renderDom($('.dom'), oldCh, true /*是否关联真实dom*/)

  up = updateChildren(parentElm, oldCh, newCh)
}

function run({ value, done }) {
  if (done) {
    return done
  }

  const [type, val] = value

  switch (type) {
    case 'log':
      log(val)
      break
    case 'oldStartIdx':
      if ($('.old').children.length <= val || val < 0) {
        return
      }
      $('.old').children[val].style.color = '#ff4d4f'
      log('老的孩子的开始index设为' + val + '，红色为当前游标位置')
      break
    case 'newStartIdx':
      if ($('.new').children.length <= val || val < 0) {
        return
      }
      $('.new').children[val].style.color = '#52c41a'
      log('新的孩子的开始index设为' + val + '，绿色为当前游标位置')
      break
    case 'oldEndIdx':
      if ($('.old').children.length <= val || val < 0) {
        return
      }
      $('.old').children[val].style.color = '#f50'
      log('老的孩子的结束index设为' + val + '，橘色为当前游标位置')
      break
    case 'newEndIdx':
      if ($('.new').children.length <= val || val < 0) {
        return
      }
      $('.new').children[val].style.color = '#1890ff'
      log('新的孩子的结束index设为' + val + '，蓝色为当前游标位置')
      break
    case 'clearOld':
      if ($('.old').children.length <= val || val < 0) {
        return
      }
      $('.old').children[val].style.background = '#e6e6e6'
      log('清除旧的节点，设置为undefined' + val + '，灰色背景')
    default:
      break
  }
}

init('1,2,3,4,5', '1,2,3,6')

lis($('.update'), 'click', function () {
  init($('.old-input').value, $('.new-input').value)
})

lis($('.next'), 'click', function () {
  if(lock){
    return 
  }
  run(up.next())
})

lis($('.auto'), 'click', function () {
  if(lock){
    return 
  }
  lock = true
  const time = setInterval(function () {
    const done = run(up.next())
    if (done) {
      lock = false
      clearInterval(time)
    }
  }, 100)
})

lis($('.clear'), 'click', function () {
  $('.log').innerHTML = ''
})
