const BSClientLeaf = require('@zwerm/botsocket-clients/leafs/BSClientLeaf');

class LetterRenderingLeaf extends BSClientLeaf {
    /**
     * Gets the classification of the sender of the given `StaMP` message.
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     *
     * @return {string}
     * @static
     */
    static getMessageSenderClassification(message) {
        if (message.from) {
            const [senderClassification, senderTag, senderOriginatingServer] = message.from.split(':');

            return senderClassification === 'user' ? senderClassification : 'server';
        }

        return 'server';
    }

    /**
     * Gets the message classes based on the value of the senderClassfication
     *
     * @param {string} senderClassification
     *
     * @return {string}
     * @static
     */
    static getMessageClasses(senderClassification) {
        return senderClassification === 'user' ? 'is-primary is-pulled-right' : 'is-info is-pulled-left';
    }

    /**
     *
     * @param {string} chatAreaSelector
     */
    constructor(chatAreaSelector) {
        super();

        /**
         *
         * @type {string}
         * @private
         */
        this._chatAreaSelector = chatAreaSelector;
    }

    // endregion

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        renderLetterData.letter.forEach(message => this.renderMessage(message, this.constructor.getMessageSenderClassification(message)));
    }

    // region message rendering
    /**
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     * @param {'user'|'server'} senderClassification
     */
    renderMessage(message, senderClassification) {

        switch (message.type) {
            case 'typing':
                this.renderTypingMessage((/** @type {StaMP.Protocol.TypingMessage}*/ message).state, senderClassification);
                break;
            case 'quick_reply':
                this.renderQuickReplyMessage((/** @type {StaMP.Protocol.CardMessage}*/ message), senderClassification);
                break;
            case 'text':
                this.renderTextMessage((/** @type {StaMP.Protocol.TextMessage}*/ message).text, senderClassification);
                break;
            case 'card':
                this.renderCardMessage((/** @type {StaMP.Protocol.CardMessage}*/ message), senderClassification);
                break;
            case 'image':
                this.renderImageMessage((/** @type {StaMP.Protocol.ImageMessage}*/ message).url, senderClassification);
                break;
        }
    };

    // region render message types
    /**
     *
     * @param {StaMP.Protocol.Messages.TypingState} state
     * @param {'user'|'server'} senderClassification
     */
    renderTypingMessage(state, senderClassification) {
        const lastElement = this._chatAreaSelector.lastElementChild;
        const messageClasses = this.constructor.getMessageClasses(senderClassification);

        if (lastElement && lastElement.classList.contains('typing')) {
            this._chatAreaSelector.removeChild(lastElement);
        }

        if (state === 'on') {
            this._chatAreaSelector.insertAdjacentHTML('beforeend', this.createMessage('typing', messageClasses, '&hellip;'));
        }
    };

    /**
     *
     * @param {string} text
     * @param {'user'|'server'} senderClassification
     */
    renderTextMessage(text, senderClassification) {
        const messageClasses = this.constructor.getMessageClasses(senderClassification);
        this._chatAreaSelector.insertAdjacentHTML('beforeend', this.createMessage('text', messageClasses, text));
    };

    /**
     *
     * @param {StaMP.Protocol.CardMessage} message
     * @param {'user'|'server'} senderClassification
     */
    renderQuickReplyMessage(message, senderClassification) {
        const messageClasses = this.constructor.getMessageClasses(senderClassification);
        const quickReplyMessage = this.createQuickReply('quick-reply', messageClasses, message);
        this._chatAreaSelector.insertAdjacentHTML('beforeend', `<div class="is-clearfix message-outer">${quickReplyMessage}</div>`);
    }

    /**
     *
     * @param {StaMP.Protocol.CardMessage} card
     * @param {'user'|'server'} senderClassification
     */
    renderCardMessage(card, senderClassification) {
        const cardClasses = this.constructor.getMessageClasses(senderClassification);
        const cardMessage = this.createCard({
            title: card.title,
            subtitle: card.subtitle,
            imageUrl: card.imageUrl,
            buttons: card.buttons,
            clickUrl: card.clickUrl,
            classes: cardClasses
        });
        this._chatAreaSelector.insertAdjacentHTML('beforeend', `<div class="is-clearfix message-outer">${cardMessage}</div>`);
    }

    /**
     *
     * @param {string} url
     * @param {'user'|'server'} senderClassification
     */
    renderImageMessage(url, senderClassification) {
        const messageClasses = this.constructor.getMessageClasses(senderClassification);
        const messageContent = `<img src="${url}">`;
        this._chatAreaSelector.insertAdjacentHTML('beforeend', this.createMessage('image', messageClasses, messageContent));

    }

    // endregion
    // region card messages
    /**
     *
     * @param messageType
     * @param messageClasses
     * @param message
     *
     * @return {string}
     */
    createQuickReply(messageType, messageClasses, message) {
        let quickReplies = '';
        if (message.quickReplies) {
            quickReplies = `<div class="buttons">`;
            message.quickReplies.forEach(function (quickReply) {
                console.log(quickReply);
                quickReplies += `<button class="button quick-reply-button" value="${quickReply.payload}">${quickReply.title}</button>`;
            });
            quickReplies += `</div>`;
        }

        return `
            <div class="is-clearfix message-outer ${messageType}">
                <div class="message ${messageClasses}">
                    <div class="message-body content">
                        ${message.text}
                        ${quickReplies}
                    </div>
                </div>
            </div>
        `;
    }
    /**
     *
     * @param {{title: string, subtitle: string, imageUrl: string, buttons: [], clickUrl: string}} card
     *
     * @return {string}
     */
    createCard(card) {
        const cardImage = card.imageUrl
            ? `<div class="card-image">
                    <figure class="image">
                        <img src="${card.imageUrl}" alt="${card.title}">
                    </figure>
                </div>`
            : '';

        const cardTitle = card.title
            ? `<h2 class="title is-4">${card.title}</h2>`
            : '';

        const cardSubtitle = card.subtitle
            ? `<h3 class="subtitle is-5">${card.subtitle}</h3>`
            : '';

        let buttons = '';
        if (card.buttons) {
            buttons = `<div class="buttons">`;
            card.buttons.forEach(function (button) {
                buttons += `<button class="button card-button" value="${button.value}">${button.text}</button>`;
            });
            buttons += `</div>`;
        }


        return `
            <div class="card ${card.classes}">
                ${cardImage}
                <div class="card-content content">
                    ${cardTitle}
                    ${cardSubtitle}
                    ${buttons}
                </div>
            </div>
        `;
    };

    createMessage(messageType, messageClasses, messageContent) {
        return `
            <div class="is-clearfix message-outer ${messageType}">
                <div class="message ${messageClasses}">
                    <div class="message-body content">${messageContent}</div>
                </div>
            </div>
        `;
    }

    // endregion
}

module.exports = LetterRenderingLeaf;
