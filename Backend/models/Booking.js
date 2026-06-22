const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // ===== BOOKING REQUEST FROM USER =====
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookerName: String,
    bookerPhone: String,
    bookerEmail: String,

    // ===== TRANSPORT / DRIVER =====
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportDriver",
      required: true,
    },
    driverOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ===== TRIP DETAILS =====
    pickup: String,
    dropoff: String,
    distance: Number,
    weight: Number,
    vehicleType: String,
    pickupDate: Date,
    estimatedPrice: Number,

    // ===== SHARED GOODS / CARPOOLING =====
    isShared: {
      type: Boolean,
      default: false, // true = this booking shares capacity with another booking
    },
    parentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null, // if shared, links to the primary booking on this vehicle
    },
    sharedWith: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        bookerName: String,
        weight: Number,
        pickup: String,
        dropoff: String,
        status: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" },
      },
    ],
    totalCapacityKg: Number, // vehicle max capacity
    usedCapacityKg: { type: Number, default: 0 }, // weight already used by other bookings
    remainingCapacityKg: Number, // how much capacity is still available

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled", "ongoing"],
      default: "pending",
    },
    rejectionReason: String,

    // ===== PAYMENT =====
    finalPrice: Number,
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
