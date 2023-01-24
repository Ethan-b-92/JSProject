//const scoreDiv = document.querySelector("div.scoreboard"); // Find the scoreboard div in our html
const table = document.getElementById("dataTable");
let tableHeaders = ["Treatment Number", "Treatment Information", "Date", "Worker email", "Car Number", "Action"];

(function () {
    var proxied = window.alert;
    window.alert = function () {
        modal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 id="myModalTitle" class="modal-title">Modal title</h4></div><div class="modal-body"><p>One fine body&hellip;</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
        modal.find(".modal-body").text(arguments[0]);
        modal.find(".modal-title").text("Something is Wrong...");
        modal.modal('show');
    };
})();

function createTreatmentsTable() {
    //while (scoreDiv.firstChild)
    //    scoreDiv.removeChild(scoreDiv.firstChild); // Remove all children from scoreboard div (if any)
    //let scoreboardTable = document.createElement('table'); // Create the table itself
    //scoreboardTable.className = 'scoreboardTable';

    let tableHead = document.createElement('thead'); // Creates the table header group element
    //tableHead.className = 'tableHead';
    let tableHeaderRow = document.createElement('tr'); // Creates the row that will contain the headers
    //tableHeaderRow.className = 'tableHeaderRow';

    // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header row
    tableHeaders.forEach(header => {
        let treatmentHeader = document.createElement('th'); // Creates the current header cell during a specific iteration
        treatmentHeader.innerText = header;
        tableHeaderRow.append(treatmentHeader); // Appends the current header cell to the header row
    });

    tableHead.append(tableHeaderRow); // Appends the header row to the table header group element
    table.append(tableHead);

    let tableBody = document.createElement('tbody'); // Creates the table body group element
    //tableBody.className = "scoreboardTable-Body";
    table.append(tableBody); // Appends the table body group element to the table

    //scoreDiv.append(scoreboardTable); // Appends the table to the scoreboard div

}

// The function below will accept a single score and its index to create the global ranking
function appendTreatments(treatment, index) {
    //const scoreboardTable = document.querySelector('.scoreboardTable'); // Find the table we created
    let tableBodyRow = document.createElement('tr'); // Create the current table row
    //tableBodyRow.className = 'scoreboardTableBodyRow';

    // Lines 72-85 create the 5 column cells that will be appended to the current table row
    let treatmentIndex = document.createElement('td');
    treatmentIndex.innerText = index;
    let treatmentNumber = document.createElement('td');
    treatmentNumber.innerText = treatment.treatmentNumber;
    let treatmentInformation = document.createElement('td');
    treatmentInformation.innerText = treatment.treatmentInformation;
    let date = document.createElement('td');
    date.innerText = treatment.date;
    let workerEmail = document.createElement('td');
    workerEmail.innerText = treatment.workerEmail;
    let carNumber = document.createElement('td');
    carNumber.innerText = treatment.carNumber;
    let action = document.createElement('td');

    let edit = document.createElement('button');
    edit.innerText = "Edit";
    let remove = document.createElement('button');
    remove.innerText = "Remove";
    action.append(edit, remove);


    tableBodyRow.append(treatmentIndex, treatmentNumber, treatmentInformation, date, workerEmail, carNumber, action); // Append all 5 cells to the table row
    table.append(tableBodyRow);// Append the current row to the scoreboard table body
};

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
    var treatmentInfo = document.getElementById("treatmentInfo").value;
    var date = document.getElementById("date").value;
    var workerEmail = document.getElementById("workerEmail").value;
    var carNumber = document.getElementById("carNumber").value;
    const emailValidation = validateEmail(workerEmail);
    const carNumberValidation = validateCarNumber(carNumber);

    if (treatmentInfo == "") alert("Treatment information field can't be empty!")
    else if (date == "") alert("You must enter treatment date");
    else if (!emailValidation) alert("Email field should match the format: aaa@bbb.ccc");
    else if (!carNumberValidation) alert("Car number must be 5-8 digits number");
    else {
        console.log("1");
        fetchDataToServer(treatmentInfo, date, workerEmail, carNumber);
    }
}

async function fetchDataToServer(treatmentInfo, date, workerEmail, carNumber) {
    const data = { treatmentInfo: treatmentInfo, date: date, workerEmail: workerEmail, carNumber: carNumber };
    const url = '/addTreatment';
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

// function edit_row(no) {
//     document.getElementById("edit_button" + no).style.display = "none";
//     document.getElementById("save_button" + no).style.display = "block";

//     var name = document.getElementById("name_row" + no);
//     var country = document.getElementById("country_row" + no);
//     var age = document.getElementById("age_row" + no);

//     var name_data = name.innerHTML;
//     var country_data = country.innerHTML;
//     var age_data = age.innerHTML;

//     name.innerHTML = "<input type='text' id='name_text" + no + "' value='" + name_data + "'>";
//     country.innerHTML = "<input type='text' id='country_text" + no + "' value='" + country_data + "'>";
//     age.innerHTML = "<input type='text' id='age_text" + no + "' value='" + age_data + "'>";
// }

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

// function delete_row(no) {
//     document.getElementById("row" + no + "").outerHTML = "";
// }

// function add_row() {
//     var new_name = document.getElementById("new_name").value;
//     var new_country = document.getElementById("new_country").value;
//     var new_age = document.getElementById("new_age").value;

//     var table = document.getElementById("data_table");
//     var table_len = (table.rows.length) - 1;
//     var row = table.insertRow(table_len).outerHTML = "<tr id='row" + table_len + "'><td id='name_row" + table_len + "'>" + new_name + "</td><td id='country_row" + table_len + "'>" + new_country + "</td><td id='age_row" + table_len + "'>" + new_age + "</td><td><input type='button' id='edit_button" + table_len + "' value='Edit' class='edit' onclick='edit_row(" + table_len + ")'> <input type='button' id='save_button" + table_len + "' value='Save' class='save' onclick='save_row(" + table_len + ")'> <input type='button' value='Delete' class='delete' onclick='delete_row(" + table_len + ")'></td></tr>";

//     document.getElementById("new_name").value = "";
//     document.getElementById("new_country").value = "";
//     document.getElementById("new_age").value = "";
// }