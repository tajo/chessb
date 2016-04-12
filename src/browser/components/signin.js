import React from 'react';
import Component from 'react-pure-render/component';
import {reduxForm} from 'redux-form';
import '../styles/button.scss';

const fields = [ 'userId', 'password']

class Signin extends Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: { userId, password },
      handleSubmit,
      resetForm,
      submitting
      } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label><b>User or email</b></label>
          <div>
            <input type="text" {...userId}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <label><b>Password</b></label>
          <div>
            <input type="password" {...password}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <button className="pureButton" type="submit" disabled={submitting}>
            Sign in
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signin',
  fields
})(Signin);
