function readJsonData(filePath, callback){
    const fs = require('fs');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            callback(err, null);
        }

        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);

        } catch (err) {
            console.error('Error parsing JSON data:', err);
            callback(err, null);
        }
    });
}
function getQuestionResponseId(data, objectList, category){
    let response = [];
    let relatedIds;
    let nextId;

    for (const obj of objectList) {
        if (obj["category"] === category) {
            relatedIds = obj["id"];
            nextId = obj["next"];
            break;
        }
    }

    if (relatedIds == null){
        return response;
    }else{
        for (const id of relatedIds) {
            response.push(id)
        }
    }
    if (nextId !== null){
        for (const id of nextId) {
            response.push(id)
        }
    }
    return response;
}
function getCurrentAnswer(id, data){
    let info = [];
    let comment = "";

    for (const obj of data){
        if(obj["id"] === id){
            info["id"] = obj["id"];
            info["exercises"] = obj["exercises"];
            info["info"] = obj["info"];
            info["comment"] = obj["comment"];
        }
    }
    if (info["exercises"] !== null){
        for (const exercise of info["exercises"]){
            if(exercise.session !== null){
                comment += `${exercise.session} \n`;
            }
            for (const capsule of exercise.plan){
                exercise_names.push(capsule.name.toLowerCase().replace(/\s/g, ''));
                comment += `${capsule.name} : ${capsule.reps}\n`;
            }
            comment += '\n';
        }
    }
    if (info["info"] !== null){
        for(const obj of info["info"]){
            comment += `${obj.name}\n`;
            for (const capsule of obj.description){
                if(capsule.note !== null){
                    comment += `${capsule.note}\n`;
                }
                if(capsule.related_link !== null){
                    comment += `${capsule.related_link}\n`;
                }
                comment += "\n";
            }
            comment += "\n";
        }
    }
    if (info["comment"] !== null){
        comment += info["comment"];
    }
    return comment;
}
function getNextQuestion(id, data){

    let question = null;

    for (const obj of data){
        if(obj["id"] === id){
            question = obj["question"];
            return question;
        }
    }

    return question;

}
function getCurrentDataInformation(id, data){

    let info = [];

    for (const obj of data){
        if(obj["id"] === id){
            info["id"] = obj["id"];
            info["question"] = obj["question"];
            info["keywords"] = obj["keywords"];
            info["function"] = obj["function"];
            info["prerequisite"] = obj["prerequisite"];
            info["link"] = obj["link"];
            info["comment"] = obj["comment"];
        }
    }
    return info;

}
module.exports = {
    readJsonData,
    getQuestionResponseId,
    getNextQuestion,
    getCurrentDataInformation,
    getCurrentAnswer
};