import connect from 'react-redux/es/connect/connect';
import RefreshPeriod from '@jetbrains/hub-widget-ui/dist/refresh-period';

import {updateRefreshPeriod} from '../../redux/actions';


const RefreshPeriodContainer = connect(
  state => ({
    seconds: state.configuration.refreshPeriod
  }),
  dispatch => ({
    onChange: newSeconds => dispatch(updateRefreshPeriod(newSeconds))
  })
)(RefreshPeriod);

RefreshPeriodContainer.propTypes = {};

export default RefreshPeriodContainer;
