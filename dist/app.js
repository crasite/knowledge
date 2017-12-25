"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const CONFIG = {
    port: process.env.PORT || 3000
};
const app = Express();
app.use(Express.static('./public'));
app.set('view engine', 'pug');
app.get('/math', (req, res) => {
    res.render('math');
});
app.get('/*', (req, res) => {
    res.render('sample');
});
app.listen(CONFIG.port, () => {
    console.log(`Server start on ${CONFIG.port}`);
});
//# sourceMappingURL=app.js.map