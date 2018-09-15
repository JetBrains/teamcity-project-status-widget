import convertTeamcityResponse from './teamcity-convert';

const API_VER = '10.0';

export default class TeamcityService {

  constructor(dashboardApi) {
    this.dashboardApi = dashboardApi;
  }

  async getProjects(teamcityService) {
    return await this._fetchTeamcity(teamcityService, 'projects', {
      fields: 'project(id,name,parentProjectId,archived)'
    });
  }

  async getBuildTypes(teamcityService) {
    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      fields: 'buildType(id,name,projectId)'
    });
  }

  async getBuildTypesOfProject(teamcityService, projectId) {
    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      locator: `affectedProject:(id:${projectId})`,
      fields: 'buildType(id,name,projectId)'
    });
  }

  async getBuildType(teamcityService) {
    return await this._fetchTeamcity(teamcityService, 'builds/:locator');
  }

  /**
   * @deprecated
   */
  async getInvestigations(teamcityService, locator) {
    const teamcityResponse = await this.dashboardApi.fetch(
      teamcityService.id,
      `app/rest/${API_VER}/investigations`,
      {
        query: {
          locator
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
    return convertTeamcityResponse(teamcityService, teamcityResponse);
  }

  /**
   * @deprecated
   */
  async getMyInvestigations(teamcityService) {
    return await this.getInvestigations(teamcityService, 'state:TAKEN,assignee:current');
  }

  async _fetchTeamcity(teamcityService, path, query) {
    return await this.dashboardApi.fetch(
      teamcityService.id,
      `app/rest/${API_VER}/${path}`,
      {
        query,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
  }
}
