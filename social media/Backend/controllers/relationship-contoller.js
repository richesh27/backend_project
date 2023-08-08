const jwt = require("jsonwebtoken");
const db = require("../connect");

 const getRelationships =async(req, res) => {   // to get followers of particular user

    const q ="SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.params.followedUserId], (err, data) => {
        if(err){
            return res.status(500).json({
                success : "false",
                message : "something went wrong",
                error : err
            });
        }

        return res.status(200).json({
            success : true,
            message : "realtionships fetched successfully",
            data : data.map((relationship => relationship.followerUserId))
        });
    });
};


const addRelationship = async (req,res)=>{
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

        const q = "INSERT INTO `relationships` (`followerUserId`, `followedUserId`) VALUES (?)";

        const values = [ 
            userInfo.id,
            req.body.userId,
        ];

        db.query(q,[values], (err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            return res.status(201).json({
                success : true,
                message : "relationships (user followed) has been done successfully",
                data : data
            });
        });
    })
}


const deleteRelationship = async (req,res)=>{
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

        const q = "DELETE FROM relationships WHERE `followerUserId`= ? AND `followedUserId` = ?";

        db.query(q,[userInfo.id, req.params.userId,], (err,data)=>{
            if(err){
                return res.status(500).json({
                    success : "false",
                    message : "something went wrong",
                    error : err
                });
            }

            return res.status(201).json({
                success : true,
                message : "User unfollowed successfully"
            });
        });
    })
}

module.exports = {
    getRelationships,
    addRelationship,
    deleteRelationship
}