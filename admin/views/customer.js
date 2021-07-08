export async function newCustomer(){
    const typePersonRes = await getTypePerson()
    let typePersonSelect = ""
    typePersonRes.forEach(element => {
        typePersonSelect += `<option value=${element.id}>${element.type}</option>`
    });

    return `
    <div class="card pop-up">
    <div class="pop-up_header">
        <h3>Crear Cliente</h3>
        <i class="fas fa-times-circle" name="close-pop-up" id="closeCustomer-pop-up"></i>
    </div>
    <div class="alert alert-success" id="customerAlert" role="alert" style="display: none;">
  ¡Cliente creado!
</div>
    <form>
        <div>
            <div class="row">
                <div class="col">
                    <span>Documento</span>
                    <input type="text" class="form-control" id="new_customer_id_input">
                </div>
                <div class="col">
                    <span>Nombres</span>
                    <input type="text" class="form-control" id="new_customer_name_input">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>Apellidos</span>
                    <input type="text" class="form-control" id="new_customer_lastName_input">
                </div>
                <div class="col">
                    <span>Celular</span>
                    <input type="tel" class="form-control" id="new_customer_phone_input">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>Email</span>
                    <input type="email" class="form-control" id="new_customer_email_input">
                </div>
                <div class="col">
                    <span>Tipo de persona</span>
                    <select class="form-control" id="new_customer_typePerson_select">
                        <option value="none" hidden>Seleccione una opcion</option>
                        ${typePersonSelect}
                    </select>
                </div>
            </div>
        </div>
        <div class="row center">
            <button type="button" class="btn btn-primary form-control" id="new_customer_button">Agregar</button>
        </div>
    </form>
</div>
    `
}

export function fetchCustomers(){
let customers = ""
     $.ajax("../backend/customers.php", {
        type: "get",
        data: { filterBy: "all" },
        success: function (res) {
          const detailRes = JSON.parse(res);
          detailRes.forEach((element) => {
            customers += `
                    <option value=${element.id}>${element.name} ${element.lastName}</option>
                    `;
          })
          document.getElementById('projectCustomer_select').innerHTML =  customers
        },
        error: function () {
          alert("No se ha podido obtener la información");
        },
      })  
}

async function getTypePerson(){
    let typePerson= ""
    await $.ajax({
        url: "../backend/fetchBd.php",
        data: {search: 'typePerson'},
        success: (res) => {
            typePerson = JSON.parse(res)
        }
    })
    return typePerson
}