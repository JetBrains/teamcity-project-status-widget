/**
 * @typedef {object} TeamcityProject
 * @property {string} id - project ID
 * @property {string} name - project name
 * @property {string} path - project path
 * @property {?string} parentProjectId - ID of a parent project
 * @property {?TeamcityProject} parent - parent project
 * @property {boolean} archived - is project archived
 * @property {number} level - project nesting level
 * @property {?TeamcityProject[]} children - sub-projects
 * @property {?TeamcityBuildType[]} buildTypes - nested build types
 */

/**
 * @typedef {object} TeamcityBuildType
 * @property {string} id - build type ID
 * @property {string} projectId - an ID of the containing project
 * @property {string} name - build type name
 * @property {string} path - path to build type separated with ::
 * @property {number} level - build type nesting level
 * @property {boolean} isBuildType - true if the object is a build type
 * @property {?TeamcityProject} parent - parent project
 */

/**
 * @param {TeamcityProject[]} projects - projects to filter
 * @returns {TeamcityProject[]} - projects except archived
 */
function filterNotArchivedAndNotRoot(projects) {
  return projects.filter(project => !project.archived && project.id !== '_Root');
}

/**
 * Turns an array into a hash-map.
 *
 * @param {object[]} array - array to associate by
 * @param {function(item:object):string} key - function to get key from an ite
 * @returns {object} - object that is a hash-map for its elements
 */
function associateBy(array, key) {
  const map = {};
  array.forEach(it => (map[key(it)] = it));
  return map;
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
 * Converts TeamCity projects to a tree of TeamCity projects.
 *
 * @param {TeamcityProject[]} projects - TeamCity project response
 * @param {object} projectMap - ID to project map
 * @return {TeamcityProject[]} tree presentation of TeamCity projects
 */
function asProjectTree(projects, projectMap) {
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
  const projects = filterNotArchivedAndNotRoot(projectResponse.project || []);
  const projectMap = associateBy(projects, project => project.id);
  const roots = asProjectTree(projects, projectMap);

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

/**
 * Builds flatten project and build type tree
 *
 * @param {TeamcityProject} rootProject - TeamCity project
 * @param {{project: TeamcityProject[]}} projectResponse - TeamCity projects response
 * @param {{buildType: TeamcityBuildType[]}} buildTypeResponse - TeamCity buildTypes response
 * @returns {(TeamcityProject|TeamcityBuildType)[]} flatten tree of projects and build types
 */
export function asFlattenBuildTypeTree(rootProject, projectResponse, buildTypeResponse) {
  const projects = filterNotArchivedAndNotRoot(projectResponse.project || []);
  const projectMap = associateBy(projects, project => project.id);

  const roots = asProjectTree(projects, projectMap);

  const buildTypes = buildTypeResponse.buildType;

  buildTypes.forEach(buildType => {
    const parent = projectMap[buildType.projectId];
    if (parent) {
      const childBuildTypes = parent.buildTypes || [];
      childBuildTypes.push(buildType);
      parent.buildTypes = childBuildTypes;
      buildType.parent = parent;
      buildType.path = `${parent.path} :: ${buildType.name}`;
    } else if (buildType.projectId === rootProject.id) {
      roots.push(buildType);
      buildType.path = buildType.name;
    }
    buildType.isBuildType = true;
  });

  const flattenProjectsAndBuildTypes = [];
  let currentLevel = 0;

  /**
   * Flattens project tree
   *
   * @param {TeamcityProject} node - project to flatten
   * @returns {undefined}
   */
  function flattenTree(node) {
    node.level = currentLevel;
    flattenProjectsAndBuildTypes.push(node);
    currentLevel++;
    if (node.children) {
      node.children.forEach(flattenTree);
    }
    if (node.buildTypes) {
      node.buildTypes.forEach(flattenTree);
    }
    currentLevel--;
  }

  roots.forEach(flattenTree);

  return flattenProjectsAndBuildTypes;
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
