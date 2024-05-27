const express = require('express');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/myRegistration", {
}).then(() => {
    console.log('Connection Successful');
}).catch((err) => {
    console.error('Connection Error:', err);
});
