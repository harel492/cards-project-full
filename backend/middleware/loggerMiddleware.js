const fs = require('fs');
const path = require('path');


const fileLogger = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Only log errors, not successful responses
    if (res.statusCode >= 400) {
      try {
        logErrorToFile(req, res, data);
      } catch (logError) {
        console.error('Error in logger middleware:', logError);
      }
    }

    // Call the original json method
    return originalJson.call(this, data);
  };

  next();
};


const logErrorToFile = (req, res, responseData) => {
  try {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; 
    const timestamp = now.toISOString();
    
    const logEntry = {
      timestamp,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress,
      error: responseData?.error || 'Unknown error',
      requestBody: req.body ? JSON.stringify(req.body) : null
    };

    const logString = `[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Error: ${logEntry.error}\n`;

    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

   
    const logFileName = `${dateString}.log`;
    const logFilePath = path.join(logsDir, logFileName);

  
    fs.appendFileSync(logFilePath, logString);


    const detailedLogFileName = `${dateString}-detailed.json`;
    const detailedLogFilePath = path.join(logsDir, detailedLogFileName);

    let existingLogs = [];
    if (fs.existsSync(detailedLogFilePath)) {
      try {
        const fileContent = fs.readFileSync(detailedLogFilePath, 'utf8');
        existingLogs = JSON.parse(fileContent);
      } catch (error) {
   
        existingLogs = [];
      }
    }

    existingLogs.push(logEntry);
    fs.writeFileSync(detailedLogFilePath, JSON.stringify(existingLogs, null, 2));

  } catch (error) {
    console.error('Error writing to log file:', error);
  }
};

module.exports = {
  fileLogger
};