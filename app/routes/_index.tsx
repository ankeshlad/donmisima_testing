import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction, useNavigate} from '@remix-run/react';
import {Suspense} from 'react';
import React, { useState } from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import Hero from '~/components/Hero';
import Heading from '~/components/Heading';
import PablosLogo from '../assets/PablosLogo.svg';
import MariasLogo from '../assets/MariasLogo.svg';
import DiegosLogo from '../assets/DiegosLogo.svg';
import PlusIcon from '../assets/PlusIcon.svg';
import ShopLocations from '~/components/ShopLocations';
import Footer from '~/components/Footer';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import {
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import Reveal from '~/components/Reveal';
import { NoSearchResults, SearchForm, SearchResults } from '~/components/Search';

export const meta: MetaFunction = () => {
  return [{title: 'Don Misima 66 | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const notMainContext = context;
  const {storefront} = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  return defer({recommendedProducts, storefront, notMainContext});
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
          className="btn-qtyselector"
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



export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
    <ToastContainer draggable={false} transition={Zoom} autoClose={2000} theme="colored" />
    <div className="home">
      <Hero />
      <section>
        <Heading heading={'OUR BLENDS'} />
          <div className="page_container">
            <div className="ourBlends">
              <Reveal width="100%" delay={0.35}>
                <a className="blendCard" href="/cigars?blend=pablo">
                  <div className="blendCardPattern"></div>
                  <img alt="Pablo`s blend logo" className="blendCardLogo" src={PablosLogo} />
                </a>
              </Reveal>
              <Reveal width="100%" delay={0.45}>
                <a className="blendCard" href="/cigars?blend=maria">
                  <div className="blendCardPattern"></div>
                  <img alt="Maria`s blend logo" className="blendCardLogo" src={MariasLogo} />
                </a>
              </Reveal>
              <Reveal width="100%" delay={0.55}>
                <a className="blendCard" href="/cigars?blend=diego">
                  <div className="blendCardPattern"></div>
                  <img alt="Diego`s blend logo" className="blendCardLogo" src={DiegosLogo} />
                </a>
              </Reveal>
            </div>
          </div>
        
      </section>

      <section>
        <Heading heading={'BESTSELLERS'} />
        <div className="page_container">
          <RecommendedProducts products={data.recommendedProducts} />
          <a href='/cigars' className="fullWidthButton">View All</a>
        </div>
      </section>

      <div className="certificatesBlock">
        <div className="content">
          <h2>Certificates of Authenticity are a symbol of our dedication to providing you with a premium smoking experience</h2>
          <a href='/certifications' className="fullWidthButton">Our Certifications</a>
        </div>
      </div>

      <Footer />

    </div>
    </>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  const navigate = useNavigate();
  return (
    <div className="recommended-products">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((mapped_product: any, index) => {
                return(
                  <Reveal width='100%' delay={(index+1) % 3 === 0 ? 0.55 : (index+1) % 3 === 2 ? 0.45 : 0.35}>
                    <>
                      <div 
                        className={`product-add-to-cart product-add-to-cart-${mapped_product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}
                        onClick={() => {toast(
                        <div className={`addedToCart ${mapped_product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
                          <Image
                            data={mapped_product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
                            style={{pointerEvents: 'none'}}
                          />
                          <div className="addedToCartInfo">
                            <p className="addedText">Added to cart</p>
                            <p className="title">{mapped_product.title}</p>
                          </div>
                        </div>)}}
                      >
                        <AddToCartButton
                        
                        lines={
                          [{
                            merchandiseId: mapped_product.variants.nodes[0].id,
                            quantity: 1,
                          }]
                        }
                        >
                          <img alt="plus icon" src={PlusIcon} />
                          {/* <div className="plus_icon">
                            <div className="plus_icon_vertical"></div>
                            <div className="plus_icon_horizontal"></div>
                          </div> */}
                        </AddToCartButton>
                      </div>
                      <Link
                        key={mapped_product.id}
                        className="recommended-product"
                        to={`/products/${mapped_product.handle}?backUrl=/`}
                      >
                        <div className={`product-card-image-wrapper collection-border-${mapped_product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}>
                          <div className="product-card-product-data">
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Collection</p>
                              <div className="product_collection_name">
                                <div className={`collection-circle-${mapped_product.description.split(", ")[0].split('- ')[1].slice(0,5).toLowerCase()}`}></div>
                                <p className="product-card-product-data-value">{mapped_product.description.split(", ")[0].split('- ')[1]}</p>
                              </div>
                            </div>
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Format</p>
                              <p className="product-card-product-data-value">{mapped_product.description.split(", ")[1].split('- ')[1]}</p>
                            </div>
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Length</p>
                              <p className="product-card-product-data-value">{mapped_product.description.split(", ")[2].split('- ')[1]}</p>
                            </div>
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Diameter</p>
                              <p className="product-card-product-data-value">{mapped_product.description.split(", ")[3].split('- ')[1]}</p>
                            </div>
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Weight</p>
                              <p className="product-card-product-data-value">{mapped_product.description.split(", ")[4].split('- ')[1]}</p>
                            </div>
                            <div className="product-card-product-data-pair">
                              <p className="product-card-product-data-heading">Per Box</p>
                              <p className="product-card-product-data-value">{mapped_product.description.split(", ")[5].split('- ')[1]}</p>
                            </div>
                          </div>
                          <Image
                            data={mapped_product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
                            style={{pointerEvents: 'none'}}
                          />
                        </div>
                        <div className="product_name_price">
                          <h4>{mapped_product.title}</h4>
                          <small>
                            <Money data={mapped_product.priceRange.minVariantPrice} />
                          </small>
                        </div>
                      </Link>
                      <div className="quantity selector">
                      <QuantitySelector
                      product={mapped_product}
                    />
                      </div>
                    </>
                  </Reveal>
              )})}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function QuantitySelector({ product }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const handleChange = (e) => setQuantity(parseInt(e.target.value) || 1);

  const handleAddToCart = () => {
    toast(
      <div className={`addedToCart ${product.description.split(", ")[0].split('- ')[1].slice(0, 5).toLowerCase()}`}>
        <Image
          data={product.images.nodes[0]}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
          style={{ pointerEvents: 'none' }}
        />
        <div className="addedToCartInfo">
          <p className="addedText">{quantity} Product Added to cart</p>
          <p className="title">{product.title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="quantity-selector">
      <button onClick={handleDecrease}>-</button>
      <input className="quantityselector" type="number" value={quantity} onChange={handleChange} min="1" />
      <button onClick={handleIncrease}>+</button>
    </div>
     <AddToCartButton
     lines={[
       {
         merchandiseId: product.variants.nodes[0].id,
         quantity: quantity,
       },
     ]}
     onClick={handleAddToCart}
   >
     Add to Cart
   </AddToCartButton>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
    variants(first: 1) {
      nodes {
        id
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: RELEVANCE, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

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