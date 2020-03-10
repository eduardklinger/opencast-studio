//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Button, Box, Container, Spinner } from '@theme-ui/components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Beforeunload } from 'react-beforeunload';
import { Trans, useTranslation } from 'react-i18next';

import { useOpencast, STATE_INCORRECT_LOGIN } from '../../../opencast';
import {
  metaData,
  useDispatch,
  useRecordingState,
  STATE_ERROR,
  STATE_UPLOADING,
  STATE_UPLOADED,
} from '../../../recording-context';

import Notification from '../../notification';
import {  } from '../page';
import { ActionButtons } from '../elements';

import FormField from './form-field';
import RecordingPreview from './recording-preview';


const Input = props => <input sx={{ variant: 'styles.input' }} {...props} />;

export default function SaveCreation(props) {
  const { t } = useTranslation();
  const opencast = useOpencast();
  const { recordings, upload: uploadState } = useRecordingState();
  const dispatch = useDispatch();

  function handleBack() {
    props.previousStep();
  }

  function handleInputChange(event) {
    const target = event.target;
    metaData[target.name] = target.value;
  }

  async function handleUpload() {
    const { title, presenter } = metaData;

    if (title === '' || presenter === '') {
      dispatch({ type: 'UPLOAD_ERROR', payload: t('save-creation-form-invalid') });
      return;
    }

    dispatch({ type: 'UPLOAD_REQUEST' });
    const success = await opencast.upload({
      recordings: recordings.filter(Boolean),
      title,
      creator: presenter,
    });

    if (success) {
      dispatch({ type: 'UPLOAD_SUCCESS' });
    } else {
      switch (opencast.getState()) {
        case STATE_INCORRECT_LOGIN:
          dispatch({ type: 'UPLOAD_FAILURE', payload: t('message-login-failed') });
          break;
        default:
          // TODO: this needs a better message and maybe some special cases.
          dispatch({ type: 'UPLOAD_FAILURE', payload: t('message-server-unreachable') });
          break;
      }
    }
  }

  const handleNewRecording = () => {
    dispatch({ type: 'RESET' });
    props.firstStep();
  };

  const uploadPossible = opencast.isReadyToUpload();

  const uploadBox = uploadPossible
    ? (
      <React.Fragment>
        <FormField label={t('save-creation-label-title')}>
          <Input
            name="title"
            autoComplete="off"
            defaultValue={metaData.title}
            onChange={handleInputChange}
            disabled={uploadState.state === STATE_UPLOADING || uploadState.state === STATE_UPLOADED}
          />
        </FormField>

        <FormField label={t('save-creation-label-presenter')}>
          <Input
            name="presenter"
            autoComplete="off"
            defaultValue={metaData.presenter}
            onChange={handleInputChange}
            disabled={uploadState.state === STATE_UPLOADING || uploadState.state === STATE_UPLOADED}
          />
        </FormField>

        <Button
          onClick={handleUpload}
          disabled={
            recordings.length === 0
              || uploadState.state === STATE_UPLOADING
              || uploadState.state === STATE_UPLOADED
          }
        >
          <FontAwesomeIcon icon={faUpload} />
          {
            !opencast.prettyServerUrl() ? t('save-creation-button-upload') :
              <Trans i18nKey="save-creation-upload-to">
                Upload to <code sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                  padding: '1px 3px',
                }}>{{server: opencast.prettyServerUrl()}}</code>
              </Trans>
          }
        </Button>
        <Box sx={{ mt: 2 }}>
        {
          (() => { switch (uploadState.state) {
            case STATE_ERROR:
              return <Notification isDanger>{uploadState.error}</Notification>;
            case STATE_UPLOADING:
              return <Notification>{t('upload-notification')}</Notification>;
            case STATE_UPLOADED:
              return <Notification>{t('message-upload-complete')}</Notification>;
            default:
              return null;
          }})()
        }
        </Box>
      </React.Fragment>
    ) : (
      <Notification key="opencast-connection" isDanger>
        <Trans i18nKey="warning-missing-connection-settings">
          Warning. <Link to="/settings" sx={{ variant: 'styles.a' }}>settings</Link>
        </Trans>
      </Notification>
    );

  return (
    <Container>
      {recordings.length > 0 && <Beforeunload onBeforeunload={event => event.preventDefault()} />}

      <Styled.h1 sx={{ textAlign: 'center', fontSize: ['26px', '30px', '32px'] }}>
        {t('save-creation-title')}
      </Styled.h1>

      <div sx={{
        display: 'flex',
        flexDirection: ['column', 'column', 'row'],
        '& > *': {
          flex: '1 0 50%',
          p: [2, 2, '0 32px'],
          '&:last-child': {
            borderLeft: ['none', 'none', theme => `1px solid ${theme.colors.gray[3]}`],
          },
        },
      }}>
        <div>
          <Styled.h2
            sx={{ pb: 1, borderBottom: theme => `1px solid ${theme.colors.gray[2]}` }}
          >{t('save-creation-subsection-title-upload')}</Styled.h2>

          <div sx={{ margin: 'auto' }}>
            { uploadBox }
          </div>
        </div>

        <div>
          <Styled.h2
            sx={{ pb: 1, borderBottom: theme => `1px solid ${theme.colors.gray[2]}` }}
          >{t('save-creation-subsection-title-download')}</Styled.h2>

          <div sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: ['center', 'center', 'start'],
            flexWrap: 'wrap',
          }}>
            {recordings.length === 0 ? <Spinner /> : (
              recordings.map((recording, index) => (
                <RecordingPreview
                  key={index}
                  deviceType={recording.deviceType}
                  mimeType={recording.mimeType}
                  url={recording.url}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div sx={{ mb: '50px' }}></div>

      <ActionButtons
        next={null}
        prev={{
          onClick: handleBack,
          disabled: false,
        }}
      />
    </Container>
  );
}
