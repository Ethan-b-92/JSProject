var treatmentInfo_InnerHTML = "";
var treatmentDate_InnerHTML = "";
var workerEmail_InnerHTML = "";
var carNumber_InnerHTML = "";


(function () {
    var proxied = window.alert;
    window.alert = function () {
        modal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 id="myModalTitle" class="modal-title">Modal title</h4></div><div class="modal-body"><p>One fine body&hellip;</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
        modal.find(".modal-body").text(arguments[0]);
        modal.find(".modal-title").text("Something is Wrong...");
        modal.modal('show');
    };
})();

async function logout() {

    await fetch('/logout', { method: 'POST' })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        });
}

function validateEmail(email) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    return email.match(validRegex) ? true : false;
}

function validateCarNumber(carNumber) {
    var regex = /^[0-9]{6,8}$/;
    return carNumber.match(regex) ? true : false;
}


function addNewTreatment() {
    var treatmentInfo = document.getElementById("new_treatmentInfo").value;
    var date = document.getElementById("new_date").value;
    var workerEmail = document.getElementById("new_workerEmail").value;
    var carNumber = document.getElementById("new_carNumber").value;

    if (validation(treatmentInfo, date, workerEmail, carNumber)) {
        fetchDataToServer("", treatmentInfo, date, workerEmail, carNumber, '/addTreatment');
    }
}

function validation(treatmentInfo, date, workerEmail, carNumber) {
    const emailValidation = validateEmail(workerEmail);
    const carNumberValidation = validateCarNumber(carNumber);

    if (treatmentInfo == undefined || treatmentInfo == "") {
        alert("Treatment information field can't be empty!");
        return false;
    }
    else if (date == undefined || date == "") {
        alert("You must enter treatment date");
        return false;
    }
    else if (!emailValidation) {
        alert("Email field should match the format: aaa@bbb.ccc");
        return false;
    }
    else if (!carNumberValidation) {
        alert("Car number must be 5-8 digits number");
        return false;
    }
    return true;
}

async function fetchDataToServer(treatmentID, treatmentInfo, date, workerEmail, carNumber, url) {
    const data = { treatmentID: treatmentID, treatmentInfo: treatmentInfo, treatmentDate: date.toString().slice(0, 24), workerEmail: workerEmail, carNumber: carNumber };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    try {
        await fetch(url, options)
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(function (err) {
                console.info(err + " url: " + url);
            });
    } catch (e) {
        alert("Oops, our bad. Please refresh the page and try again later.");
    }
}

function editRow(idStr) {
    document.getElementById("edit_button" + idStr).style.display = "none";
    document.getElementById("remove_button" + idStr).style.display = "none";
    document.getElementById("save_button" + idStr).style.display = "inline";
    document.getElementById("cancel_button" + idStr).style.display = "inline";

    var treatmentInfo = document.getElementById("treatmentInfo" + idStr);
    var treatmentDate = document.getElementById("treatmentDate" + idStr);
    var workerEmail = document.getElementById("workerEmail" + idStr);
    var carNumber = document.getElementById("carNumber" + idStr);

    treatmentInfo_InnerHTML = treatmentInfo.innerHTML;
    treatmentDate_InnerHTML = treatmentDate.innerHTML;
    workerEmail_InnerHTML = workerEmail.innerHTML;
    carNumber_InnerHTML = carNumber.innerHTML;

    var treatmentInfo_data = treatmentInfo.innerText;
    var treatmentDate_data = treatmentDate.innerText;
    var workerEmail_data = workerEmail.innerText;
    var carNumber_data = carNumber.innerText;

    treatmentInfo.innerHTML = "<input type='text' id='treatmentInfo_text" + idStr + "' value='" + treatmentInfo_data + "' class='form-control form-control-user'>";
    treatmentDate.innerHTML = "<input type='text' id='treatmentDate_text" + idStr + "' value='" + treatmentDate_data + "' class='form-control form-control-user'>";
    workerEmail.innerHTML = "<input type='text' id='workerEmail_text" + idStr + "' value='" + workerEmail_data + "' class='form-control form-control-user'>";
    carNumber.innerHTML = "<input type='text' id='carNumber_text" + idStr + "' value='" + carNumber_data + "' class='form-control form-control-user'>";

}

async function saveRow(idStr) {
    var treatmentInfo = document.getElementById("treatmentInfo_text" + idStr).value;
    var treatmentDate = document.getElementById("treatmentDate_text" + idStr).value;
    var workerEmail = document.getElementById("workerEmail_text" + idStr).value;
    var carNumber = document.getElementById("carNumber_text" + idStr).value;

    if (validation(treatmentInfo, treatmentDate, workerEmail, carNumber)) {
        fetchDataToServer(idStr, treatmentInfo, treatmentDate, workerEmail, carNumber, '/editTreatment');
    }
}

async function removeRow(idStr) {
    const data = { treatmentID: idStr };
    const url = '/removeTreatment';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    try {
        await fetch(url, options)
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(function (err) {
                console.info(err + " url: " + url);
            });
    } catch (e) {
        alert("Oops, our bad. Please refresh the page and try again later.");
    }
}

function cancelEdit(idStr) {
    document.getElementById("treatmentInfo" + idStr).innerHTML = treatmentInfo_InnerHTML;
    document.getElementById("treatmentDate" + idStr).innerHTML = treatmentDate_InnerHTML;
    document.getElementById("workerEmail" + idStr).innerHTML = workerEmail_InnerHTML;
    document.getElementById("carNumber" + idStr).innerHTML = carNumber_InnerHTML;

    document.getElementById("edit_button" + idStr).style.display = "inline";
    document.getElementById("remove_button" + idStr).style.display = "inline";
    document.getElementById("save_button" + idStr).style.display = "none";
    document.getElementById("cancel_button" + idStr).style.display = "none";
}

