const jwt = use('jsonwebtoken')
const Usuario = use('App/Models/Usuario')
const Env = use('Env')

class Auth {
  async handle({ request, response, auth }, next) {
    const token = request.header('Authorization')

    if (!token) {
      return response.status(401).json({ message: Usuario.messages['token.required'] })
    }

    try {
      const secret = Env.get('APP_KEY')
      const decoded = jwt.verify(token.replace('Bearer ', ''), secret)

      if (!decoded.id) {
        return response.status(401).json({ message: Usuario.messages['token.erro'] })
      }

      const usuario = await Usuario.find(decoded.id)
      if (!usuario) {
        return response.status(401).json({ message: Usuario.messages['usuario.erro'] })
      }

      request.usuario = usuario
      await next()
    } catch (error) {
      console.log(error)
      if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ message: Usuario.messages['token.expirado'] })
      }

      if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ message: 'Erro ao autenticar: Token inválido.' })
      }

      return response.status(401).json({ message: 'Erro ao autenticar: Erro desconhecido.' })
    }
  }
}

module.exports = Auth
