# Biggie Calls
Welcome to Biggie Calls! A severless solution to easily save [CallRail](https://www.callrail.com/) calls in BigQuery and is developed and maintained by [Kogneta](https://kogneta.com/).

## How It Works
Biggie Calls is deployed as a severless application either on Google Cloud Functions or AWS Lambda. The function's endpoint is then added as a [webhook into your CallRail account which is then pinged through a POST request each time a call is completed](https://apidocs.callrail.com/#post-call-webhook). 

## Deploying

To deploy Biggie Calls there are three main steps that need to take place which you can find below:

### BigQuery

The first step is to create the a table in BigQuery where each call will be saved. Below is a SQL query that you can copy and paste into BigQuery's console to create the table and the schema. 

🚨 *Be sure to replace the `DATASET_NAME_GOES_HERE` field with the name of the BigQuery dataset you'll be using* 🚨

```sql
    CREATE TABLE IF NOT EXISTS DATASET_NAME_GOES_HERE.RAW_biggie_calls (
    answered BOOLEAN,
    business_phone_number STRING,
    customer_city STRING,
    customer_country STRING,
    customer_name STRING,
    customer_phone_number STRING,
    customer_state STRING,
    direction STRING,
    duration INT64,
    id STRING,
    recording STRING,
    recording_duration STRING,
    recording_player STRING,
    start_time DATETIME,
    tracking_phone_number STRING,
    voicemail BOOLEAN,
    call_type STRING,
    company_id STRING,
    company_name STRING,
    company_time_zone STRING,
    created_at DATETIME,
    device_type STRING,
    first_call BOOLEAN,
    formatted_call_type STRING,
    formatted_customer_location STRING,
    formatted_business_phone_number STRING,
    formatted_customer_name STRING,
    prior_calls INT64,
    formatted_customer_name_or_phone_number ,
    formatted_customer_phone_number STRING,
    formatted_duration STRING,
    formatted_tracking_phone_number STRING,
    formatted_tracking_source STRING,
    formatted_value STRING,
    good_lead_call_id INT64,
    good_lead_call_time STRING,
    lead_status STRING,
    note STRING,
    source STRING,
    source_name STRING,
    total_calls INT64,
    value STRING,
    tracker_id STRING,
    keywords STRING,
    medium STRING,
    campaign STRING,
    referring_url STRING,
    landing_page_url STRING,
    last_requested_url STRING,
    referrer_domain STRING,
    utm_source STRING,
    utm_medium STRING,
    utm_term STRING,
    utm_content STRING,
    utm_campaign STRING,
    utma STRING,
    utmb STRING,
    utmc STRING,
    utmv STRING,
    utmz STRING,
    ga STRING,
    gclid STRING,
    fbclid STRING,
    msclkid STRING,
    transcription STRING,
    conversational_transcript STRING,
    agent_email STRING
    ) PARTITION BY DATE(start_time)
```

### Serverless Function

Once your BigQuery table is configured, you now can deploy your serverless function. For the remainder of this walk-through, we'll be deploying to Google Cloud. 

First [navigate to Google Cloud functions](https://console.cloud.google.com/functions/list) and start the process of creating a new function.

#### Step 1: Configuration

##### Function Name
This will be the name of your function, I recommend calling it `biggie-calls` but, if you would like to name it something else by all means go ahead. 

##### Trigger
Since we're leveraging CallRails' webhook feature, we need to set the trigger as `HTTP` and the authentication to `Allow unauthenticated invocations` with the `require HTTPs` checked.

##### Runtime, build, connections and security settings

Clicking the dropdown text named `Runtime, build, connections and security settings`, you'll be able to add the final configuration options to the Cloud Function.

###### Runtime
- Set the `Memory allocated` to 256MB
- The `Timeout` can be set to `60`

###### Runtime Environment Variables

- `bqDataset` = The dataset that you created the Biggie Calls table in. 
- `bgBiggieCallsTable` = If you used the default setting in the provided SQL statement this value will be `RAW_biggie_calls`
- `bqProjectId` = The project ID that the Biggie Calls table is located in. Find [your project ID by following these steps](https://support.google.com/googleapi/answer/7014113?hl=en)
- `gServiceAccount` = Your Google Cloud Service Account Key. Find or create [your service account by following these steps](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#getting_a_service_account_key).
- `callRailAccountId` = Your CallRail account ID. You can [find your CallRail account ID by following these instructions](https://support.callrail.com/hc/en-us/articles/207684826-Your-Account-Number).
- `callRailApiToken` = Your CallRail account's API token. You can follow [CallRail's documentation on how to generate an API token here](https://support.callrail.com/hc/en-us/articles/201211143-CallRail-s-API-Documentation).
- `kgKey` = This is your make shift security key that _must_ be present as a URL paramter for the function to run and should be kept as a secret. 

#### Step 2: Code

##### Runtime
For the run time environment select `Node.js 16` from the dropdown selector.

##### Entry Point
For the entry point field enter in `biggieCalls`. 

##### Code
For the code section, simply copy and paste the code from the `index.js` file in this repository into the code editor found in the code step.

#### Formatting URL
Once you're done adding all of the information click on the deploy button to deploy the Cloud Function. Once deployed click into it and go to the Trigger tab to get the Trigger URL. 

Take the trigger URL and add `?kgKey=YOUR_KGKEY_HERE` to the end of it, replacing the `YOUR_KGKEY_HERE` with the value of your kgKey.

### CallRail

Now that your function is deplyed, the next step is to add it to CallRail as a webhook URL to start saving your call data in BigQuery. Follow [the instuctions provided by CallRail here](https://support.callrail.com/hc/en-us/articles/201211133-Webhooks) and add the modified URL to the `Post-Call` that contains your kgKey. 

## Have questions?
If you have any questions feel free to contact me at [@JordanChoo](https://twitter.com/jordanchoo).

## License
GNU GENERAL PUBLIC LICENSE: https://www.gnu.org/licenses/gpl-3.0-standalone.html