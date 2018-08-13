import React, { Component } from 'react'
import Shifts from '../../files/shifts.json'
import Employees from '../../files/employees.json'
import Roles from '../../files/roles.json'
import Config from '../../files/config.json'
import moment from 'moment-timezone'
import editImg from '../../images/edit.png'
import ModalComponent from './modal'
import Constants from '../constants'
import { DropdownButton, Button, Alert } from 'react-bootstrap'
import ChartComponent from './chart'
import Utils from '../utils'
import _ from 'lodash'

/** This is the parent class for rendering all the components displayed on screen for Rostering Solution*/
class RosterComponent extends Component {
    constructor(props) {
        super(props);
        this.getRolesByID = this.getRolesByID.bind(this);
        this.editShiftTime = this.editShiftTime.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateEmployeeShift = this.updateEmployeeShift.bind(this);
        this.viewChart = this.viewChart.bind(this);
        this.getHeaderValues = this.getHeaderValues.bind(this);
        this.viewChart = this.viewChart.bind(this);
        this.getEmployeesShifts = this.getEmployeesShifts.bind(this);
        this.getTableData = this.getTableData.bind(this);

        const start_date = "2018-06-18";
        const end_date = "2018-06-24";
        this.state = {
            start_date,
            end_date,
            tableValues: null,
            viewChart: false,
            viewBtnText: Constants.VIEW_ROLES,
            showAlert: false
        }
        this.shifts = Shifts && Shifts.length > 0 ? Shifts : null;
        this.employees = Employees && Employees.length > 0 ? Employees : null;
        this.roles = Roles && Roles.length > 0 ? this.getRolesByID(Roles) : null;
        this.numberOfDays = Utils.getNumberOfDays(start_date, end_date);
    }

    /**
     * Restructures roles to make it ID based
     * @param {*} roles 
     */
    getRolesByID(roles) {
        const rolesByID = {};
        roles.map(role => {
            if (role) {
                rolesByID[role.id] = {
                    'background_colour': role.background_colour,
                    'name': role.name,
                    'text_colour': role.text_colour
                }
            }
        });
        return rolesByID;
    }

    /**
     * Makes all employees shifts for the duration in one object
     * @param {*} shifts data from shifts.json file
     */
    getEmployeesShifts(shifts) {
        const employeesShifts = {};
        shifts.map(shift => {
            if (shift.employee_id) {
                const empID = shift.employee_id;
                let empShifts = employeesShifts[empID];
                if (!empShifts) {
                    empShifts = new Array();
                }
                empShifts.push({
                    'start_time': moment.tz(shift.start_time, Config.timezone).format(Constants.DATE_TIME_FORMAT),
                    'end_time': moment.tz(shift.end_time, Config.timezone).format(Constants.DATE_TIME_FORMAT),
                    'role_id': shift.role_id,
                    'break_duration': shift.break_duration,
                    'id': shift.id
                });
                employeesShifts[empID] = empShifts;
            }
        });
        return employeesShifts;
    }

    /**
     * Prepares data to be displayed in table body
     * @param {*} employees data from employees.json file
     * @param {*} employeeShifts all the employee shifts received from getEmployeesShifts()
     */
    getTableData(employees, employeeShifts) {
        const { start_date } = this.state;
        const tableValues = {};
        employees.map(employee => {
            const empID = employee.id;
            if (empID) {
                let employeeWeekData = tableValues[empID];
                if (!employeeWeekData) {
                    employeeWeekData = new Array();
                }
                const employeeShift = employeeShifts[empID];
                employeeWeekData.push(employee.first_name + ' ' + employee.last_name);
                let current_date = moment(start_date);
                let startingIndex = 0;
                for (let i = 0; i < this.numberOfDays; i++) {
                    //If data is not present for that day in shifts, put as null. Otherwise, populate object
                    if (employeeShift && employeeShift.length > 0 && employeeShift[0]) {
                        for (let k = startingIndex; k < employeeShift.length; k++) {
                            const currentShift = employeeShift[k];
                            const diff = Utils.isOnCurrentDate(currentShift.start_time, current_date);
                            if (diff == 0) {
                                //Emp has shift this day
                                employeeWeekData.push({
                                    'start_time': currentShift.start_time,
                                    'end_time': currentShift.end_time,
                                    'break_duration': currentShift.break_duration,
                                    'role_id': currentShift.role_id,
                                    'shift_id': currentShift.id
                                })
                                startingIndex = k + 1;
                                break;
                            } else if (diff > 0) {
                                //Emp doesn't have shift this day
                                employeeWeekData.push(null);
                                break;
                            }
                        }
                    } else {
                        employeeWeekData.push(null);
                    }
                    current_date = Utils.addDays(current_date, Constants.DATE_FORMAT, 1);
                }
                if (employeeWeekData.length < 8) {
                    const length = 8 - employeeWeekData.length;
                    for (let i = 0; i < length; i++) {
                        employeeWeekData.push(null);
                    }
                }
                tableValues[empID] = employeeWeekData;
            }
        })
        return tableValues;
    }

    /**
     * Prepares table header values to b e shown in specific format and returns them in an array
     */
    getHeaderValues() {
        const { start_date } = this.state;
        const headerValues = new Array();
        headerValues.push(Constants.EMPLOYEE_NAME);
        for (let k = 0; k < this.numberOfDays; k++) {
            headerValues.push(moment(start_date).add(k, 'days').format('ddd D MMM'));
        }
        return headerValues;
    }

    componentDidMount() {
        const headerValues = this.getHeaderValues();
        const employeeShifts = this.getEmployeesShifts(this.shifts);
        const tableValues = this.getTableData(this.employees, employeeShifts, headerValues.length);
        this.setState({
            employeeShifts: employeeShifts,
            tableValues: tableValues,
            headerValues: headerValues
        });
    }

