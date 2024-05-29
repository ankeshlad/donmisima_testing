import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'storefrontapi.generated';
import Reveal from '~/components/Reveal';

export const meta: MetaFunction = () => {
  return [{title: 'Don Misima 66 | Orders'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken?.accessToken) {
    return redirect('/account/login');
  }

  try {
    const paginationVariables = getPaginationVariables(request, {
      pageBy: 20,
    });

    const {customer} = await storefront.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...paginationVariables,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return json({customer});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders, numberOfOrders} = customer;
  return (
    <div className="orders">
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="acccount-orders">
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
                {nodes.map((order) => {
                  return <OrderItem key={order.id} order={order} />;
                })}
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </>
            );
          }}
        </Pagination>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
    </div>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {

  let orderImages = []

  if(order.lineItems.nodes.length){
    order.lineItems.nodes.map((node) => {
      orderImages.push({handle: node.title.slice(0,5).toLowerCase()+'-s-'+node.title.split(" ").splice(-1)[0].toLowerCase(), title: node.title.slice(0,5).toLowerCase(), image: node.variant?.image?.url})
    })
  }

  return (
    <>
      <Reveal width="100%">
        <Link to={`/account/orders/${btoa(order.id)}`} className='order'>
          <div className="order-header">
            <div className="order-header-main">
              <p className="order-date">{new Date(order.processedAt).toDateString()}</p>
              <a className='order-number'>Order: #{order.orderNumber}</a>
            </div>
            <p className='order-price'>
              <Money data={order.currentTotalPrice} />
            </p>
          </div>
          <div className="order-body">
            <div className="order-status-wrapper">
              <p className="order-status">Order status: {order.financialStatus}</p>
            </div>
            <div className="order-images">
              {
                orderImages?.map((orderImage, index) => {
                  return(
                    <Link
                        key={`orderImage-${index}`}
                        to={`/products/${orderImage.handle}?backUrl=/account/orders&backUrlName=Orders`}
                      >
                      <img className={`order-image cart-border-${orderImage.title}`} src={orderImage.image} />
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </Link>
      </Reveal>
    </>
  );
}

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    currentTotalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    id
    lineItems(first: 10) {
      nodes {
        title
        variant {
          image {
            url
            altText
            height
            width
          }
        }
      }
    }
    orderNumber
    customerUrl
    statusUrl
    processedAt
  }
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $country: CountryCode
    $customerAccessToken: String!
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const;
