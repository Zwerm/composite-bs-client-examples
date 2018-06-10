# Example 00:
## Bare-bones Bot Socket Client
### Description
A bare-bones Bot Socket Client. This example only demonstrates the connection functionality of the Bot Socket Client. See [Example 01](../01-minimal/) for basic message sending and receiving.
### Setup
Copy `env.example` to `.env` and fill out the three variables.

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

See the [Zwerm Web Client](https://prefer.atlassian.net/wiki/spaces/ZWER/pages/183664654/Web+Chat+Widget#WebChatWidget-optionsOptions) documentation for information about these parameters.
### Connection Status
Open the browser console to see the connection status. The console will output `connecting...`, then `connected` on successful connection, or an error message `failed: Error during WebSocket handshake:` followed by `unable to connect` on failure to connect. A failure can be triggered by supplying invalid connection parameters.
