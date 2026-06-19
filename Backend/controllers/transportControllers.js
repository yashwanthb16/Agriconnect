const TransportDriver = require("../models/TransportDriver");
const path = require("path");
const fs = require("fs");
const twilio = require("twilio");

const cleanObject = (obj) => {
  if (Array.isArray(obj)) {
    const cleaned = obj
      .map(cleanObject)
      .filter((item) => item !== undefined && item !== null && item !== "" && !(typeof item === 'object' && Object.keys(item).length === 0));
    return cleaned.length ? cleaned : undefined;
  }

  if (obj && typeof obj === "object") {
    const cleaned = Object.entries(obj).reduce((acc, [key, value]) => {
      const item = cleanObject(value);
      if (item !== undefined && item !== null && item !== "") {
        if (typeof item === 'object' && Object.keys(item).length === 0) return acc;
        acc[key] = item;
      }
      return acc;
    }, {});
    return Object.keys(cleaned).length ? cleaned : undefined;
  }

  return obj;
};

const normalizeMobileNumber = (mobile) => {
  const trimmedMobile = (mobile || '').trim();
  const digitsOnly = trimmedMobile.replace(/\D/g, '');

  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }

  if (/^\+\d{8,15}$/.test(trimmedMobile)) {
    return trimmedMobile;
  }

  if (/^\d{8,15}$/.test(digitsOnly)) {
    return `+${digitsOnly}`;
  }

  return null;
};

const normalizeDriverPayload = ({ driverProfile = {}, vehicleDetails = {}, bankDetails = {}, declaration = {}, verification = {} }) => {
  const {
    licenseNumber,
    licenseIssuingRTO,
    licenseIssueDate,
    licenseExpiryDate,
    licenseClass,
    drivingExperienceYears,
    criminalHistory,
    criminalDetails,
    medicalFitnessCertificateDate,
    medicalFitnessUpload,
    profilePhoto,
    ...restDriverProfile
  } = driverProfile;

  const normalizedDriverProfile = cleanObject({
    ...restDriverProfile,
    profilePhoto: profilePhoto || restDriverProfile.profilePhoto,
  });

  const normalizedLicenseDetails = cleanObject({
    licenseNumber,
    licenseIssuingRTO,
    licenseIssueDate,
    licenseExpiryDate,
    licenseClass,
    drivingExperienceYears,
  });

  const normalizedDeclaration = cleanObject({
    criminalHistory: criminalHistory ?? declaration.criminalHistory ?? false,
    criminalDetails: criminalDetails ?? declaration.criminalDetails,
    medicalFitnessCertificateDate: medicalFitnessCertificateDate ?? declaration.medicalFitnessCertificateDate,
    medicalFitnessUpload: medicalFitnessUpload ?? declaration.medicalFitnessUpload,
  });

  const normalizedVehicleDetails = cleanObject({
    vehicleType: vehicleDetails.vehicleType,
    make: vehicleDetails.make,
    model: vehicleDetails.model,
    yearOfManufacture: vehicleDetails.yearOfManufacture,
    color: vehicleDetails.color,
    seatingCapacity: vehicleDetails.seatingCapacity,
    fuelType: vehicleDetails.fuelType,
    registrationNumber: vehicleDetails.registrationNumber,
    vinChassis: vehicleDetails.vinChassis,
  });

  const normalizedVehicleDocumentation = cleanObject({
    rcNumber: vehicleDetails.rcNumber,
    rcIssueDate: vehicleDetails.rcIssueDate,
    rcIssuingRTO: vehicleDetails.rcIssuingRTO,
    insurancePolicyNumber: vehicleDetails.insurancePolicyNumber,
    insuranceExpiryDate: vehicleDetails.insuranceExpiryDate,
    pucCertificateNumber: vehicleDetails.pucCertificateNumber,
    pucExpiryDate: vehicleDetails.pucExpiryDate,
    certificateOfFitnessNumber: vehicleDetails.certificateOfFitnessNumber,
    certificateOfFitnessExpiry: vehicleDetails.certificateOfFitnessExpiry,
    permitNumber: vehicleDetails.permitNumber,
    permitType: vehicleDetails.permitType,
    permitExpiryDate: vehicleDetails.permitExpiryDate,
    taxTokenPaid: vehicleDetails.taxTokenPaid,
    noUnpaidFines: vehicleDetails.noUnpaidFines,
  });

  const normalizedVerification = cleanObject({
    mobileVerified: verification.mobileVerified,
    emailVerified: verification.emailVerified,
    documentsVerified: verification.documentsVerified,
    adminApproved: verification.adminApproved,
    isAvailable: verification.isAvailable,
  });

  return {
    driverProfile: normalizedDriverProfile || {},
    licenseDetails: normalizedLicenseDetails || {},
    declaration: normalizedDeclaration || {},
    vehicleDetails: normalizedVehicleDetails || {},
    vehicleDocumentation: normalizedVehicleDocumentation || {},
    bankDetails: cleanObject(bankDetails) || {},
    verification: normalizedVerification || {},
  };
};

