import convertTeamcityResponse from './teamcity-convert';

const API_VER = '10.0';

export default class TeamcityService {

  constructor(dashboardApi) {
    this.dashboardApi = dashboardApi;
  }

  async getProjects(teamcityService) {
    return await this._fetchTeamcity(teamcityService, 'projects', {
      fields: this.recursiveConvertHash({
        project: ['id', 'name', 'parentProjectId', 'archived']
      })
    });
  }

  async getBuildTypes(teamcityService) {
    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      fields: this.recursiveConvertHash({
        buildType: ['id', 'name', 'projectId']
      })
    });
  }

  async getBuildTypesOfProject(teamcityService, projectId) {
    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      locator: this.recursiveConvertHash({
        affectedProject: {id: projectId}
      }),
      fields: this.recursiveConvertHash({
        buildType: ['id', 'name', 'projectId']
      })
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
          locator: this.recursiveConvertHash(locator)
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
    return await this.getInvestigations(teamcityService, {
      state: 'TAKEN',
      assignee: 'current'
    });
  }

  /**
   * @deprecated
   */
  async getProjectInvestigations(teamcityService, projectId) {
    return await this.getInvestigations(teamcityService, {
      affectedProject: {id: projectId}
    });
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

  recursiveConvertHash = input => Object.entries(input).map(([key, val]) => {
    if (!val) {
      return null;
    } else if (typeof val === 'object') {
      return `${key}(${this.recursiveConvertHash(val)})`;
    } else if (Array.isArray(val)) {
      return `${key}(${val.map(this.recursiveConvertHash).join(',')})`;
    } else {
      return `${key}:${val}`;
    }
  }).filter(it => it).join(',')
}
