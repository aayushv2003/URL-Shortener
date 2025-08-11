const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: 'url is required' });

  const shortID = shortid.generate();

  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.render("home",{
    id:shortID,
  });

  
}

async function handleRedirectShortURL(req, res) {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortID: shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() }
        }
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleRedirectShortURL,
};
