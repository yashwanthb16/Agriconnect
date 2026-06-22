const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/bookingControllers");

// Create booking request
router.post("/create", bookingCtrl.createBooking);

// Get bookings for transport owner (notifications)
router.get("/owner/:userId", bookingCtrl.getOwnerBookings);

// Get bookings for specific driver
router.get("/driver/:driverId", bookingCtrl.getDriverBookings);

// Get user's own bookings
router.get("/my/:userId", bookingCtrl.getMyBookings);

// Accept/reject booking
router.put("/accept/:bookingId", bookingCtrl.acceptBooking);
router.put("/reject/:bookingId", bookingCtrl.rejectBooking);

// Get shared trips (trips with remaining capacity)
router.get("/shared-trips", bookingCtrl.getSharedTrips);

module.exports = router;
