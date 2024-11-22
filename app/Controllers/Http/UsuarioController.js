const Usuario = use('App/Models/Usuario')
const jwt = use('jsonwebtoken')
const Env = use('Env')

class UsuarioController {

  async signup({ request, response }) {
    const { email, password } = request.all()

    try {
      if (!password || password.length < 6) {
        return response.status(400).json({ message: Usuario.messages['password.min'] })
      }

      await Usuario.create({ email, password })
      return response.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
    } catch (error) {
      const status = error.code === 'ER_DUP_ENTRY' ? 400 : 500
      const message = error.code === 'ER_DUP_ENTRY' ? Usuario.messages['email.unique'] : 'Erro ao cadastrar usuário'
      return response.status(status).json({ message })
    }
  }

  async login({ request, response }) {
    const { email, password } = request.all()
    const usuario = await Usuario.findBy('email', email)

    if (!usuario) {
      return response.status(404).json({ message: Usuario.messages['usuario.erro'] })
    }

    const Hash = use('Hash')
    const senhaValida = await Hash.verify(password, usuario.password)

    if (!senhaValida) {
      return response.status(401).json({ message: Usuario.messages['password.erro'] })
    }

    const token = jwt.sign({ id: usuario.id }, Env.get('APP_KEY'), { expiresIn: '1h' })
    return response.json({ token })
  }
}

module.exports = UsuarioController
