//; -*- mode: rjsx;-*-
/** @jsx jsx */
import { jsx } from 'theme-ui';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';


// A styled `<input>`` element with a label. Displays errors and integrated with
// `react-hook-form`.
//
// Props:
// - `errors` and `register`: the two values returned by `useForm`
// - `label`: the human readable string describing the field
// - `name`, `type` and `rest`: passed as HTML attributes
// - `required`: boolean, whether this field is required or may be empty
// - `validate`: optional, a function validating the value and returning a
//   string in the case of error.
export const Input = ({
  errors,
  register,
  label,
  name,
  required,
  validate,
  type = 'text',
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div
      sx={{
        '&:not(:last-child)': {
          mb: 3
        }
      }}
    >
      <label
        sx={{
          color: 'text',
          display: 'block',
          fontSize: 2,
          fontWeight: 'bold'
        }}
      >
        {label}
        <div
          sx={{
            display: 'block',
            boxSizing: 'border-box',
            clear: 'both',
            fontSize: 2,
            position: 'relative',
            textAlign: 'left'
          }}
        >
          <input
            aria-invalid={errors[name] ? 'true' : 'false'}
            aria-describedby={`${name}Error`}
            autoComplete="off"
            name={name}
            sx={{ variant: 'styles.input' }}
            type={type}
            {...register(name, { validate, ...required ? { required: t('forms-validation-error-required') } : {}, })}
            {...rest}
          />
          {errors[name] && (
            <p
              id={`${name}Error`}
              sx={{
                color: 'error',
                fontSize: 1,
                fontWeight: 'body',
                mt: 1
              }}
            >
              {errors[name].message}
            </p>
          )}
        </div>
      </label>
    </div>
  );
};

// A styled `<Dropdown>`` element with a label. Displays errors and integrated with
// `react-hook-form`.
//
// Props:
// - `errors` and `register`: the two values returned by `useForm`
// - `label`: the human readable string describing the field
// - `name`, `type` and `rest`: passed as HTML attributes
// - `required`: boolean, whether this field is required or may be empty
// - `validate`: optional, a function validating the value and returning a
//   string in the case of error.

export const Dropdown = ({
  errors,
  register,
  label,
  name,
  required,
  validate,
  clearable,
  type = 'select',
  disabled,
  control,
  ...rest
}) => {
  const { t } = useTranslation();

  const selectStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: 'white',
      borderColor: state.isFocused ? 'var(--theme-ui-colors-primary)' : 'var(--theme-ui-colors-gray-2)',
      borderRadius: '2px',
      minHeight: '2rem',
      height: '2rem',
      outline: state.isFocused ? '5px solid var(--theme-ui-colors-focus-0)' : 'none',
      outlineOffset: '-5px',
      boxShadow: state.isFocused ? '0 0 3px 0 var(--theme-ui-colors-focus-0)' : 'none',
      fontWeight: 'normal',
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '2rem',
      padding: '0 6px'
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: state => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '2rem',
    }),
  };

  return (
    <div
      sx={{
        '&:not(:last-child)': {
          mb: 3
        }
      }}
    >
      <label
        sx={{
          color: 'text',
          display: 'block',
          fontSize: 2,
          fontWeight: 'bold'
        }}
      >
        {label}
        <div
          sx={{
            display: 'block',
            boxSizing: 'border-box',
            clear: 'both',
            fontSize: 2,
            position: 'relative',
            textAlign: 'left'
          }}
        >

          <Select
            isDisabled={disabled}
            isSearchable={true}
            isClearable={clearable}
            aria-invalid={errors[name] ? 'true' : 'false'}
            aria-describedby={`${name}Error`}
            autoComplete="off"
            name={name}
            styles={selectStyles}
            sx={{
              variant: 'styles.dropdown',
            }}
            {...register(name, { validate, ...required ? { required: t('forms-validation-error-required') } : {}, })}
            {...rest}
          >
          </Select>

          {errors[name] && (
            <p
              id={`${name}Error`}
              sx={{
                color: 'error',
                fontSize: 1,
                fontWeight: 'body',
                mt: 1
              }}
            >
              {errors[name].message}
            </p>
          )}
        </div>
      </label>
    </div>
  );
};
