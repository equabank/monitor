import React, {Component} from 'react';
import Timeline from '../components/Timeline';

export default class TimelineContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {slots: []};
  }

  componentDidMount() {
    this.getSlots();
  }

  getSlots() {
    fetch('/api/slots', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(response => response.json())
      .then((data) => {
        if (data.elastic.responses[0].hits !== undefined) {
          this.setState({slots: data.elastic.responses[0].hits.hits});
        }
      });
  }

  render() {
    const {slots} = this.state;
    return (
      <div>
        <Timeline
          slots={slots}
        />
      </div>
    );
  }
}