// ========== CREATE/REGISTER TRANSPORT DRIVER ==========
exports.registerTransportDriver = async (req, res) => {
  try {
    const { driverProfile = {}, vehicleDetails = {}, bankDetails = {}, declaration = {}, verification = {}, userId } = req.body;
    const normalized = normalizeDriverPayload({
      driverProfile,
      vehicleDetails,
      bankDetails,
      declaration,
      verification,
    });

    // If userId is provided, check if this user already has a registration
    if (userId) {
      const existingByUser = await TransportDriver.findOne({ userId });
      if (existingByUser) {
        // Update existing registration
        const updatedDriver = await TransportDriver.findByIdAndUpdate(
          existingByUser._id,
          {
            $set: {
              driverProfile: {
                ...(existingByUser.driverProfile?.toObject ? existingByUser.driverProfile.toObject() : existingByUser.driverProfile),
                ...normalized.driverProfile,
              },
              licenseDetails: {
                ...(existingByUser.licenseDetails?.toObject ? existingByUser.licenseDetails.toObject() : existingByUser.licenseDetails),
                ...normalized.licenseDetails,
              },
              declaration: {
                ...(existingByUser.declaration?.toObject ? existingByUser.declaration.toObject() : existingByUser.declaration),
                ...normalized.declaration,
              },
              vehicleDetails: {
                ...(existingByUser.vehicleDetails?.toObject ? existingByUser.vehicleDetails.toObject() : existingByUser.vehicleDetails),
                ...normalized.vehicleDetails,
              },
              vehicleDocumentation: {
                ...(existingByUser.vehicleDocumentation?.toObject ? existingByUser.vehicleDocumentation.toObject() : existingByUser.vehicleDocumentation),
                ...normalized.vehicleDocumentation,
              },
              bankDetails: {
                ...(existingByUser.bankDetails?.toObject ? existingByUser.bankDetails.toObject() : existingByUser.bankDetails),
                ...normalized.bankDetails,
              },
            },
          },
          { new: true, runValidators: false }
        );

        return res.status(200).json({
          success: true,
          message: "Updated existing registration",
          data: updatedDriver,
        });
      }
    }

    // Check if driver already exists by email or mobile (for non-logged-in users)
    const searchConditions = [];
    if (normalized.driverProfile.email) searchConditions.push({ "driverProfile.email": normalized.driverProfile.email });
    if (normalized.driverProfile.mobile) searchConditions.push({ "driverProfile.mobile": normalized.driverProfile.mobile });

    const existingDriver = searchConditions.length
      ? await TransportDriver.findOne({ $or: searchConditions })
      : null;

    if (existingDriver) {
      if (existingDriver.status === "draft") {
        const updatedDriver = await TransportDriver.findByIdAndUpdate(
          existingDriver._id,
          {
            $set: {
              userId: userId || existingDriver.userId, // Add userId if provided
              driverProfile: {
                ...(existingDriver.driverProfile?.toObject ? existingDriver.driverProfile.toObject() : existingDriver.driverProfile),
                ...normalized.driverProfile,
              },
              licenseDetails: {
                ...(existingDriver.licenseDetails?.toObject ? existingDriver.licenseDetails.toObject() : existingDriver.licenseDetails),
                ...normalized.licenseDetails,
              },
              declaration: {
                ...(existingDriver.declaration?.toObject ? existingDriver.declaration.toObject() : existingDriver.declaration),
                ...normalized.declaration,
              },
              vehicleDetails: {
                ...(existingDriver.vehicleDetails?.toObject ? existingDriver.vehicleDetails.toObject() : existingDriver.vehicleDetails),
                ...normalized.vehicleDetails,
              },
              vehicleDocumentation: {
                ...(existingDriver.vehicleDocumentation?.toObject ? existingDriver.vehicleDocumentation.toObject() : existingDriver.vehicleDocumentation),
                ...normalized.vehicleDocumentation,
              },
              bankDetails: {
                ...(existingDriver.bankDetails?.toObject ? existingDriver.bankDetails.toObject() : existingDriver.bankDetails),
                ...normalized.bankDetails,
              },
            },
          },
          { new: true, runValidators: false }
        );

        return res.status(200).json({
          success: true,
          message: "Existing draft found",
          data: updatedDriver,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Driver with this email or mobile already registered",
      });
    }

    // Create new driver registration
    const driver = new TransportDriver({
      userId: userId || null, // Link to user if logged in
      driverProfile: normalized.driverProfile,
      licenseDetails: normalized.licenseDetails,
      declaration: normalized.declaration,
      vehicleDetails: normalized.vehicleDetails,
      vehicleDocumentation: normalized.vehicleDocumentation,
      bankDetails: normalized.bankDetails,
      verification: normalized.verification,
      status: "draft",
    });

    // Save as draft without running full schema validation so users can progressively fill the form
    await driver.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Transport driver registration created",
      data: driver,
    });
  } catch (error) {
    console.error("Driver registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating driver registration",
      error: error.message,
    });
  }
};

