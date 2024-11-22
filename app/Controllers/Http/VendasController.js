const Venda = use('App/Models/Venda');
const Cliente = use('App/Models/Cliente');
const Produto = use('App/Models/Produto');

class VendasController {
  async store({ request, response }) {
    try {
      const { cliente_id, produto_id, quantidade } = request.only(['cliente_id', 'produto_id', 'quantidade']);

      const cliente = await Cliente.find(cliente_id);
      if (!cliente) {
        return response.status(404).json({ message: Cliente.messages['cliente.erro'] });
      }

      const produto = await Produto.find(produto_id);
      if (!produto) {
        return response.status(404).json({ message: Produto.messages['produto.erro'] });
      }

      if (produto.estoque < quantidade) {
        return response.status(400).json({ message: Produto.messages['estoque.insuficiente'] });
      }

      const preco_total = produto.preco * quantidade;

      const venda = await Venda.create({
        cliente_id,
        produto_id,
        quantidade,
        preco_unitario: produto.preco,
        preco_total,
        data_hora: new Date(),
      });

      produto.estoque -= quantidade;
      await produto.save();

      return response.status(201).json(venda);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Erro ao registrar venda', error: error.message });
    }
  }

  async destroy({ params, response }) {
    try {
      const { cliente_id } = params;

      const vendas = await Venda.query().where('cliente_id', cliente_id).fetch();

      if (vendas.isEmpty()) {
        return response.status(404).json({ message: 'Não há vendas para este cliente' });
      }

      for (let venda of vendas.rows) {
        await venda.delete();
      }

      return response.status(200).json({
        message: 'Vendas do cliente excluídas com sucesso',
      });
    } catch (error) {
      if (error.name === 'ModelNotFoundException') {
        return response.status(404).json({ message: 'Venda não existente!' })
      }
      return response.status(500).json({ message: 'Erro ao excluir vendas', error: error.message });
    }
  }
}

module.exports = VendasController;
