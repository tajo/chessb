import React from 'react';
import Component from 'react-pure-render/component';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {actionCreators as userActions} from '../redux/actions/user';
import {email, required, basicChars, minLength} from '../../common/validation';
import '../styles/button.scss';

const fields = [ 'userId', 'email', 'password'];

export const validate = values => {
  const errors = {
    userId: required(values.userId) || basicChars(values.userId) ||  minLength(3)(values.userId),
    password: required(values.password) || minLength(6)(values.password),
    email: required(values.email) || email(values.email),
  };
  return errors;
};

function getError(field) {
  if (!field.touched) return '';
  if (field.error) return <span style={{color: 'red'}}> - {field.error}</span>;
  return '';
}

function submit(addUser) {
  return (values, dispatch) => {
    return addUser(values.email, values.password, values.userId);
  };
}

const mapStateToProps = (state) => ({
  accountError: state.user.get('accountError'),
});

class Signup extends Component {

  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    addUser: React.PropTypes.func.isRequired,
    accountError: React.PropTypes.string,
  };

  render() {
    const {
      fields: { userId, email, password },
      handleSubmit,
      resetForm,
      submitting
      } = this.props
    return (
      <form onSubmit={handleSubmit(submit(this.props.addUser))}>
        {this.props.accountError && <div style={{color: 'darkred'}}><b>{this.props.accountError}</b></div>}
        <div>
          <label><b>Email {getError(email)}</b></label>
          <div>
            <input type="email" {...email}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <label><b>Username {getError(userId)}</b></label>
          <div>
            <input type="text" {...userId}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <label><b>Password {getError(password)}</b></label>
          <div>
            <input type="password" {...password}/>
          </div>
        </div>
        <div style={{marginTop: '5px'}}>
          <button className="pureButton" type="submit" disabled={submitting}>
            Sign up
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signup',
  fields,
  validate,
})(connect(mapStateToProps, userActions)(Signup));
