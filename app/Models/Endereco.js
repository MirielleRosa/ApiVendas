const Model = use('Model')

class Endereco extends Model {
  static get primaryKey() {
    return 'id'
  }

  static boot() {
    super.boot()
  }

  cliente() {
    return this.belongsTo('App/Models/Cliente', 'cliente_id', 'id')
  }

  static get rules() {
    return {
      logradouro: 'required',
      numero: 'required',
      bairro: 'required',
      cidade: 'required',
      estado: 'required',
      cep: 'required',
    }
  }

  static get messages() {
    return {
      'logradouro.required': 'O logradouro é obrigatório.',
      'numero.required': 'O número é obrigatório.',
      'bairro.required': 'O bairro é obrigatório.',
      'cidade.required': 'A cidade é obrigatória.',
      'estado.required': 'O estado é obrigatório.',
      'cep.required': 'O CEP é obrigatório.',
    }
  }
}

module.exports = Endereco
