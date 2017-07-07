import React from "react";
import {connect} from "react-redux";
import {Link, browserHistory} from "react-router";
import {deleteCompany} from "../actions/userActions";
import {isAuthenticated, logout, updateUser} from "../actions/authenticationActions";
import Sidebar from "../components/Sidebar";
import "../components/Form.css";
import api from "../api.js";

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password1: "",
      password2: "",
      error: "",
      oldPassword: "",
      deleteVisible: false
    }
  }

  componentWillMount() {
    this.props.clearUser();
  }

  handleChange = e => {
    e.target.value
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  resendActivation = e => {
    e.preventDefault();
    return api.get("api/auth/sendActivationEmail", {withCredentials: true})
      .then(response => {
        this.activationDiv.remove();
      })
  }

  save = () => {
    if (this.state.password1.length < 5 || this.state.password2.length < 5) {
      this.setState({error: "Password must be longer than 5 characters."});
    } else if (this.state.password1 !== this.state.password2) {
      this.setState({error: "Passwords must match."});
    } else {
      this.setState({error: null});
      this.props.updateUser(this.props.user.id, this.props.user.email, this.state.oldPassword, this.state.password1);
    }
  }

  toggleDeleteCompany = () => {
    var visible = this.state.deleteVisible;
    this.setState({
      deleteVisible: !visible
    });
  }

  deleteCompany = () => {
    this.setState({deleteVisible: false});
    this.props.deleteCompany(this.props.user.company_id);
  }

  render() {
    const {company, updatedUser, user, loading, error} = this.props;

    return (
      <div className={this.state.deleteVisible
        ? "user-data-opacity"
        : "user-data-wrapper"}>
        <div className="delete-popup">
          <span onClick={this.toggleDeleteCompany} className="delete"></span>
          <div className="content">
            <p>Are you sure you want to delete your company?</p>
            <button className="button button-next" onClick={this.deleteCompany}>Delete</button>
          </div>
        </div>
        <div className="user-data">
          {!user.isConfirmed
            ? <div className="alert alert-warning" ref={(activationDiv) => { this.activationDiv = activationDiv; }}>
                <strong>Warning!</strong> Please activate your account to add a company. <a href="#" onClick={this.resendActivation}>Resend activation.</a>
              </div>
            : null
          }
          {company
            ? <div className="section-wrapper no-border listing">
                <b>Your Listing: {company.name}</b>
                <div className="input-wrapper company-wrapper">
                  <Link to={`/company/${company.id}`}>
                    <div className="view-listing">
                      <p>View Company</p>
                      <span className="chevron right"></span>
                    </div>
                  </Link>
                  <div className="delete-company" onClick={this.toggleDeleteCompany}>
                    <p>Delete Company</p>
                    <span className="delete"></span>
                  </div>
                </div>
              </div>
            : <div className="section-wrapper listing">
              <b>Your Listing</b>
              <div className="register-company">
                <p>You do not have a company registered.</p>
                {user.isConfirmed
                  ? <Link to="/settings/company">
                    <button className="button button-next">Register a Company</button>
                  </Link>
                  : <button className="disabled button button-next">Register a Company</button>}
                <div className="input-wrapper">
                  <label>Or link your Connect Americas account.</label>
                  <input type="password" value={this.state.oldPassword} onChange={this.handleChange} name="oldPassword"/>
                </div>
              </div>
            </div>}
          <div>
            <b>Update Your Password</b>
            <div className="input-wrapper">
              <label>Old Password</label>
              <input type="password" value={this.state.oldPassword} onChange={this.handleChange} name="oldPassword"/>
            </div>
            <div className="input-wrapper">
              <label>New Password</label>
              <input type="password" value={this.state.password1} onChange={this.handleChange} name="password1"/>
            </div>
            <div className="input-wrapper">
              <label>Comfirm Password</label>
              <input type="password" value={this.state.password2} onChange={this.handleChange} name="password2"/>
            </div>
            <div className="password error-wrapper">
              {updatedUser
                ? <p>New password saved!</p>
                : <p>{this.props.error
                    ? this.props.error
                    : this.state.error}</p>}
            </div>
            <div className="button-wrapper">
              <button className="button button-next" onClick={this.save}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteCompany: id => {
      dispatch(deleteCompany(id));
    },
    updateUser: (id, email, oldPassword, password) => {
      dispatch(updateUser(id, email, oldPassword, password));
    },
    clearUser: () => {
      dispatch({type: "SAVE_USER_FULFILLED", date: null})
    },
    isAuthenticated: () => {
      dispatch(isAuthenticated());
    }
  };
}

const mapStateToProps = state => {
  return {updatedUser: state.authentication.updatedUser, company: state.companyProfile.authCompany, user: state.authentication.user, loading: state.authentication.loading, error: state.authentication.error}
}
export default connect(mapStateToProps, mapDispatchToProps)(UserData);
