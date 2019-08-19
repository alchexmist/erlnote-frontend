import {connect} from 'react-redux';
import Tasklists from '../components/Tasklists';
import {updateTasklists} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    entityVisible: state.entityVisible,
    tasklists: state.tasklists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tasklistListRequest: (tasklistList) => {
      dispatch(updateTasklists(tasklistList));
    },
  };
};

const LoadTasklists = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tasklists);

export default withRouter(LoadTasklists);
