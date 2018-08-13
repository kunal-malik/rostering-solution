import { Modal, Button, Alert } from 'react-bootstrap';
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
//https://github.com/yury-dymov/react-bootstrap-time-picker
import TimePicker from 'react-bootstrap-time-picker';
import Constants from '../constants';
import Utils from '../utils'

class ModalComponent extends Component {

  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.compareShiftTime = this.compareShiftTime.bind(this);

    const employeeID = this.props.employeeID;
    const index = this.props.index;
    const tableValues = this.props.tableValues;
    const employeeShifts = tableValues[employeeID];
    const employeeSelectedShift = employeeShifts[index];
    const employeeAdjacentShifts = [employeeShifts[index - 1], employeeShifts[index], employeeShifts[index + 1]];
    const startTime = moment(employeeSelectedShift.start_time).format(Constants.TIME_FORMAT);
    const endTime = moment(employeeSelectedShift.end_time).format(Constants.TIME_FORMAT);
    this.state = {
      employeeID,
      employeeSelectedShift,
      employeeName: tableValues[employeeID][0],
      employeeAdjacentShifts,
      startTime,
      endTime,
      showError: false,
      index: index
    }
  }

  /**
   * Closes the modal
   */
  handleClose() {
    this.props.closeModal();
  }

  /**
   * Updated the time displayed in the modal
   * @param {*} key start time or end time
   * @param {*} time time selected by user
   */
  handleTimeChange(key, time) {
    this.setState({
      [key]: time,
      showError: false
    });
  }

  /**
   * Validates if updated shift timings can be saved. Mainly follows below validations:
   * Shift time should be <= 8.5 hours
   * Shift total time should be > break duration of the shift
   */
  handleSave() {
    const { employeeAdjacentShifts, startTime, endTime, employeeID, index } = this.state
    const currentShift = employeeAdjacentShifts[1];
    const previousShiftEndTime = employeeAdjacentShifts[0] ? moment(employeeAdjacentShifts[0].end_time) : null;
    const nextShiftStartTime = employeeAdjacentShifts[2] ? moment(employeeAdjacentShifts[2].start_time) : null;
    const updatedStartTime = Utils.getUpdatedTimeInMoment(currentShift.start_time, startTime);
    const updatedEndTime = Utils.getUpdatedTimeInMoment(currentShift.end_time, endTime);

    //check if shift times are updated
    const currentShiftStartTime = currentShift.start_time;
    const currentShiftEndTime = currentShift.end_time;
    if (moment(currentShiftStartTime).diff(updatedStartTime, 'minutes') == 0 &&
      moment(currentShiftEndTime).diff(updatedEndTime, 'minutes') == 0) {
      //shift times are not updated
      this.handleClose();
    } else {
      //shift times have been updated
      let showError = null;
      let errorMsg = Constants.VALIDATION_BACK_TO_BACK;
      if (previousShiftEndTime) {
        showError = this.compareShiftTime(updatedStartTime, previousShiftEndTime);
      }

      if (!showError && nextShiftStartTime) {
        showError = this.compareShiftTime(nextShiftStartTime, updatedEndTime);
      }

      if (!showError) {
        const diff = updatedEndTime.diff(updatedStartTime, 'minutes') / 60;
        if (diff > 8.5) {
          showError = true;
          errorMsg = Constants.VALIDATION_MAX_SHIFT_TIME;
        } else if (diff <= currentShift.break_duration / 3600) {
          showError = true;
          errorMsg = Constants.VALIDATION_ALLOCATE_PREFIX + currentShift.break_duration / 3600 + Constants.VALIDATION_ALLOCATE_SUFFIX;
        }
      }

      if (!showError) {
        //time ranges are valid, proceed to save
        this.props.updateEmployeeShift(employeeID, index, updatedStartTime.format(Constants.DATE_TIME_FORMAT), updatedEndTime.format(Constants.DATE_TIME_FORMAT));
      } else {
        this.setState({
          showError,
          errorMsg
        })
      }
    }
  }

  /**
   * Compares shift timings and return boolean based on timings validation
   * @param {*} a updated start time / next shift start time
   * @param {*} b previous shift end time / updated end time
   */
  compareShiftTime(a, b) {
    let isInvalid = false
    const diff = a.diff(b, 'minutes') / 60;
    if (diff < 7.5) {
      isInvalid = true;
    }
    return isInvalid;
  }

  render() {
    const _this = this;
    const { employeeSelectedShift, employeeName, startTime, endTime, showError, errorMsg } = this.state;
    return (
      <div className='modal-container'>
        <Modal show={this.props.showModal} onHide={this.handleClose} container={this} backdrop={true}>
          <Modal.Header closeButton>
            <Modal.Title>{Constants.EDIT_SHIFT_TIME}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="modal-body">
              {showError ?
                <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                  {errorMsg}
                </Alert>
                : null}
              <div className="row"><span className="col-sm-4 bold">{Constants.EMPLOYEE_NAME}</span><div className="col-sm-5"> {employeeName}</div> </div>
              <div className="row"></div>
              <div className="row"><span className="col-sm-4 bold">{Constants.DATE}</span> <div className="col-sm-5">{moment(employeeSelectedShift.start_time).format(Constants.DATE_FORMAT)}</div> </div>
              <div className="row"></div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="bold">{Constants.START_TIME}</div>
                  <TimePicker start="00:00" end="23:59" step={30}
                    value={startTime} onChange={(value) => _this.handleTimeChange('startTime', value)} />
                </div>
                <div className="col-sm-6">
                  <div className="bold">{Constants.END_TIME}</div>
                  <TimePicker start="00:00" end="23:59" step={30}
                    value={endTime} onChange={(value) => _this.handleTimeChange('endTime', value)} />
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button id="modal-save" bsStyle="success" onClick={() => _this.handleSave()}>{Constants.SAVE}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

ModalComponent.propTypes = {
  employeeID: PropTypes.string,
  index: PropTypes.number,
  tableValues: PropTypes.object,
  closeModal: PropTypes.func,
  showModal: PropTypes.bool
}

export default ModalComponent
