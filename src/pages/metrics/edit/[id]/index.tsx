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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getMetricsById, updateMetricsById } from 'apiSdk/metrics';
import { Error } from 'components/error';
import { metricsValidationSchema } from 'validationSchema/metrics';
import { MetricsInterface } from 'interfaces/metrics';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function MetricsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MetricsInterface>(
    () => (id ? `/metrics/${id}` : null),
    () => getMetricsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MetricsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMetricsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/metrics');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MetricsInterface>({
    initialValues: data,
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
            Edit Metrics
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(MetricsEditPage);
