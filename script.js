const nomeProduto = document.getElementById("nome-produto");
const qtdProduto = document.getElementById("qtd-produto");
const precoProduto = document.getElementById("preco-produto");
const formulario = document.getElementById("nova-compra");
const listaProdutos = document.getElementById("lista-produtos");
const mostraTotal = document.getElementById("total-compra");
const botaoPdf = document.getElementById("gerar-pdf");

let produtoEditando = null;
let carrinho = [];
let totalCompra = 0;

function editarProduto(id){
    const produto = carrinho.find(function(produto){
        return produto.id === id ;
    });

    nomeProduto.value = produto.nome;
    qtdProduto.value = produto.quantidade;
    precoProduto.value = produto.preco;

    produtoEditando = id;
}

function removerProduto(id) {
    carrinho = carrinho.filter(function(produto){
        return produto.id !== id;
    });

    atualizarCarrinho();
}

function atualizarCarrinho() {
    listaProdutos.innerHTML = "";

    totalCompra = 0;

    carrinho.forEach(function(produto) {

        listaProdutos.innerHTML += `
        <div class="produto-card">

            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.quantidade} x R$ ${produto.preco.toFixed(2)}</p>
            </div>
        
        <div class="produto-acoes">
            <strong> R$ ${produto.subtotal.toFixed(2)}</strong>

            <div>
                <button class="botao-editar" onclick="editarProduto(${produto.id})">Editar ✏️</button>
                <button class="botao-remover" onclick="removerProduto(${produto.id})">Remover 🗑️</button>
            </div>
        </div>

    </div>
    `;

    totalCompra += produto.subtotal;
    });

    mostraTotal.textContent = totalCompra.toFixed(2);
}

formulario.addEventListener("submit", function(evento){
    evento.preventDefault();
    
    const qtd_Produto = Number(qtdProduto.value);
    const preco_Produto = Number(precoProduto.value);
    const subtotal = qtd_Produto * preco_Produto;

    const produto = {
        id: Date.now(),
        nome: nomeProduto.value,
        quantidade: qtd_Produto,
        preco: preco_Produto,
        subtotal: subtotal
    };

    if (produtoEditando === null) {
        carrinho.push(produto);
    } else {
        // edição
        const indice = carrinho.findIndex(function(produto){
            return produto.id === produtoEditando;
        });

        produto.id = produtoEditando;

        carrinho[indice] = produto;

        produtoEditando = null;
    }

    atualizarCarrinho();

    nomeProduto.value = "";
    qtdProduto.value = "";
    precoProduto.value = "";
});

botaoPdf.addEventListener("click", function(){
    const { jsPDF } = window.jspdf;

    const documento = new jsPDF();

    documento.text("Orçamento de Compras", 20,20);

    let posicaoY = 35;

    carrinho.forEach(function(produto){

        documento.setFontSize(12);

        documento.text(
            produto.nome,
            20,
            posicaoY
        );

        documento.text(
            produto.quantidade + "x R$" + produto.preco.toFixed(2),
            20,
            posicaoY + 7
        );

        documento.text(
            "Subtotal: R$" + produto.subtotal.toFixed(2),
            20,
            posicaoY + 14
        );

        posicaoY += 25;
    });

    documento.setFontSize(14);

    documento.text(
        "Total: R$" + totalCompra.toFixed(2),
        20,
        posicaoY
    );
    documento.save("orcamento-compras.pdf");
});