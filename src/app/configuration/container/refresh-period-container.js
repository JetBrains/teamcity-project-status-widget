import connect from 'react-redux/es/connect/connect';
import RefreshPeriod from '@jetbrains/hub-widget-ui/dist/refresh-period';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import {updateRefreshPeriod} from '../../redux/actions';


const refreshLabel = minutes => i18n('{{minutes}} min', {minutes});

const refreshTooltip = minutes => (minutes === 1
  ? i18n('Widget refreshes every minute')
  : i18n('Widget refreshes every {{minutes}} minutes', {minutes}, minutes));

const RefreshPeriodContainer = connect(
  state => ({
    seconds: state.configuration.refreshPeriod,
    label: refreshLabel,
    tooltip: refreshTooltip
  }),
  dispatch => ({
    onChange: newSeconds => dispatch(updateRefreshPeriod(newSeconds))
  })
)(RefreshPeriod);

RefreshPeriodContainer.propTypes = {};

export default RefreshPeriodContainer;
