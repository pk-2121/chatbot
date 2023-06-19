const {response} = require("express");
global.exercise_names = [];
function getAge(data) {
    const sentence = data.join(" ");
    const regex = /(\b\d{1,3}\b)\s*(?:years|yrs)?/i;
    const match = sentence.match(regex);

    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}
function getWeightInKg(data){
    for (const item of data){
        const num = +item;
        if (!isNaN(num)){
           if (num >= 10 && num <= 400){
               return num;
           }
        }
    }
    return null;
}
function getHeightInCm(data){
    for (const item of data){
        const num = +item;
        if (!isNaN(num)){
            if (num >= 100 && num <= 250){
                return num;
            }
        }
    }
    return null;
}
function getNumberOfSession(data){
    for (const item of data){
        const num = +item;
        if (!isNaN(num)){
            if (num >= 1 && num <= 7){
                return num;
            }
        }
    }
    return null;
}
function sessionTime(data) {
    const sentence = data.join(" ");
    const regex = /(\d+)\s*(?:hr|hour|hrs|hours)?\s*(?:and)?\s*(\d+)\s*(?:min|minute|mins|minutes)?/i;

    const match = sentence.match(regex);

    if (match) {
        let hours = parseInt(match[1], 10);
        let minutes = parseInt(match[2], 10);

        hours = hours * 60;
        return hours + minutes;
    }
    return null;
}
function getSpecificPlan(data){
    let response = [];
    let answer_id = null;

    const weight = data[0], height = data[1], goal = data[2], sessions = data[3];
    const BMI = weight / (height * height) ;
    let goal_status = null ;
    let BMI_status = "normal";
    let ideal_session = null;

    if (BMI < 18.5) {
        BMI_status = "underweight";
        goal_status = "gain";
        ideal_session = 4;
        answer_id = "aid_5";
    } else if (18.5 <= BMI && BMI <= 24.9) {
        BMI_status = "healthy";
        goal_status = "fitness";
        ideal_session = 4;
        answer_id = "aid_6";
    }else if (25 <= BMI && BMI <= 29.9) {
        BMI_status = "over weight";
        goal_status = "loss";
        ideal_session = 5;
        answer_id = "aid_4";
    }else if (30 <= BMI && BMI <= 39.9) {
        BMI_status = "obese";
        goal_status = "loss";
        ideal_session = 5;
        answer_id = "aid_4";

    }else{
        BMI_status = "extremely obese";
        goal_status = "loss";
        ideal_session = 5;
        answer_id = "aid_4";
    }
    if (goal !== goal_status){
        const comment = `Although your body goal is weight ${goal}, since your BMI indicates that you are currently ${BMI_status}, we recommend you focus on weight ${goal_status} instead.`
        response.push(comment);
    }
    response.push(answer_id);

    return response;
}
function goalConvention(status){
    switch (status) {
        case 'gain':
            return "weight gain";
        case 'loss':
            return "weight loss";
        case 'fitness':
            return "overall fitness";
        default:
            return "overall fitness";
    }
}
function getIdealGoal(BMI){
    let BMI_status = null;
    let goal_status = null;
    let response = [];

    if (BMI < 18.5) {
        BMI_status = "underweight";
        goal_status = "gain";
    } else if (18.5 <= BMI && BMI <= 24.9) {
        BMI_status = "healthy";
        goal_status = "fitness";
    }else if (25 <= BMI && BMI <= 29.9) {
        BMI_status = "over weight";
        goal_status = "loss";
    }else if (30 <= BMI && BMI <= 39.9) {
        BMI_status = "obese";
        goal_status = "loss";
    }else{
        BMI_status = "extremely obese";
        goal_status = "loss";
    }

    response.push(BMI_status);
    response.push(goal_status);

    return response;
}
function getIdealSession(goal){

    switch (goal) {
        case 'gain':
            return 5;
        case 'loss':
            return 4;
        case 'fitness':
            return 4;
        default:
            return 4;
    }

}
function getWorkoutPlan(category, objectList, data, answers){
    let response = [];
    const height = data[0]/100;
    const weight = data[1];
    const goal = data[2];
    const session = data[3];
    let comment = '';
    let ans_id = null;
    let next_id = null;

    const BMI = weight / (height * height);
    const bmi_goal = getIdealGoal(BMI);

    console.log(BMI);
    console.log(bmi_goal);


    if (goal !== bmi_goal[1]){
        const _goal = goalConvention(goal);
        const _bmi_goal = goalConvention(bmi_goal[1]);
        console.log(_goal);
        console.log(_bmi_goal);
        comment += `Although your body goal is ${_goal}, since your BMI indicates that you are currently ${bmi_goal[0]}, we recommend you focus on weight ${_bmi_goal} instead.`
    }

    console.log(comment);

    const goal_list = ['loss', 'gain', 'fitness'];
    const index = goal_list.indexOf(bmi_goal[1]);
    if (category === "specific") {
        const ideal_session = getIdealSession(bmi_goal);
        console.log(`Session : ${session} , Ideal session : ${ideal_session}`);
        if (session !== ideal_session) {
            comment += `\nSince your customized session cannot help you achieve your body goals, we suggest changing to ${ideal_session} sessions instead.\n\n`;
        }
    }

    for (const obj of objectList){
        //console.log(`Type of category : ${typeof obj["category"]} :: Type of Searched category ${typeof category}`);
        if (obj["category"] === category) {
            //console.log(`Category : ${obj["category"]} :: Searched category ${category}`);
            ans_id = obj["id"][index];
            next_id = obj["next"][0];
        }
    }

    if (ans_id == null){
        return null;
    }
    for(const obj of answers){
        if (obj.id === ans_id){
            comment += obj.comment + '\n';
            for (const exercise of obj.exercises){
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
    }
    response.push(comment);
    response.push(next_id);
    return response;

}
function getExerciseVideos(category, objectList, data, answers){
    let response = [];
    const exercises = exercise_names.filter(word => data.includes(word));
    let comment = '';
    let ans_id = null;
    let next_id = null;

    if (exercises.length === 0){
        return null;
    }
    for (const obj of objectList){
        if (obj["category"] === category) {
            ans_id = obj["id"][0];
            next_id = obj["next"][0];
        }
    }

    for (const obj of answers){
        if (obj.id === ans_id){
            comment = obj.comment + '\n';
            for (const info of obj.info){
                if (exercises.indexOf(info.name.toLowerCase().replace(/\s/g, '')) !== -1){
                    comment += `${info.name}\n`;
                    for (const capsule of info.description){
                        comment += `${capsule.note}\n`;
                        comment += `${capsule.related_link}\n`;
                    }
                    comment += '\n';
                }
            }
        }
    }

    response.push(comment);
    response.push(next_id);

    return response;

}
function getNutritionPlan(category, objectList, data, answers){
    let response = [];
    const age = data[0], height = data[1], weight = data[2], gender = data[3], activity = data[4];
    let bmr, calories;
    let comment = '';
    let ans_id = null;
    let next_id = null;

    if (gender === 'male') { // male
        bmr = 66.47 + (13.7 * weight) + (500.3 * (height/100)) - (6.76 * age);
    } else { // female
        bmr = 655.1 + (9.56 * weight) + (185 * (height/100)) - (4.68 * age);
    }
    switch(activity) {
        case 'sedentary':
            calories = (bmr * 1.2);
            break;

        case 'moderately':
            calories = (bmr * 1.55);
            break;

        case 'highly':
            calories = (bmr * 1.9);
            break;

        default:
            break;
    }

    comment += `We recommend you to consume ${calories} calories per day. \n`;

    const BMI = weight / (height * height);
    const bmi_goal = getIdealGoal(BMI);

    const goal_list = ['loss', 'gain', 'fitness'];
    const index = goal_list.indexOf(bmi_goal[1]);

    for (const obj of objectList){
        if (obj["category"] === category) {
            ans_id = obj["id"][index];
            next_id = obj["next"][0];
            break;
        }
    }
    if(ans_id === null){
        return null;
    }
    for (const obj of answers){
        if (obj.id === ans_id){
            for (const info of obj.info){
                comment += `${info.name} : ${info.description[0].note * weight} gram \n`;
            }
        }
    }

    response.push(comment);
    response.push(next_id);
    return response;
}

module.exports = {
    getAge,
    getWeightInKg,
    getHeightInCm,
    getNumberOfSession,
    getSpecificPlan,
    getWorkoutPlan,
    getExerciseVideos,
    getNutritionPlan
};