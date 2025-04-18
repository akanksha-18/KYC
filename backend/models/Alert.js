class Alert {
    constructor() {
      this.alerts = [];
    }
  
    getAllAlerts() {
      return this.alerts;
    }
  
    createAlert(alertData) {
      const newAlert = {
        id: this.alerts.length + 1,
        timestamp: new Date().toISOString(),
        ...alertData
      };
      
      this.alerts.push(newAlert);
      return newAlert;
    }
  
    getAlertsByCustomerId(customerId) {
      return this.alerts.filter(alert => alert.customerId === customerId);
    }
  }
  
  module.exports = new Alert();