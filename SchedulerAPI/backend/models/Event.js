const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        text: String,
        dateTime: {
            type: Date,
            default: () => {
                const currentTime = new Date();
                currentTime.setMinutes(currentTime.getMinutes() + 1);
                return currentTime;
            }
        }
    }
)

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;