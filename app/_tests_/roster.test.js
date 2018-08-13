import React from 'react'
import RosterComponent from '../components/roster'
import { shallow, mount } from 'enzyme'

describe('RosterComponent component ', () => {
  let fn = jest.fn()
  it('renders without crashing', () => {
    shallow(<RosterComponent/>)
  })

  it('should display table and View Roles button', () => {
    const wrapper = mount(<RosterComponent/>)
    const table = wrapper.find('[id="table"]')
    const button = wrapper.find('[id="view-roles"]')
    expect(table.exists()).toBe(true)
    expect(button.exists()).toBe(true)
  })

  it('should call different functions to populate data', () => {
    spyOn(RosterComponent.prototype, 'getHeaderValues').and.callThrough();
    spyOn(RosterComponent.prototype, 'getEmployeesShifts').and.callThrough();
    spyOn(RosterComponent.prototype, 'getTableValues').and.callThrough();
    const wrapper = mount(<RosterComponent/>)
    expect(RosterComponent.prototype.getHeaderValues).toHaveBeenCalled()
    expect(RosterComponent.prototype.getEmployeesShifts).toHaveBeenCalled()
    expect(RosterComponent.prototype.getTableValues).toHaveBeenCalled()
    expect(wrapper.state().headerValues.length).not.toBe(0);
    expect(wrapper.state().tableValues.length).not.toBe(0);
  })

 /*  it('should display role bar chart when View Roles button is clicked', () => {
    const wrapper = mount(<RosterComponent/>)
    const button = wrapper.find('[id="view-roles"]')
    expect(button.exists()).toBe(true)
    button.simulate('click')
    //const chartContainer = wrapper.find('[id="chart-container"]');
    //expect(chartContainer.exists()).toBe(true)
  }) */

  /* it('should updated card number once credit card number is entered in input text', () => {
    spyOn(CreditCard.prototype, 'handleChange').and.callThrough()
    const wrapper = mount(<CreditCard/>)
    const inputText = wrapper.find('[id="formBasicText"]')
    expect(inputText.exists()).toBe(true)
    const button = wrapper.find('[id="validate-credit-card"]')
    expect(button.exists()).not.toBe(true)
    inputText.simulate('change', {
      target: {
        value: '123'
      }
    })
    expect(CreditCard.prototype.handleChange).toHaveBeenCalled()
    expect(wrapper.state().creditCardNumber).toBe('123')
  })

  it('should not display button when error exists in input text', () => {
    const wrapper = mount(<CreditCard/>)
    const inputText = wrapper.find('[id="formBasicText"]')
    expect(inputText.exists()).toBe(true)

    inputText.simulate('change', {
      target: {
        value: 'abc'
      }
    })
    const button = wrapper.find('[id="validate-credit-card"]')
    expect(button.exists()).toBe(false)
  }) */
})
