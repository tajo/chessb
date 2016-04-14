import React from 'react';
import Component from 'react-pure-render/component';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {actionCreators as userActions} from '../redux/actions/user';
import {email, required, minLength} from '../../common/validation';
import '../styles/button.scss';

const fields = [ 'userId', 'password']

export const validate = values => {
  const errors = {
    userId: required(values.userId) || minLength(3)(values.userId),
    password: required(values.password) || minLength(6)(values.password),
  };
  return errors;
};

function getError(field) {
  if (!field.touched) return '';
  if (field.error) return <span style={{color: 'red'}}> - {field.error}</span>;
  return '';
}

function submit(signInUser) {
  return (values, dispatch) => {
    return signInUser(values.userId, values.password);
  };
}

const mapStateToProps = (state) => ({
  //signInError: state.user.get('signInError'),
});

class Signin extends Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    signInUser: React.PropTypes.func.isRequired,
  };

  render() {
    const {
      fields: { userId, password },
      handleSubmit,
      resetForm,
      submitting
      } = this.props
    return (
      <form onSubmit={handleSubmit(submit(this.props.signInUser))}>
        <div>
          <label><b>User or email  {getError(userId)}</b></label>
          <div>
            <input type="text" {...userId}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <label><b>Password  {getError(password)}</b></label>
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
  fields,
  validate,
})(connect(mapStateToProps, userActions)(Signin));
