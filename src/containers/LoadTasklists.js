import {connect} from 'react-redux';
import Tasklists from '../components/Tasklists';
import {setUserAction, updateTasklists} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
    tasklists: state.tasklists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tasklistListRequest: (tasklistList) => {
      dispatch(updateTasklists(tasklistList));
    },
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
  };
};

const LoadTasklists = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tasklists);

export default withRouter(LoadTasklists);
