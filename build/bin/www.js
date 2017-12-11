"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const port = process.env.PORT || '3001';
const app = index_1.Server.bootstrap();
app.start(parseInt(port));
//# sourceMappingURL=www.js.map