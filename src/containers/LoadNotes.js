import {connect} from 'react-redux';
import Notes from '../components/Notes';
import {setUserAction, updateNotes, deleteNotes} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  return {
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
    // entityVisible: state.entityVisible,
    notes: state.notes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    noteListRequest: (noteList) => {
      dispatch(updateNotes(noteList));
    },
    noteListDeleteRequest: (noteList) => {
      dispatch(deleteNotes(noteList));
    },
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
  };
};

const LoadNotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

export default withRouter(LoadNotes);
