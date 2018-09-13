import {createAction} from 'redux-act';

import TeamcityService from '../teamcity/teamcity-service';

export const setInitialSettings = createAction('Set initial settings');
export const openConfiguration = createAction('Open configuration mode');
export const selectTeamcityService = createAction('Select TeamCity service');
export const updateRefreshPeriod = createAction('Update refresh period');
export const startedTeamcityServicesLoading =
  createAction('Started loading list of TeamCity services');
export const finishedTeamcityServicesLoading =
  createAction('Finished loading list of TeamCity services');
export const failedTeamcityServicesLoading =
  createAction('Failed to load list of TeamCity services');
export const applyConfiguration = createAction('Apply configuration');
export const closeConfiguration = createAction('Close configuration mode');
export const startedInvestigationsLoading =
  createAction('Started loading list of investigations');
export const finishedInvestigationsLoading =
  createAction('Finished loading list of investigations');
export const failedInvestigationsLoading =
  createAction('Failed to load list of investigations');

export const reloadInvestigations = () => async (dispatch, getState, {dashboardApi}) => {
  const {teamcityService} = getState();
  if (teamcityService) {
    await dispatch(startedInvestigationsLoading());

    const server = new TeamcityService(dashboardApi);
    try {
      const investigations = await server.getMyInvestigations(teamcityService);
      await dashboardApi.storeCache(investigations);
      await dispatch(finishedInvestigationsLoading({
        investigations: investigations.data,
        investigationsCount: investigations.count
      }));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      await dispatch(failedInvestigationsLoading(error));
    }
  }
};

export const loadTeamCityServices = () => async (dispatch, getState, {dashboardApi}) => {
  await dispatch(startedTeamcityServicesLoading());
  try {
    const servicesPage = await dashboardApi.fetchHub(
      'api/rest/services', {
        query: {
          query: 'applicationName: TeamCity',
          fields: 'id,name,homeUrl',
          $skip: 0,
          $top: -1
        }
      }
    );
    await dispatch(finishedTeamcityServicesLoading(servicesPage.services || []));
  } catch (e) {
    const error = (e.data && e.data.message) || e.message || e.toString();
    const message = `Cannot load list of TeamCity services: ${error}`;
    await dispatch(failedTeamcityServicesLoading(message));
  }
};

export const startConfiguration = isInitialConfiguration =>
  async dispatch => {
    await dispatch(openConfiguration(isInitialConfiguration));
    await dispatch(loadTeamCityServices());
  };

export const saveConfiguration = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {selectedTeamcityService, refreshPeriod}} = getState();
  await dashboardApi.storeConfig({
    teamcityService: selectedTeamcityService,
    refreshPeriod
  });
  await dispatch(applyConfiguration());
  await dispatch(closeConfiguration());
  await dispatch(reloadInvestigations());
};

export const cancelConfiguration = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {isInitialConfiguration}} = getState();
  await dispatch(closeConfiguration());
  if (isInitialConfiguration) {
    await dashboardApi.removeWidget();
  }
};

export const initWidget = () => async (dispatch, getState, {dashboardApi, registerWidgetApi}) => {
  registerWidgetApi({
    onConfigure: () => dispatch(startConfiguration(false)),
    onRefresh: () => dispatch(reloadInvestigations())
  });
  const config = await dashboardApi.readConfig();
  const {teamcityService, refreshPeriod} = config || {};
  const {result: {data: investigations, count}} = (await dashboardApi.readCache()) || {result: {}};
  await dispatch(setInitialSettings({
    teamcityService,
    refreshPeriod,
    investigations,
    investigationsCount: count
  }));
  await dispatch(reloadInvestigations());
  if (!config) {
    await dispatch(startConfiguration(true));
  }
};
