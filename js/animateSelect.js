export const showCheckboxes = function(expanded) {
  document.getElementById("selectBox").onclick = ()=>{
    
  if (!expanded) {
    document.getElementById("checkBoxes").style.display = "flex";
    expanded = true;
    showFilterInputs()
  } else {
    document.getElementById("checkBoxes").style.display = "none";
    expanded = false;
  }
  }

}

const showFilterInputs = function(){

  document.getElementById("clientFilterSelect").onchange = ()=> {
    if(document.getElementById("clientFilterSelect").checked){
      document.getElementById("txtClientFilter").style.display = "block"
    }else{
      document.getElementById("txtClientFilter").style.display = "none"
    }
  }

  document.getElementById("responsibleFilterSelect").onchange = ()=> {
    if(document.getElementById("responsibleFilterSelect").checked){
      document.getElementById("txtResponsibleFilter").style.display = "block"
    }else{
      document.getElementById("txtResponsibleFilter").style.display = "none"
    }
  }

  document.getElementById("beginDateFilterSelect").onchange = ()=> {
    if(document.getElementById("beginDateFilterSelect").checked){
      document.getElementById("dateBeginFilter").style.display = "block"
    }else{
      document.getElementById("dateBeginFilter").style.display = "none"
    }
  }

  document.getElementById("finishDateFilterSelect").onchange = ()=> {
    if(document.getElementById("finishDateFilterSelect").checked){
      document.getElementById("dateFinishFilter").style.display = "block"
    }else{
      document.getElementById("dateFinishFilter").style.display = "none"
    }
  }
}

export function onlyOneSelect(){
  $('input[type="checkbox"]').on('change', function() {
    $('input[type="checkbox"]').not(this).prop('checked', false);
 });
}