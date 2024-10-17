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

app.post('/generate-warmup-exercises', async (req, res) => {
    const { disabilityType, disabilityName, levelOfDisability, age, gender } = req.body;

    const prompt = `Generate a warm-up exercise plan for a person with ${disabilityType} (${disabilityName}), level ${levelOfDisability}, age ${age}, and gender ${gender}. Provide exercises that are safe and effective for this disability, give five exercises with brief instructions.
     Don't give any additional information and don't display "*" and "#" special symbols`;

    try {
        const result = await model.generateContent(prompt);
        res.json({ warmupExercises: result.response.text() });
        let warmupExercises = result.candidates[0].content; 
        warmupExercises = warmupExercises.replace(/\*\*/g, '');
        res.json({ warmupExercises });
    } catch (error) {
        console.error('Error generating warm-up exercises:', error);
        res.status(500).send('Error generating warm-up exercises');
    }
});
app.post('/get-exercises', async (req, res) => {
    const { disabilityType, disabilityName, levelOfDisability, age, gender } = req.body;

    const prompt = `Generate an exercise plan for a person with ${disabilityType} (${disabilityName}), level ${levelOfDisability}, age ${age}, and gender ${gender}. Provide a list of effective exercises with brief instructions. 
    give points wise, Don't give any additional information and don't display "*" and "#" special symbols.`;

    try {
        const result = await model.generateContent(prompt);

        // Assuming result.response.text() returns the exercise plan as a string
        let exercises = result.response.text(); 

        // Remove unwanted symbols and trim the result
        exercises = exercises.replace(/\*/g, '').replace(/\#/g, '').trim();

        // Split the exercises by line and filter out empty entries
        const exercisesList = exercises.split('\n').filter(exercise => exercise.trim() !== '');

        // Send the formatted exercises back to the client
        res.json({ exercises: exercisesList });
    } catch (error) {
        console.error('Error generating exercises:', error);
        res.status(500).send('Error generating exercises');
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
