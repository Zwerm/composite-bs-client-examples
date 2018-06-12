# Example 02:
## Extended BotSocket Client
### Description
This example extends the functionality of the previous example, and demonstrates how a BotSocket Client can be easily implemented in a CSS Framework, in this case, [Bulma](bulma.io).
### Setup
Copy `env.example` to `.env` and fill out the three variables.

From the root of this directory,
```
npm install && npm run build
```
Webpack will run and bundle assets. Open `dist/index.html` in your browser.
## How it works
See the [previous example](../01-minimal/README.md) for information about the components `CompositeBSClient`, `EmitStatusMessageEventsLeaf` and `SendInputQueryOnFormSubmitLeaf`.
### ScrollToBottomOnLetterLeaf(scrollElement)
This leaf will scroll the given element (via required parameter `scrollElement`) to the bottom of its content, when a new message(letter) is received and displayed. This will ensure new messages are visible to the user as they are added.

This leaf is part of `@zwerm/composite-bs-client`.
### LetterRenderLeaf(messagesElement)
This custom leaf expands on the BasicLetterRenderingLeaf from the previous example. The `renderMessage` method uses the message type to control how the message is formatted before being appended to the `messagesElement` element.
#### Message types
**Typing message**

The typing message is used to inform the user that the bot has received their message and is processing and preparing a response. The message has a `state` property with a value of `'on'` or `'off'` that can be used to show or hide a visual representation that "something is happening".

**Text message**

A message that only contains text.

**Quick Reply message**

The quick reply message type contains pre-defined messages that can be sent by the user as responses to a question posed by the bot. These can be represented as buttons that accompany the bot question.

When the quick reply button is clicked, the quick reply payload is sent to the bot using the `sendQuery` method of the `CompositeBSClient` class, via a delegated click event listener.

Once a quick reply has been clicked, all quick replies within the message are removed.

**Card message**

The card message is a complex message that can contain many different but related pieces of data. This data can be URLs`imageUrl` and `clickUrl`, text `title` and `subtitle` or an array of buttons `buttons`. The buttons work the same as the quick replies in a quick reply message, pre-defined messages with text and a payload. 

**Image message**

The image message type contains a `url` property that can be used as the `src` attribute to display an inline image.
