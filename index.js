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

            var callData = module.exports.fullCallDetails(req.body.id);

            // Insert call data into BigQuery
            await bigQuery
                .dataset(bqDataset)
                .table(bgBiggieCallsTable)
                .insert({
                    answered: callData.answered || null,
                    business_phone_number: callData.business_phone_number || null,
                    customer_city: callData.customer_city || null,
                    customer_country: callData.customer_country || null,
                    customer_name: callData.customer_name || null,
                    customer_phone_number: callData.customer_phone_number || null,
                    customer_state: callData.customer_state || null,
                    direction: callData.direction || null,
                    duration: callData.duration || null,
                    id: callData.id || null,
                    recording: callData.recording || null,
                    recording_duration: callData.recording_duration || null,
                    recording_player: callData.recording_player || null,
                    start_time: callData.start_time || null,
                    tracking_phone_number: callData.tracking_phone_number || null,
                    voicemail: callData.voicemail || null,
                    call_type: callData.call_type || null,
                    company_id: callData.company_id || null,
                    company_name: callData.company_name || null,
                    company_time_zone: callData.company_time_zone || null,
                    created_at: callData.created_at || null,
                    device_type: callData.device_type || null,
                    first_call: callData.first_call || null,
                    formatted_call_type: callData.formatted_call_type || null,
                    formatted_customer_location: callData.formatted_customer_location || null,
                    formatted_business_phone_number: callData.formatted_business_phone_number || null,
                    formatted_customer_name: callData.formatted_customer_name || null,
                    prior_calls: callData.prior_calls || null,
                    formatted_customer_name_or_phone_number: callData.formatted_customer_name_or_phone_number || null,
                    formatted_customer_phone_number: callData.formatted_customer_phone_number || null,
                    formatted_duration: callData.formatted_duration || null,
                    formatted_tracking_phone_number: callData.formatted_tracking_phone_number || null,
                    formatted_tracking_source: callData.formatted_tracking_source || null,
                    formatted_value: callData.formatted_value || null,
                    good_lead_call_id: callData.good_lead_call_id || null,
                    good_lead_call_time: callData.good_lead_call_time || null,
                    lead_status: callData.lead_status || null,
                    note: callData.note || null,
                    source: callData.source || null,
                    source_name: callData.source_name || null,
                    total_calls: callData.total_calls || null,
                    value: callData.value || null,
                    tracker_id: callData.tracker_id || null,
                    keywords: callData.keywords || null,
                    medium: callData.medium || null,
                    campaign: callData.campaign || null,
                    referring_url: callData.referring_url || null,
                    landing_page_url: callData.landing_page_url || null,
                    last_requested_url: callData.last_requested_url || null,
                    referrer_domain: callData.referrer_domain || null,
                    utm_source: callData.utm_source || null,
                    utm_medium: callData.utm_medium || null,
                    utm_term: callData.utm_term || null,
                    utm_content: callData.utm_content || null,
                    utm_campaign: callData.utm_campaign || null,
                    utma: callData.utma || null,
                    utmb: callData.utmb || null,
                    utmc: callData.utmc || null,
                    utmv: callData.utmv || null,
                    utmz: callData.utmz || null,
                    ga: callData.ga || null,
                    gclid: callData.gclid || null,
                    fbclid: callData.fbclid || null,
                    msclkid: callData.msclkid || null,
                    transcription: callData.transcription || null,
                    conversational_transcript: callData.conversational_transcript || null,
                    agent_email: callData.agent_email || null,
                });
            console.log(`CallRail Call ${req.body.id} inserted into BigQuery`);
            res.status(200).send();

        } catch (e) {
            console.log(`CallRail Call ${req.body.id} failed`);
            console.log(e);
            res.status(500).send();
        }
    },

    fullCallDetails: async(callId) => {
        try {
            var options = {
                'method': 'GET',
                'url': `https://api.callrail.com/v3/a/${callRailAccountId}/calls/${callId}.json?fields=call_type,company_id,company_name,company_time_zone,created_at,device_type,first_call,formatted_call_type,formatted_customer_location,formatted_business_phone_number,formatted_customer_name,prior_calls,formatted_customer_name_or_phone_number,formatted_customer_phone_number,formatted_duration,formatted_tracking_phone_number,formatted_tracking_source,formatted_value,good_lead_call_id,good_lead_call_time,lead_status,note,source,source_name,total_calls,value,tracker_id,keywords,medium,campaign,referring_url,landing_page_url,last_requested_url,referrer_domain,utm_source,utm_medium,utm_term,utm_content,utm_campaign,utma,utmb,utmc,utmv,utmz,ga,gclid,fbclid,msclkid,transcription,conversational_transcript,agent_email`,
                'headers': {
                    'Authorization': `Bearer ${callRailApiToken}`,
                    'Content-Type': 'application/json'
                }
            };
    
            return await axios.request(options);

        } catch (e) {
            console.log(e);
            return false;   
        }
    }
}