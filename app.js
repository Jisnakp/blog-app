const Express =require("express")
const Mongoose =require("mongoose")
const Bcrypt =require("bcrypt")
const Cors =require("cors")
const Jwt =require("jsonwebtoken")
const userModel=require("./models/users")


let app= Express()

app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://jisnab01:jisnab01@cluster0.tnvz6eq.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")

//signin

app.post("/signIn",async(req,res)=>{

    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
     (items)=>{
        if (items.length>0) {

            const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {

                    Jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {

                                res.json({"status":"error","errorMessage":error})
                                
                            } else {

                                res.json({"status":"success","token":token,"userId":items[0]._id})
                                
                            }
                        })
                    
                } else {

                    res.json({"status":"Incorrect password"})
                    
                }
            
            
        } else {

            res.json({"status":"Invalid EmailId"})
            
        }


 }

    ).catch()
})



//signup
app.post("/signUp",async(req,res)=>{
    
     let input=req.body
     let hashedPassword = Bcrypt.hashSync(req.body.password,10)
        console.log(hashedPassword)
        req.body.password=hashedPassword
        

        userModel.find({email:req.body.email}).then(

             (items)=>{
         
                if (items.length>0) {

                    res.json({"status":"emailid already exists"})
                    
                } else {
        
                    let result=new userModel(input)
                    result.save()
                   res.json({"status":"success"})
                    
                }
             }

        ).catch(

        (error)=>{}
        )

       

        
     
})

app.listen(3030,()=>{
    console.log("Server started")
})