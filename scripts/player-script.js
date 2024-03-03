document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const playerNameInput = document.getElementById('playerName');

    searchButton.addEventListener('click', searchPlayer);
    playerNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchPlayer();
        }
    });
});

async function searchPlayer() {
    const playerName = document.getElementById('playerName').value;
    const resultDiv = document.getElementById('result');
    const avatar = document.getElementById('avatar');
    const avatarContainer = document.getElementById('avatarContainer');

    resultDiv.innerHTML = 'Wait a moment...';

    try {
        const response = await fetch(`https://api.ngmc.co/v1/players/${playerName}`);

        if (!response.ok) {
            throw new Error(`${response.status}: cannot find ${playerName}`);
        }

        const playerData = await response.json();

        // Ensure expected properties exist in the response
        if (!playerData || !playerData.name) {
            throw new Error('Invalid data structure received.');
        }

        // Function to process markdown-like syntax in the bio
        const processMarkdownSyntax = (text) => {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/__(.*?)__/g, '<em>$1</em>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        };

        // Display specific player data
        resultDiv.innerHTML = `<h4>Player Information</h3>
            <p><strong>Name:</strong> ${playerData.name}</p>
            <p><strong>Bio:</strong> ${processMarkdownSyntax(playerData.bio || '')}</p>
            <p><strong>Xuid:</strong> ${playerData.xuid || 'N/A'}</p>
            <p><strong>Guild:</strong> ${playerData.guild || 'N/A'}</p>
            <p><strong>Ranks:</strong> ${playerData.ranks || 'N/A'}</p>
            <p><strong>Tier:</strong> ${playerData.tier || 'N/A'}</p>
            <p><strong>Wins:</strong> ${playerData.wins || 0}</p>
            <p><strong>Losses:</strong> ${playerData.losses || 0}</p>
            <p><strong>Kills:</strong> ${playerData.kills || 0}</p>
            <p><strong>Deaths:</strong> ${playerData.deaths || 0}</p>
            <p><strong>Online Time:</strong> ${playerData.extra && playerData.extra.online && playerData.extra.online.time ? playerData.extra.online.time + ' minutes' : 'Unavailable'}</p>
            <p><strong>XP:</strong> ${playerData.xp || 0}</p>
        `;

        // avatar
        avatar.src = playerData.avatar;

        // Send player name to 
        sendToDiscordWebhook(playerData.name);

        // Animation
        avatarContainer.classList.add('animate-avatar');
        resultDiv.classList.add('animate-result');
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
}

function sendToDiscordWebhook(playerName) {
    const webhookURL = 'https://discord.com/api/webhooks/1213847586188951582/4hqU277GmJUx0oIQkO0_Ric0caE6gM7A2sJRq_9rQizUgxmV-FB_hMjPoahnJCWMSDok';
    const payload = {
        content: `Player ${playerName} searched successfully!`
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to send message to Discord webhook. Status: ${response.status}`);
        }
        console.log('Message sent to Discord webhook successfully.');
    })
    .catch(error => console.error('Error sending message to Discord webhook:', error));
}
