import React from "react";

interface BurndownDayProps {
  date: string;
}

const BurndownDay: React.FC<BurndownDayProps> = ({ date }) => (
  <div title={date} />
);

export default BurndownDay;
