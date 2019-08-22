/* eslint-disable max-len */
import {connect} from 'react-redux';
import EditTasklist from '../components/EditTasklist';
import {setUserAction, updateTasklist} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  const tasklistData = state.tasklists.find((e) => e.id === state.userActionEntityID);

  return {
    currentUserID: state.account.userID,
    tasklistID: (tasklistData != undefined && tasklistData != null) ? tasklistData.id : state.userActionEntityID,
    tasklistTitle: (tasklistData != undefined && tasklistData != null) ? tasklistData.title : '',
    // boardText: (boardData != undefined && boardData != null) ? boardData.text : '',
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
    updateTasklist: (tasklistDataObject) => {
      dispatch(updateTasklist(tasklistDataObject));
    },
  };
};

const LoadEditTasklist = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditTasklist);

export default withRouter(LoadEditTasklist);
