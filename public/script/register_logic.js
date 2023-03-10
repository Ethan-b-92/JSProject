const passwordRules = "Password must contain: \n1. At least one upper case letter\n\
2. At least one lower case letter \n3. At least one digit \n4. At least one special character\n\
5. At least 6 characters\nSpecial characters: : ! @ # \$ % ^ & * ( ) - _ = + \ | [ ] { } ; : / ? . > \<";
const emailRules = "Email field should match the format: aaa@bbb.ccc";

(function () {
    var proxied = window.alert;
    window.alert = function () {
        modal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 id="myModalTitle" class="modal-title">Modal title</h4></div><div class="modal-body"><p>One fine body&hellip;</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
        modal.find(".modal-body").text(arguments[0]);
        modal.find(".modal-title").text("Something is Wrong...");
        modal.modal('show');
    };
})();

var firstName = document.getElementById("firstName").value;
var lastName = document.getElementById("lastName").value;
var email = document.getElementById("email").value;
var password = document.getElementById("password").value;
var confirmPas = document.getElementById("confirm").value;

setToolTips();


function validateSignUp() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    confirmPas = document.getElementById("confirm").value;
    const [emailValidation, passwordValidation, nameValidation, confirmationValidation] = validateEmailAndPassword();

    if (emailValidation && passwordValidation && nameValidation && confirmationValidation) {
            fetchDataToServer(email, password, firstName, lastName);
    }
}

function validateEmailAndPassword() {
    var emailValidation = validateEmail();
    var passwordValidation = validatePassword();
    var nameValidation = validateName();
    var confirmationValidation = validateConfirmation();

    if (!emailValidation)
        alert("Invalid email!\n" + emailRules);
    else if (!passwordValidation)
        alert("Invalid password!\n" + passwordRules);
    else if (!nameValidation)
        alert("Name is required and must contain only English letters!");
    else if (!confirmationValidation)
        alert("Passwords do not match!");

    return [emailValidation, passwordValidation, nameValidation, confirmationValidation];
}

function validateName() {
    var regName = /^[a-zA-Z]+$/;
    return (regName.test(firstName) && regName.test(lastName));
}

function validateConfirmation() {
    return confirmPas === password;
}

function validateEmail() {
    var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;

    return email.match(validRegex) ? true : false;
}

function validatePassword() {
    var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");

    return passwordRegex.test(password);

}

function showPassword() {
    if (document.getElementById("password").type === "password") {
        document.getElementById("password").type = "text";
        document.getElementById("confirm").type = "text";
    } else {
        document.getElementById("password").type = "password";
        document.getElementById("confirm").type = "password";
    }
}

function setToolTips() {
    document.getElementById("password").title = passwordRules;
    document.getElementById("email").title = emailRules;
    document.getElementById("confirm").title = "Passwords must match";
    document.getElementById("firstName").title = "Name is required and must contain only English letters";
    document.getElementById("lastName").title = "Name is required and must contain only English letters";
}

function submitForm(email, password) {
    var captcha = document.querySelector('#g-recaptcha-response').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Accepts': 'application/json, text/plain. */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password, captcha: captcha })
    })
        .then((res) => res.json)
        .then((data) => {
            console.log(data);
            alert(data.msg);
        });
}

async function fetchDataToServer(email, password, firstName, lastName) {
    var captcha = document.querySelector('#g-recaptcha-response').value;
    const data = { firstName: firstName, lastName: lastName, email: email, password: password, captcha: captcha };
    const url = '/register';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(url, options).then(response => {
            if (response.redirected) {
                if(response.url.includes('register')) {
                    alert("This username already exists!");
                }
                else {
                window.location.href = response.url;
                }
            }
        })
        .catch(function(err) {
            console.info(err + " url: " + url);
        });
}

function validateRecaptcha() {
    const resp = grecaptcha.getResponse();
    if (resp.length == 0) {
        alert("You can't leave Captcha Code empty!");
        return false;
    }
    return true;
}

function recaptchaSelected()
{
    var recaptcha = document.getElementById("submitBtn");
    recaptcha.removeAttribute("disabled");
    recaptcha.removeAttribute("title");
}