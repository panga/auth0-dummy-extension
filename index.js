var express = require('express');
var app = express();

app.get('/crash', function(req, res) {
    setTimeout(function() {
        throw new Error('test');
    }, 2000);
    res.sendStatus(200);
});

app.get('/hang', function(req, res) {
    res.sendStatus(200);
    while (true) {}
});

app.get('/long', (req, res) => {
    if (req.query.for) {
        const wait = parseInt(`${req.query.for}`, 10);
        setTimeout(() => {
            res.status(200);
            res.send(`Waited for ${wait}.`);
            res.end();
        }, wait);
    }
    // wait forever
});

app.get('/lag', (req, res) => {
    const end = Date.now() + parseInt(`${req.query.for || '500'}`, 10);
    let i = 0;
    while (Date.now() < end) {
        i++;
    }
    res.status(200);
    res.send({
        count: i
    });
    res.end();
});

var leak = [];

function LeakingClass() {}
app.get('/leak', function(req, res) {
    setInterval(function() {
        for (var i = 0; i < 5000; i++) {
            leak.push(new LeakingClass());
        }
    }, 1);
    res.sendStatus(200);
});

module.exports = app;
