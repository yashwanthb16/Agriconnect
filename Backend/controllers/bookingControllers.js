const Booking = require("../models/Booking");
const TransportDriver = require("../models/TransportDriver");

// ========== VEHICLE CAPACITY MAP ==========
const VEHICLE_CAPACITY = {
  bike: 50,
  auto: 100,
  small_truck: 500,
  van: 800,
  large_truck: 2000,
  truck: 2000,
  bus: 1500,
};

// ========== CREATE BOOKING REQUEST ==========
exports.createBooking = async (req, res) => {
  try {
    const {
      driverId,
      pickup,
      dropoff,
      distance,
      weight,
      vehicleType,
      pickupDate,
      estimatedPrice,
      bookerName,
      bookerPhone,
      bookerEmail,
      isShared,
      parentBookingId,
    } = req.body;

    const bookedBy = req.body.userId;

    if (!driverId || !bookedBy) {
      return res.status(400).json({ success: false, message: "Driver ID and user ID required" });
    }

    // Get driver to find owner
    const driver = await TransportDriver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Transport not found" });
    }

    if (!driver.verification?.isAvailable) {
      return res.status(400).json({ success: false, message: "This transport is not currently available" });
    }

    // Get vehicle capacity
    const maxCapacity = driver.availabilityDetails?.maxCapacityKg || VEHICLE_CAPACITY[vehicleType] || VEHICLE_CAPACITY[driver.vehicleDetails?.vehicleType] || 1000;

    // If shared booking, validate capacity
    if (isShared && parentBookingId) {
      const parentBooking = await Booking.findById(parentBookingId);
      if (!parentBooking) {
        return res.status(404).json({ success: false, message: "Parent booking not found" });
      }

      const remainingCapacity = maxCapacity - (parentBooking.usedCapacityKg || 0);
      if (weight > remainingCapacity) {
        return res.status(400).json({
          success: false,
          message: `Weight exceeds remaining capacity. Available: ${remainingCapacity}kg, Requested: ${weight}kg`,
        });
      }

      // Create shared booking
      const booking = new Booking({
        bookedBy,
        bookerName: bookerName || req.body.name,
        bookerPhone: bookerPhone || req.body.phone,
        bookerEmail: bookerEmail || req.body.email,
        driverId,
        driverOwnerId: driver.userId,
        pickup,
        dropoff,
        distance,
        weight,
        vehicleType: vehicleType || driver.vehicleDetails?.vehicleType,
        pickupDate,
        estimatedPrice,
        isShared: true,
        parentBookingId,
        totalCapacityKg: maxCapacity,
        usedCapacityKg: 0,
        remainingCapacityKg: weight,
        status: "pending",
      });

      await booking.save();

      // Update parent booking's sharedWith array and usedCapacity
      parentBooking.sharedWith.push({
        bookingId: booking._id,
        bookerName: booking.bookerName,
        weight: weight,
        pickup: pickup,
        dropoff: dropoff,
        status: "pending",
      });
      parentBooking.usedCapacityKg = (parentBooking.usedCapacityKg || 0) + weight;
      parentBooking.remainingCapacityKg = maxCapacity - parentBooking.usedCapacityKg - (parentBooking.weight || 0);
      await parentBooking.save();

      return res.status(201).json({
        success: true,
        message: "Shared booking request sent to transport owner",
        data: booking,
        remainingCapacity: parentBooking.remainingCapacityKg,
      });
    }

    // Regular (non-shared) booking
    const booking = new Booking({
      bookedBy,
      bookerName: bookerName || req.body.name,
      bookerPhone: bookerPhone || req.body.phone,
      bookerEmail: bookerEmail || req.body.email,
      driverId,
      driverOwnerId: driver.userId,
      pickup,
      dropoff,
      distance,
      weight,
      vehicleType: vehicleType || driver.vehicleDetails?.vehicleType,
      pickupDate,
      estimatedPrice,
      totalCapacityKg: maxCapacity,
      usedCapacityKg: 0,
      remainingCapacityKg: maxCapacity - (weight || 0),
      status: "pending",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking request sent to transport owner",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating booking", error: error.message });
  }
};

