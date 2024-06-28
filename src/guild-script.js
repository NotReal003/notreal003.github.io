function submitForm() {
    var ign = document.getElementById('ign').value;
    var discordId = document.getElementById('discordId').value;
    var reason = document.getElementById('reason').value;
    var wins = document.getElementById('wins').value;

    if (!ign || !discordId || !reason || !wins) {
        showErrorMessage("Please fill in all the answers.");
        return;
    }

    showLoadingScreen();

    var lastSubmission = getCookie("lastSubmission");

    if (lastSubmission) {
        var lastSubmissionTime = new Date(lastSubmission).getTime();
        var currentTime = new Date().getTime();
        var hoursSinceLastSubmission = (currentTime - lastSubmissionTime) / (1000 * 60 * 60);

        if (hoursSinceLastSubmission < 24) {
            showErrorMessage("You can only submit one application every 24 hours. Please wait for Guild managers to check your application or try again later.");
            hideLoadingScreen();
            return;
        }
    }

    var webhookUrl = "https://discord.com/api/webhooks/1204409213120684032/6hPe0nsnX-MPnlSjFgmDtgcBZ2xBVyjsmoCCFk0-8GFZkrtVgaJ3f5P6vRYep-DpSwJ-"; // Replace this with your actual Discord webhook URL

    var formData = {
        "IGN": ign,
        "Discord ID": discordId,
        "Reason to Join": reason,
        "Estimated Weekly Wins": wins
    };

    var embedMessage = {
        "embeds": [{
            "title": "New Guild Application",
            "description": `**In-game username:** [${ign}](https://ngmc.co/p/${ign})\n**Discord ID/Username:** ${discordId}\n**Tell us about yourself:** ${reason}\n**Estimated Weekly Wins:** ${wins}`,
            "color": 16750848,
            "footer": {
                "text": "HAXTIME Guild Application"
            }
        }]
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", webhookUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            hideLoadingScreen();

            if (xhr.status === 204) {
                showSuccessMessage();
            } else {
                showErrorMessage("Error submitting application. Please try again later.");
            }
        }
    };

    xhr.send(JSON.stringify(embedMessage));

    setCookie("lastSubmission", new Date().toUTCString(), 24);
}

function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'flex';
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}

function showSuccessMessage() {
    var successMessageElement = document.createElement('p');
    successMessageElement.className = 'success-message';

    // Customize the success message text
    successMessageElement.innerHTML = 'Your Application submitted successfully! Join our <a href="https://discord.gg/sqVBrMVQmp" style="color: #FF8521; text-decoration: underline;">Discord Server</a> to get updates on your application.';

    removeMessages();
    document.getElementById('form-container').appendChild(successMessageElement);
}

function showErrorMessage(message) {
    var errorMessageElement = document.createElement('p');
    errorMessageElement.className = 'error-message';
    errorMessageElement.textContent = message;

    removeMessages();
    document.getElementById('form-container').appendChild(errorMessageElement);
}

function removeMessages() {
    var messages = document.querySelectorAll('.success-message, .error-message');
    messages.forEach(function (message) {
        message.remove();
    });
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(name, value, hours) {
    var expires = "";
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

document.addEventListener('DOMContentLoaded', function () {
    var formContainer = document.getElementById('form-container');
    formContainer.style.display = 'block';

    setTimeout(function () {
        hideLoadingScreen();
    }, 2000);
});
