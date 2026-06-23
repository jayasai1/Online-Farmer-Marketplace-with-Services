import React, { createContext, useState, useEffect, useContext } from 'react';

const translations = {
  en: {
    // General / Sidebar
    logo_brand: "AgroMarket",
    logo_sub: "Pro",
    sidebar_explore: "Explore Platform",
    menu_home: "Home Landing",
    menu_crops: "Crop Market",
    menu_tractors: "Rent Tractors",
    menu_labors: "Hire Labor",
    menu_services: "Agro Services",
    menu_prices: "Price Index",
    menu_dashboard: "My Dashboard",
    sidebar_farmer: "Farmer Panel",
    sidebar_buyer: "Buyer Panel",
    menu_login: "Register / Login",
    menu_logout: "Logout",
    welcome: "Welcome",
    role_farmer: "Farmer",
    role_buyer: "Buyer",

    // Landing Page
    hero_tag: "Empowering Indian Agriculture",
    hero_title_1: "Harvesting Hope,",
    hero_title_span: "Prosperity",
    hero_desc: "India's first complete agricultural network. Trade high-quality crop yields directly, hire skilled harvest labor crews, rent professional heavy tractors, and track fertilizer seed trends in real-time.",
    hub_title: "Comprehensive Agricultural Hub",
    card_crops_title: "Crop Marketplace",
    card_crops_desc: "Buy fresh farm crops directly from crop growers. Zero middleman margins, guaranteed grades, and local transports.",
    card_tractors_title: "Tractor Rental",
    card_tractors_desc: "Rent powerful multi-terrain tractors, disc ploughs, and tillers per hour or per day. Full breakdown insurance.",
    card_labors_title: "Hire Labor Groups",
    card_labors_desc: "Book experienced labor groups for sowing, weeding, harvesting, and sorting operations at fair standardized rates.",
    card_services_title: "Agro Services",
    card_services_desc: "Book professional borewell drilling workers, submersible motor rewinding, starter fixes, and heavy tractor repairs.",
    direct_trade: "Direct Trade",
    standard_rates: "Standard Rates",
    verified_crews: "Verified Crews",
    expert_technical: "Expert Technical",

    // Crops View
    crops_title: "Crop Marketplace",
    crops_subtitle: "Buy fresh crop listings directly from local farmers.",
    search_crops_placeholder: "Search crops by name or grower...",
    all_categories: "All Categories",
    category_grains: "Grains & Cereals",
    category_vegetables: "Fresh Vegetables",
    category_fruits: "Fresh Fruits",
    category_others: "Other Inputs",
    organic_only: "Organic Only",
    buy_now: "Buy Now",
    out_of_stock: "Out of Stock",
    organic_badge: "Organic",
    by: "By",
    qty: "Qty",

    // Tractors View
    tractors_title: "Tractor & Implements Rentals",
    tractors_subtitle: "Rent powerful tractors, seeders, levelers, and harvest tools.",
    search_tractors_placeholder: "Search tractor brand or owner...",
    all_hp: "All Power Tiers (HP)",
    low_hp: "Medium Duty (< 50 HP)",
    high_hp: "Heavy Duty (>= 50 HP)",
    rent_now: "Rent Now",
    hour: "hr",
    day: "day",
    or: "Or",

    // Labor View
    labors_title: "Standardized Labor Booking",
    labors_subtitle: "Hire skilled individual operators or crew teams for immediate farm works.",
    search_labors_placeholder: "Search laborer groups by name or location...",
    all_skills: "All Agronomical Skills",
    skill_harvesting: "Harvesting & Cutting",
    skill_sowing: "Sowing & Plantation",
    skill_weeding: "Weed Clearance",
    skill_driving: "Tractor Operation",
    book_crew: "Book Crew",

    // Agro Services View
    services_title: "Agro Technical Services",
    services_subtitle: "Book expert technicians for borewell drilling, motor rewinding, starter fixes, and heavy tractor breakdowns.",
    search_services_placeholder: "Search technician by name, skill, or location...",
    all_specialties: "All Specialties",
    specialty_borewell: "Electrical Borewell Workers",
    specialty_motor: "Submersible Motor Repairs",
    specialty_tractor: "Tractor Repairs & Service",
    specialty_irrigation: "Irrigation & Drip Repairs",
    book_expert: "Book Expert",
    visit_fee: "visit fee",

    // Price Index
    prices_title: "Pricing Trends & Market Intelligence",
    prices_subtitle: "Live retail prices of essential seeds, biological fertilizers, and organic pesticides across Indian mandis.",
    search_prices_placeholder: "Search inputs name...",
    current_price: "Current Price",
    last_month: "Last Month",
    monthly_trend: "6-Month Mandi Trend",

    // Dashboards
    farmer_portal: "Farmer Central Portal",
    farmer_subtitle: "Track listed crops sales and view active equipment, labor, and technical service bookings.",
    buyer_portal: "Buyer Dashboard Hub",
    buyer_subtitle: "Monitor crop purchase deliveries and booked logistics, labor crews, and technical service specialists.",
    list_new_crop: "List New Crop",
    active_listings: "My Active Crop Listings",
    sales_orders: "Crop Sales Orders",
    services_tracker: "Hired Services Tracker",
    purchases_value: "Purchases Value",
    active_orders: "Active Orders",
    tractor_rentals: "Tractor Rentals",
    bookings_count: "Bookings (Labor/Agro)",
    revenue: "Sales Revenue",
    stock_left: "Stock Left",

    // Price Index additions
    price_index_header: "Seed & Pesticide Price Index",
    price_index_sub: "Compare regional markets rates and review monthly price trends.",
    price_directory: "Regional Inputs Price Directory",
    search_item: "Search item...",
    opt_all: "All",
    opt_seeds: "Seeds",
    opt_pesticides: "Pesticides",
    opt_fertilizers: "Fertilizers",
    col_product_name: "Product Name",
    col_todays_rate: "Today's Rate",
    col_last_month: "Last Month",
    col_change: "Change",
    col_action: "Action",
    stable: "Stable",
    view_trend: "View Trend",
    rate_movements: "Rate movements per",
    over_six_months: "over the last 6 months.",
    select_item: "Select an item...",
    click_view_trend: "Click view trend to display price graph.",
    market_tip: "Market Tip",
    market_tip_desc: "Regional inputs index shows seasonal supply peaks. Lock dynamic rates early through our platform to minimize overheads.",

    // Auth View additions
    auth_hero_desc: "Connect with the local community, maximize crop margins, and book machinery easily in minutes.",
    secured_payments: "100% Secured Direct Payments",
    verified_providers: "Verified Farmers & Service Providers",
    login_account_tab: "Login Account",
    new_reg_tab: "New Registration",
    welcome_back: "Welcome Back!",
    login_tip: 'Enter your credentials below. Tip: Enter "farmer@agromarket.com" to test as a Farmer role or "dev@agromarket.com" for Buyer role. Password is "password123".',
    email_user: "Email Address / Username",
    password_label: "Password",
    sign_in_btn: "Sign In",
    join_platform: "Join AgroMarket Pro",
    reg_desc: "Create a free profile to purchase crops, list yields, hire labor, or lease out machinery.",
    select_role: "Select Account Role Type",
    farmer_seller: "Farmer / Seller",
    buyer_trader: "Buyer / Trader",
    full_name: "Full Legal Name",
    email_address: "Email Address",
    mobile_no: "Mobile Phone No.",
    operating_loc: "Operating Location / State",
    create_pwd: "Create Security Password",
    create_acc_btn: "Create Account",

    // Farmer Dashboard additions
    col_crop_name: "Crop Name",
    col_category: "Category",
    col_price_rate: "Price Rate",
    col_stock_left: "Stock Left",
    no_active_listings: "No active listings. Let's create one!",
    delete_btn: "Delete",
    col_order_id: "Order ID",
    col_crop_details: "Crop Details",
    col_purchased_qty: "Purchased Qty",
    col_revenue: "Revenue",
    col_status: "Status",
    no_sales_transacted: "No sales transacted yet. Once a buyer places an order, it will appear here.",
    services_tracker_desc: "Overview of heavy tractors, labor crews, and technical service specialists hired under your operations.",
    col_booking_id: "Booking ID",
    col_details: "Details",
    col_duration: "Duration",
    col_total_cost: "Total Cost",
    no_services_hired: "No active service hire logs found.",
    list_crop_title: "List Crop for Direct Sale",
    field_crop_title: "Crop Display Title / Name",
    placeholder_crop_title: "Organic Golden Sharbati Wheat",
    field_category: "Category",
    field_certified_organic: "Certified Organic",
    field_selling_rate: "Direct Selling Rate (₹)",
    field_selling_unit: "Selling Unit",
    field_stock_available: "Stock Available for Sale",
    field_spec_desc: "Product Specifications & Description",
    placeholder_spec_desc: "Describe crop grade, moisture levels, harvesting dates, and loading states details...",
    unit_kg: "Per Kilogram (kg)",
    unit_quintal: "Per Quintal (100 kg)",
    unit_ton: "Per Metric Ton",
    unit_box: "Per Case / Box",
    cancel_btn: "Cancel",
    list_yield_btn: "List Yield Now",
    machinery_leased: "Machinery Leased",

    // Buyer Dashboard additions
    browse_market: "Browse Crop Marketplace",
    my_purchases: "My Purchased Crop Orders",
    no_purchases_recorded: "No purchases recorded. Browse the marketplace to make a direct trade!",
    rented_tractors_logs: "Rented Tractors Logs",
    no_equipment_booked: "No heavy equipment booked.",
    service_bookings_labor_repairs: "Service Bookings (Labor & Repairs)",
    col_specialist_group: "Specialist / Group",
    col_wages_paid: "Wages Paid",
    no_workers_booked: "No workers or repairs technicians booked.",

    // Additional marketplace visual translations
    crop_login_warning: "Please register or log in to buy crops.",
    crop_farmer_warning: "Farmers listed as sellers cannot buy crops. Register a Buyer account to purchase.",
    enter_valid_qty: "Please enter a valid quantity.",
    only_available: "only available.",
    success_ordered: "Success! Ordered",
    no_crops_found: "No crop listings match your search criteria.",
    purchase_crop_directly: "Purchase Crop Directly",
    grower: "Grower",
    base_price: "Base Price",
    qty_to_buy: "Quantity to Buy",
    total_amount_pay: "Total Amount Pay",
    place_order: "Place Order",

    tractor_login_warning: "Please register or log in to rent machinery.",
    enter_duration_date: "Please enter a valid duration and start date.",
    tractor_reserved: "Tractor Reserved!",
    no_tractors_found: "No tractor listings match your search criteria.",
    rent_machinery_booking: "Rent Machinery Booking",
    rent_duration_type: "Rent Duration Type",
    duration_qty: "Duration Quantity",
    lease_start_date: "Lease Start Date",
    total_est_rent: "Total Est. Rent Price",
    hourly_hire: "Hourly Hire",
    daily_lease: "Daily Lease",
    reserve_tractor: "Reserve Tractor",

    labor_login_warning: "Please register or log in to book labor crews.",
    labor_crew_hired: "Labor Crew Hired!",
    no_labors_found: "No laborer groups match your search criteria.",
    member_crew: "Member Crew",
    book_farm_labor: "Book Farm Labor Crew",
    daily_wage_rate: "Daily Wage Rate",
    per_worker_group: "per worker group",
    duration_booking_days: "Duration of Booking (Days)",
    est_total_wages: "Est. Total Wages",
    book_group_btn: "Book Group",

    booking_login_warning: "Please register or log in to book technical specialists.",
    no_providers_found: "No agro service providers match your search criteria.",
    lead_provider: "Lead Provider",
    base_rate: "Base Rate",
    visit_charge_suffix: "visit charge",
    duration_days_label: "Duration of Hired Service (Days)",
    work_start_date: "Work Start Date",
    est_service_wages: "Est. Service Wages",
    register_booking_btn: "Register Booking",
    category_borewell_worker: "Borewell Worker",
    category_motor_repairer: "Motor Repairer",
    category_tractor_mechanic: "Tractor Mechanic",
    category_agro_tech: "Agro Technical Specialist",
  },
  hi: {
    // General / Sidebar
    logo_brand: "एग्रोमार्केट",
    logo_sub: "प्रो",
    sidebar_explore: "मंच का अन्वेषण करें",
    menu_home: "मुख्य पृष्ठ",
    menu_crops: "फसल बाजार",
    menu_tractors: "ट्रैक्टर किराया",
    menu_labors: "मजदूर समूह",
    menu_services: "कृषि सेवाएं",
    menu_prices: "मूल्य सूचकांक",
    menu_dashboard: "मेरा डैशबोर्ड",
    sidebar_farmer: "किसान पैनल",
    sidebar_buyer: "खरीदार पैनल",
    menu_login: "पंजीकरण / लॉगिन",
    menu_logout: "लॉगआउट",
    welcome: "स्वागत है",
    role_farmer: "किसान",
    role_buyer: "खरीदार",

    // Landing Page
    hero_tag: "भारतीय कृषि को सशक्त बनाना",
    hero_title_1: "उम्मीदों की फसल,",
    hero_title_span: "समृद्धि की ओर",
    hero_desc: "भारत का पहला संपूर्ण कृषि नेटवर्क। सीधे फसल की उपज का व्यापार करें, कुशल कटाई मजदूर समूह किराए पर लें, पेशेवर भारी ट्रैक्टर किराए पर लें, और वास्तविक समय में उर्वरक एवं बीज के रुझानों को ट्रैक करें।",
    hub_title: "व्यापक कृषि केंद्र",
    card_crops_title: "फसल बाजार",
    card_crops_desc: "फसल उत्पादकों से सीधे ताजा फसलें खरीदें। शून्य बिचौलिया मार्जिन, गारंटीकृत ग्रेड और स्थानीय परिवहन।",
    card_tractors_title: "ट्रैक्टर किराया",
    card_tractors_desc: "प्रति घंटे या प्रति दिन शक्तिशाली ट्रैक्टर, डिस्क हल और रोटावेटर किराए पर लें। पूर्ण सुरक्षा बीमा।",
    card_labors_title: "मजदूर समूह किराए पर लें",
    card_labors_desc: "उचित मानकीकृत दरों पर बुवाई, निराई, कटाई और छंटाई के लिए अनुभवी मजदूर समूह बुक करें।",
    card_services_title: "कृषि सेवाएं",
    card_services_desc: "पेशेवर बोरवेल ड्रिलिंग कार्यकर्ता, सबमर्सिबल मोटर वाइंडिंग, स्टार्टर बॉक्स मरम्मत और ट्रैक्टर मरम्मत बुक करें।",
    direct_trade: "सीधा व्यापार",
    standard_rates: "मानक दरें",
    verified_crews: "सत्यापित दल",
    expert_technical: "विशेषज्ञ तकनीकी",

    // Crops View
    crops_title: "फसल बाजार",
    crops_subtitle: "स्थानीय किसानों से सीधे ताजा फसलें खरीदें।",
    search_crops_placeholder: "फसल के नाम या किसान द्वारा खोजें...",
    all_categories: "सभी श्रेणियां",
    category_grains: "अनाज और दलहन",
    category_vegetables: "ताजा सब्जियां",
    category_fruits: "ताजा फल",
    category_others: "अन्य कृषि सामग्री",
    organic_only: "केवल जैविक (ऑर्गेनिक)",
    buy_now: "अभी खरीदें",
    out_of_stock: "स्टॉक में नहीं",
    organic_badge: "जैविक",
    by: "द्वारा",
    qty: "मात्रा",

    // Tractors View
    tractors_title: "ट्रैक्टर और कृषि उपकरण किराया",
    tractors_subtitle: "शक्तिशाली ट्रैक्टर, सीडर, लेवलर और कटाई उपकरण किराए पर लें।",
    search_tractors_placeholder: "ट्रैक्टर ब्रांड या मालिक द्वारा खोजें...",
    all_hp: "सभी अश्वशक्ति (HP)",
    low_hp: "मध्यम कार्य (< 50 HP)",
    high_hp: "भारी कार्य (>= 50 HP)",
    rent_now: "अभी किराए पर लें",
    hour: "घंटा",
    day: "दिन",
    or: "या",

    // Labor View
    labors_title: "मानकीकृत मजदूर बुकिंग",
    labors_subtitle: "कृषि कार्यों के लिए कुशल ऑपरेटरों या मजदूर टीमों को तुरंत किराए पर लें।",
    search_labors_placeholder: "नाम या स्थान के अनुसार खोजें...",
    all_skills: "सभी कृषि कौशल",
    skill_harvesting: "कटाई और कटाई",
    skill_sowing: "बुवाई और रोपण",
    skill_weeding: "खरपतवार सफाई",
    skill_driving: "ट्रैक्टर संचालन",
    book_crew: "मजदूर बुक करें",

    // Agro Services View
    services_title: "कृषि तकनीकी सेवाएं",
    services_subtitle: "बोरवेल ड्रिलिंग, मोटर वाइंडिंग, स्टार्टर फिक्स और ट्रैक्टर मरम्मत के लिए विशेषज्ञ मैकेनिक बुक करें।",
    search_services_placeholder: "नाम, कौशल या स्थान के अनुसार खोजें...",
    all_specialties: "सभी विशेषज्ञताएं",
    specialty_borewell: "विद्युत बोरवेल कार्यकर्ता",
    specialty_motor: "सबमर्सिबल मोटर मरम्मत",
    specialty_tractor: "ट्रैक्टर मरम्मत और सेवा",
    specialty_irrigation: "सिंचाई और ड्रिप मरम्मत",
    book_expert: "विशेषज्ञ बुक करें",
    visit_fee: "विजिट शुल्क",

    // Price Index
    prices_title: "मूल्य रुझान और बाजार विश्लेषण",
    prices_subtitle: "भारतीय मंडियों में आवश्यक बीजों, जैविक उर्वरकों और जैविक कीटनाशकों की लाइव खुदरा कीमतें।",
    search_prices_placeholder: "कृषि सामग्री खोजें...",
    current_price: "वर्तमान मूल्य",
    last_month: "पिछले महीने",
    monthly_trend: "6-महीने का मंडी रुझान",

    // Dashboards
    farmer_portal: "किसान केंद्रीय पोर्टल",
    farmer_subtitle: "फसल बिक्री को ट्रैक करें और सक्रिय उपकरण, श्रम और तकनीकी सेवा बुकिंग देखें।",
    buyer_portal: "खरीदार डैशबोर्ड हब",
    buyer_subtitle: "फसल खरीद डिलीवरी और बुक किए गए उपकरण, श्रम और तकनीकी विशेषज्ञों की निगरानी करें।",
    list_new_crop: "नई फसल सूचीबद्ध करें",
    active_listings: "मेरी सक्रिय फसलें",
    sales_orders: "फसल बिक्री आदेश",
    services_tracker: "किराए पर ली गई सेवाएं",
    purchases_value: "कुल खरीद मूल्य",
    active_orders: "सक्रिय ऑर्डर",
    tractor_rentals: "ट्रैक्टर किराया",
    bookings_count: "बुकिंग (मजदूर/तकनीकी)",
    revenue: "बिक्री राजस्व",
    stock_left: "स्टॉक शेष",

    // Price Index additions
    price_index_header: "बीज और कीटनाशक मूल्य सूचकांक",
    price_index_sub: "क्षेत्रीय बाजारों की दरों की तुलना करें और मासिक मूल्य रुझानों की समीक्षा करें।",
    price_directory: "क्षेत्रीय कृषि सामग्री मूल्य निर्देशिका",
    search_item: "सामग्री खोजें...",
    opt_all: "सभी",
    opt_seeds: "बीज",
    opt_pesticides: "कीटनाशक",
    opt_fertilizers: "उर्वरक",
    col_product_name: "उत्पाद का नाम",
    col_todays_rate: "आज की दर",
    col_last_month: "पिछले महीने",
    col_change: "बदलाव",
    col_action: "कार्रवाई",
    stable: "स्थिर",
    view_trend: "रुझान देखें",
    rate_movements: "प्रति दर में उतार-चढ़ाव",
    over_six_months: "पिछले 6 महीनों में।",
    select_item: "एक सामग्री चुनें...",
    click_view_trend: "मूल्य आलेख प्रदर्शित करने के लिए रुझान देखें पर क्लिक करें।",
    market_tip: "बाज़र सलाह",
    market_tip_desc: "क्षेत्रीय कृषि सामग्री सूचकांक मौसमी आपूर्ति के उतार-चढ़ाव को दर्शाता है। लागत को कम करने के लिए हमारे मंच के माध्यम से जल्दी ही दरें तय करें।",

    // Auth View additions
    auth_hero_desc: "स्थानीय समुदाय से जुड़ें, फसल मुनाफे को अधिकतम करें, और मिनटों में आसानी से मशीनरी बुक करें।",
    secured_payments: "100% सुरक्षित प्रत्यक्ष भुगतान",
    verified_providers: "सत्यापित किसान और सेवा प्रदाता",
    login_account_tab: "खाता लॉगिन करें",
    new_reg_tab: "नया पंजीकरण",
    welcome_back: "वापसी पर स्वागत है!",
    login_tip: 'नीचे अपनी साख दर्ज करें। युक्ति: किसान भूमिका के रूप में परीक्षण करने के लिए "farmer@agromarket.com" या खरीदार भूमिका के लिए "dev@agromarket.com" दर्ज करें। पासवर्ड "password123" है।',
    email_user: "ईमेल पता / उपयोगकर्ता नाम",
    password_label: "पासवर्ड",
    sign_in_btn: "साइन इन करें",
    join_platform: "एग्रोमार्केट प्रो से जुड़ें",
    reg_desc: "फसल खरीदने, उपज सूचीबद्ध करने, श्रम किराए पर लेने या मशीनरी पट्टे पर देने के लिए एक निःशुल्क प्रोफ़ाइल बनाएं।",
    select_role: "खाता भूमिका प्रकार चुनें",
    farmer_seller: "किसान / विक्रेता",
    buyer_trader: "खरीदार / व्यापारी",
    full_name: "पूर्ण कानूनी नाम",
    email_address: "ईमेल पता",
    mobile_no: "मोबाइल फोन नंबर",
    operating_loc: "परिचालन स्थान / राज्य",
    create_pwd: "सुरक्षा पासवर्ड बनाएं",
    create_acc_btn: "खाता बनाएं",

    // Farmer Dashboard additions
    col_crop_name: "फसल का नाम",
    col_category: "श्रेणी",
    col_price_rate: "मूल्य दर",
    col_stock_left: "स्टॉक शेष",
    no_active_listings: "कोई सक्रिय फसल नहीं है। आइए एक बनाएं!",
    delete_btn: "हटाएं",
    col_order_id: "ऑर्डर आईडी",
    col_crop_details: "फसल विवरण",
    col_purchased_qty: "खरीदी गई मात्रा",
    col_revenue: "राजस्व",
    col_status: "स्थिति",
    no_sales_transacted: "अभी तक कोई बिक्री नहीं हुई है। जब कोई खरीदार ऑर्डर देगा, तो वह यहां दिखाई देगा।",
    services_tracker_desc: "आपके संचालन के तहत किराए पर लिए गए भारी ट्रैक्टरों, श्रम दलों और तकनीकी सेवा विशेषज्ञों का अवलोकन।",
    col_booking_id: "बुकिंग आईडी",
    col_details: "विवरण",
    col_duration: "अवधि",
    col_total_cost: "कुल लागत",
    no_services_hired: "कोई सक्रिय सेवा किराया लॉग नहीं मिला।",
    list_crop_title: "प्रत्यक्ष बिक्री के लिए फसल सूचीबद्ध करें",
    field_crop_title: "फसल प्रदर्शन शीर्षक / नाम",
    placeholder_crop_title: "जैविक गोल्डन शरबती गेहूं",
    field_category: "श्रेणी",
    field_certified_organic: "प्रमाणित जैविक",
    field_selling_rate: "प्रत्यक्ष बिक्री दर (₹)",
    field_selling_unit: "बिक्री इकाई",
    field_stock_available: "बिक्री के लिए उपलब्ध स्टॉक",
    field_spec_desc: "उत्पाद विनिर्देश और विवरण",
    placeholder_spec_desc: "फसल ग्रेड, नमी का स्तर, कटाई की तारीखें और लोडिंग की स्थिति का विवरण लिखें...",
    unit_kg: "प्रति किलोग्राम (kg)",
    unit_quintal: "प्रति क्विंटल (100 kg)",
    unit_ton: "प्रति मीट्रिक टन",
    unit_box: "प्रति केस / बॉक्स",
    cancel_btn: "रद्द करें",
    list_yield_btn: "फसल सूचीबद्ध करें",
    machinery_leased: "किराए पर ली गई मशीनें",

    // Buyer Dashboard additions
    browse_market: "फसल बाजार ब्राउज़ करें",
    my_purchases: "मेरे द्वारा खरीदे गए फसल ऑर्डर",
    no_purchases_recorded: "कोई खरीद दर्ज नहीं है। सीधा व्यापार करने के लिए बाजार ब्राउज़ करें!",
    rented_tractors_logs: "किराए पर लिए गए ट्रैक्टरों का लॉग",
    no_equipment_booked: "कोई भारी उपकरण बुक नहीं है।",
    service_bookings_labor_repairs: "सेवा बुकिंग (श्रम और मरम्मत)",
    col_specialist_group: "विशेषज्ञ / समूह",
    col_wages_paid: "भुगतान की गई मजदूरी",
    no_workers_booked: "कोई मजदूर या मरम्मत तकनीशियन बुक नहीं है।",

    // Additional marketplace visual translations
    crop_login_warning: "फसलें खरीदने के लिए कृपया पंजीकरण करें या लॉगिन करें।",
    crop_farmer_warning: "विक्रेता के रूप में सूचीबद्ध किसान फसलें नहीं खरीद सकते। खरीदने के लिए एक खरीदार खाता पंजीकृत करें।",
    enter_valid_qty: "कृपया एक वैध मात्रा दर्ज करें।",
    only_available: "ही उपलब्ध है।",
    success_ordered: "सफलता! ऑर्डर दिया गया",
    no_crops_found: "आपकी खोज मानदंडों से कोई भी फसल सूची मेल नहीं खाती।",
    purchase_crop_directly: "सीधे फसल खरीदें",
    grower: "उत्पादक",
    base_price: "मूल्य दर",
    qty_to_buy: "खरीदने की मात्रा",
    total_amount_pay: "कुल भुगतान राशि",
    place_order: "ऑर्डर दें",

    tractor_login_warning: "मशीनरी किराए पर लेने के लिए कृपया पंजीकरण करें या लॉगिन करें।",
    enter_duration_date: "कृपया एक वैध अवधि और प्रारंभ तिथि दर्ज करें।",
    tractor_reserved: "ट्रैक्टर आरक्षित!",
    no_tractors_found: "आपकी खोज मानदंडों से कोई भी ट्रैक्टर सूची मेल नहीं खाती।",
    rent_machinery_booking: "मशीनरी किराया बुकिंग",
    rent_duration_type: "किराया अवधि का प्रकार",
    duration_qty: "अवधि मात्रा",
    lease_start_date: "पट्टे की प्रारंभ तिथि",
    total_est_rent: "कुल अनुमानित किराया",
    hourly_hire: "प्रति घंटा किराया",
    daily_lease: "दैनिक पट्टा",
    reserve_tractor: "ट्रैक्टर आरक्षित करें",

    labor_login_warning: "मजदूरों को बुक करने के लिए कृपया पंजीकरण करें या लॉगिन करें।",
    labor_crew_hired: "मजदूर दल काम पर रखा गया!",
    no_labors_found: "आपकी खोज मानदंडों से कोई भी मजदूर समूह मेल नहीं खाता।",
    member_crew: "सदस्य दल",
    book_farm_labor: "कृषि मजदूर दल बुक करें",
    daily_wage_rate: "दैनिक मजदूरी दर",
    per_worker_group: "प्रति मजदूर समूह",
    duration_booking_days: "बुकिंग की अवधि (दिन)",
    est_total_wages: "अनुमानित कुल मजदूरी",
    book_group_btn: "समूह बुक करें",

    booking_login_warning: "तकनीकी विशेषज्ञों को बुक करने के लिए कृपया पंजीकरण करें या लॉगिन करें।",
    no_providers_found: "आपकी खोज मानदंडों से कोई भी कृषि सेवा प्रदाता मेल नहीं खाता।",
    lead_provider: "मुख्य सेवा प्रदाता",
    base_rate: "आधार दर",
    visit_charge_suffix: "विजिट शुल्क",
    duration_days_label: "किराए की सेवा की अवधि (दिन)",
    work_start_date: "काम शुरू होने की तारीख",
    est_service_wages: "अनुमानित सेवा मजदूरी",
    register_booking_btn: "बुकिंग पंजीकृत करें",
    category_borewell_worker: "बोरवेल कार्यकर्ता",
    category_motor_repairer: "मोटर मरम्मतकर्ता",
    category_tractor_mechanic: "ट्रैक्टर मैकेनिक",
    category_agro_tech: "कृषि तकनीकी विशेषज्ञ",
  },
  te: {
    // General / Sidebar
    logo_brand: "అగ్రోమార్కెట్",
    logo_sub: "ప్రో",
    sidebar_explore: "ప్లాట్‌ఫారమ్‌ను అన్వేషించండి",
    menu_home: "ప్రధాన పేజీ",
    menu_crops: "పంటల మార్కెట్",
    menu_tractors: "ట్రాక్టర్ అద్దె",
    menu_labors: "కూలీల సమూహం",
    menu_services: "వ్యవసాయ సేవలు",
    menu_prices: "ధరల సూచిక",
    menu_dashboard: "నా డ్యాష్‌బోర్డ్",
    sidebar_farmer: "రైతు ప్యానెల్",
    sidebar_buyer: "కొనుగోలుదారు ప్యానెల్",
    menu_login: "నమోదు / లాగిన్",
    menu_logout: "లాగౌట్",
    welcome: "స్వాగతం",
    role_farmer: "రైతు",
    role_buyer: "కొనుగోలుదారు",

    // Landing Page
    hero_tag: "భారతీయ వ్యవసాయాన్ని బలోపేతం చేయడం",
    hero_title_1: "ఆశల పంట,",
    hero_title_span: "సమృద్ధి వైపు",
    hero_desc: "భారతదేశపు మొట్టమొదటి సంపూర్ణ వ్యవసాయ నెట్‌వర్క్. పంట దిగుబడిని నేరుగా వ్యాపారం చేయండి, నైపుణ్యం కలిగిన కూలీల బృందాలను నియమించుకోండి, ప్రొఫెషనల్ భారీ ట్రాక్టర్లను అద్దెకు తీసుకోండి మరియు నిజ సమయంలో ఎరువులు & విత్తనాల ధరలను తెలుసుకోండి.",
    hub_title: "సమగ్ర వ్యవసాయ కేంద్రం",
    card_crops_title: "పంటల మార్కెట్",
    card_crops_desc: "రైతుల నుండి నేరుగా తాజా పంటలను కొనుగోలు చేయండి. మధ్యవర్తులు లేరు, హామీ ఇవ్వబడిన నాణ్యత మరియు స్థానిక రవాణా.",
    card_tractors_title: "ట్రాక్టర్ అద్దె",
    card_tractors_desc: "గంటకు లేదా రోజుకు శక్తివంతమైన ట్రాక్టర్లు, నాగలి మరియు రోటవేటర్లను అద్దెకు తీసుకోండి. పూర్తి భద్రతా భీమా.",
    card_labors_title: "కూలీల బృందాలు",
    card_labors_desc: "నిర్ణీత సరసమైన ధరల వద్ద నాట్లు వేయడం, కలుపు తీయడం, కోతలు మరియు వర్గీకరణ పనుల కోసం అనుభవజ్ఞులైన కూలీలను బుక్ చేయండి.",
    card_services_title: "వ్యవసాయ సేవలు",
    card_services_desc: "ప్రొఫెషనల్ బోరుబావుల తవ్వకం కార్మికులు, సబ్‌మెర్సిబుల్ మోటార్ వైండింగ్, స్టార్టర్ బాక్స్ మరమ్మత్తు మరియు ట్రాక్టర్ రిపేర్ నిపుణులను బుక్ చేయండి.",
    direct_trade: "నేరుగా వ్యాపారం",
    standard_rates: "నిర్ణీత ధరలు",
    verified_crews: "ధృవీకరించబడిన కూలీలు",
    expert_technical: "సాంకేతిక నిపుణులు",

    // Crops View
    crops_title: "పంటల మార్కెట్",
    crops_subtitle: "స్థానిక రైతుల నుండి నేరుగా తాజా పంటలను కొనుగోలు చేయండి.",
    search_crops_placeholder: "పంట పేరు లేదా రైతు పేరుతో శోధించండి...",
    all_categories: "అన్ని విభాగాలు",
    category_grains: "ధాన్యాలు & తృణధాన్యాలు",
    category_vegetables: "తాజా కూరగాయలు",
    category_fruits: "తాజా పండ్లు",
    category_others: "ఇతర వ్యవసాయ ఇన్పుట్లు",
    organic_only: "సేంద్రీయ (ఆర్గానిక్) మాత్రమే",
    buy_now: "ఇప్పుడే కొనండి",
    out_of_stock: "స్టాక్ లేదు",
    organic_badge: "సేంద్రీయ",
    by: "ద్వారా",
    qty: "పరిమాణం",

    // Tractors View
    tractors_title: "ట్రాక్టర్ మరియు వ్యవసాయ పరికరాల అద్దె",
    tractors_subtitle: "శక్తివంతమైన ట్రాక్టర్లు, విత్తనాలు చల్లే యంత్రాలు మరియు కోత పరికరాలను అద్దెకు తీసుకోండి.",
    search_tractors_placeholder: "ట్రాక్టర్ బ్రాండ్ లేదా యజమాని పేరుతో శోధించండి...",
    all_hp: "అన్ని హార్స్ పవర్ (HP)",
    low_hp: "మధ్యస్థ స్థాయి (< 50 HP)",
    high_hp: "భారీ స్థాయి (>= 50 HP)",
    rent_now: "ఇప్పుడే అద్దెకు తీసుకోండి",
    hour: "గంట",
    day: "రోజు",
    or: "లేదా",

    // Labor View
    labors_title: "కూలీల బుకింగ్ విధానం",
    labors_subtitle: "వ్యవసాయ పనుల కోసం తక్షణమే నైపుణ్యం కలిగిన కూలీల బృందాలను బుక్ చేయండి.",
    search_labors_placeholder: "పేరు లేదా ప్రదేశం ద్వారా శోధించండి...",
    all_skills: "అన్ని వ్యవసాయ నైపుణ్యాలు",
    skill_harvesting: "కోతలు మరియు కత్తిరింపులు",
    skill_sowing: "నాట్లు మరియు నాటడం",
    skill_weeding: "కలుపు నివారణ పనులు",
    skill_driving: "ట్రాక్టర్ డ్రైవింగ్",
    book_crew: "కూలీలను బుక్ చేయండి",

    // Agro Services View
    services_title: "వ్యవసాయ సాంకేతిక సేవలు",
    services_subtitle: "బోరుబావుల తవ్వకం, మోటార్ వైండింగ్, స్టార్టర్ ఫిక్సింగ్ మరియు ట్రాక్టర్ రిపేర్ కోసం నిపుణులను బుక్ చేయండి.",
    search_services_placeholder: "పేరు, నైపుణ్యం లేదా ప్రదేశం ద్వారా శోధించండి...",
    all_specialties: "అన్ని ప్రత్యేకతలు",
    specialty_borewell: "ఎలక్ట్రికల్ బోరుబావుల నిపుణులు",
    specialty_motor: "సబ్‌మెర్సిబుల్ మోటార్ మరమ్మత్తు",
    specialty_tractor: "ట్రాక్టర్ మరమ్మత్తు మరియు సర్వీసింగ్",
    specialty_irrigation: "నీటి పారుదల & డ్రిప్ సిస్టమ్ రిపేర్",
    book_expert: "నిపుణులను బుక్ చేయండి",
    visit_fee: "విజిట్ ఛార్జ్",

    // Price Index
    prices_title: "మార్కెట్ ధరల విశ్లేషణ",
    prices_subtitle: "భారతీయ మార్కెట్లలో విత్తనాలు, ఎరువులు మరియు సేంద్రీయ పురుగుమందుల ప్రత్యక్ష రిటైల్ ధరలు.",
    search_prices_placeholder: "వ్యవసాయ వస్తువుల కోసం శోధించండి...",
    current_price: "ప్రస్తుత ధర",
    last_month: "గత నెల",
    monthly_trend: "6-నెలల ధరల సరళి",

    // Dashboards
    farmer_portal: "రైతు సేవా కేంద్రం",
    farmer_subtitle: "పంటల అమ్మకాలను ట్రాక్ చేయండి మరియు బుక్ చేసుకున్న యంత్రాలు, కూలీలు మరియు సాంకేతిక నిపుణుల వివరాలు చూడండి.",
    buyer_portal: "కొనుగోలుదారు సేవా కేంద్రం",
    buyer_subtitle: "పంటల కొనుగోలు డెలివరీలు మరియు బుక్ చేసుకున్న యంత్రాలు, కూలీలు మరియు సాంకేతిక నిపుణుల వివరాలను పర్యవేక్షించండి.",
    list_new_crop: "కొత్త పంటను చేర్చండి",
    active_listings: "నా క్రియాశీల పంటలు",
    sales_orders: "పంటల అమ్మకాల ఆర్డర్లు",
    services_tracker: "అద్దె సేవలు",
    purchases_value: "మొత్తం కొనుగోలు విలువ",
    active_orders: "క్రియాశీల ఆర్డర్లు",
    tractor_rentals: "ట్రాక్టర్ అద్దెలు",
    bookings_count: "బుకింగ్స్ (కూలీలు/టెక్నికల్)",
    revenue: "అమ్మకాల ఆదాయం",
    stock_left: "మిగిలిన స్టాక్",

    // Price Index additions
    price_index_header: "విత్తనాలు & పురుగుమందుల ధరల సూచిక",
    price_index_sub: "ప్రాంతీయ మార్కెట్ ధరలను సరిపోల్చండి మరియు నెలవారీ ధరల సరళిని సమీక్షించండి.",
    price_directory: "ప్రాంతీయ వ్యవసాయ వస్తువుల ధరల జాబితా",
    search_item: "వస్తువుల కోసం శోధించండి...",
    opt_all: "అన్నీ",
    opt_seeds: "విత్తనాలు",
    opt_pesticides: "పురుగుమందులు",
    opt_fertilizers: "ఎరువులు",
    col_product_name: "ఉత్పత్తి పేరు",
    col_todays_rate: "నేటి ధర",
    col_last_month: "గత నెల",
    col_change: "మార్పు",
    col_action: "చర్య",
    stable: "స్థిరంగా",
    view_trend: "ధరల సరళి చూడండి",
    rate_movements: "ధరల వ్యత్యాసం ప్రతి",
    over_six_months: "గత 6 నెలలలో.",
    select_item: "ఒక వస్తువును ఎంచుకోండి...",
    click_view_trend: "ధరల గ్రాఫ్ చూడటానికి ధరల సరళి పై క్లిక్ చేయండి.",
    market_tip: "మార్కెట్ సలహా",
    market_tip_desc: "ప్రాంతీయ వ్యవసాయ వస్తువుల ధరలు కాలానికి అనుగుణంగా మారుతుంటాయి. అదనపు ఖర్చులను తగ్గించుకోవడానికి మా ప్లాట్‌ఫారమ్ ద్వారా ధరలను ముందుగానే ఖరారు చేసుకోండి.",

    // Auth View additions
    auth_hero_desc: "స్థానిక సంఘంతో కనెక్ట్ అవ్వండి, పంట లాభాలను పెంచుకోండి మరియు నిమిషాల్లో సులభంగా యంత్రాలను బుక్ చేయండి.",
    secured_payments: "100% సురక్షితమైన ప్రత్యక్ష చెల్లింపులు",
    verified_providers: "ధృవీకరించబడిన రైతులు & సేవా ప్రదాతలు",
    login_account_tab: "ఖాతా లాగిన్",
    new_reg_tab: "కొత్త రిజిస్ట్రేషన్",
    welcome_back: "మళ్ళీ स्वागतం!",
    login_tip: 'దిగువ మీ వివరాలను నమోదు చేయండి. సూచన: రైతు పాత్రగా పరీక్షించడానికి "farmer@agromarket.com" లేదా కొనుగోలుదారు పాత్ర కోసం "dev@agromarket.com" నమోదు చేయండి. పాస్‌వర్డ్ "password123".',
    email_user: "ఇమెయిల్ చిరునామా / వినియోగదారు పేరు",
    password_label: "పాస్‌వర్డ్",
    sign_in_btn: "సైన్ ఇన్",
    join_platform: "అగ్రోమార్కెట్ ప్రోలో చేరండి",
    reg_desc: "పంటలను కొనుగోలు చేయడానికి, పంట వివరాలను చేర్చడానికి, కూలీలను నియమించుకోవడానికి లేదా యంత్రాలను అద్దెకు ఇవ్వడానికి ఉచిత ప్రొఫైల్‌ను సృష్టించండి.",
    select_role: "ఖాతా పాత్ర రకాన్ని ఎంచుకోండి",
    farmer_seller: "రైతు / విక్రేత",
    buyer_trader: "కొనుగోలుదారు / వ్యాపారి",
    full_name: "పూర్తి చట్టపరమైన పేరు",
    email_address: "ఇమెయిల్ చిరునామా",
    mobile_no: "మొబైల్ ఫోన్ నంబర్",
    operating_loc: "కార్యాచరణ ప్రదేశం / రాష్ట్రం",
    create_pwd: "పాస్‌వర్డ్ సృష్టించండి",
    create_acc_btn: "ఖాతాను సృష్టించండి",

    // Farmer Dashboard additions
    col_crop_name: "పంట పేరు",
    col_category: "విభాగం",
    col_price_rate: "ధర రేటు",
    col_stock_left: "మిగిలిన స్టాక్",
    no_active_listings: "క్రియాశీల పంటలు ఏవీ లేవు. కొత్త పంటను చేర్చండి!",
    delete_btn: "తొలగించు",
    col_order_id: "ఆర్డర్ ఐడి",
    col_crop_details: "పంట వివరాలు",
    col_purchased_qty: "కొనుగోలు పరిమాణం",
    col_revenue: "ఆదాయం",
    col_status: "స్థితి",
    no_sales_transacted: "ఇంకా ఎలాంటి అమ్మకాలు జరగలేదు. కొనుగోలుదారు ఆర్డర్ చేసినప్పుడు, అది ఇక్కడ కనిపిస్తుంది.",
    services_tracker_desc: "మీ కార్యకలాపాల కింద అద్దెకు తీసుకున్న భారీ ట్రాక్టర్లు, కూలీల బృందాలు మరియు సాంకేతిక సేవా నిపుణుల వివరాలు.",
    col_booking_id: "బుకింగ్ ఐడి",
    col_details: "వివరాలు",
    col_duration: "వ్యవధి",
    col_total_cost: "మొత్తం ఖర్చు",
    no_services_hired: "క్రియాశీల సేవలేవీ కనుగొనబడలేదు.",
    list_crop_title: "ప్రత్యక్ష విక్రయం కోసం పంటను చేర్చండి",
    field_crop_title: "పంట ప్రదర్శన శీర్షిక / పేరు",
    placeholder_crop_title: "సేంద్రీయ గోల్డెన్ శరబతి గోధుమలు",
    field_category: "విభాగం",
    field_certified_organic: "ధృవీకరించబడిన సేంద్రీయ",
    field_selling_rate: "ప్రత్యక్ష విక్రయ ధర (₹)",
    field_selling_unit: "విక్రయ ప్రమాణం",
    field_stock_available: "అమ్మకానికి అందుబాటులో ఉన్న స్టాక్",
    field_spec_desc: "ఉత్పత్తి లక్షణాలు & వివరణ",
    placeholder_spec_desc: "పంట నాణ్యత, తేమ శాతం, కోత కోసిన తేదీలు మరియు లోడింగ్ వివరాలను వివరించండి...",
    unit_kg: "ప్రతి కిలోగ్రాముకు (kg)",
    unit_quintal: "క్వింటాల్‌కు (100 kg)",
    unit_ton: "ప్రతి మెట్రిక్ టన్నుకు",
    unit_box: "ప్రతి బాక్సుకు",
    cancel_btn: "రద్దు చేయి",
    list_yield_btn: "పంటను చేర్చండి",
    machinery_leased: "అద్దెకు తీసుకున్న యంత్రాలు",

    // Buyer Dashboard additions
    browse_market: "పంటల మార్కెట్‌ను చూడండి",
    my_purchases: "నేను కొనుగోలు చేసిన పంటల ఆర్డర్లు",
    no_purchases_recorded: "కొనుగోలు చేసిన వివరాలు ఏవీ లేవు. పంటలను కొనుగోలు చేయడానికి మార్కెట్‌ను చూడండి!",
    rented_tractors_logs: "అద్దె ట్రాక్టర్ల వివరాలు",
    no_equipment_booked: "భారీ యంత్రాలు ఏవీ బుక్ చేయబడలేదు.",
    col_specialist_group: "నిపుణుడు / సమూహం",
    col_wages_paid: "చెల్లించిన కూలి",
    no_workers_booked: "కూలీలు లేదా మరమ్మతు నిపుణులు ఎవరూ బుక్ చేయబడలేదు.",

    // Additional marketplace visual translations
    crop_login_warning: "పంటలను కొనుగోలు చేయడానికి దయచేసి నమోదు చేసుకోండి లేదా లాగిన్ అవ్వండి.",
    crop_farmer_warning: "విక్రేతలుగా ఉన్న రైతులు పంటలను కొనుగోలు చేయలేరు. కొనుగోలు చేయడానికి కొనుగోలుదారు ఖాతాను నమోదు చేయండి.",
    enter_valid_qty: "దయచేసి సరైన పరిమాణాన్ని నమోదు చేయండి.",
    only_available: "మాత్రమే అందుబాటులో ఉంది.",
    success_ordered: "విజయవంతమైంది! ఆర్డర్ చేయబడింది",
    no_crops_found: "మీ శోధనకు సరిపోయే పంటలేవీ లేవు.",
    purchase_crop_directly: "పంటను నేరుగా కొనుగోలు చేయండి",
    grower: "రైతు",
    base_price: "ప్రాథమిక ధర",
    qty_to_buy: "కొనుగోలు పరిమాణం",
    total_amount_pay: "మొత్తం చెల్లించాల్సిన ధర",
    place_order: "ఆర్డర్ చేయండి",

    tractor_login_warning: "యంత్రాలను అద్దెకు తీసుకోవడానికి దయచేసి నమోదు చేసుకోండి లేదా లాగిన్ అవ్వండి.",
    enter_duration_date: "దయచేసి సరైన వ్యవధి మరియు ప్రారంభ తేదీని నమోదు చేయండి.",
    tractor_reserved: "ట్రాక్టర్ రిజర్వ్ చేయబడింది!",
    no_tractors_found: "మీ శోధనకు సరిపోయే ట్రాక్టర్లేవీ లేవు.",
    rent_machinery_booking: "యంత్రాల అద్దె బుకింగ్",
    rent_duration_type: "అద్దె వ్యవధి రకం",
    duration_qty: "వ్యవధి పరిమాణం",
    lease_start_date: "లీజు ప్రారంభ తేదీ",
    total_est_rent: "మొత్తం అంచనా అద్దె ధర",
    hourly_hire: "గంటల ప్రాతిపదికన అద్దె",
    daily_lease: "రోజువారీ లీజు",
    reserve_tractor: "ట్రాక్టర్ బుక్ చేయి",

    labor_login_warning: "కూలీలను బుక్ చేయడానికి దయచేసి నమోదు చేసుకోండి లేదా లాగిన్ అవ్వండి.",
    labor_crew_hired: "కూలీల బృందం బుక్ చేయబడింది!",
    no_labors_found: "మీ శోధనకు సరిపోయే కూలీల బృందాలు లేవు.",
    member_crew: "సభ్యుల బృందం",
    book_farm_labor: "కూలీల బృందాన్ని బుక్ చేయండి",
    daily_wage_rate: "రోజువారీ కూలి ధర",
    per_worker_group: "ప్రతి కూలీల బృందానికి",
    duration_booking_days: "బుకింగ్ వ్యవధి (రోజులు)",
    est_total_wages: "అంచనా మొత్తం కూలి",
    book_group_btn: "బృందాన్ని బుక్ చేయి",

    booking_login_warning: "సాంకేతిక నిపుణులను బుక్ చేయడానికి దయచేసి నమోదు చేసుకోండి లేదా లాగిన్ అవ్వండి.",
    no_providers_found: "మీ శోధనకు సరిపోయే వ్యవసాయ సేవా ప్రదాతలు ఎవరూ లేరు.",
    lead_provider: "ముఖ్య సేవా ప్రదాత",
    base_rate: "ప్రాథమిక ధర",
    visit_charge_suffix: "విజిట్ ఛార్జ్",
    duration_days_label: "అద్దె సేవా వ్యవధి (రోజులు)",
    work_start_date: "పని ప్రారంభ తేదీ",
    est_service_wages: "అంచనా సేవా కూలి",
    register_booking_btn: "బుకింగ్‌ను నమోదు చేయి",
    category_borewell_worker: "బోరుబావుల నిపుణుడు",
    category_motor_repairer: "మోటార్ రిపేర్ నిపుణుడు",
    category_tractor_mechanic: "ట్రాక్టర్ మెకానిక్",
    category_agro_tech: "వ్యవసాయ సాంకేతిక నిపుణుడు",
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [language, setLanguageState] = useState('en');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set Language Action
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('agromarket_language', lang);
  };

  // Translation helper function
  const t = (key) => {
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    if (translations['en'] && translations['en'][key] !== undefined) {
      return translations['en'][key];
    }
    return key;
  };

  // Notification alert system
  const showAlert = (type, message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  // Switch routing views
  const navigate = (viewId) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close sidebar on mobile if open
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  };

  // Toggle visual theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('agromarket_theme', nextTheme);
  };

  // Check active server session on load
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data) {
        setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync language
    const savedLang = localStorage.getItem('agromarket_language') || 'en';
    setLanguageState(savedLang);

    // Sync theme
    const savedTheme = localStorage.getItem('agromarket_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    checkSession();
  }, []);

  // Authentication: Login
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        showAlert('success', `Welcome back, ${data.user.username}!`);
        navigate(data.user.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
        return true;
      } else {
        showAlert('danger', data.message || 'Login failed.');
        return false;
      }
    } catch (err) {
      showAlert('danger', 'Server communication login failure.');
      return false;
    }
  };

  // Authentication: Register
  const register = async (username, email, phone, role, location, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username, email, phone, role, location, password })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        showAlert('success', `Welcome aboard, ${username}! Registration successful.`);
        navigate(role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
        return true;
      } else {
        showAlert('danger', data.message || 'Registration failed.');
        return false;
      }
    } catch (err) {
      showAlert('danger', 'Server communication registration failure.');
      return false;
    }
  };

  // Authentication: Logout
  const logout = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(null);
        showAlert('info', 'Logged out successfully.');
        navigate('landing');
      } else {
        showAlert('danger', 'Logout failed.');
      }
    } catch (err) {
      showAlert('danger', 'Logout communication error.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeView,
        theme,
        language,
        setLanguage,
        t,
        alerts,
        loading,
        showAlert,
        navigate,
        toggleTheme,
        login,
        register,
        logout,
        checkSession
      }}
    >
      {/* Dynamic Notifications Alert Panel */}
      <div className="custom-alert-container">
        {alerts.map((a) => (
          <div key={a.id} className={`custom-alert custom-alert-${a.type}`}>
            <i className={`fa-solid ${
              a.type === 'success' ? 'fa-circle-check' :
              a.type === 'danger' ? 'fa-circle-xmark' :
              a.type === 'info' ? 'fa-circle-info' : 'fa-circle-exclamation'
            }`}></i>
            <span>{a.message}</span>
          </div>
        ))}
      </div>
      
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
