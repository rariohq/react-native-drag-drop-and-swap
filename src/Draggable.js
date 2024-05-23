/*
 * @Author: Ranvir Gorai 
 * @Date: 2018-01-30 15:04:14 
 * @Last Modified by: Ranvir Gorai
 * @Last Modified time: 2018-01-30 16:58:05
 */
import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';

class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Draggable';
        this._initiateDrag = this._initiateDrag.bind(this);
        this.pressIn = this.pressIn.bind(this);
        this.pressOut = this.pressOut.bind(this);
        this.wrapperRef = React.createRef();
        this.scaleValue = new Animated.Value(1);
    }
    pressIn = () => {
      Animated.timing(this.scaleValue, {
        toValue: this.props.transitionScaleValue,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };
  
    pressOut = () => {
      Animated.timing(this.scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };
    static contextTypes = {
      dragContext: PropTypes.any
    }

    static propTypes = {
      dragOn: PropTypes.oneOf(['onLongPress', 'onPressIn'])
    }

    _initiateDrag() {
      if (!this.props.disabled) this.context.dragContext.onDrag(this.wrapperRef.current, this.props.children, this.props.data);
    }

    static defaultProps = {
      dragOn: 'onLongPress',
      transitionScaleValue: 0.8
    }

    render() {
        
        let isDragging = this.context.dragContext.dragging && this.context.dragContext.dragging.ref;
        isDragging = isDragging && isDragging === this.wrapperRef.current;
        return <TouchableOpacity activeOpacity={this.props.activeOpacity} style={this.props.style} onLongPress={this.props.dragOn === 'onLongPress' ? this._initiateDrag : null}  onPress={this.props.onPress} onPressIn={this.pressIn} onPressOut={this.pressOut} ref={this.wrapperRef}>
          <Animated.View style={{ transform: [{ scale: this.scaleValue }] }}>
          {
            React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {ghost: isDragging})
          })
        }
          </Animated.View>
      </TouchableOpacity>;
    }
}

export default Draggable;
