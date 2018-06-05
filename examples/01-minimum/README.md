# Example 01:
## Minimum working implementation of a Bot Socket Client
### Description
A minimum implementation of a Bot Socket Client that can connect, send and receive messages.
### Setup
From the root of this directory, run:
```
npm install && npm run build
```
Webpack will run and bundle assets. Open `dist/index.html` in your browser.
### Connection Settings
There are three values that need to be provided to connect and exchange messages with a bot. These are:
* Bot Team
* Bot ID
* Channel ID

In this example these settings are entered via the Connection settings form. Add these values and click submit. If the settings are correct, the Connection Status will show "connected".

### Messages
Once the client has successfully connected, messages can be exchanged. The raw message data will be output below the message field, as well as logged to the console.

## How it works
The package `@zwerm/botsocket-clients` contains the building blocks required to implement a Bot Socket Client.
### CompositeBSClient
CompositeBSClient is the core of the client, it handles creating and managing the connection to the chat server, the sending and receiving of messages and registering "leafs". For more information about the concept of leafs, read the `@zwerm/botsocket-clients` documentation.
### EmitStatusMessageEventsLeaf(statusEmitter)
This leaf handles emitting messages about the status of the connection. It requires an instance of Node's [Event](https://nodejs.org/api/events.html) class, with listeners registered for each status type. Here is an example of the connected status being logged to the console:
```javascript
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => console.log('connected'));
```

This leaf is part of `@zwerm/botsocket-clients`.
### SendInputQueryOnFormSubmitLeaf(messageForm, messageField)
This leaf handles sending the message field value on submission of the message form. It will prevent the default submission behaviour of the form (i.e. an HTTP GET or POST). It requires the form element that is submitted and the field element that contains the message value to send.

This leaf is part of `@zwerm/botsocket-clients`.
### BasicLetterRenderingLeaf(chatAreaSelector)
This custom leaf extends `@zwerm/botsocket-clients/leafs/BSClientLeaf` and should override `processRenderLetterRequest()`. It requires the HTML element that acts as the parent container for the message data. The message data in this example is not formatted besides being stringified and filtered to remove extremely long data structures. The next Bot Socket Client [example](../02-css-framework/README.md) will expand on this basic rendering example to cover dealing with differentiating messages from the bot/server and the user, and different types of messages.
