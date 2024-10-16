const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 4000;

// Use your API key here
const apiKey = 'AIzaSyCz2kAV9M3zkCtzNYEjwNeXOxZ03e6AvdQ'; // Replace with your valid API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js server!');
});

// New endpoint to generate nutrition plan
app.post('/generate-nutrition-plan', async (req, res) => {
    const { disabilityType, disabilityName, levelOfDisability, age, gender } = req.body;

    const prompt = `Generate a nutrition plan for a person with ${disabilityType} (${disabilityName}), level ${levelOfDisability}, age ${age}, and gender ${gender}, the response should not be negative and give atleast few items for breakfast, lunch, snacks and dinner.
     You can give some suggestions as well that will help the user. Remove all the special symbols and don't show option, just give the items`;

    try {
        const result = await model.generateContent(prompt);
        res.json({ nutritionPlan: result.response.text() });
    } catch (error) {
        console.error('Error generating nutrition plan:', error);
        res.status(500).send('Error generating nutrition plan');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
