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

  async getSubProjects(teamcityService, project) {
    return await this._fetchTeamcity(teamcityService, 'projects', {
      locator: `affectedProject:(id:${project.id})`,
      fields: 'project(id,name,parentProjectId,archived)'
    });
  }

  async getBuildTypesOfProject(teamcityService, project) {
    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      locator: `affectedProject:(id:${project.id})`,
      fields: 'buildType(id,name,projectId)'
    });
  }

  async getBuildStatuses(teamcityService, project, buildTypes) {
    const locator = buildTypes.length > 0
      ? buildTypes.map(it => `item(id:${it.id})`).join(',')
      : `affectedProject:(id:${project.id})`;

    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      locator,
      fields: 'count,buildType(' +
        'id,webUrl,name,' +
        'builds(' +
        '$locator:(running:false,canceled:false,count:1),' +
        'build(number,webUrl,startDate,finishDate,status,statusText)' +
        '),' +
        'project(archived,id,name)' +
        ')'
    });
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
