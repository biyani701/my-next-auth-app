/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
  // We're handling CORS entirely in middleware.ts
  // This ensures we can dynamically set the Access-Control-Allow-Origin header
  // based on the request origin
}
