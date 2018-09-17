import {connect} from 'react-redux';

import {loadBuildTypes, selectBuildTypes} from '../../redux/actions';
import BuildTypeSelect from '../component/build-type-select';

const BuildTypeSelectContainer = connect(
  ({configuration}) => ({
    isLoading: configuration.isLoadingBuildTypes,
    isDisabled: configuration.selectedProject == null,
    selectedBuildTypes: configuration.selectedBuildTypes,
    projectAndBuildTypeList: configuration.projectsAndBuildTypes,
    loadError: configuration.buildTypeLoadErrorMessage
  }),
  dispatch => ({
    onConfigurationsSelect: item => dispatch(selectBuildTypes(item.project)),
    onOpen: () => dispatch(loadBuildTypes())
  })
)(BuildTypeSelect);

BuildTypeSelectContainer.propTypes = {};


export default BuildTypeSelectContainer;
