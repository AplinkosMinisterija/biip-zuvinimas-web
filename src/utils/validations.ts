import { phoneNumberRegexPattern } from '@aplinkosministerija/design-system';
import { personalCode } from 'lt-codes';
import * as Yup from 'yup';
import { FishOriginTypes } from './constants';
import { checkIfDateIsAfter } from './functions';
import { validationTexts } from './texts';

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  password: Yup.string().required(validationTexts.requireText),
});

export const validateNewTenantUser = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  firstName: Yup.string()
    .required(validationTexts.requireText)
    .test('validFirstName', validationTexts.validFirstName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  lastName: Yup.string()
    .required(validationTexts.requireText)
    .test('validLastName', validationTexts.validLastName, (values) => {
      if (/\d/.test(values || '')) return false;

      return true;
    }),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
  personalCode: Yup.string()
    .required(validationTexts.requireText)
    .trim()
    .test('validatePersonalCode', validationTexts.personalCode, (value) => {
      return personalCode.validate(value!).isValid;
    }),
});

export const validateUpdateTenantUser = Yup.object().shape({});

export const validateMyProfile = Yup.object().shape({
  email: Yup.string().required(validationTexts.requireText).email(validationTexts.badEmailFormat),
  phone: Yup.string()
    .required(validationTexts.requireText)
    .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
});

export const validateFishStocking = (minTime: number) =>
  Yup.object().shape({
    location: Yup.object().required(validationTexts.requireText),
    eventTime: Yup.date()
      .test('valid eventTime', validationTexts.invalidEventTime, (value) => {
        return checkIfDateIsAfter(value, minTime);
      })
      .required(validationTexts.requireText),
    assignedTo: Yup.object().required(validationTexts.requireText).nullable(),
    phone: Yup.string()
      .required(validationTexts.requireText)
      .matches(phoneNumberRegexPattern, validationTexts.badPhoneFormat),
    batches: Yup.array().of(
      Yup.object().shape({
        fishType: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        fishAge: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        amount: Yup.string().required(validationTexts.requireText),
        weight: Yup.number().notRequired(),
      }),
    ),
    fishOriginCompanyName: Yup.string().when('fishOrigin', (fishOrigin: any, schema: any) =>
      fishOrigin?.[0] === FishOriginTypes.GROWN
        ? schema.required(validationTexts.requireText)
        : schema,
    ),
    fishOriginReservoir: Yup.object().when('fishOrigin', (fishOrigin: any, schema: any) =>
      fishOrigin?.[0] === FishOriginTypes.CAUGHT
        ? schema.required(validationTexts.requireText)
        : schema,
    ),
  });

export const validateFreelancerFishStocking = (minTime: number) =>
  Yup.object().shape({
    location: Yup.object().required(validationTexts.requireText),
    eventTime: Yup.date()
      .test('valid eventTime', validationTexts.invalidEventTime, (value) => {
        return checkIfDateIsAfter(value, minTime);
      })
      .required(validationTexts.requireText),
    batches: Yup.array().of(
      Yup.object().shape({
        fishType: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        fishAge: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        amount: Yup.string().required(validationTexts.requireText),
        weight: Yup.number().notRequired(),
      }),
    ),
    fishOriginCompanyName: Yup.string().when('fishOrigin', (fishOrigin: any, schema: any) =>
      fishOrigin?.[0] === FishOriginTypes.GROWN
        ? schema.required(validationTexts.requireText)
        : schema,
    ),
    fishOriginReservoir: Yup.object().when('fishOrigin', (fishOrigin: any, schema: any) =>
      fishOrigin?.[0] === FishOriginTypes.CAUGHT
        ? schema.required(validationTexts.requireText)
        : schema,
    ),
  });

export const validateFishStockingReview = Yup.object().shape({
  waybillNo: Yup.string().required(validationTexts.requireText),
  containerWaterTemp: Yup.string().required(validationTexts.requireText),
  waterTemp: Yup.string().required(validationTexts.requireText),
  veterinaryApprovalNo: Yup.string().required(validationTexts.requireText),
  batches: Yup.array().of(
    Yup.object().shape({
      reviewAmount: Yup.string().required(validationTexts.requireText),
    }),
  ),
  newBatches: Yup.array()
    .of(
      Yup.object().shape({
        fishType: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        fishAge: Yup.object()
          .required(validationTexts.requireSelect)
          .shape({
            id: Yup.number().required(validationTexts.requireText),
          }),
        reviewAmount: Yup.string().required(validationTexts.requireText),
        reviewWeight: Yup.number().notRequired(),
      }),
    )
    .notRequired(),
  signatures: Yup.array().of(
    Yup.object().shape({
      organization: Yup.string().required(validationTexts.requireText),
      signedBy: Yup.string().required(validationTexts.requireText),
    }),
  ),
});
