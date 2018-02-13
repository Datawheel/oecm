import React from "react";
import {connect} from "react-redux";
import {Activate as CanonActivate} from "datawheel-canon";
import {NonIdealState} from "@blueprintjs/core";
import {isAuthenticated} from "datawheel-canon";
class OnboardingSuccess extends React.Component {

  componentDidMount() {
    this.props.isAuthenticated();
  }
  render() {
    const user = this.props.auth ? this.props.auth.user : null;

    return (
      <div className="slide-inner">
        <h2>Congrats Your Company has been Listed!</h2>
        <p className="description-text">
          Select one of your companies to be listed under product.
        </p>
        {user && user.activated !== undefined
          ? <div>
            <div className="title-wrapper">Verify Email</div>
            <CanonActivate />
          </div>
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  isAuthenticated: () => {
    dispatch(isAuthenticated());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingSuccess);
