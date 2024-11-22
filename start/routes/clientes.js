const Route = use('Route')

Route.group(() => {
  Route.get('/clientes', 'ClientesController.index')
  Route.get('/clientes/:cpf', 'ClientesController.show')
  Route.post('/cadastro_cliente', 'ClientesController.store')
  Route.put('/alterar_cliente/:id', 'ClientesController.update')
  Route.delete('/clientes/:id', 'ClientesController.destroy')
}).middleware(['auth'])
 