// ========== GET DRIVER REGISTRATION BY ID ==========
exports.getDriverRegistration = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await TransportDriver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching driver registration",
      error: error.message,
    });
  }
};

// ========== UPDATE DRIVER REGISTRATION ==========
exports.updateDriverRegistration = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { driverProfile, vehicleDetails, bankDetails, declaration, verification, availabilityDetails } = req.body;
    const normalized = normalizeDriverPayload({
      driverProfile,
      vehicleDetails,
      bankDetails,
      declaration,
      verification,
    });

    const existingDriver = await TransportDriver.findById(driverId);

    if (!existingDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    const updateData = {
      driverProfile: normalized.driverProfile,
      licenseDetails: normalized.licenseDetails,
      vehicleDetails: normalized.vehicleDetails,
      vehicleDocumentation: normalized.vehicleDocumentation,
      bankDetails: normalized.bankDetails,
      declaration: normalized.declaration,
      verification: {
        ...(existingDriver.verification || {}),
        ...normalized.verification,
      },
    };

    // Add availabilityDetails if provided
    if (availabilityDetails) {
      updateData.availabilityDetails = availabilityDetails;
    }

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver registration updated",
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating driver registration",
      error: error.message,
    });
  }
};

// ========== UPDATE VEHICLE DOCUMENTATION ==========
exports.updateVehicleDocumentation = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { vehicleDocumentation } = req.body;

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      { $set: { vehicleDocumentation } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle documentation updated",
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating vehicle documentation",
      error: error.message,
    });
  }
};

// ========== UPLOAD FILE ==========
exports.uploadFile = async (req, res) => {
  try {
    const { driverId, fileType } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only PDF, JPEG, and PNG allowed",
      });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    // Update driver document
    const fileUrl = `/uploads/${req.file.filename}`;
    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      { $set: { [`documents.${fileType}`]: fileUrl } },
      { new: true }
    );

    if (!driver) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      data: driver,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

// ========== VERIFY MOBILE OTP ==========
exports.verifyMobileOtp = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { otp } = req.body;

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      });
    }

    const driver = await TransportDriver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    const allowAnyOtp = process.env.ALLOW_ANY_OTP === 'true' || process.env.NODE_ENV !== 'production';
    const storedOtp = driver.verification?.mobileOtp;

    let isOtpValid = false;

    if (accountSid && authToken && verifyServiceSid) {
      const client = twilio(accountSid, authToken);
      const toNumber = normalizeMobileNumber(driver.driverProfile.mobile);
      if (!toNumber) {
        return res.status(400).json({ success: false, message: 'Invalid stored mobile number' });
      }

      const verification = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
        to: toNumber,
        code: otp,
      });

      isOtpValid = verification.status === 'approved';
    } else {
      isOtpValid = (storedOtp && storedOtp === String(otp)) || allowAnyOtp;
    }

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    const updatedDriver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          "verification.mobileVerified": true,
          "verification.mobileOtp": null,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Mobile verified successfully",
      data: updatedDriver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying mobile OTP",
      error: error.message,
    });
  }
};

