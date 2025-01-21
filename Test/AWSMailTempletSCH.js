import awsSESclient from "../config/ses.config.js"
const { CreateTemplateCommand } = require("@aws-sdk/client-ses");

const htmlContent = `
<!-- 
Online HTML, CSS and JavaScript editor to run code online.
-->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Order",
  "merchant": {
    "@type": "Organization",
    "name": "Amazon.com"
  },
  "orderNumber": "123-4567890-1234567",
  "orderStatus": "http://schema.org/OrderProcessing",
  "priceCurrency": "USD",
  "price": "29.99",
  "priceSpecification": {
    "@type": "PriceSpecification",
    "validFrom": "2027-12-07T23:30:00-08:00"
  },
  "acceptedOffer": {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Product",
      "name": "Google Chromecast",
      "sku": "B00DR0PDNE",
      "url": "http://www.amazon.com/Google-Chromecast-Streaming-Media-Player/dp/B00DR0PDNE/",
      "image": "http://ecx.images-amazon.com/images/I/811nvG%2BLgML._SY550_.jpg"
    },
    "price": "29.99",
    "priceCurrency": "USD",
    "eligibleQuantity": {
      "@type": "QuantitativeValue",
      "value": "1"
    }
  },
  "url": "https://www.amazon.ca/gp/css/summary/edit.html/orderID=123-4567890-1234567",
  "potentialAction": {
    "@type": "ViewAction",
    "url": "https://www.amazon.ca/gp/css/summary/edit.html/orderID=123-4567890-1234567"
  }
}
</script>
</head>

<body>
  <div itemscope itemtype="http://schema.org/Invoice">
  <span itemprop="accountId">123-456-789</span>
  <div itemprop="minimumPaymentDue" itemscope itemtype="http://schema.org/PriceSpecification">
    <span itemprop="price">₹70000.00</span>
  </div>
  <span itemprop="paymentStatus">PaymentAutomaticallyApplied</span>
  <div itemprop="provider" itemscope itemtype="http://schema.org/Organization">
    <span itemprop="name">Beyond Oceans</span>
  </div>
</div>
</body>

</html>
`;

// Define the template content
const templateContent = {
  Template: {
    TemplateName: "BO_Template_ORD",
    HtmlPart: htmlContent,
    SubjectPart: "OTP for Login to Beyond Oceans"
  }
};

const awsSesTempCMD = new CreateTemplateCommand(templateContent)

try {
    const data = await awsSESclient.send(awsSesTempCMD);
    console.log("Template created successfully:", data);
  } catch (err) {
    console.error("Error creating template:", err);
  }