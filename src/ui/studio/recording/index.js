//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx } from 'theme-ui';

import { Flex } from '@theme-ui/components';
import { useCallback, useEffect, useState } from 'react';

import { useRecordingState } from '../../../recording-context';

import { ActionButtons } from '../elements';

import MediaDevices from './media-devices';
import RecordingControls from './recording-controls';


export const STATE_INACTIVE = 'inactive';
export const STATE_PAUSED = 'paused';
export const STATE_RECORDING = 'recording';


export default function Recording(props) {
  const state = useRecordingState();

  const [recordingState, setRecordingState] = useState(STATE_INACTIVE);
  useEffect(() => {
    if (!(state.displayStream || state.userStream)) {
      props.firstStep();
    }
  }, [props, state.displayStream, state.userStream]);


  const handleRecorded = () => {
    props.nextStep();
  };

  const backToAudio = useCallback(() => {
    props.previousStep();
  }, [props]);

  return (
    <Flex sx={{
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      flexGrow: 1,
    }}>
      <MediaDevices recordingState={recordingState} />

      <div sx={{ mx: 3 }}>
        <ActionButtons prev={recordingState === STATE_INACTIVE && { onClick: backToAudio }}>
          <RecordingControls
            handleRecorded={handleRecorded}
            recordingState={recordingState}
            setRecordingState={setRecordingState}
          />
        </ActionButtons>
      </div>
    </Flex>
  );
}
