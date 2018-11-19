import _, { isEmpty, map } from 'lodash'
import { parse } from 'luaparse'

const literalTypes = [
  'StringLiteral',
  'NumericLiteral',
  'BooleanLiteral',
  'NilLiteral',
]

const fold = (o) => {
  if (o.type === 'Chunk') {
    const vs = o.body.map(fold)
    // Assuming that first statement has our table
    return vs[0]
  }
  if (o.type === 'ReturnStatement') {
    const vs = o.arguments.map(fold)
    return vs.length === 1 ? vs[0] : vs
  }
  if (o.type === 'LocalStatement') {
    const vs = o.init.map(fold)
    return vs.length === 1 ? vs[0] : vs
  }
  if (o.type === 'TableConstructorExpression') {
    if (o.fields[0] && o.fields[0].key) {
      const x = _(o.fields)
        .map((f) => {
          const { k, v } = fold(f)
          return [k, v]
        })
        .filter(([, v]) => v !== null)
        .fromPairs()
        .value()

      return isEmpty(x) ? [] : x
    }
    return map(o.fields, (f) => {
      const v = fold(f)
      return v.__internal ? [v.k, v.v] : v
    })
  }
  if (o.type === 'TableKey' || o.type === 'TableKeyString') {
    return { k: fold(o.key), v: fold(o.value), __internal: true }
  }
  if (o.type === 'TableValue') {
    return fold(o.value)
  }
  if (o.type === 'UnaryExpression' && o.operator === '-') {
    return -fold(o.argument)
  }
  if (literalTypes.includes(o.type)) {
    return o.value
  }
  if (o.type === 'Identifier') {
    return o.name
  }
  throw new Error(`lua/fold: unhandled type ${o.type}: ${JSON.stringify(o, null, 2).split('\n').slice(0, 50).join('\n')}`)
}

const luaToJson = lua => fold(parse(lua, { comments: false }))

export default luaToJson
