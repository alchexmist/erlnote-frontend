import {connect} from 'react-redux';
import MainContent from '../components/MainContent';
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

const LoadMainContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainContent);

export default withRouter(LoadMainContent);
