const { EventEmitter } = require('events');
const statusEmitter = new EventEmitter();
const classList = require('classlist');

const CompositeBSClient = require('@zwerm/composite-bs-client/CompositeBSClient');
const EmitStatusMessageEventsLeaf = require('@zwerm/composite-bs-client/leafs/EmitStatusMessageEventsLeaf');
const SendInputQueryOnFormSubmitLeaf = require('@zwerm/composite-bs-client/leafs/SendInputQueryOnFormSubmitLeaf');
const ScrollToBottomOnLetterLeaf = require('@zwerm/composite-bs-client/leafs/ScrollToBottomOnLetterLeaf');
const LetterRenderingLeaf = require('./LetterRenderingLeaf');

const connectionStatus = document.getElementById('connectionStatus');
const connectionStatusClassList = classList(connectionStatus);
const messageForm = document.getElementById('messageForm');
const messageField = document.getElementById('message');
const messageOut = document.getElementById('messageOut');

import './style.scss';

function setStatus(status, level = null) {
    let levelClass = 'is-success';
    switch (level) {
        case 'error':
            console.error(status);
            levelClass = 'is-danger';
            break;
        case 'warn':
            console.warn(status);
            levelClass = 'is-warning';
            break;
        default:
            console.log(status);
    }

    connectionStatusClassList.remove('is-success', 'is-info', 'is-warning', 'is-danger');
    connectionStatusClassList.add(levelClass);
    connectionStatus.innerHTML = status;
}

statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECTING, ({ isReconnection }) => setStatus(`${isReconnection ? 're' : ''}connecting...`, 'warn'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => setStatus('connected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_DISCONNECT, () => setStatus('disconnected', 'warn'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_ERROR, () => setStatus('unable to reconnect', 'error'));

const letterRenderingLeaf = new LetterRenderingLeaf(messageOut);

const bsc = CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        process.env.BOT_TEAM,
        process.env.BOT_ID,
        process.env.CHANNEL_ID
    )
    .registerLeaf(new EmitStatusMessageEventsLeaf(statusEmitter))
    .registerLeaf(new SendInputQueryOnFormSubmitLeaf(messageForm, messageField))
    .registerLeaf(letterRenderingLeaf)
    .registerLeaf(new ScrollToBottomOnLetterLeaf(messageOut))
    .connect();

/**
 * Message button event delegation
 */
document.addEventListener('click', function (e) {
    if (e.target) {
        const classes = classList(e.target);
        const text = e.target.textContent || e.target.innerText;
        const value = e.target.value;

        if (classes.contains('card-button') || classes.contains('quick-reply-button')) {
            bsc.sendQuery(value, text);
        }

        if (classes.contains('quick-reply-button')) {
            const buttons = e.target.parentElement;
            buttons.parentElement.removeChild(buttons);
        }
    }
});

window.renderFakeQuickReply = () => letterRenderingLeaf.processRenderLetterRequest({
    'letter': [
        {
            '$StaMP': true,
            'from': 'server',
            'type': 'typing',
            'state': 'off'
        },
        {
            '$StaMP': true,
            'from': 'server',
            'type': 'quick_reply',
            'text': 'Is this address correct?',
            'ssmlText': '<p>is this address correct?</p>',
            'quickReplies': [
                {
                    'title': 'yes',
                    'payload': 'save-location'
                },
                {
                    'title': 'No',
                    'payload': 'ask-again'
                },
                {
                    'title': 'Here I am',
                    'payload': 'send_location'
                }
            ]
        }
    ]
});
