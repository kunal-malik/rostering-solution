import React from 'react'
import ChartComponent from '../components/chart'
import { shallow, mount, render } from 'enzyme';

describe('ChartComponent', () => {
    const props = {
        start_date: "2018-08-06",
        roles: { 
            2 : {
            background_colour: "#f5ffa2",
            name: "Checkouts",
            text_colour: "#000000"
            }
        },
        employeeShifts: {
            2634: [{"start_time":"2018-06-20 21:00","end_time":"2018-06-21 05:30","break_duration":3600,"role_id":2,"id":61604}]
        },
        numberOfDays: 1
    }
  let fn = jest.fn()
  it('renders without crashing', () => {
    shallow(<ChartComponent {...props}/>);
  })

   it('should call getSeries and updateSeriesData function component is mounted', () => {
    spyOn(ChartComponent.prototype, 'getSeries').and.callThrough();
    spyOn(ChartComponent.prototype, 'updateSeriesData').and.callThrough();
    const wrapper = mount(<ChartComponent {...props}/>);
    expect(ChartComponent.prototype.getSeries).toHaveBeenCalled();
    expect(ChartComponent.prototype.updateSeriesData).toHaveBeenCalled();
  })


});