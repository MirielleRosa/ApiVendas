const Route = use('Route')

Route.group(() => {
  Route.get('/produtos', 'ProdutosController.index')
  Route.get('/produtos/:id', 'ProdutosController.show')
  Route.post('/cadastro_produto', 'ProdutosController.store')
  Route.put('/alterar_produtos/:id', 'ProdutosController.update')
  Route.delete('/deletar_produto/:id', 'ProdutosController.delete')
}).middleware(['auth'])
