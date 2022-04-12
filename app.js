
// Variáveis
const $zipcode = document.querySelector('#zipcode');
const $output = document.querySelector('#output');
const msg = {
  "zipcode_invalid": "O CEP informado é inválido.",
  "zipcode_notfound": "O CEP informado não existe!",
  "zipcode_error": "Ocorreu um erro ao realizar a consulta do CEP, tente novamente.",
};
// Aplica a máscara no formato padrão do CEP/BR
VMasker($zipcode).maskPattern("99999-999");

// Entrada para realizar a busca do cep desejado
document.querySelector('#search').addEventListener('submit', getZipcode);

// Saida Quando clicado no botao
document.querySelector("body").addEventListener("click", closeOutput);


// Obtém o CEP
function getZipcode(event) {
  event.preventDefault();

  loading('on');

  if (!zipcodeValidation($zipcode.value)) {
    loading('off');
    $output.innerHTML = showMessage(msg.zipcode_invalid, "is-danger");
    $zipcode.focus();
    throw Error(msg.zipcode_invalid);
  }

  // Buscar o CEP usando api de busca do Viacep
  fetch(`https://viacep.com.br/ws/${$zipcode.value}/json/`)
  .then(response => {

    loading('off');

    if (response.status != 200) {
      $output.innerHTML = showMessage(msg.zipcode_error, "is-danger");
      $zipcode.focus();
      throw Error(response.status);
    }
    else {
      return response.json();
    }
  })
  .then(data => {
    loading('off');

    if (data.erro) {
      $output.innerHTML = showMessage(msg.zipcode_notfound, "is-warning");
      $zipcode.focus();
    }
    else {    
      const message = `
        <ul>
          <li><strong>Endereço: </strong>${data.logradouro}</li>
          <li><strong>Bairro: </strong>${data.bairro}</li>
          <li><strong>Cidade: </strong>${data.localidade}</li>
          <li><strong>Estado: </strong>${data.uf}</li>
        </ul>
    `;
      
      $output.innerHTML = showMessage(message);
    }
  })
  .catch(err => console.warn(err));
}

// Validação do código do cep
function zipcodeValidation(value) {
  return /(^[0-9]{5}-[0-9]{3}$|^[0-9]{8}$)/.test(value) ? true : false;
}

function closeOutput(event) {
  if (event.target.className == 'delete') {
    $output.innerHTML = '';
    $zipcode.value = '';
    $zipcode.focus();
  }
}

// Carregando do dados
function loading(status) {
  let is_invisible = (status == 'on') ? '' : 'is-invisible';
  $output.innerHTML = `
    <div class="has-text-centered">
      <span class="button is-white is-size-2 is-loading ${is_invisible}"></span>
    </div>
  `;
}

// Função para mostrar mensagem no alerta de erro, sucesso ou aviso
function showMessage (message, typeMessage = "") {
  return `
    <article class="message ${typeMessage}">
      <div class="message-header">
        <p>CEP: <strong>${$zipcode.value}</strong></p>
        <button class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body">${message}</div>
    </article>
  `;

}
function salvarForm(){      

  if(localStorage.cont) {
     localStorage.cont = Number(localStorage.cont)+1
  } else {
     localStorage.cont = 1
  }       
  cad = document.getElementById('nome').value + ';' + document.getElementById('cpf').value + ';' 
  + document.getElementById('cnpj').value + ';' + document.getElementById('zipcode').value + ';' +document.getElementById('zipcode').values;
  localStorage.setItem("cad_"+localStorage.cont,cad);
 }