// ========== SEND MOBILE OTP ==========
exports.sendMobileOtp = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { mobile } = req.body;
    const trimmedMobile = (mobile || '').trim();
    const digitsOnly = trimmedMobile.replace(/\D/g, '');
    let toNumber = '';

    if (/^[6-9]\d{9}$/.test(digitsOnly)) {
      toNumber = `+91${digitsOnly}`;
    } else if (/^\+\d{8,15}$/.test(trimmedMobile)) {
      toNumber = trimmedMobile;
    } else if (/^\d{8,15}$/.test(digitsOnly)) {
      toNumber = `+${digitsOnly}`;
    }

    if (!toNumber) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

    if (client && verifyServiceSid) {
      await client.verify.v2.services(verifyServiceSid).verifications.create({
        to: toNumber,
        channel: 'sms',
      });
    } else if (client && fromNumber) {
      await client.messages.create({
        body: `Your verification code is ${otp}`,
        from: fromNumber,
        to: toNumber,
      });
    } else {
      console.log(`Demo mobile OTP for ${toNumber}: ${otp}`);
    }

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          'verification.mobileOtp': otp,
          'driverProfile.mobile': digitsOnly,
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({
      success: true,
      message: client || verifyServiceSid || fromNumber ? 'OTP sent to mobile' : 'Demo OTP generated for mobile',
      otpSent: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

// ========== SEND EMAIL OTP (demo) ==========
exports.sendEmailOtp = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      { $set: { 'verification.emailOtp': otp, 'driverProfile.email': email } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    console.log(`Demo OTP for email ${email}: ${otp}`);

    res.status(200).json({ 
      success: true, 
      message: 'Email OTP sent (demo). Use any 6-digit code temporarily if mail is delayed.', 
      otpSent: true,
      demoOtp: otp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending email OTP', error: error.message });
  }
};

// ========== VERIFY EMAIL OTP ==========
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { otp } = req.body;

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      });
    }

    const driver = await TransportDriver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    const allowAnyOtp = process.env.ALLOW_ANY_OTP === 'true' || process.env.NODE_ENV !== 'production';
    const storedOtp = driver.verification?.emailOtp;
    const isOtpValid =
      /^\d{6}$/.test(String(otp)) &&
      (
        allowAnyOtp ||
        !storedOtp ||
        storedOtp === String(otp)
      );

    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }

    const updatedDriver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          "verification.emailVerified": true,
          "verification.emailOtp": null,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: updatedDriver,
    });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({ success: false, message: 'Error verifying email OTP', error: error.message });
  }
};

// ========== SUBMIT DRIVER REGISTRATION ==========
exports.submitDriverRegistration = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await TransportDriver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    // Check if all required verifications are done
    if (!driver.verification.mobileVerified || !driver.verification.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Mobile and email verification required",
      });
    }

    // Generate registration ID
    const registrationId =
      "DRV-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase();

    // Update driver status
    const updatedDriver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          registrationId,
          status: "submitted",
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Driver registration submitted successfully",
      registrationId,
      data: updatedDriver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting driver registration",
      error: error.message,
    });
  }
};

// ========== GET ALL DRIVERS (ADMIN) ==========
exports.getAllDrivers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const drivers = await TransportDriver.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await TransportDriver.countDocuments(query);

    res.status(200).json({
      success: true,
      data: drivers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drivers",
      error: error.message,
    });
  }
};

// ========== GET AVAILABLE TRANSPORTS (for booking page) ==========
exports.getAvailableTransports = async (req, res) => {
  try {
    const { fromLocation, toLocation } = req.query;

    let query = {
      status: "approved",
      "verification.isAvailable": true,
    };

    // Optional: filter by route if provided
    if (fromLocation && toLocation) {
      query.$or = [
        { "availabilityDetails.fromLocation": { $regex: fromLocation, $options: "i" } },
        { "availabilityDetails.toLocation": { $regex: toLocation, $options: "i" } },
      ];
    }

    const transports = await TransportDriver.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transports,
      total: transports.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching available transports",
      error: error.message,
    });
  }
};

// ========== GET USER'S OWN REGISTRATIONS ==========
exports.getMyRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const registrations = await TransportDriver.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: registrations,
      total: registrations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching registrations",
      error: error.message,
    });
  }
};

// ========== APPROVE DRIVER REGISTRATION (ADMIN) ==========
exports.approveDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          status: "approved",
          "verification.adminApproved": true,
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver approved successfully",
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving driver",
      error: error.message,
    });
  }
};

// ========== REJECT DRIVER REGISTRATION (ADMIN) ==========
exports.rejectDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { reason } = req.body;

    const driver = await TransportDriver.findByIdAndUpdate(
      driverId,
      {
        $set: {
          status: "rejected",
          rejectionReason: reason,
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver rejected",
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting driver",
      error: error.message,
    });
  }
};
