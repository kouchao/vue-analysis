export function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function nextSibling(node) {
  return node.nextSibling
}

export function parentNode(node) {
  return node.parentNode
}

export function removeChild(node, child) {
  node.removeChild(child)
}

export function appendChild(node, child) {
  node.appendChild(child)
}

export function createElement(tagName, vnode) {
  const elm = document.createElement(tagName)
  elm.className = vnode.className
  elm.innerHTML = vnode.val
  return elm
}