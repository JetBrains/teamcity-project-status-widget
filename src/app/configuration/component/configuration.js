import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {i18n} from 'hub-dashboard-addons/dist/localization';
import Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox';
import ConfigurationForm from '@jetbrains/hub-widget-ui/dist/configuration-form';

import styles from './configuration.css';

const Configuration = (
  {
    refreshPeriodControl,
    titleInput,
    serviceSelect,
    projectSelect,
    configurationSelect,

    showGreenBuilds,
    onShowGreenBuildsChange,

    hideChildProjects,
    onHideChildProjectsChange,

    isConfigurationComplete,
    onSave,
    onCancel
  }
) => (
  <ConfigurationForm
    onSave={onSave}
    onCancel={onCancel}
    isInvalid={!isConfigurationComplete}

    panelControls={[<span key={'refresh'}>{refreshPeriodControl}</span>]}
  >
    {titleInput}

    <div className={styles.container} data-test="service-select">
      {serviceSelect}
    </div>

    <div className={styles.container} data-test="project-select">
      {projectSelect}
    </div>

    <div className={styles.container} data-test="configuration-select">
      {configurationSelect}
    </div>

    <div
      className={classNames(styles.control, styles.controlFirst)}
      data-test="show-green-builds"
    >
      <Checkbox
        label={i18n('Show green builds')}
        checked={showGreenBuilds}
        onChange={onShowGreenBuildsChange}
      />
    </div>

    <div
      className={styles.control}
      data-test="hide-child-projects"
    >
      <Checkbox
        label={i18n('Hide child projects')}
        checked={hideChildProjects}
        onChange={onHideChildProjectsChange}
      />
    </div>
  </ConfigurationForm>
);

Configuration.propTypes = {
  refreshPeriodControl: PropTypes.node.isRequired,
  titleInput: PropTypes.node.isRequired,
  serviceSelect: PropTypes.node.isRequired,
  projectSelect: PropTypes.node.isRequired,
  configurationSelect: PropTypes.node.isRequired,

  showGreenBuilds: PropTypes.bool.isRequired,
  onShowGreenBuildsChange: PropTypes.func.isRequired,

  hideChildProjects: PropTypes.bool.isRequired,
  onHideChildProjectsChange: PropTypes.func.isRequired,

  isConfigurationComplete: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Configuration;
