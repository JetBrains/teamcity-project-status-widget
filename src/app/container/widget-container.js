import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import Widget from '../widget';
import {reloadStatuses} from '../redux/actions';
import ConfigurationContainer from '../configuration/container/configuration-container';

import ContentContainer from './content-container';

function countFailedBuilds(buildTypes) {
  let counter = 0;
  buildTypes.forEach(buildType => {
    (buildType.builds.build || []).forEach(build => {
      if (build.status === 'FAILURE') {
        counter++;
      }
    });
  });
  return counter;
}

function getPresentationalWidgetTitle(state) {
  return {
    text: state.title ||
      (state.project
        ? i18n('Status: {{ project }}', {project: state.project.path})
        : i18n('Status')),
    counter: countFailedBuilds(state.buildStatuses || []),
    href: state.project &&
      state.project.id &&
      `${state.teamcityService.homeUrl}/project.html?projectId=${state.project.id}`
  };
}

const WidgetContainer = connect(
  (state, {dashboardApi}) => ({
    isConfiguring: state.configuration.isConfiguring,
    widgetLoader: state.isLoadingBuildStatuses,
    // eslint-disable-next-line no-magic-numbers
    tickPeriod: state.refreshPeriod * 1000,
    dashboardApi,
    Configuration: ConfigurationContainer,
    Content: ContentContainer,

    widgetTitle: state.configuration.isConfiguring
      ? i18n('Status')
      : getPresentationalWidgetTitle(state)
  }),
  dispatch => ({
    onTick: () => dispatch(reloadStatuses())
  })
)(Widget);

WidgetContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default WidgetContainer;
