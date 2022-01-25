// Set ENV variables
require('dotenv').config();
const bqDataset = process.env.dataset || null;
const bgBiggieCallsTable = process.env.bgBiggieCallsTable || null;
const bqProjectId = process.env.bqProjectId || null;
const kgKey = process.env.kgKey || null;
const gServiceAccount = JSON.parse(process.env.gServiceAccount);

// Import NPM packages
const {BigQuery} = require('@google-cloud/bigquery');

// Create bigQuery Obj
const bigQuery = new BigQuery({
    credentials: gServiceAccount,
    projectId: bqProjectId
});

module.exports = {

    biggieCalls: async (req, res) => {
        try {
            // Check to see if it is a POST Req
            if(req.method != 'POST') return res.status(401).send('Not authorized');
            // Make sure that the kgKey matches the env kgKey
            if(req.query.kgKey != kgKey) return res.status(401).send('Not authorized');

            // Insert call data into BigQuery
            await bigQuery
                .dataset(bqDataset)
                .table(bgBiggieCallsTable)
                .insert({
                    answered: req.body.answered || null,
                    business_phone_number: req.body.business_phone_number || null,
                    customer_city: req.body.customer_city || null,
                    customer_country: req.body.customer_country || null,
                    customer_name: req.body.customer_name || null,
                    customer_phone_number: req.body.customer_phone_number || null,
                    customer_state: req.body.customer_state || null,
                    direction: req.body.direction || null,
                    duration: req.body.duration || null,
                    id: req.body.id || null,
                    recording: req.body.recording || null,
                    recording_duration: req.body.recording_duration || null,
                    recording_player: req.body.recording_player || null,
                    start_time: req.body.start_time || null,
                    tracking_phone_number: req.body.tracking_phone_number || null,
                    tracking_phone_number:req.body. tracking_phone_number || null,
                });
            console.log(`CallRail Call ${req.body.id} inserted into BigQuery`);

        } catch (e) {
            console.log(`CallRail Call ${req.body.id} failed`);
            console.log(e);
        }
    }
}