import React from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';
import {i18n} from 'hub-dashboard-addons/dist/localization';

const project2Item = project => project && {
  key: project.id,
  label: project.name,
  project
};

/**
 * Checks if the project matches the query
 *
 * @param {TeamcityProject} project — project to test
 * @param {?string} query — query to fulfill
 * @returns {boolean} — if the project matches the query
 */
function isMatching(project, query) {
  return !query || query === '' || project.name.toLowerCase().includes(query.toLowerCase());
}

/**
 * Recursive search is any children satisfy query
 * @param {TeamcityProject[]} projects - array of projects
 * @param {string} query - query to fulfill
 * @returns {boolean} - satisfies or not
 */
function anyIsMatching(projects, query) {
  return projects.some(it =>
    isMatching(it, query) ||
    (it.children ? anyIsMatching(it.children, query) : false));
}

const filter = {
  fn: ({project}, query) => !query || anyIsMatching([project], query)
};

const ProjectSelect =
  ({isLoading, selectedProject, projectList, loadError, onProjectSelect}) => (
    <Select
      label={i18n('Select project')}
      multiple={false}
      loading={isLoading}
      filter={filter}
      selected={project2Item(selectedProject)}
      size={Select.Size.FULL}
      minWidth={MinWidth.TARGET}
      data={(projectList || []).map(project2Item)}
      notFoundMessage={loadError}
      onSelect={onProjectSelect}
    />
  );

const PROJECT_PROPS = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.number
};

ProjectSelect.propTypes = {
  isLoading: PropTypes.bool,
  selectedProject: PropTypes.shape(PROJECT_PROPS),
  projectList: PropTypes.arrayOf(PropTypes.shape(PROJECT_PROPS)),
  loadError: PropTypes.string,
  onProjectSelect: PropTypes.func.isRequired
};

export default ProjectSelect;
