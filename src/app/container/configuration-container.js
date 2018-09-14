import {connect} from 'react-redux';

import Configuration from '../configuration';

import {
  cancelConfiguration,
  saveConfiguration,
  selectTeamcityService,
  updateHideChildProjects,
  updateRefreshPeriod,
  updateShowGreenBuilds,
  updateTitle
} from '../redux/actions';


const ConfigurationContainer = connect(
  state => ({
    refreshPeriod: state.configuration.refreshPeriod,

    title: state.configuration.title,

    isLoadingServices: state.configuration.isLoadingServices,
    selectedService: state.configuration.selectedTeamcityService,
    serviceList: state.configuration.teamcityServices,
    serviceNotFoundMessage: state.configuration.serviceLoadErrorMessage,

    showGreenBuilds: state.configuration.showGreenBuilds,

    hideChildProjects: state.configuration.hideChildProjects
  }),
  dispatch => ({
    onRefreshPeriodUpdate: newSeconds => dispatch(updateRefreshPeriod(newSeconds)),
    onServiceSelect: selectedItem => dispatch(selectTeamcityService(selectedItem.service)),
    onTitleChange: event => dispatch(updateTitle(event.target.value)),
    onShowGreenBuildsChange: event => dispatch(updateShowGreenBuilds(event.target.checked)),
    onHideChildProjectsChange: event => dispatch(updateHideChildProjects(event.target.checked)),
    onSave: () => dispatch(saveConfiguration()),
    onCancel: () => dispatch(cancelConfiguration())
  })
)(Configuration);

ConfigurationContainer.propTypes = {};


export default ConfigurationContainer;
