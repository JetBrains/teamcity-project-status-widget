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

    showGreenBuilds,
    onShowGreenBuildsChange,

    hideChildProjects,
    onHideChildProjectsChange,

    onSave,
    onCancel
  }
) => (
  <ConfigurationForm
    saveButtonLabel={i18n('Save')}
    onSave={onSave}

    cancelButtonLabel={i18n('Cancel')}
    onCancel={onCancel}

    panelControls={[refreshPeriodControl]}
  >
    {titleInput}
    {serviceSelect}

    <div className={classNames(styles.control, styles.controlFirst)}>
      <Checkbox
        label={i18n('Show green builds')}
        checked={showGreenBuilds}
        onChange={onShowGreenBuildsChange}
      />
    </div>

    <div className={styles.control}>
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

  showGreenBuilds: PropTypes.bool.isRequired,
  onShowGreenBuildsChange: PropTypes.func.isRequired,

  hideChildProjects: PropTypes.bool.isRequired,
  onHideChildProjectsChange: PropTypes.func.isRequired,

  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Configuration;
