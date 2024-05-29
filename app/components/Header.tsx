import {Await, NavLink, useLoaderData, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import HeaderLogo from '../assets/headerLogo.svg';
import User from "../assets/userIcon.svg";
import Search from "../assets/searchIcon.svg";
import Cart from "../assets/shoppingBagIcon.svg";
import Reveal from './Reveal';
import { PredictiveSearchForm, PredictiveSearchResults } from './Search';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { CartMain } from './Cart';


type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {


  const [theme, setTheme] = useState('none');
  const location = useLocation()
  

  const [showSearch, setShowSearch] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const [showCart, setShowCart] = useState(false)
  
  const switchSearch = () => {
    setShowSearch(!showSearch)
  }

  useEffect(() => {
    if(window.innerWidth < 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
    window.addEventListener('scroll', function () {
      if(window.scrollY > this.window.innerHeight) {
        setTheme('light')
      } else {
          setTheme('none')
      }
    });
  }, [])

  const {shop, menu} = header;

  return (
    <div className="header-search-wrapper">
      <header id="main_header" className={`header ${location.pathname === '/'  ? theme : location.pathname.slice(1,9) === 'products' ? 'transparent_header' : 'light'}`}>
        <div className="header_container header_container_desctop">
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <div className="header-logo-wrapper">
              <img className="header-logo" src={HeaderLogo} />
            </div>
          </NavLink>
          <Reveal>
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
            />
          </Reveal>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} showCart={showCart} setShowCart={setShowCart}/>
          <div onClick={() => {setShowCart(!showCart)}} className={`manualCartWrapper ${showCart ? 'showManualCartWrapper' : 'hideManualCartWrapper'}`}>
            <ManualCart cart={cart} setShowCart={setShowCart} showCart={showCart} />
          </div>
        </div>
        <div className="header_container header_container_mobile">
          <nav className="header-ctas" role="navigation">
              <HeaderMenuMobileToggle />
              <SearchToggle />
          </nav>
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
              <img className="header-logo" src={HeaderLogo} />
          </NavLink>
          <nav className="header-ctas" role="navigation">
            <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
              <img className="header_icon" src={User}/>
            </NavLink>
            <CartToggle cart={cart} showCart={showCart} setShowCart={setShowCart} />
          </nav>
          <div onClick={() => {setShowCart(!showCart)}} className={`manualCartWrapper ${showCart ? 'showManualCartWrapper' : 'hideManualCartWrapper'}`}>
            <ManualCart cart={cart} setShowCart={setShowCart} showCart={showCart} />
          </div>
        </div>
      </header>
      <SearchAside />
    </div>
  );
}

interface ManualCartProps{
  setShowCart: any,
  cart: LayoutProps['cart'],
  showCart: boolean;
}

const ManualCart = ({cart, setShowCart}: ManualCartProps) => {
  return(
    <aside onClick={(e) => {e.stopPropagation()}}>
      <header>
        <h3>SHOPPING BAG</h3>
        <a className="close" onClick={() => {setShowCart(false)}}>×</a>
      </header>
      <main>
        <Suspense fallback={<p>Loading cart ...</p>}>
          <Await resolve={cart}>
            {(cart) => {
              return <CartMain cart={cart} layout="aside" setShowCart={setShowCart} />;
            }}
            
          </Await>
        </Suspense>
      </main>
     {/* // <p>dqwdqwd</p> */}
    </aside>
  )
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <a
            className="header-menu-item"
            key={item.id}
            onClick={closeAside}
            href={url}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}

function SearchAside() {
  return (
    <div id="search_block" className="predictive-search-wrapper predictive-search-hidden">
      <div className="predictive-search-secondary-wrapper">
        <div className="predictive-search">
          <PredictiveSearchForm>
            {({fetchResults, inputRef}) => (
              <div>
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search"
                  ref={inputRef}
                  className="search-input"
                  type="search"
                />
                <button type="submit">Search</button>
                <a className='close_button' onClick={() => {
                  const search_block = document.getElementById('search_block')
                  if(search_block){
                    search_block.classList.add("predictive-search-hidden");
                  }
                }}>✕</a>
              </div>
            )}
          </PredictiveSearchForm>
          <PredictiveSearchResults />
        </div>
      </div>
    </div>
  );
}

interface HeaderCtasProps{
  isLoggedIn: any,
  cart: any,
  setShowCart: any,
  showCart: boolean;
}

function HeaderCtas({
  isLoggedIn,
  cart,
  setShowCart,
  showCart
}: HeaderCtasProps) {


  return (
    <nav className="header-ctas" role="navigation">
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <img className="header_icon" src={User}/>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} showCart={showCart} setShowCart={setShowCart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <img onClick={() => {
    const search_block = document.getElementById('search_block')
    const header = document.getElementById('main_header')
    if(search_block && header){
      if(search_block.classList.contains("predictive-search-hidden")){
        search_block.classList.remove("predictive-search-hidden");
        header.classList.add("light");
        header.classList.remove("none");
        header.classList.remove("transparent_header");
      } else {
        search_block.classList.add("predictive-search-hidden");
      }
    }
  }} className="header_icon" src={Search}/>;
}

interface CartBadgeProps{
  count: number,
  showCart: boolean,
  setShowCart: any;
}

function CartBadge({count, showCart, setShowCart}: CartBadgeProps) {
   return <a className="header_icon header_icon_cart" onClick={() => {setShowCart(true)}}><img src={Cart}/> {count}</a>;
}

interface CartToggleProps{
  cart: any,
  showCart: boolean,
  setShowCart: any;
}

function CartToggle({cart, showCart, setShowCart}: CartToggleProps) {
  return (
    <Suspense fallback={<CartBadge count={0} showCart={showCart} setShowCart={setShowCart}/>}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} showCart={showCart} setShowCart={setShowCart} />;
          return <CartBadge count={cart.totalQuantity || 0} showCart={showCart} setShowCart={setShowCart} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Our Cigars',
      type: 'PAGE',
      url: '/cigars',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'About Us',
      type: 'PAGE',
      url: '/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Locations',
      type: 'PAGE',
      url: '/locations',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'Certifications',
      type: 'PAGE',
      url: '/certifications',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
