
let salario = JSON.parse(localStorage.getItem('salario')) || 0;
let despesas = JSON.parse(localStorage.getItem('despesas')) || [];

exibir_resumo();
atualizarLista();

document.getElementById("campoSalario").addEventListener("submit", function(event){
    event.preventDefault();

    let valor = document.getElementById("salario").value.trim();

    const s = parseFloat(valor);

    if (isNaN(s) || s <= 0) {
        alert("Valor inválido!");
        return;
    }

    salario = s;
    localStorage.setItem('salario', salario);
    document.getElementById("campoSalario").reset();
    exibir_resumo();
});


document.getElementById("campoDespesa").addEventListener("submit", function(e){
    e.preventDefault();

    let data = document.getElementById("data_despesa").value;
    let descricao = document.getElementById("descricao_despesa").value.trim();
    let valorStr = document.getElementById("valor_despesa").value.trim();

    valorStr = valorStr.replace(",", ".");
    const valor = parseFloat(valorStr);

    if (data === "" || descricao === "" || isNaN(valor) || valor <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    let despesa = { data, descricao, valor };

    despesas.push(despesa);
    localStorage.setItem('despesas', JSON.stringify(despesas));

    document.getElementById("campoDespesa").reset();
    atualizarLista();
    exibir_resumo();
});


function atualizarLista() {
    let lista = document.getElementById("lista_despesas");
    lista.innerHTML = "";

    despesas = JSON.parse(localStorage.getItem('despesas')) || [];

    despesas.forEach((d) => {
        let li = document.createElement('li');
        li.textContent = `Data: ${d.data} | Descrição: ${d.descricao} | Valor: R$ ${d.valor.toFixed(2)}`;
        lista.appendChild(li);
    });
}

function removerTudo() {
    localStorage.removeItem('salario');
    localStorage.removeItem('despesas');
    document.getElementById("lista_despesas").innerHTML = "";
    document.getElementById("resumo").innerHTML = "";
    salario = 0;
    despesas = [];
    
    exibir_resumo();
    atualizarLista();
}

function exibir_resumo(){
    let resumo = document.getElementById("resumo");
    resumo.innerHTML = "";

    let s = JSON.parse(localStorage.getItem('salario')) || 0;
    let listaDespesas = JSON.parse(localStorage.getItem('despesas')) || [];

    let total = 0;
    for (let i = 0; i < listaDespesas.length; i++) {
        total += listaDespesas[i].valor;
    }

    let saldoFinal = s - total;
    
    let p1 = document.createElement('p');
    p1.textContent = "Salário: R$ " + s.toFixed(2);

    let p2 = document.createElement('p');
    p2.textContent = "Total de Despesas: R$ " + total.toFixed(2);

    let p3 = document.createElement('p');
    p3.textContent = "Saldo Final: R$ " + saldoFinal.toFixed(2);

    if (saldoFinal > 0) {
        p3.style.color = "green";
    }
    if(saldoFinal < 0){
        p3.style.color = "red";
    }

    resumo.appendChild(p1);
    resumo.appendChild(p2);
    resumo.appendChild(p3);
}  