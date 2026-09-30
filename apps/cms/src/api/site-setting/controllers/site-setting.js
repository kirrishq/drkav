"use strict";

// Strapi core APIs use CommonJS factories in generated JavaScript files.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site-setting.site-setting");
