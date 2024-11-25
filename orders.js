const fs = require('fs').promises
const path = require('path')

const ordersFile = path.join(__dirname, 'data/orders.json')

async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options
  const data = await fs.readFile(ordersFile)
  const orders = JSON.parse(data)

  const filteredOrders = orders.filter(order => {
    if (productId && !order.products.includes(productId)) return false
    if (status && order.status !== status) return false
    return true
  })

  return filteredOrders.slice(offset, offset + limit)
}

async function get(id) {
  const orders = JSON.parse(await fs.readFile(ordersFile))
  return orders.find(order => order.id === id) || null
}

async function create(fields) {
  const orders = JSON.parse(await fs.readFile(ordersFile))
  const newOrder = { ...fields, id: String(Date.now()), status: 'CREATED' }
  orders.push(newOrder)
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2))
  return newOrder
}

async function edit(id, change) {
  const orders = JSON.parse(await fs.readFile(ordersFile))
  const orderIndex = orders.findIndex(order => order.id === id)
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...change }
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2))
    return orders[orderIndex]
  }
  return null
}

async function destroy(id) {
  let orders = JSON.parse(await fs.readFile(ordersFile))
  orders = orders.filter(order => order.id !== id)
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2))
  return { success: true }
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy
}
