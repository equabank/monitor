import React from 'react';
import { shallow } from 'enzyme';
import SaveProgress from './SaveProgress';

describe('<SaveProgress />', () => {

  it('show wait progress', () => {
    const typeProgress = {
      type: "waitForSave"
    }
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    const progressType = "Wait a moment";
    expect(wrapper.find('progressWait')).toBeTruthy();
  });

  it('show successful progress', () => {
    const typeProgress = {
      type: "success"
    }
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    expect(wrapper.find('progressSuccess')).toBeTruthy();
  });

  it('show failed progress', () => {
    const typeProgress = {
      type: "failed"
    }
    const wrapper = shallow(<SaveProgress typeProgress={typeProgress} />);
    expect(wrapper.find('progressFailed')).toBeTruthy();
  });

});