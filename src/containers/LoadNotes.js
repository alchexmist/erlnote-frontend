import {connect} from 'react-redux';
import Notes from '../components/Notes';
import {updateNotes} from '../redux/actions/index';
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
  };
};

const LoadNotes = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notes);

export default withRouter(LoadNotes);
