import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';

import {
  applyConfiguration,
  closeConfiguration,
  failedInvestigationsLoading,
  failedTeamcityServicesLoading,
  finishedInvestigationsLoading,
  finishedTeamcityServicesLoading,
  openConfiguration,
  selectTeamcityService,
  setInitialSettings,
  startedInvestigationsLoading,
  startedTeamcityServicesLoading, updateHideChildProjects,
  updateRefreshPeriod, updateShowGreenBuilds,
  updateTitle
} from './actions';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_PERIOD = 300;

const reduce = createReducer({
  [setInitialSettings]: (state, {teamcityService, refreshPeriod, investigations, investigationsCount}) => ({
    ...state,
    teamcityService,
    refreshPeriod: refreshPeriod || DEFAULT_PERIOD,
    investigations: investigations || [],
    investigationsCount
  }),
  [openConfiguration]: (state, isInitialConfiguration) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: true,
      selectedTeamcityService: state.teamcityService,
      refreshPeriod: state.refreshPeriod,
      isInitialConfiguration
    }
  }),
  [updateTitle]: (state, title) => ({
    ...state,
    configuration: {
      ...state.configuration,
      title
    }
  }),
  [startedTeamcityServicesLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: true
    }
  }),
  [finishedTeamcityServicesLoading]: (state, services) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: services,
      serviceLoadErrorMessage: null,
      selectedTeamcityService: state.configuration.selectedTeamcityService || services[0]
    }
  }),
  [failedTeamcityServicesLoading]: (state, serviceLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: [],
      serviceLoadErrorMessage
    }
  }),
  [selectTeamcityService]: (state, selectedService) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedTeamcityService: selectedService
    }
  }),
  [updateShowGreenBuilds]: (state, showGreenBuilds) => ({
    ...state,
    configuration: {
      ...state.configuration,
      showGreenBuilds
    }
  }),
  [updateHideChildProjects]: (state, hideChildProjects) => ({
    ...state,
    configuration: {
      ...state.configuration,
      hideChildProjects
    }
  }),
  [updateRefreshPeriod]: (state, refreshPeriod) => ({
    ...state,
    configuration: {
      ...state.configuration,
      refreshPeriod
    }
  }),
  [applyConfiguration]: state => ({
    ...state,
    teamcityService: state.configuration.selectedTeamcityService,
    refreshPeriod: state.configuration.refreshPeriod
  }),
  [closeConfiguration]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: false
    }
  }),
  [startedInvestigationsLoading]: state => ({
    ...state,
    isLoadingInvestigations: true
  }),
  [finishedInvestigationsLoading]: (state, {investigations, investigationsCount}) => ({
    ...state,
    investigations,
    investigationsCount,
    isLoadingInvestigations: false,
    investigationLoadErrorMessage: null
  }),
  [failedInvestigationsLoading]: (state, investigationLoadErrorMessage) => ({
    ...state,
    investigations: [],
    investigationsCount: -1,
    isLoadingInvestigations: false,
    investigationLoadErrorMessage
  })
}, {
  teamcityService: {},
  investigations: [],
  isLoadingInvestigations: false,
  investigationLoadErrorMessage: null,
  investigationsCount: -1,
  refreshPeriod: DEFAULT_PERIOD,
  configuration: {
    isConfiguring: false,
    isInitialConfiguration: false,

    title: '',

    refreshPeriod: null,

    teamcityServices: [],
    isLoadingServices: false,
    selectedTeamcityService: null,
    serviceLoadErrorMessage: null,

    projects: [],
    isLoadingProjects: false,
    selectedProject: null,
    projectLoadErrorMessage: null,

    configurations: [],
    isLoadingConfigurations: false,
    selectedConfigurations: [],
    configurationLoadErrorMessage: null,

    showGreenBuilds: false,
    hideChildProjects: false
  }
});

export default (dashboardApi, registerWidgetApi) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reduce, composeEnhancers(applyMiddleware(
    thunkMiddleware.withExtraArgument({dashboardApi, registerWidgetApi})
  )));
};
