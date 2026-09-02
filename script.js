// ==========================================================================
// SERVICE WORKER (Suporte Offline / PWA)
// ==========================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

// ==========================================================================
// SELETORES DOM
// ==========================================================================
const nomeProduto = document.getElementById("nome-produto");
const qtdProduto = document.getElementById("qtd-produto");
const precoProduto = document.getElementById("preco-produto");
const formulario = document.getElementById("nova-compra");
const listaProdutos = document.getElementById("lista-produtos");
const mostraTotal = document.getElementById("total-compra");
const botaoPdf = document.getElementById("gerar-pdf");
const botaoCesta = document.getElementById("adicionar-cesta");
const botaoLimpar = document.getElementById("limpar-carrinho");
const mostrarAno = document.getElementById("ano");

// Seletores do Modal de Edição
const modalEdicao = document.getElementById("modal-edicao");
const formEdicao = document.getElementById("form-edicao");
const editNomeProduto = document.getElementById("edit-nome-produto");
const editQtdProduto = document.getElementById("edit-qtd-produto");
const editPrecoProduto = document.getElementById("edit-preco-produto");
const fecharModal = document.getElementById("fechar-modal");

// Estilo Dinâmico para Travar a Rolagem quando o Modal abrir
const estiloModal = document.createElement("style");
estiloModal.innerHTML = `body.modal-aberto { overflow: hidden; }`;
document.head.appendChild(estiloModal);

// ==========================================================================
// ESTADO DA APLICAÇÃO
// ==========================================================================
let produtoEditando = null;
let carrinho = [];
let totalCompra = 0;

// Atualiza o ano no rodapé
if (mostrarAno) {
    mostrarAno.textContent = new Date().getFullYear();
}

// Recupera carrinho do localStorage
const carrinhoSalvo = localStorage.getItem("carrinho");
if (carrinhoSalvo) {
    try {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    } catch (e) {
        carrinho = [];
    }
}

// Lista Padrão de Cesta Básica (40 itens)
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

// ==========================================================================
// FUNÇÕES DE GERENCIAMENTO DO CARRINHO
// ==========================================================================
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

// ==========================================================================
// FORMULÁRIO PRINCIPAL (Adicionar Produto)
// ==========================================================================
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    
    const qtd_Produto = Number(qtdProduto.value);
    const preco_Produto = Number(precoProduto.value);
    const subtotal = qtd_Produto * preco_Produto;

    if (
        nomeProduto.value.trim() === "" ||
        isNaN(qtd_Produto) || qtd_Produto <= 0 ||
        isNaN(preco_Produto) || preco_Produto < 0
    ) {
        alert("Preencha o produto, a quantidade e o preço corretamente.");
        return;
    }

    const produto = {
        id: Date.now() + Math.random(),
        nome: nomeProduto.value.trim(),
        quantidade: qtd_Produto,
        preco: preco_Produto,
        subtotal: subtotal
    };

    carrinho.push(produto);
    atualizarCarrinho();

    nomeProduto.value = "";
    qtdProduto.value = "";
    precoProduto.value = "";
    nomeProduto.focus();
});

// ==========================================================================
// LÓGICA DO MODAL DE EDIÇÃO
// ==========================================================================
function editarProduto(id) {
    const produto = carrinho.find(p => p.id === id);
    if (!produto) return;

    editNomeProduto.value = produto.nome;
    editQtdProduto.value = produto.quantidade;
    editPrecoProduto.value = produto.preco;

    produtoEditando = id;
    modalEdicao.classList.add("ativo");
    document.body.classList.add("modal-aberto");
    
    // Seleciona o conteúdo da quantidade para alteração rápida
    setTimeout(() => {
        editQtdProduto.focus();
        editQtdProduto.select();
    }, 50);
}

function fecharModalEdicao() {
    modalEdicao.classList.remove("ativo");
    document.body.classList.remove("modal-aberto");
    produtoEditando = null;
}

