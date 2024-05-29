import {Await, useLoaderData} from '@remix-run/react';

import {Suspense, useEffect, useState} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';




export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
};


export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {
  
  
  const [isOld, setIsOld] = useState(true)
  
  useEffect(() => {
    setIsOld(window.localStorage.getItem('isOld') === 'true')
  }, [isOld])
  
  return (
    <div className="layout">
      <MobileMenuAside menu={header?.menu} shop={header?.shop} />

      {!isOld &&
        <div className="notification_wrapper">
        <div className="notification">
          <h1>Are you over 18 years old?</h1>
          <p>The "donmisima.com" website is intended for visitors over 18 years old. Please confirm your age.</p>
          <div className="notification_buttons">
            <a className="notification_button" onClick={() => {window.localStorage.setItem('isOld', 'true'); setIsOld(true)}}>Yes</a>
            <a className="notification_button" href="https://hbpsa.ch">No</a>
          </div>
        </div>
      </div>
    }
      
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />}
      <main>{children}</main>
    </div>
  );
}
function MobileMenuAside({
  menu,
  shop,
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id="mobile-menu-aside" heading="MENU">
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
      </Aside>
    )
  );
}
