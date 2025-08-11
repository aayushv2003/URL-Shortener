const express = require('express');
const { handleGenerateNewShortURL, handleRedirectShortURL } = require("../controllers/url");
const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/:shortId", handleRedirectShortURL);

module.exports = router;
