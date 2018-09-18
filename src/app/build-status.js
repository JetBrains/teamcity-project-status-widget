import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';


import Link from '@jetbrains/ring-ui/components/link/link';
import Icon, {Size} from '@jetbrains/ring-ui/components/icon/icon';
import {SuccessIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon/icons';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './build-status.css';

function buildDuration(build) {
  // TODO
  return `${build.startDate}-${build.finishDate}`;
}

function buildTimestamp(build) {
  // TODO
  return build.finishDate || build.startDate;
}

/*

<div class="teamcity-project-status__build-status">
            <span title="{{::buildType.builds.build[0].statusText}}">
              <rg-icon ng-show="::buildType.builds.build[0].status === 'SUCCESS'"
                    class="teamcity-project-status__build teamcity-project-status__build_ok"
                    glyph="/check.svg"
                    size="16"></rg-icon>
              <rg-icon ng-show="::buildType.builds.build[0].status !== 'SUCCESS'"
                    class="teamcity-project-status__build teamcity-project-status__build_fail"
                    glyph="/warning.svg"
                    size="16"></rg-icon>
              #<a target="_blank" class="ring-link" ng-href="{{::buildType.builds.build[0].webUrl}}" title="{{::buildType.builds.build[0].finishDate | date:'medium'}}">{{::buildType.builds.build[0].number}}</a>
              <a target="_blank" class="ring-link" ng-href="{{::buildType.builds.build[0].webUrl}}">{{::buildType.builds.build[0].statusText}}</a>&nbsp;<span
              class="teamcity-project-status__build-time"
              title="{{::buildType.builds.build[0].finishDate | date:'medium'}}">
                {{:: widgetCtrl.getBuildTime(buildType.builds.build[0])}}
              </span>
            </span>
            <div ng-if="buildType.investigation"
                 class="teamcity-project-status__investigation"
                 rg-tooltip="::widgetCtrl.getInvestigationDescription(buildType.investigation)"
                 rg-tooltip-class="teamcity-project-status__tooltip-popup"
                 translate translate-context="Dashboard">
              Is being investigated by: {{buildType.investigation.assignee.name || buildType.investigation.assignee.username}}
            </div>
          </div>
 */
const BuildStatus = ({buildType, path, showGreenBuilds}) => {
  const build = buildType.builds.build[0];
  const isSuccessful = build.status === 'SUCCESS';
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
        {JSON.stringify(buildType.investigations)}
        {buildType.investigation && (
          <div className={styles.investigation}>
            {i18n('Is being investigated by: {{ user }}', {user: buildType.investigation.assignee.name || buildType.investigation.assignee.username})}
          </div>
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
