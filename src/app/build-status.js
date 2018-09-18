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

function parseTeamcityTimestamp(tcTimestamp) {
  const jsTimestamp = tcTimestamp.replace(TC_TIMESTAMP_REGEXP, '$1-$2-$3T$4:$5:$6$7');
  return new Date(jsTimestamp);
}

function buildDuration(build) {
  const start = parseTeamcityTimestamp(build.startDate);
  const finish = parseTeamcityTimestamp(build.finishDate);
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
  return build.finishDate && parseTeamcityTimestamp(build.finishDate).toLocaleString();
}

function renderInvestigationTooltip(investigation) {
  const fields = [
    {
      name: i18n('Investigator'),
      value: investigation.assignee.name || investigation.assignee.username
    },
    {
      name: i18n('Assigned by'),
      value: investigation.assignment.user.name || investigation.assignment.user.username
    },
    {
      name: i18n('Since'),
      value: parseTeamcityTimestamp(investigation.assignment.timestamp).toLocaleString()
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
        <tr key={field.name}>
          <th>{`${field.name}: `}</th>
          <td>{field.value}</td>
        </tr>
      ))}</tbody>
    </table>
  );
}

const BuildStatus = ({buildType, path, showGreenBuilds}) => {
  const build = buildType.builds.build[0];
  const isSuccessful = build.status === 'SUCCESS';
  const investigation = buildType.investigations.investigation[0];
  return ((showGreenBuilds || !isSuccessful) &&
    <div className={styles.build}>
      <Link
        target="_top"
        className={styles.buildType}
        title={buildType.name}
        href={buildType.webUrl}
      >{path}</Link>

      <div className={styles.status}>
        <span title={build.statusText}>
          <Icon
            className={classNames(styles.icon, isSuccessful ? styles.ok : styles.fail)}
            glyph={isSuccessful ? SuccessIcon : WarningIcon}
            size={Size.Size12}
          />
          <span>{`#${build.number}`}</span>
          &nbsp;
          <Link
            target="_top"
            href={build.webUrl}
          >{build.statusText}</Link>
          &nbsp;
          <span
            className={styles.buildTime}
            title={buildTimestamp(build)}
          >{buildDuration(build)}</span>
        </span>
        {investigation && (
          <Tooltip title={renderInvestigationTooltip(investigation)}>
            <div className={styles.investigation}>
              {i18n('Is being investigated by: {{ user }}', {user: investigation.assignee.name || investigation.assignee.username})}
            </div>
          </Tooltip>
        )}
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
