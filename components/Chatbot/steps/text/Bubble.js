import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const _maxWidth = width * 0.6;

import React from 'react';
import { View } from 'react-native';

const Bubble = (props) => {

  const borderTopLeftRadius = React.useMemo(() => {
    const { isFirst, isLast, user } = props;
    if (!isFirst && !isLast) {
      return user ? 18 : 0;
    } else if (!isFirst && isLast) {
      return user ? 18 : 0;
    }
    return 18;
  }, [props])

  const borderTopRightRadius = React.useMemo(() => {
    const { isFirst, isLast, user } = props;
    if (!isFirst && !isLast) {
      return user ? 0 : 18;
    } else if (!isFirst && isLast) {
      return user ? 0 : 18;
    }
    return 18;
  }, [props])

  const borderBottomRightRadius = React.useMemo(() => {
    const { isFirst, isLast, user } = props;
    if (!isFirst && !isLast) {
      return user ? 0 : 18;
    } else if (!isFirst && isLast) {
      return 18;
    }
    return props.user ? 0 : 18;
  }, [props])

  const borderBottomLeftRadius = React.useMemo(() => {
    const { isFirst, isLast, user } = props;
    if (!isFirst && !isLast) {
      return user ? 18 : 0;
    } else if (!isFirst && isLast) {
      return 18;
    }
    return props.user ? 18 : 0;
  }, [props])

  const marginTop = React.useMemo(() => {
    const { isFirst, showAvatar } = props;
    if (!isFirst && showAvatar) {
      return -8;
    } else if (!isFirst && !showAvatar) {
      return -8;
    }

    return 0;
  }, [props])

  const marginRight = React.useMemo(() => {
    const { isFirst, showAvatar, user } = props;
    if (!isFirst && showAvatar) {
      return user ? 58 : 6;
    } else if (showAvatar) {
      return 0;
    }

    return 6;
  }, [props])

  const marginLeft = React.useMemo(() => {
    const { isFirst, showAvatar, user } = props;
    if (!isFirst && showAvatar) {
      return user ? 6 : 58;
    } else if (showAvatar) {
      return 0;
    }

    return 6;
  }, [props])

  const maxWidth = React.useMemo(() => {
    const { isFirst, showAvatar } = props;
    if (!isFirst && showAvatar) {
      return _maxWidth + 58;
    }

    return _maxWidth;
  }, [props])

  return (
    <View {...props} 
      style={[
        {
          backgroundColor: props.bubbleColor,
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomRightRadius,
          borderBottomLeftRadius,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          marginTop,
          marginRight,
          marginBottom: 10,
          marginLeft,
          maxWidth,
          minHeight: 42
        },
        props?.style
      ]}
    />
  );
}

export default Bubble;
