const bcrypt = require('bcryptjs');

function seedDb(db) {
  console.log('Seeding BAGSY Training database...');

  // ── Admin user ──────────────────────────────────────────────────────────────
  const passwordHash = bcrypt.hashSync('Bagsy@2024', 10);
  db.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run('Admin', 'admin@klingtravel.com', passwordHash, 'admin');

  // ── Modules ─────────────────────────────────────────────────────────────────
  const insertModule = db.prepare(`
    INSERT INTO modules (title, description, category, content, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const modules = [
    {
      title: 'About BAGSY — Company Overview',
      description: 'Learn who we are, where we are, and what makes BAGSY unique in the UAE market.',
      category: 'Company',
      order: 1,
      content: `
<h2>What is BAGSY?</h2>
<p>BAGSY is a premium luggage and bags retailer based in the United Arab Emirates, operating as the consumer-facing brand of <strong>Kling Trading LLC</strong>. We are the <strong>official exclusive online retailer of LOJEL in the UAE</strong> and a premier destination for high-quality travel gear in the Middle Eastern market.</p>

<h2>Key Company Facts</h2>
<table>
  <tr><td><strong>Brand Name</strong></td><td>BAGSY (under Kling Trading LLC)</td></tr>
  <tr><td><strong>Website</strong></td><td>bagsy.ae</td></tr>
  <tr><td><strong>Business Type</strong></td><td>Online and Offline Retail</td></tr>
  <tr><td><strong>Industry</strong></td><td>Luggage, Bags & Travel Gear</td></tr>
  <tr><td><strong>Geographic Focus</strong></td><td>UAE, GCC, Middle East</td></tr>
  <tr><td><strong>HQ / CS Office</strong></td><td>Office 503, One Deira Tower, Deira, Dubai</td></tr>
  <tr><td><strong>Flagship Store</strong></td><td>LOJEL Store, First Floor, Dubai Festival City Mall (Store MW019A)</td></tr>
  <tr><td><strong>WhatsApp</strong></td><td>+971 55 162 3168</td></tr>
  <tr><td><strong>Email</strong></td><td>info@bagsy.ae</td></tr>
  <tr><td><strong>Social Media</strong></td><td>@bagsy_ae (Instagram, TikTok, Facebook, YouTube, Twitter, Pinterest)</td></tr>
</table>

<h2>Key Highlights</h2>
<ul>
  <li>Official <strong>exclusive retailer of LOJEL</strong> in the UAE</li>
  <li><strong>First LOJEL flagship store</strong> in the UAE at Dubai Festival City Mall</li>
  <li><strong>FREE next-day delivery</strong> across the entire UAE</li>
  <li>Shipping available to Saudi Arabia, Qatar, Oman & Kuwait</li>
  <li>Comprehensive warranty coverage <strong>up to 10 years</strong> on select LOJEL products</li>
  <li>Buy-now-pay-later: <strong>Tabby and Tamara</strong> (4 interest-free installments)</li>
  <li>Featured in <em>Khaleej Times, Images RetailME, and Arab News</em></li>
</ul>

<h2>Store Locations & Hours</h2>
<table>
  <tr><th>Store</th><th>Address</th><th>Hours</th></tr>
  <tr><td>Dubai — LOJEL Flagship</td><td>First Floor, Dubai Festival City Mall (Store MW019A)</td><td>Mon–Thu: 10:00 AM – 10:00 PM / Fri–Sun: 10:00 AM – 12:00 AM</td></tr>
  <tr><td>Sharjah</td><td>City Centre Al Zahia</td><td>Check Google Maps</td></tr>
  <tr><td>Abu Dhabi</td><td>Coming soon (planned by end of year)</td><td>—</td></tr>
  <tr><td>Customer Service Office</td><td>Office 503, One Deira Tower, Deira, Dubai</td><td>Standard business hours</td></tr>
</table>
<p><em>Tip: Search "LOJEL Dubai Festival City" on Google Maps for directions.</em></p>
      `
    },
    {
      title: 'Brand Identity, Values & Portfolio',
      description: 'Understand BAGSY\'s mission, values, and the 5 curated brands we carry.',
      category: 'Brands',
      order: 2,
      content: `
<h2>Our Vision</h2>
<p>BAGSY was founded with a clear vision: to curate travel gear that seamlessly blends <strong>functionality with timeless design</strong>. We believe travel equipment should enhance the overall journey through thoughtful engineering and elegant simplicity.</p>

<h2>Taglines</h2>
<ul>
  <li><strong>"Travel Smarter, Travel Further"</strong></li>
  <li><strong>"Bags That Protect Your Journey, and The Planet"</strong></li>
</ul>

<h2>Core Values</h2>
<ul>
  <li><strong>Functionality</strong> — Every product must serve a real travel purpose</li>
  <li><strong>Timeless Design</strong> — Elegant, not trendy</li>
  <li><strong>Quality</strong> — Premium materials and construction</li>
  <li><strong>Environmental Responsibility</strong> — Eco-conscious materials and long-lasting products</li>
</ul>

<h2>Target Customer Segments</h2>
<ul>
  <li>Business travellers</li>
  <li>Adventure enthusiasts</li>
  <li>Lifestyle-conscious consumers</li>
</ul>

<h2>Our 5 Curated Brands</h2>
<table>
  <tr><th>Brand</th><th>Origin / Positioning</th><th>Key Differentiator</th></tr>
  <tr><td><strong>LOJEL</strong></td><td>Japanese-founded · Premium luggage & bags</td><td>10-year warranty · Front-opening CUBO · Zipperless VOJA</td></tr>
  <tr><td><strong>OUMOS</strong></td><td>French · Premium hard-shell luggage</td><td>100% Bayer Makrolon polycarbonate · Hinomoto silent wheels</td></tr>
  <tr><td><strong>Ryoko</strong></td><td>Dubai-based (est. 2015) · Full-grain leather goods</td><td>Leather sourced from Japan, Italy & India</td></tr>
  <tr><td><strong>Discovery</strong></td><td>Eco-conscious everyday bags</td><td>Adventure-ready design · Value pricing · RPET materials</td></tr>
  <tr><td><strong>National Geographic</strong></td><td>Exploration-inspired travel & outdoor bags</td><td>RPET recycled materials · Durable construction</td></tr>
</table>

<h2>Quick Brand Memory Tips</h2>
<ul>
  <li>LOJEL = <strong>Japanese premium</strong>, longest warranty, our exclusive brand</li>
  <li>OUMOS = <strong>French luxury</strong>, polycarbonate, ultra-premium price point</li>
  <li>Ryoko = <strong>Dubai leather</strong>, handcrafted feel, high-end accessories</li>
  <li>Discovery = <strong>Eco value</strong>, RPET materials, outdoor-ready</li>
  <li>National Geographic = <strong>Explorer brand</strong>, iconic name, RPET materials</li>
</ul>
      `
    },
    {
      title: 'LOJEL Products — Luggage (CUBO, CUBO Lite, VOJA)',
      description: 'Master LOJEL\'s flagship luggage lines: sizes, prices, features, and key selling points.',
      category: 'Products',
      order: 3,
      content: `
<h2>LOJEL — Our Flagship Brand</h2>
<p>LOJEL is our hero brand and exclusive to BAGSY in the UAE. Understanding LOJEL products in depth is essential for every staff member.</p>

<h2>CUBO — Flagship Front-Opening Luggage</h2>
<p>The CUBO is LOJEL's signature product. Its <strong>front-opening panel</strong> is a game-changer — customers can access their packed clothes without unpacking the whole bag.</p>

<h3>CUBO Pricing</h3>
<table>
  <tr><th>Size</th><th>Price (AED)</th><th>Carry-On?</th><th>Capacity</th></tr>
  <tr><td>Small</td><td>1,450</td><td>Yes (Cabin Approved)</td><td>37L</td></tr>
  <tr><td>Medium</td><td>1,640</td><td>No (Checked)</td><td>70L</td></tr>
  <tr><td>Large</td><td>1,850</td><td>No (Checked)</td><td>100L</td></tr>
  <tr><td>Fit</td><td>1,750</td><td>No (Checked)</td><td>110L</td></tr>
</table>
<p><em>CUBO Luggage Set (Black, Warm Gray, Linen, Golden Ochre): AED 4,700 | Luggage Cover (Medium/Large/Fit/Fit Lite): AED 300</em></p>

<h3>CUBO — Size & Dimensions</h3>
<table>
  <tr><th>Size</th><th>Volume</th><th>Height</th><th>Width</th><th>Depth (exp.)</th><th>Weight</th><th>Carry-On?</th></tr>
  <tr><td>Small Lite</td><td>29(35)L</td><td>53.5 cm</td><td>36 cm</td><td>20(23) cm</td><td>2.9 kg</td><td>Yes</td></tr>
  <tr><td>Small</td><td>37(42)L</td><td>53 cm</td><td>35.5 cm</td><td>25(28) cm</td><td>3.4 kg</td><td>Yes</td></tr>
  <tr><td>Medium</td><td>70(77)L</td><td>65 cm</td><td>45 cm</td><td>30(33) cm</td><td>4.3 kg</td><td>No</td></tr>
  <tr><td>Fit Lite</td><td>86(98)L</td><td>69 cm</td><td>44 cm</td><td>35(38) cm</td><td>4.4 kg</td><td>No</td></tr>
  <tr><td>Fit</td><td>100(110)L</td><td>76.5 cm</td><td>45 cm</td><td>35(38) cm</td><td>5.1 kg</td><td>No</td></tr>
  <tr><td>Large</td><td>120(130)L</td><td>77.5 cm</td><td>55 cm</td><td>34(37) cm</td><td>5.7 kg</td><td>No</td></tr>
</table>

<h3>CUBO Key Features</h3>
<ul>
  <li>Front-opening panel + flat-top lid</li>
  <li>Expandable design</li>
  <li>TSA-approved 008 lock</li>
  <li>360° spinner wheels with bearings</li>
  <li>Removable washable interior lining</li>
  <li>50% recycled polycarbonate shell</li>
  <li>Woven security zipper</li>
  <li>Colors: Black, Rose, Mustard, Stone Blue, Cactus, Warm Gray, Burgundy, Golden Ochre, Off White, Linen</li>
  <li><strong>Warranty: 10 years</strong></li>
</ul>

<h2>CUBO Lite</h2>
<table>
  <tr><th>Size</th><th>Price (AED)</th><th>Carry-On?</th></tr>
  <tr><td>Small Lite</td><td>1,250</td><td>Yes (Cabin Approved)</td></tr>
  <tr><td>Fit Lite</td><td>1,700</td><td>No (Checked)</td></tr>
</table>
<p><strong>Warranty: 10 years</strong></p>

<h2>VOJA — Zipperless Luggage</h2>
<p>VOJA is unique because it has <strong>NO zipper</strong>. It uses a frame closure with a three-point lock system.</p>

<h3>VOJA Pricing</h3>
<table>
  <tr><th>Size</th><th>Price (AED)</th><th>Carry-On?</th><th>Capacity</th><th>Weight</th></tr>
  <tr><td>Small</td><td>700</td><td>Yes (Cabin)</td><td>37L</td><td>3.2 kg</td></tr>
  <tr><td>Medium</td><td>900</td><td>No (Checked)</td><td>66L</td><td>4.2 kg</td></tr>
  <tr><td>Large</td><td>1,050</td><td>No (Checked)</td><td>112L</td><td>5.5 kg</td></tr>
</table>
<p><em>VOJA Luggage Cover: Medium AED 250 · Large AED 290</em></p>

<h3>VOJA Key Features</h3>
<ul>
  <li>Zipperless frame closure (no zipper to break!)</li>
  <li>Three-point lock system</li>
  <li>Polypropylene shell</li>
  <li>360° dual wheels</li>
  <li>Scratch resistant</li>
  <li><strong>Warranty: 10 years</strong></li>
</ul>

<h2>CUBO vs VOJA — Quick Comparison</h2>
<table>
  <tr><th>Feature</th><th>CUBO</th><th>VOJA</th></tr>
  <tr><td>Closure</td><td>Zipper (woven security)</td><td>Zipperless frame</td></tr>
  <tr><td>Opening</td><td>Front panel + top lid</td><td>Clamshell frame</td></tr>
  <tr><td>Shell</td><td>50% recycled polycarbonate</td><td>Polypropylene</td></tr>
  <tr><td>Price (Small)</td><td>AED 1,450</td><td>AED 700</td></tr>
  <tr><td>Warranty</td><td>10 years</td><td>10 years</td></tr>
</table>
      `
    },
    {
      title: 'LOJEL Products — Bags, Backpacks & Accessories',
      description: 'Learn LOJEL\'s bag collections: NIRU, SEMO, EBLO, URBO 2, ORDO, SLASH, and Patches.',
      category: 'Products',
      order: 4,
      content: `
<h2>NIRU Collection</h2>
<p>NIRU bags are made from <strong>recycled crinkle nylon (C6 DWR)</strong> with metal hardware and full-grain leather accents. Colors: Camel, Sand, Grey, Olive, Terracotta, Indigo, Black.</p>
<p><strong>Warranty: 2 years</strong></p>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Niru — 3-Way Tote Mini</td><td>210</td></tr>
  <tr><td>Niru — 3-Way Tote</td><td>240</td></tr>
  <tr><td>Niru — City Sling</td><td>280</td></tr>
  <tr><td>Niru — City Shoulder</td><td>360</td></tr>
  <tr><td>Niru — Daypack Mini</td><td>410</td></tr>
  <tr><td>Niru — City Tote</td><td>410</td></tr>
  <tr><td>Niru — Daypack</td><td>510</td></tr>
  <tr><td>Niru — Journey Pack</td><td>730</td></tr>
  <tr><td>Niru2 — 24H Overnighter</td><td>650</td></tr>
  <tr><td>Niru2 — 48H Weekender</td><td>780</td></tr>
</table>

<h2>SEMO Collection</h2>
<p>SEMO is a work/everyday bag line. <strong>Warranty: 2 years</strong></p>
<table>
  <tr><th>Product</th><th>Price (AED)</th><th>Fits Laptop?</th></tr>
  <tr><td>SEMO — Tote Backpack</td><td>510</td><td>Up to 15"</td></tr>
  <tr><td>SEMO — Tote Bag</td><td>510</td><td>Up to 15"</td></tr>
  <tr><td>SEMO — Backpack</td><td>630</td><td>Up to 16"</td></tr>
  <tr><td>SEMO — Tech Organizer</td><td>240</td><td>No</td></tr>
  <tr><td>SEMO — Laptop Sleeve 14"</td><td>210</td><td>Up to 14"</td></tr>
  <tr><td>SEMO — Laptop Sleeve 16"</td><td>210</td><td>Up to 16"</td></tr>
</table>

<h2>EBLO Collection</h2>
<p>EBLO is LOJEL's outdoor/adventure backpack system sold as sets. Colors: Trail, Asphalt, Dune. <strong>Warranty: 5 years</strong></p>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Eblo — All Day Set</td><td>1,095</td></tr>
  <tr><td>Eblo — All Terrain Set</td><td>1,245</td></tr>
  <tr><td>Eblo — All Conditions Set</td><td>1,495</td></tr>
</table>

<h2>URBO 2 Collection</h2>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Urbo 2 Travel Pack</td><td>585</td></tr>
  <tr><td>Urbo 2 City Bag</td><td>495</td></tr>
</table>

<h2>ORDO Accessories (Packing Kits)</h2>
<p><strong>Warranty: 1 year</strong></p>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>ORDO Toiletry Pouch</td><td>160</td></tr>
  <tr><td>ORDO Essentials Pouch</td><td>180</td></tr>
  <tr><td>ORDO Everyday Packing Kit</td><td>200</td></tr>
  <tr><td>ORDO Compression Packing Kit</td><td>270</td></tr>
  <tr><td>ORDO Travel Packing Kit</td><td>300</td></tr>
</table>

<h2>SLASH Series</h2>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Slash Laptop/A4 Sleeve 13"</td><td>155</td></tr>
  <tr><td>Slash Laptop/A4 Sleeve 16"</td><td>175</td></tr>
  <tr><td>Slash Packing/Storage Kit x4</td><td>175</td></tr>
  <tr><td>Slash Packing/Storage Kit x6</td><td>235</td></tr>
  <tr><td>Slash Foldable Travel/Daypack</td><td>245</td></tr>
</table>

<h2>Patches</h2>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Letter Patch — Embroidered</td><td>40</td></tr>
  <tr><td>Letter Patch — Reflective</td><td>40</td></tr>
  <tr><td>Journey Patch by Julie Solvstrom</td><td>55</td></tr>
  <tr><td>Three Patch Set</td><td>150</td></tr>
  <tr><td>Patch Set by Julie Solvstrom</td><td>150</td></tr>
</table>
      `
    },
    {
      title: 'Other Brands: OUMOS, Ryoko, Discovery & National Geographic',
      description: 'Product knowledge for our four other curated brands.',
      category: 'Products',
      order: 5,
      content: `
<h2>OUMOS — French Premium Hard-Shell Luggage</h2>
<p>OUMOS is a French brand known for ultra-premium hard-shell luggage. It is positioned above LOJEL in price.</p>
<ul>
  <li><strong>Materials:</strong> 100% Bayer Makrolon Polycarbonate + Aluminum frames</li>
  <li><strong>Features:</strong> Double Proof scratch-resistant coating · Scented sachet inside · Hinomoto silent wheels · TSA locks</li>
  <li><strong>Orders:</strong> Via WhatsApp +971 55 162 3168</li>
</ul>
<table>
  <tr><th>Product</th><th>Sizes</th><th>Colors</th><th>Price</th></tr>
  <tr><td>OUMOS Container Trunk</td><td>Small, Large</td><td>White, Orange, Green Vintage, Golden Bronze, Black</td><td>Small: AED 2,095 / Large: AED 2,680</td></tr>
</table>

<h2>Ryoko — Dubai-Based Leather Goods (est. 2015)</h2>
<p>Ryoko is a luxury leather brand founded in Dubai. All products use <strong>full-grain leather sourced from Japan, Italy, and India</strong>.</p>

<h3>Bags & Briefcases</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Madison Backpack (Tan)</td><td>1,790</td></tr>
  <tr><td>Madison Backpack (Vintage Brown)</td><td>1,790</td></tr>
  <tr><td>Bristol Satchel Bag</td><td>1,690</td></tr>
  <tr><td>Wellington Laptop Briefcase (Tan & Brown)</td><td>1,690</td></tr>
  <tr><td>Soho Urbanist Slim Backpack (Tan)</td><td>1,690</td></tr>
  <tr><td>Seoul Work Tote (Tan / Red)</td><td>1,390</td></tr>
  <tr><td>Kyoto Folio (Tan)</td><td>850</td></tr>
</table>

<h3>Wallets, Accessories & Sunglasses</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Liwa Dopp Kit</td><td>390</td></tr>
  <tr><td>Joplin RFID Card Wallet</td><td>390</td></tr>
  <tr><td>Java Slim Wallet</td><td>390</td></tr>
  <tr><td>ClassicCharm Sunglasses</td><td>450</td></tr>
  <tr><td>ClassicClarity Sunglasses</td><td>450</td></tr>
</table>

<h2>Discovery — Eco-Conscious Everyday Bags</h2>
<p>Discovery uses <strong>RPET (recycled PET bottles)</strong> materials. Value-priced, adventure-ready design.</p>

<h3>Downtown Collection</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Downtown Toiletry Bag</td><td>149</td></tr>
  <tr><td>Downtown Utility Bag</td><td>149</td></tr>
  <tr><td>Downtown Crossbody Bag</td><td>169</td></tr>
  <tr><td>Downtown Sling Bag</td><td>169</td></tr>
  <tr><td>Downtown Backpack (Small)</td><td>219</td></tr>
  <tr><td>Downtown Messenger Bag</td><td>279</td></tr>
  <tr><td>Downtown Laptop/Messenger Bag</td><td>319</td></tr>
  <tr><td>Downtown Backpack (Large)</td><td>349</td></tr>
  <tr><td>Downtown Duffel Bag</td><td>369</td></tr>
  <tr><td>Downtown 2-Compartment Backpack</td><td>459</td></tr>
</table>

<h3>Body Spirit Collection</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Body Spirit Outdoor Waist Bag 3L</td><td>199</td></tr>
  <tr><td>Body Spirit Outdoor Backpack 5L</td><td>209</td></tr>
  <tr><td>Body Spirit Outdoor Backpack 8L</td><td>319</td></tr>
  <tr><td>Body Spirit Outdoor Backpack 10L</td><td>355</td></tr>
</table>

<h3>Other Discovery Products</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Heritage Utility Bag</td><td>149</td></tr>
  <tr><td>Heritage Shoulder Bag</td><td>239</td></tr>
  <tr><td>Icon Shoulder Bag 3L</td><td>195</td></tr>
  <tr><td>Cave Backpack Small</td><td>299</td></tr>
  <tr><td>Eclipse Luggage (S/M/L)</td><td>339</td></tr>
</table>

<h2>National Geographic — Exploration-Inspired Bags</h2>
<p>National Geographic uses <strong>RPET recycled materials</strong> (up to 60% recycled content). Strong brand recognition worldwide.</p>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Breeze Backpack</td><td>199</td></tr>
  <tr><td>Legend Backpack 7.5L</td><td>199</td></tr>
  <tr><td>Legend Backpack 13.5L</td><td>249</td></tr>
  <tr><td>Box Canyon Backpack 35L</td><td>309</td></tr>
  <tr><td>Explorer III Backpack 30L</td><td>349</td></tr>
  <tr><td>Milestone Backpack 20L</td><td>399</td></tr>
  <tr><td>Ocean 3-Ways Backpack</td><td>479</td></tr>
  <tr><td>Milestone Backpack 30L</td><td>569</td></tr>
  <tr><td>Milestone Backpack 44L</td><td>619</td></tr>
  <tr><td>Cruise Hardshell Luggage (S/M/L)</td><td>429</td></tr>
</table>
<h3>Shadow & Puffer Collections</h3>
<table>
  <tr><th>Product</th><th>Price (AED)</th></tr>
  <tr><td>Shadow Utility Bag Small</td><td>149</td></tr>
  <tr><td>Shadow Utility Bag</td><td>179</td></tr>
  <tr><td>Shadow Crossbody Bag</td><td>189</td></tr>
  <tr><td>Puffer Utility Bag</td><td>159</td></tr>
  <tr><td>Puffer Waist Bag</td><td>169</td></tr>
  <tr><td>Puffer Backpack</td><td>269</td></tr>
</table>
      `
    },
    {
      title: 'Shipping, Delivery & Payment Methods',
      description: 'Everything about how we deliver and how customers can pay.',
      category: 'Operations',
      order: 6,
      content: `
<h2>Shipping & Delivery</h2>
<table>
  <tr><th>Region</th><th>Delivery Time</th><th>Shipping Cost</th></tr>
  <tr><td><strong>United Arab Emirates (UAE)</strong></td><td>24 hours (next-day for orders before 2 PM)</td><td><strong>FREE</strong></td></tr>
  <tr><td>Saudi Arabia (KSA)</td><td>3–5 business days</td><td>40 AED</td></tr>
  <tr><td>Qatar</td><td>3–5 business days</td><td>40 AED</td></tr>
  <tr><td>Oman</td><td>3–5 business days</td><td>40 AED</td></tr>
  <tr><td>Kuwait</td><td>3–5 business days</td><td>40 AED</td></tr>
</table>

<h2>Important Shipping Rules</h2>
<ul>
  <li>Orders placed before <strong>2 PM</strong> qualify for UAE <strong>next-day delivery</strong></li>
  <li>All orders include <strong>tracking notifications</strong> via email/SMS</li>
  <li>Customers must provide an accurate delivery address — errors may cause delays or extra charges</li>
  <li>Risk of loss passes to the customer upon delivery</li>
  <li>For luggage damaged by airlines: customer must report to the airline within <strong>24 hours – 7 days</strong> of travel. BAGSY can provide supporting documentation.</li>
</ul>

<h2>Payment Methods</h2>
<table>
  <tr><th>Method</th><th>Details</th></tr>
  <tr><td>Credit / Debit Cards</td><td>Visa · Mastercard · American Express</td></tr>
  <tr><td>Digital Wallets</td><td>Apple Pay</td></tr>
  <tr><td>Buy Now Pay Later</td><td>Tabby — 4 interest-free installments / Tamara — 4 interest-free installments</td></tr>
  <tr><td>Cash on Delivery (COD)</td><td>UAE only, for WhatsApp / phone orders</td></tr>
</table>

<h2>Important: Cards We Do NOT Accept</h2>
<p><strong>BAGSY does NOT accept Esaad or Fazaa discount cards.</strong> If a customer asks, politely explain we don't accept these, but offer the Tabby/Tamara BNPL option instead.</p>

<h2>Discounts Policy</h2>
<p>BAGSY does <strong>not offer discounts, promo codes, or sales</strong>. If customers ask, the response is: <em>"We don't currently have promotions, but you can split your payment into 4 interest-free installments with Tabby or Tamara."</em></p>
      `
    },
    {
      title: 'Returns, Refunds & Warranty',
      description: 'Master our return policy and LOJEL\'s industry-leading warranty coverage.',
      category: 'Operations',
      order: 7,
      content: `
<h2>Returns & Refunds Policy</h2>
<table>
  <tr><th>Policy Element</th><th>Details</th></tr>
  <tr><td>Return Window</td><td><strong>14 days</strong> from delivery date</td></tr>
  <tr><td>Return Shipping</td><td>FREE (UAE) for defective or incorrect items. Customer may bear cost for change-of-mind returns.</td></tr>
  <tr><td>Condition Required</td><td>Unused · Original condition · All tags and original packaging intact</td></tr>
  <tr><td>Refund Method</td><td>Original payment method</td></tr>
  <tr><td>Refund Processing Time</td><td>7–14 business days after inspection</td></tr>
  <tr><td>Exchanges</td><td>Subject to stock availability. Refund issued if exchange item unavailable.</td></tr>
</table>

<h2>Non-Returnable Items</h2>
<ul>
  <li>Personalized or engraved items</li>
  <li>Used or damaged goods (unless due to manufacturing defect)</li>
  <li>Hygiene products</li>
  <li>Items altered from original condition</li>
</ul>

<h2>How to Initiate a Return</h2>
<ol>
  <li>Contact BAGSY via WhatsApp (+971 55 162 3168) or email (info@bagsy.ae) with your Order ID</li>
  <li>Include photos if the product has any issues</li>
  <li>Receive return authorisation and shipping instructions</li>
  <li>Ship item in original packaging with tags intact</li>
  <li>Refund processed within 7–14 business days after inspection</li>
</ol>

<h2>Warranty Coverage</h2>
<table>
  <tr><th>Brand / Product</th><th>Warranty Period</th><th>Coverage</th></tr>
  <tr><td><strong>LOJEL — CUBO, VOJA Luggage</strong></td><td><strong>10 years</strong></td><td>Manufacturing defects: zippers, wheels, handles, stitching</td></tr>
  <tr><td>LOJEL — CUBO Lite</td><td>10 years</td><td>Manufacturing defects</td></tr>
  <tr><td>LOJEL — Eblo Collection</td><td>5 years</td><td>Manufacturing defects</td></tr>
  <tr><td>LOJEL — Niru & Niru2</td><td>2 years</td><td>Manufacturing defects</td></tr>
  <tr><td>LOJEL — SEMO & Urbo 2</td><td>2 years</td><td>Manufacturing defects</td></tr>
  <tr><td>LOJEL — SLASH Collection</td><td>1 year</td><td>Manufacturing defects</td></tr>
  <tr><td>LOJEL — ORDO Accessories</td><td>1 year</td><td>Manufacturing defects</td></tr>
  <tr><td>BAGSY Care (all purchases)</td><td>1 year</td><td>Complimentary repair: zippers, wheels, handles, stitching</td></tr>
  <tr><td>Other brands</td><td>Per product page</td><td>Manufacturer's warranty applies</td></tr>
</table>

<h2>Warranty Exclusions (NOT Covered)</h2>
<ul>
  <li>Airline handling damage — must report to airline within 24 hours–7 days of travel</li>
  <li>Misuse or abuse of product</li>
  <li>Normal wear and tear</li>
  <li>Cosmetic damage not affecting functionality</li>
  <li>Unauthorized repairs or modifications</li>
</ul>

<h2>Repair Support</h2>
<ul>
  <li><strong>Year 1:</strong> No-questions-asked — bring or ship the product to store</li>
  <li><strong>Year 2–10:</strong> Proof of purchase required + MYLOJEL registration</li>
  <li><strong>After 10 years:</strong> Flat repair fee of AED 40 (subject to parts availability)</li>
  <li>Repair available at both stores: Dubai Festival City Mall & City Centre Al Zahia, Sharjah</li>
</ul>

<h2>MYLOJEL Warranty Registration (Required)</h2>
<ol>
  <li>Locate the serial ID plate with QR code on the product (back of suitcase or inside bags)</li>
  <li>Scan the QR code with your phone camera</li>
  <li>Complete the registration form with purchase details</li>
  <li>Registration activates the warranty — Year 1 claims: no proof of purchase needed; Year 2+: proof required</li>
</ol>

<h2>How to File a Warranty Claim</h2>
<table>
  <tr><td>Online</td><td>bagsy.ae/pages/warranty-claim (share Order ID + photos)</td></tr>
  <tr><td>Email</td><td>info@bagsy.ae</td></tr>
  <tr><td>WhatsApp</td><td>+971 55 162 3168</td></tr>
  <tr><td>Claim Review Time</td><td>2–3 business days</td></tr>
  <tr><td>Resolution Options</td><td>Repair · Replacement · Fair resolution per UAE consumer protection laws</td></tr>
</table>
      `
    },
    {
      title: 'Customer Handling & FAQ Responses',
      description: 'Learn how to respond to common customer questions and scenarios.',
      category: 'Customer Service',
      order: 8,
      content: `
<h2>Customer Service Contacts</h2>
<table>
  <tr><th>Channel</th><th>Details</th><th>Availability</th></tr>
  <tr><td>WhatsApp / Phone</td><td>+971 55 162 3168</td><td>24/7 WhatsApp · Standard hours for calls</td></tr>
  <tr><td>Email (General)</td><td>info@bagsy.ae</td><td>Standard business hours</td></tr>
  <tr><td>Email (Support)</td><td>support@bagsy.ae</td><td>Standard business hours</td></tr>
  <tr><td>Social Media</td><td>@bagsy_ae</td><td>Instagram, TikTok, Facebook, YouTube, Twitter, Pinterest</td></tr>
</table>
<p>Response time: typically within a few hours during business hours.</p>

<h2>Common Customer Scenarios & How to Respond</h2>

<h3>Price / "How Much?"</h3>
<p><em>Our products range from AED 40 (patches) to AED 4,700 (luggage sets). CUBO starts at AED 1,450 (Small/cabin). You can split into 4 interest-free installments with Tabby or Tamara. Which product are you interested in?</em></p>

<h3>Discounts / Offers</h3>
<p><em>We don't currently have promotions, but you can pay in 4 interest-free installments with Tabby or Tamara.</em></p>

<h3>Esaad / Fazaa Cards</h3>
<p><em>We do not accept Esaad or Fazaa discount cards. However, you can pay in 4 interest-free installments with Tabby or Tamara.</em></p>

<h3>Delivery / Shipping</h3>
<p><em>Delivery is FREE across the UAE with 24-hour next-day delivery (for orders before 2 PM). GCC countries (KSA, Qatar, Oman, Kuwait): 40 AED, 3–5 business days. All orders include tracking via email/SMS.</em></p>

<h3>Product Images / Videos</h3>
<p><em>All images on bagsy.ae are real product photographs. For more photos/videos: Instagram @bagsy_ae · TikTok @bagsy.ae · WhatsApp +971 55 162 3168 · or visit our stores in Dubai (Festival City Mall) or Sharjah (City Centre Al Zahia).</em></p>

<h3>Stock Availability</h3>
<p><em>Stock updates in real-time on bagsy.ae. If a size or color is unavailable online, it may be in-store. WhatsApp us at +971 55 162 3168 for the latest stock status.</em></p>

<h3>CUBO vs VOJA — Which is Better?</h3>
<p><em>CUBO (from AED 1,450): Front-opening panel · flat-top lid · expandable · more internal organisation. VOJA (AED 700–1,050): Zipperless frame closure · polypropylene shell · lighter. Both come with a 10-year warranty and 360° wheels + TSA lock.</em></p>

<h3>Warranty Questions</h3>
<p><em>LOJEL Luggage: 10 years. Eblo: 5 years. Niru/SEMO: 2 years. Accessories: 1 year. Register via the QR code on your product (MYLOJEL) to activate. File a claim at bagsy.ae/pages/warranty-claim with Order ID and photos.</em></p>

<h3>Returns</h3>
<p><em>Free 14-day returns with free return shipping in the UAE. Share your Order ID on WhatsApp (+971 55 162 3168) or email info@bagsy.ae. Items must be unused and in original condition.</em></p>

<h3>Repair</h3>
<p><em>Repair support at both stores (Dubai Festival City & Sharjah). Year 1: no questions asked. Year 2–10: proof of purchase needed. After 10 years: AED 40 flat fee (parts dependent).</em></p>

<h3>Corporate / Bulk Orders</h3>
<p><em>Contact our team for a tailored solution: info@bagsy.ae or WhatsApp +971 55 162 3168.</em></p>

<h3>Sustainability Questions</h3>
<p><em>Up to 60% recycled materials across our collection. CUBO: 50% recycled polycarbonate. Niru: 100% recycled nylon. National Geographic & Discovery: RPET recycled materials.</em></p>

<h2>Always Remember</h2>
<ul>
  <li>Be warm, professional, and solution-focused</li>
  <li>If you don't know the answer, say "Let me check and get back to you" — don't guess</li>
  <li>Warranty and return queries should always be escalated with an Order ID and photos</li>
  <li>BAGSY does NOT offer gift wrapping — products come in premium packaging</li>
</ul>
      `
    }
  ];

  const moduleIds = [];
  for (const m of modules) {
    const result = insertModule.run(m.title, m.description, m.category, m.content.trim(), m.order);
    moduleIds.push(result.lastInsertRowid);
  }

  // ── Quizzes + Questions ──────────────────────────────────────────────────────
  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (module_id, title, description, pass_score)
    VALUES (?, ?, ?, ?)
  `);
  const insertQuestion = db.prepare(`
    INSERT INTO questions (quiz_id, question_text, options, correct_answer, explanation, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const quizData = [
    {
      moduleIndex: 0,
      title: 'Company Overview Quiz',
      description: 'Test your knowledge about BAGSY\'s company facts, locations, and contact details.',
      passScore: 70,
      questions: [
        {
          q: 'What is BAGSY\'s parent company?',
          opts: ['LOJEL International', 'Kling Trading LLC', 'Bagsy Holdings UAE', 'Festival City Retail'],
          correct: 1,
          exp: 'BAGSY is the consumer-facing brand of Kling Trading LLC, based in Dubai, UAE.'
        },
        {
          q: 'Where is the BAGSY flagship store located?',
          opts: ['Mall of the Emirates', 'Dubai Mall', 'Dubai Festival City Mall', 'City Centre Mirdif'],
          correct: 2,
          exp: 'BAGSY\'s flagship is the LOJEL Store on the First Floor of Dubai Festival City Mall (Store MW019A).'
        },
        {
          q: 'What is BAGSY\'s WhatsApp number for customer support?',
          opts: ['+971 50 162 3168', '+971 55 162 3168', '+971 4 162 3168', '+971 56 162 3168'],
          correct: 1,
          exp: 'The official WhatsApp number is +971 55 162 3168.'
        },
        {
          q: 'Which of these GCC countries does BAGSY NOT ship to?',
          opts: ['Saudi Arabia', 'Qatar', 'Bahrain', 'Kuwait'],
          correct: 2,
          exp: 'BAGSY ships to UAE, KSA, Qatar, Oman, and Kuwait — but not Bahrain.'
        },
        {
          q: 'What are the opening hours of the Dubai Festival City Mall store on weekends (Fri–Sun)?',
          opts: ['10:00 AM – 10:00 PM', '9:00 AM – 11:00 PM', '10:00 AM – 12:00 AM', '11:00 AM – 12:00 AM'],
          correct: 2,
          exp: 'Friday to Sunday the store is open 10:00 AM – 12:00 AM (midnight).'
        },
        {
          q: 'What is BAGSY\'s general email address?',
          opts: ['support@bagsy.ae', 'hello@bagsy.ae', 'info@bagsy.ae', 'contact@bagsy.ae'],
          correct: 2,
          exp: 'The general contact email is info@bagsy.ae.'
        }
      ]
    },
    {
      moduleIndex: 1,
      title: 'Brands & Values Quiz',
      description: 'Test your knowledge of BAGSY\'s brand portfolio and core values.',
      passScore: 70,
      questions: [
        {
          q: 'LOJEL was originally founded in which country?',
          opts: ['South Korea', 'China', 'Japan', 'Taiwan'],
          correct: 2,
          exp: 'LOJEL is a Japanese-founded brand, known for premium luggage and bags.'
        },
        {
          q: 'What material is the OUMOS Container Trunk made from?',
          opts: ['ABS Plastic', '100% Bayer Makrolon Polycarbonate', 'Aluminum', 'Polypropylene'],
          correct: 1,
          exp: 'OUMOS uses 100% Bayer Makrolon Polycarbonate with aluminum frames — a premium material.'
        },
        {
          q: 'Ryoko is a leather goods brand based in which city, and when was it established?',
          opts: ['Abu Dhabi, 2010', 'Dubai, 2015', 'Riyadh, 2018', 'Beirut, 2012'],
          correct: 1,
          exp: 'Ryoko was established in Dubai in 2015, using full-grain leather sourced from Japan, Italy, and India.'
        },
        {
          q: 'What does RPET stand for, used in National Geographic and Discovery bags?',
          opts: ['Reinforced Polyethylene Texture', 'Recycled Polyethylene Terephthalate', 'Rigid Polymer Eco Thread', 'Recycled Polyester Enhanced Technology'],
          correct: 1,
          exp: 'RPET = Recycled Polyethylene Terephthalate — made from recycled plastic bottles. National Geographic bags can have up to 60% RPET content.'
        },
        {
          q: 'What is BAGSY\'s first tagline?',
          opts: ['Your Journey, Our Passion', 'Travel Smarter, Travel Further', 'Premium Bags for Life', 'Built for the Road'],
          correct: 1,
          exp: 'BAGSY\'s taglines are "Travel Smarter, Travel Further" and "Bags That Protect Your Journey, and The Planet".'
        },
        {
          q: 'Which brand is BAGSY the official exclusive retailer for in the UAE?',
          opts: ['OUMOS', 'National Geographic', 'LOJEL', 'Ryoko'],
          correct: 2,
          exp: 'BAGSY is the official exclusive online retailer of LOJEL in the UAE, with the first LOJEL flagship store in the country.'
        }
      ]
    },
    {
      moduleIndex: 2,
      title: 'LOJEL Luggage Quiz',
      description: 'Test your knowledge of CUBO, CUBO Lite, and VOJA luggage products.',
      passScore: 70,
      questions: [
        {
          q: 'What is the defining feature of the LOJEL CUBO that makes it unique?',
          opts: ['Zipperless frame closure', 'Front-opening panel', 'Transparent shell', 'Built-in GPS tracker'],
          correct: 1,
          exp: 'The CUBO\'s front-opening panel allows customers to access their clothes without fully unpacking the bag — a key selling point.'
        },
        {
          q: 'What is the price of the CUBO Small in AED?',
          opts: ['1,250', '1,640', '1,450', '1,750'],
          correct: 2,
          exp: 'The CUBO Small is AED 1,450 and is cabin/carry-on approved with a 37L capacity.'
        },
        {
          q: 'Which CUBO sizes are cabin-approved for carry-on?',
          opts: ['Small Lite and Small only', 'Small and Medium', 'All CUBO sizes', 'Small Lite only'],
          correct: 0,
          exp: 'Only the CUBO Small Lite (29L) and CUBO Small (37L) are cabin-approved. Medium, Fit Lite, Fit, and Large are checked baggage.'
        },
        {
          q: 'What is the closure system of the VOJA luggage?',
          opts: ['Standard zipper', 'Combination dial lock', 'Zipperless frame with three-point lock', 'Magnetic snap closure'],
          correct: 2,
          exp: 'The VOJA has a unique zipperless frame closure with a three-point lock — meaning there is no zipper to break.'
        },
        {
          q: 'What is the price of the VOJA Small?',
          opts: ['AED 900', 'AED 700', 'AED 1,050', 'AED 1,250'],
          correct: 1,
          exp: 'The VOJA Small is AED 700, making it one of our most accessible LOJEL products. It\'s cabin approved with 37L capacity.'
        },
        {
          q: 'What is the warranty period for LOJEL CUBO and VOJA luggage?',
          opts: ['2 years', '5 years', '7 years', '10 years'],
          correct: 3,
          exp: 'Both CUBO and VOJA carry a 10-year warranty — one of the longest in the industry, covering manufacturing defects.'
        },
        {
          q: 'What percentage of recycled material is used in the CUBO\'s polycarbonate shell?',
          opts: ['25%', '35%', '50%', '100%'],
          correct: 2,
          exp: 'The CUBO shell is made from 50% recycled polycarbonate, supporting BAGSY\'s sustainability commitment.'
        },
        {
          q: 'What is the price of a CUBO Luggage Set?',
          opts: ['AED 3,500', 'AED 4,200', 'AED 4,700', 'AED 5,000'],
          correct: 2,
          exp: 'The CUBO Luggage Set (available in Black, Warm Gray, Linen, Golden Ochre) is priced at AED 4,700.'
        }
      ]
    },
    {
      moduleIndex: 3,
      title: 'LOJEL Bags & Accessories Quiz',
      description: 'Test your knowledge of NIRU, SEMO, EBLO, ORDO, and other LOJEL accessories.',
      passScore: 70,
      questions: [
        {
          q: 'What material is the NIRU collection made from?',
          opts: ['Full-grain leather', 'ABS plastic', 'Recycled crinkle nylon (C6 DWR)', 'Canvas'],
          correct: 2,
          exp: 'NIRU bags are made from recycled crinkle nylon with C6 DWR water resistance, plus metal hardware and leather accents.'
        },
        {
          q: 'What is the warranty on the NIRU collection?',
          opts: ['1 year', '2 years', '5 years', '10 years'],
          correct: 1,
          exp: 'NIRU and NIRU2 bags carry a 2-year warranty against manufacturing defects.'
        },
        {
          q: 'The EBLO collection has a 5-year warranty and is designed for which use case?',
          opts: ['Office work', 'Outdoor / adventure activities', 'Travel luggage', 'School bags'],
          correct: 1,
          exp: 'EBLO is LOJEL\'s outdoor/adventure backpack system, sold as sets (All Day, All Terrain, All Conditions), with a 5-year warranty.'
        },
        {
          q: 'What is the price of the ORDO Travel Packing Kit?',
          opts: ['AED 200', 'AED 240', 'AED 270', 'AED 300'],
          correct: 3,
          exp: 'The ORDO Travel Packing Kit is priced at AED 300. The ORDO range starts from AED 160 (Toiletry Pouch).'
        },
        {
          q: 'What is the price range for LOJEL Patches?',
          opts: ['AED 10–50', 'AED 40–150', 'AED 100–200', 'AED 20–80'],
          correct: 1,
          exp: 'Letter patches start at AED 40, Journey Patch at AED 55, and sets (Three Patch Set, Julie Solvstrom Set) at AED 150.'
        }
      ]
    },
    {
      moduleIndex: 4,
      title: 'Other Brands Quiz',
      description: 'Test your knowledge of OUMOS, Ryoko, Discovery, and National Geographic.',
      passScore: 70,
      questions: [
        {
          q: 'What is the price of the OUMOS Container Trunk in Large size?',
          opts: ['AED 1,850', 'AED 2,095', 'AED 2,680', 'AED 3,200'],
          correct: 2,
          exp: 'The OUMOS Container Trunk Large is AED 2,680. Small is AED 2,095.'
        },
        {
          q: 'Where does Ryoko source its full-grain leather from?',
          opts: ['France, Italy, and Spain', 'Japan, Italy, and India', 'Turkey, Morocco, and India', 'Germany, Japan, and USA'],
          correct: 1,
          exp: 'Ryoko sources full-grain leather from Japan, Italy, and India — giving each product a premium feel.'
        },
        {
          q: 'What is the price of the Ryoko Madison Backpack?',
          opts: ['AED 1,390', 'AED 1,690', 'AED 1,790', 'AED 2,100'],
          correct: 2,
          exp: 'The Madison Backpack (in Tan or Vintage Brown) is AED 1,790.'
        },
        {
          q: 'Which Discovery product is priced at AED 459?',
          opts: ['Downtown Duffel Bag', 'Downtown 2-Compartment Backpack', 'Downtown Backpack (Large)', 'Body Spirit Outdoor Backpack 10L'],
          correct: 1,
          exp: 'The Downtown 2-Compartment Backpack is AED 459, the most expensive product in the Downtown Collection.'
        },
        {
          q: 'Up to what percentage of recycled content do National Geographic bags contain?',
          opts: ['30%', '45%', '60%', '75%'],
          correct: 2,
          exp: 'National Geographic bags use RPET materials with up to 60% recycled content from plastic bottles.'
        },
        {
          q: 'What is the price of the National Geographic Milestone Backpack 44L?',
          opts: ['AED 399', 'AED 479', 'AED 569', 'AED 619'],
          correct: 3,
          exp: 'The Milestone Backpack 44L is AED 619 — the largest in the Milestone series.'
        }
      ]
    },
    {
      moduleIndex: 5,
      title: 'Shipping & Payment Quiz',
      description: 'Test your knowledge of BAGSY\'s delivery times, costs, and payment options.',
      passScore: 70,
      questions: [
        {
          q: 'What is the shipping cost for orders within the UAE?',
          opts: ['AED 20', 'AED 40', 'FREE', 'AED 15'],
          correct: 2,
          exp: 'All UAE orders have FREE shipping with next-day delivery (for orders placed before 2 PM).'
        },
        {
          q: 'What is the cut-off time for UAE next-day delivery?',
          opts: ['12:00 PM (noon)', '2:00 PM', '4:00 PM', '6:00 PM'],
          correct: 1,
          exp: 'Orders placed before 2 PM qualify for next-day delivery across the UAE.'
        },
        {
          q: 'How much does shipping cost to Saudi Arabia?',
          opts: ['FREE', 'AED 20', 'AED 40', 'AED 60'],
          correct: 2,
          exp: 'Shipping to KSA (and all other GCC countries BAGSY ships to) costs AED 40 with a 3–5 business day delivery time.'
        },
        {
          q: 'Which of the following Buy Now Pay Later services does BAGSY offer?',
          opts: ['Spotii and Postpay', 'Tabby and Tamara', 'PayLater and Cashew', 'Tabby and Postpay'],
          correct: 1,
          exp: 'BAGSY offers Tabby and Tamara — both split payment into 4 interest-free installments.'
        },
        {
          q: 'Does BAGSY accept Esaad or Fazaa discount cards?',
          opts: ['Yes, both', 'Only Esaad', 'Only Fazaa', 'No, neither'],
          correct: 3,
          exp: 'BAGSY does NOT accept Esaad or Fazaa discount cards. Offer Tabby/Tamara BNPL as an alternative.'
        },
        {
          q: 'If a customer\'s luggage is damaged by an airline, what should they do?',
          opts: ['Contact BAGSY immediately for a warranty claim', 'Report to the airline within 24 hours–7 days of travel', 'Submit a police report first', 'Return the bag to BAGSY store'],
          correct: 1,
          exp: 'Airline damage must be reported to the airline within 24 hours–7 days of travel. BAGSY can provide supporting documentation but the airline is responsible.'
        }
      ]
    },
    {
      moduleIndex: 6,
      title: 'Returns, Refunds & Warranty Quiz',
      description: 'Test your knowledge of return policies, refund timelines, and warranty terms.',
      passScore: 70,
      questions: [
        {
          q: 'What is BAGSY\'s return window?',
          opts: ['7 days from purchase', '14 days from delivery', '30 days from purchase', '21 days from delivery'],
          correct: 1,
          exp: 'Customers have 14 days from the delivery date to initiate a return.'
        },
        {
          q: 'How long does the LOJEL CUBO warranty last?',
          opts: ['2 years', '5 years', '7 years', '10 years'],
          correct: 3,
          exp: 'The LOJEL CUBO (and VOJA) carry a 10-year warranty — among the longest in the luggage industry.'
        },
        {
          q: 'What warranty does the LOJEL EBLO collection carry?',
          opts: ['1 year', '2 years', '5 years', '10 years'],
          correct: 2,
          exp: 'The EBLO outdoor bag collection has a 5-year warranty against manufacturing defects.'
        },
        {
          q: 'For a LOJEL warranty claim in Year 1, what documents are needed?',
          opts: ['Proof of purchase + MYLOJEL registration', 'MYLOJEL registration only', 'No documents needed — no-questions-asked', 'Police report + receipt'],
          correct: 2,
          exp: 'In Year 1, it\'s no-questions-asked. Just bring or ship the product to the store. From Year 2+, proof of purchase + MYLOJEL registration is required.'
        },
        {
          q: 'How does a customer activate their LOJEL MYLOJEL warranty?',
          opts: ['Call BAGSY with their Order ID', 'Scan the QR code on the product and complete the registration form', 'Fill in a form at the store', 'Email their receipt to info@bagsy.ae'],
          correct: 1,
          exp: 'Locate the serial ID plate with QR code (back of suitcase or inside bags), scan it with your phone, and complete the registration form.'
        },
        {
          q: 'Which of the following is NOT covered by LOJEL\'s warranty?',
          opts: ['Broken zipper (manufacturing defect)', 'Faulty wheel bearing', 'Airline handling damage', 'Stitching failure'],
          correct: 2,
          exp: 'Airline handling damage is NOT covered by the product warranty. Customers must report it to the airline within 24 hours–7 days of travel.'
        },
        {
          q: 'What is the flat repair fee for LOJEL products after the 10-year warranty expires?',
          opts: ['AED 20', 'AED 40', 'AED 100', 'Free forever'],
          correct: 1,
          exp: 'After the 10-year warranty period, BAGSY offers repairs at a flat fee of AED 40, subject to parts availability.'
        }
      ]
    },
    {
      moduleIndex: 7,
      title: 'Customer Service Quiz',
      description: 'Test your ability to handle common customer scenarios and questions.',
      passScore: 70,
      questions: [
        {
          q: 'A customer asks for a discount. What is the correct response?',
          opts: [
            'Give them a 5% loyalty discount',
            'We don\'t offer discounts, but you can split into 4 interest-free installments with Tabby or Tamara',
            'Ask your manager first',
            'Offer a free luggage cover instead'
          ],
          correct: 1,
          exp: 'BAGSY does not offer discounts or promo codes. Always redirect to the Tabby/Tamara BNPL option as a way to make it more affordable.'
        },
        {
          q: 'A customer says they have a Fazaa card. What do you tell them?',
          opts: [
            'Yes, we accept Fazaa for 10% off',
            'We accept Fazaa only in-store, not online',
            'We do not accept Esaad or Fazaa cards, but Tabby/Tamara BNPL is available',
            'Fazaa gives free shipping but no discount'
          ],
          correct: 2,
          exp: 'BAGSY does NOT accept Esaad or Fazaa cards. Be polite and offer the Tabby/Tamara installment option as an alternative.'
        },
        {
          q: 'A customer wants to know if their order will arrive tomorrow. They are in Dubai and it\'s 1 PM. What do you tell them?',
          opts: [
            'No, it will take 2–3 days',
            'Yes, if the order is placed now (before 2 PM), it qualifies for next-day delivery',
            'Only if they pay extra',
            'We cannot guarantee next-day delivery'
          ],
          correct: 1,
          exp: 'Orders placed before 2 PM qualify for UAE next-day delivery, so a 1 PM order in Dubai would arrive the next day, at no extra charge.'
        },
        {
          q: 'A customer wants to return a CUBO they used on a trip. Can they return it?',
          opts: [
            'Yes, within 14 days of purchase',
            'No — used items cannot be returned unless there is a manufacturing defect',
            'Yes, with a 20% restocking fee',
            'Only if they have the original packaging'
          ],
          correct: 1,
          exp: 'Used items cannot be returned. Returns require items to be unused, in original condition with all tags and packaging intact. A used bag on a trip is not eligible.'
        },
        {
          q: 'How long does it take BAGSY to process a refund after receiving the returned item?',
          opts: ['1–3 business days', '3–5 business days', '7–14 business days', '30 days'],
          correct: 2,
          exp: 'Refunds are processed within 7–14 business days after inspection of the returned item, back to the original payment method.'
        },
        {
          q: 'A customer asks how to compare the CUBO vs VOJA. What is the key difference to highlight?',
          opts: [
            'CUBO is cheaper than VOJA',
            'VOJA has a front-opening panel, CUBO has a zipperless frame',
            'CUBO has a zipperless frame, VOJA has a front-opening panel',
            'They are the same product, just different names'
          ],
          correct: 2,
          exp: 'CUBO = front-opening panel (the unique feature). VOJA = zipperless frame closure. Both share the 10-year warranty, 360° wheels, and TSA lock.'
        }
      ]
    }
  ];

  for (const quiz of quizData) {
    const moduleId = moduleIds[quiz.moduleIndex];
    const quizResult = insertQuiz.run(moduleId, quiz.title, quiz.description, quiz.passScore);
    const quizId = quizResult.lastInsertRowid;

    quiz.questions.forEach((q, i) => {
      insertQuestion.run(
        quizId,
        q.q,
        JSON.stringify(q.opts),
        q.correct,
        q.exp,
        i
      );
    });
  }

  console.log(`Seeded: ${modules.length} modules, ${quizData.length} quizzes, ${quizData.reduce((s, q) => s + q.questions.length, 0)} questions`);
}

module.exports = { seedDb };
