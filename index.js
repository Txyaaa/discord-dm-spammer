const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');

const { Spam } = require('./Spammer/spam.js');
const tokens = fs.readFileSync('./tokens.txt', 'utf-8').replace(/\r|\"/gi, '').split('\n');

var i = 0;

console.clear();

rl.question('> User ID: ', (userid) => {
    rl.question('> Message: ', (message) => {
        rl.question('> Interval (1200 is a perfect value to prevent being rate limited): ', (interval) => {
            setInterval(() => {
                if (i >= tokens.length) return;
                Spam.direct(userid, message, interval, tokens[i])
                i++
            }, interval)
        })
    })
})