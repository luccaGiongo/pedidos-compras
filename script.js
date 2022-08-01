// Variável para controle da Quantidade do Pedido;
let cart = [];
let modalQt = 0;
let modelKey = 0;
// Facilitador de seleção do componentes;
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


// listagem das produtos;
produtoJson.map((item, index)=>{
    // Clonagem das Divs de casa produto;
    let produtoItem = c('.models .produto-item').cloneNode(true);
    // Setando Valores do Json e Novos Atributos;
    produtoItem.setAttribute('data-key', index);
    produtoItem.querySelector('.produto-item--img img').src = item.img;
    produtoItem.querySelector('.produto-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    produtoItem.querySelector('.produto-item--name').innerHTML = item.name;
    produtoItem.querySelector('.produto-item--desc').innerHTML = item.description;
    // Ações do Link "a"
    produtoItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        // Target para pegar o próprio que foi clicado;
        // Closest para pegar a classe do elemento de cima mais próximo;
        // Pega o valor do atributo "data-key" deste componente;
        let key = e.target.closest('.produto-item').getAttribute('data-key');
        // Para sempre iniciar com quantidade mínima = 1;
        modalQt = 1;
        modelKey = key;
        // Vai prencher os dados de acordo o elemento clicado;
        c('.produtoBig img').src = produtoJson[key].img;
        c('.produtoInfo h1').innerHTML = produtoJson[key].name;
        c('.produtoInfo--desc').innerHTML = produtoJson[key].description;
        c('.produtoInfo--actualPrice').innerHTML = `R$ ${produtoJson[key].price.toFixed(2)}`;
        // classList "remove" ou "add" servem para alterar classes de um elemento;
        c('.produtoInfo--size.selected').classList.remove('selected');
        cs('.produtoInfo--size').forEach((size, sizeIndex)=>{
            if (sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = produtoJson[key].sizes[sizeIndex];

        });

        c('.produtoInfo--qt').innerHTML = modalQt;
        // abertura do Modal (parte dos pedido);
        // Opacity 0 e depois pra 1, com delay transition, setado no CSS;
        c('.produtoWindowArea').style.opacity = 0;
        // O default é "none", só deve parecer mediante "click" no "a";
        c('.produtoWindowArea').style.display = 'flex';
        setTimeout(()=>{
           c('.produtoWindowArea').style.opacity = 1;
        }, 200)
    });
    // Vai colocando cada elemento novo criado, ao lado, embaixo, ordenadamento;
    c('.produto-area').append( produtoItem );
});

// Eventos do Modal
function closeModal(){
    c('.produtoWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.produtoWindowArea').style.display = 'none';
     }, 500);
}
// Para funcionar, tanto no desktop como mobile
cs('.produtoInfo--cancelButton, .produtoInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// Botão + e - do Modal - Quantidades

c('.produtoInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1){
        modalQt--;
        c('.produtoInfo--qt').innerHTML = modalQt;
    }
});

c('.produtoInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.produtoInfo--qt').innerHTML = modalQt;
});

// seleção tamanho da produto - Pequena, Média, Grande

cs('.produtoInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.produtoInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Ação botão "add carrinho"

c('.produtoInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.produtoInfo--size.selected').getAttribute('data-key'));

    let indentifier = produtoJson[modelKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.indentifier == indentifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    }else{
        cart.push({
            indentifier,
            id: produtoJson[modelKey].id,
            size, 
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});

// update cart

// abrir carrinho - mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    } 
});
//fechar carrinho - mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.menu-closer').style.cursor = 'pointer';
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let produtoItem = produtoJson.find((item)=>item.id == cart[i].id);
            subtotal += produtoItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let produtoSizeName;
            switch(cart[i].size) {
                case 0:
                    produtoSizeName = "P";
                    break;
                case 1:
                    produtoSizeName = "M";
                    break;
                case 2:
                    produtoSizeName = "G";
                    break;
            }

            let produtoName = `${produtoItem.name} (${produtoSizeName})`;

            cartItem.querySelector('img').src = produtoItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = produtoName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();  
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto; 
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove ('show');
        c('aside').style.left = '100vw';
    }
};

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').classList.remove ('show');
    c('aside').style.left = '100vw';
});
