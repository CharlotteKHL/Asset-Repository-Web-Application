function checkRegister() {

    resetAlerts();

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

    let email = document.getElementById("email").value;

    // validating the username 
    if (email == "") {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Please enter your email!', 'alert-danger', 'errorAlertPlaceholder', 'blankEmailAlert');
    } else if (email.search("@") == -1) {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Please enter a valid email, this must include an "@".', 'alert-danger', 'errorAlertPlaceholder', 'invalidEmailAlert');
    } else {
        formData.append("username", document.getElementById("email").value);
    }

    // validating the password 
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (password == "") {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Please enter your password!', 'alert-danger', 'errorAlertPlaceholder', 'blankPasswordAlert');

    } else if (password != password2) {
        valid = false;
        appendAlert('<i class="bi bi-exclamation-triangle"></i> Passwords do not match.', 'alert-danger', 'errorAlertPlaceholder', 'invalidPasswordMatch');

    } else {
        formData.append("password", password);
    }

    // Sends fetch to backend with user input to check if username unique and to input into database
    if (valid) {

        fetch('/register', {
                method: 'POST',
                body: formData,
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorMessage => {
                        throw new Error(errorMessage.error);
                    })
                }
            })
            .then(async data => {
                if (data.message == "Registration successful") {
                    appendAlert('<i class="bi bi-check-circle-fill"></i> ' + data.message + '! Redirecting to login...', 'alert-success', 'successAlertPlaceholder');
                    await sleep(2000);
                    window.location.replace('login.html');
                } else {
                    appendAlert('<i class="bi bi-exclamation-triangle"></i> Error: ' + data.message + '.', 'alert-danger', 'successAlertPlaceholder');
                }
            })
            .catch(error => {
                appendAlert('<i class="bi bi-exclamation-triangle"></i> Error: ' + error.message, 'alert-danger', 'successAlertPlaceholder');
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
} // When the page is started up, a check is carried out to confirm if the user is logged in or not
// If the user is logged in, then their username is displayed with a welcome message
// If the user is not logged in, then the Login/Register buttons are displayed instead

// Following this, if the user is not an admin then the "Manage Asset Types" button on the navigation bar does not appear 
document.addEventListener('DOMContentLoaded', function() {
    const appendAlert = (message, type, placeholder, alertId) => {
        const placeholderElement = document.getElementById(`${placeholder}`);
        const wrapper = document.createElement('div');
        wrapper.id = alertId;
        wrapper.classList.add("alertMsg");
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close alert"></button>
        </div>`
        ].join('');

        placeholderElement.append(wrapper);
    }
    fetch('/check', {
        method: 'POST',
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).then(async data => {
        if (data.username != "You are no longer logged in") {
            var loginRegisterButtons = document.getElementById('login-register-buttons');
            loginRegisterButtons.style.display = 'none';
            var welcomeUserMessage = document.getElementById('welcome-user-message');
            welcomeUserMessage.style.display = 'block';
            var usernameText = document.getElementById('username');
            usernameText.innerHTML = "Logged in as: " + data.username;
        } else {
            appendAlert('<i class="bi bi-check-circle-fill"></i> ' + data.username, 'danger', 'successAlertPlaceholder');
            await sleep(2000);
            window.location.replace('login.html');
        }
    }).catch(error => {
        console.error('Check fetch error:', error);
    });

    // Fetch to check if the user is an admin
    fetch('/adminCheck', {
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).then(data => {
        if (data.adminCheckResult == "ADMIN") {
            var manageAssetTypesButton = document.getElementById('manage-asset-types-button');
            manageAssetTypesButton.style.display = 'inline-block';
        }
    }).catch(error => {
        console.error('Admin check fetch error:', error);
    });
});


// Variable to represent the sleep interval
var sleepInterval;

// Function that allows an action to be performed, then pause before performing another action
function sleep(ms) {
    clearInterval(sleepInterval);
    return new Promise(resolve => sleepInterval = setTimeout(resolve, ms));
}

// Function allowing users to log out
function logout() {
    fetch('/logout', {
        method: 'POST'
    });
}