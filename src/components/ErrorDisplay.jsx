import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div
      className="w-full bg-red-50 border border-red-200 
        rounded-lg p-6 flex flex-col items-center"
    >
      <AlertCircle size={32} className="text-red-500mb-3" />

      <h3 className="text-lg font-medium text-red-800 mb">
        Something went wrong
      </h3>
      <p className="text-red-600 tex-center mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 
        rounded-md hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;