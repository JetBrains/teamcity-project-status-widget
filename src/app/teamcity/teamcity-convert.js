/**
 * @typedef {object} TeamcityProject
 * @property {string} id - project ID
 * @property {string} name - project name
 * @property {string} path - returns project path
 * @property {?string} parentProjectId - ID of a parent project
 * @property {?TeamcityProject} parent - parent project
 * @property {boolean} archived - is project archived
 * @property {number} level - project nesting level
 * @property {?TeamcityProject[]} children - sub-projects
 */

/**
 * @param {TeamcityProject[]} projects - projects to filter
 * @returns {TeamcityProject[]} - projects except archived
 */
function filterNotArchivedAndNotRoot(projects) {
  return projects.filter(project => !project.archived && project.id !== '_Root');
}

/**
 * Build a map of project ID to project
 *
 * @param {TeamcityProject[]} projects — projects to build a map for
 * @returns {object} — project ID to project map
 */
function projectsAsMap(projects) {
  const projectMap = {};
  projects.forEach(project => (projectMap[project.id] = project));
  return projectMap;
}

/**
 * Returns project path
 *
 * @param {TeamcityProject} project - project to build path for
 * @return {string} - project path
 */
function getPath(project) {
  const path = [];
  for (let cur = project; cur != null; cur = cur.parent) {
    path.unshift(cur.name);
  }
  return path.join(' :: ');
}

/**
 * Converts TeamCity projects response to a tree of TeamCity projects.
 *
 * @param {{project: TeamcityProject[]}} projectResponse - TeamCity project response
 * @return {TeamcityProject[]} tree presentation of TeamCity projects
 */
function asProjectTree(projectResponse) {
  const projects = filterNotArchivedAndNotRoot(projectResponse.project || []);
  const projectMap = projectsAsMap(projects);

  // Build a forest of projects
  const roots = [];
  projects.forEach(project => {
    const parent = projectMap[project.parentProjectId];
    if (parent) {
      const children = parent.children || [];
      children.push(project);
      parent.children = children;
      project.parent = parent;
    } else {
      roots.push(project);
    }
  });

  projects.forEach(project => {
    project.path = getPath(project);
  });

  return roots;
}

/**
 * Converts TeamCity projects response to a list of TeamCity projects with levels.
 *
 * @param {{project: TeamcityProject[]}} projectResponse - TeamCity project response
 * @return {TeamcityProject[]} flatten tree presentation of TeamCity projects
 */
export function asFlattenProjectTree(projectResponse) {
  const roots = asProjectTree(projectResponse);

  const flattenProjects = [];
  let currentLevel = 0;

  /**
   * Flattens project tree
   *
   * @param {TeamcityProject} node - project to flatten
   * @returns {undefined}
   */
  function flattenTree(node) {
    node.level = currentLevel;
    flattenProjects.push(node);
    if (node.children) {
      currentLevel++;
      node.children.forEach(flattenTree);
      currentLevel--;
    }
  }

  roots.forEach(flattenTree);

  return flattenProjects;
}


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
