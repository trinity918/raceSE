// Utility functions can be added here
const formatResponse = (data, success = true) => {
    return {
      success,
      data
    };
  };
  
  const errorHandler = (error) => {
    return {
      success: false,
      error: {
        message: error.message || 'Server error',
        code: error.code || 500
      }
    };
  };
  
  module.exports = {
    formatResponse,
    errorHandler
  };