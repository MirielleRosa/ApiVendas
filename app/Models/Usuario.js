const Model = use('Model')
const Hash = use('Hash')

class Usuario extends Model {
  static boot() {
    super.boot()
    this.addHook('beforeSave', async (usuarioInstance) => {
      if (usuarioInstance.dirty.password) {
        usuarioInstance.password = await Hash.make(usuarioInstance.password)
      }
    })
  }

  static get primaryKey() {
    return 'id'
  }

  async verifyPassword(password) {
    return await Hash.verify(password, this.password)
  }

  static get rules() {
    return {
      email: 'required|email|unique:usuarios,email',
      password: 'required|min:6',
    }
  }

  static get messages() {
    return {
      'email.required': 'O e-mail é obrigatório',
      'email.email': 'O e-mail deve ser válido',
      'email.unique': 'Este e-mail já está cadastrado',
      'password.required': 'A senha é obrigatória',
      'password.erro': 'Senha incorreta',
      'usuario.erro': 'Usuário não encontrado',
      'token.erro': 'Usuário do Token fornecido não existe!',
      'password.min': 'A senha deve ter pelo menos 6 caracteres',
      'token.expirado': 'Token expirado',
      'token.required': 'Token não fornecido',
      'token.invalid': 'Token inválido',
      'auth.required': 'Você precisa estar autenticado',
    }
  }
}

module.exports = Usuario