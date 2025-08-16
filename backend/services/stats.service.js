const rideModel = require('../models/ride.model');

class StatsService {
    // Get rider statistics for today
    static async getRiderTodayStats(riderId) {
        try {
            console.log(`🔍 Getting today's stats for rider: ${riderId}`);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            console.log(`📅 Date range: ${today.toISOString()} to ${tomorrow.toISOString()}`);

            const todayRides = await rideModel.find({
                rider: riderId,
                status: 'completed',
                createdAt: { $gte: today, $lt: tomorrow }
            });

            console.log(`🚗 Found ${todayRides.length} completed rides today for rider ${riderId}`);

            const todayEarnings = todayRides.reduce((total, ride) => total + (ride.riderEarnings || 0), 0);
            const todayDistance = todayRides.reduce((total, ride) => total + (ride.distance || 0), 0);

            console.log(`💰 Today's stats - Rides: ${todayRides.length}, Earnings: ${todayEarnings}, Distance: ${todayDistance}`);

            return {
                rides: todayRides.length,
                earnings: todayEarnings,
                distance: todayDistance
            };
        } catch (error) {
            console.error('Error getting today stats:', error);
            throw error;
        }
    }

    // Get rider statistics for all time
    static async getRiderAllTimeStats(riderId) {
        try {
            console.log(`🔍 Getting all-time stats for rider: ${riderId}`);

            const allRides = await rideModel.find({
                rider: riderId,
                status: 'completed'
            });

            console.log(`🚗 Found ${allRides.length} total completed rides for rider ${riderId}`);

            const totalRides = allRides.length;
            const totalEarnings = allRides.reduce((total, ride) => total + (ride.riderEarnings || 0), 0);
            const totalDistance = allRides.reduce((total, ride) => total + (ride.distance || 0), 0);

            console.log(`💰 All-time stats - Rides: ${totalRides}, Earnings: ${totalEarnings}, Distance: ${totalDistance}`);

            return {
                rides: totalRides,
                earnings: totalEarnings,
                distance: totalDistance
            };
        } catch (error) {
            console.error('Error getting all time stats:', error);
            throw error;
        }
    }

    // Get rider statistics for a specific date range
    static async getRiderStatsByDateRange(riderId, startDate, endDate) {
        try {
            const rides = await rideModel.find({
                rider: riderId,
                status: 'completed',
                createdAt: { $gte: startDate, $lte: endDate }
            });

            const totalRides = rides.length;
            const totalEarnings = rides.reduce((total, ride) => total + (ride.riderEarnings || 0), 0);
            const totalDistance = rides.reduce((total, ride) => total + (ride.distance || 0), 0);

            return {
                rides: totalRides,
                earnings: totalEarnings,
                distance: totalDistance
            };
        } catch (error) {
            console.error('Error getting stats by date range:', error);
            throw error;
        }
    }

    // Get rider performance trends (last 7 days)
    static async getRiderTrends(riderId) {
        try {
            const trends = [];
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                date.setHours(0, 0, 0, 0);

                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const dayStats = await this.getRiderStatsByDateRange(riderId, date, nextDate);

                trends.push({
                    date: date.toISOString().split('T')[0],
                    rides: dayStats.rides,
                    earnings: dayStats.earnings,
                    distance: dayStats.distance
                });
            }

            return trends;
        } catch (error) {
            console.error('Error getting rider trends:', error);
            throw error;
        }
    }

    // Update ride with completion data
    static async completeRide(rideId, distance, duration) {
        try {
            console.log(`🏁 Completing ride: ${rideId} with distance: ${distance}km, duration: ${duration}min`);

            const ride = await rideModel.findById(rideId);
            if (!ride) {
                throw new Error('Ride not found');
            }

            console.log(`📊 Original ride data:`, {
                status: ride.status,
                fare: ride.fare,
                rider: ride.rider,
                user: ride.user
            });

            // Calculate rider earnings (80% of fare)
            const riderEarnings = Math.round(ride.fare * 0.8);

            const updatedRide = await rideModel.findByIdAndUpdate(rideId, {
                status: 'completed',
                distance,
                duration,
                riderEarnings,
                completedAt: new Date()
            }, { new: true });

            console.log(`✅ Ride completed successfully:`, {
                rideId: updatedRide._id,
                status: updatedRide.status,
                distance: updatedRide.distance,
                duration: updatedRide.duration,
                riderEarnings: updatedRide.riderEarnings,
                completedAt: updatedRide.completedAt
            });

            return updatedRide;
        } catch (error) {
            console.error('Error completing ride:', error);
            throw error;
        }
    }
}

module.exports = StatsService;
