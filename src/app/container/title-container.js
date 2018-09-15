import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import WidgetTitle from '@jetbrains/hub-widget-ui/dist/widget-title';

const TitleContainer = connect(
  (state, {dashboardApi}) => (state.configuration.isConfiguring
    ? {
      title: i18n('Status'),
      counter: -1,
      href: null,
      dashboardApi
    }
    : {
      title: state.title || (state.project ? i18n('Status: {{ project }}', {project: state.project.path}) : i18n('Status')),
      counter: state.investigationsCount,
      href: state.teamcityService &&
        state.teamcityService.homeUrl &&
        `${state.teamcityService.homeUrl}/investigations.html`,
      dashboardApi
    })
)(WidgetTitle);

TitleContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default TitleContainer;
