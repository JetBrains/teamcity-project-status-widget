function investigationToItem(investigation) {
  let item;
  if (investigation.scope.buildTypes) {
    const buildType = investigation.scope.buildTypes.buildType[0];
    item = {
      id: buildType.id,
      name: `${buildType.projectName} :: ${buildType.name}`,
      url: buildType.webUrl,
      tests: [],
      problems: []
    };
  } else if (investigation.scope.project) {
    const project = investigation.scope.project;
    item = {
      id: project.id,
      name: `${project.parentProjectId} :: ${project.name}`,
      url: project.webUrl,
      tests: [],
      problems: []
    };
  } else {
    item = null;
  }
  return item;
}

function test2investigationDetail(teamcityService, test) {
  return {
    id: test.id,
    text: test.name,
    url: `${teamcityService.homeUrl}/investigations.html#testNameId${test.id}`
  };
}

function problem2investigationDetail(problem) {
  return {
    id: problem.id,
    text: problem.type,
    url: null
  };
}

/**
 * @param {{id:string,homeUrl:string}} teamcityService teamcity service
 * @param {any} teamcityInvestigationsResponse teamcity investigation response
 * @return {{
 *     id: string,
 *     name: string,
 *     url: string,
 *     tests: {
 *         id: string,
 *         text: string,
 *         url: string?
 *     }[],
 *     problems: {
 *         id: string,
 *         text: string,
 *         url: string?
 *     }[]
 * }[]} investigation object
 */
export default function convertTeamcityResponse(teamcityService, teamcityInvestigationsResponse) {
  const result = {};
  (teamcityInvestigationsResponse.investigation || []).forEach(investigation => {
    const newItem = investigationToItem(investigation);
    if (newItem != null) {
      const item = result[newItem.id] || (result[newItem.id] = newItem);

      if (investigation.target.tests) {
        item.tests = item.tests.concat(investigation.target.tests.test.map(it =>
          test2investigationDetail(teamcityService, it)
        ));
      }
      if (investigation.target.problems) {
        item.problems = item.problems.concat(investigation.target.problems.problem.map(it =>
          problem2investigationDetail(it)
        ));
      }
    }
  });
  return {
    count: teamcityInvestigationsResponse.count || 0,
    data: Object.values(result)
  };
}
