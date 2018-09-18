import {createAction} from 'redux-act';

import TeamcityService from '../teamcity/teamcity-service';
import {asFlattenBuildTypeTree, asFlattenProjectTree} from '../teamcity/teamcity-convert';

export const setInitialSettings = createAction('Set initial settings');
export const openConfiguration = createAction('Open configuration mode');
export const updateRefreshPeriod = createAction('Update refresh period');

export const updateTitle = createAction('Update title');

export const startedTeamcityServicesLoading =
  createAction('Started loading list of TeamCity services');
export const finishedTeamcityServicesLoading =
  createAction('Finished loading list of TeamCity services');
export const failedTeamcityServicesLoading =
  createAction('Failed to load list of TeamCity services');
export const selectTeamcityService =
  createAction('Select TeamCity service');

export const startedProjectsLoading =
  createAction('Started loading list of projects');
export const finishedProjectsLoading =
  createAction('Finished loading list of projects');
export const failedProjectsLoading =
  createAction('Failed to load list of projects');
export const selectProject =
  createAction('Select project');

export const startedBuildTypesLoading =
  createAction('Started loading list of build types');
export const finishedBuildTypesLoading =
  createAction('Finished loading list of build types');
export const failedBuildTypesLoading =
  createAction('Failed to load list of build types');
export const selectBuildType =
  createAction('Add selected build type');
export const deselectBuildType =
  createAction('Add selected build type');

export const updateShowGreenBuilds =
  createAction('Toggle show green builds checkbox');

export const updateHideChildProjects =
  createAction('Toggle hide child projects');

export const applyConfiguration = createAction('Apply configuration');
export const closeConfiguration = createAction('Close configuration mode');

export const startedStatusLoading =
  createAction('Started loading project builds statuses');
export const finishedStatusLoading =
  createAction('Finished loading project builds statuses');
export const failedStatusLoading =
  createAction('Failed to load project builds statuses');

// eslint-disable-next-line complexity
export const reloadStatuses = () => async (dispatch, getState, {dashboardApi}) => {
  const {
    teamcityService,
    project,
    buildTypes,
    hideChildProjects
  } = getState();
  if (teamcityService && project && buildTypes) {
    await dispatch(startedStatusLoading());

    const server = new TeamcityService(dashboardApi);
    try {
      const buildStatusRequest = server.getBuildStatuses(
        teamcityService,
        project,
        buildTypes,
        hideChildProjects
      );
      const buildPathsRequest = server.getPaths(teamcityService, project);
      const [buildStatusResponse, buildPaths] = await Promise.all([
        buildStatusRequest,
        buildPathsRequest
      ]);
      const buildStatuses = buildStatusResponse.buildType;
      await dashboardApi.storeCache({buildStatuses, buildPaths});
      await dispatch(finishedStatusLoading(buildStatuses));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      await dispatch(failedStatusLoading(error));
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

export const loadProjects = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {selectedTeamcityService}} = getState();
  if (selectedTeamcityService) {
    await dispatch(startedProjectsLoading());
    try {
      const teamcityService = new TeamcityService(dashboardApi);
      const projectsResponse = await teamcityService.getProjects(selectedTeamcityService);
      await dispatch(finishedProjectsLoading(asFlattenProjectTree(projectsResponse)));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      const message = `Cannot load list of TeamCity projects: ${error}`;
      await dispatch(failedProjectsLoading(message));
    }
  }
};

export const loadBuildTypes = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {selectedTeamcityService, selectedProject}} = getState();
  if (selectedTeamcityService && selectedProject) {
    await dispatch(startedBuildTypesLoading());
    try {
      const teamcityService = new TeamcityService(dashboardApi);
      const [projectsResponse, buildTypesResponse] = await Promise.all([
        teamcityService.getSubProjects(selectedTeamcityService, selectedProject),
        teamcityService.getBuildTypesOfProject(selectedTeamcityService, selectedProject)
      ]);
      const projectsAndBuildTypesTree = asFlattenBuildTypeTree(
        selectedProject,
        projectsResponse,
        buildTypesResponse
      );
      await dispatch(finishedBuildTypesLoading(projectsAndBuildTypesTree));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      const message = `Cannot load list of TeamCity configurations: ${error}`;
      await dispatch(failedBuildTypesLoading(message));
    }
  }
};

export const startConfiguration = isInitialConfiguration =>
  async dispatch => {
    await dispatch(openConfiguration(isInitialConfiguration));
    await dispatch(loadTeamCityServices());
  };

export const saveConfiguration = () => async (dispatch, getState, {dashboardApi}) => {
  const {
    configuration: {
      title,
      selectedTeamcityService,
      selectedProject,
      selectedBuildTypes,
      showGreenBuilds,
      hideChildProjects,
      refreshPeriod
    }
  } = getState();
  await dashboardApi.storeConfig({
    title,
    teamcityService: selectedTeamcityService,
    project: selectedProject && {
      id: selectedProject.id,
      name: selectedProject.name,
      path: selectedProject.path
    },
    buildTypes: selectedBuildTypes && selectedBuildTypes.map(it => ({
      id: it.id,
      name: it.name,
      path: it.path
    })),
    showGreenBuilds,
    hideChildProjects,
    refreshPeriod
  });
  await dispatch(applyConfiguration());
  await dispatch(closeConfiguration());
  await dispatch(reloadStatuses());
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
    onRefresh: () => dispatch(reloadStatuses())
  });
  const config = await dashboardApi.readConfig();
  const {
    title,
    teamcityService,
    project,
    buildTypes,
    showGreenBuilds,
    hideChildProjects,
    refreshPeriod
  } = config || {};
  const {result: {buildStatuses, buildPaths}} = ((await dashboardApi.readCache())) || {result: {}};
  await dispatch(setInitialSettings({
    title,
    teamcityService,
    project,
    buildTypes: buildTypes || [],
    showGreenBuilds: showGreenBuilds || false,
    hideChildProjects: hideChildProjects || false,
    refreshPeriod,
    buildStatuses,
    buildPaths
  }));
  await dispatch(reloadStatuses());
  if (!config) {
    await dispatch(startConfiguration(true));
  }
};
