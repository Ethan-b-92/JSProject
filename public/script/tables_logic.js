//const scoreDiv = document.querySelector("div.scoreboard"); // Find the scoreboard div in our html
const table = document.getElementById("dataTable");
let tableHeaders = ["Treatment Number", "Treatment Information", "Date", "Worker email", "Car Number", "Action"];

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

const getTreatments = () => {
    fetch('/tables') // Fetch for all scores. The response is an array of objects that is sorted in decreasing order
        .then(res => res.json())
        .then(treatmentList => {
            table = document.getElementById("dataTable");
            createTreatmentsTable(); // Clears scoreboard div if it has any children nodes, creates & appends the table
            // Iterates through all the objects in the scores array and appends each one to the table body
            for (const treatment of treatmentList) {
                let index = treatmentList.indexOf(treatment) + 1; // Index of score in score array for global ranking (these are already sorted in the back-end)
                appendTreatments(treatment, index); // Creates and appends each row to the table body
            }
        });
};

async function logout() {

    await fetch('/logout', { method: 'POST' })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    });
}