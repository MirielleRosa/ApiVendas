const Model = use('Model')

class Cliente extends Model {
  static get primaryKey() {
    return 'id'
  }

  static boot() {
    super.boot()
  }

  endereco() {
    return this.hasOne('App/Models/Endereco', 'id', 'cliente_id')
  }

  telefones() {
    return this.hasMany('App/Models/Telefone', 'id', 'cliente_id')
  }

  vendas() {
    return this.hasMany('App/Models/Venda')
  }

  static get rules() {
    return {
      nome: 'required',
      cpf: 'required|unique:clientes,cpf',
    }
  }

  static get messages() {
    return {
      'nome.required': 'O nome do cliente é obrigatório',
      'cpf.required': 'O CPF do cliente é obrigatório',
      'cpf.unique': 'Este CPF já está cadastrado',
      'cliente.erro': 'Cliente não encontrado',
      'cpf.erro': 'CPF inválido',
    }
  }
}

module.exports = Cliente
