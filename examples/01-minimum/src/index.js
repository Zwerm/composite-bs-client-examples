import MinimumBSC from './MinimumBSC';
import './style.css';

const messageField = document.getElementById('message');
const botForm = document.getElementById('botForm');
const messageForm = document.getElementById('messageForm');
let bsc;

botForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const botTeam = document.getElementById('botTeam').value.trim();
    const botId = document.getElementById('botId').value.trim();
    const channelId = document.getElementById('channelId').value.trim();
    if (botTeam && botId && channelId) {
        bsc = new MinimumBSC(
            `wss://chat.test.zwerm.io`,
            botTeam,
            botId,
            channelId
        );
    }
});

messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = messageField.value.trim();
    if(message && bsc) {
        bsc.sendQuery(message);
        messageField.value = '';
    }
});
