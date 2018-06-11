# Bot Socket Client Examples
This is a collection of implementations of the Bot Socket Client, with a quick tutorial for making your own Client.

## Examples
[Example 00: Bare-bones implementation](./examples/00-bare-bones)
[Example 01: Minimal working implementation](./examples/01-minimal/)  
[Example 02: Extended implementation](./examples/02-extended/)

## How to make a Bot Socket Client
### Requirements
Requires [Node.js and npm](https://nodejs.org/), and the npm package `@zwerm/botsocket-clients`.
### Step 1: npm and Module bundling
Node uses a module system to load separate files and packages via a `require` function. This function is not part of Javascript but a custom Node function. Browsers do not support this function, so a module bundler is needed to compile all the required packages into a single file that can be used in the browser. The examples in the library use [webpack](https://webpack.js.org/) for this.

Create a `package.json` and install the required bot socket client package `npm init -y && npm install @zwerm/botsocket-clients`
### Step 2: Connecting to the bot
Require the `CompositeBSClient` class in your main file and pass the connection parameters.
```javascript
const CompositeBSClient = require('@zwerm/botsocket-clients/CompositeBSClient');

CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        botTeam,
        botId,
        channelId
    )
    .connect();
```
The first parameter is the websocket URL of the chat server. See the [Zwerm Web Client](https://prefer.atlassian.net/wiki/spaces/ZWER/pages/183664654/Web+Chat+Widget#WebChatWidget-optionsOptions) documentation for information about the other 3 parameters. These parameters can either be hardcoded in the file or passed through via an HTML form (Example 01), or as Node environment variables (Examples 00 and 02).
### Step 3: Leafs
To allow the client to actually do anything beyond connecting, functionality modules called "leafs" need to be included and registered with the `CompositeBSClient`. A number of leafs are included in the `@zwerm/botsocket-clients` package, and custom leafs can be created.
#### Bundled Leafs
The `@zwerm/botsocket-clients` documentation covers all the bundled leafs. This tutorial will cover a few in detail.
##### EmitStatusMessageEventsLeaf(eventEmitter)
The status of the Bot Socket Client connect can be tracked by adding event listeners for pre-defined connection status events. This requires the `@zwerm/botsocket-clients/leaf/EmitStatusMessageEventsLeaf` and Node's [Events](https://nodejs.org/api/events.html) class.
```javascript
const { EventEmitter } = require('events');
const statusEmitter = new EventEmitter();
const EmitStatusMessageEventsLeaf = require('@zwerm/botsocket-clients/leafs/EmitStatusMessageEventsLeaf');
```
The `on` method of `EventEmitter` allows event listeners to be added. `EmitStatusMessageEventsLeaf` defines some events that can be used to communicate the connection status. In this example the events will be emitted to the console. 
```javascript
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECTING, () => console.warn(`connecting...`));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => console.log('connected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_DISCONNECT, () => console.warn('disconnected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_ERROR, () => console.error('unable to connect'));
```
Finally, the leaf needs to be registered with `CompositeBSClient`:
```javascript
CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        botTeam,
        botId,
        channelId
    )
    .registerLeaf(new EmitStatusMessageEventsLeaf(statusEmitter))
    .connect();
```
#####SendInputQueryOnFormSubmitLeaf(messageForm, messageField)
This leaf handles sending the message field value on submission of the message form. It will prevent the default submission behaviour of the form (i.e. an HTTP GET or POST). It requires the form element that is submitted and the field element that contains the message value to send.
```javascript
const SendInputQueryOnFormSubmitLeaf = require('@zwerm/botsocket-clients/leafs/SendInputQueryOnFormSubmitLeaf');
const messageForm = document.getElementById('messageForm');
const messageField = document.getElementById('message');

CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        botTeam,
        botId,
        channelId
    )
    .registerLeaf(new SendInputQueryOnFormSubmitLeaf(messageForm, messageField))
    .connect();
```
#### Custom Leafs
This example will cover creating a custom letter rendering leaf. The leaf needs to extend `@zwerm/botsocket-clients/leafs/BSClientLeaf`.
```javascript
const BSClientLeaf = require('@zwerm/botsocket-clients/leafs/BSClientLeaf');

class LetterRenderingLeaf extends BSClientLeaf {
    // letter rendering happens here
}

module.exports = LetterRenderingLeaf;

```
The purpose of this leaf is to format and display letters, or messages, of certain types. The leaf takes a parameter of an HTML element that will be used to contain and display these messages. This is passed through the constructor and set as a private property.
```javascript
const BSClientLeaf = require('@zwerm/botsocket-clients/leafs/BSClientLeaf');

class LetterRenderingLeaf extends BSClientLeaf {
    constructor(messagesElement) {
        super();
        this._messagesElement = messagesElement;
    }
}

module.exports = LetterRenderingLeaf;
```
To receive the request, the leaf overrides the `BSClientLeaf.processRenderLetterRequest` method. Each request can contain multiple letters, so the request is looped through to process each letter.

The `renderMessage` method switches the formatting of each message based on `message.type`. The formatted message is added to the DOM element stored in `this._messagesElement`;
```javascript
const BSClientLeaf = require('@zwerm/botsocket-clients/leafs/BSClientLeaf');

class LetterRenderingLeaf extends BSClientLeaf {
    constructor(messagesElement) {
        super();
        this._messagesElement = messagesElement;
    }
    
    processRenderLetterRequest(renderLetterData) {
        renderLetterData.letter.forEach(message => this.renderMessage(message));
    }
    
    renderMessage(message) {
        switch (message.type) {
            case 'text':
                this.renderTextMessage(message.text);
                break;
            // other types
        }
    }
    
    renderTextMessage(text) {
        // format and append message of type 'text' to this._messagesElement
    }
}

module.exports = LetterRenderingLeaf;
```
Finally, the leaf needs to be registered with `CompositeBSClient`.
```javascript
const LetterRenderingLeaf = require('./LetterRenderingLeaf');
const messagesElement = document.getElementById('messagesElement');

CompositeBSClient
    .newForZwermChat(
        `wss://chat.test.zwerm.io`,
        botTeam,
        botId,
        channelId
    )
    .registerLeaf(new LetterRenderingLeaf(messagesElement))
    .connect();
```
### Step 4: Formatting Messages
Messages can be one of many types, and each type should be processed and formatted differently before being displayed.

**Typing message**

The typing message is used to inform the user that the bot has received their message and is processing and preparing a response. The message has a `state` property with a value of `'on'` or `'off'` that can be used to show or hide a visual representation that "something is happening".

**Text message**

A message that only contains text.

**Quick Reply message**

The quick reply message type contains pre-defined messages that can be sent by the user as responses to a question posed by the bot. These can be represented as buttons that accompany the bot question.

**Card message**

The card message is a complex message that can contain many different but related pieces of data. This data can be URLs `imageUrl` and `clickUrl`, text `title` and `subtitle` or an array of buttons `buttons`. The buttons work the same as the quick replies in a quick reply message, pre-defined messages with text and a payload. 

**Image message**

The image message type contains a `url` property that can be used as the `src` attribute to display an inline image.

See [Example 02](./examples/02-extended/) for an example of message rendering based on message type.
