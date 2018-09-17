import {connect} from 'react-redux';

import {deselectBuildType, loadBuildTypes, selectBuildType} from '../../redux/actions';
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
    onBuildTypeSelect: item => dispatch(selectBuildType(item.payload)),
    onBuildTypeDeselect: item => dispatch(deselectBuildType(item.payload)),
    onOpen: () => dispatch(loadBuildTypes())
  })
)(BuildTypeSelect);

BuildTypeSelectContainer.propTypes = {};


export default BuildTypeSelectContainer;
