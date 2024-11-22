const Route = use('Route')

Route.group(() => {
  Route.post('/registrar_vendas', 'VendasController.store')
}).middleware(['auth'])
