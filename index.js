// Set ENV variables
const bqDataset = process.env.dataset || null;
const bgBiggieCallsTable = process.env.bgBiggieCallsTable || null;
const bqProjectId = process.env.bqProjectId || null;
const kgKey = process.env.kgKey || null;
const gServiceAccount = JSON.parse(process.env.gServiceAccount);

exports.biggieCalls = (req, res) => {
    try {
        // Check to see if it is a POST Req
        if(req.method != 'POST') return res.status(401).send('Not authorized');
        // Make sure that the kgKey matches the env kgKey
        if(req.query.kgKey != kgKey) return res.status(401).send('Not authorized');
    } catch (e) {
        
    }
};