import PropTypes from 'prop-types';
import React from 'react';

import Link from '@jetbrains/ring-ui/components/link/link';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './build-status.css';

const BuildStatus = ({buildType, path}) => (
  <div className={styles.build}>
    {JSON.stringify(buildType)}
    <Link
      target="_top"
      title={buildType.name}
      href={buildType.webUrl}
    >{path}</Link>
  </div>
);

BuildStatus.propTypes = {
  buildType: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired
};

export default BuildStatus;
