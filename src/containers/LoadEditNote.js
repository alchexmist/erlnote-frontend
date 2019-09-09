/* eslint-disable max-len */
import {connect} from 'react-redux';
import EditNote from '../components/EditNote';
import {setUserAction, updateNote, deleteNote, addTagNote, removeTagNote} from '../redux/actions/index';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
  const noteData = state.notes.find((e) => e.id === state.userActionEntityID);
  const validNoteData = noteData !== undefined && noteData !== null;

  return {
    currentUserID: state.account.userID,
    noteID: (validNoteData) ? noteData.id : state.userActionEntityID,
    noteTitle: (validNoteData) ? noteData.title : '',
    noteBody: (validNoteData) ? noteData.body : '',
    noteTags: (validNoteData && noteData.tags) ? noteData.tags : [],
    userAction: state.userAction,
    userActionEntityID: state.userActionEntityID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAction: (userAction) => {
      dispatch(setUserAction(userAction));
    },
    updateNote: (noteDataObject) => {
      dispatch(updateNote(noteDataObject));
    },
    deleteNote: (noteDataObject) => {
      dispatch(deleteNote(noteDataObject));
    },
    // addTask: (taskDataObject) => {
    //   dispatch(addNewTask(taskDataObject));
    // },
    // updateTask: (taskDataObject) => {
    //   dispatch(updateTask(taskDataObject));
    // },
    // deleteTask: (taskDataObject) => {
    //   dispatch(deleteTask(taskDataObject));
    // },
    addTagNote: (tagDataObject) => {
      dispatch(addTagNote(tagDataObject));
    },
    removeTagNote: (tagDataObject) => {
      dispatch(removeTagNote(tagDataObject));
    },
  };
};

const LoadEditNote = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditNote);

export default withRouter(LoadEditNote);
