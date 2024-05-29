import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import React, { useEffect, useRef, useState } from 'react';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';
import Certificate from "../assets/certificate.png";
import { MetaFunction } from '@remix-run/react';
import Heading from '~/components/Heading';

export const meta: MetaFunction = () => {
    return [{title: 'Don Misima 66 | Terms and Conditions'}]; 
  };

export default function Certifications() {
    const [isOpen, setIsOpen] = useState(false);
    return( 
        <div className="page_wrapper margin_top_200">
            {/* <Hero /> */}
            <section>
                <Heading heading='Terms and Conditions'/>
            </section>

            <div className="page_container">
                <p className="certifications-text">
                <strong>1. Introduction</strong><br />
                Welcome to Don Misima 66. These terms and conditions outline the rules and regulations for the use of our website. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Don Misima 66 if you do not agree to accept all of the terms and conditions stated on this page.<br />
                <br />
                <strong>2. License to Use the Website</strong><br />
                Unless otherwise stated, Don Misima 66 and/or its licensors own the intellectual property rights for all material on the website. You may view and/or print pages from https://www.donmisisma.com for your own personal use subject to restrictions set in these terms and conditions.<br />
                <br />
                <strong>3. Restrictions</strong><br />
                You are specifically restricted from all of the following:<br />
                - Publishing any website material in any other media.<br />
                - Selling, sublicensing, and/or otherwise commercializing any website material.<br />
                - Publicly performing and/or showing any website material.<br />
                - Using this website in any way that is, or may be, damaging to this website.<br />
                <br />
                <strong>4. Age Restriction</strong><br />
                By accessing this website, you confirm that you are at least 18 years old.<br />
                <br />
                <strong>5. Product Information</strong><br />
                We strive to provide accurate product information on our website. However, we do not warrant the completeness or accuracy of the information. The content on the website is for general information only and is subject to change without notice.<br />
                <br />
                <strong>6. Ordering and Payment</strong><br />
                By placing an order on Don Misima 66, you agree to provide accurate and complete information. Payment must be made in full before orders are processed and shipped. We accept payment through secure and reputable payment gateways.<br />
                <br />
                <strong>7. Shipping and Returns</strong><br />
                <br />
                <strong>7.1 Shipping Responsibility</strong><br />
                Once the products are delivered, the customer assumes responsibility for them, even if they are left in front of the customer's door or with a neighbour in their absence. Don Misima 66 is not liable for any loss or damage to the products after delivery.<br />
                <br />
                <strong>7.2 Quality Complaints</strong><br />
                Any complaints regarding the quality of the delivery must be submitted within 5 days after receiving the merchandise. Customers are encouraged to inspect the delivered products promptly and notify Don Misima 66 of any concerns regarding the quality.<br />
                <br />
                <strong>7.3 Return of Mistaken Orders</strong><br />
                If a customer mistakenly orders products and wishes to return them, the customer is responsible for the return shipping costs. The returned products must be in their original, unopened condition to be eligible for a refund. Don Misima 66 reserves the right to inspect returned products before issuing any refund.<br />
                Please refer to our full Shipping and Returns Policy for more detailed information on shipping fees, delivery times, and return procedures. If you have any questions or concerns, feel free to contact our customer support team at support@dm66.com.<br />
                <br />
                <strong>8. Customs Rights and Importation Costs</strong><br />
                It is the customer's responsibility to settle customs rights or other costs incurred during the importation of products into their country. These rights and costs are subject to modifications, and we recommend acquiring all necessary information before placing an order.<br />
                <br />
                <strong>9. Pricing Information</strong><br />
                Our prices are in US Dollars, excluding taxes, and are ex-works Geneva Freeport.<br />
                <br />
                <strong>10. Privacy Policy</strong><br />
                By registering on the website http://www.donmisima.com, customers implicitly consent to receiving promotional information via email and mail.<br />
                Customers have the option to easily and freely unsubscribe at any time by following the instructions provided in the respective messages.<br />
                Personal data is only shared with third parties when necessary for the proper execution of orders or payments (e.g., transmission of data to Swisspost, the transport company, a collection agency in case of non-payment, etc.). Rest assured that your information is handled with the utmost confidentiality.<br />
                We reserve the right to use information on purchasing behaviour anonymously for commercial purposes.<br />
                <br />
                <strong>11. Termination</strong><br />
                We reserve the right to terminate or suspend your access to the website without prior notice for any violation of these terms and conditions.<br />
                <br />
                <strong>12. Governing Law and Jurisdiction</strong><br />
                These terms and conditions are governed by and construed in accordance with Swiss Law. By using our website, you hereby consent to the exclusive jurisdiction of the tribunals of the canton of Geneva and of Switzerland. The user expressly renounces the judicial tribunal of their place of residence in favour of the exclusive competence of the mentioned Swiss tribunals. Any disputes arising out of or related to these terms and conditions will be resolved in accordance with the laws of Switzerland.<br />
                If you have any questions or concerns about these terms and conditions, please contact us at <a href="mailto:support@dm66.com">support@dm66.com</a>.<br />
                Thank you for choosing Don Misima 66!<br />
                </p>
            </div>

            <Footer />

        </div>
    )
}