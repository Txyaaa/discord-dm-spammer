const request = require('request');
const chalk = require('chalk');

const success = chalk.green('[+]');
const warn = chalk.yellow('[!]');

let message_sent = 1;

class DirectMessage {
    constructor(userid, message, interval, token) {
        this.userid = userid;
        this.message = message;
        this.interval = interval;
        this.token = token;
    }
    send() {
        setInterval(() => {
            request({
                method: 'PATCH',
                url: 'https://discordapp.com/api/v7/users/@me',
                json: true,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.305 Chrome/69.0.3497.128 Electron/4.0.8 Safari/537.36',
                    'content-type': 'application/json',
                    authorization: this.token
                },
                body: {}
            }, (error, response, body) => {
                if (!body) return;
                this.json = body;
                this.id = this.json.id;
                request({
                    method: 'POST',
                    url: `https://discordapp.com/api/v7/users/${this.id}/channels`,
                    json: true,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.305 Chrome/69.0.3497.128 Electron/4.0.8 Safari/537.36',
                        'content-type': 'application/json',
                        authorization: this.token
                    },
                    body: { 
                        recipients: [this.userid] 
                    }
                }, (error, response, body) => {
                    if (!body) return;
                    this.json = body;
                    this.channel = this.json.id;
                    request({
                        method: 'POST',
                        url: `https://discordapp.com/api/v7/channels/${this.channel}/messages`,
                        json: true,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.305 Chrome/69.0.3497.128 Electron/4.0.8 Safari/537.36',
                            'content-type': 'application/json',
                            authorization: this.token
                        },
                        body: {
                            'content': this.message
                        },
                    }, (error, response, body) => {
                        if (body['code'] == '40002') {
                            console.log(warn, body['message'])
                        } else if (body['code'] == '40001') {
                            console.log(warn, body['message'])
                        } else if (body['code'] == '50007') {
                            console.log(warn, body['message'])
                        } else if (body['message'] == 'You are being rate limited.') {
                            console.log(warn, 'Rate limit warning.')
                        } else if (body['id']) {
                            console.log(success, chalk.hex(config.console_color)(body['author']['username'] + '#' + body['author']['discriminator']), `(${body['author']['id']})` ,'sent', chalk.hex(config.console_color)(body['content']), `[${messages_sent++}]`)
                        }
                    });
                });
            });
        }, this.interval);
    }
}

const Spam = {
    direct: function(userid, message, interval, token) {
        new DirectMessage(userid, message, interval, token).send();
    },
}

module.exports = { Spam }