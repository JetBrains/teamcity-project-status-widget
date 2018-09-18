import {connect} from 'react-redux';

import Content from '../content';
import {startConfiguration} from '../redux/actions';

const ContentContainer = connect(
  state => ({
    teamcityService: state.teamcityService,
    project: state.project,
    buildStatuses: state.buildStatuses,
    buildPaths: state.buildPaths,
    buildStatusLoadErrorMessage: state.buildStatusLoadErrorMessage,
    showGreenBuilds: state.showGreenBuilds
  }),
  dispatch => ({
    onConfigure: () => dispatch(startConfiguration(false))
  })
)(Content);

ContentContainer.propTypes = {};

export default ContentContainer;