    /**
     * Opens the modal to edit the shift time for an employee
     * @param {*} employeeID 
     * @param {*} index of role been edited from tableValues object
     */
    editShiftTime(employeeID, index) {
        this.setState({
            showModal: true,
            employeeID: employeeID,
            index: index
        });
    }

    /**
     * Closes the modal for editing shift timings
     * @param {*} showAlert success alert shown if data is saved successfully for 5 seconds
     */
    closeModal(showAlert = false) {
        const _this = this;
        this.setState({
            showModal: false,
            employeeID: null,
            index: null,
            showAlert
        })

        if (showAlert) {
            setTimeout(function () {
                _this.setState({
                    showAlert: false
                })
            }, 5000);
        }
    }

    /**
     * Updates the shift timings in tableValues object to reflect changes in the table
     * @param {*} employeeID id of the employee
     * @param {*} index of shift been updated in tableValues
     * @param {*} updatedStartTime updated shift start time
     * @param {*} updatedEndTime updated shift end time
     */
    updateEmployeeShift(employeeID, index, updatedStartTime, updatedEndTime) {
        const _this = this;
        let tableValues = this.state.tableValues;
        const shiftToEdit = tableValues[employeeID][index];
        shiftToEdit.start_time = updatedStartTime;
        shiftToEdit.end_time = updatedEndTime;
        tableValues[employeeID][index] = shiftToEdit;
        this.setState({
            tableValues: tableValues
        }, () => {
            _this.closeModal(true);
        })
    }

    /**
     * Another visualization feature to view total number of people performing a role in a day
     */
    viewChart() {
        const viewChart = this.state.viewChart ? false : true;
        this.setState({
            viewChart,
            viewBtnText: viewChart ? Constants.VIEW_TABLE : Constants.VIEW_ROLES
        })
    }

    render() {
        const _this = this;
        const { headerValues, tableValues, showModal, employeeID, index, start_date, end_date, viewChart, viewBtnText, employeeShifts, showAlert } = this.state;
        return (
            <div className='roster-container'>
                <div className='header'>
                    <h3>{Constants.ROSTER_HEADING}</h3>
                </div>
                <div className="container-fluid">
                    <div className="filters">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="col-xs-12 col-sm-3 col-md-2 col-lg-1">
                                    <Button id="view-roles" bsStyle="primary" onClick={() => _this.viewChart()}>{viewBtnText}</Button>
                                </div>

                                <div className="col-xs-12 col-sm-3 col-md-2 col-lg-2">
                                    <DropdownButton
                                        id="location"
                                        bsStyle='success'
                                        title={Config.location}
                                        disabled={true}
                                    >
                                    </DropdownButton>
                                </div>

                                <div className="col-xs-12 col-sm-3 col-md-2 col-lg-1">
                                    <Button bsStyle="success" disabled={true}>{`${start_date} to ${end_date}`}</Button>
                                </div>


                                {showAlert ?
                                    <div className="col-xs-12 col-sm-2 col-md-1 pull-right">
                                        <Alert bsStyle="success">
                                            {Constants.SUCCESS}
                                        </Alert>
                                    </div>
                                    : null}

                            </div>
                        </div>
                    </div>

                    {viewChart ?
                        <ChartComponent key="roles-chart"
                            start_date={start_date}
                            end_date={end_date}
                            roles={this.roles}
                            employeeShifts={employeeShifts}
                            numberOfDays={this.numberOfDays}
                        />
                        :
                        <div className='col-xs-12'>
                            {!_.isEmpty(tableValues) ?
                                <table className="table table-bordered" id="table">
                                    <thead>
                                        <tr>
                                            {headerValues && headerValues.map(value =>
                                                <th key={value}>{value}</th>
                                            )
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(tableValues).map(employeeID =>
                                            <tr key={employeeID}>
                                                {
                                                    tableValues[employeeID].map((employeeTodaysData, index) =>
                                                        index == 0 ? <td className="employee-name" key={`${employeeID}-${index}`}>{employeeTodaysData}</td> :
                                                            employeeTodaysData ?
                                                                <td key={`${employeeID}-${index}`} className="shift-data" style={{}}>
                                                                    <div className="shift-time">
                                                                        {moment(employeeTodaysData.start_time).format(Constants.SHIFT_TIME_FORMAT)} - {moment(employeeTodaysData.end_time).format(Constants.SHIFT_TIME_FORMAT)}
                                                                        <img className="edit" src={editImg} onClick={() => _this.editShiftTime(employeeID, index)}></img>
                                                                    </div>
                                                                    <span className="role-name" style={{ color: this.roles[employeeTodaysData.role_id].text_colour, backgroundColor: this.roles[employeeTodaysData.role_id].background_colour }}>
                                                                        {this.roles[employeeTodaysData.role_id].name}
                                                                    </span>
                                                                </td>
                                                                :
                                                                <td key={`${employeeID}-${index}`}></td>
                                                    )
                                                }
                                            </tr>
                                        )

                                        }

                                    </tbody>
                                </table>
                                : Constants.ERROR_GENERIC}
                        </div>
                    }
                    {
                        showModal ?
                            <ModalComponent
                                key='edit-shift-time'
                                showModal={true}
                                employeeID={employeeID}
                                index={index}
                                tableValues={tableValues}
                                closeModal={() => _this.closeModal()}
                                updateEmployeeShift={(employeeID, index, updatedStartTime, updatedEndTime) => _this.updateEmployeeShift(employeeID, index, updatedStartTime, updatedEndTime)}
                            />
                            : null
                    }
                </div >
            </div >
        )
    }
}

export default RosterComponent
