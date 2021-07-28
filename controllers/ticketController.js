const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

//method to check if a seat is booked
const isSeatBooked = async seat  =>{

    const ticket = await Ticket.findOne({
        booked:true,
        seatNo:seat  
    })
    if(ticket){
        return true;
    }
    
    return false;
}

//method to book ticket 
exports.bookTicket = async (req,res,next)=>{

   try{
    
    const seatNo = req.body.seatNo;
    const userEmail = req.body.user.email;
    const name = req.body.user.age;
    const age = req.body.user.age;

    if(seatNo==undefined||userEmail==undefined||name==undefined||age==undefined){
        return res.status(404).json({
            status: 'Ticket not booked',
            data: 'Please provide all inputs'
        });
    }


    if(seatNo>40||seatNo<1){
       return res.status(404).json({
            status: 'Ticket not booked',
            data:'Seat number is not valid'
        });
    }

    const seatBooked = await isSeatBooked(seatNo);

    if(seatBooked){
       return  res.status(400).json({
            status: 'Seat alreday booked',
        });
    }


    //chek if user alreday in DB
    const isPreviousUser = await User.findOne({
        email:userEmail
    })

    if(isPreviousUser){
        const ticket = new Ticket()
        ticket.seatNo=seatNo;
        ticket.booked=true;
        ticket.user=isPreviousUser.id
        const ticketSaved = await  ticket.save()

        if(ticketSaved){
          return  res.status(200).json({
                status: 'Ticket booked successfully',
                data:ticketSaved
            });
        }

    }else{
        //else add user to DB

        const user = new User(req.body.user)

        const userSaved = await user.save();

        if(userSaved){
            const ticket = new Ticket()
            ticket.seatNo=seatNo;
            ticket.booked=true;
            ticket.user=userSaved.id

            const ticketSaved = await  ticket.save()

            if(ticketSaved){
               return  res.status(200).json({
                    status: 'Ticket booked successfully',
                    data:ticketSaved
                });
            }
        }

    }
    
   }catch(error){
       next(error)
   }

};

//method retuns if a seat is booked or not 
exports.getTicketStatus = async (req,res,next)=>{

    try{
        const seatNo = req.params.seatNo;
        
        const ticket = await Ticket.findOne({
            seatNo:seatNo
        })

        if(ticket){
            if(ticket.booked){
                res.status(200).json({
                    status: 'Booked',
                });
            }else{
                res.status(200).json({
                    status: 'Not Booked',
                });
            }
    
            
        }else{

            res.status(404).json({
                status: 'Ticket not found',
            });
    
        }

        

    }catch(error){
        next(error)
    }


};

//method to update ticket details 
exports.updateTicket = async (req,res,next)=>{


    try{
        const seatNo = req.params.seatNo;
        const updatedUser = req.body.user;
        const booked = req.body.booked;
        console.log(seatNo)
        if(seatNo==undefined||updatedUser==undefined||booked==undefined){
            return res.status(404).json({
                status: 'Details not found in request',
            });

        }

        const ticketSaved = await Ticket.findOneAndUpdate({seatNo:seatNo}, {
            $set: { booked: booked}},
            {new: true}
        );

        if(!ticketSaved){

           return res.status(400).json({
                status: 'Ticket not found',
            });

        }

        const userId = ticketSaved.user;

        await User.findByIdAndUpdate(userId, 
            { $set: updatedUser}, 
            { new: true }, 
        );


        return res.status(200).json({
            status: 'Ticket Updated',
            data:ticketSaved
        });


    }catch(error){

        next(error);
    }


};

//metod retuns array of booked seat numbers
exports.getAllBookedTickets = async (req,res,next)=>{

    try{

        const bookedTickets = await Ticket.find({
            booked:true
        });

        let booked = []
        for(i in bookedTickets){
            booked.push(bookedTickets[i].seatNo)
        }

        
        res.status(200).json({
            status: 'List of booked seats',
            data: booked
        });


    }catch(error){
        next(error)
    }

};

//method retuns array of non booked seat numbers
exports.getAllNonBookedTickets = async (req,res,next)=>{


    try{

        const bookedTickets = await Ticket.find({
            booked:true
        });
        let seats = new Array(40);
        for(let i=0;i<40;i++){
            seats[i]=i+1;
        }
        for(i in bookedTickets){
            seats = seats.filter((closed)=> closed!==bookedTickets[i].seatNo )
        }
        
        res.status(200).json({
            status: 'Non booked seats',
            data: seats
        });


    }catch(error){
        next(error)
    }
};

//retuns ticket owner details by seat number
exports.getTicketOwner =  async (req,res,next)=>{

    try{

        const seatNo = req.params.seatNo;
        const ticket = await Ticket.findOne({
            seatNo:seatNo
        })

        if(!ticket){
            return  res.status(404).json({
                status: 'Ticket not found',
            });
    
        }

        const user =  await User.findById(ticket.user);

        if(!user){
            return  res.status(404).json({
                status: 'User details not found',
            }); 
        }


        res.status(200).json({
            status: 'success',
            data: user,
        });

    }catch(error){
        next(error)
    }


}

