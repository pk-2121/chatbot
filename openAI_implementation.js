const readline = require('readline');
const { openai } = require('openai'); // OpenAI API library

// Set up your OpenAI API credentials
openai.apiKey = 'YOUR_API_KEY';

// Define the conversation flow and prompts
const conversationFlow = [
    "Chatbot: Hello! I am a fitness chatbot here to assist you with your workout routine and diet plan. Let's get started!",
    "Chatbot: May I ask your age?",
    "User: ",
    "Chatbot: Could you please tell me your height in centimeters?",
    "User: ",
    "Chatbot: Thank you! And what is your weight in kilograms?",
    "User: ",
    "Chatbot: Lastly, what is your gender?",
    "User: ",
    "Chatbot: Now, let's determine your fitness goal. Do you want to focus on weight gain, weight loss, or overall fitness?",
    "User: ",
    "Chatbot: How many workout sessions would you like to have per week?",
    "User: ",
    "Chatbot: Do you have any existing medical conditions or injuries that may impact your ability to exercise?",
    "User: ",
    "Chatbot: How would you describe your activity level? Are you sedentary, moderately active, active, or highly active?",
    "User: ",
    "Chatbot: Based on the information you provided, I will now generate a personalized workout plan and diet plan for you.",
    "Chatbot: Here's a general workout plan to get you started...",
    "Chatbot: Would you like to receive it?",
    "User: ",
    "Chatbot: I have also designed a specific workout plan tailored to your needs...",
    "Chatbot: Would you like to receive it?",
    "User: ",
    "Chatbot: To support your fitness goals, here's a nutrition plan based on your Basal Metabolic Rate...",
    "Chatbot: Would you like to receive it?",
    "User: ",
    "Chatbot: I can also provide you with food recommendations to support your nutrition plan...",
    "Chatbot: Would you like to receive them?",
    "User: ",
    "Chatbot: If you're interested in supplements, I can recommend some...",
    "Chatbot: What would you like to get? A supplement for muscle mass or body weight?",
    "User: ",
    "Chatbot: As our world becomes more challenging, incorporating daily mindfulness sessions can be beneficial...",
    "Chatbot: Would you like some mindfulness program recommendations?",
    "User: ",
    "Chatbot: Is there anything else you would like to ask or discuss? If not, just let me know, and we can conclude our conversation."
];

// Initialize the conversation
function initializeConversation() {
    for (const prompt of conversationFlow) {
        console.log(prompt);
    }
}

// Process user input and continue the conversation
async function processUserInput(userInput) {
    conversationFlow.push("User: " + userInput);

    if (userInput.toLowerCase().includes("general workout plan")) {
        // Generate and provide general workout plan
        conversationFlow.push("Chatbot: Here's a general workout plan to get you started...");
        conversationFlow.push("Chatbot: Would you like to receive it?");
        return;
    }

    if (userInput.toLowerCase().includes("specific workout plan")) {
        // Generate and provide specific workout plan
        conversationFlow.push("Chatbot: I have designed a specific workout plan tailored to your needs...");
        conversationFlow.push("Chatbot: Would you like to receive it?");
        return;
    }

    if (userInput.toLowerCase().includes("nutrition plan")) {
        // Generate and provide nutrition plan
        conversationFlow.push("Chatbot: To support your fitness goals, here's a nutrition plan based on your Basal Metabolic Rate...");
        conversationFlow.push("Chatbot: Would you like to receive it?");
        return;
    }

    if (userInput.toLowerCase().includes("food recommendations")) {
        // Provide food recommendations
        conversationFlow.push("Chatbot: I can provide you with food recommendations to support your nutrition plan...");
        conversationFlow.push("Chatbot: Would you like to receive them?");
        return;
    }

    if (userInput.toLowerCase().includes("supplement for muscle mass")) {
        // Provide supplement recommendations for muscle mass
        conversationFlow.push("Chatbot: For muscle mass, I recommend...");
        return;
    }

    if (userInput.toLowerCase().includes("supplement for body weight")) {
        // Provide supplement recommendations for body weight
        conversationFlow.push("Chatbot: For body weight, I recommend...");
        return;
    }

    if (userInput.toLowerCase().includes("mindfulness program recommendations")) {
        // Provide mindfulness program recommendations
        conversationFlow.push("Chatbot: Here are some mindfulness programs you might find helpful...");
        return;
    }

    if (userInput.toLowerCase().includes("thank you") || userInput.toLowerCase().includes("that will be all")) {
        conversationFlow.push("Chatbot: You're welcome! If you have any more questions, feel free to ask. Good luck with your fitness journey.");
        return;
    }

    // Continue the conversation by prompting the next question or request
    if (conversationFlow.length < prompts.length) {
        const prompt = conversationFlow[conversationFlow.length - 1];
        console.log(prompt);
    } else {
        conversationFlow.push("Chatbot: I'm sorry, I didn't understand. Can you please rephrase or ask a different question?");
        console.log("Chatbot: I'm sorry, I didn't understand. Can you please rephrase or ask a different question?");
    }
}

// Main conversation loop
async function chat() {
    initializeConversation();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.prompt();

    for await (const userInput of rl) {
        processUserInput(userInput);

        // Use OpenAI API to generate a response
        const response = await openai.complete({
            engine: 'davinci-codex',
            prompt: conversationFlow.join('\n'),
            temperature: 0.6,
            maxTokens: 100,
            n: 1,
            stop: null,
            log_level: 'info'
        });

        // Extract the generated response from the OpenAI API
        if (response.choices.length > 0) {
            const chatbotResponse = response.choices[0].text.trim().replace("Chatbot: ", "");
            conversationFlow.push("Chatbot: " + chatbotResponse);
            console.log("Chatbot:", chatbotResponse);
        } else {
            conversationFlow.push("Chatbot: I'm sorry, I'm having trouble generating a response. Can you please rephrase or ask a different question?");
            console.log("Chatbot: I'm sorry, I'm having trouble generating a response. Can you please rephrase or ask a different question?");
        }

        if (conversationFlow[conversationFlow.length - 1].includes("Is there anything else you would like to ask or discuss?")) {
            rl.close();
            break;
        }

        rl.prompt();
    }
}

// Start the conversation
chat();
