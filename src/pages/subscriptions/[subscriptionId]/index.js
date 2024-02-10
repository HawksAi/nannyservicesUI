import { useCallback, useEffect, useState } from 'react';
import {useRouter} from 'next/router'
import NextLink from 'next/link';
import Head from 'next/head';
import { Avatar, Box, Chip, Container, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { subscriptionApi } from '../../../__fake-api__/subscription-api';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { SubscriptionEditForm } from '../../../components/subscriptions/subscription-edit-form';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { getInitials } from '../../../utils/get-initials';
const Subscription = (props) => {
  const isMounted = useMounted();
  const [subscription, setSubscription] = useState(null);
  const {subscriptionId} = props
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  const getSubscription = useCallback(async () => {
    try {
      const data = await subscriptionApi.getSubscription(subscriptionId);
      // call API to set the requested activity
      
      if (isMounted()) {
        setSubscription(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, subscriptionId]);

  useEffect(() => {
      getSubscription(subscriptionId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!subscription) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Subscriptions | Modificar
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <NextLink
              href="/subscriptions"
              passHref
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <ArrowBackIcon
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="subtitle2">
                  Subscriptions
                </Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <div>
              <Typography
                noWrap
                variant="h4"
              >
                {subscription.name}
              </Typography>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="subtitle2">
                  id:
                </Typography>
                <Chip
                  label={subscription.id}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <SubscriptionEditForm subscription={subscription} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Subscription.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Subscription;

export async function getServerSideProps(ctx) {
  const { subscriptionId } = ctx.query;
  return {
    props: {
      subscriptionId,
    },
  };
}