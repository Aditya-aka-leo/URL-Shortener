const mongoose = require("mongoose");

const url_design = mongoose.Schema(
    {
        hashed_key:
        {
            type:String,
            required :true,
            unique:true
        },
        original_url : 
        {
            type:String,
            require:true,
            unique:true
        },
        CreatedAt: Date
    }
);
module.exports = mongoose.model('url_design',url_design);
