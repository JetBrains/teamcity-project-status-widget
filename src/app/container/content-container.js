import {connect} from 'react-redux';

import Content from '../content';
import {startConfiguration} from '../redux/actions';

const ContentContainer = connect(
  state => ({
    teamcityService: state.teamcityService,
    project: state.project,
    buildStatuses: state.buildStatuses,
    buildStatusLoadErrorMessage: state.buildStatusLoadErrorMessage
  }),
  dispatch => ({
    onConfigure: () => dispatch(startConfiguration(false))
  })
)(Content);

ContentContainer.propTypes = {};

export default ContentContainer;
