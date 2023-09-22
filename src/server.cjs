const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());

const getData = async () => {
    try {
        const apiKey = "8jAcsHp4HS2yTrQT1DCAnDRt";
        const res = await axios.get('https://uptime.betterstack.com/api/v2/monitors', {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

app.get('/', (req, res) => {
    res.json({ "message": "why are you here?" });
});

app.get('/monitors', async (req, res) => {
    try {
        const data = await getData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occurred fetching data from endpoint    " });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});