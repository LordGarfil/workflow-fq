import { getFormattedDateTime, showAlert } from "../../js/app.js";
import {fetchCustomers} from "../views/customer.js"

export class clsCustomer {
  constructor() {
    (this.id = document.getElementById("new_customer_id_input").value),
      (this.name = document.getElementById("new_customer_name_input").value),
      (this.lastName = document.getElementById("new_customer_lastName_input").value),
      (this.phone = document.getElementById("new_customer_phone_input").value),
      (this.email = document.getElementById("new_customer_email_input").value),
      (this.typePerson = document.getElementById("new_customer_typePerson_select").value),
      this.status = 1,
      this.creationDate = getFormattedDateTime()
  }

   addCustomer() {
      if(this.isInfoFilled()){
        $.ajax("../backend/customers.php", {
            type: "post",
            data: {
              action: "create",
              id: this.getInfo().id,
              name: this.getInfo().name,
              lastName: this.getInfo().lastName,
              phone: this.getInfo().phone,
              email: this.getInfo().email,
              typePerson: this.getInfo().typePerson,
              status: this.getInfo().status,
              creationDate: this.getInfo().creationDate
            },
            success: function (res) {
              const jsonRes = JSON.parse(res);
              if (jsonRes.error) {
                console.warn(jsonRes.message);
              } else {
                new clsCustomer().resetInputFields()
                $("#customerAlert").show(1500);
                fetchCustomers()
                setTimeout(() => {
                  $("#customerAlert").hide(1500);
                }, 3000);
              }
            },
            error: function (err) {
              alert(err);
            },
          });
    }else{
      alert("Llene todos los campos!");
    }   
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      email: this.email,
      typePerson: this.typePerson,
      status: this.status,
      creationDate: this.creationDate,
    };
  }

  isInfoFilled(){
    let isFilled = true
    for(const element in this.getInfo()){
      if(element != 'email'){
        if(this.getInfo()[element] == "" || this.getInfo()[element] == "none"){
          isFilled = false
      }
      }
    }
    return isFilled
  }

  resetInputFields(){
    document.getElementById("new_customer_id_input").value = ""
    document.getElementById("new_customer_name_input").value = ""
    document.getElementById("new_customer_lastName_input").value = ""
    document.getElementById("new_customer_phone_input").value = ""
    document.getElementById("new_customer_email_input").value = ""
    document.getElementById("new_customer_typePerson_select").value = ""
    document.getElementById("new_customer_id_input").focus()
  }

}
