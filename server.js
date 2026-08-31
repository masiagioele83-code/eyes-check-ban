const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

async function checkWhatsAppStatus(phoneNumber) {
    const cleanedNum = phoneNumber.replace(/\D/g, '');
    const isRegisteredAndActive = await mockApiCallToWhatsApp(cleanedNum);
    return isRegisteredAndActive;
}

async function mockApiCallToWhatsApp(phone) {
    if (phone.endsWith('0')) {
        return false;
    }
    return true;
}

app.post('/api/check-ban', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const isActive = await checkWhatsAppStatus(phoneNumber);

        if (isActive) {
            res.json({ status: 'active', message: '𝑰𝑳 𝑵𝑼𝑴𝑬𝑹𝑶 𝑵𝑶𝑵 𝑬 𝑰𝑵 𝑩𝑨𝑵 𝑹𝑰𝑴𝑬𝑫𝑰𝑨' });
        } else {
            res.json({ status: 'banned', message: '𝑳𝑶𝑩𝑶𝑻𝑶𝑴𝑰𝒁𝑨𝑻𝑶 𝑬𝑺𝑻𝑰𝑵𝑻𝑶 𝑫𝑨 𝒆𝒚𝒆𝒔' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to query WhatsApp API' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});