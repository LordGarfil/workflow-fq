import {router, router2} from "../routes/routes.js"

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

  return true;
}

function editableSelectValue_asign(input, select) {
  input.value = select.selectedOptions[0].text;
  console.log(input.value);
}

export function setFormattedDate(date){
  let formattedDate = date.split("-", 3)
  let year = formattedDate[0]
  let month = formattedDate[1]
  let day = formattedDate[2].split(" ", 1)[0] 
  
  switch (month) {
    case '01':
      month = 'Enero'
      break;
    case '02':
      month = 'Febrero'
      break;
    case '03':
      month = 'Marzo'
      break;
    case '04':
      month = 'Abril'
      break;
    case '05':
      month = 'Mayo'
      break;
    case '06':
      month = 'Junio'
      break;
    case '07':
      month = 'Julio'
      break;
    case '08':
      month = 'Agosto'
      break;
    case '09':
      month = 'Septiembre'
      break;
    case '10':
      month = 'Octubre'
      break;
    case '11':
      month = 'Noviembre'
      break;
    case '12':
      month = 'Diciembre'
      break;
  
    default:
      break;
  }
  return `${day} de ${month.toLowerCase()} del ${year}`
}

export function setFormattedDateTime(date){
  let formattedDate = date.split("-", 3)
  let year = formattedDate[0]
  let month = formattedDate[1]
  let day = formattedDate[2].split(" ", 1)[0]
  let time = formattedDate[2].slice(3, 8)
  
  
  switch (month) {
    case '01':
      month = 'Enero'
      break;
    case '02':
      month = 'Febrero'
      break;
    case '03':
      month = 'Marzo'
      break;
    case '04':
      month = 'Abril'
      break;
    case '05':
      month = 'Mayo'
      break;
    case '06':
      month = 'Junio'
      break;
    case '07':
      month = 'Julio'
      break;
    case '08':
      month = 'Agosto'
      break;
    case '09':
      month = 'Septiembre'
      break;
    case '10':
      month = 'Octubre'
      break;
    case '11':
      month = 'Noviembre'
      break;
    case '12':
      month = 'Diciembre'
      break;
  
    default:
      break;
  }
  return `${day} de ${month.toLowerCase()} del ${year} (${time})`
}

export const redirectFile = (file) =>{
  window.location.href = file
}

window.addEventListener('hashchange', ()=>{
  router(location.hash)
})

window.onload = () => {
  router2(location.href)
}