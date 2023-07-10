import * as yup from 'yup';

export const metricsValidationSchema = yup.object().shape({
  follower_count: yup.number().integer(),
  engagement_rate: yup.number().integer(),
  user_id: yup.string().nullable(),
});
