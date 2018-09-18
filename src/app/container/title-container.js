import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import WidgetTitle from '@jetbrains/hub-widget-ui/dist/widget-title';

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

const TitleContainer = connect(
  (state, {dashboardApi}) => (state.configuration.isConfiguring
    ? {
      title: i18n('Status'),
      counter: -1,
      href: null,
      dashboardApi
    }
    : {
      title: state.title ||
        (state.project
          ? i18n('Status: {{ project }}', {project: state.project.path})
          : i18n('Status')),
      counter: countFailedBuilds(state.buildStatuses || []),
      href: state.project &&
        state.project.id &&
        `${state.teamcityService.homeUrl}/project.html?projectId=${state.project.id}`,
      dashboardApi
    })
)(WidgetTitle);

TitleContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default TitleContainer;
