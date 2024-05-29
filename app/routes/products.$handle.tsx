import {Suspense, useEffect, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import BackIcon from '../assets/back.svg'
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/utils';
import PablosLogo from '../assets/PablosLogo.svg';
import MariasLogo from '../assets/MariasLogo.svg';
import DiegosLogo from '../assets/DiegosLogo.svg';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Don Misima 66 | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  let { searchParams } = new URL(request.url)
  let backUrl = searchParams.get("backUrl")
  let backUrlName = searchParams.get("backUrlName")

  return defer({product, variants, handle, selectedOptions, backUrl, backUrlName});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, backUrl, backUrlName} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  // const [autoBuy, setAutoBuy] = useState(false);
  // useEffect(() => {
  //   const siteUrl = window.location.search;
  //   if (siteUrl.slice(-4) === 'true') {
  //     setAutoBuy(true);
  //   }
  // });
  return (
    <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <ToastContainer draggable={false} transition={Zoom} autoClose={2000} theme="colored" />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
        backUrl={backUrl}
        backUrlName={backUrlName}
      />
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
  backUrl,
  backUrlName
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  backUrl: any;
  backUrlName: any;
}) {
  const {title, descriptionHtml, description} = product;
  return (
    <div className="product-main">
      <div className="product-wrapper">
        <a className="product-back-wrapper" href={`${backUrl ? backUrl : '/'}`}>
          <img className="product-back" src={BackIcon}/>
          <p className="product-back-text">{backUrlName ? backUrlName : 'Home Page'}</p>
        </a>
        <img className="product-collection-image" src={description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase() === 'maria' ? MariasLogo : description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase() === 'diego' ? DiegosLogo : PablosLogo}/>
        <div className="product-data-wrapper">
          <div className="product-main-info">
            <h1>{title}</h1>
            <ProductPrice selectedVariant={selectedVariant} />
          </div>
          <div className="product-data">
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Collection</p>
              <p className="product-data-element-value">{description.split(", ")[0].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Format</p>
              <p className="product-data-element-value">{description.split(", ")[1].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Length</p>
              <p className="product-data-element-value">{description.split(", ")[2].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Diameter</p>
              <p className="product-data-element-value">{description.split(", ")[3].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Weight</p>
              <p className="product-data-element-value">{description.split(", ")[4].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Per Box</p>
              <p className="product-data-element-value">{description.split(", ")[5].split('- ')[1]}</p>
            </div>
            <div className={`product-data-element line-${description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
              <p className="product-data-element-heading">Cigar Strength</p>
              <p className="product-data-element-value">{description.split(", ")[6].split('- ')[1]}</p>
            </div>
          </div>
          <Suspense
            fallback={
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={[]}
              />
            }
          >
            <Await
              errorElement="There was a problem loading product variants"
              resolve={variants}
            >
              {(data) => (
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  variants={data.product?.variants.nodes || []}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <AddToCartButton

        onClick={() => {
          toast(
          <div className={`addedToCart ${product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
            <Image
              data={selectedVariant?.image}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
              style={{pointerEvents: 'none'}}
            />
            <div className="addedToCartInfo">
              <p className="addedText">Added to cart</p>
              <p className="title">{selectedVariant?.product.title}</p>
            </div>
          </div>)}}

        disabled={!selectedVariant || !selectedVariant.availableForSale}
       
        collection={product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to shopping bag' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  collection,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  collection: string;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`product-add-to-cart-button color-${collection}`} 
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
