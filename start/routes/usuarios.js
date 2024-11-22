const Route = use('Route')

Route.post('/signup', 'UsuarioController.signup')
Route.post('/login', 'UsuarioController.login')
