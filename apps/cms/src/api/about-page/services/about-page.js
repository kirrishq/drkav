"use strict";

// Strapi core APIs use CommonJS factories in generated JavaScript files.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::about-page.about-page");
