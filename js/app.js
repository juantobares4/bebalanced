import { calculatePercentage, capitalizeFirstLetter, filterAndGetTotal, getFormData, getStatusIcon, validateInfo, validateTransaction  } from './utils.js';
import { formatCurrency, updateCashFlow } from './utils.js';
import { saveInLocalStorage, getFromLocalStorage } from './utils.js';
import { links } from './links.js';

const formRestartBudget = document.getElementById('form-restart-budget');
const formTransactions = document.getElementById('form-transactions');
const navbarLinks = document.querySelectorAll('.navbar-links');
let transactions = getFromLocalStorage('transactions'); // Necesito una pila de datos para luego mostrarlos uno por uno.

const showBudget = (container) => {
  const budget = getFromLocalStorage('budget'); // A diferencia de las transacciones, necesito un solo presupuesto, por lo tanto, no necesitaría pushear un dato, sino simplemente sobreescribirlo para luego mostrarlo.

  if (budget.length) { 
    container.classList.add('numbers-font');
    // Si el .length es mayor que 0, entra al if porque un número distinto de cero se evalúa como true.
    budget.forEach(amount => {
      amount >= 0 ? 
      container.innerHTML = `<b>$ </b>${formatCurrency(amount)}` : 
      container.innerHTML = `<b>$ </b>-${formatCurrency(amount)}`;  
    
    }); 

  } else {
    // Si el .length es 0, entra al else porque 0 se evalúa como false.
    container.innerHTML = `<b>$ </b>${formatCurrency(0)}`;

  };
  
};

