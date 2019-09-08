/* eslint-disable max-len */
import {connect} from 'react-redux';
import Boards from '../components/Boards';
import {setUserAction, updateBoards, deleteBoards} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
    boards: state.boards,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    boardListRequest: (boardList) => {
      dispatch(updateBoards(boardList));
    },
    boardListDeleteRequest: (boardList) => {
      dispatch(deleteBoards(boardList));
    },
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
  };
};

const LoadBoards = connect(
    mapStateToProps,
    mapDispatchToProps
)(Boards);

export default withRouter(LoadBoards);
