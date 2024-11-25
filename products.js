const fs = require('fs').promises
const path = require('path')

const productsFile = path.join(__dirname, 'data/full-products.json')

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
    .filter(product => {
      if (!tag) {
        return product
      }
      return product.tags.find(({ title }) => title == tag)
    })
    .slice(offset, offset + limit)
}

async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
  return products.find(product => product.id === id) || null
}

async function create(fields) {
  const products = JSON.parse(await fs.readFile(productsFile))
  const newProduct = { ...fields, id: String(Date.now()) }
  products.push(newProduct)
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
  return newProduct
}

async function edit(id, change) {
  const products = JSON.parse(await fs.readFile(productsFile))
  const productIndex = products.findIndex(product => product.id === id)
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...change }
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
    return products[productIndex]
  }
  return null
}

async function destroy(id) {
  let products = JSON.parse(await fs.readFile(productsFile))
  products = products.filter(product => product.id !== id)
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2))
  return { success: true }
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy
}
