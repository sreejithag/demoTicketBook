const mongoose = require("mongoose");


const ticketSchema = new mongoose.Schema({

    date:{
        type:Date,
        default:Date.now()
    },
    seatNo:{
        type:Number,
        min:1,
        max:40,
        required:true

    },
    booked:{
        type:Boolean,
        default:true
    },
    user:{
        type: mongoose.Types.ObjectId, ref: 'User'
    }
    
})

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;