// ========== GET BOOKINGS FOR TRANSPORT OWNER (notifications) ==========
exports.getOwnerBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const drivers = await TransportDriver.find({ userId }).select("_id driverProfile vehicleDetails");
    const driverIds = drivers.map(d => d._id);

    let query = { driverId: { $in: driverIds } };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate("bookedBy", "name email")
      .populate("driverId", "driverProfile vehicleDetails registrationId availabilityDetails")
      .populate("sharedWith.bookingId", "bookerName weight pickup dropoff status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// ========== GET BOOKINGS FOR BOOKER ==========
exports.getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ bookedBy: userId })
      .populate("driverId", "driverProfile vehicleDetails registrationId availabilityDetails")
      .populate("sharedWith.bookingId", "bookerName weight pickup dropoff status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// ========== ACCEPT BOOKING ==========
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // If this is a shared booking, update parent's sharedWith status
    if (booking.isShared && booking.parentBookingId) {
      await Booking.updateOne(
        { _id: booking.parentBookingId, "sharedWith.bookingId": bookingId },
        { $set: { "sharedWith.$.status": "accepted" } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Booking accepted",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error accepting booking", error: error.message });
  }
};

// ========== REJECT BOOKING ==========
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "rejected", rejectionReason: reason } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // If this is a shared booking, update parent's sharedWith status and restore capacity
    if (booking.isShared && booking.parentBookingId) {
      const parent = await Booking.findById(booking.parentBookingId);
      if (parent) {
        parent.usedCapacityKg = Math.max(0, (parent.usedCapacityKg || 0) - (booking.weight || 0));
        parent.remainingCapacityKg = (parent.totalCapacityKg || 0) - (parent.weight || 0) - parent.usedCapacityKg;
        parent.sharedWith = parent.sharedWith.map(s =>
          s.bookingId?.toString() === bookingId ? { ...s.toObject(), status: "rejected" } : s
        );
        await parent.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Booking rejected",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error rejecting booking", error: error.message });
  }
};

