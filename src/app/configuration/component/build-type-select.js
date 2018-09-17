import React from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';
import {i18n} from 'hub-dashboard-addons/dist/localization';

function buildType2Item(buildType) {
  return buildType && {
    key: buildType.id,
    label: buildType.name,
    // eslint-disable-next-line no-magic-numbers
    level: buildType.level * 2,
    project: buildType
  };
}

/**
 * Checks if the project or buildType matches the query
 *
 * @param {TeamcityBuildType|TeamcityProject} configuration — configuration to test
 * @param {?string} query — query to fulfill
 * @returns {boolean} — if the configuration matches the query
 */
function isMatching(configuration, query) {
  return !query || query === '' || configuration.path.toLowerCase().includes(query.toLowerCase());
}

/**
 * Recursive search if any child satisfies query
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

const BuildTypeSelect =
  ({isLoading, isDisabled, selectedBuildTypes, projectAndBuildTypeList, loadError, onBuildTypeSelect, onOpen}) => (
    <Select
      selectedLabel={i18n('Build configurations')}
      label={i18n('All build configurations')}
      multiple={true}
      loading={isLoading}
      disabled={isDisabled}
      filter={filter}
      selected={selectedBuildTypes}
      size={Select.Size.FULL}
      minWidth={MinWidth.TARGET}
      data={(projectAndBuildTypeList || []).map(buildType2Item)}
      notFoundMessage={loadError}
      onSelect={onBuildTypeSelect}
      onOpen={onOpen}
    />
  );

const BUILD_TYPE_PROPS = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  level: PropTypes.number,
  parent: PropTypes.object
};

BuildTypeSelect.propTypes = {
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  selectedBuildTypes: PropTypes.arrayOf(PropTypes.shape(BUILD_TYPE_PROPS)),
  projectAndBuildTypeList: PropTypes.arrayOf(PropTypes.shape(BUILD_TYPE_PROPS)),
  loadError: PropTypes.string,
  onBuildTypeSelect: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default BuildTypeSelect;
