import {connect} from 'react-redux';
import MainContainer from '../components/MainContainer';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    entityVisible: state.entityVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const LoadMainContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainContainer);

export default withRouter(LoadMainContainer);
