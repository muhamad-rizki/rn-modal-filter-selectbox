import _ from 'lodash';
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
    ViewProps,
} from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

interface DataSelectBox {
    key: string,
    label: string,
}

interface Props extends ViewProps {
    data: Array<DataSelectBox>,
    textStyle: StyleProp<TextStyle>,
    iconRight: Component,
    iconContainerStyle: StyleProp<ViewStyle>,
    placeholder?: string,
    onValueChange?: (value: string) => void,
    containerStyle: StyleProp<ViewStyle>,
    placeholderStyle: StyleProp<TextStyle>,
    modalStyle: StyleProp<ViewStyle>,
    modalContainerStyle: StyleProp<ViewStyle>,
    modalProps: ModalProps,
    modalTitle: string,
    modalTitleStyle: StyleProp<TextStyle>,
    modalTitleContainerStyle: StyleProp<ViewStyle>,
    selectBoxTouchableProps: TouchableOpacityProps,
    listStyle: StyleProp<ViewStyle>,
    listContainerStyle: StyleProp<ViewStyle>,
    listItemStyle: StyleProp<ViewStyle>,
    listItemTextStyle: StyleProp<ViewStyle>,
    listItemTouchableProps: TouchableOpacityProps,
    searchBarTextStyle: StyleProp<TextStyle>,
    searchBarPlaceholder: string,
    searchBarContainerStyle: StyleProp<ViewStyle>,
    cancelButtonStyle: StyleProp<ViewStyle>,
    cancelButtonText: string,
    cancelButtonTextStyle: StyleProp<TextStyle>,
    cancelButtonTouchableProps: TouchableOpacityProps,
    customListItem: ({ item: any, index: number }) => Component,
    customCancelButton: (onCancel: any) => Component,
    emptyListComponent: Component,
    showTitleModal: boolean,
    showSearchBar: boolean,
}

export default class RNSelectBox extends Component<Props> {
    static defaultProps = {
        placeholder: '-- Select --',
        onValueChange: () => { },
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: props.data,
            selected: null,
            filteredData: [],
            keyword: null,
        }
    }

    filterList = (text) => {
        const { data } = this.state;
        this.setState({ filteredData: _.filter(data, item => item.label.indexOf(text) >= 0), keyword: text });
    }

    renderItem = ({ item, index }) => (
        <View style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: '#4b4b4b',
            paddingVertical: 12,
            paddingHorizontal: 16,
        }}>
            <TouchableOpacity
                onPress={() => this.setState({
                    visible: false,
                    selected: item.label,
                }, () => this.props.onValueChange(item.label))}
                {...this.props.listItemTouchableProps}
            >
                <Text>{item.label}</Text>
            </TouchableOpacity>
        </View>
    )

    render() {
        const {
            renderItem,
            placeholder,
            selectBoxTouchableProps,
            cancelButtonTouchableProps,
            listStyle,
            listContainerStyle,
            modalProps,
            style,
            containerStyle,
            modalContainerStyle,
            modalTitle,
            modalTitleContainerStyle,
            modalTitleStyle,
            searchBarContainerStyle,
            searchBarPlaceholder,
            searchBarTextStyle,
            showSearchBar,
            showTitleModal,
            textStyle,
            iconRight,
            iconContainerStyle,
        } = this.props;
        const { visible, data, selected, filteredData, keyword } = this.state;
        return (
            <View style={{ borderRadius: 4, backgroundColor: '#fff', ...containerStyle }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        justifyContent: 'center',
                        flex: 1,
                        padding: 16,
                        flexDirection: 'row',
                        ...style
                    }}
                    onPress={() => this.setState({ visible: true })}
                    {...selectBoxTouchableProps}
                >
                    <Text style={{ flex: iconRight ? 0.9 : 1, ...textStyle }}>{selected ? selected : placeholder}</Text>
                    {
                        iconRight
                            ? <View style={{
                                flex: 0.1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...iconContainerStyle,
                            }}>{iconRight}</View>
                            : null
                    }
                </TouchableOpacity>
                <Modal
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackButtonPress={() => this.setState({ visible: false })}
                    onBackdropPress={() => this.setState({ visible: false })}
                    onModalHide={() => this.setState({ visible: false })}
                    isVisible={visible}
                    {...modalProps}
                >
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, marginVertical: 24, ...modalContainerStyle }}>
                        {
                            showTitleModal
                                ? <View style={modalTitleContainerStyle}>
                                    <Text style={modalTitleStyle}>{modalTitle}</Text>
                                </View>
                                : null
                        }
                        {
                            showSearchBar
                                ? <View
                                    style={{
                                        borderBottomWidth: 0.5,
                                        borderColor: '#4b4b4b',
                                        paddingHorizontal: 16,
                                        ...searchBarContainerStyle
                                    }}
                                >
                                    <TextInput
                                        style={searchBarTextStyle}
                                        keyboardType='web-search'
                                        placeholder={searchBarPlaceholder ? searchBarPlaceholder : 'Pencarian ...'}
                                        onChangeText={this.filterList}
                                    />
                                </View>
                                : null
                        }
                        <FlatList
                            ListEmptyComponent={(
                                <View style={{
                                    padding: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{ textAlign: 'center' }}>Tidak Ada Data</Text>
                                </View>
                            )}
                            style={listStyle}
                            contentContainerStyle={listContainerStyle}
                            renderItem={this.renderItem}
                            data={_.isEmpty(keyword) ? data : filteredData}
                        />
                        <TouchableOpacity
                            style={{
                                borderTopWidth: 0.5,
                                borderColor: '#4b4b4b',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 12,
                            }}
                            onPress={() => this.setState({ visible: false })}
                            {...cancelButtonTouchableProps}
                        >
                            <Text>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
