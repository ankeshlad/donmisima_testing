import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction, useLocation} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
  CartForm,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import Reveal from '~/components/Reveal';
import PlusIcon from '../assets/PlusIcon.svg';
import Heading from '~/components/Heading';
import Footer from '~/components/Footer';
import { useEffect, useState } from 'react';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';

export const meta: MetaFunction = () => {
  return [{title: 'Don Misima 66 | Our Cigars'}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const handle = 'all';
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  const [showPablo, setShowPablo] = useState(true)
  const [showMaria, setShowMaria] = useState(true)
  const [showDiego, setShowDiego] = useState(true)
  const [strangeSwitch, setStrangeSwitch] = useState(false)

  const location = useLocation()

  useEffect(() => {
    if(location.search){
      if(location.search.slice(-5) === 'pablo'){
        setShowPablo(true)
        setShowMaria(false)
        setShowDiego(false)
        setStrangeSwitch(true)
      }
      if(location.search.slice(-5) === 'maria'){
        setShowPablo(false)
        setShowMaria(true)
        setShowDiego(false)
        setStrangeSwitch(true)
      }
      if(location.search.slice(-5) === 'diego'){
        setShowPablo(false)
        setShowMaria(false)
        setShowDiego(true)
        setStrangeSwitch(true)
      }
    }
  }, [])

  const switchHandler = (collection: string) => {
    if(!strangeSwitch){
      if(collection === 'pablo'){
        setShowPablo(!showPablo)
      }
      if(collection === 'maria'){
        setShowMaria(!showMaria)
      }
      if(collection === 'diego'){
        setShowDiego(!showDiego)
      }
    } else {
      if(collection === 'pablo'){
        setShowPablo(true)
        setShowMaria(false)
        setShowDiego(false)
      }
      if(collection === 'maria'){
        setShowPablo(false)
        setShowMaria(true)
        setShowDiego(false)
      }
      if(collection === 'diego'){
        setShowPablo(false)
        setShowMaria(false)
        setShowDiego(true)
      }
    }
  }

  return (
    <>
    <ToastContainer draggable={false} transition={Zoom} autoClose={2000} theme="colored" />
    <div className="collection page_wrapper">
      <section>
        <Heading heading='OUR CIGARS' />
        <div className='page_container'>
          <div className='collection-type-buttons-wrapper'>
            <Reveal width='100%' delay={0.35}>
              <a className={`collection-type-button collection-type-button-pablo ${!showPablo ? 'collection-type-button-inactive' : ''}`}
                onClick={() => {switchHandler('pablo')}}
              >
                Pablo`s blend
              </a>
            </Reveal>
            <Reveal width='100%' delay={0.45}>
              <a className={`collection-type-button collection-type-button-maria ${!showMaria ? 'collection-type-button-inactive' : ''}`}
                onClick={() => {switchHandler('maria')}}
              >
                Maria`s blend
              </a>
            </Reveal>
            <Reveal width='100%' delay={0.55}>
            <a className={`collection-type-button collection-type-button-diego ${!showDiego ? 'collection-type-button-inactive' : ''}`}
              onClick={() => {switchHandler('diego')}}
            >
              Diego`s blend
            </a>
            </Reveal>
          </div>
        </div>
        <div className='page_container'>
        <Pagination connection={collection.products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
                <ProductsGrid products={nodes} showMaria={showMaria} showPablo={showPablo} showDiego={showDiego}/>
            </>
          )}
        </Pagination>
        </div>
      </section>
      <Footer />
    </div>
    </>
  );
}

function ProductsGrid({products, showMaria, showPablo, showDiego}: {products: ProductItemFragment[], showMaria: boolean, showPablo: boolean, showDiego: boolean}) {
  return (
    <div className="recommended-products-grid">
      {products.map((product, index) => {
        if(
          ((product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase() === 'maria' && showMaria)
          || (product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase() === 'pablo' && showPablo)
          || (product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase() === 'diego' && showDiego))
          ){
          return (
            <ProductItem
              key={product.id}
              product={product}
              index={index}
              loading={index < 8 ? 'eager' : undefined}
            />
          );
        }
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
  index
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
  index : number;
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Reveal width='100%' delay={(index+1) % 3 === 0 ? 0.55 : (index+1) % 3 === 2 ? 0.45 : 0.35}>
      <>
        <div className={`product-add-to-cart product-add-to-cart-${product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}
              onClick={() => {toast(
                <div className={`addedToCart ${product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
                  <Image
                    data={product.featuredImage}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    style={{pointerEvents: 'none'}}
                  />
                  <div className="addedToCartInfo">
                    <p className="addedText">Added to cart</p>
                    <p className="title">{product.title}</p>
                  </div>
                </div>)}}
        >
          <AddToCartButton
                        
                        lines={
                          [{
                            merchandiseId: product.variants.nodes[0].id,
                            quantity: 1,
                          }]
                        }
                        >
                          <img alt="plus icon" src={PlusIcon} />
            </AddToCartButton>
        </div>
        <Link
          className="recommended-product"
          key={product.id}
          prefetch="intent"
          to={variantUrl+'&backUrl=/cigars&backUrlName=Our+Cigars'}
        >
          <div className={`product-card-image-wrapper collection-border-${product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
            <div className="product-card-product-data">
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Collection</p>
                <div className="product_collection_name">
                  <div className={`collection-circle-${product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}></div>
                  <p className="product-card-product-data-value">{product.description.split(", ")[0].split('- ')[1]}</p>
                </div>
              </div>
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Format</p>
                <p className="product-card-product-data-value">{product.description.split(", ")[1].split('- ')[1]}</p>
              </div>
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Length</p>
                <p className="product-card-product-data-value">{product.description.split(", ")[2].split('- ')[1]}</p>
              </div>
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Diameter</p>
                <p className="product-card-product-data-value">{product.description.split(", ")[3].split('- ')[1]}</p>
              </div>
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Weight</p>
                <p className="product-card-product-data-value">{product.description.split(", ")[4].split('- ')[1]}</p>
              </div>
              <div className="product-card-product-data-pair">
                <p className="product-card-product-data-heading">Per Box</p>
                <p className="product-card-product-data-value">{product.description.split(", ")[5].split('- ')[1]}</p>
              </div>
            </div>
            {product.featuredImage && (
              <Image
                alt={product.featuredImage.altText || product.title}
                aspectRatio="1/1"
                data={product.featuredImage}
                loading={loading}
                sizes="(min-width: 45em) 20vw, 50vw"
              />
            )}
          </div>
          <div className="product_name_price">
            <h4>{product.title}</h4>
            <small>
              <Money data={product.priceRange.minVariantPrice} />
            </small>
          </div>
        </Link>
      </>
    </Reveal>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
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
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    description
    
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
