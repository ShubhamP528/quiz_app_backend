const Question=require('./models/question')
const QuestionList=require('./models/questionList')

const question=[
    {
        question:"What is the estimated age of the Earth?",
        option1:"4.5 billion years",
        option2:"1 million years",
        option3:"10,000 years",
        option4:"500 million years",
        answer:1
    },
    {
        question:"Which gas makes up the majority of Earth's atmosphere?",
        option1:"Oxygen",
        option2:"Nitrogen",
        option3:"Carbon dioxide",
        option4:"Hydrogen",
        answer:2
    },
    {
        question:"What is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen?",
        option1:"Photosynthesis",
        option2:"Respiration",
        option3:"Combustion",
        option4:"Erosion",
        answer:1
    },
    {
        question:"What is the largest ocean on Earth?",
        option1:"Atlantic Ocean",
        option2:"Indian Ocean",
        option3:"Arctic Ocean",
        option4:"Pacific Ocean",
        answer:4
    },
    {
        question:"Which continent is often referred to as the “roof of the world” due to its high elevation?",
        option1:"Africa",
        option2:"South America",
        option3:"Asia",
        option4:"Antarctica",
        answer:3
    },
    {
        question:"Which natural disaster occurs when there is a sudden release of energy in the Earth’s crust, resulting in seismic waves?",
        option1:"Hurricane",
        option2:"Tornado",
        option3:"Earthquake",
        option4:"Volcano eruption",
        answer:3
    }
]

const questionList={title:"First"}



const seedQuestionList = async () => {
    try {
        // Insert questionList into QuestionList collection
        const QuesList = await QuestionList.insertMany(questionList);

        for (let i of question) {
            // Insert each question into the Question collection
            const que = await Question.insertMany(i);

            // Check if QuesList has questions and answers arrays, and initialize them if not
            if (!QuesList[0].questions) QuesList[0].questions = [];
            if (!QuesList[0].answers) QuesList[0].answers = [];

            // Push the question id and answer to the respective arrays
            QuesList[0].questions.push(que[0]._id); // Assuming insertMany returns an array
            QuesList[0].answers.push(que[0].answer); // Assuming insertMany returns an array
        }

        // Save the updated QuesList document
        await QuesList[0].save();
        console.log("Question seeded");
    } catch (error) {
        console.error("Error seeding questions:", error);
    }
};



// const seedQuestionList=async()=>{
//     const QuesList=await QuestionList.insertMany(questionList);
//     for(let i of question){
//         const que=await Question.insertMany(i)
//         await QuesList.questions.push(que[0]._id);
//         await QuesList.answers.push(que[0].answer);
//         await QuesList.save();
//     }
//     console.log("Question seeded");
// }

module.exports=seedQuestionList;