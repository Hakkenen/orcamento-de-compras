const nomeProduto = document.getElementById("nome-produto");
const qtdProduto = document.getElementById("qtd-produto");
const precoProduto = document.getElementById("preco-produto");
const formulario = document.getElementById("nova-compra");
const listaProdutos = document.getElementById("lista-produtos");
const mostraTotal = document.getElementById("total-compra");
const botaoPdf = document.getElementById("gerar-pdf");
const botaoCesta = document.getElementById("adicionar-cesta");
const botaoPrincipal = document.getElementById("botao-principal");

let produtoEditando = null;
let carrinho = [];
let totalCompra = 0;

const cestaBasica = [
    { nome: "Arroz", quantidade: 0, preco: 0.00 },
    { nome: "Feijão", quantidade: 0, preco: 0.00 },
    { nome: "Macarrão", quantidade: 0, preco: 0.00 },
    { nome: "Açúcar", quantidade: 0, preco: 0.00 },
    { nome: "Café", quantidade: 0, preco: 0.00 },
    { nome: "Leite", quantidade: 0, preco: 0.00 },
    { nome: "Óleo", quantidade: 0, preco: 0.00 },
    { nome: "Farinha de trigo", quantidade: 0, preco: 0.00 },
    { nome: "Sal", quantidade: 0, preco: 0.00 },
    { nome: "Biscoito", quantidade: 0, preco: 0.00 },
    { nome: "Achocolatado", quantidade: 0, preco: 0.00 },
    { nome: "Margarina", quantidade: 0, preco: 0.00 },
    { nome: "Extrato de tomate", quantidade: 0, preco: 0.00 },
    { nome: "Milho", quantidade: 0, preco: 0.00 },
    { nome: "Ervilha", quantidade: 0, preco: 0.00 },
    { nome: "Sardinha", quantidade: 0, preco: 0.00 },
    { nome: "Ovos", quantidade: 0, preco: 0.00 },
    { nome: "Pão", quantidade: 0, preco: 0.00 },
    { nome: "Queijo", quantidade: 0, preco: 0.00 },
    { nome: "Presunto", quantidade: 0, preco: 0.00 },
    { nome: "Frango", quantidade: 0, preco: 0.00 },
    { nome: "Carne moída", quantidade: 0, preco: 0.00 },
    { nome: "Linguiça", quantidade: 0, preco: 0.00 },
    { nome: "Batata", quantidade: 0, preco: 0.00 },
    { nome: "Cebola", quantidade: 0, preco: 0.00 },
    { nome: "Tomate", quantidade: 0, preco: 0.00 },
    { nome: "Alface", quantidade: 0, preco: 0.00 },
    { nome: "Banana", quantidade: 0, preco: 0.00 },
    { nome: "Maçã", quantidade: 0, preco: 0.00 },
    { nome: "Laranja", quantidade: 0, preco: 0.00 },
    { nome: "Sabonete", quantidade: 0, preco: 0.00 },
    { nome: "Shampoo", quantidade: 0, preco: 0.00 },
    { nome: "Creme dental", quantidade: 0, preco: 0.00 },
    { nome: "Papel higiênico", quantidade: 0, preco: 0.00 },
    { nome: "Detergente", quantidade: 0, preco: 0.00 },
    { nome: "Sabão em pó", quantidade: 0, preco: 0.00 },
    { nome: "Água sanitária", quantidade: 0, preco: 0.00 },
    { nome: "Esponja", quantidade: 0, preco: 0.00 },
    { nome: "Papel toalha", quantidade: 0, preco: 0.00 },
    { nome: "Sacos para lixo", quantidade: 0, preco: 0.00 }
];

function editarProduto(id){
    const produto = carrinho.find(function(produto){
        return produto.id === id ;
    });

    nomeProduto.value = produto.nome;
    qtdProduto.value = produto.quantidade;
    precoProduto.value = produto.preco;

    produtoEditando = id;
    
    botaoPrincipal.textContent = "✏️ Editar Produto";
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

function adicionarCabecalhoPDF(documento) {

    documento.setFontSize(11);

    documento.text("Produto", 20, 35);
    documento.text("Qtd.", 100, 35);
    documento.text("Preço", 125, 35);
    documento.text("Subtotal", 160, 35);

    documento.line(20, 40, 190, 40);
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
    } 
    else {
        // edição
        const indice = carrinho.findIndex(function(produto){
            return produto.id === produtoEditando;
        });

        produto.id = produtoEditando;

        carrinho[indice] = produto;

        botaoPrincipal.textContent = "+ Adicionar Produto";
    
        produtoEditando = null;
    }

    atualizarCarrinho();

    nomeProduto.value = "";
    qtdProduto.value = "";
    precoProduto.value = "";
});

botaoPdf.addEventListener("click", function() {

    const { jsPDF } = window.jspdf;

    const documento = new jsPDF();

    function adicionarCabecalhoPDF() {

        documento.setFontSize(18);
        documento.text("Orçamento de Compras", 20, 20);

        documento.setFontSize(11);

        documento.text("Produto", 20, 35);
        documento.text("Qtd.", 100, 35);
        documento.text("Preço", 125, 35);
        documento.text("Subtotal", 160, 35);

        documento.line(20, 40, 190, 40);
    }

    adicionarCabecalhoPDF();

    let posicaoY = 50;

    carrinho.forEach(function(produto) {

        if (posicaoY > 270) {

            documento.addPage();

            adicionarCabecalhoPDF();

            posicaoY = 50;
        }

        documento.setFontSize(11);

        documento.text(
            produto.nome,
            20,
            posicaoY
        );

        documento.text(
            String(produto.quantidade),
            100,
            posicaoY
        );

        documento.text(
            "R$" + produto.preco.toFixed(2),
            125,
            posicaoY
        );

        documento.text(
            "R$" + produto.subtotal.toFixed(2),
            160,
            posicaoY
        );

        posicaoY += 8;
    });

    posicaoY += 5;

    documento.line(20, posicaoY, 190, posicaoY);

    posicaoY += 10;

    documento.setFontSize(14);

    documento.text(
        "TOTAL: R$" + totalCompra.toFixed(2),
        140,
        posicaoY
    );

    documento.save("orcamento-compras.pdf");
});

botaoCesta.addEventListener("click", function() {

    const confirmar = confirm(
        "Adicionar uma lista-base de cesta básica?\n\n" +
        "Os preços apresentados são apenas estimativas " +
        "e devem ser ajustados de acordo com os preços do mercado."
    );

    if (!confirmar) {
        return;
    }

    cestaBasica.forEach(function(item) {

        const produto = {
            id: Date.now() + Math.random(),
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
            subtotal: item.quantidade * item.preco
        };

        carrinho.push(produto);
    });

    atualizarCarrinho();
});