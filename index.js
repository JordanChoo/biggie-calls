// Set ENV variables
require('dotenv').config();
const bqDataset = process.env.bqDataset || null;
const bgBiggieCallsTable = process.env.bgBiggieCallsTable || null;
const bqProjectId = process.env.bqProjectId || null;
const kgKey = process.env.kgKey || null;
const gServiceAccount = JSON.parse(process.env.gServiceAccount);
const callRailAccountId = process.env.callRailAccountId || null;
const callRailApiToken = process.env.callRailApiToken || null;

// Import NPM packages
const {BigQuery} = require('@google-cloud/bigquery');
const axios = require('axios');

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
                    agent_email: req.body.agent_email || null,
                    answered: req.body.answered,
                    business_phone_number: req.body.business_phone_number || null,
                    call_type: req.body.call_type || null,
                    campaign: req.body.campaign || null,
                    company_id: req.body.company_id || null,
                    company_name: req.body.company_name || null,
                    company_resource_id: req.body.company_resource_id || null,
                    company_time_zone: req.body.company_time_zone || null,
                    conversational_transcript: req.body.conversational_transcript || null,
                    created_at: req.body.created_at.slice(0,-6) || null,
                    customer_city: req.body.customer_city || null,
                    customer_country: req.body.customer_country || null,
                    customer_name: req.body.customer_name || null,
                    customer_phone_number: req.body.customer_phone_number || null,
                    customer_state: req.body.customer_state || null,
                    datetime: req.body.datetime || null,
                    device_type: req.body.device_type || null,
                    direction: req.body.direction || null,
                    duration: req.body.duration || null,
                    fbclid: req.body.fbclid || null,
                    first_call: req.body.first_call || false,
                    formatted_business_phone_number: req.body.formatted_business_phone_number || null,
                    formatted_call_type: req.body.formatted_call_type || null,
                    formatted_customer_location: req.body.formatted_customer_location || null,
                    formatted_customer_name: req.body.formatted_customer_name || null,
                    formatted_customer_name_or_phone_number: req.body.formatted_customer_name_or_phone_number || null,
                    formatted_customer_phone_number: req.body.formatted_customer_phone_number || null,
                    formatted_duration: req.body.formatted_duration || null,
                    formatted_tracking_phone_number: req.body.formatted_tracking_phone_number || null,
                    formatted_tracking_source: req.body.formatted_tracking_source || null,
                    formatted_value: req.body.formatted_value || null,
                    ga: req.body.ga || null,
                    gclid: req.body.gclid || null,
                    good_lead_call_id: req.body.good_lead_call_id || null,
                    good_lead_call_time: req.body.good_lead_call_time || null,
                    keywords: req.body.keywords || null,
                    landing_page_url: req.body.landing_page_url || null,
                    last_requested_url: req.body.last_requested_url || null,
                    lead_status: req.body.lead_status || null,
                    medium: req.body.medium || null,
                    msclkid: req.body.msclkid || null,
                    note: req.body.note || null,
                    person_resource_id: req.body.person_resource_id || null,
                    prior_calls: req.body.prior_calls || null,
                    recording: req.body.recording || null,
                    recording_duration: req.body.recording_duration || null,
                    recording_player: req.body.recording_player || null,
                    referrer: req.body.referrer || null,
                    referrer_domain: req.body.referrer_domain || null,
                    referring_url: req.body.referring_url || null,
                    resource_id: req.body.resource_id || null,
                    source: req.body.source || null,
                    source_name: req.body.source_name || null,
                    start_time: req.body.start_time.slice(0,-6) || null,
                    total_calls: req.body.total_calls || null,
                    tracker_resource_id: req.body.tracker_resource_id || null,
                    tracking_phone_number: req.body.tracking_phone_number || null,
                    transcription: req.body.transcription || null,
                    utm_campaign: req.body.utm_campaign || null,
                    utm_content: req.body.utm_content || null,
                    utm_medium: req.body.utm_medium || null,
                    utm_source: req.body.utm_source || null,
                    utm_term: req.body.utm_term || null,
                    utma: req.body.utma || null,
                    utmb: req.body.utmb || null,
                    utmc: req.body.utmc || null,
                    utmv: req.body.utmv || null,
                    utmz: req.body.utmz || null,
                    value: req.body.value || null,
                    voicemail: req.body.voicemail || false,
                    raw_webhook: JSON.stringify(req.body) || null
                });
            console.log(`CallRail Call ${req.body.tracker_resource_id} inserted into BigQuery`);
            res.status(200).send();

        } catch (e) {
            console.log(`CallRail Call ${req.body.tracker_resource_id} failed`);
            console.log(JSON.stringify(e));
            res.status(500).send();
        }
    },

    squad: async(req,res) => {
        // Check to see if it is a GET Req
        if(req.method != 'GET') return res.status(401).send('Not authorized');
        // Make sure that the kgKey matches the env kgKey
        if(req.query.kgKey != kgKey) return res.status(401).send('Not authorized');

        // Axios get all all calls from call rail
            // Run recursively until all calls are returned

        // Save to BigQuery

        // Send success message
    }
}