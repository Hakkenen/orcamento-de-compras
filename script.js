const nomeProduto = document.getElementById("nome-produto");
const qtdProduto = document.getElementById("qtd-produto");
const precoProduto = document.getElementById("preco-produto");
const formulario = document.getElementById("nova-compra");
const listaProdutos = document.getElementById("lista-produtos");
const mostraTotal = document.getElementById("total-compra");
const botaoPdf = document.getElementById("gerar-pdf");
const botaoCesta = document.getElementById("adicionar-cesta");
const botaoPrincipal = document.getElementById("botao-principal");
const botaoLimpar = document.getElementById("limpar-carrinho");
const mostrarAno = document.getElementById("ano");
const agora = new Date();

let produtoEditando = null;
let carrinho = [];
let totalCompra = 0;

// Carregar dados salvos
const carrinhoSalvo = localStorage.getItem("carrinho");
if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
    atualizarCarrinho();
}

// Cesta básica ajustada com quantidade padrão 1
const cestaBasica = [
    { nome: "Arroz", quantidade: 1, preco: 0.00 },
    { nome: "Feijão", quantidade: 1, preco: 0.00 },
    { nome: "Macarrão", quantidade: 1, preco: 0.00 },
    { nome: "Açúcar", quantidade: 1, preco: 0.00 },
    { nome: "Café", quantidade: 1, preco: 0.00 },
    { nome: "Leite", quantidade: 1, preco: 0.00 },
    { nome: "Óleo", quantidade: 1, preco: 0.00 },
    { nome: "Farinha de trigo", quantidade: 1, preco: 0.00 },
    { nome: "Sal", quantidade: 1, preco: 0.00 },
    { nome: "Biscoito", quantidade: 1, preco: 0.00 },
    { nome: "Achocolatado", quantidade: 1, preco: 0.00 },
    { nome: "Margarina", quantidade: 1, preco: 0.00 },
    { nome: "Extrato de tomate", quantidade: 1, preco: 0.00 },
    { nome: "Milho", quantidade: 1, preco: 0.00 },
    { nome: "Ervilha", quantidade: 1, preco: 0.00 },
    { nome: "Sardinha", quantidade: 1, preco: 0.00 },
    { nome: "Ovos", quantidade: 1, preco: 0.00 },
    { nome: "Pão", quantidade: 1, preco: 0.00 },
    { nome: "Queijo", quantidade: 1, preco: 0.00 },
    { nome: "Presunto", quantidade: 1, preco: 0.00 },
    { nome: "Frango", quantidade: 1, preco: 0.00 },
    { nome: "Carne moída", quantidade: 1, preco: 0.00 },
    { nome: "Linguiça", quantidade: 1, preco: 0.00 },
    { nome: "Batata", quantidade: 1, preco: 0.00 },
    { nome: "Cebola", quantidade: 1, preco: 0.00 },
    { nome: "Tomate", quantidade: 1, preco: 0.00 },
    { nome: "Alface", quantidade: 1, preco: 0.00 },
    { nome: "Banana", quantidade: 1, preco: 0.00 },
    { nome: "Maçã", quantidade: 1, preco: 0.00 },
    { nome: "Laranja", quantidade: 1, preco: 0.00 },
    { nome: "Sabonete", quantidade: 1, preco: 0.00 },
    { nome: "Shampoo", quantidade: 1, preco: 0.00 },
    { nome: "Creme dental", quantidade: 1, preco: 0.00 },
    { nome: "Papel higiênico", quantidade: 1, preco: 0.00 },
    { nome: "Detergente", quantidade: 1, preco: 0.00 },
    { nome: "Sabão em pó", quantidade: 1, preco: 0.00 },
    { nome: "Água sanitária", quantidade: 1, preco: 0.00 },
    { nome: "Esponja", quantidade: 1, preco: 0.00 },
    { nome: "Papel toalha", quantidade: 1, preco: 0.00 },
    { nome: "Sacos para lixo", quantidade: 1, preco: 0.00 }
];

function editarProduto(id) {
    const produto = carrinho.find(p => p.id === id);
    if (!produto) return;

    nomeProduto.value = produto.nome;
    qtdProduto.value = produto.quantidade;
    precoProduto.value = produto.preco;

    produtoEditando = id;
    botaoPrincipal.textContent = "✏️ Editar Produto";
    nomeProduto.focus();
}

