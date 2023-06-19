const fs = require('fs');

const jsonData = `{
    "id" : 1,
    "question": "What is your goal?",
    "keywords" : [
        {
            "key" :[
                "gain"
            ],
            "category": "weight_gain"
        },
        {
            "key" : [
                "loss", "reduce"
            ],
            "category": "weight_loss"
        },
        {
            "key" :[
                "keep", "fitness", "over all"
            ],
            "category" : "fitness"

        }
    ],
    "weight_gain": {
        "exercises" : [
            {
                "id" : 1,
                "name" : "Cardio Exercise",
                "reps" : null,
                "times" : null,
                "duration" : "10 mins"
            },
            {
                "id" : 2,
                "name" : "Chest Press",
                "reps" : 8,
                "times" : 4,
                "duration" : null
            },
            {
                "id" : 3,
                "name" : "Biceps Curling",
                "reps" : 8,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 4,
                "name" : "Triceps exte",
                "reps" : 8,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 5,
                "name" : "Shoulder Lift",
                "reps" : 16,
                "times" : 4,
                "duration" : "" 
            },
            {
                "id" : 6,
                "name" : "Dead Lift",
                "reps" : 16,
                "times" : 4,
                "duration" : "" 
            },
            {
                "id" : 7,
                "name" : "Leg Press",
                "reps" : 8,
                "times" : 4,
                "duration" : null 
            }
        ],
        "recommendation" : "Do resistance training with higher weight plates as much as you can pull and push for only two to three days"
    },
    "weight_loss": {
        "exercises" : [
            {
                "id" : 1,
                "name" : "Cardio Exercise",
                "reps" : null,
                "times" : null,
                "duration" : "20-30 mins"
            },
            {
                "id" : 2,
                "name" : "Chest Press",
                "reps" : 16,
                "times" : 4,
                "duration" : null
            },
            {
                "id" : 3,
                "name" : "Biceps Curling",
                "reps" : 20,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 4,
                "name" : "Triceps exte",
                "reps" : 20,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 5,
                "name" : "Shoulder Lift",
                "reps" : 16,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 6,
                "name" : "Dead Lift",
                "reps" : 16,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 7,
                "name" : "Leg Press",
                "reps" : 16,
                "times" : 4,
                "duration" : null 
            }
        ],
        "recommendation" : "Do resistance training with weight plates for only four to five days"
    },
    "fitness": {
        "exercises" : [
            {
                "id" : 1,
                "name" : "Cardio Exercise",
                "reps" : null,
                "times" : null,
                "duration" : "15 mins"
            },
            {
                "id" : 2,
                "name" : "Chest Press",
                "reps" : 12,
                "times" : 4,
                "duration" : null
            },
            {
                "id" : 3,
                "name" : "Biceps Curling",
                "reps" : 12,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 4,
                "name" : "Triceps exte",
                "reps" : 12,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 5,
                "name" : "Shoulder Lift",
                "reps" : 12,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 6,
                "name" : "Dead Lift",
                "reps" : 12,
                "times" : 4,
                "duration" : null 
            },
            {
                "id" : 7,
                "name" : "Leg Press",
                "reps" : 12,
                "times" : 4,
                "duration" : null 
            }
        ],
        "recommendation" : "Do resistance training with weight plates for only three to four days"
    },
    "other" :{

    },
    "related-questions" : [2,3]
}`;

fs.writeFile('public/general_workout.json', jsonData, 'utf8', err => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('JSON data saved to file successfully.');
    }
});
