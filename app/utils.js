import Constants from './constants'
import moment from 'moment'

export default {
  /**
   * Returns the number of days between start and end date
   * @param {*} startDate moment format
   * @param {*} endDate moment format
   */
  getNumberOfDays(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), 'days') + 1;
  },

  /**
   * Adds numberOfDays to a date and returns the formatted date
   * @param {*} date that needs to be incremented
   * @param {*} format in moment string format
   * @param {*} numberOfDays in number format
   */
  addDays(date, format, numberOfDays) {
    return moment(date, format).add(numberOfDays, 'days');
  },

  /**
   * Returns difference between shiftTime and currentDate
   * @param {*} shiftTime moment format
   * @param {*} currentDate YYYY-MM-DD format
   * Returns 0, 1 or -1 if shiftTime is on currentDate, in future or was in past
   */
  isOnCurrentDate(shiftTime, currentDate) {
    const shiftStartTime = moment(shiftTime);
    const shiftDate = moment(shiftStartTime.format(Constants.DATE_FORMAT));
    return shiftDate.diff(currentDate);
  }
}