function removerProduto(id) {
    carrinho = carrinho.filter(p => p.id !== id);
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
                <strong>R$ ${produto.subtotal.toFixed(2)}</strong>
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
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Evento de envio do formulário
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    
    const qtd_Produto = Number(qtdProduto.value);
    const preco_Produto = Number(precoProduto.value);
    const subtotal = qtd_Produto * preco_Produto;

    // CORREÇÃO: Utilizando qtd_Produto em vez de qtdProduto na verificação
    if (
        nomeProduto.value.trim() === "" ||
        isNaN(qtd_Produto) || qtd_Produto <= 0 ||
        isNaN(preco_Produto) || preco_Produto < 0
    ) {
        alert("Preencha o produto, a quantidade e o preço corretamente.");
        return;
    }

    if (produtoEditando === null) {
        const produto = {
            id: Date.now(),
            nome: nomeProduto.value.trim(),
            quantidade: qtd_Produto,
            preco: preco_Produto,
            subtotal: subtotal
        };
        carrinho.push(produto);
    } else {
        const indice = carrinho.findIndex(p => p.id === produtoEditando);
        if (indice !== -1) {
            carrinho[indice] = {
                id: produtoEditando,
                nome: nomeProduto.value.trim(),
                quantidade: qtd_Produto,
                preco: preco_Produto,
                subtotal: subtotal
            };
        }
        botaoPrincipal.textContent = "+ Adicionar produto";
        produtoEditando = null;
    }

    atualizarCarrinho();

    nomeProduto.value = "";
    qtdProduto.value = "";
    precoProduto.value = "";
    nomeProduto.focus();
});

// Geração de PDF com Numeração de Páginas (Página X de Y)
botaoPdf.addEventListener("click", function() {
    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho antes de gerar o PDF.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const documento = new jsPDF();

    function desenharCabecalho() {
        documento.setFont("helvetica", "bold");
        documento.setFontSize(18);
        documento.text("Orçamento de Compras", 20, 20);

        documento.setFontSize(11);
        documento.text("Produto", 20, 35);
        documento.text("Qtd.", 100, 35);
        documento.text("Preço", 125, 35);
        documento.text("Subtotal", 160, 35);

        documento.setLineWidth(0.5);
        documento.line(20, 40, 190, 40);
    }

    desenharCabecalho();
    let posicaoY = 50;

    // 1. Renderiza os itens e cria novas páginas se necessário
    carrinho.forEach(function(produto) {
        if (posicaoY > 260) {
            documento.addPage();
            desenharCabecalho();
            posicaoY = 50;
        }

        documento.setFont("helvetica", "normal");
        documento.setFontSize(11);
        documento.text(produto.nome, 20, posicaoY);
        documento.text(String(produto.quantidade), 100, posicaoY);
        documento.text("R$ " + produto.preco.toFixed(2), 125, posicaoY);
        documento.text("R$ " + produto.subtotal.toFixed(2), 160, posicaoY);

        posicaoY += 8;
    });

    posicaoY += 5;
    documento.line(20, posicaoY, 190, posicaoY);
    posicaoY += 10;

    documento.setFont("helvetica", "bold");
    documento.setFontSize(14);
    documento.text("TOTAL: R$ " + totalCompra.toFixed(2), 130, posicaoY);

    // 2. Adiciona a numeração "Página X de Y" no rodapé de todas as páginas
    const totalPaginas = documento.internal.getNumberOfPages();

    for (let i = 1; i <= totalPaginas; i++) {
        documento.setPage(i);
        documento.setFont("helvetica", "normal");
        documento.setFontSize(9);
        documento.setTextColor(120, 120, 120); // Cor cinza suave para o rodapé

        // Linha divisória do rodapé
        documento.line(20, 280, 190, 280);

        // Texto do rodapé alinhado à direita
        const textoRodape = `Página ${i} de ${totalPaginas}`;
        documento.text(textoRodape, 190, 286, { align: "right" });

        // Identificação opcional à esquerda
        documento.text("Orçamento de Compras - José Hakkenen - Web Developper", 20, 286);
    }

    documento.save("orcamento-compras.pdf");
});

// Adicionar Cesta Básica
botaoCesta.addEventListener("click", function() {
    const confirmar = confirm(
        "Adicionar uma lista-base de cesta básica?\n\n" +
        "Ajuste a quantidade e o preço dos itens conforme o mercado."
    );

    if (!confirmar) return;

    cestaBasica.forEach(function(item) {
        carrinho.push({
            id: Date.now() + Math.random(),
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
            subtotal: item.quantidade * item.preco
        });
    });

    atualizarCarrinho();
});

// Limpar Carrinho
botaoLimpar.addEventListener("click", function() {
    if (carrinho.length === 0) return;

    const confirmar = confirm("Tem certeza que deseja limpar todo o carrinho?");
    if (!confirmar) return;

    carrinho = [];
    produtoEditando = null;
    atualizarCarrinho();

    nomeProduto.value = "";
    qtdProduto.value = "";
    precoProduto.value = "";
    botaoPrincipal.textContent = "+ Adicionar produto";
});

// Registra o Service Worker para suporte Offline e PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
  });
}

// mostra o ano no footer

mostrarAno.textContent = agora.getFullYear();
