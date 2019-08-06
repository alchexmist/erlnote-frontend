import {connect} from 'react-redux';
import MainBar from '../components/MainBar';
import {updateEntityVisible, setUserAction, addNewBoard} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    entityVisible: state.entityVisible,
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEntityVisible: (entityID) => {
      dispatch(updateEntityVisible(entityID));
    },
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
    addNewBoard: (boardData) => {
      dispatch(addNewBoard(boardData));
    },
  };
};

const LoadMainBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainBar);

export default withRouter(LoadMainBar);
