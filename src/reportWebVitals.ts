// Simplified performance reporting
type ReportCallback = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Implement custom performance metrics here if needed
    console.log('Performance metrics callback:', onPerfEntry);
  }
};

export default reportWebVitals;