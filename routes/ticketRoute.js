const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController')

router.post('/book',ticketController.bookTicket );
router.get('/booked',ticketController.getAllBookedTickets);
router.get('/nonbooked',ticketController.getAllNonBookedTickets);
router.get('/status/:seatNo',ticketController.getTicketStatus);
router.get('/owner/:seatNo',ticketController.getTicketOwner);
router.patch('/update/:seatNo',ticketController.updateTicket);
module.exports = router;