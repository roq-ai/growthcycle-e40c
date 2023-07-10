import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMetrics } from 'apiSdk/metrics';
import { Error } from 'components/error';
import { metricsValidationSchema } from 'validationSchema/metrics';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { MetricsInterface } from 'interfaces/metrics';

function MetricsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MetricsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMetrics(values);
      resetForm();
      router.push('/metrics');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MetricsInterface>({
    initialValues: {
      follower_count: 0,
      engagement_rate: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: metricsValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Metrics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="follower_count" mb="4" isInvalid={!!formik.errors?.follower_count}>
            <FormLabel>Follower Count</FormLabel>
            <NumberInput
              name="follower_count"
              value={formik.values?.follower_count}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('follower_count', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.follower_count && <FormErrorMessage>{formik.errors?.follower_count}</FormErrorMessage>}
          </FormControl>
          <FormControl id="engagement_rate" mb="4" isInvalid={!!formik.errors?.engagement_rate}>
            <FormLabel>Engagement Rate</FormLabel>
            <NumberInput
              name="engagement_rate"
              value={formik.values?.engagement_rate}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('engagement_rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.engagement_rate && <FormErrorMessage>{formik.errors?.engagement_rate}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'metrics',
    operation: AccessOperationEnum.CREATE,
  }),
)(MetricsCreatePage);
