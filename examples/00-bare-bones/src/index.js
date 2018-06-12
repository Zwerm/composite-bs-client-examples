const { EventEmitter } = require('events');
const CompositeBSClient = require('@zwerm/composite-bs-client/CompositeBSClient');
const EmitStatusMessageEventsLeaf = require('@zwerm/composite-bs-client/leafs/EmitStatusMessageEventsLeaf');
const statusEmitter = new EventEmitter();

statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECTING, () => console.warn(`connecting...`));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => console.log('connected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_DISCONNECT, () => console.warn('disconnected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_ERROR, () => console.error('unable to connect'));
CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        process.env.BOT_TEAM,
        process.env.BOT_ID,
        process.env.CHANNEL_ID
    )
    .registerLeaf(new EmitStatusMessageEventsLeaf(statusEmitter))
    .connect();

