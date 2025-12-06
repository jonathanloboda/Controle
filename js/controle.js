let dados = {
    salario: 0,
    despesas: []
};

window.onload = function() {
    carregarDados();
    atualizarUI();
    
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataDespesa').value = hoje;
};
function carregarDados() {
    const dadosSalvos = localStorage.getItem('financeiroData');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }
}
function salvarDados() {
    localStorage.setItem('financeiroData', JSON.stringify(dados));
}
function salvarSalario() {
    const inputSalario = document.getElementById('salario');
    const valor = parseFloat(inputSalario.value);
    
    if (isNaN(valor) || valor < 0) {
        alert('Por favor, digite um valor válido para o salário.');
        return;
    }
    
    dados.salario = valor;
    salvarDados();
    atualizarUI();
    inputSalario.value = '';
    
    alert('Salário salvo com sucesso!');
}
function adicionarDespesa() {
    const data = document.getElementById('dataDespesa').value;
    const nome = document.getElementById('nomeDespesa').value.trim();
    const valor = parseFloat(document.getElementById('valorDespesa').value);
    
    if (!data) {
        alert('Por favor, selecione uma data.');
        return;
    }
    
    if (!nome) {
        alert('Por favor, digite o nome da despesa.');
        return;
    }
    
    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, digite um valor válido maior que zero.');
        return;
    }
    const despesa = {
        id: Date.now(),
        data: data,
        nome: nome,
        valor: valor
    };
    
    dados.despesas.push(despesa);
    salvarDados();
    atualizarUI();
    
    document.getElementById('dataDespesa').value = new Date().toISOString().split('T')[0];
    document.getElementById('nomeDespesa').value = '';
    document.getElementById('valorDespesa').value = '';
    
}
function deletarDespesa(id) {
    if (confirm('Tem certeza que deseja deletar esta despesa?')) {
        dados.despesas = dados.despesas.filter(d => d.id !== id);
        salvarDados();
        atualizarUI();
    }
}
function calcularTotalDespesas() {
    return dados.despesas.reduce((total, despesa) => total + despesa.valor, 0);
}
function calcularSaldo() {
    return dados.salario - calcularTotalDespesas();
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(dataString) {
    const data = new Date(dataString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR').format(data);
}
function atualizarUI() {
    atualizarResumo();
    atualizarListaDespesas();
}
function atualizarResumo() {
    const totalDespesas = calcularTotalDespesas();
    const saldo = calcularSaldo();
    
    document.getElementById('resumoSalario').textContent = formatarMoeda(dados.salario);
    document.getElementById('resumoDespesas').textContent = '-' + formatarMoeda(totalDespesas);
    document.getElementById('resumoSaldo').textContent = formatarMoeda(saldo);
    
    const elementoSaldo = document.getElementById('resumoSaldo');
    if (saldo < 0) {
        elementoSaldo.style.color = '#f44336';
    } else if (saldo === 0) {
        elementoSaldo.style.color = '#ff9800';
    } else {
        elementoSaldo.style.color = '#4CAF50';
    }
}
function atualizarListaDespesas() {
    const container = document.getElementById('listaDespesas');
    
    if (dados.despesas.length === 0) {
        container.innerHTML = '<p class="vazio">Nenhuma despesa registrada</p>';
        return;
    }
    
    const despesasOrdenadas = [...dados.despesas].sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
    });
    
    let html = '';
    despesasOrdenadas.forEach(despesa => {
        html += `
            <div class="despesa-item">
                <div class="despesa-info">
                    <div class="despesa-data">${formatarData(despesa.data)}</div>
                    <div class="despesa-nome">${despesa.nome}</div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="despesa-valor">${formatarMoeda(despesa.valor)}</span>
                    <button onclick="deletarDespesa(${despesa.id})" class="btn-deletar">Deletar</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}
function limparTodosDados() {
    if (confirm('ATENÇÃO: Esta ação deletará TODOS os dados (salário e despesas). Tem certeza?')) {
        dados = {
            salario: 0,
            despesas: []
        };
        salvarDados();
        atualizarUI();
        document.getElementById('salario').value = '';
        alert('Todos os dados foram deletados com sucesso!');
    }
}
