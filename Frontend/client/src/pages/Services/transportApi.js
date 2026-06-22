import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/transport"
});

export default API;

export const registerDriver = async (data) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
    const userId = user?._id || adminUser?._id || null;
    return API.post("/register", { ...data, userId });
};

export const getMyRegistrations = async (userId) => {
    return API.get(`/my-registrations/${userId}`);
};

export const getAvailableTransports = async (fromLocation, toLocation) => {
    return API.get(`/available${fromLocation && toLocation ? `?fromLocation=${fromLocation}&toLocation=${toLocation}` : ''}`);
};

// ===== BOOKING API =====
const BOOKING_API = axios.create({
    baseURL: "http://localhost:5000/api/booking"
});

export const createBooking = async (data) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return BOOKING_API.post("/create", { ...data, userId: user?._id });
};

export const getOwnerBookings = async (userId, status) => {
    return BOOKING_API.get(`/owner/${userId}${status ? `?status=${status}` : ''}`);
};

export const getDriverBookings = async (driverId) => {
    return BOOKING_API.get(`/driver/${driverId}`);
};

export const getMyBookings = async (userId) => {
    return BOOKING_API.get(`/my/${userId}`);
};

export const acceptBooking = async (bookingId) => {
    return BOOKING_API.put(`/accept/${bookingId}`);
};

export const rejectBooking = async (bookingId, reason) => {
    return BOOKING_API.put(`/reject/${bookingId}`, { reason });
};

export const getSharedTrips = async (fromLocation, toLocation) => {
    const params = new URLSearchParams();
    if (fromLocation) params.append('fromLocation', fromLocation);
    if (toLocation) params.append('toLocation', toLocation);
    return BOOKING_API.get(`/shared-trips${params.toString() ? `?${params.toString()}` : ''}`);
};

export const createSharedBooking = async (data) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return BOOKING_API.post("/create", { ...data, userId: user?._id, isShared: true });
};
