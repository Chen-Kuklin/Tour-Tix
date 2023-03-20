
const Site = require('../models/site')
module.exports = {
    createSite: function (siteDetails, res) {
        if (!siteDetails.body.name) {
            res.status(400).send("required name site");
            return;
        }
        if (!siteDetails.body.country) {
            res.status(400).send("required country site");
            return;
        }
        const site = new Site(siteDetails.body);
        site.save().then(site =>
            res.status(201).send(site)
        ).catch(e => res.status(400).send(e))
    },
    getSites: function (req, res) {
        Site.find().then(sites => {
            res.send(sites)
        }).catch(e => res.status(500).send())
    }
}


