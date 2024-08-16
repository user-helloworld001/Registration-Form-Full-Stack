import express from "express";
import connectDb from "./connectdb.js";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";



dotenv.config({
    path: './.env'
})

const app = express();


const PORT = process.env.PORT || 3000;



//Database Connection

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("Mongo Db Connection Failed!!", error);
    })



app.get("/", (req, res) => {
    res.sendFile("E:\\WebDevelopment\\Bharat Intern Projects\\Registration Form\\index.html");
})

const registrationSchema = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        }
    }
)

const Registration = mongoose.model("registration", registrationSchema);




app.use(express.urlencoded({ extended: true }))


//controller settings
app.post("/SUBMIT", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        if ([Name, Email, Password].some((field) =>
            field?.trim() === "")) {
            console.log("All fields are required!");
            res.redirect("/required")
            
        }

        


        const existedUser = await Registration.findOne({
            Email
        });

        if (!existedUser) {
            

            
            const user = await Registration.create({
                Name,
                Email,
                Password
            })

            res.redirect("/success")
        }else {
            console.log("User exists")
            res.redirect("/exist")
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error")
    }
})

app.get("/success", (req, res) => {
    res.sendFile("E:\\WebDevelopment\\Bharat Intern Projects\\Registration Form\\Pages\\success.html");
})

app.get("/error", (req, res) => {
    res.sendFile("E:\\WebDevelopment\\Bharat Intern Projects\\Registration Form\\Pages\\error.html");
})
app.get("/exist", (req,res) => {
    res.sendFile("E:\\WebDevelopment\\Bharat Intern Projects\\Registration Form\\Pages\\exist.html")
})

app.get("/required",(req,res)=>{
    res.sendFile("E:\\WebDevelopment\\Bharat Intern Projects\\Registration Form\\Pages\\required.html")
})




