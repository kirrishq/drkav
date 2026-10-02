"use strict";

// Keep Shared Section behind Strapi API-token permissions; the frontend uses
// this collection only through the authenticated server-to-server API.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::shared-section.shared-section");
