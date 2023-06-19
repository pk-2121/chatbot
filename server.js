const { readJsonData, getCurrentAnswer, getQuestionResponseId, getNextQuestion, getCurrentDataInformation } = require('./helperFunctions');
const functions = require('./public/providedFunctions.js');

let questions = null;
let answers = null;
let default_question;
let current_id;
let data_storage = [];


readJsonData('public/questions.json', (err, question) => {
    if (err) {
        console.log("Error in Json File reading");
        return;
    }
    questions = question.questions;
});

readJsonData('public/answers.json', (err, answer) => {
    if (err) {
        console.log("Error in Json File reading");
        return;
    }
    answers = answer.answers;
});
function generateAnswer(data) {
    console.log(`Printing the data storage array : `);
    for (const key in data_storage) {
        const value = data_storage[key];
        console.log(key, value);
    }

    for (let i = 0; i < data_storage.length; i++) {
        const obj = data_storage[i];
        console.log(obj); // Access the object properties as needed
    }
    console.log("Printing the data storage array is finished");

    let error_case = false;

    const currentDataInfo = getCurrentDataInformation(current_id, questions)
    let answer = [];

    const stopwords = [
        'a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'is', 'are',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
        'when', 'and', 'or', 'but', 'if', 'of', 'with', 'from', 'as'
    ];

    let cleanedText = data.toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
    let words = cleanedText.split(" ");
    let user_keywords = words.filter(word => !stopwords.includes(word));

    const keywords = currentDataInfo["keywords"];
    let detectedCategory = null;
    const links = currentDataInfo["link"];
    const applyFunction = currentDataInfo["function"];

    if (keywords !== null) {
        for (const keywordData of keywords) {
            const { key, category } = keywordData;
            const common_words = key.filter(word => user_keywords.includes(word))
            if (common_words.length >= 1) {
                detectedCategory = category;
                break;
            }
        }
        console.log(`detected category : ${detectedCategory} `);
        if (applyFunction === null){
            if (detectedCategory !== null) {
                data_storage[current_id] = detectedCategory;
                const responseId = getQuestionResponseId(data_storage, links , detectedCategory)
                console.log(`responseId : ${responseId} `);
                if (responseId.length !== 0){
                    if (responseId.length === 1){
                        current_id = responseId[0];
                        data_storage[current_id] = null;
                        answer.push(getNextQuestion(current_id, questions));
                    }else{
                        answer.push(getCurrentAnswer(responseId[0],answers));
                        current_id = responseId[1];
                        data_storage[current_id] = null;
                        answer.push(getNextQuestion(current_id, questions));
                    }
                }
            }else{
                error_case = true;
            }
        }else{
            if (detectedCategory === "skip"){
                const responseId = getQuestionResponseId(data_storage, links , detectedCategory)
                current_id = responseId[0];
                data_storage[current_id] = null;
                answer.push(getNextQuestion(current_id, questions));
            }else{
                const prerequisite = currentDataInfo["prerequisite"];
                let instant_data = [];
                let result = [];
                if (prerequisite != null) {
                    for (const id of prerequisite){
                        instant_data.push(data_storage[id]);
                    }
                }else{
                    instant_data = user_keywords;
                }
                console.log(`Instant_data : ${instant_data}`);

                if (functions[applyFunction]) {
                    result = functions[applyFunction](detectedCategory, links, instant_data, answers);
                }
                if(result !== null){
                    console.log(`answer : ${result[0]}`);
                    answer.push(result[0]);
                    current_id = result[1];
                    data_storage[current_id] = null;
                    answer.push(getNextQuestion(current_id, questions));
                }else{
                    error_case = true;
                    console.log(`Result NULL Case`);
                }
            }
        }
    }else{
        if (applyFunction !== null){
            let result = null;
            if (functions[applyFunction]) {
                result = functions[applyFunction](user_keywords);
            }
            console.log(`function return value : ${result}`);
            if(result !== null){
                data_storage[current_id] = result;
            }else{
                error_case = true;
                console.log(`Result NULL Case`);
            }
        }
    }

    if (!error_case){
        const nextQuestionId = getQuestionResponseId(data_storage, links, "next");
        console.log(`nextQuestionId : ${nextQuestionId} `);

        if (nextQuestionId.length !== 0) {
            current_id = nextQuestionId[0];
            data_storage[current_id] = null;
            answer.push(getNextQuestion(current_id, questions));
        }
    }

    if (answer.length === 0){
        answer.push(currentDataInfo["comment"]);
    }
    return answer;
}

const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

server.listen(5000, function () {
    console.log("server started at port 5000");
});

app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);
    default_question = questions[0]['question'];
    current_id = questions[0]['id'];
    data_storage = {current_id : null}
    socket.emit("answer", default_question);

    socket.on("disconnect", (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
    });

    socket.on("question", (data) => {
        console.log("recieved question: "+data);
        const generatedAnswer = generateAnswer(data);
        console.log(`Answer length : ${generatedAnswer.length}`);
        for (const answer of generatedAnswer){
            console.log(`Answer : ${answer}`);
            socket.emit('answer', answer);
        }
    });
});