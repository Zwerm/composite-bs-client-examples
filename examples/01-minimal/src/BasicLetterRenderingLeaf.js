const BSClientLeaf = require('@zwerm/composite-bs-client/leafs/BSClientLeaf');

class BasicLetterRenderingLeaf extends BSClientLeaf {
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

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        renderLetterData.letter.forEach(message => this.renderMessage(message));
    }

    // region message rendering
    /**
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     */
    renderMessage(message) {
        this._chatAreaSelector.insertAdjacentHTML('beforeend', `<div>${JSON.stringify(message, (key, value) => {
            if (Array.isArray(value) && value.length > 100) return undefined;
            return value;
        }, '\t')}</div>`);
    };

    // endregion
}

module.exports = BasicLetterRenderingLeaf;
