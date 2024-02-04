document.addEventListener('DOMContentLoaded', function () {
  // Show the loading screen
  document.getElementById('loading-screen').style.display = 'flex';
});

window.addEventListener('load', function () {
  // Hide the loading screen
  setTimeout(function() {
    document.getElementById('loading-screen').style.display = 'none';
  }, 3000); // 1 second
  document.body.classList.add('loaded');
});
var toggleButton = document.getElementById('mode-toggle');
toggleButton.addEventListener('click', function () {
  document.body.classList.toggle('night-mode');
  if (document.body.classList.contains('night-mode')) {
    toggleButton.textContent = 'Day Mode';
  } else {
    toggleButton.textContent = 'Night Mode';
  }
  // Add animation when switching modes
  document.body.style.animation = 'changeMode 1s';
  setTimeout(function() {
    document.body.style.animation = '';
  }, 1000);
});

// Add touch interaction for CTA buttons
document.querySelectorAll('.cta-button').forEach(function(button) {
  button.addEventListener('touchstart', function() {
    button.classList.add('active');
  });
  button.addEventListener('touchend', function() {
    button.classList.remove('active');
  });
});

document.addEventListener('DOMContentLoaded', function () {
    // if the user has a visit date cookie
    const lastVisit = getCookie('lastVisit');

    // Get current date
    const currentDate = new Date().toISOString();

    // Set a cookie with the current date if no previous visit date exists or if the last visit was more than 7 days ago
    if (!lastVisit || (new Date(lastVisit).getTime() + 7 * 24 * 60 * 60 * 1000) < new Date().getTime()) {
        setCookie('lastVisit', currentDate, 7); // cookie expire in 7 days

        // welcome message to sender
        sendDiscordWebhookMessage(':)');
    }
});

function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
}

function getCookie(name) {
    const cookieMatch = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;
}

function sendDiscordWebhookMessage(message) {
    // this is just a demo link, replace with your real discord webhook URL.
    const webhookUrl = 'https://discord.com/api/webhooks/1190547537883574323/tKLcophXurC8v5MCJblcrMBAmdbQnzsZBn9ITqLs3WR_YgA8m1cLTvbHGso7twIRH3Z5';

    // embed message
    const payload = {
        embeds: [
            {
                title: 'A user visited website',
                description: message,
                color: 0xFF851A, // orange Hex color code for a greenish color, you can customize this
                timestamp: new Date().toISOString(),
            },
        ],
    };
    // Send to the Discord webhook
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}
