import * as yup from 'yup';

export const groupValidationSchema = yup.object().shape({
  name: yup.string().required(),
  strategy: yup.string(),
  leader_id: yup.string().nullable(),
});
