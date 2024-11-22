'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProdutosSchema extends Schema {
  up () {
    this.create('produtos', (table) => {
      table.increments()
      table.string('nome', 255).notNullable()
      table.text('descricao').nullable()
      table.decimal('preco', 10, 2).notNullable()
      table.integer('estoque').unsigned().notNullable().defaultTo(0)
      table.boolean('ativo').defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('produtos')
  }
}


module.exports = ProdutosSchema
