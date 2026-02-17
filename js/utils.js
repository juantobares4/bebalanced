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
      iconUrl = './public/css/icons/x-circle-fill.svg';  

      break;

    case 'success':
      iconUrl = './public/css/icons/check-circle-fill.svg';

      break
  
    case 'warning':
      iconUrl = './public/css/icons/exclamation-triangle-fill.svg';

      break

    default:
      iconUrl = './public/css/icons/info-circle-fill.svg';

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
  return Object.values(data).some(value => value !== '' && value !== null && value !== undefined && value !== 0 && value !== data.id);

};