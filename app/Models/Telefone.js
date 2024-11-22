const Model = use('Model')

class Telefone extends Model {
  static get primaryKey() {
    return 'id'
  }

  static boot() {
    super.boot()
  }

  cliente() {
    return this.belongsTo('App/Models/Cliente')
  }

  static get rules() {
    return {
      numero: 'required|min:10|max:15',
    }
  }

  static get messages() {
    return {
      'numero.required': 'O número de telefone é obrigatório.',
      'numero.unique': 'Este número já está cadastrado.',
      'numero.min': 'O número de telefone deve ter pelo menos 10 caracteres.',
      'numero.max': 'O número de telefone deve ter no máximo 15 caracteres.',
    }
  }
}

module.exports = Telefone
