import {connect} from 'react-redux';

import Content from '../content';
import {startConfiguration} from '../redux/actions';

const ContentContainer = connect(
  state => ({
    teamcityService: state.teamcityService,
    investigations: state.investigations,
    investigationLoadErrorMessage: state.investigationLoadErrorMessage
  }),
  dispatch => ({
    onConfigure: () => dispatch(startConfiguration(false))
  })
)(Content);

ContentContainer.propTypes = {};

export default ContentContainer;
