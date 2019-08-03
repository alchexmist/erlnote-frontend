import {connect} from 'react-redux';
import MainContent from '../components/MainContent';
import {updateNotes, updateBoards, updateTasklists} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    entityVisible: state.entityVisible,
    notes: state.notes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    noteListRequest: (noteList) => {
      dispatch(updateNotes(noteList));
    },
    boardListRequest: (boardList) => {
      dispatch(updateBoards(boardList));
    },
    tasklistListRequest: (tasklistList) => {
      dispatch(updateTasklists(tasklistList));
    },
  };
};

const LoadMainContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainContent);

export default withRouter(LoadMainContent);
