// app/Models/Venda.js
const Model = use('Model');

class Venda extends Model {

  cliente() {
    return this.belongsTo('App/Models/Cliente');
  }


  produto() {
    return this.belongsTo('App/Models/Produto');
  }
}

module.exports = Venda;
