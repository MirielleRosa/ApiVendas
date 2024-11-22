'use strict'

const Route = use('Route')

Route.get('/', ({ response }) => {
  return response.json({ message: 'Bem-vindo ao sistema!' })
})

require('./routes/usuarios')
require('./routes/clientes')
require('./routes/produtos')
require('./routes/vendas')
