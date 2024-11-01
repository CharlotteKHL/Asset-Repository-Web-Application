function checkLogin() {

    resetAlerts();

    const loginButton = document.getElementById('loginButton');

    let valid = true;

    var formData = new FormData();

    // The functions required to have the placeholder allow the alert(s) to appear above the form if input validation fails
    const appendAlert = (message, type, placeholder, alertId) => {
        const placeholderDiv = document.getElementById(`${placeholder}`);
        const wrapper = document.createElement('div');
        // Setting an id allows us to identify whether a specific alert already exists, thus preventing alerts from stacking
        wrapper.id = alertId;
        wrapper.classList.add("alertMsg");
        wrapper.innerHTML = [
            `<div class="alert ${type} alert-dismissible" role="alert">
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`
        ].join('');
        placeholderDiv.append(wrapper);
    }
    
    // validating the username 
    if ((document.getElementById("exampleInputEmail").value) == "") {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Please enter your email!', 'alert-danger', 'errorAlertPlaceholder', 'blankEmailAlert');
    } else {
        formData.append("username", document.getElementById("exampleInputEmail").value);
    }

    // validating the password 
    if ((document.getElementById("exampleInputPassword").value) == "") {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Please enter your password!', 'alert-danger', 'errorAlertPlaceholder', 'blankPasswordAlert');
    } else {
        formData.append("password", document.getElementById("exampleInputPassword").value);
    }

    // Portion that check if the server side validation has worked.
    if (valid) {
        fetch('/login', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorMessage =>{
                    throw new Error(errorMessage.error);
                })
            }
        })
        .then(async data => {
            if(data.message == "This username or password is not correct" || data.message == "You are no longer logged in") {
                appendAlert('<i class="bi bi-exclamation-triangle"></i> Error: ' + data.message + '.', 'alert-danger', 'successAlertPlaceholder');
            } else {
                appendAlert('<i class="bi bi-check-circle-fill"></i> ' + data.message + '! Redirecting...', 'alert-success', 'successAlertPlaceholder');
                await sleep(2000);
					window.location.replace("index.html");
				
            }
        })
        .catch(error => {
            appendAlert('<i class="bi bi-exclamation-triangle"></i> Error: ' + error.message + '.', 'alert-danger', 'successAlertPlaceholder');
        });
       
        
    }
}

// Variable to represent the sleep interval
var sleepInterval;

// Function that allows an action to be performed, then pause before performing another action
function sleep(ms) {
    clearInterval(sleepInterval);
    return new Promise(resolve => sleepInterval = setTimeout(resolve, ms));
}

function resetAlerts() {
    const alerts = Array.from(document.getElementsByClassName('alertMsg'));
    alerts.forEach(alert => {
        alert.remove();
    });
}
document.addEventListener('DOMContentLoaded', function(){
	  fetch('/check', {
        method: 'POST',
    }).then(response => {
        if(response.ok) {
            return response.json();
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            })
        }
    }).then(async data => {
        if(data.username != "You are no longer logged in") {
            let pathname = window.location.pathname;
				if((pathname == "/login.html") || (pathname == "/register.html")){
					window.location.replace("index.html");
				}
        }
    })
});
