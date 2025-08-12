# Testing the Rider Notification System

## Prerequisites

1. **Backend is running on port 4000**
2. **Frontend is running on port 5173 (Vite default)**
3. **MongoDB is running and connected**

## Step-by-Step Testing Guide

### 1. **Start the Backend**

```bash
cd backend
npm start
```

**Expected output**: `Server is running on port 4000`

### 2. **Start the Frontend**

```bash
cd Frontend
npm run dev
```

**Expected output**: Vite dev server running on localhost:5173

### 3. **Test Backend API (Optional)**

```bash
cd backend
node test-rider-api.js
```

This will test all rider API endpoints and show if they're working correctly.

### 4. **Test Rider Registration and Login**

#### **Step 4a: Access Rider Registration**

1. Open browser and go to `http://localhost:5173`
2. Click **"Become a Rider"** button
3. Fill in the registration form:
   - First Name: `Test`
   - Last Name: `Rider`
   - Email: `testrider@example.com`
   - Password: `password123`
   - Vehicle Color: `Red`
   - Vehicle Plate: `TEST123`
   - Vehicle Type: `Car`
4. Click **"Register"**

**Expected result**: Redirected to rider login page

#### **Step 4b: Login as Rider**

1. On the rider login page, enter:
   - Email: `testrider@example.com`
   - Password: `password123`
2. Click **"Log In"**

**Expected result**: Redirected to `/riderHome` with rider dashboard

### 5. **Verify Rider Connection**

#### **Step 5a: Check Browser Console**

Open browser console (F12) and look for:

```
✅ Connected to server with socket ID: [socket-id]
RiderHome - Current rider data: [rider-object]
RiderHome - Socket connected: true
```

#### **Step 5b: Check Connection Status**

On the rider home page, look for:

- **🟢 Connected** indicator in top-right corner
- **📍 Location sent: [lat], [lng]** messages in console

#### **Step 5c: Check Backend Console**

Look for these messages:

```
Rider [id] joining as rider with socket [socket-id]
Rider [id] socket ID updated to [socket-id] and status set to active
Rider [id] location updated: [lat], [lng]
```

### 6. **Test Notifications**

#### **Step 6a: Create a Ride Request**

1. Open a new browser tab
2. Go to `http://localhost:5173`
3. Click **"Start as Passenger"**
4. Login/register as a user
5. Go to home page and create a ride request:
   - Enter pickup location (e.g., "New York")
   - Enter destination (e.g., "Brooklyn")
   - Select vehicle type (car or bike)
   - Click create ride

#### **Step 6b: Check Rider Notification**

1. Go back to the rider tab
2. Look for:
   - **"New ride received"** message in console
   - Ride popup appearing at bottom of screen
   - Backend console showing:
     ```
     Searching for riders within 5km of [lat], [lng]
     Found [count] active riders in radius
     Sending notification to rider [id] at socket [socket-id]
     ```

### 7. **Test Ride Confirmation**

#### **Step 7a: Accept Ride**

1. On the rider's ride popup, click **"Accept Ride"**
2. Check backend console for confirmation

#### **Step 7b: Verify User Notification**

1. Go back to user tab
2. Look for ride confirmation message

## Troubleshooting

### **If Rider Can't Connect:**

1. Check if backend is running on port 4000
2. Check browser console for connection errors
3. Verify MongoDB connection
4. Check if rider has valid location coordinates

### **If Notifications Don't Work:**

1. Verify rider status is 'active' in database
2. Check if rider has valid socketId
3. Verify rider location is within search radius
4. Check backend logs for errors

### **If Location Updates Fail:**

1. Ensure browser has location permissions
2. Check if navigator.geolocation is available
3. Verify location update interval (should be 10 seconds)

### **Common Error Messages:**

- **"Socket.io is not initialized"**: Backend socket not running
- **"No riders found in radius"**: Increase search radius or check rider locations
- **"Rider has no socket ID"**: Rider not properly connected to socket

## Expected Console Output

### **Frontend Console (Rider):**

```
✅ Connected to server with socket ID: abc123
RiderHome - Current rider data: {_id: "123", fullname: {...}, ...}
RiderHome - Socket connected: true
📍 Location sent: 40.7128, -74.0060
New ride received: {_id: "456", pickup: "New York", ...}
```

### **Backend Console:**

```
Client connected: abc123
User 123 joining as rider with socket abc123
Rider 123 socket ID updated to abc123 and status set to active
Rider 123 location updated: 40.7128, -74.0060
Searching for riders within 5km of (40.7128, -74.0060)
Found 1 active riders in radius
Sending notification to rider 123 at socket abc123
```

## Success Criteria

✅ Rider can register and login  
✅ Rider connects to socket successfully  
✅ Rider location updates every 10 seconds  
✅ Rider receives ride notifications  
✅ Rider can accept rides  
✅ User receives ride confirmation  
✅ All backend logs show successful operations

If all these criteria are met, the rider notification system is working correctly!
