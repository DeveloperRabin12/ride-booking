const { sendMessageToSocketId } = require('./socket');

// Test function to send a notification
function testNotification(socketId, message) {
    console.log('Testing notification system...');
    
    const result = sendMessageToSocketId(socketId, {
        event: 'test-notification',
        data: { message, timestamp: new Date().toISOString() }
    });
    
    if (result) {
        console.log('✅ Test notification sent successfully');
    } else {
        console.log('❌ Test notification failed');
    }
}

// Export for use in other files
module.exports = { testNotification };

// If run directly, show usage
if (require.main === module) {
    console.log('Notification test script');
    console.log('Usage: require this module and call testNotification(socketId, message)');
}
