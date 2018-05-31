const AbstractBSClient = require('@zwerm/botsocket-clients/AbstractBSClient');

/**
 * @extends {AbstractBSClient}
 */
class MinimumBSC extends AbstractBSClient {

    /**
     *
     * @param {string} baseUrl
     * @param {string} botTeam
     * @param {string} botId
     * @param {string} channelId
     * @param {boolean} [speechEnabled=true]
     */
    constructor(baseUrl, botTeam, botId, channelId, speechEnabled = true) {
        super(`${baseUrl}/${botTeam}/${botId}/${channelId}`);

        this.messagesElement = document.getElementById('messages');
        this.statusElement = document.getElementById('botStatus');
        this.connect();
    }

    /**
     * @inheritDoc
     *
     * @param {string} status
     * @param {BotSocket.StatusLevel} level
     * @protected
     * @override
     */
    _renderStatusUpdate(status, level) {
        this.renderStatusMessage(status, level);
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.Letter} letter
     * @protected
     * @override
     */
    _renderLetter(letter) {
        letter.forEach(message => this.renderMessage(message));
    }

    /**
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     */
    renderMessage(message) {
        console.log(message);
        this.messagesElement.insertAdjacentHTML('beforeend', `<div>${JSON.stringify(message, (key, value) => {
            if (Array.isArray(value) && value.length > 100) return undefined;
            return value;
        }, '\t')}</div>`);
    };

    /**
     *
     * @param {string} status
     * @param {BotSocket.StatusLevel} level
     */
    renderStatusMessage(status, level) {
        console.log(status);
        this.statusElement.innerHTML = status;
    }
}

export default MinimumBSC;
