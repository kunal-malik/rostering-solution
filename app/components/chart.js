import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Utils from '../utils'
import Constants from '../constants'
import _ from 'lodash'

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

/**
 * Shows roles report for the duration of a period. 
 * For each day, it represents total number of designated employees in each role were present to better 
 * track it at a quick glance which was not possible in the table format display including capabilities:
 * Shows in a bar format with the help of highcharts
 * Data can be exported
 */
class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.getSeries = this.getSeries.bind(this);
        this.updateSeriesData = this.updateSeriesData.bind(this);
        this.state = {
            start_date: this.props.start_date,
            roles: this.props.roles,
            employeeShifts: !_.isEmpty(this.props.employeeShifts) ? this.props.employeeShifts : null,
            numberOfDays: this.props.numberOfDays ? this.props.numberOfDays : null
        }
    }

    /**
     * Gets series object that holds data to be displayed in the bar chart
     * @param {*} roles 
     * @param {*} numberOfDays 
     */
    getSeries(roles, numberOfDays) {
        const series = new Array();
        Object.keys(roles).forEach(id => {
            const role = roles[id];
            const name = role.name;
            const backgroundColor = role.background_colour;
            const data = new Array();
            for (let k = 0; k < numberOfDays; k++) {
                data.push(0);
            }
            series.push({
                name: name,
                data: data,
                color: backgroundColor,
                id: id
            })
        });
        return series;
    }

    /**
     * Updates data to be displayed in the bar chart
     * @param {*} date 
     * @param {*} series 
     * @param {*} index 
     */
    updateSeriesData(date, series, index) {
        const { employeeShifts } = this.state;
        Object.keys(employeeShifts).forEach(empID => {
            const shifts = employeeShifts[empID];
            for (let shift of shifts) {
                const diff = Utils.isOnCurrentDate(shift.start_time, date);
                if (diff == 0) {
                    let data = null;
                    for (let i = 0; i < series.length; i++) {
                        if (series[i].id == shift.role_id) {
                            data = series[i].data;
                            data[index] = data[index] + 1;
                            series[i].data = data;
                            break;
                        }
                    }
                } else if (diff > 0) {
                    //employee shifts were in past
                    break;
                }
            }
        });

    }

    componentDidMount() {
        const { start_date, roles, numberOfDays, employeeShifts } = this.state;
        if (numberOfDays && employeeShifts) {
            const categories = new Array();
            const series = this.getSeries(roles, numberOfDays);
            for (let i = 0; i < numberOfDays; i++) {
                const date = Utils.addDays(start_date, Constants.DATE_FORMAT, i).format(Constants.DATE_FORMAT);
                categories.push(date);
                this.updateSeriesData(date, series, i)
            }
            if (document.getElementById('chart-container')) {
                Highcharts.chart('chart-container',
                    {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: Constants.ROLES_REPORT
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {
                            categories: categories,
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: Constants.NO_OF_DAYS
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: series,
                        credits: {
                            enabled: false
                        },
                    });
            }
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <div id="chart-container" className='chart-container'>
                    </div>
                </div>
            </div>
        )
    }
}

ChartComponent.propTypes = {
    start_date: PropTypes.string,
    roles: PropTypes.object,
    employeeShifts: PropTypes.object,
    numberOfDays: PropTypes.number,
}

export default ChartComponent
