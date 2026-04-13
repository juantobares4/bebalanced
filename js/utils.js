import { links } from "./links.js";

export const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : [];

};

export const saveInLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data)); // Convierte array u objeto de Javascript a cadena de texto en formato JSON.

};

export const getStatusIcon = (status) => {
  let iconUrl;
  
  switch (status) {
    case 'error':
      iconUrl = '<i class="bi bi-x-circle me-1"></i>';  

      break;

    case 'success':
      iconUrl = '<i class="bi bi-check-circle me-1"></i>';

      break
  
    case 'warning':
      iconUrl = '<i class="bi bi-exclamation-circle me-1"></i>';

      break

    default:
      iconUrl = '<i class="bi bi-info-circle me-1"></i>';

      break

  };

  return iconUrl;

};

export const generateRandomId = () => {
  const randomId = `${Date.now().toString(36)}${Math.random().toString(23)}`;

  return randomId;

};

export const getFormData = (form) => {
  const formData = new FormData(form); // Crea una colección especial que contiene pares clave/valor de los campos del formulario. 
  // Atributo name del input = clave
  // Lo que el usuario escribió = valor
  // Ejemplo: lastname: Tobares
  const objectData = Object.fromEntries(formData.entries()); // Convierte lista de pares clave/valor en un objeto literal.

  if (('amount' in objectData)) {
    objectData.amount = Number(objectData.amount);

  };

  objectData.id = generateRandomId();

  return objectData;

};

export const formatCurrency = (number) => {
   const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  
  }).format(number);

  const rest = formatted.slice(2);

  return rest;

};

export const filterAndGetTotal = (arr, attr) => {  
  return arr
    .filter(data => data.transactionType === attr)
    .reduce((accum, value) => accum + Number(value.amount), 0); 

};

export const calculatePercentage = (value, total) => {
  if (value === 0 || total === 0) return 0;
  
  return formatCurrency((Number(value) / Number(total)) * 100); 

};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);

};

export const updateCashFlow = (totalBudget, transactionType, amount) => {
  let budgetUpdate;

  switch (transactionType) {
    case 'income':
      budgetUpdate = Number(totalBudget) + Number(amount);
        
      break;
      
    case 'expense':
      budgetUpdate = Number(totalBudget) - Number(amount);
      
      break;

    case 'restart':
      budgetUpdate = 0;

      break;
  
  };

  saveInLocalStorage('budget', [budgetUpdate]);

};

export const validateTransaction = (amount, totalBudget) => {
  if (amount <= totalBudget) {
    return true;

  } else {
    return false;  

  };

};

export const validateInfo = (data) => {
  return Object.values(data).some(value => !value);

};

export const showToast = (type, title, msg, container) => {
  const mainContainer = document.getElementById(container) || document.body;
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

  const typeMap = {
    success: "success",
    error: "danger",
    info: "info",
    warning: "warning"
  
  };

  toast.innerHTML = `
    <div class="toast-header titles-font">
      ${imgSrc}
      <strong class="me-auto text-${typeMap[type] || 'primary'}" style="font-size: 14px">${title}</strong>
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

export const scrollTo = (id) => {
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