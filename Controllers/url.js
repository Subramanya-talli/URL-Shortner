const shortId = require("shortid")
const URL = require('../model/url'); 


async function handleGenerateNewUrl (req, res)
{
    try {
        const body = req.body;
        if(!body.url) {
            return res.status(400).json({error : "Url is required"})
        }
        const shortID = shortId();

        await URL.create({
            shortId : shortID,
            redirectUrl : body.url,
            visitHistory: [],
        });
    
        return res.render("home", {
            id : shortID,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
};


async function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    handleGenerateNewUrl,
    handleGetAnalytics
}