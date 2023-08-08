const jwt = require("jsonwebtoken");
const db = require("../connect");

const getUser = async(req,res)=>{
    
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";
    db.query(q,[userId],(err,data)=>{
        if(err){
            return res.status(500).json({
                success : "false",
                message : "something went wrong",
                error : err
            });
        }

        const {password, ...user}= data[0];
        return res.status(200).json({
            success : true,
            message : "user fetched successfully",
            data : user
        });
    })
}


const updateUser = async(req,res)=>{

    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({
            success : "false",
            message : "User not logged in",
        });
    }
    jwt.verify(token, "secretKey@12345!!", (err,userInfo)=>{
        if(err){
            return res.status(403).json({
                success : "false",
                message : "token expired",
            });
        }
    
        const q = "UPDATE users SET `name` = ?,`coverPic` = ?,`profilePic` = ?,`city` = ?,`website` = ? WHERE id = ?";

        const values = [
            req.body.name,
            req.body.coverPic,
            req.body.profilePic,
            req.body.city,
            req.body.website,
            userInfo.id
        ]

        db.query(q,values,(err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            if(data.affectedRows > 0){
                return res.status(200).json({
                    success : true,
                    message : "User updated successfully",
                    data : data
                });
            } 
            return res.status(403).json("you cannot update only your profile");
        })
    })
}

module.exports = {
    getUser,
    updateUser
}