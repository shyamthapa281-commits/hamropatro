import React from 'react';
import { DailyMotivation, DailyMotivationProps } from './DailyMotivation';

export type DailyMotivationCardProps = DailyMotivationProps;

export const DailyMotivationCard: React.FC<DailyMotivationCardProps> = (props) => {
  return <DailyMotivation {...props} />;
};

export default DailyMotivationCard;
