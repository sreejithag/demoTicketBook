const Ticket  = require('../models/ticketModel');

//resets the server 
exports.reset = async (req, res, next) => {
    
    try {
        await Ticket.deleteMany({})

        res.status(200).json({
            "status":"Server reset success"
        })

    } catch (error) {
        next(error)
    }
};


