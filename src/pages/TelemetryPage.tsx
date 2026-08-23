import React from 'react';
import { ProgressAnalytics } from '../components/ProgressAnalytics';

export const TelemetryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ProgressAnalytics />
    </div>
  );
};

export default TelemetryPage;
