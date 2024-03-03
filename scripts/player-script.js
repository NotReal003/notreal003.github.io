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
            throw new Error(`Failed to fetch player information. Status: ${response.status}`);
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
            <p><strong>Online Time:</strong> ${playerData.extra?.online?.time || 0} minutes</p>
            <p><strong>XP:</strong> ${playerData.xp || 0}</p>
        `;

        // avatar
        avatar.src = playerData.avatar;

        // .
        avatarContainer.classList.add('animate-avatar');
        resultDiv.classList.add('animate-result');
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
}
