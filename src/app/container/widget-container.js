import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Widget from '../widget';
import {reloadStatuses} from '../redux/actions';
import ConfigurationContainer from '../configuration/container/configuration-container';

import TitleContainer from './title-container';
import ContentContainer from './content-container';

const WidgetContainer = connect(
  (state, {dashboardApi}) => ({
    isConfiguring: state.configuration.isConfiguring,
    isLoadingBuildStatuses: state.isLoadingBuildStatuses,
    // eslint-disable-next-line no-magic-numbers
    refreshPeriod: state.refreshPeriod * 1000,
    dashboardApi,
    Title: TitleContainer,
    Configuration: ConfigurationContainer,
    Content: ContentContainer
  }),
  dispatch => ({
    onRefresh: () => dispatch(reloadStatuses())
  })
)(Widget);

WidgetContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default WidgetContainer;
