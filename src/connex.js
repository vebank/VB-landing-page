require('dotenv').config();

// Pull in Connex and other dependencies
const Framework = require('@vechain/connex-framework').Framework;
const ConnexDriver = require('@vechain/connex-driver');
const express = require('express');
const _ = require('lodash');
const app = express();
const cors = require('cors');

// Pull in contract ABI
const ABI = require('./build/contracts/Event.json').abi;

const { Driver, SimpleNet, SimpleWallet } = ConnexDriver;


const ADDRESS = process.env.ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

const wallet = new SimpleWallet();

wallet.import(PRIVATE_KEY);

(async () => {
    // Connect to VeChain node
    const driver = await Driver.connect(new SimpleNet('https://vethor-node-test.vechaindev.com'), wallet);
    const connex = new Framework(driver);

    // setup express api
    app.use(cors());
    app.use(express.json());

    app.use((_, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key');
        next();
    });

    // create methods to be used by endpoints
    const addTransactionHash = (eventId, txid) => {
        const signingService = connex.vendor.sign('tx');

        const addTransactionABI = _.find(ABI, { name: 'addTransactionHash' });
        const addTransactionMethod = connex.thor.account(ADDRESS).method(addTransactionABI);

        const addTransactionClause = addTransactionMethod.asClause(eventId, txid);

        return signingService.request([addTransactionClause]);
    };

    const getTransaction = txid => {
        return new Promise(resolve => {
            const interval = setInterval(async () => {
                const tx = await connex.thor.transaction(txid).get();

                if (tx) {
                    resolve(tx);
                    clearInterval(interval);
                }
            }, 1000);
        });
    };

    const getEventId = async _to => {
        const TransactionEventABI = _.find(ABI, { name: 'TransactionEvent' });
        const TransactionEvent = connex.thor.account(ADDRESS).event(TransactionEventABI)

        const filter = TransactionEvent.filter([{ _to }]);
        return filter.order('desc').apply(0, 1);
    };

    const addEvent = async ({ userId, actionId, points, timestamp }) => {
        const signingService = connex.vendor.sign('tx');

        const addEventABI = _.find(ABI, { name: 'addEvent' });
        const addEventMethod = connex.thor.account(ADDRESS).method(addEventABI);

        points = points * 100;

        const addEventClause = addEventMethod.asClause(
            parseInt(userId, 10),
            parseInt(actionId, 10),
            parseInt(points, 10),
            parseInt(timestamp, 10),
        );

        const addEventTx = await signingService.request([addEventClause]);
        const { clauses } = await getTransaction(addEventTx.txid);
        const [log] = await getEventId(clauses[0].to);
        const addTransactionHashTx = await addTransactionHash(log.decoded.eventId, addEventTx.txid);

        return getTransaction(addTransactionHashTx.txid);
    };

    const getEvent = async eventID => {
        const getEventABI = _.find(ABI, { name: 'getEvent' });
        const getEventMethod = connex.thor.account(ADDRESS).method(getEventABI);

        const event = await getEventMethod.call(eventID);

        return event;
    };

    const getEventCount = async () => {
        const getEventCountABI = _.find(ABI, { name: 'eventCount' });
        const getEventCountMethod = connex.thor.account(ADDRESS).method(getEventCountABI);

        const { decoded } = await getEventCountMethod.call();

        return parseInt(decoded['0'], 10);
    };

    const getEvents = async (limit, offset = 0) => {
        const eventCount = await getEventCount();
        const itemsDesc = _.rangeRight(eventCount);

        if (limit) {
            events = _.drop(itemsDesc, offset).slice(0, limit).map(async num => {
                return await getEvent(num);
            });
        } else {
            events = itemsDesc.map(async num => {
                return await getEvent(num);
            });
        }

        return Promise.all(events);
    };

    // create routes for API
    app.get('/', (_, res) => {
        res.send('Hello!');
    });

    app.get('/event/:id', async (req, res) => {
        const event = await getEvent(req.params.id);

        res.json(event);
    });

    app.get('/events', async (req, res) => {
        const { limit, offset } = req.query;

        try {
            const events = await getEvents(limit, offset);
            const eventCount = await getEventCount();

            res.json({
                events,
                totalEvents: eventCount,
            });
        } catch (error) {
            console.log(error);
        }
    });

    app.use((req, res, next) => {
        const apiKey = req.get('API-Key');

        if (!apiKey || apiKey !== API_KEY) {
            res.status(401).json({ error: 'unauthorized' });
        } else {
            next();
        }
    });

    app.post('/event/add', async (req, res) => {
        const event = req.body;

        try {
            await addEvent(event);

            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    });

    // run app
    app.listen(8080, () => {
        console.log('👍');
    });
})();