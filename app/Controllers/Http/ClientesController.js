const Cliente = use('App/Models/Cliente');
const Endereco = use('App/Models/Endereco');
const TelefoneController = use('App/Controllers/Http/TelefoneController');
const EnderecoController = use('App/Controllers/Http/EnderecoController');
const VendasController = use('App/Controllers/Http/VendasController');

class ClientesController {
    // validarCPF(cpf) {
    //     cpf = cpf.replace(/\D/g, '');
    //     if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    //     const calc = (digitos) =>
    //         digitos
    //             .map((digito, i) => digito * (digitos.length + 1 - i))
    //             .reduce((acc, val) => acc + val, 0) % 11;

    //     const [d1, d2] = cpf.slice(-2);
    //     const base = cpf.slice(0, -2).split('').map(Number);
    //     const resto1 = calc(base) < 2 ? 0 : 11 - calc(base);
    //     const resto2 = calc([...base, resto1]) < 2 ? 0 : 11 - calc([...base, resto1]);

    //     return d1 == resto1 && d2 == resto2;
    // }

    async validarCamposObrigatorios({ nome, cpf }) {
        if (!nome) {
            return { status: 400, message: 'O nome é obrigatório.' };
        }
        if (!cpf) {
            return { status: 400, message: 'O CPF é obrigatório.' };
        }
        // if (!this.validarCPF(cpf)) {
        //     return { status: 400, message: 'CPF inválido.' };
        // }
        return null;
    }

    async index({ response }) {
        try {
            const clientes = await Cliente.query()
                .select('id', 'nome', 'cpf')
                .with('endereco', (query) => {
                    query.select('cliente_id', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep');
                })
                .with('telefones', (query) => {
                    query.select('cliente_id', 'numero');
                })
                .orderBy('id')
                .fetch();

            return response.json({ clientes });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao buscar clientes', error: error.message });
        }
    }

    async show({ params, request, response }) {
        try {
            const { mes, ano } = request.get();
            const cliente = await Cliente.query()
                .where('cpf', params.cpf)
                .select('id', 'nome', 'cpf')
                .firstOrFail();

            await cliente.load('endereco', (query) => {
                query.select('logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep');
            });
            await cliente.load('telefones', (query) => {
                query.select('numero');
            });
            await cliente.load('vendas', (query) => {
                if (mes && ano) {
                    query.whereRaw('MONTH(data_hora) = ?', [mes])
                        .whereRaw('YEAR(data_hora) = ?', [ano]);
                }
                query.select('produto_id', 'quantidade', 'preco_unitario', 'preco_total', 'data_hora');
            });

            return response.json({ cliente });
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).json({ message: 'Cliente não encontrado' });
            }
            console.error(error);
            return response.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
        }
    }

    async store({ request, response }) {
        try {
            const { nome, cpf, endereco, telefones } = request.only(['nome', 'cpf', 'endereco', 'telefones']);
            const validationError = await this.validarCamposObrigatorios({ nome, cpf });

            if (validationError) {
                return response.status(validationError.status).json({ message: validationError.message });
            }

            const clienteExistente = await Cliente.findBy('cpf', cpf);
            if (clienteExistente) {
                return response.status(400).json({ message: 'O CPF já está cadastrado.' });
            }

            if (!endereco) {
                return response.status(400).json({ message: 'Os dados de endereço são obrigatórios.' });
            }

            const cliente = await Cliente.create({ nome, cpf });
            await Endereco.create({ ...endereco, cliente_id: cliente.id });

            if (telefones && telefones.length) {
                const telefoneController = new TelefoneController();
                for (const telefone of telefones) {
                    await telefoneController.store({
                        request: { only: () => ({ numero: telefone.numero, cliente_id: cliente.id }) },
                        response
                    });
                }
            }

            await cliente.load('endereco');
            await cliente.load('telefones');
            return response.status(201).json({ cliente });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
        }
    }

    async update({ params, request, response }) {
        try {
            const cliente = await Cliente.findOrFail(params.id);
            const { nome, cpf, endereco, telefones } = request.only(['nome', 'cpf', 'endereco', 'telefones']);
            const validationError = await this.validarCamposObrigatorios({ nome, cpf });

            if (validationError) {
                return response.status(validationError.status).json({ message: validationError.message });
            }

            cliente.merge({ nome, cpf });
            await cliente.save();

            if (endereco) {
                const enderecoController = new EnderecoController();
                await enderecoController.update({
                    params: { id: cliente.endereco_id },
                    request: { only: () => endereco },
                    response
                });
            }

            if (telefones) {
                const telefoneController = new TelefoneController();
                await telefoneController.updateTelefones(cliente.id, telefones, response);
            }

            return response.status(200).json({ message: 'Dados do cliente atualizados com sucesso.' });
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).json({ message: 'Cliente não encontrado' });
            }
            console.error(error);
            return response.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
        }
    }

    async destroy({ params, response }) {
        try {
            const cliente = await Cliente.query()
                .where('id', params.id)
                .with('telefones')
                .with('endereco')
                .with('vendas')
                .firstOrFail();

            await cliente.related('telefones').query().delete();
            await cliente.related('endereco').query().delete();
            await cliente.related('vendas').query().delete();
            await cliente.delete();

            return response.status(200).json({ message: 'Cliente e seus dados foram excluídos com sucesso.' });
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).json({ message: 'Cliente não encontrado.' });
            }
            console.error(error);
            return response.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
        }
    }
}

module.exports = ClientesController;