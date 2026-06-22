const mongoose = require("mongoose");

const transportDriverSchema = new mongoose.Schema(
  {
    // ===== USER REFERENCE =====
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ===== DRIVER PROFILE =====
    driverProfile: {
      fullName: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      mobile: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
      permanentAddress: {
        type: String,
        required: true,
      },
      currentAddress: {
        type: String,
        required: true,
      },
      nationalId: {
        type: String,
        required: true,
      },
      nationalIdType: {
        type: String,
        enum: ["aadhaar", "pan"],
        default: "aadhaar",
      },
      profilePhoto: {
        type: String, // URL to uploaded file
      },
    },

    // ===== LICENSE DETAILS =====
    licenseDetails: {
      licenseNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
      },
      licenseIssuingRTO: {
        type: String,
        required: true,
      },
      licenseIssueDate: {
        type: Date,
        required: true,
      },
      licenseExpiryDate: {
        type: Date,
        required: true,
      },
      licenseClass: {
        type: String,
        required: true,
      },
      drivingExperienceYears: {
        type: Number,
        required: true,
      },
    },

    // ===== DECLARATION =====
    declaration: {
      criminalHistory: {
        type: Boolean,
        default: false,
      },
      criminalDetails: {
        type: String,
      },
      medicalFitnessCertificateDate: {
        type: Date,
      },
      medicalFitnessUpload: {
        type: String, // URL to uploaded file
      },
    },

    // ===== VEHICLE DETAILS =====
    vehicleDetails: {
      vehicleType: {
        type: String,
        enum: ["auto", "taxi", "truck", "bus", "van"],
        required: true,
      },
      make: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      yearOfManufacture: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      seatingCapacity: {
        type: Number,
        required: true,
      },
      fuelType: {
        type: String,
        enum: ["petrol", "diesel", "cng", "electric", "hybrid"],
        required: true,
      },
      registrationNumber: {
        type: String,
        required: true,
        unique: true,
      },
      vinChassis: {
        type: String,
        required: true,
      },
    },

    // ===== VEHICLE DOCUMENTATION =====
    vehicleDocumentation: {
      rcNumber: {
        type: String,
        required: true,
      },
      rcIssueDate: {
        type: Date,
        required: true,
      },
      rcIssuingRTO: {
        type: String,
        required: true,
      },
      insurancePolicyNumber: {
        type: String,
        required: true,
      },
      insuranceExpiryDate: {
        type: Date,
        required: true,
      },
      pucCertificateNumber: {
        type: String,
        required: true,
      },
      pucExpiryDate: {
        type: Date,
        required: true,
      },
      certificateOfFitnessNumber: {
        type: String,
      },
      certificateOfFitnessExpiry: {
        type: Date,
      },
      permitNumber: {
        type: String,
      },
      permitType: {
        type: String,
      },
      permitExpiryDate: {
        type: Date,
      },
      taxTokenPaid: {
        type: Boolean,
        default: false,
      },
      noUnpaidFines: {
        type: Boolean,
        default: false,
      },
    },

    // ===== UPLOADED DOCUMENTS =====
    documents: {
      driverLicenseFront: {
        type: String,
      },
      driverLicenseBack: {
        type: String,
      },
      identityProof: {
        type: String,
      },
      profilePhoto: {
        type: String,
      },
      vehicleRC: {
        type: String,
      },
      insuranceCertificate: {
        type: String,
      },
      pucCertificate: {
        type: String,
      },
      fitnessCertificate: {
        type: String,
      },
      permitCertificate: {
        type: String,
      },
      medicalFitness: {
        type: String,
      },
    },

    // ===== BANK DETAILS =====
    bankDetails: {
      accountHolderName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
    },

    // ===== VERIFICATION STATUS =====
    verification: {
      mobileOtp: {
        type: String,
        default: null,
      },
      emailOtp: {
        type: String,
        default: null,
      },
      mobileVerified: {
        type: Boolean,
        default: false,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      documentsVerified: {
        type: Boolean,
        default: false,
      },
      adminApproved: {
        type: Boolean,
        default: false,
      },
      isAvailable: {
        type: Boolean,
        default: false,
      },
    },

    // ===== AVAILABILITY DETAILS =====
    availabilityDetails: {
      fromLocation: String,
      toLocation: String,
      currentLocation: String,
      availableFromDate: Date,
      availableToDate: Date,
      pricePerKm: Number,
      notes: String,
      withDriver: {
        type: Boolean,
        default: true, // true = with driver, false = without driver (self-drive)
      },
      maxCapacityKg: Number,
      allowSharedGoods: {
        type: Boolean,
        default: true, // allow sharing remaining capacity with other users
      },
    },

    // ===== STATUS & REGISTRATION ID =====
    registrationId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },
    rejectionReason: {
      type: String,
    },

    // ===== TRIPS & EARNINGS =====
    totalTrips: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    trips: [
      {
        pickup: String,
        dropoff: String,
        date: Date,
        amount: Number,
        status: {
          type: String,
          enum: ["completed", "cancelled", "ongoing"],
          default: "completed",
        },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // ===== TIMESTAMPS =====
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TransportDriver", transportDriverSchema);
