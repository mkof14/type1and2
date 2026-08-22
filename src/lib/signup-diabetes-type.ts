import type { DiabetesType } from '../types';

export type SignupDiabetesChoice = DiabetesType | 'both';

export const SIGNUP_DIABETES_TYPE_KEY = 't1d_signup_diabetes_type';

export const isDiabetesType = (value: string | null | undefined): value is DiabetesType =>
  value === 'type1' || value === 'type2';

export const isSignupDiabetesChoice = (value: string | null | undefined): value is SignupDiabetesChoice =>
  isDiabetesType(value) || value === 'both';

export const parseSignupChoiceParam = (search: string): SignupDiabetesChoice | null => {
  const type = new URLSearchParams(search).get('type');
  return isSignupDiabetesChoice(type) ? type : null;
};

/** @deprecated use parseSignupChoiceParam */
export const parseDiabetesTypeParam = (search: string): DiabetesType | null => {
  const choice = parseSignupChoiceParam(search);
  return choice === 'type1' || choice === 'type2' ? choice : null;
};

export const readSignupDiabetesChoice = (): SignupDiabetesChoice | null => {
  if (typeof window === 'undefined') return null;
  const fromUrl = parseSignupChoiceParam(window.location.search);
  if (fromUrl) {
    window.localStorage.setItem(SIGNUP_DIABETES_TYPE_KEY, fromUrl);
    return fromUrl;
  }
  const stored = window.localStorage.getItem(SIGNUP_DIABETES_TYPE_KEY);
  return isSignupDiabetesChoice(stored) ? stored : null;
};

export const readSignupDiabetesType = (): DiabetesType | null => {
  const choice = readSignupDiabetesChoice();
  return choice === 'type1' || choice === 'type2' ? choice : null;
};

export const setSignupDiabetesChoice = (choice: SignupDiabetesChoice) => {
  window.localStorage.setItem(SIGNUP_DIABETES_TYPE_KEY, choice);
};

export const setSignupDiabetesType = (type: DiabetesType) => {
  window.localStorage.setItem(SIGNUP_DIABETES_TYPE_KEY, type);
};

export const diabetesTypeForApi = (choice: SignupDiabetesChoice): DiabetesType =>
  choice === 'type2' ? 'type2' : 'type1';

export const clearSignupDiabetesType = () => {
  window.localStorage.removeItem(SIGNUP_DIABETES_TYPE_KEY);
};

export const signupPathForType = (type: DiabetesType | null) =>
  type ? `/create-account?type=${type}` : '/create-account';

export const signupPathForChoice = (choice: SignupDiabetesChoice | null) =>
  choice ? `/create-account?type=${choice}` : '/create-account';

export const typeQuery = (type: DiabetesType | SignupDiabetesChoice | null) =>
  type ? `?type=${type}` : '';

export const accessPathForType = (type: DiabetesType | null) =>
  `/access${typeQuery(type)}`;

export const setupPathForType = (type: DiabetesType | null) =>
  `/household-setup${typeQuery(type)}`;

export const workspacePathForType = (type: DiabetesType | null) =>
  `/workspace${typeQuery(type)}`;

export const memberPathForRoute = (
  route: 'signin' | 'signup' | 'setup' | 'workspace',
  type: DiabetesType | null,
) => {
  if (route === 'signin') return accessPathForType(type);
  if (route === 'signup') return signupPathForType(type);
  if (route === 'setup') return setupPathForType(type);
  return workspacePathForType(type);
};

export const syncSignupTypeFromLocation = () => {
  readSignupDiabetesChoice();
};
