import TeamcityService from '../teamcity/teamcity-service';

function fixConfigProject(config) {
  const {project} = config;
  if (project && project.path) {
    const newProjectPath = project.path.replace(/\b:\b/g, ' :: ');
    if (newProjectPath !== project.path) {
      project.path = newProjectPath;
      return true;
    }
  }
  return false;
}

async function fixBuildTypes(config, dashboardApi) {
  const {teamcityService, buildTypes} = config;
  if (teamcityService &&
    buildTypes &&
    buildTypes.length &&
    buildTypes.some(it => !it.name || !it.path)
  ) {
    const service = new TeamcityService(dashboardApi);
    config.buildTypes = await service.getBuildTypes(teamcityService, buildTypes);
    config.buildTypes.forEach(it => {
      it.path = it.name;
    });
    return true;
  }
  return false;
}

export async function fixedConfig(dashboardApi) {
  const config = await dashboardApi.readConfig();
  try {
    const wasFixed = fixConfigProject(config) |
      await fixBuildTypes(config, dashboardApi);

    if (wasFixed) {
      await dashboardApi.storeConfig(config);
    }
  } catch (e) {
    // Ignore
  }

  return config;
}
