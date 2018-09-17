import React from 'react';
import {connect} from 'react-redux';

import Configuration from '../component/configuration';
import {
  cancelConfiguration,
  saveConfiguration,
  updateHideChildProjects,
  updateShowGreenBuilds
} from '../../redux/actions';

import TitleInputContainer from './title-input-container';
import ServiceSelectContainer from './service-select-container';
import RefreshPeriodContainer from './refresh-period-container';
import ProjectSelectContainer from './project-select-container';
import BuildTypeSelectContainer from './build-type-select-container';


const ConfigurationContainer = connect(
  state => ({
    refreshPeriodControl: <RefreshPeriodContainer/>,
    titleInput: <TitleInputContainer/>,
    serviceSelect: <ServiceSelectContainer/>,
    projectSelect: <ProjectSelectContainer/>,
    configurationSelect: <BuildTypeSelectContainer/>,

    showGreenBuilds: state.configuration.showGreenBuilds,

    hideChildProjects: state.configuration.hideChildProjects
  }),
  dispatch => ({
    onShowGreenBuildsChange: event => dispatch(updateShowGreenBuilds(event.target.checked)),
    onHideChildProjectsChange: event => dispatch(updateHideChildProjects(event.target.checked)),
    onSave: () => dispatch(saveConfiguration()),
    onCancel: () => dispatch(cancelConfiguration())
  })
)(Configuration);

ConfigurationContainer.propTypes = {};


export default ConfigurationContainer;
