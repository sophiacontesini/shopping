// const { fetchItem } = require('./helpers/fetchItem');
// const { fetchProducts } = require("./helpers/fetchProducts");

const armazenaCarrinho = [];
let valor = 0;
const subTotal = document.querySelector('.total-price');
subTotal.innerText = valor;

// Requisito 5 somar os valores do carrinho/ Recebi ajuda do Halister turma 19, tribo A;
// seleciona os itens do carrinho pela classe cart__itmens, cria um array vazio para armazenar os precos e o valor.
// forEach para percorrer os items do carrinho adicionar ao arrValor com o push e separar com o split
// Outro forEach para percorrer o array precos e add em formato de number na ultima posicao do array;
const somaValores = () => {
  const itensCarrinho = document.querySelectorAll('.cart__item');
  const arrValor = [];
  const precos = [];
  itensCarrinho.forEach((item) => {
    arrValor.push(item.innerText.split('$')); // split é um método para separar
  });
  arrValor.forEach((item) => {
    precos.push(Number(item[item.length - 1]));
  });

// Condicao: se meu array de precos for menor que 1, atribua 0 a ele, se não, some os valores;
  if (precos.length < 1) {
    subTotal.innerText = 0;
  } else {
    valor = precos.reduce((acc, cV) => acc + cV).toFixed(2); // somar os valores acc com o reduce, to fixed(2) para dizer que serao duas casas decimais depois da vírgula;
    subTotal.innerText = parseFloat(valor); // parseFloat retorna um valor ignorando pontos flutuantes;
  }
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// Requisito 3
// Evento para remover os items que estao no carrinho ao clicar;
const cartItemClickListener = (event) => {
  event.target.remove();
  somaValores();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 4 
// forEach para percorrer os elementos da constante salva, selecionar a classe cart__items e tornar filhas dessa classe;
  const salvaStorage = () => { 
  const salva = JSON.parse(getSavedCartItems()); // JSON.parse converte de string para objeto
  salva.forEach((el) => document.querySelector('.cart__items')
  .appendChild(createCartItemElement({ sku: el.sku, name: el.name, salePrice: el.salePrice })));
  somaValores();
};

// Requisito 2 evento click que adiciona o item no carrinho
// Recebi ajuda do Halister turma 19 -tribo A;
// Parent node para resgatar a informacao que preciso 
// object destruction no getFetch para reatribuir nome das chaves, selecionar todas as classes cart__items e tornar filhas da classe;
const addCarrim = async (event) => {
  const id = event.target.parentNode;
  const getItem = getSkuFromProductItem(id);
  const getFetch = await fetchItem(getItem);
  const { id: sku, title: name, price: salePrice } = getFetch;
  document.querySelector('.cart__items')
    .appendChild(createCartItemElement({ sku, name, salePrice }));
  armazenaCarrinho.push({ sku, name, salePrice }); // 
  saveCartItems(JSON.stringify(armazenaCarrinho)); // mostrar o doc JSON como string
  somaValores();
};

// Requisito 2 funcao do click no botao;
const carrim = async () => {
  const botaozim = document.querySelectorAll('.item__add');
  botaozim.forEach((el) => el.addEventListener('click', addCarrim));
};

// Requisito 1 adiciona produtos na tela;
// Funçao assincrona pq depende dos dados da fetch, forEach em products.results para percorrer os elementos e faze-los filhos 
const appendList = async () => {
  const products = await fetchProducts('computador');
  products.results.forEach((el) =>
    document.querySelector('.items')
      .appendChild(createProductItemElement({ sku: el.id, name: el.title, image: el.thumbnail })));
  carrim();
};
// Requisito 6 esvaziar carrinho
// seleciona a classe do botao esvaziar, seleciona os items que estao no carrinho;
// ForEach para percorrer pelos items do carrinho e remove-los;
const botaoEsvaziar = document.querySelector('.empty-cart');
const apagaTudo = () => {
const itensCarrinho = document.querySelectorAll('.cart__item');
itensCarrinho.forEach((item) => {
  item.remove();
  somaValores();
});
};
// Requisito 7 
// A funcao carrecar cria uma div, add a classe carregando a ela e insere o texto 'Carregando'
// Seleciona os items e coloca como filhos dessa div
const carregar = () => {
  const carregando = document.createElement('div');
carregando.classList.add('loading');
carregando.innerText = 'Carregando...';
document.querySelector('.items').appendChild(carregando);
};
carregar();
const removerCarregando = () => document.querySelector('.loading').remove(); // seleciona classe loading e remove o Carregando quando a página tiver pronta;

botaoEsvaziar.addEventListener('click', apagaTudo); // evento de click no botaoEsvaziar

// Sumo: usar o assync awayt quando for uma função, o then quando for escopo global;
window.onload = () => {
  setTimeout(appendList, 2000);
  setTimeout(removerCarregando, 2000); // tempo de espera de carregamento
  if (localStorage.length > 0) salvaStorage();
};