/* eslint-disable max-len */
import {connect} from 'react-redux';
import EditBoard from '../components/EditBoard';
import {updateEntityVisible, setUserAction, updateBoard, addNewBoard} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  const boardData = state.boards.find((e) => e.id === state.userActionEntityID);

  return {
    currentUserID: state.account.userID,
    boardID: (boardData != undefined && boardData != null) ? boardData.id : state.userActionEntityID,
    boardTitle: (boardData != undefined && boardData != null) ? boardData.title : '',
    boardText: (boardData != undefined && boardData != null) ? boardData.text : '',
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
    updateBoard: (boardDataObject) => {
      dispatch(updateBoard(boardDataObject));
    },
  };
};

const LoadEditBoard = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditBoard);

export default withRouter(LoadEditBoard);
