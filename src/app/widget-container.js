import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import WidgetTitle from '@jetbrains/hub-widget-ui/dist/widget-title';

import Widget from './widget';
import Configuration from './configuration';
import Content from './content';

import {
  cancelConfiguration,
  reloadInvestigations,
  saveConfiguration,
  selectTeamcityService,
  startConfiguration,
  updateRefreshPeriod,
  updateTitle
} from './redux/actions';

const TitleContainer = connect(
  (state, {dashboardApi}) => (state.configuration.isConfiguring
    ? {
      title: i18n('TeamCity Investigations'),
      counter: -1,
      href: null,
      dashboardApi
    }
    : {
      title: i18n('TeamCity Investigations'),
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

const ConfigurationContainer = connect(
  state => ({
    refreshPeriod: state.configuration.refreshPeriod,

    title: state.configuration.title,

    isLoadingServices: state.configuration.isLoadingServices,
    selectedService: state.configuration.selectedTeamcityService,
    serviceList: state.configuration.teamcityServices,
    serviceNotFoundMessage: state.configuration.serviceLoadErrorMessage
  }),
  dispatch => ({
    onRefreshPeriodUpdate: newSeconds => dispatch(updateRefreshPeriod(newSeconds)),
    onServiceSelect: selectedItem => dispatch(selectTeamcityService(selectedItem.service)),
    onTitleChange: event => dispatch(updateTitle(event.target.value)),
    onSave: () => dispatch(saveConfiguration()),
    onCancel: () => dispatch(cancelConfiguration())
  })
)(Configuration);

ConfigurationContainer.propTypes = {};

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

const WidgetContainer = connect(
  (state, {dashboardApi}) => ({
    isConfiguring: state.configuration.isConfiguring,
    isLoadingInvestigations: state.isLoadingInvestigations,
    // eslint-disable-next-line no-magic-numbers
    refreshPeriod: state.refreshPeriod * 1000,
    dashboardApi,
    Title: TitleContainer,
    Configuration: ConfigurationContainer,
    Content: ContentContainer
  }),
  dispatch => ({
    onRefresh: () => dispatch(reloadInvestigations())
  })
)(Widget);

WidgetContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default WidgetContainer;
