const passwordRules = "Password must contain: \n1. At least one upper case letter\n\
2. At least one lower case letter \n3. At least one digit \n4. At least one special character\n\
5. At least 6 characters\nSpecial characters: : ! @ # \$ % ^ & * ( ) - _ = + \ | [ ] { } ; : / ? . > \<";
const emailRules = "Email field should match the format: aaa@bbb.ccc";
//var modalTitle = "Something is Wrong...";

var email = document.getElementById("email").value;
var password = document.getElementById("password").value;

setToolTips();

(function () {
    var proxied = window.alert;
    window.alert = function () {
        modal = $('<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 id="myModalTitle" class="modal-title">Modal title</h4></div><div class="modal-body"><p>One fine body&hellip;</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
        modal.find(".modal-body").text(arguments[0]);
        modal.find(".modal-title").text("Something is Wrong...");
        modal.modal('show');
    };
})();


function validateLogIn() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    const [emailValidation, passwordValidation] = validateEmailAndPassword();

    if (emailValidation && passwordValidation) {
        if (validateRecaptcha(email, password)) {
            //modalTitle = "Congrats!";
            //alert('You successfully logged into your account! \nEmail: ' + email +' \nPassword: ' + password);
            //submitForm(email, password);
            fetchDataToServer(email, password);
        }

    }
}

function validateEmailAndPassword() {
    var emailValidation = validateEmail();
    var passwordValidation = validatePassword();
    //modalTitle = "Something is Wrong...";

    if (!emailValidation)
        alert("Invalid email!\n" + emailRules);

    else if (!passwordValidation)
        alert("Invalid password!\n" + passwordRules);

    return [emailValidation, passwordValidation];
}

function validateEmail() {
    var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;

    return email.match(validRegex) ? true : false;
}

function validatePassword() {
    var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})");

    return passwordRegex.test(password);

}

function setToolTips() {
    document.getElementById("password").title = passwordRules;
    document.getElementById("email").title = emailRules;
}

function submitForm(email, password) {
    var captcha = document.querySelector('#g-recaptcha-response').value;

    fetch('/login', {
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

async function fetchDataToServer(email, password) {
    var captcha = document.querySelector('#g-recaptcha-response').value;
    const data = { email: email, password: password, captcha: captcha };
    const url = '/login';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    await fetch(url, options).then(response => {
        //document.getElementById("modal").ariaHidden = false;
        //('#modal').modal('show');
        var text = response.text();
        if(!response.ok) {
            return response.text().then(text => { throw new Error(text) })
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
        .catch(function (err) {
            console.info(err + " url: " + url);
        });
    //await response.
    //const json = await response.json();
    //console.log(json);
    //response.redirected('/tables');
    //  if(json.msg == "failed captcha verification")
    //  {
    //      alert("Recaptcha failed! Are you a robot?");
    //  }
    //  else if(json.msg == "failed captcha verification"){
    //     window.location.replace("/tables");
    //  }
}

function validateRecaptcha() {
    const resp = grecaptcha.getResponse();
    if (resp.length == 0) {
        alert("You can't leave Captcha Code empty!");
        return false;
    }
    return true;
}

function recaptchaSelected() {
    var recaptcha = document.getElementById("submitBtn");
    recaptcha.removeAttribute("disabled");
    recaptcha.removeAttribute("title");
}