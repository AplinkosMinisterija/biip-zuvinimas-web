import { createGlobalStyle } from 'styled-components';
import { Theme } from '@aplinkosministerija/design-system';
export enum ButtonColors {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  TRANSPARENT = 'transparent',
}
export const theme: Theme = {
  colors: {
    primary: '#121A55',
    secondary: '#13C9E7',
    tertiary: '#7A7E9F',
    transparent: 'transparent',
    danger: '#FE5B78',
    success: '#4FB922',
    buttons: {
      [ButtonColors.PRIMARY]: {
        background: '#121A55',
        text: 'white',
        border: 'transparent',
        hover: '#13C9E7',
      },
      [ButtonColors.SECONDARY]: {
        background: '#13C9E7',
        text: 'white',
        border: 'transparent',
        hover: '#13C9E78F',
      },
      [ButtonColors.TRANSPARENT]: {
        background: 'transparent',
        text: '#0b1f51',
        border: 'transparent',
        hover: 'transparent',
      },
      [ButtonColors.DANGER]: {
        background: '#FE5B78',
        text: 'white',
        border: 'transparent',
        hover: '#ff92a5',
      },
    },
    fields: {
      border: '#121A553D',
      borderFocus: '#121A55',
      text: '#0b1f51',
      background: 'white',
      error: '#FE5B78',
      label: '#0b1f51',
    },
    text: {
      primary: '#0b1f51',
    },
    border: '#121A553D',
    link: '#13C9E7',
    hover: {
      primary: '#13C9E7',
      secondary: '#13C9E78F',
      tertiary: '#7A7E9F',
      danger: '#FE5B78E6',
      success: '#4FB922B3',
      transparent: 'transparent',
    },
    tertiaryMedium: '#C6C8D6',
    tertiaryLight: '#F3F3F7',
    UPCOMING: '#00cae9',
    NOT_FINISHED: '#FE5B78',
    FINISHED: '#60b456',
    INSPECTED: '#60b456',
    CANCELED: '#FE5B78',
    ONGOING: '#FEBC1D',
    input: '#F3F3F7',
    label: '#0B1F51',
    error: '#FE5B78',
    light: '#f3f3f7',
    white: '#ffffff',
    darkerWhite: '#A4A7BD',
    pending: '#fea700',
    grey: '#B3B5C4',
  },
  height: {
    fields: 4,
  },
  fontWeight: {
    buttons: 400,
  },
  fontSize: {
    fields: 1.6,
    buttons: 1.6,
  },
};

export const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
    font-family: "Atkinson Hyperlegible", sans-serif;
  }
  html { 
    font-size: 62.5%; 
    width: 100vw;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f8fafc;
    font-size: 1.6rem;
    overflow:hidden;
  } 
  h1 {
    font-size: 3.2rem;
    color: #121A55;
  }
  a {
    text-decoration: none;
    color: inherit;
    :hover{
      color: inherit;
    }
  }
  button {
    outline: none;
    text-decoration: none;
    display: block;
    border: none;
    background-color: transparent;
  }
  #__next {
    height: 100%;
  }
  textarea {
    font-size: 1.6rem;
  }



.leaflet-div-icon {
    background: transparent;
    border: none;
  }


`;

export const device = {
  mobileS: `(max-width: 320px)`,
  mobileM: `(max-width: 425px)`,
  mobileL: `(max-width: 868px)`,
};
