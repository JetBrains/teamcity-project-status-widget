const API_VER = 'latest';

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

  async getBuildStatuses(teamcityService, project, buildTypes, hideChildProjects) {
    let locator;
    if (buildTypes.length > 0) {
      locator = buildTypes.map(it => `item(id:${it.id})`).join(',');
    } else if (hideChildProjects) {
      locator = `project:(id:${project.id})`;
    } else {
      locator = `affectedProject:(id:${project.id}),project:(archived:false)`;
    }

    return await this._fetchTeamcity(teamcityService, 'buildTypes', {
      locator,
      fields: 'count,nextHref,buildType(' +
        'id,webUrl,name,' +
        'builds(' +
        '$locator:(running:false,canceled:false,count:1),' +
        'build(number,webUrl,startDate,finishDate,status,statusText)' +
        '),' +
        'investigations(investigation(' +
        'assignee(name,username),' +
        'assignment(user(name,username),timestamp,text),' +
        'resolution(type))' +
        '),' +
        'project(archived,id,name)' +
        ')'
    });
  }

  async getPaths(teamcityService, project) {
    const [projectResponse, buildTypeResponse] = await Promise.all([
      this.getSubProjects(teamcityService, project),
      this.getBuildTypesOfProject(teamcityService, project)
    ]);

    const projects = projectResponse.project;

    const projectMap = {};
    projects.forEach(it => (projectMap[it.id] = it));

    const paths = {};
    buildTypeResponse.buildType.forEach(buildType => {
      const path = [buildType.name];
      for (let cur = projectMap[buildType.projectId]; cur; cur = projectMap[cur.parentProjectId]) {
        path.unshift(cur.name);
      }
      paths[buildType.id] = path.join(' :: ');
    });

    return paths;
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
