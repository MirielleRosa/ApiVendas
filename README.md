# apiVendas

Este projeto é uma API voltada para a gestão de clientes, produtos e vendas. As rotas de acesso aos dados de clientes, produtos e vendas são protegidas e podem ser acessadas apenas por usuários autenticados via **JWT** (JSON Web Token).

## Tecnologias Utilizadas

- **AdonisJS**: Framework Node.js utilizado para a construção da API, proporcionando uma estrutura robusta e eficiente para o desenvolvimento.
- **MySQL**: Banco de dados relacional utilizado para o armazenamento seguro e estruturado dos dados.
- **JWT**: Tecnologia de autenticação que garante a segurança das rotas, permitindo que apenas usuários autenticados possam acessar os dados sensíveis.

## Como instalar

### 1. Clonar o Repositório

Primeiro, clone o repositório do projeto:

    git clone https://github.com/MirielleRosa/ApiVendas.git
    cd apiVendas

### 2. Instalar Dependências

Instale as dependências do projeto utilizando o npm:

    npm install
    npm install mysql2

### 3. Configurar o banco de dados:

Crie um banco de dados no MySQL de sua escolha. Após isso, configure a conexão no arquivo .env do projeto.

### 4. Rodar as Migrações

Execute os seguintes comandos para criar as tabelas no banco de dados:

    adonis make:migration usuario
    adonis make:migration clientes
    adonis make:migration enderecos
    adonis make:migration produtos
    adonis make:migration telefones
    adonis make:migration vendas

Após isso, rode as migrações:

    adonis migration:run

### 5. Iniciar o Servidor

Para iniciar o servidor em modo de desenvolvimento, use o comando:

    adonis serve --dev

### Rotas

#### Autenticação

- **POST /signup**: Cadastro de um novo usuário.
- **POST /login**: Login de usuário e geração de JWT.

#### Clientes (Protegido por autenticação)

- **GET /clientes**: Lista todos os clientes cadastrados.
- **GET /clientes/:cpf**: Detalha um cliente e suas vendas mais recentes.
- **POST /cadastro_cliente**: Cadastro de um novo cliente.
- **PUT /alterar_cliente/:id**: Atualização dos dados de um cliente.
- **DELETE /clientes/:id**: Exclui um cliente e seus dados.

#### Produtos (Protegido por autenticação)

- **GET /produtos**: Lista todos os produtos cadastrados.
- **GET /produtos/:id**: Detalha um produto específico.
- **POST /cadastro_produto**: Cadastro de um novo produto.
- **PUT /alterar_produtos/:id**: Atualização de um produto.
- **DELETE /deletar_produto/:id**: Exclusão lógica de um produto.

#### Vendas (Protegido por autenticação)

- **POST /registrar_vendas**: Registra a venda de um produto para um cliente.

## Exemplo de uso:

### Cadastro de Cliente

**POST /cadastro_cliente**

``` json
{
  "nome": "João Silva",
  "cpf": "12345678901",
  "endereco": {
    "logradouro": "Rua A",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "12345678"
  },
  "telefones": [
    { "numero": "11999999999" }
  ]
}
```

### Registro de Venda

**POST /registrar_vendas**
``` json
{
"cliente_id": 1,
"produto_id": 2,
"quantidade": 1
}
```

## Observações

- As rotas de **clientes**, **produtos** e **vendas** estão protegidas por autenticação. Um token JWT gerado após o login deve ser passado no cabeçalho `Authorization` para acessar essas rotas.
- **Validação**: A aplicação valida campos obrigatórios para cadastro de clientes, produtos e vendas. Erros de validação são retornados como respostas HTTP com status `400`.

- Para testar a API, foi utilizado o **Insomnia**. Essa ferramenta foi empregada para enviar as requisições e verificar as respostas das rotas, garantindo o correto funcionamento da API durante o desenvolvimento.

