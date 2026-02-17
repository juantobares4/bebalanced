const validateInfo = (data) => {
  return Object.values(data).some(value => value !== '' && value !== null && value !== undefined);

};

const objeto = {

};

if (validateInfo(objeto)) {
  console.log('Hay datos');

} else {
  console.log('No los hay');

};