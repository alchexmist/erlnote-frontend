/* eslint-disable max-len */
import {connect} from 'react-redux';
import EditTasklist from '../components/EditTasklist';
import {setUserAction, updateTasklist, deleteTasklist, addNewTask, updateTask, deleteTask, addTagTasklist, removeTagTasklist} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  const tasklistData = state.tasklists.find((e) => e.id === state.userActionEntityID);
  const validTasklistData = tasklistData != undefined && tasklistData != null;

  return {
    currentUserID: state.account.userID,
    tasklistID: (validTasklistData) ? tasklistData.id : state.userActionEntityID,
    tasklistTitle: (validTasklistData) ? tasklistData.title : '',
    tasklistTasks: (validTasklistData && tasklistData.tasks != null) ? tasklistData.tasks : [],
    tasklistTags: (validTasklistData && tasklistData.tags) ? tasklistData.tags : [],
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
    deleteTasklist: (tasklistDataObject) => {
      dispatch(deleteTasklist(tasklistDataObject));
    },
    addTask: (taskDataObject) => {
      dispatch(addNewTask(taskDataObject));
    },
    updateTask: (taskDataObject) => {
      dispatch(updateTask(taskDataObject));
    },
    deleteTask: (taskDataObject) => {
      dispatch(deleteTask(taskDataObject));
    },
    addTagTasklist: (tagDataObject) => {
      dispatch(addTagTasklist(tagDataObject));
    },
    removeTagTasklist: (tagDataObject) => {
      dispatch(removeTagTasklist(tagDataObject));
    },
  };
};

const LoadEditTasklist = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditTasklist);

export default withRouter(LoadEditTasklist);
