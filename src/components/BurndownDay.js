import React from "react";
import PropTypes from "prop-types";

const BurndownDay = ({ date }) => <div title={date} />;

BurndownDay.propTypes = {
  date: PropTypes.string.isRequired,
};

export default BurndownDay;
