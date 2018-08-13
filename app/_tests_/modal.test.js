import React from 'react'
import ModalComponent from '../components/modal'
import { shallow, mount, render } from 'enzyme';

describe('ModalComponent', () => {
    const tableValues = {
        "1":["Frank White",null,null,{"start_time":"2018-06-20 21:00","end_time":"2018-06-21 05:30","break_duration":3600,"role_id":2,"shift_id":61604},{"start_time":"2018-06-21 21:00","end_time":"2018-06-22 05:30","break_duration":3600,"role_id":2,"shift_id":61562},{"start_time":"2018-06-22 21:00","end_time":"2018-06-23 05:30","break_duration":3600,"role_id":2,"shift_id":61596},{"start_time":"2018-06-23 21:00","end_time":"2018-06-24 05:30","break_duration":3600,"role_id":2,"shift_id":61556},{"start_time":"2018-06-24 21:00","end_time":"2018-06-25 05:30","break_duration":3600,"role_id":3,"shift_id":61586}]
    }
  let fn = jest.fn()
  it('renders without crashing', () => {
    shallow(<ModalComponent employeeID="1" index={3} tableValues={tableValues}  closeModal={fn} showModal={true}/>);
  })

  it('should call handleSave function when save button is clicked', () => {
    spyOn(ModalComponent.prototype, 'handleSave').and.callThrough();
    const wrapper = mount(<ModalComponent employeeID="1" index={3} tableValues={tableValues}  closeModal={fn} showModal={true}/>);
    const button = wrapper.find('.modal-container .btn');
    expect(button.exists()).toBe(true);
    button.simulate('click');
    expect(ModalComponent.prototype.handleSave).toHaveBeenCalled();
  })

  it('should call handleClose function when save button is clicked and no shift time is updated', () => {
    spyOn(ModalComponent.prototype, 'handleClose').and.callThrough();
    const wrapper = mount(<ModalComponent employeeID="1" index={3} tableValues={tableValues}  closeModal={fn} showModal={true}/>);
    const button = wrapper.find('.modal-container .btn');
    expect(button.exists()).toBe(true);
    button.simulate('click');
    expect(ModalComponent.prototype.handleClose).toHaveBeenCalled();
  })


});