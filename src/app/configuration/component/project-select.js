import React from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';
import {i18n} from 'hub-dashboard-addons/dist/localization';

function project2Item(project) {
  return project && {
    key: project.id,
    label: project.name,
    // eslint-disable-next-line no-magic-numbers
    level: project.level * 2,
    project
  };
}

function project2Selected(project) {
  return project && {
    key: project.id,
    label: project.getPath()
  };
}

/**
 * Checks if the project matches the query
 *
 * @param {TeamcityProject} project — project to test
 * @param {?string} query — query to fulfill
 * @returns {boolean} — if the project matches the query
 */
function isMatching(project, query) {
  return !query || query === '' || project.getPath().toLowerCase().includes(query.toLowerCase());
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
  placeholder: i18n('Filter projects'),
  fn: ({project}, query) => !query || anyIsMatching([project], query.replace(/\s*((::\s*)|(:$))/g, ' :: '))
};

const ProjectSelect =
  ({isLoading, isDisabled, selectedProject, projectList, loadError, onProjectSelect, onOpen}) => (
    <Select
      selectedLabel={i18n('Project')}
      label={i18n('Select project')}
      multiple={false}
      loading={isLoading}
      disabled={isDisabled}
      filter={filter}
      selected={project2Selected(selectedProject)}
      size={Select.Size.FULL}
      minWidth={MinWidth.TARGET}
      data={(projectList || []).map(project2Item)}
      notFoundMessage={loadError}
      onSelect={onProjectSelect}
      onOpen={onOpen}
    />
  );

const PROJECT_PROPS = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  getPath: PropTypes.func.isRequired,
  level: PropTypes.number,
  parent: PropTypes.object
};

ProjectSelect.propTypes = {
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  selectedProject: PropTypes.shape(PROJECT_PROPS),
  projectList: PropTypes.arrayOf(PropTypes.shape(PROJECT_PROPS)),
  loadError: PropTypes.string,
  onProjectSelect: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default ProjectSelect;
