const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async(req,res)=>{
    // check if user exists
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err,data)=>{
        if(err){
            return res.status(500).json({
                success : "false",
                message : "something went wrong",
                error : err
            });
        }
        if(data.length){
            return res.status(409).json({
                success : "false",
                message : "user already exists",
            });
        }

        // create new user and hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO `users` (`username`, `email`, `password`, `name`) VALUES  (?,?,?,?)";
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]
        db.query(q, values,(err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            };
            return res.status(201).json({
                success : "true",
                message : "user registered successfully",
                data : data
            });
        });
    });
};


const login = async(req,res)=>{
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err){
            return res.status(500).json({
                success : "false",
                message : "something went wrong",
                error : err
            });
        };
        if(data.length===0){
            return res.status(500).json({
                success : "false",
                message : "No user with username exists",
            });
        };

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkPassword){
            return res.status(500).json({
                success : "false",
                message : "Incorrrect username or password",
            });
        };

        const token = jwt.sign({id : data[0].id}, "secretKey@12345!!");

        const {password,...other} = data[0];

        res.cookie("accessToken",token,{
            httpOnly: true,
        }).status(200).json({
            success : "true",
            message : "User Signed in successfully",
            data : other 
        });
    })
}


const logout = async(req,res)=>{
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json({
        success : "true",
        message : "User logged out successfully"
    });
}

module.exports = {
    login,
    register,
    logout
}