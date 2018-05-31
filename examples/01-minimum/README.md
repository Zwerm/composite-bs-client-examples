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
