export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}


// 选择元素
export function $(el) {
  return document.querySelector(el)
}

// 监听事件
export function lis(el, event, fn) {
  el.addEventListener(event, fn)
}

// 生成Vnode
export function getVnode(str) {
  const arr = str ? str.split(',') : []

  return arr.map((element, index) => {
    return {
      key: element,
      val: element,
    }
  })
}

// 渲染dom
export function renderDom(parent, arr, isRelation) {
  // isKey 因为vnode是真实dom，所以通过key建立对应关系
  parent.innerHTML = ''
  if (!arr.length) {
    return parent
  }

  arr.forEach((vnode) => {
    const item = document.createElement('div')
    item.className = 'item'
    item.innerHTML = vnode.val
    if (isRelation) {
      vnode.elm = item
    }
    vnode.className = item.className
    parent.appendChild(item)
  })

  return parent
}

const logView = $('.log')
// 打印
export function log(val) {
  console.log('log: ' + val)
  const item = document.createElement('div')
  item.innerHTML = val
  
    logView.appendChild(item)
    logView.scrollTop = logView.scrollHeight
}