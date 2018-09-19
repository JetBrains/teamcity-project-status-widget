/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';


import Link from '@jetbrains/ring-ui/components/link/link';
import Icon, {Size} from '@jetbrains/ring-ui/components/icon/icon';
import Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';
import {SuccessIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon/icons';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './build-status.css';


const TC_TIMESTAMP_REGEXP = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})([-+]\d+)/;

function toDate(tcTimestamp) {
  const jsTimestamp = tcTimestamp.replace(TC_TIMESTAMP_REGEXP, '$1-$2-$3T$4:$5:$6$7');
  return new Date(jsTimestamp);
}

function getName(tcUser) {
  return tcUser.name || tcUser.username;
}

function buildDuration(build) {
  const start = toDate(build.startDate);
  const finish = toDate(build.finishDate);
  const durationMillis = finish.getTime() - start.getTime();
  const sec = Math.floor(durationMillis / 1000) % 60;
  const min = Math.floor(durationMillis / (60 * 1000)) % 60;
  const hour = Math.floor(durationMillis / (60 * 60 * 1000));
  if (hour !== 0) {
    return `${hour}h:${min}m:${sec}s`;
  } else if (min !== 0) {
    return `${min}m:${sec}s`;
  } else {
    return `${sec}s`;
  }
}

function buildTimestamp(build) {
  return build.finishDate && toDate(build.finishDate).toLocaleString();
}

function renderInvestigationTooltip(investigation) {
  const fields = [
    {
      name: i18n('Investigator'),
      value: getName(investigation.assignee)
    },
    {
      name: i18n('Assigned by'),
      value: getName(investigation.assignment.user)
    },
    {
      name: i18n('Since'),
      value: toDate(investigation.assignment.timestamp).toLocaleString()
    },
    {
      name: i18n('Resolve'),
      value: investigation.resolution.type === 'manually'
        ? i18n('Manually')
        : i18n('Automatically when fixed')
    },
    {
      name: i18n('Comment'),
      value: investigation.assignment.text
    }
  ];
  return (
    <table>
      <tbody>{fields.filter(it => it.value).map(field => (
        <tr key={field.name} data-test={`investigation-field-${field.name}`}>
          <th data-test="investigation-field-name">{`${field.name}: `}</th>
          <td data-test="investigation-field-value">{field.value}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

function renderInvestigation(buildType) {
  const investigation = buildType.investigations.investigation[0];
  return investigation && (
    <Tooltip title={renderInvestigationTooltip(investigation)}>
      <div className={styles.investigation} data-test="investigation">
        {i18n('Is being investigated by: {{ user }}', {user: getName(investigation.assignee)})}
      </div>
    </Tooltip>
  );
}

const BuildStatus = ({buildType, path, showGreenBuilds}) => {
  const build = buildType.builds.build[0];
  const isSuccessful = build.status === 'SUCCESS';
  return ((showGreenBuilds || !isSuccessful) &&
    <div className={styles.build} data-test="build">
      <Link
        target="_top"
        className={styles.buildType}
        title={buildType.name}
        href={buildType.webUrl}
        data-test="build-type"
      >{path}</Link>

      <div className={styles.status}>
        <span title={build.statusText} data-test="build-status">
          <Icon
            className={classNames(styles.icon, isSuccessful ? styles.ok : styles.fail)}
            glyph={isSuccessful ? SuccessIcon : WarningIcon}
            size={Size.Size12}
            data-test="build-status-icon"
          />
          <span data-test="build-number">{`#${build.number}`}</span>
          &nbsp;
          <Link
            target="_top"
            href={build.webUrl}
            data-test="build-status-text"
          >{build.statusText}</Link>
          &nbsp;
          <span
            className={styles.buildTime}
            title={buildTimestamp(build)}
            date-test="build-duration"
          >{buildDuration(build)}</span>
        </span>
        {renderInvestigation(buildType)}
      </div>
    </div>
  );
};

BuildStatus.propTypes = {
  buildType: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  showGreenBuilds: PropTypes.bool.isRequired
};

export default BuildStatus;
