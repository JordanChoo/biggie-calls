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
const _ = require('lodash');

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
        try {
            // Check to see if it is a GET Req
            if(req.method != 'GET') return res.status(401).send('Not authorized');
            // Make sure that the kgKey matches the env kgKey
            if(req.query.kgKey != kgKey) return res.status(401).send('Not authorized');

            var allCalls = [];

            // Axios get all all calls from call rail
                // Run recursively until all calls are returned
                var page = 1;
                while(true){
                    var options = {
                        'method': 'GET',
                        'url': `https://api.callrail.com/v3/a/${callRailAccountId}/calls.json?fields=call_type,company_id,company_name,company_time_zone,created_at,device_type,first_call,formatted_call_type,formatted_customer_location,formatted_business_phone_number,formatted_customer_name,prior_calls,formatted_customer_name_or_phone_number,formatted_customer_phone_number,formatted_duration,formatted_tracking_phone_number,formatted_tracking_source,formatted_value,good_lead_call_id,good_lead_call_time,lead_status,note,source,source_name,total_calls,value,tracker_id,keywords,medium,campaign,referring_url,landing_page_url,last_requested_url,referrer_domain,utm_source,utm_medium,utm_term,utm_content,utm_campaign,utma,utmb,utmc,utmv,utmz,ga,gclid,fbclid,msclkid,keywords_spotted,agent_email&date_range=all_time&per_page=250&page=${page}`,
                        'headers': {
                            'Authorization': `Bearer ${callRailApiToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    
                    // Run the Axios function
                    let results = await axios.request(options);

                    // Format and push data to allCalls array
                    for(call of results.data.calls){
                        allCalls.push({
                            agent_email: call.agent_email,
                            answered: call.answered,
                            business_phone_number: call.business_phone_number,
                            call_type: call.call_type,
                            campaign: call.campaign,
                            company_id: call.company_id,
                            company_name: call.company_name,
                            company_id: call.company_resource_id,
                            company_time_zone: call.company_time_zone,
                            conversational_transcript: call.conversational_transcript,
                            created_at: call.created_at.slice(0,-6),
                            customer_city: call.customer_city,
                            customer_country: call.customer_country,
                            customer_name: call.customer_name,
                            customer_phone_number: call.customer_phone_number,
                            customer_state: call.customer_state,
                            device_type: call.device_type,
                            direction: call.direction,
                            duration: call.duration,
                            fbclid: call.fbclid,
                            first_call: call.first_call,
                            formatted_business_phone_number: call.formatted_business_phone_number,
                            formatted_call_type: call.formatted_call_type,
                            formatted_customer_location: call.formatted_customer_location,
                            formatted_customer_name: call.formatted_customer_name,
                            formatted_customer_name_or_phone_number: call.formatted_customer_name_or_phone_number,
                            formatted_customer_phone_number: call.formatted_customer_phone_number,
                            formatted_duration: call.formatted_duration,
                            formatted_tracking_phone_number: call.formatted_tracking_phone_number,
                            formatted_tracking_source: call.formatted_tracking_source,
                            formatted_value: call.formatted_value,
                            ga: call.ga,
                            gclid: call.gclid,
                            good_lead_call_id: call.good_lead_call_id,
                            good_lead_call_time: call.good_lead_call_time,
                            keywords: call.keywords,
                            landing_page_url: call.landing_page_url,
                            last_requested_url: call.last_requested_url,
                            lead_status: call.lead_status,
                            medium: call.medium,
                            msclkid: call.msclkid,
                            note: call.note,
                            prior_calls: call.prior_calls,
                            recording: call.recording,
                            recording_duration: call.recording_duration,
                            recording_player: call.recording_player,
                            referrer_domain: call.referrer_domain,
                            referring_url: call.referring_url,
                            resource_id: call.id,
                            source: call.source,
                            source_name: call.source_name,
                            start_time: call.start_time.slice(0,-6),
                            total_calls: call.total_calls,
                            tracker_resource_id: call.tracker_id,
                            tracking_phone_number: call.tracking_phone_number,
                            transcription: call.transcription,
                            utm_campaign: call.utm_campaign,
                            utm_content: call.utm_content,
                            utm_medium: call.utm_medium,
                            utm_source: call.utm_source,
                            utm_term: call.utm_term,
                            utma: call.utma,
                            utmb: call.utmb,
                            utmc: call.utmc,
                            utmv: call.utmv,
                            utmz: call.utmz,
                            value: call.value,
                            voicemail: call.voicemail,
                            raw_webhook: JSON.stringify(call)
                        });
                    };

                    // End the loop if it is the last page
                    if(results.data.calls.length < 250){
                        break;
                    };

                    // Increment the page counter
                    page++;
                };

            // Break the allCalls data into chunks of 500
            var chunkedCalls = _.chunk(allCalls, 500);

            for (const chunkedCall of chunkedCalls) {
                // Save to BigQuery
                await bigQuery
                .dataset(bqDataset)
                .table(bgBiggieCallsTable)
                .insert(chunkedCall);
                console.log(`${chunkedCall.length} calls from CallRail backlogged into BigQuery`);
            };
            // Send success message
            res.status(200).send();
        } catch (e) {
            console.log(`CallRail backfill failed`);
            console.log(e);
            console.log(JSON.stringify(e));
            res.status(500).send();
        }
    }
}