const showToast = (type, title, msg) => {
  const mainContainer = document.getElementById('main-container');

  let toastWrapper = document.getElementById('toast-wrapper');
  
  if (!toastWrapper) {
    toastWrapper = document.createElement('div');
    toastWrapper.id = 'toast-wrapper';
    toastWrapper.className = 'toast-container position-fixed top-0 start-50 translate-middle-x end-0 p-3';
    toastWrapper.style.zIndex = 1055;
    mainContainer.appendChild(toastWrapper);
  
  };

  const imgSrc = getStatusIcon(type);

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-header titles-font">
      <img src="${imgSrc}" class="rounded me-2" alt="icon" style="width: 20px; height: 20px;">
      <strong class="me-auto text-${type === 'success' ? 'success' : 'danger'}" style="font-size: 14px">${title}</strong>
      <small class="text-muted ms-2">Just now</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-center paragraph-font" style="font-size: 13px">
      ${msg}
    </div>
  
  `;

  toastWrapper.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
  
  bsToast.show();

  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  
  });

};

const scrollTo = (id) => {
  const linkId = id;
  const sectionId = links[linkId];

  const targetSection = document.getElementById(sectionId);

  if (targetSection) {
    const offset = 320;
    const elementTop = targetSection.getBoundingClientRect().top + window.scrollY;
    const scrollPosition = elementTop - offset;

    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    
    });
  
  };

};

const viewTotalIncomesAndExpenses = () => {
  const containerTotalIncomes = document.getElementById('total-amount-incomes');
  const containerTotalExpenses = document.getElementById('total-amount-expenses');
  const containerPercentage = document.getElementById('total-percentage');

  const totalIncomes = filterAndGetTotal(transactions, 'income'); // En este caso, filtra por el atributo 'income'.
  const totalExpenses = filterAndGetTotal(transactions, 'expense'); // En este caso, filtra por el atributo 'expense'.
  const percentage = calculatePercentage(totalExpenses, totalIncomes);

  containerTotalIncomes.textContent = `$${formatCurrency(totalIncomes)}`;
  containerTotalExpenses.textContent = `$${formatCurrency(totalExpenses)}`;
  containerPercentage.textContent = `%${percentage}`; 
 
};

const updateBudgetInSection = () => {
  const viewBudget = document.getElementById('available-budget');

  if (viewBudget) {
    showBudget(viewBudget);

  };

};

const viewTransactions = () => {
  const sectionIncomes = document.getElementById('section-incomes');
  const sectionExpenses = document.getElementById('section-expenses');
  const transactionsContent = document.getElementById('content-transactions');
  const existingMessage = document.querySelector('.table-none');

  if (existingMessage) {
    existingMessage.remove();
  
  };

  const totalExpenses = filterAndGetTotal(transactions, 'expense');

  sectionIncomes.innerHTML = '';
  sectionExpenses.innerHTML = '';

  if (transactions.length) {  
    const incomes = transactions.filter(obj => obj.transactionType === 'income');
    const expenses = transactions.filter(obj => obj.transactionType === 'expense');

    const tableIncomes = document.createElement('table');
    tableIncomes.className = 'table border w-100 table-striped shadow flex-grow-1';
    tableIncomes.style.height = '100%';

    const headTableIncomes = document.createElement('thead');
    const tableRowIncomes = document.createElement('tr');
    const tableHeaderIncomes = document.createElement('th');
    const titleHeaderIncomes = document.createElement('h4');

    titleHeaderIncomes.classList.add('titles-font', 'text-success');
    titleHeaderIncomes.innerHTML = `<img class="p-4" src="./css/icons/graph-up-arrow.svg" alt="">Ingresos`;

    tableHeaderIncomes.appendChild(titleHeaderIncomes);
    tableRowIncomes.appendChild(tableHeaderIncomes);
    headTableIncomes.appendChild(tableRowIncomes);

    const bodyTableIncomes = document.createElement('tbody');
    bodyTableIncomes.classList.add('paragraph-font');

    if (!incomes.length) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td class="p-3 text-center text-muted paragraph-font empty-section" colspan="1">
          <small>No hay ingresos registrados.</small>
        </td>
      `;
      bodyTableIncomes.appendChild(emptyRow);
    
    } else {
      incomes.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="p-3 numbers-font table-cell" data-id='${item.id}'>
            <div class="d-flex justify-content-between w-100 effect">
              <b class="text-success">${capitalizeFirstLetter(item.description)}</b>
              <span class="bg-dark-subtle px-2 rounded text-success">+ $${formatCurrency(item.amount)}</span>
            </div>
          </td>
        `;
        
        bodyTableIncomes.appendChild(row);
      
      });
    
    };

    tableIncomes.appendChild(headTableIncomes);
    tableIncomes.appendChild(bodyTableIncomes);
    sectionIncomes.appendChild(tableIncomes);

    const tableExpenses = document.createElement('table');
    tableExpenses.className = 'table border w-100 table-striped shadow flex-grow-1';
    tableExpenses.style.height = '100%';

    const headTableExpenses = document.createElement('thead');
    const tableRowExpenses = document.createElement('tr');
    const tableHeaderExpenses = document.createElement('th');
    const titleHeaderExpenses = document.createElement('h4');

    titleHeaderExpenses.classList.add('titles-font', 'text-danger');
    titleHeaderExpenses.innerHTML = `<img class="p-4" src="./css/icons/graph-down-arrow.svg" alt="">Egresos`;

    tableHeaderExpenses.appendChild(titleHeaderExpenses);
    tableRowExpenses.appendChild(tableHeaderExpenses);
    headTableExpenses.appendChild(tableRowExpenses);

    const bodyTableExpenses = document.createElement('tbody');
    bodyTableExpenses.classList.add('paragraph-font');

    if (!expenses.length) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td class="p-3 text-center text-muted" colspan="1">
          <small>No hay egresos registrados.</small>
        </td>
      `;
      bodyTableExpenses.appendChild(emptyRow);
    
    } else {
      expenses.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="p-3 numbers-font table-cell" data-id='${item.id}'>
            <div class="d-flex justify-content-between w-100 effect">
              <b class="text-danger">${capitalizeFirstLetter(item.description)}</b>
              <div class="d-flex gap-1">
                <span class="bg-dark-subtle px-2 rounded text-danger">- $${formatCurrency(item.amount)}</span>
                <span class="bg-dark-subtle px-2 rounded text-danger" title="Porcentaje respecto al total de egresos.">%${calculatePercentage(item.amount, totalExpenses)}</span>
              </div>
            </div>
          </td>
        `;
        
        bodyTableExpenses.appendChild(row);
      
      });
    
    };

    tableExpenses.appendChild(headTableExpenses);
    tableExpenses.appendChild(bodyTableExpenses);
    sectionExpenses.appendChild(tableExpenses);

    document.querySelectorAll('.table-cell').forEach(td => {
      td.addEventListener('click', deleteTransaction);
    
    });

  } else {
    const existingBudget = document.getElementById('budget-container');
    if (existingBudget) existingBudget.remove();

    const emptySection = document.createElement('small');
    emptySection.classList.add('table-none', 'empty-section', 'paragraph-font', 'text-muted', 'text-center');
    emptySection.style.marginBottom = '50px';
    emptySection.textContent = 'Todavía no tenés registrada ninguna transacción.';

    transactionsContent.appendChild(emptySection);
  
  };

  updateBudgetInSection();

};

const deleteTransaction = (event) => {
  const mainElementBudget = document.getElementById('total-budget');
  const transactionId = event.currentTarget.dataset.id; // data-id='${item.id}'
  const totalBudget = getFromLocalStorage('budget')[0];
  const findTransaction = transactions.find(item => item.id === transactionId);

  const adjustment = findTransaction.transactionType === 'income' ? 
  totalBudget - findTransaction.amount :
  totalBudget + findTransaction.amount;

  transactions = transactions.filter(item => item.id !== transactionId);

  saveInLocalStorage('transactions', transactions);
  saveInLocalStorage('budget', [adjustment]);

  showBudget(mainElementBudget);
  viewTransactions();
  viewTotalIncomesAndExpenses();

};

const clearTransactions = () => {
  transactions = [];

  saveInLocalStorage('transactions', transactions);

  viewTotalIncomesAndExpenses();
  viewTransactions();
  showToast('success', '¡Volviste a empezar!', 'Tus transacciones y tu presupuesto se reiniciaron con éxito.');

};

const handleRestartBudget = (event) => {
  event.preventDefault();

  const userConfirm = confirm('¿Estás seguro que deseas empezar de nuevo?');
  const budget = getFromLocalStorage('budget')[0];

  if (userConfirm && budget) {
    const mainElementBudget = document.getElementById('total-budget');
  
    saveInLocalStorage('budget', [0]); // Esto hace que no se me arme una pila de datos, sino que el nuevo dato reemplace al anterior.
  
    updateCashFlow(0, 'restart', 0);
    showBudget(mainElementBudget);
    updateBudgetInSection();
    clearTransactions();
  
    formRestartBudget.reset();

  } else {
    showToast('error', 'No tenés presupuesto', 'Ups... No hay nada que reiniciar.');

  };

};

const handleSubmitTransactions = (event) => { 
  event.preventDefault();

  const mainElementBudget = document.getElementById('total-budget');
  const formData = getFormData(formTransactions);
  const totalBudget = getFromLocalStorage('budget');
  const budget = !totalBudget.length /* Si no hay presupuesto en el localstorage */ ? 0 : Number(totalBudget[0]);
  
  if (!validateInfo(formData)) {
    showToast('error', 'Formulario vacío', 'Tenés que completar los campos.');
    
    return;
    
  };
  
  const isValid = validateTransaction(formData.amount, budget);

  if (formData.transactionType === 'income' || isValid) {
    const message = formData.transactionType === 'income' ? 'El ingreso fue añadido correctamente al presupuesto.' : 'El egreso fue añadido correctamente al presupuesto.'

    transactions.push(formData); // Actualiza el estado actual de la sesión
    saveInLocalStorage('transactions', transactions); // Asegura que el estado persista en caso de cerrar la página.
  
    /* IMPORTANTE: El localStorage, al no ser reactivo, no actualiza automáticamente el DOM cuando sus valores cambian. Por eso, para poder mostrar los datos en tiempo real, es necesario actualizar manualmente las variables en memoria (por ejemplo, un array) y luego re-renderizar el contenido del DOM con esos datos actualizados. */
  
    viewTransactions();
    viewTotalIncomesAndExpenses();
    updateCashFlow(budget, formData.transactionType, formData.amount);
    showBudget(mainElementBudget);
    updateBudgetInSection();
    showToast('success', 'Transacción registrada con éxito', message);
  
    formTransactions.reset(); // Vacía el formulario.

  } else {
    showToast('error', 'Error al registrar la operación', 'No tenés presupuesto suficiente para registrar un egreso de dinero.');

  };


};

const main = () => {
  const mainElementBudget = document.getElementById('total-budget');

  showBudget(mainElementBudget); // Mantiene actualizado el presupuesto al iniciar la página y al enviar el formulario.

  viewTransactions();
  viewTotalIncomesAndExpenses();

};

formRestartBudget.addEventListener('submit', handleRestartBudget);
formTransactions.addEventListener('submit', handleSubmitTransactions);

navbarLinks.forEach(link => link.addEventListener('click', (event) => {
  event.preventDefault();
  const id = link.dataset.id;
  
  scrollTo(id);

}));

main();