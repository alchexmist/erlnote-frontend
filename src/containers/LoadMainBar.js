import {connect} from 'react-redux';
import MainBar from '../components/MainBar';
import {updateEntityVisible} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    entityVisible: state.entityVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEntityVisible: (entityID) => {
      dispatch(updateEntityVisible(entityID));
    },
  };
};

const LoadMainBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainBar);

export default withRouter(LoadMainBar);
