import {connect} from 'react-redux';
import Login from '../Login';
import {addAccount} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    account: {
      id: state.account.userID,
      username: state.account.username,
      token: state.account.token,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: (id, username, token) => {
      dispatch(addAccount({userID: id, username: username, token: token}));
    },
  };
};

const RunLogin = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default withRouter(RunLogin);
