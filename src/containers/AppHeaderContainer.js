import {connect} from 'react-redux';
import AppHeader from '../components/AppHeader';
import {logout} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    userID: state.account.userID,
    userName: state.account.username,
    token: state.account.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    },
  };
};

const AppHeaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppHeader);

export default withRouter(AppHeaderContainer);
