const { EventEmitter } = require('events');
const statusEmitter = new EventEmitter();

const CompositeBSClient = require('@zwerm/botsocket-clients/CompositeBSClient');
const EmitStatusMessageEventsLeaf = require('@zwerm/botsocket-clients/leafs/EmitStatusMessageEventsLeaf');
const SendInputQueryOnFormSubmitLeaf = require('@zwerm/botsocket-clients/leafs/SendInputQueryOnFormSubmitLeaf');
const BasicLetterRenderingLeaf = require('./BasicLetterRenderingLeaf');

const connectionForm = document.getElementById('connectionForm');
const connectionStatus = document.getElementById('connectionStatus');
const messageForm = document.getElementById('messageForm');
const messageField = document.getElementById('message');
const messageOut = document.getElementById('messageOut');

import './style.css';

function setStatus(status, level = null) {
    switch (level) {
        case 'error':
            console.error(status);
            break;
        case 'warn':
            console.warn(status);
            break;
        default:
            console.log(status);
    }

    connectionStatus.innerHTML = status;
}

statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECTING, ({ isReconnection }) => setStatus(`${isReconnection ? 're' : ''}connecting...`, 'warn'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => setStatus('connected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_DISCONNECT, () => setStatus('disconnected', 'warn'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_ERROR, () => setStatus('unable to reconnect', 'error'));

connectionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const botTeam = document.getElementById('botTeam').value.trim();
    const botId = document.getElementById('botId').value.trim();
    const channelId = document.getElementById('channelId').value.trim();
    if (botTeam && botId && channelId) {
        CompositeBSClient
            .newForZwermChat(
                `wss://chat.test.zwerm.io`,
                botTeam,
                botId,
                channelId
            )
            .registerLeaf(new EmitStatusMessageEventsLeaf(statusEmitter))
            .registerLeaf(new SendInputQueryOnFormSubmitLeaf(messageForm, messageField))
            .registerLeaf(new BasicLetterRenderingLeaf(messageOut))
            .connect();
    }
});
