// Third Party Imports
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Button, Text, TextInput, Alert, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
// Local Imports
import colors from '../styles/colors';
import addStyles from '../styles/addStyles';
//Firebse imports
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
const screenHeight = Dimensions.get('window').height;

const AddView = ({ isVisible, onClose }) => {

  // ========= RENDER ========= //
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  useEffect(() => {
    if (isVisible) {
      // Animate in
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    } else {
      // Animate out
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible, translateY]);
  // Set up a style for the animated component
  const addViewStyle = [
    addStyles.addViewContainer,
    {
      transform: [{
        translateY: translateY.interpolate({
          inputRange: [0, screenHeight],
          outputRange: [0, screenHeight],
          extrapolate: 'clamp',
        })
      }],
    },
  ];
  const resetInputs = () => {
    setHour('');
    setMinute('');
    setSecond('');
  };
  const handleClose = () => {
    resetInputs();
    onClose();
  };

  // ========== TIME INPUT ========== //
  // States to store the hour, minute, and second
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');

  // Add the refs for each text input
  const hourInputRef = useRef(null);
  const minuteInputRef = useRef(null);
  const secondInputRef = useRef(null);

  //store final duration
  const [confirmedHour, setConfirmedHour] = useState('');
  const [confirmedMinute, setConfirmedMinute] = useState('');
  const [confirmedSecond, setConfirmedSecond] = useState('');
  const [duration, setDuration] = useState(0);

  // New function to handle backspace
  const handleBackspace = (key, currentState, previousInputRef) => {
    if (key === 'Backspace' && currentState === '' && previousInputRef && previousInputRef.current) {
      // Check if the input is already empty to shift focus to the previous input
      previousInputRef.current.focus();
    }
  };
  // Update the onChangeText handlers to use functional updates for focusing
  const handleHourChange = (text) => {
    if (text.length === 2) {
      minuteInputRef.current.focus();
    }
    setHour(text);
  };
  const handleMinuteChange = (text) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue) && numericValue > 59) {
      setMinute('00');
      setHour((prevHour) => {
        const nextValue = parseInt(prevHour, 10) || 0;
        return `${nextValue + 1}`.padStart(2, '0');
      });
    } else {
      setMinute(text);
    }
    if (text.length === 2) {
      secondInputRef.current.focus();
    }
  };
  const handleSecondChange = (text) => {
    if (text === '60') {
      setSecond('00');
      setMinute((prevMinute) => `${parseInt(prevMinute, 10) + 1}`.padStart(2, '0'));
    } else {
      setSecond(text);
    }
  };
  // Function to handle the submission of time
  const convertToMilliseconds = (hours, minutes, seconds) => {
    return (parseInt(hours, 10) || 0) * 3600000 +
      (parseInt(minutes, 10) || 0) * 60000 +
      (parseInt(seconds, 10) || 0) * 1000;
  };
  const handleSubmitTime = () => {
    // Check if the time is valid
    if (hour === '' && minute === '' && second === '') {
      Alert.alert('Please enter a valid time');
      return;
    }

    // Use convertToMilliseconds function to calculate the total time in milliseconds
    const totalTimeInMilliseconds = convertToMilliseconds(hour, minute, second);

    // Log the total time in milliseconds to the console (assuming there's a console.log statement or similar here)
    console.log(totalTimeInMilliseconds); // This line assumes you want to log the result to the console

    // Update the state with the confirmed time and duration
    setConfirmedHour(hour);
    setConfirmedMinute(minute);
    setConfirmedSecond(second);
    setDuration(totalTimeInMilliseconds);
  };
  const [inputFocus, setInputFocus] = useState({
    hour: false,
    minute: false,
    second: false,
  });
  const handleBlur = (inputName) => {
    // Set a short delay before checking focus state to handle fast input switching
    setTimeout(() => {
      setInputFocus((currentFocus) => ({
        ...currentFocus,
        [inputName]: false
      }));
    }, 100); // 100ms delay to account for quick focus transitions
  };
  useEffect(() => {
    // If a timeout is set, we should clear it when any of the input focuses change
    const timeoutId = setTimeout(() => {
      if (!inputFocus.hour && !inputFocus.minute && !inputFocus.second) {
        handleSubmitTime();
      }
    }, 150); // Slightly longer than the onBlur timeout

    return () => clearTimeout(timeoutId); // Cleanup timeout if the component unmounts or the focus changes
  }, [inputFocus]);

  const [showSpeechInput, setShowSpeechInput] = useState(false);
  useEffect(() => {
    console.log(`Time in milliseconds:` + duration);
    if (duration > 0) {
      setShowSpeechInput(true);
    }
  }, [duration]);

  // ========== SPEECH INPUT ========== //
  // Create references for each breakpoint input
  const hourRefs = useRef(new Map());
  const minuteRefs = useRef(new Map());
  const secondRefs = useRef(new Map());

  const [speechBreakpoints, setSpeechBreakpoints] = useState([]);
  const [focusedBreakpointId, setFocusedBreakpointId] = useState(null);
  const [confirmedBreakpoints, setConfirmedBreakpoints] = useState([]);
  const [editingBreakpointId, setEditingBreakpointId] = useState(null);
  // Function to add a new speech breakpoint
  const addSpeechBreakpoint = () => {
    setSpeechBreakpoints([...speechBreakpoints, {
      id: Math.random().toString(), // simple ID - use a better method in production
      hour: '',
      minute: '',
      second: ''
    }]);
  };
  const handleBreakpointChange = (id, field, value) => {
    setEditingBreakpointId(id);
    setSpeechBreakpoints((prevBreakpoints) => prevBreakpoints.map((bp) => {
      if (bp.id === id) {
        // Automatically move to the next input if the user has typed in the maximum characters
        if (field === 'hour' && value.length === 2) {
          minuteRefs.current.get(id)?.focus();
        } else if (field === 'minute' && value.length === 2) {
          secondRefs.current.get(id)?.focus();
        }
        // Removed logic that focuses on the next breakpoint's hour field
        return { ...bp, [field]: value };
      }
      return bp;
    }));
  };
  const handleBreakpointBackspace = (id, field, key) => {
    if (key === 'Backspace') {
      // Find the index of the current breakpoint
      const bpIndex = speechBreakpoints.findIndex(bp => bp.id === id);
      const breakpoint = speechBreakpoints[bpIndex];

      // Check if the current field is empty and decide which field to focus next
      if (breakpoint[field] === '') {
        if (field === 'second') {
          // Focus on the minute field of the same breakpoint
          minuteRefs.current.get(id)?.focus();
        } else if (field === 'minute') {
          // Focus on the hour field of the same breakpoint
          hourRefs.current.get(id)?.focus();
        }
        // Removed logic that focuses on the previous breakpoint's second field
      }
    }
  };
  const validateBreakpointTime = (
    breakpointTimeInMs,
    durationInMs,
    previousConfirmedBreakpointInMs,
    nextConfirmedBreakpointInMs
  ) => {
    return (
      breakpointTimeInMs <= durationInMs &&
      (previousConfirmedBreakpointInMs === undefined || breakpointTimeInMs > previousConfirmedBreakpointInMs) &&
      (nextConfirmedBreakpointInMs === undefined || breakpointTimeInMs < nextConfirmedBreakpointInMs)
    );
  };
  // useRef to keep track of the previous editing breakpoint id
  const prevEditingBreakpointIdRef = useRef(editingBreakpointId);
  // Effect that adds breakpoints to the confirmed array when they leave editing mode
  useEffect(() => {
    const prevEditingBreakpointId = prevEditingBreakpointIdRef.current;

    if (prevEditingBreakpointId !== editingBreakpointId && prevEditingBreakpointId !== null) {
      const breakpointToConfirm = speechBreakpoints.find(bp => bp.id === prevEditingBreakpointId);
      if (breakpointToConfirm) {
        const confirmedBreakpoint = {
          ...breakpointToConfirm,
          hour: breakpointToConfirm.hour || "0",
          minute: breakpointToConfirm.minute || "0",
          second: breakpointToConfirm.second || "0",
        };

        const breakpointTimeInMs = convertToMilliseconds(
          confirmedBreakpoint.hour,
          confirmedBreakpoint.minute,
          confirmedBreakpoint.second
        );
        const durationInMs = duration;

        const sortedConfirmedBreakpoints = [...confirmedBreakpoints, confirmedBreakpoint].sort((a, b) =>
          convertToMilliseconds(a.hour, a.minute, a.second) - convertToMilliseconds(b.hour, b.minute, b.second)
        );
        const currentBreakpointIndex = sortedConfirmedBreakpoints.findIndex(bp => bp.id === breakpointToConfirm.id);
        const previousConfirmedBreakpointInMs = currentBreakpointIndex > 0
          ? convertToMilliseconds(
            sortedConfirmedBreakpoints[currentBreakpointIndex - 1].hour,
            sortedConfirmedBreakpoints[currentBreakpointIndex - 1].minute,
            sortedConfirmedBreakpoints[currentBreakpointIndex - 1].second
          )
          : undefined;
        const nextConfirmedBreakpointInMs = currentBreakpointIndex < sortedConfirmedBreakpoints.length - 1
          ? convertToMilliseconds(
            sortedConfirmedBreakpoints[currentBreakpointIndex + 1].hour,
            sortedConfirmedBreakpoints[currentBreakpointIndex + 1].minute,
            sortedConfirmedBreakpoints[currentBreakpointIndex + 1].second
          )
          : undefined;

        if (!validateBreakpointTime(breakpointTimeInMs, durationInMs, previousConfirmedBreakpointInMs, nextConfirmedBreakpointInMs)) {
          alert("The time entered is not valid and needs to be entered again.");

          setSpeechBreakpoints(prevBreakpoints =>
            prevBreakpoints.map(bp => {
              if (bp.id === prevEditingBreakpointId) {
                return { ...bp, hour: "", minute: "", second: "" };
              }
              return bp;
            })
          );
        } else {
          setConfirmedBreakpoints(sortedConfirmedBreakpoints);
        }
      }
    }

    prevEditingBreakpointIdRef.current = editingBreakpointId;
  }, [editingBreakpointId, speechBreakpoints, confirmedBreakpoints, duration]);
  useEffect(() => {
    console.log("confirmed breakpoints: " + JSON.stringify(confirmedBreakpoints, null, 2));
  }, [confirmedBreakpoints]);
  useEffect(() => {
    console.log("speech breakpoints: " + JSON.stringify(speechBreakpoints, null, 2));
  }, [speechBreakpoints]);
  // Timeout ID state for managing blur/focus race condition
  const [blurTimeoutId, setBlurTimeoutId] = useState(null);
  const handleInputFocus = (id) => {
    // Cancel the timeout if we're focusing on a new input within the same breakpoint
    if (blurTimeoutId) {
      clearTimeout(blurTimeoutId);
      setBlurTimeoutId(null);
    }
    setFocusedBreakpointId(id);
    setEditingBreakpointId(id);
  };
  const handleInputBlur = (id) => {
    // Start a timeout when the input is blurred
    const newTimeoutId = setTimeout(() => {
      setEditingBreakpointId(null);
      setBlurTimeoutId(null);
    }, 100); // 100ms delay or any appropriate delay for your use case

    setBlurTimeoutId(newTimeoutId);
  };
  // Remember to clean up on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId);
      }
    };
  }, [blurTimeoutId]);
  const handleDeleteBreakpoint = (id) => {
    // Set state to remove the breakpoint from the array
    setConfirmedBreakpoints(currentBreakpoints =>
      currentBreakpoints.filter(breakpoint => breakpoint.id !== id)
    );

    // If necessary, also remove from speechBreakpoints or any other state that holds the breakpoint
    setSpeechBreakpoints(currentBreakpoints =>
      currentBreakpoints.filter(breakpoint => breakpoint.id !== id)
    );
  };

  return (
    <Animated.View style={addViewStyle}>
      <View style={addStyles.closeButtonContainer}>
        <TouchableOpacity style={addStyles.closeButton} onPress={handleClose}>
          <FontAwesomeIcon icon={faTimes} size={24} />
        </TouchableOpacity>
      </View>

      {/* Time input fields */}
      <View style={addStyles.timeInputContainer}>
        <Text style={addStyles.hintText}>Duration of Speech:</Text>
        <View style={addStyles.timeInputCollection}>
          <View style={addStyles.timeTextInputs}>
            <TextInput
              ref={hourInputRef}
              style={addStyles.timeInput}
              placeholder="HH"
              keyboardType="numeric"
              value={hour}
              onChangeText={handleHourChange}
              onKeyPress={({ nativeEvent }) => {
                handleBackspace(nativeEvent.key, hour, null); // There is no previous input for hours
              }}
              onFocus={() => setInputFocus({ ...inputFocus, hour: true })}
              onBlur={() => handleBlur('hour')}
              maxLength={2}
            />
            <Text style={{ color: colors.greyColor }}>:</Text>
            <TextInput
              ref={minuteInputRef}
              style={addStyles.timeInput}
              placeholder="MM"
              keyboardType="numeric"
              value={minute}
              onChangeText={handleMinuteChange}
              onKeyPress={({ nativeEvent }) => {
                handleBackspace(nativeEvent.key, minute, hourInputRef);
              }}
              onFocus={() => setInputFocus({ ...inputFocus, minute: true })}
              onBlur={() => handleBlur('minute')}
              maxLength={2}
            />
            <Text style={{ color: colors.greyColor }}>:</Text>
            <TextInput
              ref={secondInputRef}
              style={addStyles.timeInput}
              placeholder="SS"
              keyboardType="numeric"
              value={second}
              onChangeText={handleSecondChange}
              onKeyPress={({ nativeEvent }) => {
                handleBackspace(nativeEvent.key, second, minuteInputRef);
              }}
              onFocus={() => setInputFocus({ ...inputFocus, second: true })}
              onBlur={() => handleBlur('second')}
              maxLength={2}
            />
          </View>
          {/* Submit button */}
          <TouchableOpacity onPress={handleSubmitTime} style={addStyles.timeConfirmButton}>
            <Text style={addStyles.timeConfirmButtonText}>confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* speech inputs */}
      {showSpeechInput && (<View style={addStyles.speechInputContainer}>
        <Text style={addStyles.hintText}>Add Breakpoints:</Text>
        <View style={addStyles.speechInputCollection}>
          <View style={addStyles.speechEndPoint}>
            <Text style={addStyles.timeDisplay}>00 : 00 : 00</Text>
          </View>
          {/* Render each speech breakpoint */}
          {speechBreakpoints.map((breakpoint, index) => {
            // Determine if this breakpoint is currently being edited
            const isEditing = editingBreakpointId === breakpoint.id;

            return (
              <View style={addStyles.speechBreakPoint}>
                <Swipeable key={breakpoint.id} rightButtons={[
                    <TouchableOpacity
                      onPress={() => handleDeleteBreakpoint(breakpoint.id)}
                      style={addStyles.swipeableRight}
                    >
                      <Text style={{ color: colors.whiteColor, fontWeight: 'bold' }}>Delete</Text>
                    </TouchableOpacity>
                  ]} 
                  style={addStyles.swipeable}
                  >
                  {isEditing ? (
                    // If we're editing this breakpoint, show the TextInput fields
                    <View style={{ width: '100%', justifyContent: 'center' }}>
                      {/* Hour Input */}
                      <TextInput
                        ref={(ref) => {
                          hourRefs.current.set(breakpoint.id, ref);
                        }}
                        style={addStyles.breakpointTimeInput}
                        placeholder="HH"
                        keyboardType="numeric"
                        value={breakpoint.hour}
                        onChangeText={(text) => handleBreakpointChange(breakpoint.id, 'hour', text)}
                        onKeyPress={({ nativeEvent }) => {
                          handleBreakpointBackspace(breakpoint.id, 'hour', nativeEvent.key);
                        }}
                        onFocus={() => handleInputFocus(breakpoint.id)}
                        onBlur={() => handleInputBlur(breakpoint.id)}
                        maxLength={2}
                      />
                      <Text style={{ color: colors.greyColor }}>:</Text>
                      <TextInput
                        ref={(ref) => {
                          minuteRefs.current.set(breakpoint.id, ref);
                        }}
                        style={addStyles.breakpointTimeInput}
                        placeholder="MM"
                        keyboardType="numeric"
                        value={breakpoint.minute}
                        onChangeText={(text) => handleBreakpointChange(breakpoint.id, 'minute', text)}
                        onKeyPress={({ nativeEvent }) => {
                          handleBreakpointBackspace(breakpoint.id, 'minute', nativeEvent.key);
                        }}
                        onFocus={() => handleInputFocus(breakpoint.id)}
                        onBlur={() => handleInputBlur(breakpoint.id)}
                        maxLength={2}
                      />
                      <Text style={{ color: colors.greyColor }}>:</Text>
                      <TextInput
                        ref={(ref) => {
                          secondRefs.current.set(breakpoint.id, ref);
                        }}
                        style={addStyles.breakpointTimeInput}
                        placeholder="SS"
                        keyboardType="numeric"
                        value={breakpoint.second}
                        onChangeText={(text) => handleBreakpointChange(breakpoint.id, 'second', text)}
                        onKeyPress={({ nativeEvent }) => {
                          handleBreakpointBackspace(breakpoint.id, 'second', nativeEvent.key);
                        }}
                        onFocus={() => handleInputFocus(breakpoint.id)}
                        onBlur={() => handleInputBlur(breakpoint.id)}
                        maxLength={2}
                      />
                    </View>
                  ) : (
                    // If we're not editing this breakpoint, show it as a TouchableOpacity
                    <TouchableOpacity
                      style={[addStyles.breakpointDisplay]}
                      onPress={() => setEditingBreakpointId(breakpoint.id)}
                    >
                      <Text style={addStyles.breakpointDisplayText}>
                        {breakpoint.hour || '00'} : {breakpoint.minute || '00'} : {breakpoint.second || '00'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Swipeable>
              </View>
            );
          })}
          {/* Button to add new speech breakpoint */}
          <TouchableOpacity style={addStyles.addSpeechBreakPoint} onPress={addSpeechBreakpoint}>
            <FontAwesomeIcon icon={faPlus} size={24} color={colors.shadowColor} />
          </TouchableOpacity>
          <View style={addStyles.speechEndPoint}>
            <Text style={addStyles.timeDisplay}>{confirmedHour} : {confirmedMinute} : {confirmedSecond}</Text>
          </View>
        </View>
      </View>)}

    </Animated.View>
  );
};

export default AddView;