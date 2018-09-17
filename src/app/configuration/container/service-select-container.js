import {connect} from 'react-redux';

import {i18n} from 'hub-dashboard-addons/dist/localization';
import ServiceSelect from '@jetbrains/hub-widget-ui/dist/service-select';

import {selectTeamcityService} from '../../redux/actions';


const ServiceSelectContainer = connect(
  state => ({
    label: i18n('TeamCity server'),
    isLoading: state.configuration.isLoadingServices,
    placeholder: i18n('TeamCity server'),
    selectedService: state.configuration.selectedTeamcityService,
    serviceList: state.configuration.teamcityServices,
    loadError: state.configuration.serviceLoadErrorMessage
  }),
  dispatch => ({
    onServiceSelect: selectedItem => dispatch(selectTeamcityService(selectedItem.service))
  })
)(ServiceSelect);

ServiceSelectContainer.propTypes = {};


export default ServiceSelectContainer;