formEdicao.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const qtd = Number(editQtdProduto.value);
    const preco = Number(editPrecoProduto.value);

    if (
        editNomeProduto.value.trim() === "" ||
        isNaN(qtd) || qtd <= 0 ||
        isNaN(preco) || preco < 0
    ) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const indice = carrinho.findIndex(p => p.id === produtoEditando);
    if (indice !== -1) {
        carrinho[indice] = {
            id: produtoEditando,
            nome: editNomeProduto.value.trim(),
            quantidade: qtd,
            preco: preco,
            subtotal: qtd * preco
        };
    }

    fecharModalEdicao();
    atualizarCarrinho();
});

fecharModal.addEventListener("click", fecharModalEdicao);

modalEdicao.addEventListener("click", (e) => {
    if (e.target === modalEdicao) {
        fecharModalEdicao();
    }
});

// ==========================================================================
// BOTÕES DE AÇÃO
// ==========================================================================

// Inserir Cesta Básica
botaoCesta.addEventListener("click", function() {
    const confirmar = confirm(
        "Adicionar a lista completa de cesta básica (40 itens)?\n\n" +
        "Ajuste os preços dos itens conforme for fazendo as compras."
    );

    if (!confirmar) return;

    cestaBasica.forEach(function(item, index) {
        carrinho.push({
            id: Date.now() + index + Math.random(),
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
});

// Gerar PDF Paginado
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

    const totalPaginas = documento.internal.getNumberOfPages();

    for (let i = 1; i <= totalPaginas; i++) {
        documento.setPage(i);
        documento.setFont("helvetica", "normal");
        documento.setFontSize(9);
        documento.setTextColor(120, 120, 120);

        documento.line(20, 280, 190, 280);
        documento.text(`Página ${i} de ${totalPaginas}`, 190, 286, { align: "right" });
        documento.text("Orçamento de Compras - Mercado", 20, 286);
    }

    documento.save("orcamento-compras.pdf");
});
// ==========================================================================
// LEITURA DE CÓDIGO DE BARRAS E BUSCA NA API
// ==========================================================================
const btnEscanear = document.getElementById("btn-escanear");
const modalScanner = document.getElementById("modal-scanner");
const fecharScanner = document.getElementById("fechar-scanner");
const statusScanner = document.getElementById("status-scanner");

let html5QrCode = null;

// Abre a câmera e inicia o leitor
btnEscanear.addEventListener("click", () => {
    modalScanner.classList.add("ativo");
    statusScanner.textContent = "Acessando câmera...";

    html5QrCode = new Html5Qrcode("leitor-camera");

    const config = { fps: 10, qrbox: { width: 250, height: 150 } };

    html5QrCode.start(
        { facingMode: "environment" }, // Usa a câmera traseira
        config,
        aoDetectarCodigo
    ).catch(err => {
        statusScanner.textContent = "Erro ao acessar a câmera. Verifique as permissões.";
    });
});

// Callback ao ler o código com sucesso
function aoDetectarCodigo(decodedText) {
    statusScanner.textContent = `Código lido: ${decodedText}. Buscando produto...`;
    
    // Para a câmera
    pararScanner();

    // Consulta API pública Open Food Facts (Brasil)
    fetch(`https://br.openfoodfacts.org/api/v0/product/${decodedText}.json`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 1 && data.product.product_name) {
                nomeProduto.value = data.product.product_name;
            } else {
                alert(`Código ${decodedText} lido! Produto não encontrado na base de dados pública. Digite o nome manualmente.`);
            }
        })
        .catch(() => {
            alert(`Código ${decodedText} lido! Não foi possível buscar o nome online (sem conexão).`);
        })
        .finally(() => {
            modalScanner.classList.remove("ativo");
            qtdProduto.focus();
        });
}

function pararScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
        }).catch(() => {});
    }
}

fecharScanner.addEventListener("click", () => {
    pararScanner();
    modalScanner.classList.remove("ativo");
});