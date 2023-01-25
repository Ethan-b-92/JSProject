//const scoreDiv = document.querySelector("div.scoreboard"); // Find the scoreboard div in our html
//const table = document.getElementById("dataTable");
//let tableHeaders = ["Treatment Number", "Treatment Information", "Date", "Worker email", "Car Number", "Action"];

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

// function createTreatmentsTable() {
//     //while (scoreDiv.firstChild)
//     //    scoreDiv.removeChild(scoreDiv.firstChild); // Remove all children from scoreboard div (if any)
//     //let scoreboardTable = document.createElement('table'); // Create the table itself
//     //scoreboardTable.className = 'scoreboardTable';

//     let tableHead = document.createElement('thead'); // Creates the table header group element
//     //tableHead.className = 'tableHead';
//     let tableHeaderRow = document.createElement('tr'); // Creates the row that will contain the headers
//     //tableHeaderRow.className = 'tableHeaderRow';

//     // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header row
//     tableHeaders.forEach(header => {
//         let treatmentHeader = document.createElement('th'); // Creates the current header cell during a specific iteration
//         treatmentHeader.innerText = header;
//         tableHeaderRow.append(treatmentHeader); // Appends the current header cell to the header row
//     });

//     tableHead.append(tableHeaderRow); // Appends the header row to the table header group element
//     table.append(tableHead);

//     let tableBody = document.createElement('tbody'); // Creates the table body group element
//     //tableBody.className = "scoreboardTable-Body";
//     table.append(tableBody); // Appends the table body group element to the table

//     //scoreDiv.append(scoreboardTable); // Appends the table to the scoreboard div

// }

// // The function below will accept a single score and its index to create the global ranking
// function appendTreatments(treatment, index) {
//     //const scoreboardTable = document.querySelector('.scoreboardTable'); // Find the table we created
//     let tableBodyRow = document.createElement('tr'); // Create the current table row
//     //tableBodyRow.className = 'scoreboardTableBodyRow';

//     // Lines 72-85 create the 5 column cells that will be appended to the current table row
//     let treatmentIndex = document.createElement('td');
//     treatmentIndex.innerText = index;
//     let treatmentNumber = document.createElement('td');
//     treatmentNumber.innerText = treatment.treatmentNumber;
//     let treatmentInformation = document.createElement('td');
//     treatmentInformation.innerText = treatment.treatmentInformation;
//     let date = document.createElement('td');
//     date.innerText = treatment.date;
//     let workerEmail = document.createElement('td');
//     workerEmail.innerText = treatment.workerEmail;
//     let carNumber = document.createElement('td');
//     carNumber.innerText = treatment.carNumber;
//     let action = document.createElement('td');

//     let edit = document.createElement('button');
//     edit.innerText = "Edit";
//     let remove = document.createElement('button');
//     remove.innerText = "Remove";
//     action.append(edit, remove);


//     tableBodyRow.append(treatmentIndex, treatmentNumber, treatmentInformation, date, workerEmail, carNumber, action); // Append all 5 cells to the table row
//     table.append(tableBodyRow);// Append the current row to the scoreboard table body
// };

// const getTreatments = () => {
//     fetch('/tables') // Fetch for all scores. The response is an array of objects that is sorted in decreasing order
//         .then(res => res.json())
//         .then(treatmentList => {
//             table = document.getElementById("dataTable");
//             createTreatmentsTable(); // Clears scoreboard div if it has any children nodes, creates & appends the table
//             // Iterates through all the objects in the scores array and appends each one to the table body
//             for (const treatment of treatmentList) {
//                 let index = treatmentList.indexOf(treatment) + 1; // Index of score in score array for global ranking (these are already sorted in the back-end)
//                 appendTreatments(treatment, index); // Creates and appends each row to the table body
//             }
//         });
// };

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
    
    if(validation(treatmentInfo, date, workerEmail, carNumber)) {
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
    const data = { treatmentID: treatmentID, treatmentInfo: treatmentInfo, treatmentDate: date.toString().slice(0,24), workerEmail: workerEmail, carNumber: carNumber };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(url, options)
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
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

    if(validation(treatmentInfo, treatmentDate, workerEmail, carNumber)) {
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
    await fetch(url, options)
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
}

// function save_row(no) {
//     var name_val = document.getElementById("name_text" + no).value;
//     var country_val = document.getElementById("country_text" + no).value;
//     var age_val = document.getElementById("age_text" + no).value;

//     document.getElementById("name_row" + no).innerHTML = name_val;
//     document.getElementById("country_row" + no).innerHTML = country_val;
//     document.getElementById("age_row" + no).innerHTML = age_val;

//     document.getElementById("edit_button" + no).style.display = "block";
//     document.getElementById("save_button" + no).style.display = "none";
// }

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