// ========== GET BOOKINGS FOR SPECIFIC DRIVER ==========
exports.getDriverBookings = async (req, res) => {
  try {
    const { driverId } = req.params;

    const bookings = await Booking.find({ driverId })
      .populate("bookedBy", "name email")
      .populate("sharedWith.bookingId", "bookerName weight pickup dropoff status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// ========== GET SHARED TRIPS (trips with remaining capacity for shared goods) ==========
exports.getSharedTrips = async (req, res) => {
  try {
    const { fromLocation, toLocation } = req.query;

    // Find accepted primary bookings that have remaining capacity and allow shared goods
    let query = {
      status: "accepted",
      isShared: false, // only primary bookings
    };

    const bookings = await Booking.find(query)
      .populate("driverId", "driverProfile vehicleDetails registrationId availabilityDetails")
      .populate("bookedBy", "name email")
      .populate("sharedWith.bookingId", "bookerName weight pickup dropoff status")
      .sort({ pickupDate: 1 });

    // Filter by remaining capacity > 0
    let availableShared = bookings.filter(b => {
      const maxCap = b.totalCapacityKg || VEHICLE_CAPACITY[b.vehicleType] || 1000;
      const used = (b.weight || 0) + (b.usedCapacityKg || 0);
      return maxCap - used > 0;
    });

    // If route filter provided, check that the driver's availability route matches
    if (fromLocation || toLocation) {
      const driverAvail = await TransportDriver.find({
        "verification.isAvailable": true,
      });

      const matchingDriverIds = driverAvail
        .filter(d => {
          const av = d.availabilityDetails || {};
          const fromMatch = !fromLocation || (av.fromLocation && av.fromLocation.toLowerCase().includes(fromLocation.toLowerCase()));
          const toMatch = !toLocation || (av.toLocation && av.toLocation.toLowerCase().includes(toLocation.toLowerCase()));
          return fromMatch && toMatch;
        })
        .map(d => d._id.toString());

      availableShared = availableShared.filter(b =>
        matchingDriverIds.includes(b.driverId?._id?.toString())
      );
    }

    // Build response with remaining capacity info
    const result = availableShared.map(b => {
      const maxCap = b.totalCapacityKg || VEHICLE_CAPACITY[b.vehicleType] || 1000;
      const used = (b.weight || 0) + (b.usedCapacityKg || 0);
      const remaining = maxCap - used;

      return {
        _id: b._id,
        driverId: b.driverId,
        pickup: b.pickup,
        dropoff: b.dropoff,
        pickupDate: b.pickupDate,
        vehicleType: b.vehicleType,
        totalCapacityKg: maxCap,
        usedCapacityKg: used,
        remainingCapacityKg: remaining,
        primaryBookerName: b.bookerName,
        primaryWeight: b.weight,
        pricePerKg: b.estimatedPrice ? Math.round(b.estimatedPrice / (b.weight || 1)) : 0,
        sharedBookingsCount: b.sharedWith?.length || 0,
        driverName: b.driverId?.driverProfile?.fullName || "Unknown",
        driverPhone: b.driverId?.driverProfile?.mobile || "",
        withDriver: b.driverId?.availabilityDetails?.withDriver !== false,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      total: result.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching shared trips", error: error.message });
  }
};
const Booking = require("../models/Booking");
const TransportDriver = require("../models/TransportDriver");

// ========== CREATE BOOKING REQUEST ==========
exports.createBooking = async (req, res) => {
  try {
    const {
      driverId,
      pickup,
      dropoff,
      distance,
      weight,
      vehicleType,
      pickupDate,
      estimatedPrice,
      bookerName,
      bookerPhone,
      bookerEmail,
    } = req.body;

    const bookedBy = req.body.userId;

    if (!driverId || !bookedBy) {
      return res.status(400).json({ success: false, message: "Driver ID and user ID required" });
    }

    // Get driver to find owner
    const driver = await TransportDriver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Transport not found" });
    }

    if (!driver.verification?.isAvailable) {
      return res.status(400).json({ success: false, message: "This transport is not currently available" });
    }

    const booking = new Booking({
      bookedBy,
      bookerName: bookerName || req.body.name,
      bookerPhone: bookerPhone || req.body.phone,
      bookerEmail: bookerEmail || req.body.email,
      driverId,
      driverOwnerId: driver.userId,
      pickup,
      dropoff,
      distance,
      weight,
      vehicleType,
      pickupDate,
      estimatedPrice,
      status: "pending",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking request sent to transport owner",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating booking", error: error.message });
  }
};

// ========== GET BOOKINGS FOR TRANSPORT OWNER (notifications) ==========
exports.getOwnerBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    // Find all drivers owned by this user
    const drivers = await TransportDriver.find({ userId }).select("_id driverProfile vehicleDetails");
    const driverIds = drivers.map(d => d._id);

    let query = { driverId: { $in: driverIds } };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate("bookedBy", "name email")
      .populate("driverId", "driverProfile vehicleDetails registrationId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// ========== GET BOOKINGS FOR BOOKER (user who booked) ==========
exports.getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ bookedBy: userId })
      .populate("driverId", "driverProfile vehicleDetails registrationId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};

// ========== ACCEPT BOOKING ==========
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking accepted",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error accepting booking", error: error.message });
  }
};

// ========== REJECT BOOKING ==========
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: "rejected", rejectionReason: reason } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking rejected",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error rejecting booking", error: error.message });
  }
};

// ========== GET BOOKINGS FOR SPECIFIC DRIVER ==========
exports.getDriverBookings = async (req, res) => {
  try {
    const { driverId } = req.params;

    const bookings = await Booking.find({ driverId })
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
  }
};
